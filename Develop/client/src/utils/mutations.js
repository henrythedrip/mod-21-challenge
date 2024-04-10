import { gql } from '@apollo/client';

export const loginUser = gql`
mutation loginUser($email: String!, $password: String!) {
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

export const SaveBook = gql`
mutation saveBook($user: ID, $authors: [String], $description: String, $bookId: String, $image: String, $link: String, $title: String){
  saveBook(user: $user, authors: $authors, description: $description, bookId: $bookId, image: $image, link: $link, title: $title) {
    _id
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
`;
// export const SaveBook = gql`
// mutation saveBook($bookData: BookInput) {
//   saveBook(bookData: $bookData) {
//     savedBooks {
//       authors
//       description
//       bookId
//       image
//       link
//       title
//     }
//   }
// }
// `

export const deleteBook = gql`
mutation deleteBook($bookId: String) {
  deleteBook(bookId: $bookId) {
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
`

const removeBook = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      savedBooks {
        bookId
      }
    }
  }
`;