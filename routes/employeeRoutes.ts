import express from 'express';
const router = express.Router();
const {
  signUp,
  login,
  refresh
} = require('../controllers/employeeController');

router.post('/register', signUp);
router.post('/login', login);
router.post('/refresh', refresh);
export default router;
