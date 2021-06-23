const { User } = require('../../database/models');

/**
 * query user account in the DB by phone
 *
 * @function
 * @returns {json} json object with staff data
 * @param data
 */
export async function findUserByPhone(data) {
  return User.findOne({ where: { phone: data } });
}

/**
 * get users
 *
 * @function
 * @returns {json} json object with users data
 * @param currentPage
 * @param pageLimit
 */
export async function getUsers(currentPage = 1, pageLimit = 10) {
  return User.paginate({
    page: currentPage,
    paginate: pageLimit,
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['password'] },
  });
}
