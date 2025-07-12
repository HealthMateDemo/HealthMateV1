# HealthMate - A health platform powered by AI
A modern, AI-powered health chat application built with Next.js, featuring real-time messaging, persistent state management, and a beautiful user interface.

## Features

### 🎯 Core Functionality

- **Interactive Chat Interface**: Real-time messaging with AI health assistant
- **Persistent State**: Chat history and conversations saved in localStorage
- **WebSocket Integration**: Real-time communication for instant responses
- **Responsive Design**: Mobile-friendly interface with modern UI

### 💬 Chat Features

- **Conversation Management**: Create, save, and manage multiple conversations
- **Message History**: Persistent chat history across browser sessions
- **Real-time Typing Indicators**: Visual feedback when AI is responding
- **Message Categories**: Organize conversations by type and importance

### 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with emerald/teal theme
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Interactive Elements**: Hover effects, loading states, and micro-interactions
- **Accessibility**: Keyboard navigation and screen reader support

### 🔧 Technical Features

- **TypeScript**: Full type safety throughout the application
- **State Management**: React hooks with localStorage persistence
- **WebSocket Service**: Robust connection handling with auto-reconnect
- **Component Library**: Built with shadcn/ui components

## Project Structure

```
sundhed-demo/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main landing page with chat interface
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── theme-provider.tsx   # Theme configuration
├── lib/
│   ├── utils.ts             # Utility functions
│   └── websocket.ts         # WebSocket service
├── server/
│   └── websocket-server.js  # WebSocket server for development
├── hooks/
│   ├── use-mobile.tsx       # Mobile detection hook
│   └── use-toast.ts         # Toast notification hook
└── public/                  # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sundhed-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   # Run both Next.js and WebSocket server
   npm run dev:full

   # Or run them separately:
   npm run dev        # Next.js development server
   npm run websocket  # WebSocket server
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Starting a Chat Session

1. Click the "Start Your Wellness Journey" button on the landing page
2. The chat interface will appear with a left sidebar and main chat area
3. Type your health or wellness questions in the input field
4. Receive AI-powered responses with personalized guidance

### Managing Conversations

- **New Conversation**: Click the "New Conversation" button in the sidebar
- **Save Conversation**: Click the save icon in the chat header
- **Switch Conversations**: Click on any conversation in the sidebar
- **Search**: Use the search bar to find specific conversations

### Chat Features

- **Real-time Messaging**: Messages are sent and received instantly
- **Typing Indicators**: See when the AI is composing a response
- **Message History**: All conversations are automatically saved
- **Persistent State**: Refresh the page without losing your chat history

## WebSocket Integration

The application uses WebSocket for real-time communication:

### Client-Side (Frontend)

- **Connection Management**: Automatic connection and reconnection
- **Message Handling**: Process incoming messages and update UI
- **Error Handling**: Graceful error handling with user feedback

### Server-Side (Development)

- **Message Processing**: Handle incoming messages and generate responses
- **AI Simulation**: Simulate AI responses with contextual health advice
- **Connection Tracking**: Monitor connected clients

### Message Types

```typescript
interface WebSocketMessage {
  type: "message" | "typing" | "connected" | "error";
  content?: string;
  sender?: "user" | "ai";
  timestamp?: Date;
  conversationId?: string;
}
```

## State Management

The application uses React hooks with localStorage for persistence:

### Chat State

```typescript
interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  isSaved?: boolean;
}
```

### Persistence

- **localStorage**: Automatically saves chat state
- **Auto-recovery**: Restores conversations on page reload
- **Real-time Updates**: State updates immediately reflect in UI

## Customization

### Styling

- **Theme**: Modify colors in `tailwind.config.ts`
- **Components**: Customize shadcn/ui components in `components/ui/`
- **Animations**: Adjust Framer Motion animations in components

### WebSocket Server

- **Port**: Change WebSocket server port in `lib/websocket.ts`
- **Responses**: Modify AI response logic in `server/websocket-server.js`
- **Integration**: Connect to your own AI service for production

## Development

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run dev:full` - Start both Next.js and WebSocket servers
- `npm run websocket` - Start WebSocket server only
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding Features

1. **New Chat Features**: Extend the `Message` and `Conversation` interfaces
2. **UI Components**: Add new components in `components/ui/`
3. **WebSocket Events**: Add new message types and handlers
4. **State Management**: Add new state variables and persistence logic

## Production Deployment

### Environment Setup

1. **WebSocket Server**: Deploy to a server with WebSocket support
2. **Environment Variables**: Configure production WebSocket URL
3. **SSL**: Use WSS (WebSocket Secure) for production
4. **Scaling**: Consider using a WebSocket service like Socket.io or Pusher

### Build and Deploy

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

## OpenAI Integration Setup

To enable real ChatGPT voice processing, you need to configure your OpenAI API key:

### 1. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy the API key

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# OpenAI API Configuration
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# WebSocket Server (optional - for development)
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3001
```

### 3. Features Enabled with OpenAI

- **Real-time voice transcription** using OpenAI Whisper
- **Intelligent responses** using ChatGPT
- **Context-aware conversations** about health and wellness
- **Fallback to simulation** if API key is not configured

### 4. API Usage

- **Whisper API**: Transcribes voice to text
- **ChatGPT API**: Generates contextual responses
- **Cost**: ~$0.006 per minute of audio + $0.002 per 1K tokens

### 5. Security Notes

- Never commit your API key to version control
- Use environment variables for configuration
- Consider rate limiting for production use
