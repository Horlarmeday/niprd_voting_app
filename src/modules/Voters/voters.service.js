/* eslint-disable camelcase */
import {
  createCandidate,
  createPosition,
  createVoter,
  findVoterByPhone,
  getCandidates,
  getOnePosition,
  getPositions,
  getPositionsIds,
  getVoterPositionIndex,
  getVoters,
  searchVoters,
  setVoterPositionIndex,
} from './voters.repository';
import { APIError } from '../../utils/apiError';

class VotersService {
  /** *************
   * VOTER
   ************* */

  /**
   * create voter account
   *
   * @static
   * @returns {json} json object with user data
   * @param body
   * @memberOf VotersService
   */
  static async createVoter(body) {
    const voter = await findVoterByPhone(body.phone);
    if (voter) throw new APIError('INVALID', 400, 'Voter already exists');

    return createVoter(body);
  }

  /**
   * find voter by phone
   *
   * @static
   * @returns {json} json object with voter data
   * @memberOf VotersService
   * @param phone
   */
  static async getVoterByPhone(phone) {
    return findVoterByPhone(phone);
  }

  /**
   * get voters
   *
   * @static
   * @returns {json} json object with voters data
   * @param body
   * @memberOf VotersService
   */
  static async getVoters(body) {
    const { currentPage, pageLimit, search } = body;
    if (search) {
      return searchVoters(+currentPage, +pageLimit, search);
    }

    if (Object.values(body).length) {
      return getVoters(+currentPage, +pageLimit);
    }

    return getVoters();
  }

  /** *************
   * CANDIDATES
   ************* */

  /**
   * create candidate
   *
   * @static
   * @returns {json} json object with candidate data
   * @param body
   * @memberOf VotersService
   */
  static async createCandidate(body) {
    return createCandidate(body);
  }

  /**
   * get candidates
   *
   * @static
   * @returns {json} json object with candidates data
   * @memberOf VotersService
   */
  static async getCandidates() {
    return getCandidates();
  }

  /** *************
   * POSITIONS
   ************* */

  /**
   * create position
   *
   * @static
   * @returns {json} json object with position data
   * @param body
   * @memberOf VotersService
   */
  static async createPosition(body) {
    return createPosition(body);
  }

  /**
   * get positions
   *
   * @static
   * @returns {json} json object with position data
   * @memberOf VotersService
   */
  static async getPositions() {
    return getPositions();
  }

  /**
   * get positions ids only
   *
   * @static
   * @returns {json} json object with position data
   * @memberOf VotersService
   */
  static async getPositionsIds() {
    const positions = await getPositionsIds();
    return positions.map(position => position.id);
  }

  /**
   * get position
   *
   * @static
   * @returns {json} json object with position data
   * @memberOf VotersService
   */
  static async getPosition(position_id) {
    return getOnePosition(position_id);
  }

  /**
   * set voter position index
   *
   * @static
   * @returns {json} json object with index data
   * @memberOf VotersService
   * @param phone_number
   * @param position
   */
  static async setPositionIndex(phone_number, position) {
    return setVoterPositionIndex(phone_number, position);
  }

  /**
   * get position index
   *
   * @static
   * @returns {json} json object with index data
   * @memberOf VotersService
   */
  static async getPositionIndex(voter_id) {
    return getVoterPositionIndex(voter_id);
  }
}
export default VotersService;
