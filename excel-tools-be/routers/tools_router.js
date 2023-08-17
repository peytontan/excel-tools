const express = require("express");
const router = express.Router();
const toolsController = require("../controllers/tools_controller");
const authMiddleware = require("../middlewares/auth_middleware");


router.post("/upload",authMiddleware,toolsController.uploadFile);
router.get("/getMainFolders",toolsController.getMainFolders);
router.get("/getSubFolders",toolsController.getSubFolders);
router.delete("/deleteFile",toolsController.deleteFile);
router.get("/files",authMiddleware,toolsController.getMongoDb);

module.exports = router;
// router.post("/delete", userController.login);
// router.get("/getFile",toolsController.getFileFromSubFolders);
