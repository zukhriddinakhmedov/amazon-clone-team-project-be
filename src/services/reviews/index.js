import express from "express";
import uniqid from "uniqid";
import { getReviews, writeReviews } from "../../services/lib/fs-tools.js";
const reviewsRouter = express.Router();

//GET ALL REVIEWS
reviewsRouter.get("/", async (req, res, next) => {
  const reviews = await getReviews();
  res.send(reviews);
});

//POST A NEW REVIEW
reviewsRouter.post("/", async (req, res, next) => {
  try {
    const newReview = { ...req.body, createdAt: new Date(), id: uniqid() };
    const reviews = await getReviews();

    reviews.push(newReview);

    await writeReviews(reviews);

    res.status(201).send({ id: newReview.id });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//GET AN INDIVIDUAL REVIEW
reviewsRouter.get("/:reviewId", async (req, res, next) => {
  const reviews = getReviews();
  try {
    const review = reviews.find((r) => r.id === req.params.reviewId);
    if (review) {
      res.send(review);
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//EDIT A REVIEW

reviewsRouter.put("/:reviewId", async (req, res, next) => {
  const reviews = getReviews();

  try {
    const reviews = await getReviews();

    const index = reviews.findIndex((r) => r.id === req.params.reviewId);

    const reviewToModify = reviews[index];
    const updatedFields = req.body;

    const updatedReview = { ...reviewToModify, ...updatedFields };

    reviews[index] = updatedReview;

    await writeReviews(reviews);

    res.send(updatedReview);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//DELETE A REVIEW

reviewsRouter.delete("/:reviewId", async (req, res, next) => {
    try {
      const reviews = await getReviews()
  
      const remainingReviews = reviews.filter(r => r.id !== req.params.reviewId)
  
      await writeReviews(remainingReviews)
  
      res.status(204).send()
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
  })

export default reviewsRouter;
