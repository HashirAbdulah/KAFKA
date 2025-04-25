import { create } from "zustand";
import { PropertyType } from "../components/properties/PropertyList";

interface EditPropertyModalStore {
  isOpen: boolean;
  property: PropertyType | null;
  open: (property: PropertyType) => void;
  close: () => void;
}

const useEditPropertyModal = create<EditPropertyModalStore>((set) => ({
  isOpen: false,
  property: null,
  open: (property) => set({ isOpen: true, property }),
  close: () => set({ isOpen: false, property: null }),
}));

export default useEditPropertyModal;
