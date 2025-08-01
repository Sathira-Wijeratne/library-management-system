# Library Management System

A simple CRUD application for managing a library's book collection. This application provides functionality to add, view, edit, and delete books from a library database, along with user authentication features.

## Technology Stack

### Backend
- ASP.NET Core 8.0
- Entity Framework Core
- SQLite Database
- JWT Bearer Authentication
- BCrypt for password hashing

### Frontend
- React 18
- TypeScript
- Vite
- React Router DOM
- Material-UI

## Features

- User registration and authentication
- JWT token-based authorization
- CRUD operations for book management
- Responsive design for mobile and desktop
- Global exception handling
- Input validation

## Prerequisites

Before running this application, ensure you have:

- .NET 8.0 SDK
- Node.js (v23.6.0)
- npm package manager

## Running the Application

You can run this application using either Visual Studio Code or Visual Studio.

### Option 1: Using Visual Studio Code

1. **Install Required Extensions**
   - C# Dev Kit extension (for C# development support)
   - Ensure you have the .NET 8.0 SDK installed

2. **Clone and Setup**
   ```
   git clone https://github.com/Sathira-Wijeratne/library-management-system.git
   cd library-management-system
   ```

3. **Backend Setup**
   - Open the project in VS Code
   - Navigate to the `library-management-system.Server` directory
   - The database will be created automatically when you first run the application

4. **Frontend Setup**
   ```
   cd library-management-system.client
   npm install
   ```

5. **Run the Application**

    **Option A: Using VS Code GUI (Recommended)**
   - Open any backend file (e.g., `Program.cs`)
   - Click the "Run and Debug" button that appears at the top of VS Code
   - This will start both backend and frontend
   
   **Option B: Run via terminal**
   
   ```
   cd library-management-system.Server
   dotnet run
   ```
   
   - This will also start both backend and frontend
   - The backend will run on `https://localhost:5101`
   - The frontend will run on `https://localhost:50313`

### Option 2: Using Visual Studio

1. **Setup**
   - Open `library-management-system.sln` in Visual Studio
   - Ensure you have the ASP.NET installed

2. **Frontend Dependencies**
   ```
   cd library-management-system.client
   npm install
   ```

3. **Run the Application**
   - Press Start to run the application

## API Endpoints

### Authentication
- POST `/api/Auth/register` - User registration
- POST `/api/Auth/login` - User login
- 

### Books (Protected)
- GET `/api/Books` - Get all books
- GET `/api/Books/{id}` - Get book by ID
- POST `/api/Books` - Create new book
- PUT `/api/Books/{id}` - Update book
- DELETE `/api/Books/{id}` - Delete book

## Database

The application uses SQLite database with the following entities:
- **Users**: Stores user credentials with hashed passwords
- **Books**: Stores book information (Title, Author, ISBN, Publication Year)
