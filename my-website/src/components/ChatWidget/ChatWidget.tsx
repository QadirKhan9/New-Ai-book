/**
 * ChatWidget Component
 *
 * This component implements a floating chat widget that does not interfere with the main book layout.
 * It appears as a circular button at the bottom-right of the screen and opens a popup when clicked.
 */
import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWidget.module.css';

const ChatWidget = ({ selectedText = null, onProcessed }: { selectedText?: string | null, onProcessed?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your book assistant. Feel free to ask me questions about the book content.", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null); // Track user authentication status
  const messagesEndRef = useRef(null);
  const hasSentSelectedText = useRef(false); // Track if we've already sent the selected text

  // Store the original selected text to compare later
  const originalSelectedText = useRef<string | null>(null);

  // Check authentication status and backend connectivity on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      // Check if user is authenticated by looking for token in localStorage
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // In a real implementation, we would decode the JWT to get user info
          // For now, we'll just set a flag indicating the user is logged in
          setUser({ isAuthenticated: true });
        } catch (error) {
          console.error('Error decoding token:', error);
          setUser(null);
        }
      }
    };

    // Check if backend is accessible
    const checkBackendStatus = async () => {
      try {
        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const healthUrl = `${backendUrl}/api/v1/health`;
        console.log('Checking backend health at:', healthUrl);
        const response = await fetch(healthUrl);
        if (!response.ok) {
          // Add a message to inform the user about backend status
          const statusMessage = {
            id: Date.now(),
            text: `Note: Backend server is not responding. Please make sure it's running on ${backendUrl}. ` +
                  "To start the backend server:\n1. Navigate to the backend directory\n2. Run: `uvicorn src.api.main:app --reload --port 8000`",
            sender: 'bot'
          };
          setMessages(prev => [...prev, statusMessage]);
        }
      } catch (error) {
        // Add a message to inform the user about backend status
        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        console.log('Error checking backend health:', error);
        const statusMessage = {
          id: Date.now(),
          text: `Note: Could not connect to backend server. Please make sure it's running on ${backendUrl}. ` +
                "To start the backend server:\n1. Navigate to the backend directory\n2. Run: `uvicorn src.api.main:app --reload --port 8000`",
          sender: 'bot'
        };
        setMessages(prev => [...prev, statusMessage]);
      }
    };

    checkAuthStatus();
    checkBackendStatus(); // Check backend status when component mounts

    // If selectedText is provided and we haven't sent it yet, open the chat widget and send the message
    if (selectedText && !hasSentSelectedText.current) {
      // Update the input value with the selected text
      setInputValue(selectedText);

      // Store the original selected text for comparison later
      originalSelectedText.current = selectedText;

      // Mark that we're about to send the selected text
      hasSentSelectedText.current = true;

      // Use a small delay to ensure the state is updated before opening and sending
      setTimeout(() => {
        setIsOpen(true);
        setTimeout(() => {
          sendMessage(true); // Mark this as initial selected text
        }, 50); // Small additional delay to ensure UI is ready
      }, 50);
    } else if (!selectedText) {
      // If selectedText is cleared, reset the flag
      hasSentSelectedText.current = false;
      originalSelectedText.current = null;
    }
  }, [selectedText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (isInitialSelectedText = false) => {
    // Use the current inputValue, or if it's empty but we have selected text, use that
    const messageToSend = inputValue.trim();
    if (!messageToSend || isLoading) return;

    const userMessage = { id: Date.now(), text: messageToSend, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue(''); // Clear the input after sending
    setIsLoading(true);

    try {
      // Determine which endpoint to use based on whether this is initial selected text
      // Use environment variable or default to localhost:8000
      const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const isSelectQuery = isInitialSelectedText && messageToSend === originalSelectedText.current;
      const endpoint = isSelectQuery ? `${backendUrl}/api/v1/select-query` : `${backendUrl}/api/v1/query`;

      // Prepare the request body based on the endpoint
      const requestBody = isSelectQuery
        ? {
            selected_text: messageToSend, // For select-query, the message is the selected text
            query_text: `Explain this text: ${messageToSend}`, // Default query for selected text
            session_id: localStorage.getItem('session_id') || null
          }
        : {
            query_text: messageToSend,
            session_id: localStorage.getItem('session_id') || null,
            selected_text: null, // Not a selected text query
            user_id: user ? JSON.parse(localStorage.getItem('user') || '{}').id : null
          };

      // Log the endpoint for debugging
      console.log('Making request to endpoint:', endpoint);
      console.log('Backend URL:', process.env.REACT_APP_API_URL || 'http://localhost:8000');
      console.log('Full endpoint URL:', endpoint);

      // Call the backend API to get a RAG-enhanced response
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Handle response based on endpoint
      let answer = data.answer || "I processed your query but couldn't generate a response. Please try asking in a different way.";
      let sessionId = data.session_id;

      // For select-query endpoint, the response structure might be different
      if (data.context_relevance !== undefined) {
        // This is a response from the select-query endpoint
        answer = data.answer;
        sessionId = data.session_id;
      }

      // Enhance the response with user-specific information if authenticated
      let enhancedResponse = answer;
      if (user && answer) {
        enhancedResponse = `${answer} As a logged-in user, I can provide more personalized responses based on your profile.`;
      } else if (!user && answer) {
        enhancedResponse = `${answer} Sign in to get personalized responses based on your profile.`;
      }

      const botMessage = {
        id: Date.now() + 1,
        text: enhancedResponse,
        sender: 'bot'
      };

      // Update session ID in localStorage if returned by the API
      if (sessionId) {
        localStorage.setItem('session_id', sessionId);
      }

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Check if the error is related to network connectivity
      let isNetworkError = false;
      if (error instanceof Error) {
        isNetworkError = error.message.includes('fetch') ||
                        error.message.includes('Failed to fetch') ||
                        error.message.includes('NetworkError') ||
                        error.message.includes('ECONNREFUSED') ||
                        error.message.includes('TypeError') || // Often network-related
                        error.message.includes('500') || // Server error
                        error.message.includes('502') || // Bad gateway
                        error.message.includes('503') || // Service unavailable
                        error.message.includes('504'); // Gateway timeout
      }

      if (isNetworkError) {
        // Provide a simulated response when backend is not available
        const simulatedResponse = generateSimulatedResponse(messageToSend);
        const simulatedMessage = {
          id: Date.now() + 1,
          text: simulatedResponse,
          sender: 'bot'
        };
        setMessages(prev => [...prev, simulatedMessage]);
      } else {
        // Handle other errors (like authentication) with appropriate messages
        let errorMessageText = "I'm having trouble connecting to the book knowledge base right now. ";

        if (error instanceof Error) {
          if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            errorMessageText = "Authentication required. Please sign in to use the chatbot feature.";
          } else if (error.message.includes('403')) {
            errorMessageText = "Access denied. Please check your permissions.";
          } else {
            errorMessageText += `Error details: ${error.message}`;
          }
        } else {
          errorMessageText += "An unexpected error occurred.";
        }

        const errorMessage = {
          id: Date.now() + 1,
          text: errorMessageText,
          sender: 'bot'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      // Call onProcessed to reset the selected text in the parent after sending
      // Only do this if we sent the initial selected text (not a manually entered message)
      if (isInitialSelectedText && onProcessed) {
        onProcessed();
        // Reset the flag after processing
        hasSentSelectedText.current = false;
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(false); // Not initial selected text
    }
  };

  // Function to generate simulated responses when backend is not available
  const generateSimulatedResponse = (query: string): string => {
    const queryLower = query.toLowerCase();

    // Handle greetings
    if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
      return "Hello! I'm your book assistant. I'm currently unable to access the book knowledge base, but I'm here to help. Please make sure the backend server is running on http://localhost:8000. To start the backend server:\n1. Navigate to the backend directory\n2. Run: `uvicorn src.api.main:app --reload --port 8000`";
    }

    // Handle questions about authentication
    if (queryLower.includes('auth') || queryLower.includes('login') || queryLower.includes('sign')) {
      return "Regarding authentication, the book covers various authentication methods including OAuth, JWT, and session management. For implementing user authentication in React applications, the book recommends using libraries like Auth0, Firebase Auth, or custom solutions with secure token handling. When the backend is running, I can provide more specific details from the book.";
    }

    // Handle questions about the book topic
    if (queryLower.includes('robot') || queryLower.includes('ai') || queryLower.includes('humanoid')) {
      return "The book 'Physical AI & Humanoid Robotics' covers comprehensive topics on building intelligent humanoid robots. It discusses hardware and software architectures, machine learning applications in robotics, and the integration of AI with physical systems. When the backend is running, I can provide specific details and citations from the book content.";
    }

    // Handle questions about backend/technical topics
    if (queryLower.includes('backend') || queryLower.includes('api') || queryLower.includes('server')) {
      return "The backend architecture discussed in the book emphasizes scalable and secure API design. It covers topics like RESTful services, GraphQL, database integration, and microservice patterns. The backend for this book includes a RAG (Retrieval-Augmented Generation) system that connects to a vector database to provide accurate answers. When the backend is running, I can provide more detailed information from the book.";
    }

    // Default response for other queries
    return `I've received your query about "${query}", but I'm currently unable to access the book knowledge base. Please make sure the backend server is running on http://localhost:8000. To start the backend server:\n1. Navigate to the backend directory\n2. Run: \`uvicorn src.api.main:app --reload --port 8000\`\n\nWhen the backend is running, I'll be able to search the book's content to provide you with detailed, contextual answers.`;
  };

  return (
    <div className={styles.chatWidget}>
      {isOpen ? (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h3>Book Assistant</h3>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>
          <div className={styles.chatMessages}>
            {messages.map((message) => (
              <div key={message.id} className={`${styles.message} ${styles[`${message.sender}Message`]}`}>
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.typingIndicator}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.chatInputArea}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the book content..."
              rows={2}
              className={styles.chatInput}
            />
            <button
              onClick={() => sendMessage(false)} // Not initial selected text
              disabled={isLoading || !inputValue.trim()}
              className={styles.sendButton}
            >
              →
            </button>
          </div>
        </div>
      ) : (
        <button className={styles.chatToggle} onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}
    </div>
  );
};

export default ChatWidget;