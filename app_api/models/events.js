var mongoose = require('mongoose');
//var Officer = mongoose.model('Officer');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var eventSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    attended_officers: [{
        _id: {type: ObjectId, ref: 'Officer', unique: true},
        check_in_time: {type: Date, default: Date.now}
    }],
    unattended_officers: [{
        type: ObjectId,
        ref: 'Officer'
    }],
    asked_for_leave_officers:[{
        type: ObjectId,
        ref: 'Officer'
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
},{ minimize: false });

mongoose.model('Event', eventSchema);