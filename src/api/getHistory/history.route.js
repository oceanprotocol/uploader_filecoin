import { Router } from 'express';
import controllers from './history.controller';

const historyRouter = Router();

historyRouter
  .route('/')
  .get(controllers.getAll)
  .post(controllers.rejectRequest)
  .put(controllers.rejectRequest);

export default historyRouter;