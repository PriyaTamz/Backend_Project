const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const adminController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const adminExists = await Admin.findOne({ email });
            if (adminExists) {
                return res.status(400).json({ message: 'Admin already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newAdmin = new Admin({ name, email, password: hashedPassword });
            await newAdmin.save();

            res.status(201).json({ message: 'Admin registered successfully' });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const admin = await Admin.findOne({ email });

            if (!admin) {
                return res.status(404).json({ message: 'Incorrect Email' });
            }

            const passwordMatch = await bcrypt.compare(password, admin.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
            });

            res.status(200).json({ message: 'Admin logged in successfully', token, adminId: admin._id });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'Admin logged out successfully' });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAdminProfile: async (req, res) => {
        try {
            const adminId = req.adminId;
            const admin = await Admin.findById(adminId).select('-_id -password -__v -createdAt -updatedAt');

            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }

            res.status(200).json({ admin });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}


module.exports = adminController;