const { rename } = require("fs/promises");
const { resolve, join } = require("path");

const { Contact } = require("../../models");
const { controllerWrapper } = require("../../decorators");

const avatarPath = resolve("public", "avatars");

const addContactController = async (req, res) => {
  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = join(avatarPath, filename);
  await rename(oldPath, newPath);
  const poster = join("public", "posters", filename);
  const result = await Contact.create({ ...req.body, poster, owner });
  res.status(201).json(result);
};

module.exports = {
  addContactController: controllerWrapper(addContactController),
};
