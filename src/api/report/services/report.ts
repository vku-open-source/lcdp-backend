/**
 * report service
 */

import { factories } from '@strapi/strapi';
import { llmServiceAxios } from '../../../axios/AxiosCfg';

export default factories.createCoreService('api::report.report', ({ strapi }) => ({
    async create(ctx: any):Promise<any> {
        const eop_id:any =  ctx.data.eop;
        const eop:any = await strapi.entityService.findOne('api::eop.eop', eop_id);
        const existingReport = await strapi.entityService.findMany('api::report.report', {
            filters: { eop: eop_id },
        });

        if (existingReport.length > 0) {
            return { message: 'Report already exists' };
        }
        let eopTasks = [];
        if (eop) {
            eopTasks = await strapi.entityService.findMany('api::eop-task.eop-task', eop.documentId);
        }
        const eopTasksData = {
            'eop': eop,
            'eopTasks': eopTasks
        };
        const prompt = `
            bạn là một nhà phân tích thiên tai, tôi cần bạn viết một báo cáo về tình hình thiên tai 
            từ tình trạng những công việc của người tình nguyện viên đi cứu hộ
            ở vị trí {sos location}
            hãy viết cho tôi một báo cáo công việc chi tiết và rõ ràng
            => task done -> cứu hộ 
            -> task falied -> thiệt hại 
            Đây là thông tin về EOP: ${JSON.stringify(eopTasksData)}
        `
        const response = await llmServiceAxios.post('/api/v1/chat/ask-latest-chatbot', {question: prompt})
        await strapi.entityService.create('api::report.report', {
            data: {
                eop: eop_id,
                Content: response.data.answer,
            },
        });
        return {
            'answer': response.data.answer
        };
    }
}));
