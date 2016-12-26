var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var Officer = mongoose.model('Officer');
var Event = mongoose.model('Event');

// Get all officers or create a new one
router.route('/officers')
    // Query all officers' information
    .get(function (req, res) {
        Officer.find({active: true},function (err, officers) {
            if (err) return res.send(err);
            return res.json(officers);
        })
    })
    // Create a new officer
    .post(function (req, res) {
        Officer.findOne({name: req.body.name}, function (err, officer) {
            if (err) res.send(err);
            if(officer){
                return res.json("Officer with name " + officer.name + " already existed")
            }
            var newOfficer = Officer();
            newOfficer.name = req.body.name;
            if(req.body.email){
                newOfficer.email = req.body.email;
            }
            if(req.body.position){
                newOfficer.position = req.body.position;
            }
            newOfficer.save(function (err, officer) {
                if (err) return res.send(err)
                return res.json(officer);
            })
        })
    });

router.route('/officers/:id')
    // Query information of a specific officer
    .get(function (req, res) {
        Officer.findById(req.params.id, function (err, officer) {
            if(err) res.send(err);
            if(!officer){
                return res.json("Sorry, we don't find this officer in our database");
            }
            return res.json(officer);
        })
    })
    // Edit information of an officer
    .put(function (req, res) {
        Officer.findById(req.params.id, function (err, officer) {
            if(!officer){
                return res.json("Sorry, we don't find this officer in our database");
            }
            // If rename a officer, check if there is a duplicate one, then update
            // with other input information
            if(req.body.name){
                Officer.findOne({name: req.body.name}, function (err, data) {
                    if (err) res.send(err);
                    if(data){
                       return res.json("This name " + req.body.name + " already existed, " +
                           "please use another one");
                    } else {
                        officer.name = req.body.name;
                        if(req.body.email){
                            officer.email = req.body.email;
                        }
                        if(req.body.position){
                            officer.position = req.body.position;
                        }
                        officer.save(function (err, newOfficer) {
                            if (err) res.send(err);
                            return res.json(newOfficer);
                        })
                    }
                });
            }
        })
    })

    // Psudo delete given officer
    .delete(function (req, res) {
        Officer.findById(req.params.id, function (err, officer) {
            if(err) return res.send(err);
            if(officer){
                Officer.updateById({_id: req.params.id},
                    {$set: {active: false}},
                    {new: true},
                    function (err) {
                    if(err) return res.send(err);
                    return res.json("Officer is deleted");
                })
            }else{
                return res.json("Sorry, We don't find this officer in our database");
            }
        });
    });

// Router for events
router.route('/events')
    // Query all events or add new event
    .get(function (req, res) {
        Event.find({}, 'name start_time', function (err, events) {
            if (err) return res.send(err);
            return res.json(events);
        });
    })

    // Create a event with name and start time
    // Add all officers in database into unattended_officers
    .post(function (req, res) {
        Event.findOne({'name' : req.body.name}, function (err, event) {
            if(err){
                console.log('Error in find an event: ' + err);
                return res.send(err)
            }
            if(event){
                return res.json("Event already existed")
            } else {
                Officer.find({active:true}, '_id', function (err, officers) {
                    if(err) return res.send(err);

                    var newEvent = new Event({
                        unattended_officers: officers
                    });
                    console.log(officers);
                    newEvent.name = req.body.name;
                    newEvent.start_time = req.body.start_time;

                    newEvent.save(function (err, data) {
                        if (err) return res.send(err);

                        Officer.update({}, { $inc: { unattended_numbers: 1}}, { multi: true }, function (err, raw) {
                            if (err) return res.send(err);
                            console.log('The raw response from Mongo was ', raw);
                        });
                        console.log("Saved new event successful!")
                        return res.json(data);
                    });
                    return;
                });
            }
        })
    });

// Query a particular event or delete a event
router.route('/events/:id')
    .get(function (req, res) {
        Event.findById(req.params.id)
            .populate({path: 'attended_officers', select: '_id + name'})
            .populate({path: 'unattended_officers', select: '_id + name'})
            .populate({path: 'asked_for_leave_officers', select: '_id + name'})
            .exec(function (err, event) {
            if(err) res.send(err);
            return res.json(event);
        });
    })

    // Edit the name or start time for a specific event
    .put(function (req, res) {
        Event.update({_id: req.params.id}, {$set: {name: req.body.name}},
            function (err, raw) {
            if (err) return res.send(err);
            console.log('The raw response from Mongo was ', raw);
        });
    })
    // Delete an event
    .delete(function (req, res) {
        Event.findById(req.params.id, function (err, event) {
           if(err) return res.send(err);
           if(event){
               var tempEvent = event;
               Event.remove({_id: req.params.id}, function (err) {
                   if(err) return res.send(err);

                   updateOfficersEventNumber(tempEvent);
                   return res.json("Event is deleted");
               })
           }else{
               return res.json("We don't have this event in our database");
           }
        });

    });

// Before: get ID for an Officer from req.params
// Update both event and officer collections to check-in an officer
router.put('/checkin/:id', function (req, res) {
    // 1: Pull this Officer's ID out from Event unattended_officers
    //      2: Add this Officer's ID into Event attended_officers
    //          3: This user unattended_numbers -1
    //          3.5: This user attended_number + 1

    // YES, THIS IS A CALLBACK HELLLLLLLLLLLLLLLLL!!!!!!!!!
    // AND I DON'T WANT TO BREAK IT UP LOL
    Officer.findById(req.params.id, '_id', function (err, officer) {
        if(err) return res.send(err);
        Event.update({_id: req.body.event_id},
            {$pull: {unattended_officers: officer._id}},
            function (err, pullRaw) {
                if(err) return console.log(err);
                console.log("pull unattended_officer: ", pullRaw);
                if(pullRaw.nModified != 0){
                Event.update({_id: req.body.event_id},
                    // Add to Set not working very well
                    {$addToSet: {attended_officers: {_id:officer, check_in_time: req.body.start_time}}},
                    function (err, addRaw) {
                        if(err) return res.send(err);
                        console.log("addToSet attended_officer: ", addRaw);
                        if(pullRaw.nModified != 0 && addRaw !=0){
                            Officer.update({_id: req.params.id},
                                {$inc: {unattended_numbers: -1, attended_numbers: 1}},
                                function (err, raw) {
                                    if(err) return console.log(err);
                                    console.log("update officer attendance: ", raw);
                            })
                        }else{
                            return console.log("Check-in Failed")
                        }
                    }
                )}else{
                    return console.log("Check-in failed")
                }
            }
        );
        return res.json("checkin successful");
    });
});

// Update both event and officer collections to un-check-in an officer
router.put('/uncheckin/:id', function (req, res) {
    Officer.findById(req.params.id, '_id', function (err, officer) {
        if(err) return res.send(err);
        Event.update({_id: req.body.event_id},
            {$pull: {attended_officers:{_id: officer._id}}},
            function (err, pullRaw) {
                if(err) return res.send(err);
                if(pullRaw.nModified != 0){
                    Event.update({_id: req.body.event_id},
                        {$addToSet: {unattended_officers: officer._id}},
                        function (err, addRaw) {
                            if(err) return res.send(err);
                            if(addRaw.nModified != 0){
                                Officer.update({_id: req.params.id},
                                    {$inc: {unattended_numbers: 1, attended_numbers: -1}},
                                    function (err, raw) {
                                        if(err) return console.log(err);
                                        return console.log("update officer attendance: ", raw);
                                    })
                            }else{
                                return console.log("Failed to set this user unchecked in")
                            }
                        });
                }else {
                    return console.log("Uncheck-in failed");
                }
        });
        return res.json("Un-checkin successful");
    })
});

// Update both event and officer collections to set an officer Vacated
// for this event. Officers has to be unattended at this moment
router.put('/vacate/:id', function (req, res) {
    Officer.findById(req.params.id, '_id', function (err, officer) {
        if(err) return res.send(err);
        Event.update({_id: req.body.event_id},
            {$pull: {unattended_officers: officer._id}},
            function (err, pullRaw) {
                if(err) return res.send(err);
                console.log(pullRaw);
                if(pullRaw.nModified != 0){
                    Event.update({_id: req.body.event_id},
                        {$addToSet: {asked_for_leave_officers: officer._id}},
                        function (err, addRaw) {
                            if(err) return res.send(err);
                            if(addRaw.nModified != 0){
                                Officer.update({_id: req.params.id},
                                    {$inc: {asked_for_leave_officers: 1, unattended_numbers: -1}},
                                    function (err, raw) {
                                        if(err) return console.log(err);
                                        return console.log("update officer attendance: ", raw);
                                    })
                            }else{
                                return console.log("2Failed to set this user vacate", err)
                            }
                        });
                }else {
                    return console.log("Failed to set this user vacate");
                }
            });
        return res.json("Successful");
    })
});

// Before: get officer's id & event id
// Remove this officer from this event
router.put('/rm/:id', function (req, res) {
    Event.findById(req.body.event_id, function (err, event) {
        if (err) return res.send(error);
        if(!event){
            return res.json("Event is undefined");
        }
        console.log(event.unattended_officers);

        for (var i = 0, len = event.unattended_officers.length; i < len; i++) {
            if(JSON.stringify(event.unattended_officers[i]) === JSON.stringify(req.params.id)){
                return res.json("found");
            }
        }

        return res.json("This officer is not in this event");
    })

});

var updateOfficersEventNumber = function (tempEvent) {
    if(tempEvent.attended_officers.length > 0){
        Officer.update({_id: {$in: tempEvent.attended_officers}},{ $inc: { attended_numbers: -1}}, {multi: true}, function (err, raw) {
            if (err) return console.log(err);
            console.log('The raw response from Mongo was ', raw);
        });
    }
    if(tempEvent.asked_for_leave_officers.length > 0){
        Officer.update({_id: {$in: tempEvent.asked_for_leave_officers}},{ $inc: { asked_for_leave_numbers: -1}}, {multi: true}, function (err, raw) {
            if (err) return console.log(err);
            console.log('The raw response from Mongo was ', raw);
        });
    }

    if(tempEvent.unattended_officers.length > 0){

        Officer.update({_id: {$in: tempEvent.unattended_officers}},{ $inc: { unattended_numbers: -1}}, {multi: true}, function (err, raw) {
            if (err) return console.log(err);
            console.log('The raw response from Mongo was ', raw);
        });
    }
};

module.exports = router;
