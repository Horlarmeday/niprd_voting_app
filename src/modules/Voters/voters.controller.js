import VotersService from './voters.service';
import { validateCandidate, validatePosition, validateVoter } from './validations';
import successResponse from '../../config/success-response';

/**
 *
 *
 * @class VotersController
 */
class VotersController {
  /** **************
   * VIEWS
   *************** */

  /**
   * display dashboard
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   */
  static async renderDashboard(req, res) {
    res.render('body/dashboard');
  }

  /**
   * display voters
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   */
  static async renderVoters(req, res) {
    res.render('body/voters');
  }

  /**
   * display create voter
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   */
  static async renderCreateVoter(req, res) {
    res.render('body/create/create-voter');
  }

  /**
   * display candidates
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   */
  static async renderCandidates(req, res) {
    res.render('body/candidates');
  }

  /**
   * display create candidate
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   */
  static async renderCreateCandidate(req, res) {
    res.render('body/create/create-candidate');
  }

  /**
   * display positions
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   */
  static async renderPositions(req, res) {
    res.render('body/positions');
  }

  /**
   * display create position
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   */
  static async renderCreatePosition(req, res) {
    res.render('body/create/create-position');
  }

  /** *****************
   * APIs
   ***************** */

  /**
   * create voter
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with voters data
   */
  static async createVoter(req, res, next) {
    const { error } = validateVoter(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      const voter = await VotersService.createVoter(req.body);

      return successResponse(res, 201, 'Data saved', voter);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * get all voters
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with voters data
   */
  static async getVoters(req, res, next) {
    try {
      const voters = await VotersService.getVoters(req.query);

      return successResponse(res, 200, 'Data retrieved', voters);
    } catch (e) {
      return next(e);
    }
  }

  /** *************
   * CANDIDATES
   ************* */

  /**
   * create candidate
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with candidate data
   */
  static async createCandidate(req, res, next) {
    const { error } = validateCandidate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      const candidate = await VotersService.createCandidate(req.body);

      return successResponse(res, 201, 'Data saved', candidate);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * get all candidates
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with candidates data
   */
  static async getCandidates(req, res, next) {
    try {
      const candidates = await VotersService.getCandidates();

      return successResponse(res, 200, 'Data retrieved', candidates);
    } catch (e) {
      return next(e);
    }
  }

  /** *************
   * POSITIONS
   ************* */

  /**
   * create position
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with position data
   */
  static async createPosition(req, res, next) {
    const { error } = validatePosition(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      const position = await VotersService.createPosition(req.body);

      return successResponse(res, 201, 'Data saved', position);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * get all positions
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with positions data
   */
  static async getPositions(req, res, next) {
    try {
      const positions = await VotersService.getPositions();

      return successResponse(res, 200, 'Data retrieved', positions);
    } catch (e) {
      return next(e);
    }
  }
}
export default VotersController;
