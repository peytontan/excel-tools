require('dotenv').config()
// const cloudinary = require('cloudinary').v2;
const {cloudinary} = require('../cloudinary_config')
const fileModel = require("../models/file_model")
// const multer= require('multer')
// const storage = multer.memoryStorage(); // Use memory storage for multer
// const upload = multer({ storage: storage });

const toolsControllers = {
    uploadFile: async (req,res) =>{    
    const nestedFolderPath = Date.now()
        const options = {
            use_filename: true,
            folder:`excels/${nestedFolderPath}`,
            unique_filename: false,
            overwrite: true,
            resource_type:"raw",
            };

        try {
            const file = req.body.data
            const result = await cloudinary.uploader.upload(file, options);
            console.log(result);

            await fileModel.create({
                fileName:result.asset_id,
                folderPath: result.folder,
                filePublicId:result.public_id,
                secureUrl:result.secure_url,
            })
            res.status(200).json({"msg":"successfully uploaded"})
        } catch (error) {
            console.error("error:",error);
            // console.log(req.file.buffer)
            res.status(500).json({err:"failed to upload"})
        }
    },
    getMainFolders: async (req,res) => {
        try {
            const folders = await cloudinary.api.root_folders();
            // console.log("folders->",folders.folders)
            res.status(200).json({folders:folders.folders})
          } catch (error) {
            console.log("error:",error)
          }
        },
    getSubFolders: async (req,res) =>{
        try {
            const folders = await cloudinary.api.sub_folders("excels");
            // console.log("folders->",folders)
            res.status(200).json({subFolder:folders.folders})
          } catch (error) {
            console.log("error:",error)
          }
    },
    // getFileFromSubFolders: async (req,res) =>{
    //     try {
    //         const folders = await cloudinary.api.resources_by_asset_folder("excels/1692104260493");
    //         console.log("folders->",folders)
    //         // res.status(200).json({test:folders.folders})
    //       } catch (error) {
    //         console.log("error:",error)
    //       }
    // }
    deleteFile: async (req,res) => {
        fileNamePublicId = req.body.file
        try {
            const file = await cloudinary.api.delete_resources([fileNamePublicId],{type:"upload",resource_type:"raw"})
            console.log(file)
            res.status(200).json({msg:"successfully deleted"})
        } catch (error) {
            console.log("error:",error)
            res.status(500).json({msg:"failed to delete"})
        }
    },
}

module.exports = toolsControllers