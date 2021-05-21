import VotesService from './votes.service';
import successResponse from '../../config/success-response';
import { validateBarChart, validateVote } from './validations';
import VotersService from '../Voters/voters.service';

class VotesController {
  /**
   * display votes
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   */
  static async renderVotes(req, res) {
    res.render('body/votes');
  }

  /**
   * display create votes
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   */
  static async renderCreateVotes(req, res) {
    res.render('body/create/create-vote');
  }

  /**
   * create vote
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with vote data
   */
  static async createVote(req, res, next) {
    const { error } = validateVote(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    try {
      const vote = await VotesService.createVoteWeb(req.body);

      return successResponse(res, 201, 'Data saved', vote);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * start vote
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with vote data
   */
  static async startVote(req, res, next) {
    try {
      const response = await VotesService.voteStarts(req.body);

      res.set('Content-Type: text/plain');
      return res.send(response);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * start vote
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with vote data
   */
  static async africaTalkingNotification(req, res, next) {
    const { input, phoneNumber } = req.body;
    try {
      return { input, phoneNumber };
    } catch (e) {
      return next(e);
    }
  }

  /**
   * dashboard metrics
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with metrics data
   */
  static async dashboardMetrics(req, res, next) {
    try {
      const metrics = await VotesService.getDashboardMetrics();

      return successResponse(res, 200, 'Data retrieved', metrics);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * get votes
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with votes data
   */
  static async getVotes(req, res, next) {
    try {
      const vote = await VotesService.getVotes(req.query);

      return successResponse(res, 200, 'Data saved', vote);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * get votes
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with votes data
   */
  static async getAggregatedVotes(req, res, next) {
    try {
      const votes = await VotesService.getAllVotes();

      return successResponse(res, 200, 'Data saved', votes);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * get pie chart data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with pie chart data
   */
  static async getPieChartData(req, res, next) {
    try {
      const data = await VotesService.getPieChartData();

      return successResponse(res, 200, 'Data saved', data);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * get bar chart data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with bar chart data
   */
  static async getBarChartData(req, res, next) {
    const { error } = validateBarChart(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      const data = await VotesService.getBarChartData(req.body);

      return successResponse(res, 200, 'Data saved', data);
    } catch (e) {
      return next(e);
    }
  }
}

export default VotesController;
