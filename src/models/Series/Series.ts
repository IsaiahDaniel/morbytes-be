import { Schema, model, Document, Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const episodeSchema = new Schema({
  title: String,
  movieUrl: String,
  episode_subtitle: String,
});

const seriesSchema: any = new Schema({
  series_title: {
    type: String,
    required: [true, "Series Title is required"],
  },
  series_description: {
    type: String,
    required: [true, "Series Description is required"],
  },
  genre: {
    type: String,
    required: [true, "Series Genre is required"],
  },
  seasons: [
    {
      season_number: {
        type: String,
        required: [true, "Season Number is required"],
        unique: [true, "Every Season Must be unqiue"]
      },
      episodes: [episodeSchema],
    },
  ],
  series_poster: {
    type: String,
    // required: [true, "series Poster is required"],
  },
});

interface Episode {
  title: string;
  movieUrl: string;
  episode_subtitle: string;
}

interface Season {
  _id: any;
  season_number: string;
  episodes: Episode[];
}

interface SeriesDocument extends Document {
  series_title: string;
  series_description: string;
  seasons: Season[];
  series_poster: string;
}

interface SeriesModel extends Model<SeriesDocument> {
  paginate(
    query: object,
    options: object
  ): Promise<{
    docs: SeriesDocument[];
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

export interface ISeries extends Document {
  series_title: string;
  series_description: string;
  seasons: [
    {
      season_number: string;
      episodes: [{ title: string; movieUrl: String; episode_subtitle: String }];
    }
  ];
  series_poster: string;
}

seriesSchema.plugin(mongoosePaginate);

// const Series = model("series", seriesSchema);
const Series = model<SeriesDocument, SeriesModel>("series", seriesSchema);

export default Series;


