// see SignupForm.js for comments
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useLazyQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { loginUser } from '../utils/mutations';

import Auth from '../utils/auth';

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [login, { loading, error }] = useMutation(loginUser, {
    onCompleted: (data) => {
      console.log(data);
      const { token } = data.login;
      console.log(token);
      localStorage.setItem("id_token", token);
      window.location.reload();
    }
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();


    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    login({
      variables: {
        password: userFormData.password,
        email: userFormData.email,
        // username: userFormData.username
      },
    });

    // try {
    //   const response = await loginUser(userFormData);

    //   if (!response.ok) {
    //     throw new Error('something went wrong!');
    //   }

    //   const { token, user } = await response.json();
    //   console.log(user);
    //   Auth.login(token);
    // } catch (err) {
    //   console.error(err);
    //   setShowAlert(true);
    // }

    // return <h1>{data}</h1>

    setUserFormData({
      email: '',
      password: '',
    });
    console.log(userFormData);
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
