/* eslint-disable */
import useJwt from 'src/core/auth/jwt/useJwt';
import axios from 'axios';

const { jwt } = useJwt(axios, {});
export default jwt;
