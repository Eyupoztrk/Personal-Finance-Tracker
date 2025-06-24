var express = require('express');
var router = express.Router();
const db = require("../database/Models");
const { Transaction } = db;

const Response = require("../lib/Response");
const Enum = require("../config/Enum");
const CustomError = require("../lib/Error");
const auth = require("../lib/auth")();

router.all('*', auth.authenticate(), (req, res, next) => {
  next(); 
});

router.get('/', async (req, res, next) => {
    try {
        const transactions = await Transaction.findAll();
        res.json(Response.successResponse(transactions, Enum.HTTP_CODES.ACCEPTED));
    }
    catch (err) {
        res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
    }
});

router.post('/add', async (req, res, next) => {
    try {
        const { amount, type, description,
            transaction_date, categoryId,
            payment_method, tags, receipt_url,
            notes, is_recurring, recurring_period
        } = req.body;

        let userId = req.user?.id;

        const newTransaction = await Transaction.create({
            amount,
            type,
            description,
            transaction_date,
            userId,
            categoryId,
            payment_method,
            tags,
            receipt_url,
            notes,
            is_recurring,
            recurring_period

        });

        res.json(Response.successResponse(newTransaction, Enum.HTTP_CODES.ACCEPTED));
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


        let transaction = await Transaction.findById(body.id);

        if (!transaction)
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Transaction not available", "Transaction not available");



        if (body.amount) updates.amount = body.amount;
        if (body.type) updates.type = body.type;
        if (body.transaction_date) updates.transaction_date = body.transaction_date;
        if (body.payment_method) updates.payment_method = body.payment_method;
        if (body.tags) updates.tags = body.tags;
        if (body.receipt_url) updates.receipt_url = body.receipt_url;
        if (body.notes) updates.notes = body.notes;
        if (body.is_recurring) updates.is_recurring = body.is_recurring;
        if (body.recurring_period) updates.recurring_period = body.recurring_period;
        if (body.categoryId) updates.categoryId = body.categoryId;

        updates.userId = req.user?.id;

        Object.assign(transaction, updates);

        await transaction.save();
        res.json(Response.successResponse(transaction, Enum.HTTP_CODES.ACCEPTED));
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

        const transaction = await Transaction.findById(body.id);

        if (!transaction)
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Transaction not available", "Transaction not available");


        await transaction.destroy();

        res.json(Response.successResponse(transaction, Enum.HTTP_CODES.ACCEPTED));
    }
    catch (err) {
        res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
    }
});


module.exports = router;
