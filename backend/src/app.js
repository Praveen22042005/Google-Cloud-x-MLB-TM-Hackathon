require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const highlightsRouter = require('./routes/highlights');
const usersRouter = require('./routes/users');
const videosRouter = require('./routes/videos');
const socialRouter = require('./routes/social');
const searchRouter = require('./routes/search');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Use Routes
app.use('/api/auth', authRouter);
app.use('/api/highlights', highlightsRouter);
app.use('/api/users', usersRouter);
app.use('/api/videos', videosRouter);
app.use('/api/social', socialRouter);
app.use('/api/search', searchRouter);

// Home Route
app.get('/', (req, res) => {
  res.send('Personalized Fan Highlights Backend is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});