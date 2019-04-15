const Joi = require("joi");

class Policy {
  static checkReqBodyUser(req, res, next) {
    const schema = {
      username: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().min(7),
      name: Joi.string(),
      age: Joi.string(),
      picture: Joi.string()
    };

    const { error, value } = Joi.validate(req.body, schema);
    if (error) {
      switch (error.details[0].context.key) {
        case "username":
          res
            .status(400)
            .json({ error: "please make sure your username valid" });
          break;
        case "email":
          res
            .status(400)
            .json({ error: "your email must provide a valid email address " });
          break;
        case "password":
          res
            .status(400)
            .json({ error: "we only allow password more than 7 length " });
          break;
        case "name":
          res.status(400).json({ error: "please make sure your name valid" });
          break;
        case "picture":
          next();
          break;
          break;
        default:
          res.status(400).json({
            error: `invalid input, please check be sure your input correct value`
          });
          break;
      }
    } else {
      next();
    }
  }
  static checkReqBodyArticle(req, res, next) {
    const schema = {
      title: Joi.string().min(10),
      content: Joi.string().min(100)
    };

    const { error, value } = Joi.validate(req.body, schema);
    if (error) {
      switch (error.details[0].context.key) {
        case "title":
          res
            .status(400)
            .json({ error: `please write more your tittle for descriptif ` });
          break;
        case "content":
          res.status(400).json({
            error: `please explain more what the article is and what is that for`
          });
          break;
        default:
          res.status(400).json({
            error: `your article invalid  because we are not allow your title or content`
          });
          break;
      }
    } else {
      next();
    }
  }

  static reqLogin(req, res, next) {
    const schema = {
      input: Joi.string().required(),
      password: Joi.string()
        .min(7)
        .required()
    };

    const { error, value } = Joi.validate(req.body, schema);
    if (error) {
      switch (error.details[0].context.key) {
        case "input":
          res
            .status(400)
            .json({ error: `please login with valid email/username` });
          break;
        case "password":
          res.status(400).json({ error: `please with valid password` });
          break;
        default:
          res.status(400).json({
            error: ` check your input and make sure they are correct`
          });
          break;
      }
    } else {
      next();
    }
  }
}

module.exports = Policy;
