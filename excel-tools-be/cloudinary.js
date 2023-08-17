require('dotenv').config() //.config will look for the .env file and load all the var inside into the runtime environment. runtime env is contained in process.env
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
  });
  
  // Log the configuration
  console.log(cloudinary.config());
  
  // Store the folder name generated based on the time stamp - this might be helpful if we want to to check the files. at a different time will have a different folder
  const nestedFolderPath = Date.now()

  // Uploads a file
  const uploadFile = async (filePath) => {
  
    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      folder:`excels/${nestedFolderPath}`,
      unique_filename: false,
      overwrite: true,
      resource_type:"raw"
    };
  
    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(filePath, options);
      console.log(result);
      // console.log("secure url to download -> ",result.secure_url)
      return result.public_id;
    } catch (error) {
      console.error(error);
    }
  };

  
  const functionToUploadFiles = async () => {
    //single file
    // Set the file to upload
    // const filePath = '/Volumes/Extreme SSD/testing excel/testing123.xlsx';
    // Upload the raw file
    // const publicId = await uploadFile(filePath);

    const bulkUploadFiles = [
        '/Volumes/Extreme SSD/testing excel/testing123.xlsx',
        '/Volumes/Extreme SSD/testing excel/testing234.xlsx'
      ]

    for (let x=0; x < bulkUploadFiles.length; x++) {
      await uploadFile(bulkUploadFiles[x])
    }
  
  };  

  functionToUploadFiles()

  // Getting Folders available in Cloudinary
  const retrieveFolders = async() => {
    try {
      const folders = await cloudinary.api.root_folders();
      console.log(folders)
    } catch (error) {
      console.log("error:",error)
    }
  }
  // retrieveFolders()




// module.exports= Cloudinary