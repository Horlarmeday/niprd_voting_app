/* eslint-disable camelcase */
import { Sequelize } from 'sequelize';

const { Voter, Candidate, Position, Index } = require('../../database/models');

const { Op } = Sequelize;

/** ***********
 * VOTER
 *********** */

/**
 * create a voter
 *
 * @function
 * @returns {json} json object with voter data
 * @param data
 */
export async function createVoter(data) {
  const { name, phone } = data;
  return Voter.create({
    name,
    phone,
  });
}

/**
 * query user account in the DB by phone
 *
 * @function
 * @returns {json} json object with user data
 * @param data
 */
export async function findVoterByPhone(data) {
  return Voter.findOne({ where: { phone: data } });
}

/**
 * query user account in the DB by user id
 *
 * @function
 * @returns {json} json object with user data
 * @param data
 */
export async function getVoterById(data) {
  return Voter.findByPk(data);
}

/**
 * get voters
 *
 * @function
 * @returns {json} json object with voters data
 * @param currentPage
 * @param pageLimit
 */
export async function getVoters(currentPage = 1, pageLimit = 10) {
  return Voter.paginate({
    page: currentPage,
    paginate: pageLimit,
    order: [['createdAt', 'DESC']],
  });
}

/**
 * search voters
 *
 * @function
 * @returns {json} json object with voters data
 * @param currentPage
 * @param pageLimit
 * @param search
 */
export async function searchVoters(currentPage = 1, pageLimit = 10, search) {
  return Voter.paginate({
    page: currentPage,
    paginate: pageLimit,
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['password'] },
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          phone: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
  });
}

/** *************
 * CANDIDATE
 ************** */
/**
 * create a candidate
 *
 * @function
 * @returns {json} json object with candidate data
 * @param data
 */
export async function createCandidate(data) {
  const { name, position_id } = data;
  return Candidate.create({
    name,
    position_id,
  });
}

/**
 * get candidates
 *
 * @function
 * @returns {json} json object with candidates data
 */
export async function getCandidates() {
  return Candidate.findAll({
    order: [['name', 'ASC']],
    include: [{ model: Position, as: 'position' }],
  });
}

/** *************
 * POSITION
 ************** */
/**
 * create a position
 *
 * @function
 * @returns {json} json object with position data
 * @param data
 */
export async function createPosition(data) {
  const { position } = data;
  return Position.create({
    name: position,
  });
}

/**
 * get positions
 *
 * @function
 * @returns {json} json object with positions data
 */
export async function getPositions() {
  return Position.findAll({
    order: [['createdAt', 'ASC']],
    include: [{ model: Candidate, as: 'candidates', attributes: ['name', 'id'] }],
  });
}

/**
 * get voter index
 *
 * @function
 * @returns {json} json object with voter index data
 */
export async function getVoterPositionIndex(voter_id) {
  return Index.findOne({
    where: {
      voter_id,
    },
    attributes: ['position'],
    order: [['position', 'DESC']],
  });
}

/**
 * get voter index
 *
 * @function
 * @returns {json} json object with voter index data
 */
export async function setVoterPositionIndex(phone_number, position) {
  const voter = await findVoterByPhone(phone_number);
  return Index.create({
    voter_id: voter.id,
    position,
  });
}
