import express from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJson, writeJson } = fs;

const dataFolder = join(dirname(fileURLToPath(import.meta.url)), "../data");

const producsJSONpath = join(dataFolder, "products.json");

const publicFolderPath = join(process.cwd(), "./public/img/products");

export const getProducts = () => readJson(producsJSONpath);

export const writeProducts = (content) => writeJson(producsJSONpath, content);
