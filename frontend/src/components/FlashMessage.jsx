import React from "react";

// FlashMessage Component
const FlashMessage = ({ message, type, show }) => {
  // If the message is not to be shown, return null
  if (!show) return null;

  // Tailwind styles based on the flash type
  const flashStyles = {
    success: "",
    danger: "",
    warning: "",
  };

  return (
    <div  className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg w-72 text-center ${flashStyles[type]} border-black border-2`}>
      {message}
    </div>
  );
};

export default FlashMessage;