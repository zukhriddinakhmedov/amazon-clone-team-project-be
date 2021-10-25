import fs from "fs-extra"; // fs-extra gives us same methods of fs (plus some extras) and gives us PROMISES!
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fs; // readJSON and writeJSON are not part of the "normal" fs module

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");

const reviewsJSONPath = join(dataFolderPath, "reviews.json");

export const getReviews = () => readJSON(reviewsJSONPath);

export const writeReviews = (content) => writeJSON(reviewsJSONPath, content);
