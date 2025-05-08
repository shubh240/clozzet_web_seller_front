import axios from 'axios';
// function HttpClient() {
//   return {
//     get: axios.get,
//     post: axios.post,
//     patch: axios.patch,
//     put: axios.put,
//     delete: axios.delete
//   };
// }
// export default HttpClient();

const httpClient = axios.create({
  baseURL: 'https://server.clozzetindia.in:3001', // ✅ correct base
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default httpClient;
