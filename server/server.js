import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';// For password hashing
import crypto from 'crypto';// For generating secure random codes
import fs from 'fs';// File system operation
import nodemailer from 'nodemailer'; // Sending emails
import { User, Book, UserBook } from './model.js';
import connectDB from './config.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { generateToken, verifyToken, verifyAdmin } from './jwt.js';

// Load environment variables from .env file
dotenv.config();
connectDB();// Connect to MongoDB

const app = express();
// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// SignUp endpoint
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Set role to 'customer' by default
  const userRole = 'customer';

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomBytes(3).toString('hex');

    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      verificationCode,
      isVerified: false,
      role: userRole 
    });

    await newUser.save();

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: 'Verify your email',
      text: `Hi ${name}, welcome to our platform. Please verify your email with this code: ${verificationCode}`
    });

    res.status(200).json({ message: 'User registered. Verification email sent.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


//sigin router
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password router
app.post('/reset-password', async (req, res) => {
  const { email, password, code } = req.body;
  console.log('Incoming reset request:', { email, password, code }); // <-- DEBUG LOG

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('User not found'); // <-- DEBUG
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.resetCode !== code) {
      console.log('Invalid code:', code, 'Expected:', user.resetCode); // <-- DEBUG
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    if (user.resetCodeExpire < Date.now()) {
      console.log('Code expired at:', new Date(user.resetCodeExpire)); // <-- DEBUG
      return res.status(400).json({ message: 'Reset code expired' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Email router
app.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//  Book Upload Setup 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add Book 
app.post('/add-books', verifyToken, upload.single('image'), async (req, res) => {
  console.log('Received file:', req.file); // Check file uploaded
  console.log('Received body:', req.body); // Check form data received

  try {
    const { title, author, genre, description, pages } = req.body;
    const image = req.file ? req.file.filename : null;

    // Parse pages if sent as a JSON string
    const pagesArray = pages ? JSON.parse(pages) : [];

    const newBook = new Book({
      title,
      author,
      genre,
      description,
      pages: pagesArray,  // Save pages as an array
      image
    });

    await newBook.save();
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (err) {
    console.error('Error adding book:', err);
    res.status(500).json({ message: 'Server error adding book' });
  }
});

// Search Books rte
app.get('/search-books', async (req, res) => {
  const { genre, searchTerm } = req.query;

  try {
    let query = {};

    if (genre) {
      query.genre = genre;
    }

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: 'i' }; // Case-insensitive search
    }

    const books = await Book.find(query);
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific book by ID rte
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update book details rte
app.patch('/books/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { pages, title, author, genre, description } = req.body;

  try {
    // Find the book by its ID
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Update book details if provided
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (description) book.description = description;
    if (pages) book.pages = pages;  // Update pages field

    await book.save();  // Save updated book

    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Stats rte
app.get('/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalBooks = await Book.countDocuments();

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalBooks
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

// Delete Book rte
app.delete('/books/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ban a user by ID (Admin only)
app.post('/admin/ban/:userId', verifyToken, verifyAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.banned = true;
    await user.save();

    res.status(200).json({ message: 'User has been banned' });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ message: 'Server error banning user' });
  }
});

// Toggle User Role (Admin Only) 
app.post('/admin/toggle-role/:userId', verifyToken, verifyAdmin, async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Toggle the role between 'admin' and 'customer'
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    user.role = newRole;
    await user.save();

    res.status(200).json({ message: `User role changed to ${newRole}` });
  } catch (error) {
    console.error('Error toggling role:', error);
    res.status(500).json({ message: 'Server error toggling role' });
  }
});

// Get all users (Admin only)
app.get('/admin/users', verifyToken, verifyAdmin, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const users = await User.find({}, 'email _id role banned'); // Include 'role'
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

app.post('/user/upload-photo', verifyToken, upload.single('photo'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.photo = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ photoUrl: user.photo });
  } catch (err) {
    console.error('Error uploading photo:', err);
    res.status(500).json({ message: 'Server error uploading photo' });
  }
});


app.post('/user/library', verifyToken, async (req, res) => {
  const { bookId, status } = req.body;

  try {
    const exists = await UserBook.findOne({ user: req.user.id, book: bookId });
    if (exists) {
      return res.status(400).json({ message: 'Book already in library' });
    }

    const userBook = new UserBook({
      user: req.user.id,
      book: bookId,
      status: status || 'reading'
    });

    await userBook.save();
    res.status(201).json({ message: 'Book added to library' });
  } catch (err) {
    console.error('Error adding book to library:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/user/library', verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userBooks = await UserBook.find({ user: req.user.id }).populate('book');
    const formatted = userBooks.map(entry => ({
      _id: entry._id,
      bookId: entry.book._id,
      title: entry.book.title,
      author: entry.book.author,
      genre: entry.book.genre,
      description: entry.book.description,
      image: entry.book.image,
      status: entry.status,
      progress: entry.progress
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching library:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



app.delete('/user/library/:userBookId', verifyToken, async (req, res) => {
  try {
    const deleted = await UserBook.findOneAndDelete({
      _id: req.params.userBookId,
      user: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Book not found in your library' });
    }

    res.json({ message: 'Book removed from your library' });
  } catch (err) {
    console.error('Error removing book from library:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH: Update status of a book in user's library
app.patch('/user/library/:bookId', verifyToken, async (req, res) => {
  const { status, progress } = req.body;

  try {
    const userBook = await UserBook.findOneAndUpdate(
      { user: req.user.id, book: req.params.bookId },
      {
        ...(status && { status }),
        ...(progress !== undefined && { progress }),
      },
      { new: true }
    ).populate('book');

    if (!userBook) {
      return res.status(404).json({ message: 'Book not found in library' });
    }

    res.json({
      userBookId: userBook._id,
      bookId: userBook.book._id,
      title: userBook.book.title,
      author: userBook.book.author,
      genre: userBook.book.genre,
      description: userBook.book.description,
      image: userBook.book.image,
      status: userBook.status,
      progress: userBook.progress,
    });
  } catch (err) {
    console.error('Error updating book status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/user/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      name: user.name,
      email: user.email,
      photo: user.photo || null,
      role: user.role,
      isVerified: user.isVerified
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/user/library', verifyToken, async (req, res) => {
  console.log('req.user:', req.user); // ✅ Check if user info is here

  const { bookId, status } = req.body;

  try {
    const exists = await UserBook.findOne({ user: req.user.id, book: bookId });
    if (exists) {
      return res.status(400).json({ message: 'Book already in library' });
    }

    const userBook = new UserBook({
      user: req.user.id,
      book: bookId,
      status: status || 'reading'
    });

    await userBook.save();
    res.status(201).json({ message: 'Book added to library' });
  } catch (err) {
    console.error('Error adding book to library:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



//  Start Server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
