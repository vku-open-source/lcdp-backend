/**
 * report service
 */

import { factories } from '@strapi/strapi';
import { llmServiceAxios } from '../../../axios/AxiosCfg';

export default factories.createCoreService('api::report.report', ({ strapi }) => ({
    async create(ctx: any):Promise<any> {
        const eop_id:any =  ctx.data.eop;
        console.log('eop_id', eop_id);
        const eop:any = await strapi.entityService.findOne('api::eop.eop', eop_id);
        const existingReport = await strapi.entityService.findMany('api::report.report', {
            filters: { eop: eop },
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
            Hãy viết bằng tiếng Việt.
            Hãy viết dấu xuống dòng bằng cách thêm dấu xuyệt n
            Đây là thông tin về EOP: ${JSON.stringify(eopTasksData)}
        `
        const response = await llmServiceAxios.post('/api/v1/chat/ask-latest-chatbot', {question: prompt})
        await strapi.entityService.create('api::report.report', {
            data: {
                eop: eop,
                Content: response.data.answer,
            },
        });
        return {
            'answer': response.data.answer
        };
    },
    async find(params):Promise<any> {
        // Ensure params.populate is set to include the desired relations
        const fetchParams = this.getFetchParams({
          ...params,
          populate: {
            eop: true, // Assuming 'eop' is the name of your foreign key relation
            // Add other relations you want to populate here
          },
        });
      
        const { results, pagination } = await super.find(fetchParams);
        return { results, pagination };
      }
}));
