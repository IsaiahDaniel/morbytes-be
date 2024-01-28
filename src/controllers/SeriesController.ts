import asyncHandler from "express-async-handler";
import ErrorResponse from "../messages/ErrorMessage";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import Series from "../models/Series/Series";

// @route   GET /api/v1/series
// @desc    Get All series
// @access  Private
const getAllSeries = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  // GET /api/series?page=2&limit=5

  // const options = {
  //   page: parseInt(page, 10),
  //   limit: parseInt(limit, 10),
  // };

  const options = {
    page: parseInt(String(page), 10), // Use String() to ensure type compatibility
    limit: parseInt(String(limit), 10),
  };

  const result = await Series.paginate({}, options);

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
const getAllSeriesByGenre = asyncHandler(async (req, res, next) => {
  // const { limit = 10 } = req.query;

  const limit: number = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;

  const movies = await Series.find({ genre: req.params.genre }).limit(limit);

  res.status(200).json({
    success: true,
    count: movies.length,
    data: movies,
  });
});

// @route   GET /api/v1/series
// @desc    Get A serie
// @access  Private
const getSeries = asyncHandler(async (req, res, next) => {
  const { seriesId } = req.params;

  const series = await Series.findOne({ _id: seriesId });

  if (!series) {
    return next(
      new ErrorResponse(
        `No Series with the id ${req.params.seriesId} was found`,
        400
      )
    );
  }

  res.status(200).json({ success: true, data: series });
});

// @route   GET /api/v1/series
// @desc    Create A series
// @access  Private
const createSeries = asyncHandler(async (req, res, next) => {
  const { series_title, series_description } = req.body;

  if (!series_description || !series_title) {
    return next(
      new ErrorResponse(`Series Description and Series title is required`, 400)
    );
  }

  if (!req.file) {
    return next(new ErrorResponse(`Please Upload a file`, 400));
  }

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const file = req.file.originalname.split(".");
  const fileExt = file[file.length - 1];

  const posterParams: any = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `posters/${uuidv4()}${Math.random()}.${fileExt}`,
    Body: (req.file as any).buffer,
    ContentType: (req.file as any).mimetype,
  };

  s3.upload(posterParams, async (error: any, data: any) => {
    if (error) {
      console.log("error", error);
      return new ErrorResponse("File Upload Error", 500);
    }

    const seriesData = {
      series_title,
      series_description,
      series_poster: data.Location,
    };

    const series = await Series.create(seriesData);

    res.status(201).json({ success: true, data: series });
  });
});

// @route   GET /api/v1/series
// @desc    Update A series
// @access  Private
const updateSeries = asyncHandler(async (req, res, next) => {
  const { season_number, title } = req.body;

  if (!season_number || !title) {
    return next(new ErrorResponse(`Season Number and title is required`, 400));
  }

  if ((!req.files as any)?.video || (!req.files as any).subtitle) {
    return next(new ErrorResponse(`Please upload a video and subtitle`, 400));
  }

  if ((req.files as any).subtitle[0].mimetype != "application/x-subrip") {
    return next(
      new ErrorResponse(
        `Only srt subtitle files (application/x-subrip) are allowed`,
        400
      )
    );
  }

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  let subtitleUrl, episodeUrl;

  const subtitlefile = (req.files as any)?.subtitle[0].originalname.split(".");
  const videofile = (req.files as any)?.video[0].originalname.split(".");

  const subtitlefileExt = subtitlefile[subtitlefile.length - 1];
  const videofileExt = videofile[videofile.length - 1];

  if ((req.files as any).video) {
    const episodesParams: any = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `episodes/${uuidv4()}${Math.random()}.${videofileExt}`,
      Body: (req.files as any).video[0].buffer,
      ContentType: (req.files as any).video[0].mimetype,
    };

    const videoUploadResult = await s3.upload(episodesParams).promise();
    episodeUrl = videoUploadResult.Location;
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

  const { seriesId } = req.params;

  const series = await Series.findOne({ _id: seriesId });

  const episodeData: any = {
    season_number,
    episodes: [{ title, movieUrl: episodeUrl, episode_subtitle: subtitleUrl }],
  };

  series?.seasons.unshift(episodeData);

  await series?.save();

  res.status(200).send({ success: true, data: series });
});

// @route   GET /api/v1/series/:seriesId/:seasonId
// @desc    Add Episodes to a season
// @access  Private
const updateSeasonEpisodes = asyncHandler(async (req, res, next) => {
 
  const { title } = req.body;

  if (!title) {
    return next(new ErrorResponse(`Episode Title is required`, 400));
  }

  // if ((!req.files as any)?.video || (!req.files as any).subtitle) {
  if ((!req.files as any)?.video) {
    return next(new ErrorResponse(`Please upload a video and subtitle`, 400));
  }

  if ((req.files as any).subtitle) {
    if ((req.files as any).subtitle[0].mimetype != "application/x-subrip") {
      return next(
        new ErrorResponse(
          `Only srt subtitle files (application/x-subrip) are allowed`,
          400
        )
      );
    }
  }

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  let subtitleUrl, episodeUrl;

  const subtitlefile = (req.files as any)?.subtitle ? (req.files as any)?.subtitle[0].originalname.split(".") : "";
  const subtitlefileExt = (req.files as any)?.subtitle ? subtitlefile[subtitlefile.length - 1] : "";

  const videofile = (req.files as any)?.video[0].originalname.split(".");
  const videofileExt = videofile[videofile.length - 1];

  if ((req.files as any).video) {
    const episodesParams: any = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `episodes/${uuidv4()}${Math.random()}.${videofileExt}`,
      Body: (req.files as any).video[0].buffer,
      ContentType: (req.files as any).video[0].mimetype,
    };

    const videoUploadResult = await s3.upload(episodesParams).promise();
    episodeUrl = videoUploadResult.Location;
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

  const { seasonId, seriesId } = req.params;

  const series = await Series.findOne({ _id: seriesId });

  const selectedSeason: any = series?.seasons.find(
    (season: any) => season._id == seasonId
  );

  if (!selectedSeason) {
    return next(new ErrorResponse(`Could not find series`, 400));
  }

  const newEpisode: any = {
    title: title,
    movieUrl: episodeUrl,
    episode_subtitle: subtitleUrl,
  };

  selectedSeason.episodes.unshift(newEpisode);

  await series?.save();
  
  res.status(200).send({ success: true, data: series });

});

// @route   GET /api/v1/series/search?title='Avatar'
// @desc    Add Episodes to a season
// @access  Private
const searchSeries = asyncHandler(async (req, res, next) => {
  const { title } = req.query;

  const regexPattern = new RegExp(String(title), "i");

  const series = await Series.find({ series_title: regexPattern });

  res.status(200).json({
    success: true,
    count: series.length,
    data: series,
  })

});

// @route   GET /api/v1/series/bySeason/:seasonId
// @desc    Get Season Episodes by a season
// @access  Public

const getSeriesBySeason = asyncHandler(async (req, res, next) => {
  const { seriesId } = req.params;

  if(!seriesId){
    return next(new ErrorResponse(`No series with the id ${seriesId} was found`, 400))
  }

  const series = await Series.find({
    _id: seriesId, 
    'seasons': { $elemMatch: { 'season_number': req.body.seasonNumber }}
  });

  res.status(200).json({
    success: true,
    count: series.length,
    data: series,
  });

});

export {
  createSeries,
  updateSeries,
  getSeries,
  getAllSeries,
  updateSeasonEpisodes,
  searchSeries,
  getSeriesBySeason,
  getAllSeriesByGenre
};
