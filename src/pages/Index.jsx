import React, { useContext, useState, useEffect } from "react";
import { Box, Button, HStack, Text, Select, Textarea, useToast, VStack } from "@chakra-ui/react";
import { FaComments } from "react-icons/fa";
import { WebSocketContext } from "../main.jsx";

const API_BASE_URL = "https://backengine-bar8.fly.dev";

const Index = () => {
  const [email] = useState("john@example.com");
  const [isLoggedIn] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (ws) {
      ws.send(JSON.stringify({ type: "USER_ONLINE", email: email }));

      ws.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "USER_ONLINE":
            setActiveUsers((prevUsers) => [...prevUsers, data.email]);
            break;
          case "USER_OFFLINE":
            setActiveUsers((prevUsers) => prevUsers.filter((u) => u !== data.email));
            break;
          case "MESSAGE_RECEIVED":
            setChatMessages((prevMessages) => [...prevMessages, data.message]);
            break;
          default:
            console.log("Unrecognized message type:", data.type);
        }
      });

      return () => {
        ws.send(JSON.stringify({ type: "USER_OFFLINE", email: email }));
      };
    }
  }, [ws]);

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      const newMessage = {
        sender: email,
        receiver: selectedUser,
        content: messageInput,
      };
      socket.emit("sendMessage", newMessage);
      setMessageInput("");
    }
  };

  return (
    <Box p={4}>
      <Box>
        <HStack justify="space-between" mb={4}>
          <Text>Welcome, {email}</Text>
          <Select placeholder="Select User" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            {activeUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </Select>
        </HStack>
        {selectedUser && (
          <Box border="1px" borderColor="gray.200" p={4}>
            <VStack spacing={4} align="stretch">
              {chatMessages.map((message, index) => (
                <Box key={index} bg={message.sender === email ? "blue.100" : "gray.100"} p={2} borderRadius="md" alignSelf={message.sender === email ? "flex-end" : "flex-start"}>
                  <Text>{message.content}</Text>
                </Box>
              ))}
            </VStack>
            <HStack mt={4}>
              <Textarea value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type your message..." />
              <Button leftIcon={<FaComments />} onClick={handleSendMessage}>
                Send
              </Button>
            </HStack>
          </Box>
        )}
      </Box>
      )}
    </Box>
  );
};

export default Index;
