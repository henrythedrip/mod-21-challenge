import { gql } from '@apollo/client';

export const loginUser = gql`
query Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        username
        password
        email
        savedBooks {
          authors
          description
          bookId
          image
          link
          title
        }
      }
    }
  }
`

export const getMe = gql`
query getMe {
  me {
    _id
    username
    email
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
  }
}
`;
