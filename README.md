# YOGASNAP - Intelligent Yoga Pose Classification

YOGASNAP is an intelligent web application that uses machine learning to classify yoga poses in real-time.

## Authentication System

The application includes a complete authentication system with the following features:

- **User Login**: Secure email/password authentication
- **User Registration**: New users can create an account
- **Session Management**: Maintains user sessions across page refreshes
- **Protected Routes**: Main application content is only accessible to authenticated users

### Technical Implementation

The authentication system is built using:

- **Supabase Auth**: Backend authentication service
- **React Context API**: Global state management for user authentication status
- **TypeScript**: For type safety and better developer experience

### Authentication Flow

1. **Initial Load**: The app checks for an existing session
2. **Login/Registration**: Users can log in with existing credentials or create a new account
3. **Protected Content**: Once authenticated, users gain access to the yoga pose classification features
4. **Sign Out**: Users can log out, which invalidates their session

### Setting Up Supabase

To set up authentication with your own Supabase instance:

1. Create a Supabase project at [https://supabase.com/](https://supabase.com/)
2. Replace the placeholder values in `src/services/supabaseClient.ts` with your actual Supabase URL and anon key
3. Enable Email auth in the Supabase Authentication settings

## Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:5173` in your browser to see the application.

## Features

- **Real-time Yoga Pose Classification**: Analyze and classify yoga poses in real-time
- **Pose History**: Track your practice history
- **Pose Sequences**: Create and follow yoga sequences
- **Responsive Design**: Works on desktop and mobile devices

## Camera Capture

The application offers two capture modes:
- **Manual Capture**: Take a photo of your pose when you're ready
- **Automatic Detection**: The system automatically analyzes the video stream and captures detected poses

## Setup

### Prerequisites

- Node.js 18+
- A Gemini API key (https://ai.google.dev/)

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   cd yoga-classifier
   npm install
   ```
3. Create a `.env` file at the root of the project with your API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

### Starting the App

To launch the application in development mode:

```
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## How It Works

1. The user uploads an image or takes a photo of a yoga pose
2. The application sends the image to the Google Gemini API
3. The artificial intelligence identifies the pose and provides detailed information
4. The application displays the results in a visually appealing way
5. The analysis history is saved locally for future reference

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini API
- React Dropzone
- React Webcam
- LocalStorage for history

## Deployment

This application is configured for easy deployment on Vercel.

## License

MIT 