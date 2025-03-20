const express = require('express');
const agentController = require('../controllers/agentController');

const agentRouter = express.Router();

agentRouter.post('/add', agentController.addAgent);
agentRouter.get('/list', agentController.getAllAgents);

module.exports = agentRouter;