module.exports = `#graphql
type User {
    _id: ID
    username: String
    password: String
    email: String
    savedBooks: [Book]
}

type Book {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
}

input BookInput {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
}

    type Query {
        getSingleUser(username: String!):User
        me: User
    }

    type Return {
        token: String
        user: User
    }

    type Mutation {
        addUser(username: String!, password: String!, email: String!): User
        saveBook(user: ID, authors: [String], description: String, bookId: String, image: String, link: String, title: String): User
        deleteBook(user: ID, bookId: ID): User
        login(email: String!, password: String!): Return
    }
`;