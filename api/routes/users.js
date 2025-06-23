var express = require('express');
var router = express.Router();
const db = require("../database/Models");
const { User, Category, Transaction } = db;

const Response = require("../lib/Response");
const Enum = require("../config/Enum");
const CustomError = require("../lib/Error");


/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Category, as: 'categories' },
        { model: Transaction, as: 'transactions' }
      ]
    });


    //const user = await User.findById("c5e984d2-a6b4-4ef1-a6ab-3b05f8420443");
    const user = await User.findByEmail("eyup3@example.com");
    console.log(await user.getFullName());

    res.json(Response.successResponse(users, Enum.HTTP_CODES.ACCEPTED));
  }
  catch (err) {
    res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, currency } = req.body;


    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      currency
    });

    res.json(Response.successResponse(newUser, Enum.HTTP_CODES.ACCEPTED));
  }
  catch (err) {
    res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
  }
});


router.post('/signin', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findByEmail(email);

    if (!user)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "User not available", "user not available");

    if (!(await user.checkPassword(password)))
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Email or Password wrong", "Email or Password wrong");



    res.json(Response.successResponse(user, Enum.HTTP_CODES.OK));
  }
  catch (err) {
    res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
  }
});

router.post("/update", async (req, res) => {
  try {
    let body = req.body;
    let updates = {};

    let user = await User.findById(body.id);

    if (!user)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "User not available", "user not available");

    let existingEmail = await User.CheckEmailForUpdate(user, body.email);
    if (existingEmail)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Email is already in use", "Email is already in use");

    if (body.email) updates.email = body.email;
    if (body.password) updates.password = body.password;
    if (body.firstName) updates.firstName = body.firstName;
    if (body.lastName) updates.lastName = body.lastName;
    if (body.currency) updates.currency = body.currency;

    Object.assign(user, updates);

    await user.save(); // beforeUpdate hook'ları burada çalışır
    res.json(Response.successResponse(user, Enum.HTTP_CODES.ACCEPTED));
  }
  catch (err) {
    res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
  }
});


router.post("/delete", async (req, res) => {
  try {
    let body = req.body;
    const user = await User.findById(body.id);

    if (!body.id)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "ID not available", "ID not available");
    if (!user)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "User not available", "user not available");
    await user.destroy();

    res.json(Response.successResponse(user, Enum.HTTP_CODES.ACCEPTED));
  }
  catch (err) {
    res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
  }
});

module.exports = router;
