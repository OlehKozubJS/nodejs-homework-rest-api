const express = require("express");
const Joi = require("joi");

const { HttpError } = require("../../helpers");

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models");

const router = express.Router();

const contactAddSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": `"title" required field`,
  }),
  director: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const result = await listContacts();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await getContactById(contactId);
    if (!result) {
      throw HttpError(404, `Contact with ${contactId} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
