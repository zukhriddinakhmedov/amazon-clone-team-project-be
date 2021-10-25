import express, { query } from "express";
import path from "path";

import createHttpError from "http-errors";
import uniqid from "uniqid";
import multer from "multer";

import { getProducts, writeProducts } from "../../services/lib/fs-tools.js";
import { validationResult } from "express-validator";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  const errorList = validationResult(req);

  try {
    if (!errorList.isEmpty) {
      next(createHttpError(400, { errorList }));
    } else {
      const products = await getProducts();

      const newProduct = { _id: uniqid(), ...req.body, createdAt: new Date() };

      products.push(newProduct);

      await writeProducts(products);

      res.status(200).send(newProduct);
    }
  } catch (error) {}
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getProducts();

    if (req.query && req.query.name) {
      const filteredProducts = products.filter(
        (p) => p.name.toLowerCase() === req.query.name.toLowerCase()
      );
      res.status(200).send(filteredProducts);
    } else {
      res.status(200).send(products);
    }
  } catch (error) {
    console.error(error);
  }
});

productsRouter.get("/:productID", async (req, res, next) => {});
productsRouter.put("/:productID", async (req, res, next) => {});
productsRouter.delete("/:productID", async (req, res, next) => {});

export default productsRouter;
