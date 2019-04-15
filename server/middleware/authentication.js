const { verifyJWT } = require("../helper/jwt.js");
const { Person, Article } = require("../model/index.js");

const authentications = async (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    res.status(401).json({ error: "No token, authentications not allow" });
  } else {
    try {
      const decoded = verifyJWT(token);
      const isAuth = await Person.findOne({
        $or: [{ email: decoded.input }, { username: decoded.input }]
      });
      if (!isAuth) {
        console.log(" tidak authentication");
        res.status(401).json({ error: "you are not authentications" });
      } else {
        req.user = decoded;
        next();
      }
    } catch (e) {
      next(e);
    }
  }
};

module.exports = authentications;
