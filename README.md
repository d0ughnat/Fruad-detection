# 🛡️ Fraud Detection Dashboard

An advanced fraud detection and analytics platform powered by AI that helps users identify potential scams, phishing attempts, and fraudulent communications with detailed analysis and actionable recommendations.

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.16.1-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-cyan)

## ✨ Features

### 🔍 AI-Powered Fraud Detection
- **Real-time Analysis**: Analyze suspicious emails, messages, and communications instantly
- **Advanced Pattern Recognition**: Detect psychological manipulation tactics and fraud patterns
- **Risk Assessment**: Get detailed risk levels (LOW, MEDIUM, HIGH, CRITICAL) with confidence scores
- **Comprehensive Reports**: Receive structured analysis with actionable recommendations

### 🚀 Modern Web Application
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Dashboard**: Interactive analytics and monitoring
- **Secure Authentication**: JWT-based authentication with session management
- **Role-based Access**: Multi-user support with different access levels

### 🎨 User Experience
- **Intuitive Interface**: Clean, ChatGPT-style output formatting
- **Dark Theme**: Modern dark theme with glassmorphism effects
- **Interactive Components**: Smooth animations and transitions
- **Accessibility**: Built with accessibility best practices

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless component library
- **Lucide React** - Beautiful icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database queries
- **PostgreSQL** - Reliable relational database
- **JWT Authentication** - Secure token-based auth
- **bcryptjs** - Password hashing

### AI & External Services
- **Google Gemini AI** - Advanced language model for fraud detection
- **Edge Runtime** - Fast, lightweight serverless functions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google AI API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/fraud-detection.git
cd fraud-detection
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fraud_detection"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# Google AI
GOOGLE_API_KEY="your-google-ai-api-key"

# App
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Create a test user (optional)
node scripts/create-test-user.js
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
fraud-detection/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/         # Authentication routes
│   │   ├── llm/          # AI analysis endpoint
│   │   └── dashboard-data/ # Dashboard APIs
│   ├── dashboard/         # Dashboard pages
│   ├── landing/          # Main application page
│   ├── login/            # Authentication page
│   └── llm/              # AI analysis interface
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   └── *.tsx             # Feature components
├── lib/                  # Utilities and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── hooks/                # Custom React hooks
```

## 🔐 Authentication

The application uses a secure JWT-based authentication system:

### Test Credentials
- **Email**: `test@example.com`
- **Password**: `password123`

### Features
- Secure login/logout
- Session management
- Password hashing with bcryptjs
- Role-based access control
- Edge Runtime compatible authentication

## 🤖 AI-Powered Analysis

### Fraud Detection Capabilities
- **Urgency Tactics Detection**: Identifies pressure-based manipulation
- **Phishing Pattern Recognition**: Spots suspicious links and domains
- **Social Engineering Analysis**: Detects manipulation techniques
- **Financial Scam Identification**: Recognizes advance fee and investment scams
- **Impersonation Detection**: Identifies fake authority figures

### Analysis Output
The AI provides structured analysis including:
- **Risk Level**: LOW, MEDIUM, HIGH, or CRITICAL
- **Confidence Score**: 0-100% confidence rating
- **Classification**: LEGITIMATE, SUSPICIOUS, or FRAUD
- **Primary Concerns**: Bulleted list of red flags
- **Detailed Analysis**: In-depth explanation of findings
- **Actionable Recommendations**: Specific steps to take

## 🎨 UI Components

### Design System
- **Modern Dark Theme**: Sophisticated dark mode interface
- **Glassmorphism**: Semi-transparent elements with blur effects
- **Responsive Layout**: Mobile-first responsive design
- **Interactive Elements**: Smooth hover effects and transitions

### Key Components
- **Sidebar Navigation**: Collapsible sidebar with main navigation
- **Analysis Interface**: Clean text input with real-time analysis
- **Authentication Forms**: Secure login and registration forms
- **Dashboard Cards**: Interactive data visualization components

## 📊 Database Schema

### Users Table
```sql
- id (Primary Key)
- name (String)
- email (Unique String)
- password (Hashed String)
- avatar (Optional String)
- role (USER/ADMIN)
- isActive (Boolean)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
# Build and run with Docker
docker build -t fraud-detection .
docker run -p 3000:3000 fraud-detection
```

### Environment Variables for Production
Ensure these environment variables are set:
- `DATABASE_URL`
- `JWT_SECRET` 
- `GOOGLE_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

## 🧪 Testing

### Create Test User
```bash
node scripts/create-test-user.js
```

### Test the Application
1. Navigate to the login page
2. Use test credentials to log in
3. Access the fraud analysis tool
4. Test with sample suspicious messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/fraud-detection/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- **Google Gemini AI** for advanced language processing
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Next.js** team for the amazing framework
- **Prisma** for type-safe database access

---

**⚠️ Disclaimer**: This tool is designed to assist in identifying potential fraud but should not be the sole method of verification. Always verify suspicious communications through official channels and report confirmed fraud to relevant authorities.
