/* eslint-disable camelcase */
import { Sequelize } from 'sequelize';

const { Voter, Candidate, Vote, Position, Index, Survey } = require('../../database/models');

const { Op } = Sequelize;

/**
 * create a vote
 *
 * @function
 * @returns {json} json object with vote data
 * @param data
 */
export async function createVote(data) {
  const { position_id, voter_id, candidate_id } = data;
  return Vote.create({
    position_id,
    voter_id,
    candidate_id,
  });
}

/**
 * get votes
 *
 * @function
 * @returns {json} json object with votes data
 * @param currentPage
 * @param pageLimit
 */
export async function getVotes(currentPage = 1, pageLimit = 10) {
  return Vote.paginate({
    page: currentPage,
    paginate: pageLimit,
    order: [['createdAt', 'DESC']],
    include: [
      { model: Position, as: 'position' },
      { model: Candidate, as: 'candidate' },
      { model: Voter, as: 'voter' },
    ],
  });
}

/**
 * search votes
 *
 * @function
 * @returns {json} json object with votes data
 * @param currentPage
 * @param pageLimit
 * @param search
 */
export async function searchVotes(currentPage = 1, pageLimit = 10, search) {
  return Vote.paginate({
    page: currentPage,
    paginate: pageLimit,
    order: [['createdAt', 'DESC']],
    include: [
      { model: Position, as: 'position' },
      { model: Candidate, as: 'candidate' },
      {
        model: Voter,
        as: 'voter',
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      },
    ],
  });
}

/**
 * get a vote by voter id and position id
 *
 * @function
 * @returns {json} json object with vote data
 * @param position_id
 * @param voter_id
 */
export async function getVoteByPositionAndVoter(position_id, voter_id) {
  return Vote.findOne({ where: { voter_id, position_id } });
}

/**
 * get the number of votes a voter has voted
 *
 * @function
 * @returns {json} json number with vote count data
 * @param data
 */
export async function votesCount(data) {
  return Vote.count({ where: { voter_id: data } });
}

/**
 * get the dashboard metrics
 *
 * @function
 * @returns {json} dashboard metrics
 */
export async function dashboardMetrics() {
  const [votes_casted, eligible_voters, positions, voters] = await Promise.all([
    Vote.count(),
    Voter.count(),
    Position.count(),
    Vote.aggregate('voter_id', 'DISTINCT', { plain: false }),
  ]);
  return { votes_casted, eligible_voters, positions, voters: voters.length };
}

/**
 * get all votes
 *
 * @function
 * @returns {json} json number with votes data
 */
export async function getAllVotes() {
  return Vote.findAll({
    include: [
      { model: Position, as: 'position', attributes: ['name'] },
      { model: Candidate, as: 'candidate', attributes: ['name'] },
    ],
  });
}

/**
 * get pie chart data
 *
 * @function
 * @returns {json} json pie chart data
 */
export async function getPieChartData() {
  const [
    pres,
    vice_pres_1,
    vice_pres_2,
    gen_sec,
    fin_sec,
    treasurer,
    ass_gen_sec,
    ass_fin_sec,
  ] = await Promise.all([
    Vote.count({ where: { position_id: 1 } }),
    Vote.count({ where: { position_id: 2 } }),
    Vote.count({ where: { position_id: 3 } }),
    Vote.count({ where: { position_id: 4 } }),
    Vote.count({ where: { position_id: 5 } }),
    Vote.count({ where: { position_id: 6 } }),
    Vote.count({ where: { position_id: 7 } }),
    Vote.count({ where: { position_id: 8 } }),
  ]);
  return { pres, vice_pres_1, vice_pres_2, gen_sec, fin_sec, treasurer, ass_gen_sec, ass_fin_sec };
}

export async function getBarChartData(position) {
  return Vote.findAll({
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('Vote.id')), 'number_of_votes'],
      'candidate_id',
    ],
    group: ['candidate_id'],
    where: {
      position_id: position,
    },
    include: [{ model: Candidate, as: 'candidate', attributes: ['name'] }],
  });
}

export async function getOneVoterVotes(voter_id) {
  return Vote.findAll({
    where: {
      voter_id,
    },
    attributes: ['position_id'],
  });
}

export async function getVoterVotes(voter_id) {
  return Index.findAll({
    where: {
      voter_id,
    },
    attributes: ['position'],
  });
}

/**
 * get the number of votes a voter has voted
 *
 * @function
 * @returns {json} json number with vote count data
 * @param data
 */
export async function votesCountFromIndex(data) {
  return Index.count({ where: { voter_id: data } });
}

/**
 * create a survey
 *
 * @function
 * @returns {json} json object with vote data
 * @param response
 * @param voter_id
 */
export async function createSurvey(response, voter_id) {
  return Survey.create({
    voter_id,
    response,
  });
}

/**
 * get the number the voter survey
 *
 * @function
 * @returns {json} json number with vote count data
 * @param data
 */
export async function getVoterSurveyCount(data) {
  return Survey.count({ where: { voter_id: data } });
}

/**
 * search surveys
 *
 * @function
 * @returns {json} json object with surveys data
 * @param currentPage
 * @param pageLimit
 * @param search
 */
export async function searchSurveys(currentPage = 1, pageLimit = 10, search) {
  return Survey.paginate({
    page: currentPage,
    paginate: pageLimit,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Voter,
        as: 'voter',
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      },
    ],
  });
}

/**
 * get surveys
 *
 * @function
 * @returns {json} json object with surveys data
 * @param currentPage
 * @param pageLimit
 */
export async function getSurveys(currentPage = 1, pageLimit = 10) {
  return Survey.paginate({
    page: currentPage,
    paginate: pageLimit,
    order: [['createdAt', 'DESC']],
    include: [{ model: Voter, as: 'voter' }],
  });
}

/**
 * get survey data
 * @function
 * @returns {json} json pie chart data
 */
export async function aggregatedSurveyData() {
  const [positiveResponses, negativeResponses, totalResponses] = await Promise.all([
    Survey.count({ where: { response: 'a' } }),
    Survey.count({ where: { response: 'b' } }),
    Survey.count(),
  ]);
  return { positiveResponses, negativeResponses, totalResponses };
}
