const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const verify = require('./verifyToken');

router.get('/', verify, async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
