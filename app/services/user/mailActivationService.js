
var os = require('os');
var config = require('../../../config/config.js');
var User = require('../../models/User');


module.exports = (function(module) {

   /*
   * Public functions
   */
   module.sendActivationMail=sendActivationMail;
   module.sendActivation=sendActivation;

  /*
   * Mail
   */
  if(config.mailActivation){
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport(config.transport);
  }
  function sendActivationMail(usr,ret) {

      var url = os.hostname() + '/activar?userid=' + usr._id + '&secret=' + usr.secret;
      transporter.sendMail({
        from: 'no-reply@' + os.hostname(),
        to: usr.mail,
        subject: 'Notificación de activación',
        html: "Gracias por registrarse en " + os.hostname() + ".<br>Para activar su cuenta vaya a la siguiente url: <br>" +
          "<a href=\"" + url + "\">" + url + "</a>"
      }, function(error, info){
        ret(error,true);
      });
  }

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
  function sendActivation(username, password, mail, ret) {
    if (username != undefined && pass != undefined) {
      User.findOne({
        name: new RegExp("^" + username.toLowerCase() + "$", "i")
      }).exec({}, function(err, usr) {
        if (!err && usr.password == password) {
          if (usr.enable==1) {
            ret({
              err: 2
            });
          } else {
            if (mail != undefined) {
              usr.mail = mail;
              usr.save();
            }
            sendActivationMail(usr,function(err,activation){
              if (err==null&&activation) {
                ret({
                  err: 0
                });
              }else{
                ret({
                  err: 3
                });
              }
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
  return module;
})({});
