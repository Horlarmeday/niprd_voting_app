import { Router } from 'express';
import VotesController from './votes.controller';
import verify from '../../middleware/verify';

const router = Router();
// Views
router.get('/votes', VotesController.renderVotes);
router.get('/votes/create', VotesController.renderCreateVotes);
router.get('/votes/create', VotesController.renderCreateVotes);
router.get('/surveys', VotesController.renderSurveys);
// APIs
router.post('/api/votes', verify, VotesController.createVote);
router.post('/ussd', VotesController.startVote);
router.get('/test', VotesController.test);
router.post('/notification', VotesController.africaTalkingNotification);
router.get('/api/votes', verify, VotesController.getVotes);
router.get('/api/surveys', verify, VotesController.getSurveys);
router.get('/api/survey-metrics', verify, VotesController.getSurveyData);
router.get('/api/metrics', verify, VotesController.dashboardMetrics);
router.get('/api/aggregated-votes', verify, VotesController.getAggregatedVotes);
router.get('/api/pie-chart-data', verify, VotesController.getPieChartData);
router.post('/api/bar-chart-data', verify, VotesController.getBarChartData);

export default router;
