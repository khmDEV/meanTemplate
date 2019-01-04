var express = require('express');
var mongoose = require('mongoose');
var request = require('request');

module.exports = (function() {
  var Test = require('../models/Test');

  var app = express.Router();
  app.get('/test', function(req, res) {
      var test = new Test({
        data: "lol"
      });
      test.save();
      res.status(200).end();
    });
  /*
   * Extra functions
   */
  function getVariable(req, name) {
    if (req.originalMethod == "POST") {
      return req.body[name];
    } else {
      return req.param(name);
    }
  }

  return app
})();
