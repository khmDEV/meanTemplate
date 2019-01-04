var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var os = require('os');
var config = require('../../../config/config.js');
var app = express.Router();
var User = require('../../models/User');
var utilsService = require('../../services/utilsService');
var registerService = require('../../services/user/registerService');
var mailActivationService = require('../../services/user/mailActivationService');
var loginService = require('../../services/user/loginService');

module.exports = (function() {

  /*
   * GET /activation
   * user: username
   * pass: password
   * [mail: mail] OPTIONAL
   * return
   *       {err: 0}: all ok
   *       403: user and/or pass wrong
   *       410: the account is activate yet
   *       500: We can't send the mail
   */
  app.post('/sendActivation', function(req, res) {
    var user = utilsService.getVariable(req, 'user');
    var pass = utilsService.getVariable(req, 'pass');
    var mail = utilsService.getVariable(req, 'mail');
    mailActivationService.sendActivation(user, pass, mail, function(r) {
      if (r.err==1) {
        res.status(403).end();
      }else if(r.err==2){
        res.status(410).end();
      }else if(r.err==3){
        res.status(500).end();
      } else {
        res.json(r);
      }
    });
  });

  /*
   * POST /activate
   * userid: userid
   * secret: secret code
   * return
   *       {err: 0}: all ok
   *       410: is activated yet
   *       403: wrong secret
   *       400: data wrong
   */
  app.all('/activate', function(req, res) {
    var userid = utilsService.getVariable(req, 'userid');
    var secret = utilsService.getVariable(req, 'secret');
    registerService.activate(userid, secret, function(r) {
      if (r.err==1) {
        res.status(410).end();
      }else if(r.err==2){
        res.status(403).end();
      }else if(r.err==3){
        res.status(400).end();
      } else {
        res.json(r);
      }
    });
  });

  /*
   * POST /register
   * user: username
   * pass: password
   * mail: mail
   * return
   *       {err: 0}: all ok
   *       452: username exist yet
   *       453: mail exist yet
   *       400: wrong values
   *       500: we can't send the mail
   */
  app.post('/register', function(req, res) {
    var username = utilsService.getVariable(req, 'user');
    var pass = utilsService.getVariable(req, 'pass');
    var mail = utilsService.getVariable(req, 'mail');
    registerService.register(username, pass, mail, function(r) {
      if (r.err==1) {
        res.status(452).end();
      }else if(r.err==2){
        res.status(453).end();
      }else if(r.err==3){
        res.status(400).end();
      }else if(r.err==4){
        res.status(500).end();
      } else {
        if(r.activated){
          console.log("a");
          loginService.login(req.session,username,pass,function(ee){
            console.log(ee);
              console.log("dasdaksjdhkajshkjdalksdklajkls");
            res.json(r);
          });
        }else{
          res.json(r);
        }
      }
    });
  });

  return app
})();
