import { create } from "zustand";
import { PropertyType } from "../components/properties/PropertyList";

interface EditPropertyModalStore {
  isOpen: boolean;
  property: PropertyType | null;
  // Add onSuccess callback property
  onSuccess: (() => void) | null;
  open: (property: PropertyType) => void;
  close: () => void;
  // Add method to set the onSuccess callback
  setOnSuccess: (callback: (() => void) | null) => void;
}

const useEditPropertyModal = create<EditPropertyModalStore>((set) => ({
  isOpen: false,
  property: null,
  // Initialize onSuccess as null
  onSuccess: null,
  open: (property) => set({ isOpen: true, property }),
  close: () => set({ isOpen: false, property: null }),
  // Add method to set onSuccess callback
  setOnSuccess: (callback) => set({ onSuccess: callback }),
}));

export default useEditPropertyModal;
