const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "Person" },
    title: {
      type: String,
      required: [true, "fill your title"]
    },
    content: {
      type: String,
      require: [true, `please create something on your content`]
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

articleSchema.pre("save", function(next) {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
