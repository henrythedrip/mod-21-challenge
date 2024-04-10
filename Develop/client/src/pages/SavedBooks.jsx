

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

  const { loading, data, error } = useQuery(getMe, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log(data);
    },
  });
  console.log(data);

  const userData = data?.me || { savedBooks: [] };


  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  const [deleteThisBook] = useMutation(deleteBook, {
    onCompleted: (data) => {

    },
    onError: (error) => {
      console.error('Could not save the book', error);
    }
  });

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { response } = await deleteThisBook({ variables: { bookId: bookId } });
      removeBookId(bookId);
      // reload the data
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

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
