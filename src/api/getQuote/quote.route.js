import { Router } from "express";
import controllers from "./quote.controller";
import { getQuoteInputSchemaValidator } from "./quote.validator";

const quotaRouter = Router();

quotaRouter
  .route("/")
  .get(controllers.rejectRequest)
  .post(getQuoteInputSchemaValidator, controllers.createOne)
  .put(controllers.rejectRequest);

export default quotaRouter;
