import React, { createContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

export const WebSocketContext = createContext(null);

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const theme = extendTheme({ colors });

const wsUrl = "wss://backengine-bar8.fly.dev";

const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const webSocket = new WebSocket(wsUrl);

    webSocket.onopen = (event) => {
      console.log("WebSocket connection established", event);
    };

    webSocket.onmessage = (event) => {
      console.log("Message from server ", event.data);
    };

    webSocket.onclose = (event) => {
      console.log("WebSocket connection closed", event);
    };

    setWs(webSocket);

    return () => {
      webSocket.close();
    };
  }, []);

  return <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
