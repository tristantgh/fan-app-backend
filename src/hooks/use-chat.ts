import { useState, useEffect, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import type { ChatMessage, ChatUser } from '@/lib/types';

const RECONNECT_TIMEOUT = 3000;

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<ChatUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debug state - can be removed later
  const [lastReceivedData, setLastReceivedData] = useState<string | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection
  const initializeSocket = useCallback(() => {
    // Clean up any existing socket
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    // Determine the appropriate WebSocket protocol
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    // Create new WebSocket connection
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    
    // Handle connection open
    socket.onopen = () => {
      setIsConnected(true);
      setError(null);
      
      // Clear any reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Send a join message to the server
      const username = localStorage.getItem('chatUsername') || `Fan_${nanoid(6)}`;
      socket.send(JSON.stringify({
        type: 'join',
        username
      }));
    };
    
    // Handle incoming messages
    socket.onmessage = (event) => {
      try {
        // Store raw message for debugging
        setLastReceivedData(event.data);
        console.log("WebSocket received:", event.data);
        
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'message':
            console.log("Received chat message:", data.message);
            setMessages(prev => [...prev, data.message]);
            break;
            
          case 'history':
            console.log("Received message history:", data.messages);
            setMessages(data.messages || []);
            break;
            
          case 'users':
            console.log("Received user list:", data.users);
            setConnectedUsers(data.users || []);
            break;
            
          case 'private_message':
            // Handle private messages from safety bot
            console.log("Received private message:", data.message);
            // Add a flag to the message so we can style it differently
            setMessages(prev => [...prev, {...data.message, isPrivate: true}]);
            break;
            
          default:
            console.warn('Unknown message type:', data.type);
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };
    
    // Handle connection close
    socket.onclose = (event) => {
      setIsConnected(false);
      
      // Don't try to reconnect if we closed the connection intentionally
      if (event.code !== 1000) {
        // Set a timeout to reconnect
        reconnectTimeoutRef.current = setTimeout(() => {
          initializeSocket();
        }, RECONNECT_TIMEOUT);
      }
    };
    
    // Handle errors
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error. Trying to reconnect...');
    };
    
    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);
  
  // Initialize WebSocket connection when the component mounts
  useEffect(() => {
    initializeSocket();
    
    // Ensure we clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [initializeSocket]);
  
  // Function to send a chat message
  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setError('Connection lost. Please wait while we reconnect...');
      return;
    }
    
    // Generate consistent username for this browser session
    if (!localStorage.getItem('chatUsername')) {
      localStorage.setItem('chatUsername', `Fan_${nanoid(6)}`);
    }
    const username = localStorage.getItem('chatUsername') || `Fan_${nanoid(6)}`;
    
    console.log(`Sending message as ${username}: ${content}`);
    
    // Add message to local state immediately for better UX
    const tempId = nanoid();
    const tempMessage: ChatMessage = {
      id: tempId,
      username: username,
      content: content,
      timestamp: new Date().toISOString(),
      isModerator: false
    };
    
    // Add to local messages right away
    setMessages(prev => [...prev, tempMessage]);
    
    // Send to server
    socketRef.current.send(JSON.stringify({
      type: 'message',
      message: {
        content,
        username
      }
    }));
  }, []);
  
  return {
    messages,
    connectedUsers,
    isConnected,
    error,
    sendMessage
  };
}
