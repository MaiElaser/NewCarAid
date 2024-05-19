const mongoose = require("mongoose");
const upload = require('../config/multerConfig');


const uploadedFileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const UploadedFile = mongoose.model("UploadedFile", uploadedFileSchema);

module.exports = UploadedFile;
