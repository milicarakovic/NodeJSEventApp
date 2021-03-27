const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Event = require('../models/Event');
const verify = require('./verifyToken');
const jwt = require('jsonwebtoken');

router.get('/', verify, async (req, res) => {
  try {
    let token = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);
    const reservations = await Reservation.find({ userId: token._id });
    res.json(reservations);
  } catch (err) {
    res.json({ message: err });
    console.log(err);
  }
});

router.post('/', verify, async (req, res) => {
  try {
    let token = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);
    let eventToReserve = req.body;
    const reservation = new Reservation({
      event: {
        eventId: eventToReserve.event._id,
        eventName: eventToReserve.event.eventName,
        eventDate: eventToReserve.event.eventDate,
      },
      userId: token._id,
      numberPeople: eventToReserve.numberPeople,
    });
    const savedReservation = await reservation.save();

    //Change available tickets
    let eventToChange = await Event.findById(eventToReserve.event._id);

    await Event.findOneAndUpdate(
      { _id: eventToReserve.event._id },
      {
        available: eventToChange.available - savedReservation.numberPeople,
      }
    );
    res.send({ reservation: savedReservation._id });
  } catch (err) {
    res.json({ message: err });
    console.log(err);
  }
});

router.delete('/:reservationId', verify, async (req, res) => {
  try {
    let reservationId = req.params.reservationId;
    let reservationToDelete = await Reservation.findById(reservationId);

    let eventToChange = await Event.findById(reservationToDelete.event.eventId);

    await Event.findOneAndUpdate(
      { _id: reservationToDelete.event.eventId },
      {
        available: eventToChange.available + reservationToDelete.numberPeople,
      }
    );

    const deleteReservation = await Reservation.findByIdAndDelete({
      _id: reservationId,
    });

    res.json(deleteReservation);
  } catch (err) {
    res.json(null);
    console.log(err);
  }
});

module.exports = router;
