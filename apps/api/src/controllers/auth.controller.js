import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';

//  Registrar usuário
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = generateToken({ username: newUser.username, email: newUser.email });

    return res.status(201).json({ 
      message: 'User registered successfully',
      access_token: token
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Iniciar sessão (Login)
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ username: user.username, email: user.email });
    return res.status(200).json({ access_token: token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Finalizar sessão (Logout)
export const logout = async (req, res) => {
  return res.status(200).json({ message: 'User logged out successfully' });
};

// Obter perfil
export const getProfile = async (req, res) => {
  return res.status(200).json({
    username: req.user.username,
    email: req.user.email
  });
};