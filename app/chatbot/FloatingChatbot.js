import React, { useState, useEffect, useRef } from 'react';
import { ChatBubble as MessageCircle, Close as X, Send, ExpandMore } from '@mui/icons-material';
import { Button, Card, CardHeader, CardContent, CardActions, TextField, IconButton, Typography, Box, Avatar, Fade } from '@mui/material';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...messages, userMessage]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.content || data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 16,
      right: 16,
      zIndex: isOpen ? 1000 : 0,  // Ensure the z-index is higher when open
      pointerEvents: isOpen ? 'auto' : 'none',  // Prevent blocking interactions when closed
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    }}>
      <Fade in={isOpen}>
        <Card sx={{
          width: 380,
          height: 600,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          backgroundColor: '#1e1e1e',
          mb: 2,
          zIndex: 1000,  // Ensure it's above other elements
        }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: '#1976d2' }}></Avatar>}
            title="VaccinityAI Assistant"
            subheader="How can I help you today?"
            action={
              <IconButton onClick={toggleChat}>
                <X sx={{ color: 'white' }} />
              </IconButton>
            }
            sx={{
              bgcolor: '#333',
              color: 'white',
              borderBottom: '1px solid #444'
            }}
          />
          <CardContent sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            bgcolor: '#2e2e2e',
            color: 'white'
          }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}>
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: '70%',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: msg.role === 'user' ? '#1976d2' : '#3a3a3a',
                    color: 'white',
                    boxShadow: 1
                  }}
                >
                  {msg.content}
                </Typography>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'white' }}>
                  AI is thinking...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardActions sx={{ p: 2, bgcolor: '#333', borderTop: '1px solid #444' }}>
            <TextField
              fullWidth
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              variant="outlined"
              InputProps={{
                sx: { color: 'white' }
              }}
              sx={{
                mr: 1,
                bgcolor: '#444',
                borderRadius: 1,
                input: { color: 'white' }
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={isLoading}
              sx={{
                bgcolor: '#1976d2',
                color: 'white',
                '&:hover': { bgcolor: '#1565c0' }
              }}
            >
              <Send />
            </IconButton>
          </CardActions>
        </Card>
      </Fade>
      <Button
        onClick={toggleChat}
        variant="contained"
        sx={{
          minWidth: 'auto',
          width: 64,
          height: 64,
          borderRadius: '50%',
          boxShadow: 3,
          bgcolor: isOpen ? '#1976d2' : '#1976d2',
          pointerEvents: 'auto',  
          '&:hover': {
            bgcolor: '#1565c0',
            transform: 'scale(1.1)',
            transition: 'all 0.3s'
          }
        }}
      >
        {isOpen ? <ExpandMore sx={{ color: 'white' }} /> : <MessageCircle sx={{ color: 'white' }} />}
      </Button>
    </Box>
  );
};

export default FloatingChatbot;
