
const multerS3 = require('multer-s3');
const multer = require("multer");
const aws = require("aws-sdk")

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET,
    accessKeyId: process.env.AWS_KEY
});
var s3 = new aws.S3();
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET,
        ACL : "public-read",
        fileFilter: (req, file, cb) => {
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
              cb(null, true);
            } else {
              cb(null, false);
              return cb(new Error('Invalid File Format: Only .png, .jpg and .jpeg format allowed!'));
            }
        },
        key: function (req, file, cb) {
            console.log("File upload ------>",file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});

module.exports = {
    upload : upload
}