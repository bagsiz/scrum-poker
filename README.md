# Scrum Planning Poker App

A real-time planning poker application for Scrum teams, built with React and Firebase. This app allows teams to vote on story points simultaneously and reveal them together, making sprint planning more efficient and fun.

## Features

- 🔒 Google Authentication with domain restriction
- 👥 Real-time user presence
- 🎯 Configurable point values
- 👀 Hidden votes until reveal
- 📊 Average point calculation
- 👑 Admin controls for session management
- 🔄 Reset and reveal functionality

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Google Cloud Platform account (for authentication)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/bagsiz/scrum-poker
cd scrum-poker
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
   - Copy `.env.example` to `.env` for development
   - Copy `.env.example` to `.env.production` for production
   - Update the environment variables with your configuration

## Configuration

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Google Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google sign-in
   - Add your authorized domains
3. Create a Firestore database:
   - Go to Firestore Database
   - Create database
   - Start in test mode
4. Get your Firebase configuration:
   - Go to Project Settings
   - Scroll to "Your apps"
   - Create a web app or use existing one
   - Copy the configuration object


### Environment Variables

Create `.env` and `.env.production` files with the following variables:

````env
REACT_APP_DOMAIN=your-company-domain.com
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_ADMIN_EMAILS=admin1@domain.com,admin2@domain.com
REACT_APP_POINTS=0,1,3,5,8,13,21,34,55,?
```


### Firestore Rules

Deploy the provided Firestore rules in `firestore.rules` to secure your database:

```bash
firebase deploy --only firestore:rules
```


## Development

Run the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Building for Production

Build the production version:

```bash
npm run build
```


## Deployment

1. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase (if not already done):

```bash
firebase init
```

Select:
- Hosting
- Firestore
- Choose your project
- Use build as public directory
- Configure as single-page app
- Don't overwrite index.html

4. Deploy:

```bash
npm run deploy
```

Or manually:

```bash
npm run build
firebase deploy
```

## Admin Features

Administrators (defined in REACT_APP_ADMIN_EMAILS) can:
- Start new voting sessions
- Reset current session
- Reveal points


## Customization

### Point Values
Modify the `REACT_APP_POINTS` environment variable to change available point values.

### Styling
The app uses Material-UI (MUI) for styling. Customize the theme in your components.


## Security

- Authentication is restricted to specified domain
- Firestore rules ensure data security
- Only authenticated users can access the app
- Only admins can control sessions


## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.