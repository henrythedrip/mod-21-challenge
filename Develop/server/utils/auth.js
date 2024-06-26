// const jwt = require('jsonwebtoken');

// // set token secret and expiration date
// const secret = 'henrythedripissexy';
// const expiration = '2h';

// module.exports = {
//   // function for our authenticated routes
// authMiddleware: function (req, res, next) {
//   // allows token to be sent via  req.query or headers
//   let token = req.query.token || req.headers.authorization;

//   // ["Bearer", "<tokenvalue>"]
//   if (req.headers.authorization) {
//     token = token.split(' ').pop().trim();
//   }

//   if (!token) {
//     return res.status(400).json({ message: 'You have no token!' });
//   }

//   // verify token and get user data out of it
//   try {
//     const { data } = jwt.verify(token, secret, { maxAge: expiration });
//     req.user = data;
//   } catch {
//     console.log('Invalid token');
//     return res.status(400).json({ message: 'invalid token!' });
//   }

//   // send to next endpoint
//   next();
// },
//   signToken: function ({ username, email, _id }) {
//     const payload = { username, email, _id };

//     return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
//   },
// };

const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const secret = "henrythedripissexy";
const expiration = "2h";

module.exports = {
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  authMiddleware: function ({ req }) {
    // console.log("Query: " + req.query);
    // console.log("Headers: " + req.headers);
    let token = req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }
    console.log("Token Found: " + token);
    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;

      console.log(req.user);
      return req;
    } catch {
      console.log("Invalid token");
      return req;
    }
  },
  signToken: function ({ email, name, _id }) {
    const payload = { email, name, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};