/* eslint-disable no-plusplus,camelcase */
import {
  createVote,
  dashboardMetrics,
  getAllVotes,
  getBarChartData,
  getOneVoterVotes,
  getPieChartData,
  getVoteByPositionAndVoter,
  getVoterVotes,
  getVotes,
  searchVotes,
  votesCountFromIndex,
} from './votes.repository';
import VotersService from '../Voters/voters.service';
import { APIError } from '../../utils/apiError';
import { groupByCandidate } from '../../helpers/helpers';

const { Vote, Index } = require('../../database/models/index');

class VotesService {
  static async createVoteWeb(body) {
    const voter = await VotersService.getVoterByPhone(body[0].phone);
    if (!voter) throw new APIError('INVALID', 404, 'Voter not found!');

    const voteExist = await getVoteByPositionAndVoter(body[0].position_id, voter.id);

    if (voteExist) {
      throw new APIError('INVALID', 400, 'You already voted, you cannot vote again');
    }

    return body.map(async vote => {
      await createVote({
        voter_id: voter.id,
        position_id: vote.position_id,
        candidate_id: vote.candidate_id,
      });
    });
  }

  static async createVoteUSSD({ voter_id, position_id, candidate_id }) {
    return createVote({ voter_id, position_id, candidate_id });
  }

  static getCandidates(positions, index) {
    let positionIndex = index || 1;
    if (index) positionIndex = index.position;
    const foundPosition = positions.find(position => position.id === positionIndex);
    let contestants = '';

    const { candidates, name, id } = foundPosition;
    candidates.sort((a, b) => {
      return a.id - b.id;
    });

    for (let i = 0; i < candidates.length; i++) {
      contestants += `${candidates[i].id}. ${candidates[i].name}\n`;
    }
    return { name, contestants, id };
  }

  static async sendResponse(candidates, phoneNumber, position) {
    const response = `CON Position: ${candidates.name}
    ${candidates.contestants}`;
    await VotersService.setPositionIndex(phoneNumber, position);

    return response;
  }

  static async setPositionVotedFor(phoneNumber, position) {
    await VotersService.setPositionIndex(phoneNumber, position);
  }

  static sendFirstResponse() {
    return `CON Welcome to FMSTCTCS e-voting. \n Press * to start voting \n Press 0 to skip a position`;
  }

  static async verifyVoteInput(input, expectedOptions, voter_id) {
    const optionExist = expectedOptions.find(opt => opt === input);
    if (optionExist) return true;

    await Vote.destroy({ force: true, where: { voter_id } });
    await Index.destroy({ force: true, where: { voter_id } });
    return `END Oops, wrong input, you have to start again`;
  }

  static async checkVoteExists(voter_id, position_id) {
    return getVoteByPositionAndVoter(position_id, voter_id);
  }

  static async getVoteCount(voter_id) {
    return votesCountFromIndex(voter_id);
  }

  static async formatResponse(position_id = 1) {
    const position = await VotersService.getPosition(position_id);
    let contestants = '';

    const { candidates, name } = position;

    candidates.sort((a, b) => {
      return a.id - b.id;
    });

    for (let i = 0; i < candidates.length; i++) {
      contestants += `${candidates[i].id}. ${candidates[i].name}\n`;
    }

    return `CON Position: ${name}
    ${contestants}`;
  }

  static async getAVoterVotesIds(voter_id) {
    const votes = await getOneVoterVotes(voter_id);
    return votes.map(vote => vote.position_id);
  }

  static async mapVoterVotes(voter_id) {
    const votes = await getVoterVotes(voter_id);
    return votes.map(vote => vote.position);
  }

  static compareTwoArrays(positions, positionsVoted) {
    return positions.filter(id1 => !positionsVoted.some(id2 => id2 === id1));
  }

  static async getRemainingPosition(voter_id) {
    // get all available positions id
    const positions = await VotersService.getPositionsIds();
    // get positions a voter has voted for
    const positionsVoted = await this.mapVoterVotes(voter_id);
    // compare the two array and get the positions not voted for
    const unVotedPositions = this.compareTwoArrays(positions, positionsVoted);
    // pick the first position in the array, query the db and send the position object

    return unVotedPositions[0];
  }

  static async voteStarts(body) {
    const { phoneNumber, text } = body;
    // const position = await VotersService.getPosition();
    const voter = await VotersService.getVoterByPhone(phoneNumber);
    if (voter) {
      if ((await this.getVoteCount(voter.id)) >= 8) return `END Sorry you cannot vote again`;

      if (text === '') return this.sendFirstResponse();

      const position = await this.getRemainingPosition(voter.id);

      if (text === '*') {
        return this.formatResponse(position);
      }

      let input;

      if (text.includes('*')) {
        const name = text.split('*');
        const lastIndex = name.length - 1;
        input = name[lastIndex];
      }

      if (text === '0' || input === '0') {
        await VotesService.setPositionVotedFor(phoneNumber, position);
        return this.formatResponse(position + 1);
      }

      if (position >= 8) {
        await this.createVoteUSSD({
          voter_id: voter.id,
          position_id: position,
          candidate_id: +input,
        });
        await VotesService.setPositionVotedFor(phoneNumber, position);
        return `END Thank you for voting`;
      }

      await this.createVoteUSSD({
        voter_id: voter.id,
        position_id: position,
        candidate_id: +input || text,
      });
      await VotesService.setPositionVotedFor(phoneNumber, position);
      return this.formatResponse(position + 1);
    }
    return 'END Sorry, You are not eligible to vote.';
  }

  /**
   * get votes
   *
   * @static
   * @returns {json} json object with votes data
   * @param body
   * @memberOf VotersService
   */
  static async getVotes(body) {
    const { currentPage, pageLimit, search } = body;
    if (search) {
      return searchVotes(+currentPage, +pageLimit, search);
    }

    if (Object.values(body).length) {
      return getVotes(+currentPage, +pageLimit);
    }

    return getVotes();
  }

  /**
   * get dashboard metrics
   *
   * @static
   * @returns {json} json dashboard metrics data
   * @memberOf VotersService
   */
  static async getDashboardMetrics() {
    return dashboardMetrics();
  }

  /**
   * get dashboard metrics
   *
   * @static
   * @returns {json} json dashboard metrics data
   * @memberOf VotersService
   */
  static async getAllVotes() {
    const votes = await getAllVotes();
    return groupByCandidate(votes);
  }

  /**
   * get pie chart metrics
   *
   * @static
   * @returns {json} json pie chart metrics data
   * @memberOf VotersService
   */
  static async getPieChartData() {
    return getPieChartData();
  }

  /**
   * get bar chart metrics
   *
   * @static
   * @returns {json} json bar chart metrics data
   * @memberOf VotersService
   */
  static async getBarChartData(body) {
    const { position } = body;
    return getBarChartData(position);
  }
}

export default VotesService;
