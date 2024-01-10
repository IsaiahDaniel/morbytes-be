import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_SECRET_KEY
  cloud_name: "dirrcwgfj",
  api_key: "696845768755687",
  api_secret: "qZ9uep_DrX54u2pyUL8oPGhxelo"
});

export default cloudinary;