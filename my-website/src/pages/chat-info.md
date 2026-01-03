# Book Assistant Chat Integration

This page provides information about the integrated chatbot frontend for the book content.

## Overview

The Book Assistant Chat is a RAG (Retrieval-Augmented Generation) chatbot that allows users to ask questions about the book content. The chat interface connects to a backend API that processes queries using embeddings and a language model.

## Features

- **Context-aware responses**: The chatbot understands and responds based on the book content
- **Session management**: Conversations are maintained across multiple queries
- **Source citations**: Responses include citations to relevant sections of the book
- **Real-time interaction**: Messages are displayed as they are received

## How to Use

1. Navigate to the `/chat` page using the "Chat" link in the navigation bar
2. The system will automatically create a new session
3. Type your question in the input field at the bottom
4. Press Enter or click "Send" to submit your query
5. The chatbot will process your question and provide a response with citations

## Technical Implementation

The frontend is built with React and integrated into the Docusaurus documentation site. It communicates with the backend API using HTTP requests:

- Session creation: `POST http://localhost:8000/api/v1/session`
- Query processing: `POST http://localhost:8000/api/v1/query`

## Integration with Book Content

In addition to the dedicated chat page, the chat functionality can be embedded in individual book pages using the `ChatWidget` component. This allows readers to ask questions about specific sections while they're reading.

## Backend Dependencies

The chatbot requires the following backend services to function:

- PostgreSQL database for storing sessions and query history
- Qdrant vector database for content embeddings
- Cohere API for natural language processing

## Running the Application

To run the full application with the chatbot:

1. Start the backend server:
   ```bash
   cd backend
   uvicorn src.api.main:app --reload --port 8000
   ```

2. In a separate terminal, start the frontend:
   ```bash
   cd my-website
   npm run start
   ```

The chatbot will be accessible at the `/chat` route of your Docusaurus site.