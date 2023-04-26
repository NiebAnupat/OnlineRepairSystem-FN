import axios, {AxiosInstance} from 'axios';

const useAxios: AxiosInstance = axios.create({
  baseURL: 'https://server.anupat-dav.com/',
});

export default useAxios;
