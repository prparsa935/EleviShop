import Axios from 'axios';

const bearerToken = 'YOUR_BEARER_TOKEN_HERE';

Axios.defaults.headers.common['Authorization'] = `Bearer ${bearerToken}`;

export default Axios;