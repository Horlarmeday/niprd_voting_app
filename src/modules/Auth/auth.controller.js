import successResponse from '../../config/success-response';
import { validateLogin } from './validations';
import AuthService from './auth.service';

export default class AuthController {
  /**
   * display login
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   */
  static async renderLogin(req, res) {
    res.render('auth/login');
  }

  /** *****************
   * APIs
   ***************** */
  /**
   * login user
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with user data
   */
  static async login(req, res, next) {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      const { user, token } = await AuthService.userLoginService(req.body);

      return successResponse(res, 201, 'Data saved', { user, token });
    } catch (e) {
      return next(e);
    }
  }

  /**
   * get all users
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with users data
   */
  static async getUsers(req, res, next) {
    try {
      const users = await AuthService.getUsers(req.query);

      return successResponse(res, 200, 'Data retrieved', users);
    } catch (e) {
      return next(e);
    }
  }
}
