const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require("path");
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs')
const appRoot = require('app-root-path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const pathAdmin = `${appRoot}/src/api/public/uploads/admins/`;
const pathUser = `${appRoot}/src/api/public/uploads/users/`;
const pathProduct = `${appRoot}/src/api/public/uploads/products/`;
const pathCategory = `${appRoot}/src/api/public/uploads/categorys/`;

// Function Validate extFile
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Function Check Duplicate Name
const handleDuplicateNames = (fileFull, pathData) => {
    let baseName = path.basename(fileFull, path.extname(fileFull))
    let extName = path.extname(fileFull)
    fileExists = fs.existsSync(`${pathData}${baseName}${extName}`);
    return fileExists ? fileName = `${baseName}_${Date.now()}${extName}` : fileName = fileFull
}

// Function Upload Single Photo
const storageUploadSinglePhoto = (name, model) => {
    let pathImage

    pathImage = model === 'category' ? pathCategory : pathImage
    pathImage = model === 'user' ? pathUser : pathImage
    pathImage = model === 'admin' ? pathAdmin : pathImage

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, pathImage)
        },
        filename: (req, file, cb) => {
            let fileName = handleDuplicateNames(file.originalname, pathImage)
            cb(null, fileName)
        }
    })
    return multer({ storage: storage, fileFilter: imageFilter }).single(name)
}

// Function Upload Single and Multiple Photo Product
const storageUploadMultiplePhoto = (model, nameSingle, nameMultiple) => {
    let pathImage
    pathImage = model === 'product' ? pathProduct : pathImage

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, pathImage)
        },
        filename: (req, file, cb) => {
            let fileName = handleDuplicateNames(file.originalname, pathImage)
            cb(null, fileName)
        }
    })
    return multer({ storage: storage, fileFilter: imageFilter }).fields([{ name: nameSingle }, { name: nameMultiple }])
}

// Upload Image category
const storageImageCategory = new CloudinaryStorage({
    cloudinary,
    allowFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    params: {
        folder: 'FamilyPet/categorys',
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const uploadImageCategory = multer({ storage: storageImageCategory })

// Upload Image Product (Single and Multiple)
const storageImageProduct = new CloudinaryStorage({
    cloudinary,
    allowFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    params: {
        folder: 'FamilyPet/products',
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const uploadImageProduct = multer({ storage: storageImageProduct })

// Upload Image Admin
const storageImageAdmin = new CloudinaryStorage({
    cloudinary,
    allowFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    params: {
        folder: 'FamilyPet/admins',
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const uploadImageAdmin = multer({ storage: storageImageAdmin })

// Upload Image User
const storageImageUser = new CloudinaryStorage({
    cloudinary,
    allowFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    params: {
        folder: 'FamilyPet/users',
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const uploadImageUer = multer({ storage: storageImageUser })

module.exports = {
    uploadImageCategory,
    uploadImageProduct,
    uploadImageAdmin,
    uploadImageUer,

    storageUploadSinglePhoto,
    storageUploadMultiplePhoto,
}