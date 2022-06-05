/* eslint-disable */
import axios from 'axios';
import auth from 'src/auth';

const query = async function (query: string): Promise<unknown> {
  try {
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
          Authorization: `Bearer ${auth.getAccessToken()}`
        }
      }
    );
    if (res.data.errors) throw res.data.errors[0];
    else return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response.data.errors[0]);
    } else throw (error as Error);
  }
};

const mutation = async function (query: string): Promise<unknown> {
  try {
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
          Authorization: `Bearer ${auth.getAccessToken()}`
        }
      }
    );
    if (res.data.errors) throw res.data.errors[0];
    else return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response.data.errors[0]);
    } else throw (error as Error);
  }
};

export default {
  query,
  mutation
};
