const { Person, Article } = require("../model/index.js");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

class ArticleService {
  static async findAll(req, res, next) {
    try {
      const findAlls = await Article.find({}).populate("author");
      if (!findAlls.length) {
        res.status(400).json({ msg: "no content yet" });
      } else {
        res.status(200).json(findAlls);
      }
    } catch (error) {
      next(error);
    }
  }

  static async random(req, res, next) {
    try {
      const count = await Article.count({});
      const random = Math.floor(Math.random() * count);
      const findAlls = await Article.find({})
        .populate("author")
        .limit(4)
        .skip(random);
      res.status(200).json(findAlls);
    } catch (e) {
      next(e);
    }
  }

  static async findOne(req, res, next) {
    try {
      const findArticle = await Article.findOne({
        $or: [{ _id: req.params.id }, { title: req.params.id }]
      });
      if (!findArticle) {
        res.status(400).json({ error: `can't found any articles` });
      } else {
        res.status(200).json(findArticle);
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async update(req, res, next) {
    try {
      const updateArticle = await Article.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body },
        { runValidators: true }
      );
      if (!updateArticle) {
        res.status(400).json({ error: `can't found any ` });
      } else {
        res
          .status(201)
          .json({ msg: `succesfully update`, data: updateArticle });
      }
    } catch (e) {
      next(e);
    }
  }

  static async deleteArticle(req, res, next) {
    try {
      const tryingDelete = await Article.findOneAndDelete({
        $or: [{ title: req.params.id }, { _id: req.params.id }]
      });
      if (!tryingDelete) {
        res.status(400).json({ error: `can't found any` });
      } else {
        const pullIt = await Person.update(
          { _id: tryingDelete.author },
          { $pull: { articles: req.params.id } },
          { safe: true }
        );

        res.status(200).json({
          msg: `succesfully deleted article`,
          data: tryingDelete,
          user: pullIt
        });
      }
    } catch (e) {
      next(e);
    }
  }

  static async createArticle(req, res, next) {
    console.log(req.body.content, "ini content");
    // must sedn _id to localStorage
    try {
      const findThetitle = await Article.findOne({
        title: req.body.title.toLowerCase()
      });
      if (findThetitle) {
        res.status(302).json({
          msg: `the title alreayd use, please use unique title to make your article different `
        });
      } else {
        const createArticle = await Article.create({
          author: req.user.userId,
          title: req.body.title,
          content: req.body.content
        });
        const addArticleToAuthor = await Person.findOneAndUpdate(
          {
            $or: [{ _id: req.user.userId }, { email: req.user.userId }]
          },
          { $addToSet: { articles: createArticle._id } }
        );
        console.log(createArticle, "ini buar article");
        console.log(addArticleToAuthor, `ini tambah ke author`);
        res.status(201).json({
          msg: `article created`,
          article: createArticle,
          author: addArticleToAuthor
        });
      }
    } catch (err) {
      console.log(err, "ini erro");
      next(err);
    }
  }
}

module.exports = ArticleService;
