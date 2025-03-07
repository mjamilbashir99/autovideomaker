"use client";
import { signOut } from "next-auth/react";

const SignOutButton = () => {
  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded ml-auto"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
