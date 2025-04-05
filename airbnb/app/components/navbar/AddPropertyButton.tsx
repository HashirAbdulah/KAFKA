"use client";
// import useLoginModal from "@/app/hooks/useLoginModal";
// import useAddPropertyModal from "@/app/hooks/useAddPropertyModal"; //hooks

interface AddPropertyButtonProps {
  userId?: string | null;
}

const AddPropertyButton: React.FC<AddPropertyButtonProps> = ({ userId }) => {
  // const loginModal = useLoginModal();
  // const addPropertyModal = useAddPropertyModal();
  const kafkaYourHome = () => {
    // if(userId){
    // addPropertyModal.open();
    // }else{
    //   loginModal.open();
    // }
  };
  return (
    <div
      onClick={kafkaYourHome}
      className="cursor-pointer p-2 text-m font-light rounded-full transition duration-300 ease-in-out transform hover:bg-gray-300  hover:scale-102">
      Kafka Your Home
    </div>
  );
};

export default AddPropertyButton;
