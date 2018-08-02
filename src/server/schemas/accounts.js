const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLID
} = require('graphql');

const BlogType = new GraphQLObjectType({
  name: 'Blog',
  fields: {
    id: { type: GraphQLID },
    author: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    pageviews: {
      type: GraphQLInt,
      resolve: (root, args, context, info) =>
        new Promise((resolve, reject) => {
          if(!context.decodedToken || context.decodedToken.user != root.author) {
            return reject('A valid authorization token is required');
          }
          resolve(root.pageviews);
        })
    },
  }
});

const AccountType = new GraphQLObjectType({
  name: 'Account',
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    password: { type: GraphQLString }
  }
});

const accountsMock = [
  {
    id: 1,
    username: "kbespalyi",
    password: "$2a$10$wMWiHLos.YH80OnqY9rT3OuvNcbD7D.F.ChFFNZchg9cHhBdZ14/."
  },
  {
    id: 2,
    username: "mraboy",
    password: "$2b$10$gl3LguqEMDnt4MRr3oQNjuRZO3nWGRESIPuTfv0CC2h9/NB.kb4pe"
  }
];

const blogsMock = [
  {
    id: 1,
    author: "nraboy",
    title: "Sample Article",
    content: "This is a sample article written by Nic Raboy",
    pageviews: 1000
  }
];

module.exports = new GraphQLSchema({
  auth: new GraphQLObjectType({
    name: 'Authentication',
    fields: {
      account: {
        type: AccountType,
        resolve: (root, args, context, info) =>
          new Promise((resolve, reject) => {
            if(!context.decodedToken) {
                return reject("A valid authorization token is required");
            }
            for(var i = 0; i < accountsMock.length; i++) {
                if(accountsMock[i].username == context.decodedToken.user) {
                    return resolve(accountsMock[i]);
                }
            }
            resolve(null);
          })
      },
      blogs: {
        type: GraphQLList(BlogType),
        resolve: (root, args, context, info) => blogsMock
      }
    }
  })
});
