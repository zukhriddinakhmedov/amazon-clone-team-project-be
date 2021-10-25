import express from "express";
import uniqid from "uniqid";

import createHttpError from "http-errors";
import { validationResult } from "express-validator";

import { getReviews, writeReviews } from "../../services/lib/fs-tools.js";

//GET ALL REVIEWS
export const getProductReviews = async (req, res, next) => {
  try {
    if (req.params.productID) {
      const productReviews = await getReviews();
      const reviews = productReviews.filter(
        (review) => review.productId === req.params.productID
      );
      res.status(200).send(reviews);
    } else {
      next(
        createHttpError(
          404,
          `Reviews not found for the ${req.params.productID}`
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

//POST A NEW REVIEW
export const createNewReview = async (req, res, next) => {
  const errorList = validationResult(req);
  try {
    if (!errorList.isEmpty) {
      next(createHttpError(400, { errorList }));
    }

    if (req.params.productID) {
      const reviews = await getReviews();

      const newReview = {
        _id: uniqid(),
        ...req.body,
        productId: req.params.productID,
        createdAt: new Date(),
      };

      reviews.push(newReview);
      await writeReviews(reviews);

      res.status(200).send(newReview);
    }
  } catch (error) {
    next(error);
  }
};

//GET AN INDIVIDUAL REVIEW

export const individualReview = async (req, res, next) => {
  try {
    const getProductReviews = await getReviews();
    const reviewWithId = getProductReviews.find(
      (review) =>
        review.productId === req.params.productID &&
        review._id === req.params.reviewId
    );
    if (reviewWithId) {
      res.send(reviewWithId);
    } else {
      next(
        createHttpError(404, `Review with ${req.params.reviewId} is not found`)
      );
    }
  } catch (error) {
    next(error);
  }
};

//EDIT A REVIEW

export const editReview = async (req, res, next) => {
  try {
    const productReviews = await getReviews();

    const index = productReviews.findIndex(
      (r) => r._id === req.params.reviewId
    );

    const reviewToModify = productReviews[index];

    if (reviewToModify) {
      const updates = {
        ...reviewToModify,
        ...req.body,
        updatedAt: new Date(),
      };

      productReviews[index] = updates;

      await writeReviews(productReviews);
      res.status(200).send(updates);
    } else {
      next(createHttpError(400, `product cannot be edited`));
    }
  } catch (error) {
    next(error);
  }
};

//DELETE A REVIEW

export const deleteReview = async (req, res, next) => {
  try {
    const productReviews = await getReviews();
    const remainingReviews = productReviews.filter(
      (review) => review._id !== req.params.reviewId
    );

    await writeReviews(remainingReviews);
    res.status(200).send(remainingReviews);
  } catch (error) {
    next(error);
  }
};
