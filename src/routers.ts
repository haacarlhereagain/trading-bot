import express, { Router } from 'express';

export default function initRouters(): Router {
    const apiRouter = express.Router();
    apiRouter.get('/', (req, res) => res.status(200).send('server is alive'));
    // routers implement here
    return apiRouter;
}