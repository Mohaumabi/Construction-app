# Construction Manager

A comprehensive React Native construction management system built with Expo, TypeScript, Supabase, and Redux Toolkit.

## Features

### 🏗️ Core Features
- **Project Management**: Create, track, and manage construction projects with timeline visualization
- **Team Management**: Organize teams with role-based access control
- **Work Tracking**: Log work hours and track project progress
- **Payroll Management**: Automated payroll calculation and management
- **Fortnightly Reports**: Generate and manage project reports
- **Calendar Integration**: Two-way sync with Google Calendar, Outlook, and Apple Calendar
- **Real-time Notifications**: Push notifications via Firebase, email via SendGrid, SMS via Twilio

### 🎨 Design & UX
- **Modern UI**: Minimalist, professional, and elegant design
- **Dark/Light Theme**: Switchable themes with custom color palette
- **Responsive Design**: Optimized for both iOS and Android
- **System Fonts**: Uses platform-specific default fonts

### 🔐 Security & Compliance
- **Role-based Access Control**: 10 different user roles with granular permissions
- **POPIA Compliance**: Data protection measures for South African regulations
- **Multi-factor Authentication**: Required for sensitive roles
- **Audit Logging**: Complete activity tracking
- **Data Encryption**: Sensitive data encryption at rest and in transit

### 🚀 Technical Features
- **Supabase Backend**: PostgreSQL database with real-time subscriptions
- **Redux Toolkit**: State management with async thunks
- **TypeScript**: Full type safety throughout the application
- **React Navigation**: Nested navigation with drawer and tab navigation
- **Expo**: Cross-platform development and deployment

## User Roles

The system supports 10 different user roles:

1. **Owner** - Full access to all features
2. **Project Manager** - Project oversight and team management
3. **Site Foreman** - On-site project management
4. **Supervisor** - Team supervision and work approval
5. **Site Worker** - Work logging and basic project access
6. **Accountant** - Financial management and payroll
7. **HR Manager** - Team and personnel management
8. **Admin Assistant** - Administrative tasks support
9. **Subcontractor** - Limited project access for external contractors
10. **Client/Investor** - Project progress viewing and reports

## Tech Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Navigation**: React Navigation
- **Notifications**: Expo Notifications + Firebase Cloud Messaging
- **Email**: SendGrid
- **SMS**: Twilio
- **Calendar**: Expo Calendar
- **UI Components**: Custom components with React Native Paper

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Input, Card)
│   ├── auth/           # Authentication-specific components
│   ├── project/        # Project-related components
│   ├── team/           # Team management components
│   ├── payroll/        # Payroll components
│   ├── reports/        # Report components
│   ├── calendar/       # Calendar components
│   └── notifications/  # Notification components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── dashboard/     # Dashboard screens
│   ├── project/       # Project screens
│   ├── team/          # Team screens
│   ├── payroll/       # Payroll screens
│   ├── reports/       # Report screens
│   ├── settings/      # Settings screens
│   └── profile/       # Profile screens
├── store/             # Redux store configuration
│   ├── slices/        # Redux slices
│   └── middleware/    # Custom middleware
├── services/          # External service integrations
├── utils/             # Utility functions and helpers
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks
└── navigation/        # Navigation configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- Supabase account
- Firebase account (for FCM)
- SendGrid account (for email)
- Twilio account (for SMS)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ConstructionManager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your configuration values in the `.env` file.

4. **Configure Supabase**
   - Create a new Supabase project
   - Set up the database schema (see Database Setup below)
   - Update the Supabase URL and anon key in your `.env` file

5. **Start the development server**
   ```bash
   npm start
   ```

### Database Setup

Create the following tables in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  firstName VARCHAR NOT NULL,
  lastName VARCHAR NOT NULL,
  phone VARCHAR,
  avatar VARCHAR,
  role VARCHAR NOT NULL,
  isActive BOOLEAN DEFAULT true,
  lastLogin TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  address VARCHAR NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  estimatedCost DECIMAL(12,2) NOT NULL,
  actualCost DECIMAL(12,2) DEFAULT 0,
  revenue DECIMAL(12,2) DEFAULT 0,
  status VARCHAR NOT NULL,
  progress INTEGER DEFAULT 0,
  clientId UUID REFERENCES users(id),
  managerId UUID REFERENCES users(id),
  foremanId UUID REFERENCES users(id),
  teamMembers UUID[],
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Additional tables for project_timelines, teams, work_records, etc.
-- (See the type definitions for complete schema)
```

### Color Palette

The app uses a professional construction-themed color palette:

- **Primary**: #FFC107 (Construction Yellow)
- **Secondary**: #212121 (Matte Black)
- **Accent**: #757575 (Steel Gray)
- **Alert**: #FF5722 (Bright Orange)
- **Background Light**: #F5F5F5
- **Background Dark**: #121212

## Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Building for Production

1. **Configure EAS Build**
   ```bash
   npm install -g @expo/cli
   eas build:configure
   ```

2. **Build for Android**
   ```bash
   eas build --platform android
   ```

3. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

## Configuration

### Supabase Setup

1. Create a new Supabase project
2. Set up Row Level Security (RLS) policies
3. Configure authentication providers (Google, Apple)
4. Set up real-time subscriptions
5. Create the database schema

### Firebase Setup (for FCM)

1. Create a Firebase project
2. Enable Cloud Messaging
3. Add Android/iOS apps to the project
4. Download configuration files
5. Configure push notifications

### Calendar Integration

The app supports two-way sync with:
- Google Calendar (using Google Calendar API)
- Microsoft Outlook (using Microsoft Graph API)
- Apple Calendar (using EventKit on iOS)

## Security

### POPIA Compliance

The app implements several measures for South African POPIA compliance:

- **Data Minimization**: Only collect necessary data
- **Consent Management**: Clear consent for data processing
- **Data Subject Rights**: User data access and deletion
- **Audit Logging**: Complete activity tracking
- **Data Encryption**: Sensitive data encryption
- **Access Controls**: Role-based access restrictions

### Security Features

- Multi-factor authentication for sensitive roles
- Session management and timeout
- API rate limiting
- Input validation and sanitization
- Secure data transmission (HTTPS)
- Regular security audits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Roadmap

### Phase 1 (Current)
- ✅ Basic project structure
- ✅ Authentication system
- ✅ Role-based access control
- ✅ Basic UI components
- ✅ Navigation structure

### Phase 2 (Next)
- 🔄 Complete project management features
- 🔄 Team management implementation
- 🔄 Work tracking and payroll
- 🔄 Report generation
- 🔄 Calendar integration

### Phase 3 (Future)
- 📅 Advanced analytics and dashboards
- 📅 Mobile app optimization
- 📅 Offline functionality
- 📅 Integration with accounting software
- 📅 Advanced reporting features

## Acknowledgments

- Expo team for the excellent development platform
- Supabase for the backend infrastructure
- React Navigation for navigation solutions
- All open-source contributors