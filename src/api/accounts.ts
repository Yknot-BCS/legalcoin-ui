/* eslint-disable */
import axios from 'axios';

// TODO request error handling
// TODO include bearer token in headers
const headers = {
    'Content-Type': 'application/json',
}

const query = async function (query: string): Promise<unknown>{
  return await axios.post(process.env.ACCOUNTS_API_ENDPOINT, {
    query,
    variables: null
  }, { headers });
};
const mutation = async function (query: string): Promise<unknown>{
    return await axios.post(process.env.ACCOUNTS_API_ENDPOINT, {
      query: `mutation { ${query} }`,
      variables: null
    }, { headers });
  };

export default {
    query,
    mutation
}