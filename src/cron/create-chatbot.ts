import { llmServiceAxios } from "../axios/AxiosCfg";
import { factories } from '@strapi/strapi';

export default async function () {
    try {
        await llmServiceAxios.post('/api/v1/chat/create-chatbot');
        console.log("Create chatbot successfully!");
    } catch (error) {
        console.error('Error creating chatbot:', error.message || error);
        console.log('Chatbot is already exist!');
    }
}
