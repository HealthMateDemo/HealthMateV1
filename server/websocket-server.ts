import { WebSocketServer, WebSocket } from "ws";

interface WebSocketMessage {
  type: "message" | "typing" | "connected" | "error";
  content?: string;
  sender?: "user" | "ai";
  timestamp?: Date;
  conversationId?: string;
}

interface Client {
  ws: WebSocket;
  id: string;
  connectedAt: Date;
}

const wss = new WebSocketServer({ port: 3001 });

console.log("WebSocket server started on port 3001");

// Store connected clients
const clients = new Map<string, Client>();

wss.on("connection", (ws: WebSocket) => {
  const clientId = Date.now().toString();
  console.log(`New client connected: ${clientId}`);

  const client: Client = {
    ws,
    id: clientId,
    connectedAt: new Date(),
  };

  clients.set(clientId, client);

  // Send welcome message
  const welcomeMessage: WebSocketMessage = {
    type: "connected",
    content: "Connected to ZenHealth AI Chat Server",
    timestamp: new Date(),
  };

  ws.send(JSON.stringify(welcomeMessage));

  ws.on("message", (data: Buffer) => {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());
      console.log("Received message:", message);

      // Handle different message types
      switch (message.type) {
        case "message":
          handleChatMessage(client, message);
          break;

        default:
          console.log("Unknown message type:", message.type);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage: WebSocketMessage = {
        type: "error",
        content: "Error processing message",
        timestamp: new Date(),
      };
      ws.send(JSON.stringify(errorMessage));
    }
  });

  ws.on("close", () => {
    console.log(`Client disconnected: ${clientId}`);
    clients.delete(clientId);
  });

  ws.on("error", (error: Error) => {
    console.error(`WebSocket error for client ${clientId}:`, error);
    clients.delete(clientId);
  });
});

function handleChatMessage(client: Client, message: WebSocketMessage): void {
  // Simulate AI processing time
  setTimeout(() => {
    // Send typing indicator
    const typingMessage: WebSocketMessage = {
      type: "typing",
      timestamp: new Date(),
    };

    client.ws.send(JSON.stringify(typingMessage));

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(message.content || "");
      const aiMessage: WebSocketMessage = {
        type: "message",
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        conversationId: message.conversationId,
      };

      client.ws.send(JSON.stringify(aiMessage));
    }, 1500);
  }, 500);
}

function generateAIResponse(userMessage: string): string {
  const responses: string[] = [
    `I understand you're asking about "${userMessage}". Let me provide you with some helpful guidance based on your wellness needs.`,
    `Thank you for sharing that with me. Based on your message about "${userMessage}", here are some evidence-based recommendations:`,
    `I hear you mentioning "${userMessage}". This is an important health topic. Let me share some insights that might help:`,
    `Regarding your question about "${userMessage}", I'd like to offer some wellness guidance that could be beneficial:`,
    `Your message about "${userMessage}" is important. Here's what I can suggest based on current health guidelines:`,
  ];

  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];

  // Add some specific health advice based on keywords
  let additionalAdvice = "";
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia")) {
    additionalAdvice =
      "\n\nFor better sleep, try:\n• Establish a consistent bedtime routine\n• Avoid screens 1 hour before bed\n• Keep your bedroom cool and dark\n• Practice relaxation techniques";
  } else if (
    lowerMessage.includes("stress") ||
    lowerMessage.includes("anxiety")
  ) {
    additionalAdvice =
      "\n\nTo manage stress:\n• Practice deep breathing exercises\n• Regular physical activity\n• Mindfulness meditation\n• Maintain a balanced diet";
  } else if (
    lowerMessage.includes("diet") ||
    lowerMessage.includes("nutrition")
  ) {
    additionalAdvice =
      "\n\nFor better nutrition:\n• Eat a variety of colorful fruits and vegetables\n• Stay hydrated with water\n• Limit processed foods\n• Consider consulting a nutritionist";
  } else if (
    lowerMessage.includes("exercise") ||
    lowerMessage.includes("workout")
  ) {
    additionalAdvice =
      "\n\nFor physical wellness:\n• Aim for 150 minutes of moderate exercise weekly\n• Include strength training 2-3 times per week\n• Find activities you enjoy\n• Start slowly and build up gradually";
  }

  return randomResponse + additionalAdvice;
}

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down WebSocket server...");
  wss.close(() => {
    console.log("WebSocket server closed");
    process.exit(0);
  });
});

// Export for potential testing
export { wss, clients, generateAIResponse };
export type { WebSocketMessage, Client };
