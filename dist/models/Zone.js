"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../constants");
const ZoneSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "UserId is required"]
    },
    zone: {
        type: String,
        required: [true, "Zone is required"]
    },
    shipping_type: {
        type: String,
        enum: [constants_1.SHIPMENT_TYPES.INTERNATIONAL, constants_1.SHIPMENT_TYPES.INTERSTATE],
        required: [true, "Shipping Type for zone is required"]
    },
    countries: {
        type: [String],
        required: [true, "At least One country is required"]
    }
});
const Zone = (0, mongoose_1.model)("zone", ZoneSchema);
exports.default = Zone;
