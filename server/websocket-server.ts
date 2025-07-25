import { WebSocket, WebSocketServer } from "ws";
import { getCommandResponse } from "../constants/commands";

interface WebSocketMessage {
  type: "message" | "typing" | "connected" | "error";
  content?: string;
  sender?: "user" | "ai";
  timestamp?: Date;
  conversationId?: string;
  template?: "global" | "health" | "mindfull";
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
      const aiResponse = generateAIResponse(message.content || "", message.template || "global");
      const aiMessage: WebSocketMessage = {
        type: "message",
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        conversationId: message.conversationId,
        template: message.template,
      };

      client.ws.send(JSON.stringify(aiMessage));
    }, 1500);
  }, 500);
}

function generateAIResponse(userMessage: string, template: "global" | "health" | "mindfull" = "global"): string {
  console.log(`Processing message: "${userMessage}" with template: "${template}"`);

  // Check if this is an image upload message
  if (userMessage.toLowerCase().includes("image uploaded for analysis")) {
    return `I've received your image and I'm analyzing it now. Here's what I can help you with:

1. **Image Analysis**
   • I can identify visible symptoms or conditions
   • Provide general health observations
   • Suggest when to consult a healthcare professional
   • Offer wellness recommendations based on what I see

2. **Important Note**
   • This analysis is for informational purposes only
   • Always consult with a qualified healthcare provider for medical advice
   • I cannot provide definitive diagnoses

3. **What I Can Help With**
   • General wellness observations
   • Lifestyle recommendations
   • Questions about visible symptoms
   • Guidance on when to seek professional help

Please let me know what specific questions you have about the image, and I'll do my best to provide helpful insights!`;
  }

  // First, check if this is a command request
  const commandResponse = getCommandResponse(userMessage, template);
  if (commandResponse) {
    console.log("Command detected, returning command response");
    return commandResponse;
  }

  console.log("No command detected, using regular response");

  // If not a command, provide template-specific responses
  const responses: { [key: string]: string[] } = {
    health: [
      `I understand you're asking about "${userMessage}". Let me provide you with some **health-focused** guidance based on your physical wellness needs.`,
      `Thank you for sharing that with me. Based on your message about "${userMessage}", here are some **evidence-based health recommendations**:`,
      `I hear you mentioning "${userMessage}". This is an important **health topic**. Let me share some insights that might help:`,
      `Regarding your question about "${userMessage}", I'd like to offer some **physical wellness guidance** that could be beneficial:`,
      `Your message about "${userMessage}" is important for your **health**. Here's what I can suggest based on current health guidelines:`,
    ],
    mindfull: [
      `I understand you're asking about "${userMessage}". Let me provide you with some **mental wellness guidance** to support your emotional well-being.`,
      `Thank you for sharing that with me. Based on your message about "${userMessage}", here are some **mindfulness-based recommendations**:`,
      `I hear you mentioning "${userMessage}". This is an important **mental health topic**. Let me share some insights that might help:`,
      `Regarding your question about "${userMessage}", I'd like to offer some **emotional wellness guidance** that could be beneficial:`,
      `Your message about "${userMessage}" is important for your **mental health**. Here's what I can suggest based on wellness practices:`,
    ],
    global: [
      `I understand you're asking about "${userMessage}". Let me provide you with some **holistic wellness guidance** to support your overall well-being.`,
      `Thank you for sharing that with me. Based on your message about "${userMessage}", here are some **comprehensive wellness recommendations**:`,
      `I hear you mentioning "${userMessage}". This is an important **wellness topic**. Let me share some insights that might help:`,
      `Regarding your question about "${userMessage}", I'd like to offer some **balanced wellness guidance** that could be beneficial:`,
      `Your message about "${userMessage}" is important for your **overall wellness**. Here's what I can suggest based on current guidelines:`,
    ],
  };

  const templateResponses = responses[template] || responses.global;
  const randomResponse = templateResponses[Math.floor(Math.random() * templateResponses.length)];

  // Add some specific advice based on keywords and template
  let additionalAdvice = "";
  const lowerMessage = userMessage.toLowerCase();

  if (template === "health") {
    if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia")) {
      additionalAdvice =
        "\n\nFor better **sleep**, try:\n• Establish a consistent bedtime routine\n• Avoid screens 1 hour before bed\n• Keep your bedroom cool and dark\n• Practice relaxation techniques";
    } else if (lowerMessage.includes("diet") || lowerMessage.includes("nutrition")) {
      additionalAdvice =
        "\n\nFor better **nutrition**:\n• Eat a variety of colorful fruits and vegetables\n• Stay hydrated with water\n• Limit processed foods\n• Consider consulting a nutritionist";
    } else if (lowerMessage.includes("exercise") || lowerMessage.includes("workout")) {
      additionalAdvice =
        "\n\nFor **physical wellness**:\n• Aim for 150 minutes of moderate exercise weekly\n• Include strength training 2-3 times per week\n• Find activities you enjoy\n• Start slowly and build up gradually";
    }
  } else if (template === "mindfull") {
    if (lowerMessage.includes("stress") || lowerMessage.includes("anxiety")) {
      additionalAdvice = "\n\nTo manage **stress**:\n• Practice deep breathing exercises\n• Regular physical activity\n• Mindfulness meditation\n• Maintain a balanced diet";
    } else if (lowerMessage.includes("meditation") || lowerMessage.includes("mindfulness")) {
      additionalAdvice = "\n\nFor **mindfulness practice**:\n• Start with 5-10 minutes daily\n• Focus on your breath\n• Practice mindful eating\n• Use guided meditation apps";
    } else if (lowerMessage.includes("emotion") || lowerMessage.includes("feeling")) {
      additionalAdvice =
        "\n\nFor **emotional wellness**:\n• Acknowledge your feelings without judgment\n• Practice self-compassion\n• Talk to trusted friends or family\n• Consider professional support if needed";
    }
  } else {
    // Global template - mix of both
    if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia")) {
      additionalAdvice =
        "\n\nFor better **sleep**, try:\n• Establish a consistent bedtime routine\n• Avoid screens 1 hour before bed\n• Keep your bedroom cool and dark\n• Practice relaxation techniques";
    } else if (lowerMessage.includes("stress") || lowerMessage.includes("anxiety")) {
      additionalAdvice = "\n\nTo manage **stress**:\n• Practice deep breathing exercises\n• Regular physical activity\n• Mindfulness meditation\n• Maintain a balanced diet";
    } else if (lowerMessage.includes("diet") || lowerMessage.includes("nutrition")) {
      additionalAdvice =
        "\n\nFor better **nutrition**:\n• Eat a variety of colorful fruits and vegetables\n• Stay hydrated with water\n• Limit processed foods\n• Consider consulting a nutritionist";
    } else if (lowerMessage.includes("exercise") || lowerMessage.includes("workout")) {
      additionalAdvice =
        "\n\nFor **physical wellness**:\n• Aim for 150 minutes of moderate exercise weekly\n• Include strength training 2-3 times per week\n• Find activities you enjoy\n• Start slowly and build up gradually";
    }
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
export { clients, generateAIResponse, wss };
export type { Client, WebSocketMessage };
