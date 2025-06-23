var express = require('express');
var router = express.Router();
const db = require("../database/Models");
const { User, Category, Transaction } = db;

const Response = require("../lib/Response");
const Enum = require("../config/Enum");
const CustomError = require("../lib/Error");

router.get("/", async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: [
                { model: User, as: 'users' }
            ]
        });

        res.json(Response.successResponse(categories, Enum.HTTP_CODES.ACCEPTED));
    }
    catch (err) {
        res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
    }
});


router.post('/add', async (req, res, next) => {
    try {
        const { name, type, is_default, is_active } = req.body;
        let userId = req.user?.id;

        const newCategory = await Category.create({
            name,
            type,
            userId,
            is_default,
            is_active

        });

        res.json(Response.successResponse(newCategory, Enum.HTTP_CODES.ACCEPTED));
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


        let category = await Category.findById(body.id);

        if (!category)
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Category not available", "Category not available");

        if (body.name) {
            let existingName = await Category.getCategoryName(body.name);
            if (existingName)
                throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Name is already in use", "Name is already in use");
        }

        if (body.name) updates.name = body.name;
        if (body.type) updates.type = body.type;
        if (body.is_default) updates.is_default = body.is_default;
        if (body.is_active) updates.is_active = body.is_active;

        updates.userId = req.user?.id;

        Object.assign(category, updates);

        await category.save(); // beforeUpdate hook'ları burada çalışır
        res.json(Response.successResponse(category, Enum.HTTP_CODES.ACCEPTED));
    }
    catch (err) {
        res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST))
    }
});


module.exports = router;
