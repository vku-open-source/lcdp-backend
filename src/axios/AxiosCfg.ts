import axios from 'axios';

const vndmsBaseURL = 'http://vndms.dmptc.gov.vn';

export const vndmsAxios = axios.create({
    baseURL: vndmsBaseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});