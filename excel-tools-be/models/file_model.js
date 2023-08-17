const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const fileSchema = new mongoose.Schema(
    {
        assetId:  { type: String, required: true },
	    fileName:  { type: String, required: true },
        filePublicId: { type: String, required: true },
        folderPath: {type:String, required:true},
        secureUrl: {type:String, required:true},
        userID: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
            required: true,
          },
    },
    {
        timestamps: true
    }
)

const ExcelFiles = mongoose.model('ExcelFiles', fileSchema)

module.exports = ExcelFiles
