import votersRoutes from '../modules/Voters/voters.routes';
import votesRoutes from '../modules/Votes/votes.routes';
import authRoutes from '../modules/Auth/auth.routes';

export default server => {
  server.use(votersRoutes);
  server.use(votesRoutes);
  server.use(authRoutes);

  server.use((req, res, next) => {
    const apiTimeout = 18000;
    // set the timeout for all HTTP requests
    req.setTimeout(apiTimeout, () => {
      const err = new Error('Request Timeout');
      err.status = 408;
      next(err);
    });

    // set the server response timeout for all HTTP requests
    res.setTimeout(apiTimeout, () => {
      const err = new Error('Service Unavailable');
      err.status = 503;
      next(err);
    });
    next();
  });
  server.use((req, res, next) => {
    res.render('body/404');
    // next(err);
  });
};