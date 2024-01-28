import asyncHandler from "express-async-handler";
import Song from "../models/Songs/Song";
import AWS from "aws-sdk";
import ErrorResponse from "../messages/ErrorMessage";
import { v4 as uuidv4 } from "uuid";

// @route   GET /api/v1/songs
// @desc    Get All Songs
// @access  Public
const getSongs = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(String(page), 10),
    limit: parseInt(String(limit), 10),
  };

  const result = await Song.paginate({}, options);

  res.status(200).json({
    success: true,
    data: result.docs,
    totalPages: result.totalPages,
    currentPage: result.page,
    totalCount: result.totalDocs,
  });
});

// @route   GET /api/v1/songs/:id
// @desc    Get Single Songs
// @access  Public

const getSong = asyncHandler(async (req, res, next) => {
  const song = await Song.findOne({ _id: req.params.id });

  if (!song) {
    return next(
      new Error(`No Song with the id ${req.params.id} was found on our server`)
    );
  }

  res.status(200).json({ success: true, data: song });
});

// @route   PATCH /api/v1/songs/:id
// @desc    Update a Single Song
// @access  Public

const updateSong = asyncHandler(async (req, res, next) => {
  const song = await Song.findOne({ _id: req.params.id });

  if (!song) {
    return next(
      new Error(`No Song with the id ${req.params.id} was found on our server`)
    );
  }

  const updatedSong = await Song.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, data: updatedSong });
});

// @route   DELETE /api/v1/songs/:id
// @desc    Delete a Song
// @access  Public

const deleteSong = asyncHandler(async (req, res, next) => {
  const song = await Song.findOne({ _id: req.params.id });

  if (!song) {
    return next(
      new Error(`No Song with the id ${req.params.id} was found on our server`)
    );
  }

  const deletedSong = await Song.findOneAndDelete({ _id: req.params.id });

  res.status(200).json({ success: true, data: deletedSong });
});

// @route   POST /api/v1/songs
// @desc    Create a Song
// @access  Public

const createSong = asyncHandler(async (req, res, next) => {
  const { type, title, genre, artist } = req.body;

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  if(!(req.files as any).audio || !(req.files as any).image){
    return next(new ErrorResponse(`An Audio and Image File is required`, 400));
  }

  let audioUrl, imageUrl;

  const audiofile = (req.files as any)?.audio[0].originalname.split(".");
  const imagefile = (req.files as any)?.image[0].originalname.split(".");

  const audiofileExt = audiofile[audiofile.length - 1];
  const imagefileExt = imagefile[imagefile.length - 1];

  if ((req.files as any).audio) {
    const audioParams: any = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `audio/${uuidv4()}${Math.random()}.${audiofileExt}`,
      Body: (req.files as any).audio[0].buffer,
      ContentType: (req.files as any).audio[0].mimetype,
    };

    const audioUploadResult = await s3.upload(audioParams).promise();
    audioUrl = audioUploadResult.Location;
  }

  if ((req.files as any).image) {
    const imageParams: any = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `audioImages/${uuidv4()}${Math.random()}.${imagefileExt}`,
      Body: (req.files as any).image[0].buffer,
      ContentType: (req.files as any).image[0].mimetype,
    };

    const imageUploadResult = await s3.upload(imageParams).promise();
    imageUrl = imageUploadResult.Location;
  }

  const songData = {
    type,
    title,
    genre,
    artist,
    songUrl: audioUrl,
    image: imageUrl,
  };

  const song = await Song.create(songData);

  res.status(200).json({ success: true, data: song});
});

// @route   GET /api/v1/songs/search?title='loving you'
// @desc    Search For a Song
// @access  Public
const searchSong = asyncHandler(async (req, res, next) => {

  const title = req.query.title;

  const regexPattern = new RegExp(String(title), "i");

  const song = await Song.find({ title: regexPattern });

  res.status(200).json({ success: true, data: song });
});

export { getSongs, getSong, updateSong, deleteSong, createSong, searchSong };
