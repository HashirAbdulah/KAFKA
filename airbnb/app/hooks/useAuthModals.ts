import { create } from "zustand";

interface AuthModalsState {
  isLoginModalOpen: boolean;
  isSignupModalOpen: boolean;
  isForgotPasswordModalOpen: boolean;
  openLoginModal: () => void;
  openSignupModal: () => void;
  openForgotPasswordModal: () => void;
  closeLoginModal: () => void;
  closeSignupModal: () => void;
  closeForgotPasswordModal: () => void;
  switchToSignup: () => void;
  switchToLogin: () => void;
}

const useAuthModals = create<AuthModalsState>((set) => ({
  isLoginModalOpen: false,
  isSignupModalOpen: false,
  isForgotPasswordModalOpen: false,

  openLoginModal: () =>
    set({
      isLoginModalOpen: true,
      isSignupModalOpen: false,
      isForgotPasswordModalOpen: false,
    }),
  openSignupModal: () =>
    set({
      isSignupModalOpen: true,
      isLoginModalOpen: false,
      isForgotPasswordModalOpen: false,
    }),
  openForgotPasswordModal: () =>
    set({
      isForgotPasswordModalOpen: true,
      isLoginModalOpen: false,
      isSignupModalOpen: false,
    }),

  closeLoginModal: () => set({ isLoginModalOpen: false }),
  closeSignupModal: () => set({ isSignupModalOpen: false }),
  closeForgotPasswordModal: () => set({ isForgotPasswordModalOpen: false }),

  switchToSignup: () =>
    set({ isSignupModalOpen: true, isLoginModalOpen: false }),
  switchToLogin: () =>
    set({ isLoginModalOpen: true, isSignupModalOpen: false }),
}));

export default useAuthModals;
