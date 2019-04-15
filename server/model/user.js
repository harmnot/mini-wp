require("dotenv").config();
const mongoose = require("mongoose");
const { hashingPassword } = require("../helper/hashing.js");

const Schema = mongoose.Schema;

const authorSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "please fill your username"]
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function(v) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: props => `${props.value} is invalid email`
      },
      required: [true, "please fill your valid email"]
    },
    password: {
      type: String,
      required: [true, `password can't be empty`],
      validate: {
        validator: v => {
          return v.length <= 7 ? false : true;
        },
        message: props => `${props.value} password must be more than 7 chars`
      }
    },
    name: {
      type: String,
      required: [true, `fill your email`]
    },
    age: {
      type: Number
    },
    picture: {
      type: String,
      required: [true, "you must choose your pic"]
    },
    articles: [{ type: Schema.Types.ObjectId, ref: "Article" }]
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

authorSchema.pre("save", function(next) {
  let user = this;
  hashingPassword(user)
    .then(response => {
      user.password = response;
      next();
    })
    .catch(err => {
      next(err);
    });
});

authorSchema.pre("save", function(next) {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

const Person = mongoose.model("Person", authorSchema);

module.exports = Person;
