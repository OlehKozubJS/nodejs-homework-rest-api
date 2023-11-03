const { Contact } = require("../../models");

const { controllerWrapper } = require("../../decorators");

const listContactsController = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const result = await Contact.find({ owner }).populate(
    "owner",
    "username email"
  );
  res.json(result);
};

module.exports = {
  listContactsController: controllerWrapper(listContactsController),
};
