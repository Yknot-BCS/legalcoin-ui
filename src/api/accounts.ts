/* eslint-disable */
import axios from 'axios';

// TODO request error handling
// TODO include bearer token in headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

const query = async function (query: string): Promise<unknown> {
  const res = await axios.post(
    process.env.ACCOUNTS_API_ENDPOINT,
    {
      query,
      variables: null
    },
    { headers }
  );
  if (res.data.errors) throw res.data.errors[0];
  else return res.data.data;
};
const mutation = async function (query: string): Promise<unknown> {
  const res = await axios.post(
    process.env.ACCOUNTS_API_ENDPOINT,
    {
      query: `mutation ${query}`,
      variables: null
    },
    { headers }
  );
  if (res.data.errors) throw res.data.errors[0];
  else return res.data.data;
};

export default {
  query,
  mutation
};
