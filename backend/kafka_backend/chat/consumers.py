import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone
from .models import ConversationMessage, Conversation, TypingStatus
from useraccounts.models import User


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        self.user = self.scope["user"]

        if self.user.is_anonymous:
            print("Anonymous user, closing connection")
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        # Update typing status to false when user disconnects
        await self.update_typing_status(False)
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get("type", "chat_message")

            handlers = {
                "chat_message": self.handle_chat_message,
                "read_receipt": self.handle_read_receipt,
                "typing_status": self.handle_typing_status,
                "edit_message": self.handle_edit_message,
                "delete_message": self.handle_delete_message,
            }

            handler = handlers.get(message_type)
            if handler:
                await handler(data)
            else:
                await self.send(
                    text_data=json.dumps(
                        {
                            "type": "error",
                            "error": f"Unknown message type: {message_type}",
                        }
                    )
                )
        except json.JSONDecodeError:
            await self.send(
                text_data=json.dumps({"type": "error", "error": "Invalid JSON format"})
            )
        except Exception as e:
            await self.send(
                text_data=json.dumps(
                    {"type": "error", "error": f"Error processing message: {str(e)}"}
                )
            )

    async def handle_chat_message(self, data):
        message = data.get("message")
        sender_id = data.get("sender_id")
        conversation_id = data.get("conversation_id")
        message_type = data.get("message_type", "text")
        media_url = data.get("media_url")
        file_name = data.get("file_name")
        file_size = data.get("file_size")
        reply_to_id = data.get("reply_to_id")

        if not all([message, sender_id, conversation_id]):
            await self.send(
                text_data=json.dumps(
                    {"type": "error", "error": "Missing required fields"}
                )
            )
            return

        try:
            sender = await self.get_user(sender_id)
            conversation = await self.get_conversation(conversation_id)

            if not sender or not conversation:
                await self.send(
                    text_data=json.dumps(
                        {"type": "error", "error": "Invalid sender or conversation"}
                    )
                )
                return

            recipient = await self.get_recipient(conversation, sender_id)
            if not recipient:
                await self.send(
                    text_data=json.dumps(
                        {"type": "error", "error": "Recipient not found"}
                    )
                )
                return

            reply_to = None
            if reply_to_id:
                reply_to = await self.get_message(reply_to_id)

            message_obj = await self.save_message(
                conversation=conversation,
                sender=sender,
                recipient=recipient,
                body=message,
                message_type=message_type,
                media_url=media_url,
                file_name=file_name,
                file_size=file_size,
                reply_to=reply_to,
            )

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": {
                        "id": str(message_obj.id),
                        "body": message,
                        "created_by": {
                            "id": str(sender.id),
                            "name": sender.name,
                            "profile_image": sender.profile_image_url(),
                        },
                        "created_at": message_obj.created_at.isoformat(),
                        "message_type": message_type,
                        "media_url": media_url,
                        "file_name": file_name,
                        "file_size": file_size,
                        "reply_to": {
                            "id": str(reply_to.id),
                            "body": reply_to.body,
                            "created_by": {
                                "id": str(reply_to.created_by.id),
                                "name": reply_to.created_by.name,
                                "profile_image": reply_to.created_by.profile_image_url(),
                            },
                        }
                        if reply_to
                        else None,
                    },
                },
            )
        except Exception as e:
            await self.send(
                text_data=json.dumps(
                    {"type": "error", "error": f"Error processing message: {str(e)}"}
                )
            )

    async def handle_read_receipt(self, data):
        message_id = data.get("message_id")
        reader_id = data.get("reader_id")

        if not message_id or not reader_id:
            return

        try:
            success = await self.mark_message_read(message_id, reader_id)
            if success:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "read_receipt",
                        "message_id": message_id,
                        "reader_id": reader_id,
                        "read_at": timezone.now().isoformat(),
                    },
                )
        except Exception as e:
            print(f"Error processing read receipt: {str(e)}")

    async def handle_typing_status(self, data):
        is_typing = data.get("is_typing", False)
        conversation_id = data.get("conversation_id")
        user_id = data.get("user_id")

        if not all([conversation_id, user_id]):
            return

        try:
            await self.update_typing_status(is_typing, conversation_id, user_id)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_status",
                    "user_id": user_id,
                    "is_typing": is_typing,
                    "conversation_id": conversation_id,
                },
            )
        except Exception as e:
            print(f"Error updating typing status: {str(e)}")

    async def handle_edit_message(self, data):
        message_id = data.get("message_id")
        new_body = data.get("new_body")
        user_id = data.get("user_id")

        if not all([message_id, new_body, user_id]):
            await self.send(
                text_data=json.dumps(
                    {
                        "type": "error",
                        "error": "Missing required fields for message edit",
                    }
                )
            )
            return

        try:
            success = await self.edit_message(message_id, new_body, user_id)
            if success:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "message_edited",
                        "message_id": message_id,
                        "new_body": new_body,
                        "edited_at": timezone.now().isoformat(),
                        "edited_by": user_id,
                    },
                )
        except Exception as e:
            await self.send(
                text_data=json.dumps(
                    {"type": "error", "error": f"Error editing message: {str(e)}"}
                )
            )

    async def handle_delete_message(self, data):
        message_id = data.get("message_id")
        user_id = data.get("user_id")

        if not all([message_id, user_id]):
            await self.send(
                text_data=json.dumps(
                    {
                        "type": "error",
                        "error": "Missing required fields for message deletion",
                    }
                )
            )
            return

        try:
            success = await self.delete_message(message_id, user_id)
            if success:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "message_deleted",
                        "message_id": message_id,
                        "deleted_by": user_id,
                        "deleted_at": timezone.now().isoformat(),
                    },
                )
        except Exception as e:
            await self.send(
                text_data=json.dumps(
                    {"type": "error", "error": f"Error deleting message: {str(e)}"}
                )
            )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps({"type": "chat_message", "message": event["message"]})
        )

    async def read_receipt(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "read_receipt",
                    "message_id": event["message_id"],
                    "reader_id": event["reader_id"],
                    "read_at": event["read_at"],
                }
            )
        )

    async def typing_status(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "typing_status",
                    "user_id": event["user_id"],
                    "is_typing": event["is_typing"],
                    "conversation_id": event["conversation_id"],
                }
            )
        )

    async def message_edited(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "message_edited",
                    "message_id": event["message_id"],
                    "new_body": event["new_body"],
                    "edited_at": event["edited_at"],
                    "edited_by": event["edited_by"],
                }
            )
        )

    async def message_deleted(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "message_deleted",
                    "message_id": event["message_id"],
                    "deleted_by": event["deleted_by"],
                    "deleted_at": event["deleted_at"],
                }
            )
        )

    @sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @sync_to_async
    def get_conversation(self, conversation_id):
        try:
            return Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return None

    @sync_to_async
    def get_message(self, message_id):
        try:
            return ConversationMessage.objects.get(id=message_id)
        except ConversationMessage.DoesNotExist:
            return None

    @sync_to_async
    def get_recipient(self, conversation, sender_id):
        return conversation.users.exclude(id=sender_id).first()

    @sync_to_async
    def save_message(
        self,
        conversation,
        sender,
        recipient,
        body,
        message_type="text",
        media_url=None,
        file_name=None,
        file_size=None,
        reply_to=None,
    ):
        message = ConversationMessage.objects.create(
            conversation=conversation,
            body=body,
            sent_to=recipient,
            created_by=sender,
            message_type=message_type,
            media_url=media_url,
            file_name=file_name,
            file_size=file_size,
            reply_to=reply_to,
        )
        return message

    @sync_to_async
    def mark_message_read(self, message_id, reader_id):
        try:
            message = ConversationMessage.objects.get(id=message_id)
            if str(message.sent_to.id) == reader_id:
                message.read = True
                message.read_at = timezone.now()
                message.save(update_fields=["read", "read_at"])
                return True
            return False
        except ConversationMessage.DoesNotExist:
            return False

    @sync_to_async
    def update_typing_status(self, is_typing, conversation_id=None, user_id=None):
        if not conversation_id or not user_id:
            # Handle disconnect case
            TypingStatus.objects.filter(user=self.user, is_typing=True).update(
                is_typing=False
            )
            return

        typing_status, _ = TypingStatus.objects.get_or_create(
            conversation_id=conversation_id,
            user_id=user_id,
            defaults={"is_typing": is_typing},
        )
        if typing_status.is_typing != is_typing:
            typing_status.is_typing = is_typing
            typing_status.save(update_fields=["is_typing", "last_updated"])

    @sync_to_async
    def edit_message(self, message_id, new_body, user_id):
        try:
            message = ConversationMessage.objects.get(id=message_id)
            if str(message.created_by.id) == user_id:
                message.body = new_body
                message.is_edited = True
                message.edited_at = timezone.now()
                message.save(update_fields=["body", "is_edited", "edited_at"])
                return True
            return False
        except ConversationMessage.DoesNotExist:
            return False

    @sync_to_async
    def delete_message(self, message_id, user_id):
        try:
            message = ConversationMessage.objects.get(id=message_id)
            if str(message.created_by.id) == user_id:
                message.delete()
                return True
            return False
        except ConversationMessage.DoesNotExist:
            return False
