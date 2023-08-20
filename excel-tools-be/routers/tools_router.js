const express = require("express");
const router = express.Router();
const toolsController = require("../controllers/tools_controller");
const authMiddleware = require("../middlewares/auth_middleware");


router.post("/upload",authMiddleware,toolsController.uploadFile);
router.get("/getMainFolders",authMiddleware,toolsController.getMainFolders);
router.get("/getSubFolders",authMiddleware,toolsController.getSubFolders);
router.delete("/deleteFile/:assetId",authMiddleware,toolsController.deleteFile);
router.get("/files",authMiddleware,toolsController.getMongoDb);
router.get("/folderFiles/:folderPath",authMiddleware,toolsController.getFilesFromSubFolder);
router.get("/mergedFile/:file",authMiddleware,toolsController.getMergedFileFromSubFolder);
router.get("/rawFile/:publicId",authMiddleware,toolsController.getRawFileFromSubFolder);

module.exports = router;

