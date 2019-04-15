const express = require("express"),
  router = express.Router(),
  Multer = require("multer"),
  gcsMiddlewares = require("../middleware/google-cloud-middleware.js"),
  PersonService = require("../controller/Person.js");
const [Authentications, Authorization] = [
  require("../middleware/authentication.js"),
  require("../middleware/authorization.js")
];

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Maximum file size is 10MB
  }
});

router.post(
  "/",
  multer.single("image"),
  gcsMiddlewares.sendUploadToGCS,
  Authentications,
  PersonService.updateUserPHOTO
);

module.exports = router;
