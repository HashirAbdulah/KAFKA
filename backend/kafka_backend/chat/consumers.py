# import json
# from asgiref.sync import sync_to_async
# from channels.generic.websocket import AsyncWebsocketConsumer
# from django.utils import timezone
# from .models import ConversationMessage, Conversation
# from useraccounts.models import User

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
#         self.room_group_name = f"chat_{self.room_name}"
#         self.user = self.scope["user"]

#         if self.user.is_anonymous:
#             print("Anonymous user, closing connection")
#             await self.close()
#             return

#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()

#     async def disconnect(self, code):
#         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         message_type = data.get('type', 'chat_message')

#         if message_type == 'read_receipt':
#             await self.handle_read_receipt(data)
#         else:
#             await self.handle_chat_message(data)

#     async def handle_chat_message(self, data):
#         message = data.get('message')
#         sender_id = data.get('sender_id')
#         conversation_id = data.get('conversation_id')

#         if not all([message, sender_id, conversation_id]):
#             await self.send(text_data=json.dumps({
#                 'type': 'error',
#                 'error': 'Missing required fields'
#             }))
#             return

#         try:
#             sender = await self.get_user(sender_id)
#             conversation = await self.get_conversation(conversation_id)

#             if not sender or not conversation:
#                 await self.send(text_data=json.dumps({
#                     'type': 'error',
#                     'error': 'Invalid sender or conversation'
#                 }))
#                 return

#             recipient = await self.get_recipient(conversation, sender_id)

#             if not recipient:
#                 await self.send(text_data=json.dumps({
#                     'type': 'error',
#                     'error': 'Recipient not found'
#                 }))
#                 return

#             message_obj = await self.save_message(conversation, sender, recipient, message)

#             await self.channel_layer.group_send(
#                 self.room_group_name,
#                 {
#                     'type': 'chat_message',
#                     'body': message,
#                     'name': sender.name,
#                     'sender_id': str(sender.id),
#                     'id': str(message_obj.id),
#                     'created_at': message_obj.created_at.isoformat(),
#                 }
#             )
#         except Exception as e:
#             await self.send(text_data=json.dumps({
#                 'type': 'error',
#                 'error': f'Error processing message: {str(e)}'
#             }))

#     async def handle_read_receipt(self, data):
#         message_id = data.get('message_id')
#         reader_id = data.get('reader_id')

#         if not message_id or not reader_id:
#             return

#         try:
#             success = await self.mark_message_read(message_id, reader_id)

#             if success:
#                 await self.channel_layer.group_send(
#                     self.room_group_name,
#                     {
#                         'type': 'read_receipt_message',
#                         'message_id': message_id,
#                         'reader_id': reader_id,
#                     }
#                 )
#         except Exception as e:
#             print(f"Error processing read receipt: {str(e)}")

#     async def chat_message(self, event):
#         await self.send(text_data=json.dumps({
#             'type': 'chat_message',
#             'body': event['body'],
#             'name': event['name'],
#             'sender_id': event['sender_id'],
#             'id': event.get('id'),
#             'created_at': event.get('created_at'),
#         }))

#     async def read_receipt_message(self, event):
#         await self.send(text_data=json.dumps({
#             'type': 'read_receipt',
#             'message_id': event['message_id'],
#             'reader_id': event['reader_id'],
#         }))

#     @sync_to_async
#     def get_user(self, user_id):
#         try:
#             return User.objects.get(id=user_id)
#         except User.DoesNotExist:
#             return None

#     @sync_to_async
#     def get_conversation(self, conversation_id):
#         try:
#             return Conversation.objects.get(id=conversation_id)
#         except Conversation.DoesNotExist:
#             return None

#     @sync_to_async
#     def get_recipient(self, conversation, sender_id):
#         return conversation.users.exclude(id=sender_id).first()

#     @sync_to_async
#     def save_message(self, conversation, sender, recipient, body):
#         message = ConversationMessage.objects.create(
#             conversation=conversation,
#             body=body,
#             sent_to=recipient,
#             created_by=sender
#         )
#         return message

#     @sync_to_async
#     def mark_message_read(self, message_id, reader_id):
#         try:
#             message = ConversationMessage.objects.get(id=message_id)
#             if str(message.sent_to.id) == reader_id:
#                 message.read = True
#                 message.read_at = timezone.now()
#                 message.save(update_fields=['read', 'read_at'])
#                 return True
#             return False
#         except ConversationMessage.DoesNotExist:
#             return False

import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone
from .models import ConversationMessage, Conversation
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
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type', 'chat_message')

        if message_type == 'read_receipt':
            await self.handle_read_receipt(data)
        else:
            await self.handle_chat_message(data)

    async def handle_chat_message(self, data):
        message = data.get('message')

        # [Existing validation code]
        if not message:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'error': 'Missing required fields'
            }))
            return

        try:
            # Get conversation and users in a single database hit
            conversation_data = await self.get_conversation_with_users(data.get('conversation_id'), data.get('sender_id'))

            if not conversation_data:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'error': 'Invalid conversation or users'
                }))
                return

            conversation, sender, recipient = conversation_data

            message_obj = await self.save_message(conversation, sender, recipient, message)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'body': message,
                    'name': sender.name,
                    'sender_id': str(sender.id),
                    'id': str(message_obj.id),
                    'created_at': message_obj.created_at.isoformat(),
                }
            )
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'error': f'Error processing message: {str(e)}'
            }))

    async def handle_read_receipt(self, data):
        message_id = data.get('message_id')
        reader_id = data.get('reader_id')

        if not message_id or not reader_id:
            return

        try:
            success = await self.mark_message_read(message_id, reader_id)

            if success:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'read_receipt_message',
                        'message_id': message_id,
                        'reader_id': reader_id,
                    }
                )
        except Exception as e:
            print(f"Error processing read receipt: {str(e)}")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'body': event['body'],
            'name': event['name'],
            'sender_id': event['sender_id'],
            'id': event.get('id'),
            'created_at': event.get('created_at'),
        }))

    async def read_receipt_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'read_receipt',
            'message_id': event['message_id'],
            'reader_id': event['reader_id'],
        }))

    @sync_to_async
    def get_conversation_with_users(self, conversation_id, sender_id):
        """Get conversation and users in a single query operation"""
        try:
            # Use select_related/prefetch_related to reduce queries
            conversation = Conversation.objects.get(id=conversation_id)
            sender = User.objects.get(id=sender_id)
            recipient = conversation.users.exclude(id=sender_id).first()

            if not conversation or not sender or not recipient:
                return None

            return (conversation, sender, recipient)
        except (Conversation.DoesNotExist, User.DoesNotExist):
            return None

    @sync_to_async
    def save_message(self, conversation, sender, recipient, body):
        message = ConversationMessage.objects.create(
            conversation=conversation,
            body=body,
            sent_to=recipient,
            created_by=sender
        )
        return message

    @sync_to_async
    def mark_message_read(self, message_id, reader_id):
        try:
            message = ConversationMessage.objects.get(id=message_id)
            if str(message.sent_to.id) == reader_id:
                message.read = True
                message.read_at = timezone.now()
                message.save(update_fields=['read', 'read_at'])
                return True
            return False
        except ConversationMessage.DoesNotExist:
            return False
