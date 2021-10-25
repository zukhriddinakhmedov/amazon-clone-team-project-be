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

productsRouter.get("/:productID", async (req, res, next) => {
  try {
    const products = await getProducts();

    const product = products.find((p) => p._id === req.params.productID);

    if (product) {
      res.status(201).send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productID} does not exist`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productID", async (req, res, next) => {
  try {
    const products = await getProducts();

    const index = products.findIndex((p) => p._id === req.params.productID);

    const productToEdit = products[index];

    if (productToEdit) {
      const editedFiled = req.body;
      const updates = {
        ...productToEdit,
        ...editedFiled,
        updatedAt: new Date(),
      };

      products[index] = updates;

      await writeProducts(products);

      console.log(updates);
      res.status(201).send(products[index]);
    } else {
      console.log(req.params.productID);
      next(
        createHttpError(
          404,
          `product youre trying to edit does not exist ${req.params.productID}`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productID", async (req, res, next) => {
  try {
    const products = await getProducts();
    const productsRemaining = products.filter(
      (product) => product._id !== req.params.productID
    );

    await writeProducts(productsRemaining);
    res.status(200).send(productsRemaining);
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
