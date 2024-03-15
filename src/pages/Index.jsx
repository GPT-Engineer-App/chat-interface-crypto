import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Input, VStack, HStack, Text, Select, Textarea, useToast } from "@chakra-ui/react";
import { FaUser, FaLock, FaSignInAlt, FaUserPlus, FaComments } from "react-icons/fa";

const API_BASE_URL = "https://backengine-bar8.fly.dev";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const toast = useToast();

  useEffect(() => {
    // Simulating fetching active users
    const users = ["John", "Jane", "Alice", "Bob"];
    setActiveUsers(users);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Login Failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast({
          title: "Signup Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Signup Failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      const newMessage = {
        sender: email,
        receiver: selectedUser,
        content: messageInput,
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessageInput("");
    }
  };

  return (
    <Box p={4}>
      {!isLoggedIn ? (
        <VStack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <HStack>
            <Button leftIcon={<FaSignInAlt />} onClick={handleLogin}>
              Login
            </Button>
            <Button leftIcon={<FaUserPlus />} onClick={handleSignup}>
              Signup
            </Button>
          </HStack>
        </VStack>
      ) : (
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
