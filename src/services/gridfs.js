const { GridFSBucket, ObjectId } = require("mongodb");
const { mongoose } = require("../db/mongoose");

function getBucket() {
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB not connected");
  return new GridFSBucket(db, { bucketName: "audio" });
}

async function uploadBuffer({ buffer, filename, contentType, metadata }) {
  const bucket = getBucket();
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata,
    });
    uploadStream.on("finish", (file) => resolve(file));
    uploadStream.on("error", reject);
    uploadStream.end(buffer);
  });
}

function openDownloadStream(fileId) {
  const bucket = getBucket();
  return bucket.openDownloadStream(new ObjectId(String(fileId)));
}

async function deleteFile(fileId) {
  const bucket = getBucket();
  return bucket.delete(new ObjectId(String(fileId)));
}

module.exports = { uploadBuffer, openDownloadStream, deleteFile };
