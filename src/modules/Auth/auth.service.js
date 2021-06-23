import bcrypt from 'bcryptjs';
import { findUserByPhone, getUsers } from './auth.repository';
import { APIError } from '../../utils/apiError';

export default class AuthService {
  /**
   * login user
   *
   * @static
   * @returns {json} json object with user data
   * @param body
   * @memberOf AuthService
   */
  static async userLoginService(body) {
    const user = await findUserByPhone(body.phone);
    if (!user) throw new APIError('INVALID', 400, 'invalid phone number');

    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) throw new APIError('INVALID', 400, 'invalid password');

    const token = user.generateAuthToken();

    return {
      token,
      user,
    };
  }

  /**
   * get users
   *
   * @static
   * @returns {json} json object with users data
   * @param body
   * @memberOf AuthService
   */
  static async getUsers(body) {
    const { currentPage, pageLimit } = body;

    if (Object.values(body).length) {
      return getUsers(+currentPage, +pageLimit);
    }

    return getUsers();
  }
}
