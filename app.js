const express = require('express');
const adminRouter = require('./routes/adminRouter');
const agentRouter = require('./routes/agentRouter');
const listRouter = require('./routes/listRouter');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(cookieParser());

app.use('/uploads', express.static("uploads"));
app.use('/admin', adminRouter);
app.use('/agents', agentRouter);
app.use('/lists', listRouter);

module.exports = app;