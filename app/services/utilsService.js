module.exports = (function(module) {

  /*
   * Public functions
   */
   module.getVariable=getVariable;

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

  return module;
})({});
