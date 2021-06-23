import { Router } from 'express';
import VotersController from './voters.controller';
import verify from '../../middleware/verify';

const router = Router();
// Views
router.get('/dashboard', VotersController.renderDashboard);
router.get('/voters', VotersController.renderVoters);
router.get('/voters/create', VotersController.renderCreateVoter);
router.get('/candidates', VotersController.renderCandidates);
router.get('/candidates/create', VotersController.renderCreateCandidate);
router.get('/positions', VotersController.renderPositions);
router.get('/positions/create', VotersController.renderCreatePosition);

// APIs
router.post('/api/voters', verify, VotersController.createVoter);
router.get('/api/voters', verify, VotersController.getVoters);
router.post('/api/candidates', verify, VotersController.createCandidate);
router.get('/api/candidates', verify, VotersController.getCandidates);
router.post('/api/positions', verify, VotersController.createPosition);
router.get('/api/positions', verify, VotersController.getPositions);

export default router;
