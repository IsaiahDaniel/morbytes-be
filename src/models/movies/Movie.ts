import { Schema, model, Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const commentSchema = new Schema({
  comment: String 
});

const MovieSchema: any = new Schema({
  title: {
    type: String,
    required: [true, "Movie Title is required"],
  },
  description: {
    type: String,
    required: [true, "Movie Description is required"],
  },
  genre: {
    type: String,
    required: [true, "Movie Genre is required"],
  },
  comments: [commentSchema],
  videoUrl: String,
  subtitle: String,
  poster: String,
});

interface MovieDocument extends Document {
  title: string;
  description: string;
  videoUrl: string;
  subtitle: string;
  poster: string;
  comments: [{ comment: string }]
}

interface MovieModel extends Model<MovieDocument> {
  paginate(
    query: object,
    options: object
  ): Promise<{
    docs: MovieDocument[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  }>;
}

MovieSchema.plugin(mongoosePaginate);

const Movie = model<MovieDocument, MovieModel>("movie", MovieSchema);

export default Movie;
