// *********************** ENDPOINTS DEDICATED TO REVIEWS ************************

// 1. CREATE --> POST http://localhost:3001/reviews (+ body)
// 2. READ --> GET http://localhost:3001/reviews (+ optional Query Parameters)
// 3. READ --> GET http://localhost:3001/reviews/:reviewsId
// 4. UPDATE --> PUT http://localhost:3001/reviews/:reviewsId (+ body)
// 5. DELETE --> DELETE http://localhost:3001/reviews/:reviewsId

import express from "express"
import uniqid from "uniqid"

import { getReviews, writeReviews } from "../lib/fs-tools.js"

const reviewsRouter = express.Router()

//POST ROUTE
reviewsRouter.post("/", async (req, res, next) => {
    try {
  
        const newReview = { ...req.body, createdAt: new Date(), id: uniqid() }

        const reviews = await getReviews()
  
        reviews.push(newReview)
  
        await writeReviews(reviews)
  
        res.status(201).send({ id: newReview.id })
      
    } catch (error) {
      next(error)
    }
  })

reviewsRouter.get("/", async (req, res, next) => {
    try {
        const reviews = await getReviews(
            res.send(reviews)
        )
    } catch (error) {
        next(error)
    }
})

  export default reviewsRouter