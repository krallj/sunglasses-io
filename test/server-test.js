// let Brand = require('../app/models/brand');

const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../app/server");
const expect = chai.expect;
const assert = chai.assert;
let should = chai.should();

chai.use(chaiHTTP);

// GET ALL BRANDS
describe('/GET brands', () => {
  it.only('should get all the brands specified', done => {
    chai
      .request(server)
      .get('/brands')
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(5);
        done();
      });
  });


  it.only('should only return brands specified by the query string', done => {
    chai
      .request(server)
      .get('/brands?query=Oakley') // get lowerCase functionality
      .end((err, res) => {
        // expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(1);
        done();
      });
  });

  it.only("returns all brands if query is missing", done => {
    chai
      .request(server)
      //property doesn't exist
      .get("/brands?query=")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(5);
        done();
      });
    });

  it.only("returns an error message if no brands match the search", done =>{
    chai
    .request(server)
    //property doesn't exist
    .get("/brands?query=adsfasd")
    .end((err, res) => {
      expect(res).to.have.status(404);
      done();
    });
  });

});

// GET ALL PRODUCTS MATCHING BRAND ID
describe('/GET brands/:id/products', () => {
  it.only('should get all products matching brand id', done => {
    chai
      .request(server)
      .get('/brands/1/products')
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(3);
        done();
      });
    });

    
    it.only("returns an error message if no products match the id", done =>{
      chai
      .request(server)
      //property doesn't exist
      .get("/brands/one/products")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });

});

// GET ALL PRODUCTS
describe('/GET products', () => {
  it.only('should get all the products specified', done => {
    chai
      .request(server)
      .get('/products')
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(11);
        done();
      });
  });


  it.only('should only return products specified by the query string', done => {
    chai
      .request(server)
      .get('/products?name=butter&description=world')
      .end((err, res) => {
 //       expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(1);
        done();
      });
  });

  it.only("returns all products if query is missing", done => {
    chai
      .request(server)
      //property doesn't exist
      .get("/products?query=")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(11);
        done();
      });
    });

  it.only("returns an error message if no products match the search", done =>{
    chai
    .request(server)
    //property doesn't exist
    .get("/products?name=animal&description=crackers")
    .end((err, res) => {
      expect(res).to.have.status(404);
      done();
    });
  });

});

describe('/POST login', () => {

  it.only('should post an access token on successful login', done => {
    chai
      .request(server)
      .post('/login')
      .send({
        "username": "yellowleopard753",
        "password": "jonjon"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a('string');
        expect("Content-Type", "application/json");
        done();
      });
  });

  it.only('should return a 401 on an unsuccesful login', done => {
    chai
      .request(server)
      .post('/login')
      .send({
        "username": "Joe",
        "password": "Krall"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(401);
        done();
      });
  });

  it.only('should return a 400 on an incorrectly formatted login', done => {
    chai
      .request(server)
      .post('/login')
      .send({})
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(400);
        done();
      });
  });
});

describe('/GET me/cart', () => {
  it.only('should show the contents of the cart if the user is logged in', done => {
    chai
      .request(server)
      .get('/me/cart')
      .send(        
        {
          username: 'yellowleopard753',
          lastUpdated: 'Sun Jul 05 2020 19:18:49 GMT-0400 (Eastern Daylight Time)', 
          token: 'P180Xz67vPBraYsD'
        }
      )
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(2);
        done();
      });
  });

    it.only('should return a 401 if there is no access token', done => {
      chai
        .request(server)
        .get('/me/cart')
        .send(        
          {}
        )
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

});

describe('/POST me/cart', () => {
  it.only('should add a product to the cart', done => {
    chai
      .request(server)
      .post('/me/cart')
      .send(        
        {
          username: 'yellowleopard753',
          lastUpdated: 'Sun Jul 05 2020 19:18:49 GMT-0400 (Eastern Daylight Time)', 
          token: 'P180Xz67vPBraYsD',
          productId: '1'
        }
      )
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect("Content-Type", "application/json");
        done();
      });
  });

    it.only('should return a 401 if there is no matching access token', done => {
      chai
        .request(server)
        .post('/me/cart')
        .send(        
          {          
            productId: '1'
          }
        )
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it.only('should return a 404 if the item does not exist', done => {
      chai
        .request(server)
        .post('/me/cart')
        .send(        
          {          
            username: 'yellowleopard753',
            lastUpdated: 'Sun Jul 05 2020 19:18:49 GMT-0400 (Eastern Daylight Time)', 
            token: 'P180Xz67vPBraYsD',
            productId: '3242'
          }
        )
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

});

describe('/DELETE me/cart/:productId', () =>  {
  it.only('should delete a product from the cart', done => {
  chai
    .request(server)
    .delete('/me/cart/3')
    .send(        
      {
        username: 'yellowleopard753',
        lastUpdated: 'Sun Jul 05 2020 19:18:49 GMT-0400 (Eastern Daylight Time)', 
        token: 'P180Xz67vPBraYsD',
      }
    )
    .end((err, res) => {
      expect(err).to.be.null;
      res.should.have.status(200);
      expect("Content-Type", "application/json");
      done();
    });

  });

  it.only('should return a 401 if there is no matching access token', done => {
    chai
      .request(server)
      .delete('/me/cart/3')
      .send(        
        {}
      )
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it.only('should return a 404 if the item is not in the cart', done => {
    chai
      .request(server)
      .delete('/me/cart/13')
      .send(        
        {          
          username: 'yellowleopard753',
          lastUpdated: 'Sun Jul 05 2020 19:18:49 GMT-0400 (Eastern Daylight Time)', 
          token: 'P180Xz67vPBraYsD',
        }
      )
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  
});

describe('/POST me/cart/:productId', () =>  {
  it.only('Change the quantity of an item in the cart', done => {
  chai
    .request(server)
    .post('/me/cart/3')
    .send(        
      {
        username: 'yellowleopard753',
        lastUpdated: 'Sun Jul 05 2020 19:18:49 GMT-0400 (Eastern Daylight Time)', 
        token: 'P180Xz67vPBraYsD',
        quantity: 6
      }
    )
    .end((err, res) => {
      expect(err).to.be.null;
      res.should.have.status(200);
      expect("Content-Type", "application/json");
      done();
    });

  });

  it.only('should return a 401 if there is no matching access token', done => {
    chai
      .request(server)
      .post('/me/cart/3')
      .send(        
        {}
      )
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });


  it.only('should return a 400 if the quantity passed in is less than 0', done => {
    chai
      .request(server)
      .post('/me/cart/13')
      .send(        
        {          
          username: 'yellowleopard753',
          lastUpdated: 'Sun Jul 05 2020 19:18:49 GMT-0400 (Eastern Daylight Time)', 
          token: 'P180Xz67vPBraYsD',
          quantity: -1
        }
      )
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  
});