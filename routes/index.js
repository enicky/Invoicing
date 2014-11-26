if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

var path = require("path");
var cfg = require(path.join(__dirname, '..' , 'configuration', "config"));



define(['fs', 'path', /*'bonescript',*/ 'restler', 'sugar'],
    function (fs, path,/* bonescript,*/ restler, sugar) {

      function module_exists( name ) {
        try { return require.resolve( name ) }
        catch( e ) { return false }
      }

      /**
       * Route-Controller
       *
       * @class Controller
       * @constructor
       */
      var Controller = {};

      /**
       * Show Error page
       * @param req
       * @param res
       */
      Controller.getError = function(req, res){
        res.render('error');
      }


      Controller.index = function (req, res) {
        res.redirect('/login');
      };

      Controller.getLogin = function(req, res){
        var messages = {
          error : [],
          info : []
        };

        var errors = req.flash('error');
        if(errors){
          messages.error = errors;
        }

        res.render('./login/login',{
          messages : messages
        });
      };

      Controller.getLogout = function(req, res){

      }

      /**
       * Get Index once logged on
       * @param req
       * @param res
       */
      Controller.authenticatedIndex = function (req, res) {
        res.render('./authenticated/index',{
          displayName : 'Georgy Guglielmini'
        });
      }

      var exports = Controller;

      return exports;
    });