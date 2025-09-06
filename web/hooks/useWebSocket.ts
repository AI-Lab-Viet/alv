import { HANH_BACKEND_URL, HANH_BE_WS_URL } from "@/consts/urls";
import { Message } from "@/interfaces/chat.interface";
import { useState, useEffect, useRef } from "react";

const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string>();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(`${HANH_BE_WS_URL}`);

      ws.onopen = () => {
        console.log("🟢 WebSocket đã kết nối!");
        setIsConnected(true);
        setError(null);
      };

      ws.onclose = (event) => {
        console.log(
          `🔴 WebSocket mất kết nối! Code: ${event.code}, Reason: ${event.reason}`
        );
        setIsConnected(false);

        // Auto-reconnect after 3 seconds unless it was a manual close
        if (event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("🔄 Attempting to reconnect WebSocket...");
            connectWebSocket();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error("⚠️ WebSocket error:", error);
        setError("WebSocket connection error");
        setIsConnected(false);
      };

      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          console.log(response);
          const newMessage: Message = {
            message: response.response || response.message || "No response",
            sender: "ai",
          };
          setMessages((prev) => [...prev, newMessage]);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          setError("Error parsing server response");
        }
      };

      setSocket(ws);
      setUserId(localStorage.getItem("accessToken") || "abcxyz123");
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setError("Failed to establish WebSocket connection");
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close(1000); // Normal closure
      }
    };
  }, []);

  function sendMessage(message: string) {
    if (!message.trim()) {
      console.warn("⚠️ Cannot send empty message");
      return;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        const chatMessage: Message = {
          sender: "user",
          message: message,
        };

        socket.send(
          JSON.stringify({
            type: "chat",
            message: message,
            user_id: userId,
          })
        );
        setMessages((prev) => [...prev, chatMessage]);
        setError(null);
      } catch (error) {
        console.error("Error sending message:", error);
        setError("Failed to send message");
      }
    } else {
      console.warn(
        "⚠️ WebSocket not ready! Connection state:",
        socket?.readyState
      );
      setError("WebSocket connection not ready");
    }
  }

  const clearError = () => setError(null);

  const reconnect = () => {
    if (socket) {
      socket.close();
    }
    connectWebSocket();
  };

  return {
    sendMessage,
    messages,
    setMessages,
    isConnected,
    error,
    clearError,
    reconnect,
  };
};

export default useWebSocket;
