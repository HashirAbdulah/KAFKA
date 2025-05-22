"use client";
import useAuthModals from "@/app/hooks/useAuthModals";
import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";

interface AddPropertyButtonProps {
  userId?: string | null;
}

const AddPropertyButton: React.FC<AddPropertyButtonProps> = ({ userId }) => {
  const { openLoginModal } = useAuthModals();
  const addPropertyModal = useAddPropertyModal();

  const DaraYourHome = () => {
    if (userId) {
      addPropertyModal.open();
    } else {
      openLoginModal();
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
