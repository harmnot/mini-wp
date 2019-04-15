require("dotenv").config();
const { Person, Article } = require("../model/index.js");
const axios = require("axios");

// google sigin
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const { comparePassword } = require("../helper/hashing.js");

// jwt token function
const { jwtSign } = require("../helper/jwt.js");

class PersonService {
  static async loginPlain(req, res, next) {
    try {
      const isUser = await Person.findOne({
        $or: [{ username: req.body.input }, { email: req.body.input }]
      });
      if (!isUser) {
        res.status(404).json({ error: `you are not registered yet` });
      } else {
        comparePassword(req.body.password, isUser.password).then(isMatch => {
          if (!isMatch) {
            res.status(400).json({ error: `password is incorrect` });
          } else {
            const token = jwtSign({ userId: isUser._id, ...req.body });
            res
              .status(202)
              .json({ msg: `succesfully login`, user: isUser._id, token });
          }
        });
      }
    } catch (err) {
      console.log(err, "ini error login");
      next(err);
    }
  }

  static async loginGoogle(req, res, next) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      console.log(ticket, "ini ticket");
      const payload = ticket.getPayload();
      const userid = payload["sub"];
      // If request specified a G Suite domain:
      //const domain = payload['hd'];
      // }
      const isUser = await Person.findOne({ email: payload.email });

      if (!isUser) {
        const random = String(Math.floor(Math.random() * 100) + 1);
        const age = Math.floor(Math.random() * 30) + 10;
        if (!req.body.picture) {
          const random = length => Math.floor(Math.random() * length);

          const type = ["eyes", "nose", "mouth"];
          const randoms = random(9) + 1;
          const pic = type[random(type.length)];
          const getDummyPic =
            "https://api.adorable.io/avatars/" + pic + randoms;

          console.log(getDummyPic);
          req.body.picture = getDummyPic;
        }
        const createUser = await Person.create({
          username: payload.name.split(" ").join(" ") + random,
          email: payload.email,
          password: random + random + random + "1000000",
          name: payload.name,
          age: age,
          picture: req.body.picture
        });
        const obj = {
          email: payload.email,
          name: payload.name
        };
        const token = jwtSign({ userId: createUser._id, ...obj });
        res
          .status(202)
          .json({ msg: `succesfully login`, user: createUser._id, token });
      } else {
        const obj = {
          email: payload.email,
          name: payload.name
        };
        const token = jwtSign({ userId: isUser._id, ...obj });
        res
          .status(202)
          .json({ msg: `succesfully login`, user: isUser._id, token });
      }
    } catch (e) {
      console.log(e, "ini error google");
      res.status(500).json({ err: e.message });
    }
  }

  static async register(req, res, next) {
    try {
      const isExist = await Person.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }]
      });
      if (isExist) {
        res.status(422).json({ error: `user already exist` });
      } else if (!isExist) {
        if (!req.body.picture) {
          const random = length => Math.floor(Math.random() * length);

          const type = ["eyes", "nose", "mouth"];
          const randoms = random(9) + 1;
          const pic = type[random(type.length)];
          const getDummyPic =
            "https://api.adorable.io/avatars/" + pic + randoms;

          console.log(getDummyPic);
          req.body.picture = getDummyPic;
        }
        const createUser = await Person.create({ ...req.body });
        console.log(createUser, "ini");
        console.log("berhasil create user");
        res.status(201).json({ msg: `created the user`, user: createUser });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async destroy(req, res, next) {
    try {
      const deleteUser = await Person.findOneAndDelete({
        $or: [{ _id: req.params.input }, { username: req.params.input }]
      });
      if (!deleteUser) {
        res.status(400).json({ error: `no user found` });
      } else {
        res.status(200).json({ msg: `succesfully deleted`, user: deleteUser });
      }
    } catch (err) {
      nxt(err);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const updateUser = await Person.findOneAndUpdate(
        { _id: req.user.userId },
        { ...req.body },
        { runValidators: true }
      );
      if (!updateUser) {
        res.status(400).json({ error: `no user found ` });
      } else {
        res.status(201).json({ msg: `succesfully updated`, data: updateUser });
      }
    } catch (e) {
      next(e);
    }
  }

  static async updateUserPHOTO(req, res, next) {
    try {
      const updateUser = await Person.findOne({
        _id: req.user.userId
      });
      if (!updateUser) {
        res.status(400).json({ error: `no user found ` });
      } else {
        if (req.file && req.file.gcsUrl) {
          const updatePic = await Person.updateOne(
            { _id: updateUser._id },
            { picture: req.file.gcsUrl }
          );
          res.status(200).json({
            msg: `succesfully upload`,
            link: req.file.gcsUrl,
            data: updatePic
          });
        } else {
          res.status(500).json({ error: "Unable to upload" });
        }
      }
    } catch (e) {
      next(e);
    }
  }

  static async myarticle(req, res, next) {
    try {
      const findMine = await Person.findOne({ _id: req.params.id }).populate(
        "articles"
      );
      if (!findMine) {
        res.status(400).json({ error: `can't found any` });
      } else {
        res.status(200).json(findMine);
      }
    } catch (err) {
      next(err);
    }
  }

  static async myarticleSearch(req, res, next) {
    try {
      const findMine = await Person.findOne({ _id: req.params.id }).populate({
        path: "articles",
        $match: { $title: new RegExp(`^${req.body.search}$`, "i") }
      });
      if (!findMine) {
        res.status(400).json({ error: `can't found any` });
      } else {
        res.status(200).json(findMine);
      }
    } catch (err) {
      next(err);
    }
  }

  static async findAnotherUser(req, body, next) {
    try {
      const findUser = await Person.findOne({
        $or: [
          { name: new RegExp(`^${req.body.search}$`, "i") },
          { username: req.body.search }
        ]
      });
      if (!findUser) {
        res
          .status(404)
          .json({ error: `can't found any user ${req.body.search}` });
      } else {
        res.status(200).json(findUser);
      }
    } catch (e) {
      next(e);
    }
  }
}

module.exports = PersonService;
