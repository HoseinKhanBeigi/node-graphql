import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
const users = [
  { id: "1", name: "music", email: "hsoe@gmail.com", age: 12 },
  { id: "2", name: "manoto", email: "hsoer@gmail.com", age: 32 },
  { id: "3", name: "rezaHasan", email: "hsoer@gmail.com", age: 2 }
];

const posts = [
  {
    id: "10",
    title: "aaa",
    body: "hsoe@gmail.com",
    published: true,
    author: "1"
  },
  {
    id: "11",
    title: "bbb",
    body: "hsoer@gmail.com",
    published: true,
    author: "1"
  },
  {
    id: "12",
    title: "ccc",
    body: "hsoer@gmail.com",
    published: false,
    author: "3"
  }
];

const commands = [
  { id: "1", text: "how", author: "1", post: "10" },
  { id: "2", text: "areYou", author: "1", post: "11" }
];

const typeDefs = `
    type Query{
       me: User!
       users(query: String): [User!]!
       posts(query: String): [Post!]!
       commands(query: String): [Command!]!
       post: Post!
       command: Command!
    }

    type Command{
        id:ID!
        text:String!
        author:User!
        post:Post!
    }

    type Mutation{
        createUser(name:String! ,email:String! ,age:Int) :User!
        createPost(title:String! ,body:String! ,published: Boolean! ,author:ID!) :Post!
    }

    type User{
        id:ID!
        name:String!
        email:String!
        age:Int
        posts:[Post!]!
        commands:[Command!]!
    }

    type Post{
        id:ID!
        title:String!
        body:String!
        published:Boolean!
        author:User!
        commands:[Command!]!
    }
`;

const resolvers = {
  Query: {
    users(parent, args, cts, info) {
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        const nameBody = user.name
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const emalBody = user.email
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return nameBody || emalBody;
      });
    },
    posts(parent, args, cts, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        const nameBody = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const emalBody = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return nameBody || emalBody;
      });
    },
    commands(parent, args, cts, info) {
      if (!args.query) {
        return commands;
      }
      return commands.filter(post => {
        const nameBody = post.text
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return nameBody;
      });
    },
    post() {
      return {
        id: "2",
        title: "asdasd",
        body: "",
        published: false
      };
    },
    command() {
      return {
        id: "1222a",
        text: "how are you going townight"
      };
    }
  },
  Mutation: {
    createUser(parent, args, cts, info) {
      const emailTaken = users.some(user => user.email === args.email);

      if (emailTaken) {
        throw Error("emme");
      }

      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age
      };

      users.push(user);
      return user;
    },
    createPost(parent, args, cts, info) {
      const emailTake3n = users.some(user => user.id === args.author);

      if (!emailTake3n) {
        throw Error("emme");
      }

      const post = {
        id: uuidv4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author
      };

      posts.push(post);
      return post;
    }
  },
  Post: {
    author(parent, args, cts, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    commands(parent, args, cts, info) {
      return commands.filter(command => {
        return command.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, cts, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    commands(parent, args, cts, info) {
      return commands.filter(command => {
        return command.author === parent.id;
      });
    }
  },
  Command: {
    author(parent, args, cts, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, cts, info) {
      return posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log("Server is running on localhost:4000"));
