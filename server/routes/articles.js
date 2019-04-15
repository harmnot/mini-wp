const express = require("express");
const router = express.Router();
const [PersonService, ArticleService, Policy] = [
  require("../controller/Person.js"),
  require("../controller/Article.js"),
  require("../middleware/PolicyAuthentic.js")
];
const [Authentications, Authorization] = [
  require("../middleware/authentication.js"),
  require("../middleware/authorization.js")
];

router.get("/allarticles", ArticleService.findAll);
router.get("/random", ArticleService.random);
router.post(
  "/createarticle",
  Authentications,
  Policy.checkReqBodyArticle,
  ArticleService.createArticle
);
router.get("/:id", Authentications, Authorization, ArticleService.findOne);
router.put("/:id", Authentications, Authorization, ArticleService.update);
router.delete(
  "/:id",
  Authentications,
  Authorization,
  ArticleService.deleteArticle
);

router.use((err, req, res, next) => {
  console.log(err);
  if (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
