const { string } = require('@hapi/joi');
const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
});

const ContactSchema = mongoose.Schema({
  phone: String,
  email: String,
});

const EventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: [LocationSchema],

  photo: {
    type: String,
  },
  contact: [ContactSchema],
  available: {
    type: Number,
  },
});

module.exports = mongoose.model('Events', EventSchema);
