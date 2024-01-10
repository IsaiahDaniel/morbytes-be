import { Schema, model } from "mongoose";
import { ITEM_STATUS } from "../constants";

// Function to generate a random ID for ticket
const generateRandomId = () => {
  // Logic to generate a random ID (e.g., using a library or algorithm)
  // For simplicity, let's assume it's a random string of length 6
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomId = "";
  for (let i = 0; i < 6; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomId;
};

const supportSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: ITEM_STATUS.OPEN,
  },
  ticket_type: {
    type: String,
    required: [true, "Ticket type is required"],
  },
  ticketId: {
    type: String,
  },
  title: {
    type: String,
    required: [true, "Title of Ticket is required"],
  },
  description: {
    type: String,
    required: [true, "Description of Ticket is required"],
  },
  image: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

supportSchema.pre("save", function(next){
  if (!this.isNew || this.ticketId) {
    // If the ticket already has an ID, or the ID is provided, do nothing
    return next();
  }
  
  // Generate a random ticketId
  this.ticketId = generateRandomId();
  next();
});

const Support = model("support", supportSchema);

export default Support;
