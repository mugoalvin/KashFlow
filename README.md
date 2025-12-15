# KashFlow

A modern, feature-rich mobile personal finance application built with React Native and Expo. KashFlow helps you track M-Pesa transactions, manage categories, and analyze your spending patterns with an intuitive interface.

## 📱 Features

- **Transaction Tracking**: Record income and expenses with detailed information
- **Smart Categories**: Organize transactions with custom categories
- **Analytics Dashboard**: Visualize spending patterns with daily, weekly, and monthly analysis
- **Multiple Views**: Switch between list and chart views for better insights
- **Theme Support**: Light and dark theme with Material Design 3 integration
- **Local Database**: SQLite-powered offline-first approach with Drizzle ORM
- **Cross-Platform**: Currently runs Android only.

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Database**: SQLite with Drizzle ORM
- **Styling**: TailwindCSS (NativeWind) + Material Design 3
- **State Management**: React Context API
- **Build System**: Expo (EAS for production builds)
- **Code Quality**: ESLint

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- Android: Android Studio with SDK tools (for Android development)

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/mugoalvin/KashFlow.git
cd KashFlow

# Install dependencies
npm install
```

### Development

Kindly run the application on your Android device.

```bash
# Start the Expo development server
npx expo start

# Run on specific platform
npx expo run:android  # Android Device
```

<!--
### Building
```bash
# Build for production (using EAS)
eas build --platform ios
eas build --platform android

# Build locally
npm run android  # Requires Android Studio setup
npm run ios      # Requires Xcode setup
``` -->

## 📁 Project Structure

```
KashFlow/
├── app/                    # Expo Router app directory
│   ├── (home)/            # Home tab screen
│   ├── (settings)/        # Settings tab screen
│   └── (transactions)/    # Transactions tab screen
├── components/            # Reusable UI components
│   ├── information/       # Info display components
│   ├── ui/               # Base UI components (buttons, chips, etc.)
│   ├── userInput/        # Input components (forms, selectors)
│   └── pages/            # Page-level components
├── contexts/             # React Context providers
├── db/                   # Database setup and functions
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── utils/                # Helper functions and constants
├── drizzle/              # Database migrations
└── assets/               # Images and icons
```

## 🗄️ Database

The project uses SQLite with Drizzle ORM for type-safe database operations.

### Running Migrations

```bash
# Generate migrations after schema changes
drizzle-kit generate:sqlite

# Push migrations to database
drizzle-kit push:sqlite

# View database in studio
drizzle-kit studio
```

### Database Schema

Key tables:

- **Transactions**: Stores income/expense entries
- **Categories**: User-defined transaction categories
- **Additional tables**: Configured in `db/config.ts`

## 🎨 Customization

### Theming

- Material Design 3 theme integration from [React Native Paper](https://reactnativepaper.com/)
- TailwindCSS via [NativeWind](`https://www.nativewind.dev/`)
- Theme context in `contexts/ThemeContext.ts`

### Colors

Custom colors defined in `utils/colors.ts`

## 📦 Available Scripts

```bash
npx expo start           # Start Expo development server
npx expo run:android     # Build and run on Android
npm run lint        # Run ESLint
```

## 🔧 Configuration

- **Expo Config**: `app.json`
- **TypeScript**: `tsconfig.json`
- **ESLint**: `eslint.config.js`
- **Babel**: `babel.config.js`
- **Database**: `drizzle.config.ts`

## 📝 Environment Variables

Create a `.env.local` file in the root directory with necessary configurations (see `.env.example` if available).

## 🐛 Development Tips

- Use `expo lint` to catch issues early
- Check `contexts/` for global state management needs
- Database functions are in `db/db_functions.ts`
- Custom hooks in `hooks/` for reusable logic

## 📄 License

See LICENSE file for details.

## 👤 Author

**Alvin Mugo** - [GitHub](https://github.com/mugoalvin)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Version**: 1.1.0  
**Last Updated**: December 2025
