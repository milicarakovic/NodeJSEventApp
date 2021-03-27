const express = require('express');
const router = express.Router();
const EventType = require('../models/EventType');
const verify = require('./verifyToken');

router.get('/', verify, async (req, res) => {
  try {
    const events = await EventType.find();
    res.json(events);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
