#!/bin/bash

echo "🏗️  Construction Manager Setup Script"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or later."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo "📦 Installing Expo CLI globally..."
    npm install -g @expo/cli
fi

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your actual configuration values:"
    echo "   - Supabase URL and key"
    echo "   - Firebase configuration"
    echo "   - SendGrid API key"
    echo "   - Twilio configuration"
    echo "   - Google Calendar configuration"
    echo "   - Encryption key (32 characters)"
fi

# Create assets directories if they don't exist
echo "📁 Creating asset directories..."
mkdir -p assets/images/icons
mkdir -p assets/images/splash

# Check for TypeScript compilation errors
echo "🔍 Checking TypeScript compilation..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful!"
else
    echo "❌ TypeScript compilation failed. Please check the errors above."
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update the .env file with your configuration"
echo "2. Set up your Supabase project and database"
echo "3. Configure Firebase for push notifications"
echo "4. Add your app icons and splash screen to the assets folder"
echo "5. Run 'npm start' to start the development server"
echo ""
echo "For more information, see the README.md file."
echo ""