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

// Get all users or filter by role
export const getUsers = async (req, res) => {
  try {
    const { role } = req.query; // Get role from query parameters
    const filter = role ? { role } : {}; // Apply filter if role is provided

    const users = await User.find(filter).select('-password');
    res.status(200).json({
      message: 'Users fetched successfully.',
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Update user information
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, full_name, role, department, is_active } = req.body;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update fields
    user.username = username || user.username;
    user.email = email || user.email;
    user.full_name = full_name || user.full_name;
    user.role = role || user.role;
    user.department = department || user.department;
    user.is_active = is_active !== undefined ? is_active : user.is_active;

    await user.save();

    res.status(200).json({ message: 'User updated successfully.', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['Procurement', 'Finance', 'Management', 'Admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided.' });
    }

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the role
    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated successfully.', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Lock user account
export const lockUserAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Lock the account by setting is_active to false
    user.is_active = false;
    await user.save();

    res.status(200).json({ message: 'User account locked successfully.', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Unlock user account
export const unlockUserAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Unlock the account by setting is_active to true
    user.is_active = true;
    await user.save();

    res.status(200).json({ message: 'User account unlocked successfully.', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
