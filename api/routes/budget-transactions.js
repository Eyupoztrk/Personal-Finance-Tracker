var express = require('express');
var router = express.Router();
const db = require("../database/Models");
const { BudgetTransaction } = db;

const Response = require("../lib/Response");
const Enum = require("../config/Enum");
const CustomError = require("../lib/Error");
const auth = require("../lib/auth")();

router.all('*', auth.authenticate(), (req, res, next) => {
  next(); 
});

router.get('/', async (req, res, next) => {
    try {
        const transactions = await BudgetTransaction.findAll();
        res.json(Response.successResponse(transactions, Enum.HTTP_CODES.ACCEPTED));
    }
    catch (err) {
        res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
    }
});

router.post('/add', async (req, res, next) => {
    try {
        const { budgetId, transactionId, allocated_amount } = req.body;



        const newBudgetTransaction = await BudgetTransaction.create({
            allocated_amount,
            budgetId,
            transactionId
        });

        res.json(Response.successResponse(newBudgetTransaction, Enum.HTTP_CODES.ACCEPTED));
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


        let budgetTransaction = await BudgetTransaction.findById(body.id);

        if (!budgetTransaction)
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Budget Transaction not available", "Budget Transaction  not available");



        if (body.allocated_amount) updates.allocated_amount = body.allocated_amount;
        if (body.budgetId) updates.budgetId = body.budgetId;
        if (body.transactionId) updates.transactionId = body.transactionId;


        Object.assign(budgetTransaction, updates);

        await budgetTransaction.save();
        res.json(Response.successResponse(budgetTransaction, Enum.HTTP_CODES.ACCEPTED));
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

        const budgetTransaction = await BudgetTransaction.findById(body.id);

        if (!budgetTransaction)
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Budget Transaction not available", "Budget Transaction not available");


        await budgetTransaction.destroy();

        res.json(Response.successResponse(budgetTransaction, Enum.HTTP_CODES.ACCEPTED));
    }
    catch (err) {
        res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
    }
});



module.exports = router;
