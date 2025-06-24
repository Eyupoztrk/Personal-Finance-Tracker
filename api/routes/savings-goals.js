var express = require('express');
var router = express.Router();
const db = require("../database/Models");
const { SavingsGoal } = db;

const Response = require("../lib/Response");
const Enum = require("../config/Enum");
const CustomError = require("../lib/Error");
const auth = require("../lib/auth")();


router.all('*', auth.authenticate(), (req, res, next) => {
  next(); 
});

router.get('/', async (req, res, next) => {
    try {
        const savings_goals = await SavingsGoal.findAll();
        res.json(Response.successResponse(savings_goals, Enum.HTTP_CODES.ACCEPTED));
    }
    catch (err) {
        res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
    }
});

router.post('/add', async (req, res, next) => {
    try {
        const { name, target_amount, current_amount, target_date, priority, is_completed, is_active } = req.body;

        let userId = req.user?.id;


        const newSavingGoals = await SavingsGoal.create({
            name,
            userId,
            target_amount,
            current_amount,
            target_date,
            priority,
            is_completed,
            is_active
        });

        res.json(Response.successResponse(newSavingGoals, Enum.HTTP_CODES.ACCEPTED));
    }
    catch (err) {
        res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
    }
});

router.post("/update", async (req, res) => {
    try {
        let body = req.body;
        let updates = {};
        if (!body.id)
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "ID not available", "ID not available");


        let savingsGoals = await SavingsGoal.findById(body.id);

        if (!savingsGoals)
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Savings Goals not available", "Savings Goals not available");



        if (body.name) updates.name = body.name;
        if (body.target_amount) updates.target_amount = body.target_amount;
        if (body.current_amount) updates.current_amount = body.current_amount;
        if (body.priority ) updates.priority  = body.priority ;
        if (body.is_completed ) updates.is_completed  = body.is_completed ;
        if (body.is_active ) updates.is_active  = body.is_active ;

        updates.userId = req.user?.id;

        Object.assign(savingsGoals, updates);

        await savingsGoals.save();
        res.json(Response.successResponse(savingsGoals, Enum.HTTP_CODES.ACCEPTED));
    }
    catch (err) {
        res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
    }
});

router.post("/delete", async (req, res) => {
    try {
        let body = req.body;
        if (!body.id)
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "ID not available", "ID not available");

        const savingsGoals = await SavingsGoal.findById(body.id);

        if (!savingsGoals)
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Savings Goals not available", "Savings Goals not available");


        await savingsGoals.destroy();

        res.json(Response.successResponse(savingsGoals, Enum.HTTP_CODES.ACCEPTED));
    }
    catch (err) {
        res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
    }
});



module.exports = router;
