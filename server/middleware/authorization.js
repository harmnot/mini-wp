const { verifyJWT } = require("../helper/jwt.js");
const { Person, Article } = require("../model/index.js");

const authorization = async (req, res, next) => {
  const token = req.header("token");

  console.log(req.user, "iniii authroization");
  if (!token) {
    res.status(403).json({ error: `no token yet!` });
  } else {
    try {
      const findOwner = await Article.findOne({ _id: req.params.id });
      console.log(findOwner);
      if (findOwner.author != req.user.userId) {
        res.status(401).json({ error: `you are not allow do this thing` });
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authorization;
