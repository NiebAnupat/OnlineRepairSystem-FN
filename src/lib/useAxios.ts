import axios from 'axios';

const useAxios = axios.create({
  baseURL: 'http://localhost:4000/',
});

export default useAxios;
