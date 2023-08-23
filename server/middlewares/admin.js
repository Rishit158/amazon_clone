const jwt = require("jsonwebtoken");
const User = require("../models/user");

const admin = async (req, res, next) => {
  try {
    const token = req.header("x-auth-toekn");
    if (!token)
      return res.status(401).json({ msg: "no auth token, access denied" });

    const verified = jwt.verify(token, "passwordKey");
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });
    const user = await User.findbyId(verified.id);
    if (user.type == "user" || user.type == "seller") {
      return res.status(401).json({ msg: "You are not an admin!" });
    }
    req.user = verified.id;
    req.token = token;
    next(); // this is for calling next callback function
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = admin;
