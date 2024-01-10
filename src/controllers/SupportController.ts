import asyncHandler from "express-async-handler";
import Support from "../models/Support";
import ErrorResponse from "../messages/ErrorMessage";
import cloudinary from "../lib/utils/cloudinary";

const createSupportTicket = asyncHandler(async (req, res, next) => {
  const { title, ticket_type, description } = req.body;

  if (req.file?.path) {
    cloudinary.uploader.upload(
      (req.file as any).path,
      async function (err: any, result: any) {
        if (err) {
          return next(new ErrorResponse(`File Upload Error`, 400));
        }

        const ticketData = {
          user: req.user.id,
          title,
          ticket_type,
          description,
          image: result.url,
        };

        const supportTicket = await Support.create(ticketData);

        res.status(201).json({ success: true, data: supportTicket });
      }
    );
  }
  
  const ticketData = {
    user: req.user.id,
    title,
    ticket_type,
    description,
    // image: result.url,
  };

  const supportTicket = await Support.create(ticketData);

  res.status(201).json({ success: true, data: supportTicket });
});

const getSupportTickets = asyncHandler(async (req, res, next) => {
  const { ticket_type } = req.query;

  console.log("req.user", req.user);

  const tickets = await Support.find({ ticket_type: ticket_type, user: req.user.id }).populate(
    "user"
  );

  res.status(200).json({ success: true, data: tickets });
});

const getSupportTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Support.findOne({ _id: req.params.id, user: req.user.id });

  if (!ticket) {
    return next(new ErrorResponse(`No ticket with id ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: ticket });
});

export { createSupportTicket, getSupportTickets, getSupportTicket };
