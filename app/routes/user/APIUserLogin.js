var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var utilsService = require('../../services/utilsService');
var loginService = require('../../services/user/loginService');

module.exports = (function() {
  var app = express.Router();

  var User = require('../../models/User');

  /*
   * POST /logout
   * return
   *       {err: 0}: all ok
   *       400: bad request
   */
  app.all('/logout', function(req, res) {
    loginService.logout(req.session, function(r) {
      if (r.err) {
        res.status(400).end();
      }else{
        res.json(r)
      }
    });
  });

  /*
   * POST /login
   * user: username
   * pass: password
   * return
   *       {err: 0}: all ok
   *       403: user and/or pass wrong
   *       401: the account is not activate
   */
  app.post('/login', function(req, res) {
    var user = utilsService.getVariable(req, 'user');
    var pass = utilsService.getVariable(req, 'pass');
    loginService.login(req.session, user, pass, function(r) {
      if (r.err==1) {
        res.status(403).end();
      }else if(r.err==2){
        res.status(401).end();
      } else {
        res.json(r);
      }
    });
  });

  /*
   * POST /sessionStatus
   * return
   *       session data
   */
  app.all('/sessionStatus', function(req, res) {
    loginService.sessionStatus(req.session, function(r) {
      res.json(r)
    });
  });

  return app
})();
