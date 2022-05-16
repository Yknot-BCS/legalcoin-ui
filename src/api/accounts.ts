/* eslint-disable */
import axios from 'axios';

const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

const setAccessToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

const query = async function (query: string): Promise<unknown> {
  const res = await axios.post(
    process.env.ACCOUNTS_API_ENDPOINT,
    {
      query,
      variables: { now: new Date().toISOString() }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${getAccessToken()}`
      }
    }
  );
  if (res.data.errors) throw res.data.errors[0];
  else return res.data.data;
};
const mutation = async function (query: string): Promise<unknown> {
  const res = await axios.post(
    process.env.ACCOUNTS_API_ENDPOINT,
    {
      query: `mutation ${query}`,
      variables: { now: new Date().toISOString() }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${getAccessToken()}`
      }
    }
  );
  if (res.data.errors) throw res.data.errors[0];
  else return res.data.data;
};

export default {
  query,
  mutation,
  setAccessToken,
  getAccessToken
};
