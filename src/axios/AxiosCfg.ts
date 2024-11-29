import axios from 'axios';

const vndmsBaseURL = 'http://vndms.dmptc.gov.vn';

export const vndmsAxios = axios.create({
    baseURL: vndmsBaseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const llmServiceBaseURL = `http://${process.env.LLM_SERVICE_HOST}:${process.env.LLM_SERVICE_PORT}`;
export const llmServiceAxios = axios.create({
    baseURL: llmServiceBaseURL,
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
    },
});