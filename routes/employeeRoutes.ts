import express from 'express';
// import {authenticateToken} from '../middlewares/authenticate';
const router = express.Router();
const {
  signUp,
  login,
  refresh
} = require('../controllers/employeeController');
const { get } = require('mongoose');

router.post('/register', signUp);
router.post('/login', login);
router.post('/refresh', refresh);
export default router;
