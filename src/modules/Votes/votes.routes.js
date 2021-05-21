import { Router } from 'express';
import VotesController from './votes.controller';

const router = Router();
// Views
router.get('/votes', VotesController.renderVotes);
router.get('/votes/create', VotesController.renderCreateVotes);
router.get('/votes/create', VotesController.renderCreateVotes);
router.get('/surveys', VotesController.renderSurveys);
// APIs
router.post('/api/votes', VotesController.createVote);
router.post('/ussd', VotesController.startVote);
router.post('/notification', VotesController.africaTalkingNotification);
router.get('/api/votes', VotesController.getVotes);
router.get('/api/surveys', VotesController.getSurveys);
router.get('/api/survey-metrics', VotesController.getSurveyData);
router.get('/api/metrics', VotesController.dashboardMetrics);
router.get('/api/aggregated-votes', VotesController.getAggregatedVotes);
router.get('/api/pie-chart-data', VotesController.getPieChartData);
router.post('/api/bar-chart-data', VotesController.getBarChartData);

export default router;
