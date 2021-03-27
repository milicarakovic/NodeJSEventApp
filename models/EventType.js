const mongoose = require('mongoose');

const EventTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('EventTypes', EventTypeSchema);
