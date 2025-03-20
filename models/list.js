const { default: mongoose } = require("mongoose");

const listSchema = new mongoose.Schema({
    "firstName": {
        type: String,
        required: [true, 'First name is rquired'],
        trim: true
    },
    "phone": {
        type: Number,
        required: [true, 'Phone number is rquired']
    },
    "notes": {
        type: String,
        trim: true
    },
    "agentId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent'
    }
});

module.exports = mongoose.model('List', listSchema, 'list');