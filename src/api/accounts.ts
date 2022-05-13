/* eslint-disable */
import axios from 'axios';

const query = async function (query: string): Promise<unknown>{
  return await axios.post(process.env.ACCOUNTS_API_ENDPOINT, {
    query,
    variables: null
  });
};
const mutation = async function (query: string): Promise<unknown>{
    const res = await axios.post(process.env.ACCOUNTS_API_ENDPOINT, {
      query: `mutation { ${query} }`,
      variables: null
    });
    return res.data;
  };

export default {
    query,
    mutation
}