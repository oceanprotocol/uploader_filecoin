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

function logRequest(req, res, next) {
  console.log('Received request:');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Query Parameters:', JSON.stringify(req.query, null, 2));
  next();
}

uploadRouter
  .route('/')
  .get(controllers.rejectRequest)
  .post(
    logRequest,
    filesToArray,
    uploadInputSchemaValidator,
    controllers.createOne
  )
  .put(controllers.rejectRequest);

export default uploadRouter;
