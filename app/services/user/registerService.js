var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var os = require('os');
var config = require('../../../config/config.js');
var app = express.Router();
var User = require('../../models/User');
var cryptoService = require('../../services/cryptoService');
var mailActivationService = require('../../services/user/mailActivationService');

module.exports = (function(module) {

  /*
   * Public functions
   */
   module.register=register;
   module.activate=activate;

  /*
   * Activate
   */
 function checkActivation(newUser,ret) {
   if (config.mailActivation){
     mailActivationService.sendActivationMail(newUser,function(err){
       if (err==null) {
         newUser.save();
         ret({
           err: 0
         });
       }else{
         ret({
           err: 4
         });
       }
     });
   }else{ // Without activation mail
       newUser.enable=1;
       newUser.save().then(function(){
         ret({
           activated: true,
           err: 0
         });
       });

     }
 }

  function activate(userid, secret, ret) {
    if (userid != undefined && secret != undefined) {
      User.findOne({
        _id: userid
      }).exec({}, function(err, usr) {
        if (!err && usr != undefined && usr.secret == secret) {
          if (usr.enable) {
            ret({
              err: 1
            });
          } else {
            usr.enable = 1;
            usr.save();
            ret({
              err: 0
            });
          }
        } else {
          ret({
            err: 2
          });
        }
      });
    } else {
      ret({
        err: 3
      });
    }
  }

  /*
   * Register
   */
  function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})(\.([a-z]{2,6}(?:\.[a-z]{2})?))?$/i;
    return re.test(email);
  }

  function register(username, pass, mail, ret) {
    if (username != undefined && pass != undefined && mail != undefined && username.length > 2 && pass.length > 6 && validateEmail(mail)) {
      User.findOne({
        name: new RegExp("^" + username.toLowerCase() + "$", "i")
      }).exec({}, function(err, usr) {
        if (!err && usr != undefined) {
          ret({
            err: 1
          });
        } else {
          User.findOne({
            mail: new RegExp("^" + mail.toLowerCase() + "$", "i")
          }).exec({}, function(err2, usr2) {
            if (!err2 && usr2 != undefined) {
              ret({
                err: 2
              });
            } else {
              var newUser = new User({
                name: username,
                mail: mail,
                password: pass,
                secret: cryptoService.randomSecret()
              });
              checkActivation(newUser,ret);
            }
          });
        }
      });
    } else {
      ret({
        err: 3
      });
    }
  }

  return module;
})({});
