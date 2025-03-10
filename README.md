# Google Cloud x MLB TM Hackathon Project

## Personalized Fan Highlights

We developed this project for the Google Cloud x MLB TM Hackathon to enhance the baseball viewing experience by creating a personalized fan highlights platform. The application uses Google Cloud AI technologies to analyze baseball game footage, extract meaningful insights, and deliver tailored highlights based on user preferences.

### The Problem
Baseball fans often miss important game moments due to time constraints or because they can't watch the entire game. Traditional highlight reels are generic and don't cater to individual preferences such as favorite teams, players, or play types.

### Our Solution
A web application that allows fans to:
- Upload baseball game footage
- Process videos using AI to identify key moments, analyze sentiment, and transcribe commentary
- Search for specific plays, players, or teams
- Customize highlight preferences
- Share interesting moments with other fans

### Tech Stack
#### Frontend
- **React.js** - Component-based UI library
- **React Router** - For client-side routing
- **Material UI** - Component library for consistent design
- **Axios** - HTTP client for API requests
- **JWT** - For secure authentication

#### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Multer** - For file uploads
- **JWT** - Authentication middleware
- **bcrypt** - Password hashing

#### Google Cloud Services
- **Cloud Storage** - For storing video files
- **Video Intelligence API** - For analyzing video content and detecting key moments
- **Speech-to-Text** - For transcribing audio commentary
- **Natural Language API** - For sentiment analysis of transcripts

### Project Structure
```
Google-Cloud-x-MLB-TM-Hackathon/
├── frontend/              # React application
│   ├── public/            # Public assets
│   └── src/
│       ├── components/    # React components
│       ├── context/       # React context for state management
│       ├── styles/        # CSS styles
│       └── utils/         # Utility functions
│
└── backend/               # Node.js server
    ├── src/
    │   ├── models/        # MongoDB models
    │   ├── routes/        # API routes
    │   ├── middleware/    # Custom middleware
    │   └── utils/         # Utility functions
    └── uploads/           # Temporary storage for uploads
```

### Key Features
#### Video Analysis
- Automatic detection of play types (home runs, pitching, catches)
- Sentiment analysis of commentary
- Audio transcription

#### User Experience
- Personalized preferences (teams, players, play types)
- Social features (comments, sharing)
- Advanced search functionality

#### Real-time Processing
- Status updates on video processing
- Progress tracking for long-running operations

### Getting Started
#### Prerequisites
- Node.js (v14+)
- MongoDB
- Google Cloud account with enabled APIs:
  - Video Intelligence API
  - Speech-to-Text API
  - Natural Language API
  - Cloud Storage

#### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/Google-Cloud-x-MLB-TM-Hackathon.git
   cd Google-Cloud-x-MLB-TM-Hackathon
   ```

2. Backend setup
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your MongoDB URI and Google Cloud credentials
   ```

3. Frontend setup
   ```bash
   cd ../frontend
   npm install
   ```

4. Start the application
   ```bash
   # In backend directory
   npm run dev

   # In frontend directory (new terminal)
   npm start
   ```

### Future Improvements
- Machine learning model to improve play detection accuracy
- Real-time notifications for favorite team/player highlights
- Mobile application for on-the-go access
- Integration with MLB official API for more detailed statistics
- Enhanced social features like highlight playlists and follower feeds

### Team Members
- Praveen BV(me) - Fullstack Developer
- Lokesh Rahul VV - Fullstack Developer

### Acknowledgments
- Google Cloud for providing the necessary AI services
- MLB for the opportunity and data access
- [Any other acknowledgments]

### License
This project is licensed under the [License Name] - see the LICENSE file for details.
