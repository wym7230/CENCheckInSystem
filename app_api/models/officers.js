var mongoose = require('mongoose');

var officerSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        default: ""
    },
    position: {
        type: String,
        default: ""
    },
    attended_numbers: {
        type: Number,
        default: 0,
        min: 0
    },
    unattended_numbers: {
        type: Number,
        default: 0,
        min: 0
    },
    asked_for_leave_numbers:{
        type: Number,
        default: 0,
        min: 0
    },
    total_late_time: {
        type: Number,
        default: 0,
        min: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    active:{
        type: Boolean,
        default: true
    }
},{ minimize: false });

mongoose.model('Officer', officerSchema);