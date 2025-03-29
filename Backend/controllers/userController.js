import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Add new user
export const createUser = async (req, res) => {
  try {
    const { username, password, email, full_name, role } = req.body;

    // Validate required fields
    if (!username || !password || !email || !full_name || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate role
    const validRoles = ['Procurement', 'Finance', 'Management', 'Admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided.' });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      full_name,
      role,
    });

    res.status(201).json({ message: 'User created successfully.', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
