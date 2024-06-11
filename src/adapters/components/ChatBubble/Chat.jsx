import { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { sendMessage } from "./openaiService";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hola, ¡Soy un ChatBot, pregunta lo que quieras!",
      sentTime: "just now",
      sender: "Bot",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSendRequest = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await sendMessage(message);
      const botResponse = {
        message: response || "No response received",
        sender: "Bot",
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage = {
        message: `Error: ${error.message}`,
        sender: "system",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div>
      <div className="relative">
        <button
          className="z-20 text-white flex flex-col shrink-0 grow-0 justify-around 
                      fixed bottom-0 right-5 rounded-lg
                      mr-1 mb-5 lg:mr-5 lg:mb-5 xl:mr-10 xl:mb-10"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <div className="p-3 rounded-full border-4 border-white bg-yellow-600">
            <svg
              className="w-10 h-10 lg:w-12 lg:h-12 xl:w-13 xl:h-13"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </button>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-40 right-14 bg-white rounded-lg shadow-lg w-96 h-128">
          <div className="flex flex-col h-full">
            <MainContainer>
              <ChatContainer style={{ height: "700px", overflowY: "auto" }}>
                <MessageList
                  scrollBehavior="smooth"
                  typingIndicator={
                    isTyping ? (
                      <TypingIndicator content="Bot esta escribiendo" />
                    ) : null
                  }
                >
                  {messages.map((message, i) => {
                    return <Message key={i} model={message} />;
                  })}
                </MessageList>
                <MessageInput
                  placeholder="Enviar mensaje"
                  onSend={handleSendRequest}
                />
              </ChatContainer>
            </MainContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
