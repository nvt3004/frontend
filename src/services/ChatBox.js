import React, { useEffect, useState } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { motion,useAnimation } from "framer-motion";
import {
  Avatar,
  ChatContainer,
  Message,
  MessageInput,
  MessageList,
  Sidebar,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConversationList, Conversation } from "@chatscope/chat-ui-kit-react";

const adminAvatar = require('../assets/images/logo.png');
const genAI = new GoogleGenerativeAI("AIzaSyCGK2SBPyN04ROSjH7vZ0OxvwCVseyH4Zc");
const model = genAI.getGenerativeModel({
  model: "tunedModels/your-Models",
});

const ChatBot = () => {

  const controls = useAnimation();

  const [taiKhoan, setTaiKhoan] = useState({});
  const [currentChat, setCurrentChat] = useState("Chatbot");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/thu nhỏ bubble

  // Lấy thông tin tài khoản từ sessionStorage
  useEffect(() => {
    const sessionTaiKhoan = JSON.parse(sessionStorage.getItem("sessionTaiKhoan"));
    setTaiKhoan(sessionTaiKhoan);
  }, []);

  const classifyQuestion = async (input) => {
    const prompt = `
      Please classify the following question as either "STATIC" or "DYNAMIC":
      Question: ${input}
    `;
    try {
      const result = await model.generateContent(prompt);
      const classification = result.response?.text()?.trim().toUpperCase();
      return classification || "STATIC"; // Mặc định là STATIC nếu không xác định được
    } catch (error) {
      console.error("Lỗi phân loại câu hỏi:", error);
      return "STATIC";
    }
  };

  const getBotResponse = async (input) => {
    setIsTyping(true);
    try {
      const label = await classifyQuestion(input);
      let responseMessage;

      if (label === "DYNAMIC") {
        responseMessage = "Đã truy vấn dữ liệu từ backend!";
      } else {
        const result = await model.generateContent(input);
        responseMessage = result.response?.text() || "Không thể tạo phản hồi!";
      }
      return responseMessage;
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      return "ChatBot gặp sự cố!";
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      sender: taiKhoan?.hoVaTen || "Người dùng",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      direction: "outgoing",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage("");

    if (currentChat === "Chatbot") {
      const botResponse = await getBotResponse(newMessage);
      const botMessage = {
        id: messages.length + 2,
        sender: "Chat Bot",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString(),
        direction: "incoming",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } else {
      const adminMessage = {
        id: messages.length + 2,
        sender: "Admin",
        text: "Admin sẽ phản hồi sớm nhất có thể!",
        timestamp: new Date().toLocaleTimeString(),
        direction: "incoming",
      };
      setMessages((prevMessages) => [...prevMessages, adminMessage]);
    }
  };

  const handleChatSelection = (chatOption) => {
    setCurrentChat(chatOption);
    setMessages([
      {
        id: 1,
        sender: chatOption === "Chatbot" ? "Chat Bot" : "Admin",
        text: chatOption === "Chatbot"
          ? "Xin chào, hãy đặt câu hỏi nếu bạn có thắc mắc nhé!"
          : "Chào bạn, Admin đã sẵn sàng hỗ trợ!",
        timestamp: new Date().toLocaleTimeString(),
        direction: "incoming",
      },
    ]);
  };

  return (
    <motion.div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
      }}
      initial={{ width: "60px", height: "60px", borderRadius: "50%" }}
      animate={{
        width: isOpen ? "600px" : "60px",
        height: isOpen ? "500px" : "60px",
        borderRadius: isOpen ? "16px" : "50%",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: isOpen ? "#fff" : "#067A38",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          position: "relative",
        }}
        onClick={() => setIsOpen(true)}
      >
        {!isOpen && (
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            💬
          </motion.div>
        )}
        {isOpen && (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#067A38",
                color: "#fff",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              <span>Chat Hỗ Trợ</span>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                onClick={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện lan lên div cha
                    setIsOpen(false);
                }}
              >
                ➖
              </button>
            </div>
            <div style={{ flex: 1, display: "flex" }}>
              <Sidebar style={{ width: "200px", borderRight: "1px solid #ddd" }}>
                <ConversationList>
                  <Conversation
                    name="Chat Bot"
                    info="Hỗ trợ AI"
                    onClick={() => handleChatSelection("Chatbot")}
                  >
                    <Avatar src="https://www.svgrepo.com/show/353774/geekbot.svg" name="Chat Bot" />
                  </Conversation>
                  <Conversation
                    name="Admin"
                    info="Hỗ trợ trực tiếp"
                    onClick={() => handleChatSelection("Admin")}
                  >
                    <Avatar src={adminAvatar} name="Admin" />
                  </Conversation>
                </ConversationList>
              </Sidebar>
              <ChatContainer style={{width:'400px'}}>
                <MessageList
                  typingIndicator={
                    isTyping && <TypingIndicator content="Bot đang soạn tin nhắn..." />
                  }
                >
                  {messages.map((msg) => (
                    <Message
                      key={msg.id}
                      model={{
                        message: msg.text,
                        sentTime: msg.timestamp,
                        sender: msg.sender,
                        direction: msg.direction,
                      }}
                    >
                      <Avatar
                        src={
                          msg.sender === "Chat Bot"
                            ? "https://www.svgrepo.com/show/353774/geekbot.svg"
                            : msg.sender === "Admin"
                            ? adminAvatar
                            : "https://www.svgrepo.com/show/341256/user-avatar-filled.svg"
                        }
                        name={msg.sender}
                      />
                    </Message>
                  ))}
                </MessageList>
                <MessageInput
                  value={newMessage}
                  onChange={setNewMessage}
                  onSend={handleSendMessage}
                  placeholder="Nhập tin nhắn..."
                />
              </ChatContainer>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBot;
