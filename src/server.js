import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { join } from "path";

import productsRouter from "./services/products/index.js";
import reviewsRouter from "./services/reviews/index.js";

const server = express();

const publicFolderPath = join(process.cwd(), "./public");

// ******************** Global middlewares **********************

server.use(cors());
server.use(express.json());

// ************************ ENDPOINTS **********************
const staticFolderPath = join(process.cwd(), "./public");
server.use(express.static(staticFolderPath));

server.use("/products", productsRouter);
server.use("/reviews", reviewsRouter);

// ************************ END **********************

// ******************** ERROR MIDDLEWARES **********************
// here all error handlers are generic to all the endpoints

// ******************** END ERROR MIDDLEWARES **********************

const port = 3001;

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log("Server running on port:", port);
});
