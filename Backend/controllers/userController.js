import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';

export const createUser = expressAsyncHandler(async (req, res) => {
  const { username, password, email, full_name, role } = req.body;

  // Validate required fields
  if (!username || !password || !email || !full_name || !role) {
    res.status(400);
    throw new Error('All fields are required.');
  }

  // Validate role
  const validRoles = ['Procurement', 'Finance', 'Management', 'Admin'];
  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error('Invalid role provided.');
  }

  // Check if username or email already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    res.status(400);
    throw new Error('Username or email already exists.');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user (no user_id field)
  const newUser = await User.create({
    username,
    password: hashedPassword,
    email,
    full_name,
    role,
  });

  res.status(201).json({ message: 'User created successfully.', user: newUser });
});
