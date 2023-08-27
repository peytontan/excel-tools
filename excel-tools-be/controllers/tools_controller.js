require('dotenv').config()
// const cloudinary = require('cloudinary').v2;
const {cloudinary} = require('../cloudinary_config')
const fileModel = require("../models/file_model")
const jwt = require("jsonwebtoken");
const axios =  require("axios");



const toolsControllers = {
    uploadFile: async (req, res) => {
        const userID = res.locals.authUserID;
        // console.log("current user: ",userID)
        
        const nestedFolderPath = Date.now();

        const options = {
          use_filename: true,
          folder: `excels/${nestedFolderPath}`,
          unique_filename: false,
          overwrite: true,
          resource_type: "raw",
        };
    
        try {
            // checking to make sure that there are files uploaded
          if (!req.files || !req.files.data) {
            return res.status(400).json({ error: "No file uploaded" });
          } 
          
          let uploadedFile = req.files.data;
          if (uploadedFile.length === undefined) {
              uploadedFile = [uploadedFile]; // Convert to an array if there's only one item or else it will just be an object
            }

          for (let x = 0; x < uploadedFile.length; x++){
            // upload each file 1 by 1 to the nestedFolderPath
            const result = await cloudinary.uploader.upload(
                uploadedFile[x].tempFilePath,
                options
                );
                await fileModel.create({
                    fileName: uploadedFile[x].name,
                    assetId: result.asset_id,
                    folderPath: result.folder,
                    filePublicId: result.public_id,
                    secureUrl: result.secure_url,
                    userID: userID
                });
        }
        res.status(200).json({ msg: "Successfully uploaded" , folder:nestedFolderPath});
        } catch (error) {
          console.error("Error:", error);
          res.status(500).json({ err: "Failed to upload" });
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
    deleteFile: async (req,res) => {
        fileNamePublicId = req.params.assetId
        console.log(fileNamePublicId)
        try {
            const file = await cloudinary.api.delete_resources([fileNamePublicId],{type:"upload",resource_type:"raw"})
            await fileModel.deleteOne({filePublicId:fileNamePublicId})
            // console.log(file)
            res.status(200).json({msg:"successfully deleted"})
        } catch (error) {
            console.log("error:",error)
            res.status(500).json({msg:"failed to delete"})
        }
    },
    getFilesFromSubFolder: async (req,res) => {
      // const userID = res.locals.authUserID;

      folderName = req.params.folderPath
      
      console.log(folderName)
      try {
          const file = await cloudinary.api.resources({type:"upload",resource_type:"raw",prefix:`excels/${folderName}`})
          // console.log(file)
          res.status(200).json({msg:"successfully retrieved files from sub folder"})
      } catch (error) {
          console.log("error:",error)
          res.status(500).json({msg:"failed to retrieve files from subfolder"})
      }
    },
    getMongoDb: async (req,res) => {
        const userID = res.locals.authUserID;  
        try {
        const userFiles = await fileModel.find({ userID: userID });
        return res.status(200).json(userFiles);
        } catch (error) {
        console.error(error);
        return res.status(400).json({ msg: "An error occurred, please try again" });
        }
    },
    getMergedFileFromSubFolder: async (req,res) => {
      folderName = req.params.file
      
      console.log(folderName)
      try {
          const file = await cloudinary.api.resources({type:"upload",resource_type:"raw",prefix:`excels/${folderName}/stream_`})
          // const file = await cloudinary.api.resources({type:"upload",resource_type:"raw",prefix:`excels/${folderName}/Merged_Excel_File`})
          // console.log(file['resources'][0].secure_url)
          merged_file_secure_url = file['resources'][0].secure_url
          let fileName = "Merged Excel"
        
          const response = await axios({
            method: 'get',
            url: merged_file_secure_url,
            responseType: 'arraybuffer', // Set the response type to arraybuffer
          });

          res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
          res.setHeader('Content-Type', response.headers['content-type']); // Set the Content-Type based on the fetched file
          res.send(response.data); // Send the response data
          // res.status(200).json({msg:response.data})
      } catch (error) {
          console.log("error:",error)
          res.status(500).json({msg:"failed to retrieve files from subfolder"})
      }
    },
    getRawFileFromSubFolder: async (req,res) => {
      fileNamePublicId = req.params.publicId

      
      console.log(fileNamePublicId)
      try {
          const file = await cloudinary.api.resources({type:"upload",resource_type:"raw",prefix:fileNamePublicId})
          // console.log(file['resources'][0].secure_url)
          merged_file_secure_url = file['resources'][0].secure_url
          // let fileName = "Merged Excel"
        
          const response = await axios({
            method: 'get',
            url: merged_file_secure_url,
            responseType: 'arraybuffer', // Set the response type to arraybuffer
          });

          res.setHeader('Content-Disposition', 'attachment');
          res.setHeader('Content-Type', response.headers['content-type']); // Set the Content-Type based on the fetched file
          res.send(response.data); // Send the response data
          // res.status(200).json({msg:response.data})
      } catch (error) {
          console.log("error:",error)
         res.status(500).json({msg:"failed to retrieve files from subfolder"})
      }
    },
    }

module.exports = toolsControllers