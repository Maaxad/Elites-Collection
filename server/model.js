import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  resetCode: String,
  resetCodeExpire: Date,
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  banned: { type: Boolean, default: false },
  photo: { type: String }
});

const User = mongoose.model('User', userSchema);

// Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  pages: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);

// 🆕 UserBook Schema
const userBookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: ['reading', 'finished'], default: 'reading' },
  progress: { type: Number, default: 0 }
}, { timestamps: true });

const UserBook = mongoose.model('UserBook', userBookSchema);

export { User, Book, UserBook };
