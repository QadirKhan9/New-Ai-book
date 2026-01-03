# New AI Book Project

Welcome to the New AI Book project! This is a comprehensive platform that combines Docusaurus-based documentation with AI-powered features, authentication, and translation capabilities.

## 🚀 Features

- **AI-Powered Translation**: Translate content to Urdu and other languages with a single click
- **User Authentication**: Secure login and profile management system
- **Interactive Chat Widget**: AI-powered chat functionality for enhanced user experience
- **Text Selection AI**: Intelligent text processing and analysis tools
- **Responsive Design**: Mobile-friendly interface built with Docusaurus
- **Modern UI/UX**: Clean and intuitive user interface

## 📁 Project Structure

```
final-book/
├── backend/                 # Backend services (currently excluded from git)
├── frontend/               # Additional frontend components
├── my-website/             # Main Docusaurus website
│   ├── src/                # Source code for custom components
│   ├── static/             # Static assets
│   └── docusaurus.config.ts # Docusaurus configuration
├── specs/                  # Project specifications and documentation
├── history/                # Project history and prompts
└── .specify/               # Specification tools and templates
```

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Docusaurus
- **Backend**: Python, FastAPI (not included in this push)
- **Authentication**: Custom authentication system
- **Translation**: MyMemory API integration
- **UI Framework**: Docusaurus with custom components
- **Build Tools**: Node.js, npm

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Python (for backend services)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/QadirKhan9/New-Ai-book.git
   cd New-Ai-book
   ```

2. Navigate to the website directory:
   ```bash
   cd my-website
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the `my-website` directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:8000/api/v1
   ```

### Running the Application

1. Start the Docusaurus development server:
   ```bash
   npm run start
   ```

2. The application will be available at `http://localhost:3000`

### Backend Setup (Optional)

If you need to run the backend services:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

## 🔐 Authentication System

The project includes a complete authentication system with:

- User registration and login
- Profile management
- Protected routes
- Session management

To access protected features, users need to sign up or sign in using the authentication forms.

## 🌐 Translation Feature

The AI-powered translation feature allows users to:

- Translate content to Urdu with a single click
- Toggle between original and translated content
- Support for multiple languages (configurable)

The translation service uses the MyMemory API with fallback to mock translation if needed.

## 🤖 AI Chat Widget

An interactive chat widget is integrated into the website that provides:

- AI-powered responses to user queries
- Context-aware conversations
- Seamless integration with the documentation

## 📝 Documentation

Project specifications and documentation can be found in the `specs/` directory:

- Feature specifications
- Architecture plans
- Task breakdowns
- Research documents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues

If you encounter any issues or have feature requests, please open an issue in the GitHub repository.

## 🙏 Acknowledgments

- Docusaurus for the documentation framework
- React for the component library
- MyMemory API for translation services
- All contributors who have helped with this project