// import { useState, useEffect } from 'react';
// import {
//   Container,
//   Card,
//   Button,
//   Row,
//   Col
// } from 'react-bootstrap';

// import { deleteBook } from '../utils/mutations';
// import { getMe } from '../utils/queries';
// import Auth from '../utils/auth';
// import { removeBookId } from '../utils/localStorage';

// const SavedBooks = () => {
//   const [userData, setUserData] = useState({});

//   // use this to determine if `useEffect()` hook needs to run again
//   const userDataLength = Object.keys(userData).length;

//   useEffect(() => {
//     const getUserData = async () => {
//       try {
//         const token = Auth.loggedIn() ? Auth.getToken() : null;

//         if (!token) {
//           return false;
//         }

//         const response = await getMe(token);

//         if (!response.ok) {
//           throw new Error('something went wrong!');
//         }

//         const user = await response.json();
//         setUserData(user);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     getUserData();
//   }, [userDataLength]);

//   // create function that accepts the book's mongo _id value as param and deletes the book from the database
//   const handleDeleteBook = async (bookId) => {
//     const token = Auth.loggedIn() ? Auth.getToken() : null;

//     if (!token) {
//       return false;
//     }

//     try {
//       const response = await deleteBook(bookId, token);

//       if (!response.ok) {
//         throw new Error('something went wrong!');
//       }

//       const updatedUser = await response.json();
//       setUserData(updatedUser);
//       // upon success, remove book's id from localStorage
//       removeBookId(bookId);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // if data isn't here yet, say so
//   if (!userDataLength) {
//     z
//     return <h2>LOADING...</h2>;
//   }

//   return (
//     <>
//       <div fluid className="text-light bg-dark p-5">
//         <Container>
//           <h1>Viewing saved books!</h1>
//         </Container>
//       </div>
//       <Container>
//         <h2 className='pt-5'>
//           {userData.savedBooks.length
//             ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
//             : 'You have no saved books!'}
//         </h2>
//         <Row>
//           {userData.savedBooks.map((book) => {
//             return (
//               <Col md="4">
//                 <Card key={book.bookId} border='dark'>
//                   {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
//                   <Card.Body>
//                     <Card.Title>{book.title}</Card.Title>
//                     <p className='small'>Authors: {book.authors}</p>
//                     <Card.Text>{book.description}</Card.Text>
//                     <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
//                       Delete this Book!
//                     </Button>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             );
//           })}
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default SavedBooks;

import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { deleteBook } from '../utils/mutations';
import Auth from '../utils/auth';
import { getMe } from '../utils/queries';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { SaveBook } from '../utils/mutations';
import { saveBook } from '../utils/API';

const SavedBooks = () => {
  // const [userData, setUserData] = useState({
  //   savedBooks: []
  // });

  const { loading, data, error } = useQuery(getMe);
  // console.log("loading: ", loading);
  // console.log("data: ", data);
  // console.log("error: ", error);

  const userData = data?.me || {};


  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;


  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const token = Auth.loggedIn() ? Auth.getToken() : null;

  //       if (!token) {
  //         return false;
  //       }

  //       // this should be talking to our api to get user data based on the users token, however now its only giving us html, the html is for the react application and not for a 404 page.
  //       // because we get html and not json, we error out and never actually do anything
  //       // i think it does this because we never actually use the routes that we defined, and instead we get a 404 spa from react
  //       // const response = await getMe(token);

  //       if (!response.ok) {
  //         throw new Error('something went wrong!');
  //       }


  //       console.log(response);
  //       const text = await response.text();

  //       console.log(text);



  //       const user = await response.json();
  //       console.log(user);
  //       setUserData(user);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   getUserData();
  // }, []);

  // }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await deleteBook(bookId, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  // if (!userData.length) {
  //   return <h2>LOADING...</h2>;
  // }
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      {/* {!userData.keys().length ? <h2>LOADING...</h2> : <></>} */}
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
