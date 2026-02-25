const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000
    })
};

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const error = new Error('Please provide all required fields');
        error.status = 400;
        throw error;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('Email already in use');
        error.status = 400;
        throw error;
    }

    const newUser = await User.create({ name, email, password });
    generateTokenAndSetCookie(res, newUser._id);

    res.status(201).json({
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new Error('Email and password are required');
        error.status = 400;
        throw error;
    }

    const user = await User.findOne({ email });
    const isMatch = user ? await user.comparePassword(password) : false

    if (!isMatch) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
};

const logout = (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: true,
    });

    res.status(200).json({ msg: 'Logged out successfully' });
};

const me = async (req, res) => {
    const user = req.user;

    res.status(200).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
};

module.exports = { register, login, logout, me };