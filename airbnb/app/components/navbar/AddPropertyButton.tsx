"use client";
import useLoginModal from "@/app/hooks/useLoginModal";
import useAddPropertyModal from "@/app/hooks/useAddPropertyModal"; //hooks

interface AddPropertyButtonProps {
  userId?: string | null;
}

const AddPropertyButton: React.FC<AddPropertyButtonProps> = ({ userId }) => {
  const loginModal = useLoginModal();
  const addPropertyModal = useAddPropertyModal();
  const DaraYourHome = () => {
    if (userId) {
      addPropertyModal.open();
    } else {
      loginModal.open();
    }
  };
  return (
    <div
      onClick={DaraYourHome}
      className="cursor-pointer px-4 py-4 text-black rounded-full transition duration-300 ease-in-out transform hover:bg-purple-300 hover:scale-105"
    >
      Dara Your Home
    </div>
  );
};

export default AddPropertyButton;
