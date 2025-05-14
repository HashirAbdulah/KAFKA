import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import LoginModal from "./components/modals/LoginModal";
import SignupModal from "./components/modals/SignupModal";
import AddPropertyModal from "./components/modals/AddPropertyModal";
import SearchModal from "./components/modals/SearchModal";
import EditPropertyModal from "./components/modals/EditPropertyModal";
import ErrorBoundary from "./components/ErrorBoundary";
import Notification from "./components/ui/Notification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DARA",
  description: "Ease of Access To Rental Your Property",
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <p>
      This is the content of the modal. You can put anything here like text,
      forms, images, etc.
    </p>
  );
  return (
    <html lang="en">
      <body
        cz-shortcut-listen="true"
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <ErrorBoundary>
          <Navbar />
          <div className="pt-28">{children}</div>

          <LoginModal />
          <SearchModal />
          <SignupModal />
          <AddPropertyModal />
          <EditPropertyModal />
          <Notification />
        </ErrorBoundary>
      </body>
    </html>
  );
}
