const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const { User } = require("../../models");

const { HttpError } = require("../../helpers");

const { controllerWrapper } = require("../../decorators");

const { JWT_SECRET /*= "4d5CLGkYfyaEKAvMheTGkxO3cZKv7ZC2"*/ } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `${email} already in use`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
  });

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, `Email or password invalid`);
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, `Email or password invalid`);
  }

  const payload = { id: user._id };

  const token = sign(payload, JWT_SECRET, { expiresIn: "23h" });

  res.json({ token });
};

module.exports = {
  signup: controllerWrapper(signup),
  signin: controllerWrapper(signin),
};
