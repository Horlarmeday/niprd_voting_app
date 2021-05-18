/* eslint-disable no-plusplus,camelcase */
import {
  createVote,
  dashboardMetrics,
  getAllVotes, getBarChartData,
  getPieChartData,
  getVoteByPositionAndVoter,
  getVotes,
  searchVotes,
  votesCount,
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
    return votesCount(voter_id);
  }

  static async startVote(body) {
    const { phoneNumber, text } = body;
    const positions = await VotersService.getPositions();
    const voter = await VotersService.getVoterByPhone(phoneNumber);

    if (voter) {
      if ((await this.getVoteCount(voter.id)) >= 8) return `END Sorry you cannot vote again`;

      const index = await VotersService.getPositionIndex(voter.id);

      const candidates = this.getCandidates(positions, index);

      if (text === '') {
        return this.sendResponse(candidates, phoneNumber, 2);
      }

      if (['1', '2', '3'].includes(text)) {
        if (await this.checkVoteExists(voter.id, 1)) {
          return this.sendResponse(candidates, phoneNumber, 3);
        }
        await this.createVoteUSSD({
          voter_id: voter.id,
          position_id: 1,
          candidate_id: +text,
        });
        return this.sendResponse(candidates, phoneNumber, 3);
      }

      const name = text.split('*');
      const lastIndex = name.length - 1;
      const input = name[lastIndex];

      if (['4', '5', '6'].includes(input)) {
        if (await this.checkVoteExists(voter.id, 2)) {
          return this.sendResponse(candidates, phoneNumber, 4);
        }
        await this.createVoteUSSD({
          voter_id: voter.id,
          position_id: 2,
          candidate_id: +input,
        });
        return this.sendResponse(candidates, phoneNumber, 4);
      }

      if (['7', '8', '9'].includes(input)) {
        if (await this.checkVoteExists(voter.id, 3)) {
          return this.sendResponse(candidates, phoneNumber, 5);
        }
        await this.createVoteUSSD({
          voter_id: voter.id,
          position_id: 3,
          candidate_id: +input,
        });
        return this.sendResponse(candidates, phoneNumber, 5);
      }

      if (['10', '11', '12'].includes(input)) {
        if (await this.checkVoteExists(voter.id, 4)) {
          return this.sendResponse(candidates, phoneNumber, 6);
        }
        await this.createVoteUSSD({
          voter_id: voter.id,
          position_id: 4,
          candidate_id: +input,
        });
        return this.sendResponse(candidates, phoneNumber, 6);
      }

      if (['13', '14', '15'].includes(input)) {
        if (await this.checkVoteExists(voter.id, 5)) {
          return this.sendResponse(candidates, phoneNumber, 7);
        }
        await this.createVoteUSSD({
          voter_id: voter.id,
          position_id: 5,
          candidate_id: +input,
        });
        return this.sendResponse(candidates, phoneNumber, 7);
      }

      if (['16', '17', '18'].includes(input)) {
        if (await this.checkVoteExists(voter.id, 6)) {
          return this.sendResponse(candidates, phoneNumber, 8);
        }
        await this.createVoteUSSD({
          voter_id: voter.id,
          position_id: 6,
          candidate_id: +input,
        });
        return this.sendResponse(candidates, phoneNumber, 8);
      }

      if (['19', '20', '21'].includes(input)) {
        if (await this.checkVoteExists(voter.id, 7)) {
          return `CON Position: ${candidates.name}
          ${candidates.contestants}`;
        }
        await this.createVoteUSSD({
          voter_id: voter.id,
          position_id: 7,
          candidate_id: +input,
        });
        return `CON Position: ${candidates.name}
          ${candidates.contestants}`;
      }

      if (input === '22') {
        if (await this.checkVoteExists(voter.id, 8)) {
          return `END Thank you for voting`;
        }

        await this.createVoteUSSD({
          voter_id: voter.id,
          position_id: 8,
          candidate_id: +input,
        });
        return `END Thank you for voting`;
      }
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
