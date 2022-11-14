import { Router } from "express";
import controllers from "./getLink.controller";

const uploadRouter = Router();

uploadRouter
  .route("/")
  .get(controllers.rejectRequest)
  .post(controllers.getOne)
  .put(controllers.rejectRequest);

export default uploadRouter;
