const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const { update } = require('../models/User');

router.post('/register', async (req, res) => {
  //VALIDATE DATA
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email aready exists.');

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  //CREATING A NEW USER
  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    username: req.body.username,
    phone: req.body.phone,
    email: req.body.email,
    password: hashedPass,
    image: req.body.image,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email doesnt exists.');

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Invalid password.');

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
});

router.get('/me', verify, async (req, res) => {
  try {
    let token = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);
    const user = await User.findById(token._id);
    res.json(user);
  } catch (err) {
    res.json({ message: err });
    console.log(err);
  }
});

router.patch('/update', verify, async (req, res) => {
  try {
    const newData = req.body;
    let token = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);
    await User.findById(token._id, (err, updatedUseer) => {
      updatedUseer.name = newData.name;
      updatedUseer.surname = newData.surname;
      updatedUseer.phone = newData.phone;
      updatedUseer.username = newData.username;
      updatedUseer.image = newData.image;
      updatedUseer.save();
      res.send(updatedUseer);
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

module.exports = router;
