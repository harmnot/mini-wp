const express = require("express");
const router = express.Router();
const [PersonService, ArticleService, Policy] = [
  require("../controller/Person.js"),
  require("../controller/Article.js"),
  require("../middleware/PolicyAuthentic.js")
];

router.get("/myarticle/:id", PersonService.myarticle);
router.get("/users", PersonService.findAnotherUser);
router.get("/findarticle/:id", PersonService.myarticleSearch);
router.post("/login", Policy.reqLogin, PersonService.loginPlain);
router.post("/logingoogle", PersonService.loginGoogle);
router.post("/register", Policy.checkReqBodyUser, PersonService.register);
router.put("/udate/:input", PersonService.updateUser);
router.delete("/delete/:input", PersonService.destroy);

router.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
