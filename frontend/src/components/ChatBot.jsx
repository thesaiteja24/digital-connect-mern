import React from "react";

const ChatBot = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-lg h-[600px]">
        <iframe
          width="100%"
          height="100%"
          allow="microphone;"
          src="https://console.dialogflow.com/api-client/demo/embedded/043c4eef-827d-4273-a8c7-b5ee76df63e9"
          title="Dialogflow Chatbot"
          style={{
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        ></iframe>
      </div>
    </div>
  );
};

export default ChatBot;
