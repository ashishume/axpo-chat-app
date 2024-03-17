# Axpo Chat App

Axpo Chat App is a real-time messaging application built with [React](https://reactjs.org/) and [Socket.io](https://socket.io/). It allows users to create an account, log in, and chat with other users in real-time.

## Features

- **User Authentication**: Users can create an account or log in using their email and password.
- **Real-Time Messaging**: Users can send and receive messages in real-time.

## Technologies Used

- **Frontend**:
  - React: A JavaScript library for building user interfaces.
  - PostgresSQL Database: To store and sync data.
  - Material-UI: A popular React UI framework for building responsive and accessible UIs.
  - Nodejs + Express: A popular tech to use for backend powered by socket.io for web hooks

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/ashishume/axpo-chat-app.git
   ```
2. install backend dependencies
   ```bash
     cd backend && npm install
   ```
3. install frontend dependencies

   ```bash
     cd frontend-chat-app && npm install
   ```

4. Create a .env file inside frontend folder and add these environment variables

   ```bash
   VITE_BASE_API_URL= http://localhost:9000/api/v1
   VITE_BASE_URL= http://localhost:9000
   ```

5. Create a .env file inside backend folder add these environment variables
   ```bash
   DATABASE_URL=postgres://postgres:admin@localhost:5432/chat-app
   ```
6. Start the server on the root folder (outside of backend and frontend)
   ```bash
   npm start
   ```
   - Note: Server will start both the servers concurrently

https://github.com/ashishume/axpo-chat-app/assets/21136600/bf80a0bf-db90-4e31-9058-50921ac3598b
