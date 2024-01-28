import asyncHandler from "express-async-handler";
import ErrorResponse from "../messages/ErrorMessage";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import Movie from "../models/movies/Movie";

// @route   GET /api/v1/movies
// @desc    Get All Movies
// @access  Public
const getAllMovies = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(String(page), 10),
    limit: parseInt(String(limit), 10),
  };

  const result = await Movie.paginate({}, options);

  res.status(200).json({
    success: true,
    data: result.docs,
    totalPages: result.totalPages,
    currentPage: result.page,
    totalCount: result.totalDocs,
  });
});

// @route   GET /api/v1/movies/genre/:genre
// @desc    Get All Movies
// @access  Public
const getAllMoviesByGenre = asyncHandler(async (req, res, next) => {
  // const { limit = 10 } = req.query;

  const limit: number = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;

  const movies = await Movie.find({ genre: req.params.genre }).limit(limit);

  res.status(200).json({
    success: true,
    count: movies.length,
    data: movies,
  });
});

// @route   GET /api/v1/movies/:id
// @desc    Get Single Movie
// @access  Public
const getMovie = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findOne({ _id: req.params.movieId });

  if(!movie){
    return next(new ErrorResponse(`No movie with the id ${req.params.movieId} was found`, 400))
  }

  res.json({ success: true, data: movie });
});

// @route   POST /api/v1/movies/
// @desc    Create Movie
// @access  Public
const createMovie = asyncHandler(async (req, res, next) => {
  const { title, description, genre } = req.body;

  if (!title || !description || !genre) {
    return next(new ErrorResponse(`Title, Genre and Description is required`, 400));
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

    const videoPosterUploadResult = await s3
      .upload(moviePosterParams)
      .promise();
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
    subtitle: subtitleUrl,
  };

  const movie = await Movie.create(movieData);

  res.status(200).json({ success: true, data: movie });
});

// @route   GET /api/v1/movies/search?title='A title'
// @desc    Get Single Movies
// @access  Public
const searchMovie = asyncHandler(async (req, res, next) => {
  const { title } = req.query;

  const regexPattern = new RegExp(String(title), "i");

  const movie = await Movie.find({ title: regexPattern });

  res.status(200).json({ success: true, data: movie });
});

// @route   GET /api/v1/movies/comment/:movieId
// @desc    Add Comment to a Movie
// @access  Public

const addCommentToMovie = asyncHandler(async (req, res, next) => {
  const { movieId } = req.params;

  const commentData = {
    comment: req.body.comment
  }

  const movie = await Movie.findById({ _id: movieId });

  if(!movie){
    return next(new ErrorResponse(`Movie with id ${movieId} not found`, 400));
  }

  movie.comments.unshift(commentData);

  const updatedMovie = await movie.save();

  res.status(200).json({ success: true, data: updatedMovie });
});

export { createMovie, getAllMovies, getMovie, searchMovie, getAllMoviesByGenre, addCommentToMovie };
