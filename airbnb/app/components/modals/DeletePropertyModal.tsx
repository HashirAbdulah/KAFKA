"use client";

import { useState } from "react";
import Modal from "./Modal";
import CustomButton from "../forms/CustomButton";
import { useRouter } from "next/navigation";
import apiService from "@/app/services/apiService";
import { useNotification } from "../ui/Notification";

interface DeletePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
   // Add onDelete callback prop
   onDelete?: () => void;
}

const DeletePropertyModal: React.FC<DeletePropertyModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
   // Add onDelete with default value to maintain backward compatibility
   onDelete = () => {},
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const showNotification = useNotification((state) => state.showNotification);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await apiService.delete(
        `/api/properties/${propertyId}/delete/`
      );

      if (response.success) {
        showNotification("Property deleted successfully", "success");
        router.refresh();
        router.push("/");
        onClose();
        // Call the onDelete callback when deletion is successful
        onDelete();
      } else {
        showNotification(
          response.error || "Failed to delete property",
          "error"
        );
      }
    } catch (error) {
      showNotification(
        "An error occurred while deleting the property",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const content = (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Delete Property</h3>
        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to delete "{propertyTitle}"? This action cannot
          be undone.
        </p>
      </div>
      <div className="flex justify-end space-x-4">
        <CustomButton
          label="Cancel"
          onClick={onClose}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        />
        <CustomButton
          label={isDeleting ? "Deleting..." : "Delete Property"}
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700"
        />
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      label="Delete Property"
      content={content}
    />
  );
};

export default DeletePropertyModal;
