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
        console.log('eerrors : ', errors);
        if(errors){
          messages.error = errors;
        }

        res.render('./login/login',{
          messages : messages
        });
      };

      Controller.getLogout = function(req, res){
        req.logout();
        res.redirect('/');
      }

      /**
       * Get Index once logged on
       * @param req
       * @param res
       */
      Controller.authenticatedIndex = function (req, res) {
        var mm = req.app.get('mongo');
        mm.getImportantKlanten(function(err, importantKlanten){
          mm.getAlmostEmptyStock(function(err, emptyStock){
            res.render('./authenticated/index',{
              displayName : 'Georgy Guglielmini',
              important : importantKlanten,
              emptystock : emptyStock
            });
          })
        })

      }

      ///KLANTEN
      /**
       * Toon overzicht alle klanten
       * @param req
       * @param res
       */
      Controller.authenticatedKlanten = function(req, res){
        var mm = req.app.get('mongo');
        mm.getAllKlanten(function(err, klanten){
          res.render('./authenticated/klanten/index',{
            displayName : 'Georgy Guglielmini',
            klanten : klanten
          });
        })
      };

      /**
       * Toon het new - klant schermpje
       * @param req
       * @param res
       */
      Controller.authenticatedKlantenNew = function(req, res){
        res.render('./authenticated/klanten/new',{
          displayName : 'Georgy Guglielmini',
        });
      }

      /**
       * nieuwe klant toevoegen ...
       * @param req
       * @param res
       */
      Controller.authenticatedKlantenPostNew = function(req, res){
        var naam = req.body.naam;
        var straat = req.body.straat;
        var nummer = req.body.nummer;
        var gemeente = req.body.gemeente;
        var postcode = req.body.postcode;
        var isbelangrijk = req.body.belangrijk;
        if(typeof (isbelangrijk) == "undefined"){
          isbelangrijk = false;
        }else if(isbelangrijk == 'on'){
          isbelangrijk = true;
        }

        var newKlant = {
          naam : naam,
          straat : straat,
          nummer : nummer,
          gemeente : gemeente,
          postcode : postcode,
          important : isbelangrijk
        };

        var mm = req.app.get('mongo');
        mm.addNewKlant(newKlant, function(err){
          res.redirect('/authenticated/klanten');
        });
      }

      Controller.authenticatedKlantenPostEdit = function(req, res){
        var klantid = req.body.klantid;
        var naam = req.body.naam;
        var straat = req.body.straat;
        var nummer = req.body.nummer;
        var gemeente = req.body.gemeente;
        var postcode = req.body.postcode;
        var isbelangrijk = req.body.belangrijk;
        if(typeof (isbelangrijk) == "undefined"){
          isbelangrijk = false;
        }else if(isbelangrijk == 'on'){
          isbelangrijk = true;
        }

        var newKlant = {
          naam : naam,
          straat : straat,
          nummer : nummer,
          gemeente : gemeente,
          postcode : postcode,
          important : isbelangrijk
        };

        var mm = req.app.get('mongo');
        mm.updateKlant(klantid, newKlant, function(err){
          res.redirect('/authenticated/klanten');
        });
      }

      /**
       * Edit een klant
       * @param req
       * @param res
       */
      Controller.authenticatedKlantenEdit = function(req, res){
        var klantid = req.params.klantid;
        var mm = req.app.get('mongo');
        mm.getKlantById(klantid, function(err, klant){
          res.render('./authenticated/klanten/edit',{
            displayName : 'Georgy Guglielmini',
            klant : klant
          });
        });
      };

      Controller.authenticatedKlantenDelete = function(req, res){
        var klantid = req.params.klantid;
        var mm = req.app.get('mongo');
        mm.removeKlantById(klantid, function(err, klant){
          res.redirect('/authenticated/klanten');
        });
      }

      //STOCK
      Controller.authenticatedStock = function(req, res){
        var mm = req.app.get('mongo');
        mm.getAllStock(function(err, stock){
          res.render('./authenticated/stock',{
            displayName : 'Georgy Guglielmini',
            stock : stock
          });
        });
      }

      Controller.authenticatedStockNew = function(req, res){
        res.render('./authenticated/stock/new',{displayName : 'Georgy Guglielmini'});
      }

      /**
       * voeg nieuwe stock toe
       * @param req
       * @param res
       */
      Controller.authenticatedStockPostNew = function(req, res){
        var naam = req.body.naam;
        var stock = req.body.stock;

        var newArticle = {
          naam : naam,
          stock : stock
        };

        var mm = req.app.get('mongo');
        mm.addNewArticle(newArticle, function(err){
          res.redirect('/authenticated/stock');
        });
      }

      /**
       * Render edit page for stock
       * @param req
       * @param res
       */
      Controller.authenticatedStockEdit  =function(req, res){
        var stockid = req.params.stockid;
        var mm = req.app.get('mongo');
        mm.getStockById(stockid, function(err, stock){
          res.render('./authenticated/stock/edit',{
            displayName : 'Georgy Guglielmini',
            stock : stock
          });
        });
      }

      Controller.authenticatedStockPostEdit = function(req, res){
        var stockid = req.body.stockid;
        var naam = req.body.naam;
        var stock = req.body.stock;

        var newArticle = {
          naam : naam,
          stock : stock
        };

        var mm = req.app.get('mongo');
        mm.updateKlant(klantid, newKlant, function(err){
          res.redirect('/authenticated/klanten');
        });
      }

      var exports = Controller;

      return exports;
    });