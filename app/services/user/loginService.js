
module.exports = (function(module) {
  var mongoose = require('mongoose');
  var User = require('../../models/User');

  /*
   * Public functions
   */
   module.login=login;
   module.logout=logout;
   module.sessionStatus=sessionStatus;
   module.sessionConfig=sessionConfig;

  /*
   * logout
   */
  function logout(session, ret) {
    if (session != undefined && session.userid != undefined) {
      session.destroy();
      ret({
        err: 0
      });
    } else {
      ret({
        err: 1
      });
    }
  }

  /*
   * Login
   */
  function sessionConfig(session, usr) {
    session.userid = usr._id;
    session.name = usr.name;
    session.avatar = usr.avatar;
  }
  function login(session, user, pass, ret) {
    if (user != undefined && pass != undefined) {
      User.findOne({
        name: new RegExp("^" + user.toLowerCase() + "$", "i")
      }).exec({}, function(err, usr) {

        if (!err && usr != undefined && usr.password == pass) {
          if (usr.enable) {
            console.log("ok");
            if (session != undefined) {
              sessionConfig(session, usr);
            }
            ret({
              err: 0
            });
          } else {
            ret({
              err: 2
            });
          }
        } else {
          ret({
            err: 1
          });
        }
      });
    } else {
      ret({
        err: 1
      });
    }
  }

  /*
   * sessionStatus
   */
  function sessionStatus(session, ret) {
    if (session != undefined) {
      ret({
        userid: session.userid,
        name: session.name,
        avatar: session.avatar
      });
    } else {
      ret({});
    }
  }

  return module;
})({});
