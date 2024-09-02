const express = require('express');
const { checkAuth, loginUser, createUser, logout } = require('../controller/auth');
const passport = require('passport');

const router = express.Router();
// /auth is already add in base path
router
      .post('/signup', createUser)
      .post('/login', passport.authenticate('local'), loginUser)
      .get('/check', passport.authenticate('jwt'), checkAuth)
      .get('/logout',logout)

exports.router = router;