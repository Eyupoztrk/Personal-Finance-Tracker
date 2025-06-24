var express = require('express');
var router = express.Router();
const db = require("../database/Models");
const { Budget } = db;

const Response = require("../lib/Response");
const Enum = require("../config/Enum");
const CustomError = require("../lib/Error");
const auth = require("../lib/auth")();

router.all('*', auth.authenticate(), (req, res, next) => {
  next(); 
});
router.get("/", async (req, res) => {
    try {
        const budgets = await Budget.findAll();

        res.json(Response.successResponse(budgets, Enum.HTTP_CODES.ACCEPTED));
    }
    catch (err) {
        res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
    }
});


router.post('/add', async (req, res, next) => {
    try {
        const { name, target_amount, spent_amount,
            period_type, start_date, end_date,
            categoryId, is_active,
            alert_threshold, alert_enabled } = req.body;

        let userId = req.user?.id;

        const newBudget= await Budget.create({
            name,
            target_amount,
            spent_amount,
            period_type,
            start_date,
            end_date,
            userId,
            categoryId,
            is_active,
            alert_threshold,
            alert_enabled

        });

        res.json(Response.successResponse(newBudget, Enum.HTTP_CODES.ACCEPTED));
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


        let budget = await Budget.findById(body.id);

        if (!budget)
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Budget not available", "Budget not available");

        if (body.name) {
            let existingName = await Budget.getBudgetName(body.name);
            if (existingName)
                throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Name is already in use", "Name is already in use");
        }

        if (body.name) updates.name = body.name;
        if (body.target_amount) updates.target_amount = body.target_amount;
        if (body.spent_amount) updates.spent_amount = body.spent_amount;
        if (body.period_type) updates.period_type = body.period_type;
        if (body.start_date) updates.start_date = body.start_date;
        if (body.end_date) updates.end_date = body.end_date;
        if (body.categoryId) updates.categoryId = body.categoryId;
        if (body.is_active) updates.is_active = body.is_active;
        if (body.alert_threshold) updates.alert_threshold = body.alert_threshold;
        if (body.alert_enabled) updates.alert_enabled = body.alert_enabled;

        updates.userId = req.user?.id;

        Object.assign(budget, updates);

        await budget.save();
        res.json(Response.successResponse(budget, Enum.HTTP_CODES.ACCEPTED));
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

        const budget = await Budget.findById(body.id);

        if (!budget)
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Budget not available", "Budget not available");


        await budget.destroy();

        res.json(Response.successResponse(budget, Enum.HTTP_CODES.ACCEPTED));
    }
    catch (err) {
        res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
    }
});

module.exports = router;
