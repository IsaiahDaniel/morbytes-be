import asyncHandler from "express-async-handler";
import ErrorResponse from "../messages/ErrorMessage";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import Movie from "../models/Movie";

const getAllMovies = asyncHandler(async (req, res, next) => {
  const movies = await Movie.find();

  res.json({ success: true, data: movies });

});

const getMovie = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findOne({ _id: req.params.movieId });

  res.json({ success: true, data: movie });

});

const createMovie = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return next(new ErrorResponse(`Title and Description is required`, 400));
  }

  let posterUrl, videoUrl, subtitleUrl;

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const posterfile = (req.files as any)?.poster[0].originalname.split(".");
  const subtitlefile = (req.files as any)?.subtitle[0].originalname.split(".");
  const videofile = (req.files as any)?.video[0].originalname.split(".");

  const posterfileExt = posterfile[posterfile.length - 1];
  const subtitlefileExt = subtitlefile[subtitlefile.length - 1];
  const videofileExt = videofile[videofile.length - 1];


  if ((req.files as any).poster) {
    const moviePosterParams: any = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `posters/${uuidv4()}${Math.random()}.${posterfileExt}`,
      Body: (req.files as any).poster[0].buffer,
      ContentType: (req.files as any).poster[0].mimetype,
    };

    const videoPosterUploadResult = await s3.upload(moviePosterParams).promise();
    posterUrl = videoPosterUploadResult.Location;
  }

  if ((req.files as any).subtitle) {
    const subtitleParams: any = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `subtitle/${uuidv4()}${Math.random()}.${subtitlefileExt}`,
      Body: (req.files as any).subtitle[0].buffer,
      ContentType: (req.files as any).subtitle[0].mimetype,
    };

    const subtitleUploadResult = await s3.upload(subtitleParams).promise();
    subtitleUrl = subtitleUploadResult.Location;
  }

  if ((req.files as any).video) {
    const movieParams: any = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `movies/${uuidv4()}${Math.random()}.${videofileExt}`,
      Body: (req.files as any).video[0].buffer,
      ContentType: (req.files as any).video[0].mimetype,
    };

    const movieUploadResult = await s3.upload(movieParams).promise();
    videoUrl = movieUploadResult.Location;
  }

  const movieData = {
    title,
    description,
    poster: posterUrl,
    videoUrl: videoUrl,
    subtitle: subtitleUrl
  }

  const movie = await Movie.create(movieData);

  res.status(200).json({ success: true, data: movie });

});

export { createMovie, getAllMovies, getMovie };