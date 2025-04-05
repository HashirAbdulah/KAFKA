'use client';
import CustomButton from "../forms/CustomButton";
const ConversationDetail = () => {
  return (
        <div>
            <div className="max-h-[400px] overflow-auto flex flex-col space-y-4">
                <div className="w-[80%] py-4 px-6 rounded-xl bg-gray-200">
                    <p className="font-bold text-gray-500">Jhon Doe</p>
                    <p>Messsage from user</p>
                </div>

                <div className="w-[80%] ml-[20%] py-4 px-6 rounded-xl bg-blue-200">
                    <p className="font-bold text-gray-500">Host Name</p>
                    <p>Messsage from host</p>
                </div>
            </div>

            <div className="mt-4 px-6 py-4 flex border border-gray-300 space-x-4 rounded-xl">
            <input
                type="text"
                placeholder="Enter Message"
                className="w-full p-2 rounded-xl bg-gray-200"
            />
            <CustomButton
                label="Send"
                onClick={() => console.log('clicked send')}
                className="w-[100px]"
                icon={
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                </svg>
                }
                />
            </div>


        </div>
  )
}

export default ConversationDetail;
