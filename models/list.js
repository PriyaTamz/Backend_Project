const { default: mongoose } = require("mongoose");

const listSchema = new mongoose.Schema({
    "FirstName": {
        type: String,
        required: [true, 'First name is rquired'],
        trim: true
    },
    "Phone": {
        type: Number,
        required: [true, 'Phone number is rquired']
    },
    "Notes": {
        type: String,
        trim: true
    },
    "agentId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent'
    }
});

module.exports = mongoose.model('List', listSchema, 'list');