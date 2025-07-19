export interface WebSocketMessage {
  type: "message" | "typing" | "connected" | "error";
  content?: string;
  sender?: "user" | "ai";
  timestamp?: Date;
  conversationId?: string;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];
  private isConnected = false;

  constructor(private url: string = "ws://localhost:3001") {}

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      // Already connected or connecting
      return;
    }
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyHandlers({
          type: "connected",
          timestamp: new Date(),
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.notifyHandlers(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.isConnected = false;
        this.attemptReconnect();
      };

      this.ws.onerror = () => {
        console.error("WebSocket error occurred");
        this.notifyHandlers({
          type: "error",
          content: "Connection error occurred",
        });
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error("Max reconnection attempts reached");
      this.notifyHandlers({
        type: "error",
        content: "Unable to establish connection after multiple attempts",
      });
    }
  }

  sendMessage(message: Omit<WebSocketMessage, "timestamp">) {
    if (this.ws && this.isConnected) {
      const fullMessage: WebSocketMessage = {
        ...message,
        timestamp: new Date(),
      };
      this.ws.send(JSON.stringify(fullMessage));
    } else {
      console.warn("WebSocket not connected, message not sent");
      // Simulate AI response for development
      setTimeout(() => {
        this.notifyHandlers({
          type: "message",
          content: `I received your message: "${message.content}". This is a simulated response while WebSocket is not connected.`,
          sender: "ai",
          timestamp: new Date(),
          conversationId: message.conversationId,
        });
      }, 1000);
    }
  }

  onMessage(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
    // Return an unsubscribe function
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  private notifyHandlers(message: WebSocketMessage) {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService();
