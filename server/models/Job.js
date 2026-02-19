const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: [true, 'Company is required']
    },
    role: {
        type: String,
        required: [true, 'Role is required']
    },
    status: {
        type: String,
        enum: ['Applied', 'Interviewing', 'Offer', 'Rejected'],
        required: [true, 'Status is required'],
        default: 'Applied'
    },
    notes: {
        type: String,
        default: '',
    },
    dateApplied: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);