import { Router } from 'express';
import controllers from './upload.controller';
import { uploadInputSchemaValidator } from './upload.validator';

const uploadRouter = Router();

function filesToArray(req, res, next) {
  if (typeof req.body.files === 'string') {
    req.body.files = [req.body.files];
  }
  next();
}

uploadRouter
  .route('/')
  .get(controllers.rejectRequest)
  .post(filesToArray, uploadInputSchemaValidator, controllers.createOne)
  .put(controllers.rejectRequest);

export default uploadRouter;
