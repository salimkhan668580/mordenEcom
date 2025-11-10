const multer = require('multer');

const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')
const dotenv = require('dotenv');
dotenv.config();
exports.generateOtp=()=>{
    return Math.floor(1000 + Math.random() * 9000);
}


const s3 = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_BUCKET_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_BUCKET_SECRET_ACCESS_KEY,
  },
})

exports.uploadImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }),

  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, .png formats are allowed!"), false);
    }
  },

  limits: { fileSize: 5 * 1024 * 1024 }, 
});