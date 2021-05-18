import '../config/env';
import express from 'express';

import error from '../middleware/error';
import './logger';
import loaders from './loaders';
import routes from './routes';

const server = express();
loaders(server, express);
routes(server);

server.use(error);

export default server;
