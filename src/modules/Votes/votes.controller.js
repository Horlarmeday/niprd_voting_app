import moment from 'moment-timezone';
import VotesService from './votes.service';
import successResponse from '../../config/success-response';
import { validateBarChart, validateVote } from './validations';

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
   * display surveys
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   */
  static async renderSurveys(req, res) {
    res.render('body/survey');
  }

  /**
   * display analysis
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   */
  static async renderAnalysis(req, res) {
    res.render('body/analysis');
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

  static async test(req, res, next) {
    try {
      const response = {
        now: moment()
          .tz('Africa/Lagos')
          .format('dddd, MMMM Do YYYY, h:mma'),
        start: moment()
          .month(5)
          .date(25)
          .hours(8)
          .minutes(0)
          .seconds(0)
          .milliseconds(0)
          .tz('Africa/Lagos')
          .format('dddd, MMMM Do YYYY, h:mma'),
        end: moment()
          .month(5)
          .date(25)
          .hours(16)
          .minutes(0)
          .seconds(0)
          .milliseconds(0)
          .tz('Africa/Lagos')
          .format('dddd, MMMM Do YYYY, h:mma'),
        timezone: moment.tz.guess(),
      };

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
   * get surveys
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with surveys data
   */
  static async getSurveys(req, res, next) {
    try {
      const vote = await VotesService.getSurveys(req.query);

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

  /**
   * survey data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with survey data
   */
  static async getSurveyData(req, res, next) {
    try {
      const metrics = await VotesService.getSurveyData();

      return successResponse(res, 200, 'Data retrieved', metrics);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * get votes analysis
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with votes data
   */
  static async getVoteAnalysis(req, res, next) {
    try {
      const votes = await VotesService.getAllVotes();

      return successResponse(res, 200, 'Data saved', votes);
    } catch (e) {
      return next(e);
    }
  }
}

export default VotesController;
