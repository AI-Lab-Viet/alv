import { HANH_BE_WS_URL } from "@/consts/urls";
import { useAuth } from "@/contexts/auth-context";
import { useChatSession } from "@/contexts/chat-session-context";
import { Message, PromptStarterType } from "@/interfaces/chat.interface";
import { useEffect, useRef, useState } from "react";

enum MESSAGE_TYPE {
  CHAT = "chat",
  AUTH = "user_authenticated",
  STARTERS = "prompt_starters",
  OBJECTIVE_DONE = "objective",
}

const mockPromptStarters = [
  {
    prompt: "hé hé",
    title: "123",
  },
  {
    prompt: "hé hé",
    title: "123",
  },
  {
    prompt: "hé hé",
    title: "123",
  },
];

const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showPromptStarters, setShowPromptStarters] = useState<boolean>(false);
  const [promptStarters, setPromptStarters] =
    useState<PromptStarterType[]>(mockPromptStarters);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedObjective, setCompletedObjective] = useState<string>("");
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { userId } = useAuth();
  const { sessionId, missionId } = useChatSession();

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(`${HANH_BE_WS_URL}`);

      ws.onopen = () => {
        console.log("🟢 WebSocket đã kết nối!");
        setIsConnected(true);
        setError(null);
        console.log({
          sessionId,
          missionId,
        });
        ws.send(
          JSON.stringify({
            type: "chat",
            message: "init",
            user_id: userId,
            session_id: sessionId,
            mission_id: missionId,
          })
        );
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
          // if(response.type === "user_authenticated") {
          //   return;
          // }
          if (response.type === MESSAGE_TYPE.STARTERS) {
            setShowPromptStarters(true);
            setPromptStarters(response.prompts);
          }

          let message = response.response || response.message;
          if (!message) {
            return;
          }

          if (response.type === MESSAGE_TYPE.CHAT) {
            const newMessage: Message = {
              message: message,
              sender: "ai",
            };
            setMessages((prev) => [...prev, newMessage]);

            if (
              response.current_progress &&
              response.current_progress.trim() !== "Ý tưởng"
            ) {
              console.log(
                "response.current_progress",
                response.current_progress
              );
              setCompletedObjective(response.current_progress);
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          setError("Error parsing server response");
        }
      };

      setSocket(ws);
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setError("Failed to establish WebSocket connection");
    }
  };

  // (Re)connect whenever key identifiers change
  useEffect(() => {
    // If either identifier is missing, don't attempt connection
    if (!sessionId || !missionId) return;

    // Close any existing socket before creating a new one
    if (socket) {
      socket.close(1000);
    }

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close(1000); // Normal closure
      }
    };
  }, [sessionId, missionId]);

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
            user_input: message,
            user_id: userId,
            session_id: sessionId,
          })
        );
        if (showPromptStarters) {
          hidePromptStarters();
        }
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
  const hidePromptStarters = () => {
    setShowPromptStarters(false), setPromptStarters([]);
  };

  return {
    sendMessage,
    messages,
    setMessages,
    isConnected,
    error,
    clearError,
    reconnect,
    showPromptStarters,
    hidePromptStarters,
    promptStarters,
    completedObjective,
  };
};

export default useWebSocket;
