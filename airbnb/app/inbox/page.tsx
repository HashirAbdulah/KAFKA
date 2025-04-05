import Conversation from "@/app/components/inbox/Conversation";
const InboxPage = () => {
  return (
    <main className="max-w-screen-xl mx-auto px-6 mb-6 mt-4 space-y-4">
        <h1 className="my-6 text-2xl">Inbox</h1>


        <Conversation/>
        <Conversation/>
        <Conversation/>
    </main>
  )
}

export default InboxPage;
