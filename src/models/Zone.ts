import { Schema, model } from "mongoose";
import { SHIPMENT_TYPES } from "../constants";

const ZoneSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "UserId is required"]
    },
    zone: {
        type: String,
        required: [true, "Zone is required"]
    },
    shipping_type: {
        type: String,
        enum: [SHIPMENT_TYPES.INTERNATIONAL, SHIPMENT_TYPES.INTERSTATE],
        required: [true, "Shipping Type for zone is required"]
    },
    countries: {
        type: [String],
        required: [true, "At least One country is required"]
    }
});

const Zone = model("zone", ZoneSchema);

export default Zone;


