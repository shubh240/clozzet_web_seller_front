import axios from 'axios';

import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';
const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    saveSession
  } = useAuthContext();
  const [searchParams] = useSearchParams();
  const {
    showNotification
  } = useNotificationContext();
  const loginFormSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string().required('Please enter your password')
  });
  const {
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: 'jatin@clozzetindia.com',
      password: '123456789'
    }
  });
  const redirectUser = () => {
    const redirectLink = searchParams.get('redirectTo');
    if (redirectLink) navigate(redirectLink);else navigate('/');
  };

  const login2 = handleSubmit(async (values) => {
  setLoading(true);
  try {
    // Define the base URL
    const baseUrl = 'https://server.clozzetindia.in:3001/api/v1/';

    // Perform the login request using fetch
    const response = await fetch(`${baseUrl}user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values), // Send the login credentials
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Login failed');
    }

    // Parse the JSON response
    const res = await response.json();

    // Check if the token is present in the response
    if (res?.data?.token) {
      saveSession({
        ...res.data, // Destructure to include the user data
        token: res.data.token, // Add the token to the session
      });

      redirectUser(); // Redirect the user after successful login

      showNotification({
        message: 'Successfully logged in. Redirecting....',
        variant: 'success',
      });
    } else {
      // Handle case where no token is present in response
      throw new Error('Token not found in the response');
    }
  } catch (e) {
    // Handle any errors
    if (e.message) {
      showNotification({
        message: e.message || 'Login failed',
        variant: 'danger',
      });
    } else {
      showNotification({
        message: 'An unknown error occurred',
        variant: 'danger',
      });
    }
  } finally {
    setLoading(false); 
  }
});
const login = handleSubmit(async (values) => {
  setLoading(true);
  try {
    // Define the base URL
    const baseUrl = 'https://server.clozzetindia.in:3001/api/v1/';

    // Perform the login request using axios
    const res = await axios.post(
      `${baseUrl}user/login`,
      values, 
      {
        headers: {
          'Content-Type': 'application/json', 
        },
        withCredentials: true, 
      }
    );

    if (res.data?.data?.token) {
      saveSession({
        ...res.data.data, // Spread the user data (firstName, lastName, etc.)
        token: res.data.data.token, // Add the token to the session
      });

      // Redirect the user after successful login
      redirectUser();

      // Show success notification
      showNotification({
        message: 'Successfully logged in. Redirecting....',
        variant: 'success',
      });
    } else {
      // If no token found in the response, show an error notification
      throw new Error('Token not found in the response');
    }
  } catch (e) {
    // Handle any errors
    console.error('Login error:', e);
    if (e.response?.data?.error) {
      // Display error message if available in the response
      showNotification({
        message: e.response?.data?.error || 'Login failed',
        variant: 'danger',
      });
    } else {
      // General error handling if no specific error message
      showNotification({
        message: 'An unknown error occurred',
        variant: 'danger',
      });
    }
  } finally {
    setLoading(false); // Stop the loading spinner when the request is done
  }
});

  const login1 = handleSubmit(async values => {
    try {
      const res = await httpClient.post('/login', values);
      if (res.data.token) {
        saveSession({
          ...(res.data ?? {}),
          token: res.data.token
        });
        redirectUser();
        showNotification({
          message: 'Successfully logged in. Redirecting....',
          variant: 'success'
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e) {
      if (e.response?.data?.error) {
        showNotification({
          message: e.response?.data?.error,
          variant: 'danger'
        });
      }
    } finally {
      setLoading(false);
    }
  });
  return {
    loading,
    login,
    control
  };
};
export default useSignIn;