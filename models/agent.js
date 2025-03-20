const { default: mongoose } = require("mongoose");

const agentSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: [true, 'Name is rquired'],
        trim: true
    },
    "email": {
        type: String,
        required: [true, 'Email is rquired'],
        unique: true, 
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
    },
    "mobileNumber": {
        type: String,
        required: [true, 'mobile number is rquired'],
        match: [/^\+[1-9]\d{1,14}$/, , 'Invalid phone number format (use country code)']
    },
    "password": {
        type: String,
        required: [true, 'Password is required'],  
        minlength: [6, 'Password must be at least 6 characters']
    },
    "createdAt": {
        type: Date,
        default: Date.now
    },
    "updatedAt": {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Agent', agentSchema, 'agent');