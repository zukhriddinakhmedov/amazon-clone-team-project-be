import express from "express";
import { getReviews } from "../../services/lib/fs-tools.js";
const reviewsRouter = express.Router();

reviewsRouter.get("/", async (req, res, next) => {
  const reviews = await getReviews();
  res.send(reviews);
});

export default reviewsRouter;
