import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

export default (server, express) => {
  server.set('views', path.join(__dirname, '../views'));
  server.set('view engine', 'ejs');
  server.use(cors({ credentials: true, origin: [], optionsSuccessStatus: 200 }));
  server.use(helmet());
  server.use(morgan('dev'));
  server.use(express.json({ limit: '5mb' }));
  server.use(express.urlencoded({ extended: false }));
  server.use(express.static('download'));
  server.use(express.static(path.join(__dirname, '../public')));
};
