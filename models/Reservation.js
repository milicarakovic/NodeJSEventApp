const mongoose = require('mongoose');

const EventObjSchema = mongoose.Schema({
  eventId: String,
  eventName: String,
  eventDate: Date,
});

const ResevationSchema = mongoose.Schema({
  event: {
    type: EventObjSchema,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  numberPeople: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Reservations', ResevationSchema);
