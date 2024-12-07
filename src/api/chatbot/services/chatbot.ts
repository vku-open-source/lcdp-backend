/**
 * chatbot service
 */

import { factories } from '@strapi/strapi';
import { llmServiceAxios } from '../../../axios/AxiosCfg';

export default factories.createCoreService('api::chatbot.chatbot', ({ strapi }) => ({
    async create(ctx: any):Promise<any> {
        const question:any =  ctx.data.question
        const response = await llmServiceAxios.post('/api/v1/chat/ask-latest-chatbot', {question})
        return {
            'answer': response.data.answer
        };
    }
}));
