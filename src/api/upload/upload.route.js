import { Router } from 'express';
import controllers from './upload.controller';
import { uploadInputSchemaValidator } from './upload.validator';

const uploadRouter = Router();

uploadRouter
  .route('/')
  .get(controllers.rejectRequest)
  .post(uploadInputSchemaValidator, controllers.createOne)
  .put(controllers.rejectRequest);

export default uploadRouter;
