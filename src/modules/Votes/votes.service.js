/* eslint-disable no-plusplus,camelcase */
import {
  aggregatedSurveyData,
  createSurvey,
  createVote,
  dashboardMetrics,
  getAllVotes,
  getBarChartData,
  getPieChartData,
  getSurveys,
  getVoteByPositionAndVoter,
  getVoterSurveyCount,
  getVoterVotes,
  getVotes,
  searchSurveys,
  searchVotes,
  votesCountFromIndex,
} from './votes.repository';
import VotersService from '../Voters/voters.service';
import { APIError } from '../../utils/apiError';
import { groupByCandidate, restrictedTime } from '../../helpers/helpers';

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

  static async setPositionVotedFor(phoneNumber, position) {
    await VotersService.setPositionIndex(phoneNumber, position);
  }

  static sendFirstResponse() {
    return `CON Welcome to FMSTCTCS e-voting. \n Press * to start voting`;
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

    return `CON Position: ${name}\n ${contestants}\n Press 0 to skip voting for this position`;
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

    const time = restrictedTime();
    const { now, start, end } = time;
    console.log({
      now,
      start,
      end,
    });
    if (now >= end) return `END Sorry voting has ended`;

    if (now < start) return `END Sorry you cannot vote now`;

    const voter = await VotersService.getVoterByPhone(phoneNumber);
    if (voter) {
      if ((await this.getVoteCount(voter.id)) >= 8 && (await getVoterSurveyCount(voter.id)) >= 1) {
        return `END Sorry you cannot vote again`;
      }

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

      if (position && position >= 8) {
        await this.createVoteUSSD({
          voter_id: voter.id,
          position_id: position,
          candidate_id: +input,
        });
        await VotesService.setPositionVotedFor(phoneNumber, position);
        return `CON Do you support e-voting?\n a. Yes\n b. No \nType and send either a or b`;
      }

      if (input.toLowerCase() === 'a' || input.toLowerCase() === 'b') {
        await createSurvey(input, voter.id);
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
   * get votes
   *
   * @static
   * @returns {json} json object with votes data
   * @param body
   * @memberOf VotersService
   */
  static async getSurveys(body) {
    const { currentPage, pageLimit, search } = body;
    if (search) {
      return searchSurveys(+currentPage, +pageLimit, search);
    }

    if (Object.values(body).length) {
      return getSurveys(+currentPage, +pageLimit);
    }

    return getSurveys();
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

  /**
   * get survey data
   *
   * @static
   * @returns {json} json survey data
   * @memberOf VotersService
   */
  static async getSurveyData() {
    return aggregatedSurveyData();
  }
}

export default VotesService;
