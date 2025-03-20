const Agent = require('../models/agent');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const agentController = {
    addAgent: async (req, res) => {
        try {
            const { name, email, mobileNumber, password } = req.body;

            const agentExists = await Agent.findOne({ email });
            if (agentExists) {
                return res.status(400).json({ message: 'Agent already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newAgent = new Agent({ name, email, mobileNumber, password: hashedPassword });
            await newAgent.save();

            res.status(201).json({ message: 'Agent added successfully', agent: newAgent });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAllAgents: async (req, res) => {
        try {
            const agents = await Agent.find().select('name email mobileNumber');
            res.status(200).json({ agents });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}


module.exports = agentController;