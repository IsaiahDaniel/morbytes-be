import multer from "multer";

const MIME_TYPE: any = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

// const storage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     const name = file.originalname.toLowerCase().split(" ").join("-");
//     const ext = MIME_TYPE[file.mimetype];

//     console.log("Multer ran....");

//     cb(null, name + Date.now() + "." + ext);
//   },
// });

// const storage = multer.diskStorage({});

// const storage = multer.memoryStorage({
//   destination: function (req, file, cb) {
//     cb(null, "");
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({ storage });


export default upload;

