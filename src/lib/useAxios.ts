import axios, {AxiosInstance} from 'axios';

const useAxios: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4000/',
});

export default useAxios;
