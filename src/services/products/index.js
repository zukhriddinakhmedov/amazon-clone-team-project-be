import express from "express";
import path from "path";

import createHttpError from "http-errors";
import uniqid from "uniqid";
import multer from "multer";

import { getProducts, writeProducts } from "../../services/lib/fs-tools.js";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  const products = await getProducts();
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const produts = await getProducts();
    res.send(produts);
  } catch (error) {
    console.error(error);
  }
});

productsRouter.get("/:productID", async (req, res, next) => {});
productsRouter.put("/:productID", async (req, res, next) => {});
productsRouter.delete("/:productID", async (req, res, next) => {});

export default productsRouter;
