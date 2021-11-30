const mongoose = require('mongoose')

const donationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    donateGroup:
        {
            name: {
                type: String,
                required: true
            },
            units: {
                type: Number,
                required: true
            },
            blood: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Blood'
            }
        }
    ,
    age: {
        type: Number,
        required: true
    },
    disease: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Processing'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Donation',donationSchema)