import { Schema, model, Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const SongSchema = new Schema({
  type: {
    type: String,
    required: [true, "Song type is required"],
    enum: ["single", "album"],
  },
  title: {
    type: String,
    required: [true, "Song Title is required"],
  },
  artist: {
    type: String,
    required: [true, "Artist is required"],
  },
  genre: {
    type: String,
    required: [true, "Song Genre is required"],
  },
  songUrl: {
    type: String,
  },
  image: {
    type: String,
    required: [true, "Image Thumbnail is required"],
  },
});

SongSchema.plugin(mongoosePaginate);

interface SongDocument extends Document {
  type: string
  title: string
  genre: string
  songUrl: string
  image: string;
}

interface SongModel extends Model<SongDocument> {
  paginate(
    query: object,
    options: object
  ): Promise<{
    docs: SongDocument[];
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

const Song = model<SongDocument, SongModel>("song", SongSchema);

export default Song;
