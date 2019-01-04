var app = require("../server");

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();
var assert = require("assert");

var Test = require("../app/models/Test");

describe("Check alive", function() {
  before(function(done) {
      done();
    }),
    it("alive",
      function(done) {
        chai.request(app)
          .get('/')
          .end(function(err, res) {
            res.should.have.status(200);
            done();
          });
      }
    ), after(function(done) {
      done();
    })
});

describe("Check mongoDB", function() {
  before(function(done) {
      Test.deleteMany(function(){
        done();
      });
    }),
    it("not exists",
      function(done) {
        Test.findOne({
          data: 'lol'
        }).exec(function (err, res) {
          assert(res==null);
          done();
        });
      }
    ),
    it("create",
      function(done) {
        chai.request(app) // Create
          .get('/test')
          .end(function(err, res) {
            res.should.have.status(200);
            done();
        })
      }
    ),
    it("exists",
      function(done) {
        Test.findOne({
          data: 'lol'
        }).exec(function (err,res) {
          assert.notEqual(res,null);
          assert(res.data,'lol');
          done();
        });
      }
    ), after(function(done) {
      Test.deleteMany(function(){
        done();
      });
    })
});
