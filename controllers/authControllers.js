const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  if (err.message.includes("Incorrect email")) {
    errors.email = "This email is not registered";
  }

  if (err.message.includes("Incorrect password")) {
    errors.password = "Please enter the correct password";
  }

  if (err.code === 11000) {
    errors.email = "This email is already registered";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxJWTAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "expenai secret", { expiresIn: maxJWTAge });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxJWTAge * 1000,
      sameSite: "Lax",
    });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxJWTAge * 1000,
      sameSite: "Lax",
    });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports.check_auth = (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ authenticated: false });

  jwt.verify(token, "expenai secret", (err, decodedToken) => {
    if (err) return res.status(401).json({ authenticated: false });

    return res.status(200).json({ authenticated: true });
  });
};
