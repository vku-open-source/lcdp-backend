/**
 * report service
 */

import { factories } from '@strapi/strapi';
import { llmServiceAxios } from '../../../axios/AxiosCfg';

export default factories.createCoreService('api::report.report', ({ strapi }) => ({
    // async create(ctx: any):Promise<any> {
    //     const eop_id:any =  ctx.data.eop;
    //     console.log('eop_id', eop_id);
    //     const eop:any = await strapi.entityService.findOne('api::eop.eop', eop_id);
    //     const existingReport = await strapi.entityService.findMany('api::report.report', {
    //         filters: { eop: eop },
    //     });
    //
    //     if (existingReport.length > 0) {
    //         return { message: 'Report already exists' };
    //     }
    //     let eopTasks = [];
    //     if (eop) {
    //         eopTasks = await strapi.entityService.findMany('api::eop-task.eop-task', eop.documentId);
    //     }
    //     const eopTasksData = {
    //         'eop': eop,
    //         'eopTasks': eopTasks
    //     };
    //     const prompt = `
    //     You are a disaster analyst. I need you to write a report on the current disaster situation,
    //     focusing on the work of volunteers who are engaged in rescue operations at the location {sos location}.
    //     Please write a detailed and clear report about their work.
    //     => task done -> rescue
    //     -> task failed -> damage
    //     Please write in Vietnamese.
    //     Use ${String.fromCharCode(92)}n to represent line breaks.
    //     Here is the information about EOP: ${JSON.stringify(eopTasksData)}
    // `
    // 
    //     const response = await llmServiceAxios.post('/api/v1/chat/ask-without-faiss', {question: prompt})
    //     await strapi.entityService.create('api::report.report', {
    //         data: {
    //             eop: eop,
    //             Content: response.data.answer,
    //         },
    //     });
    //     return {
    //         'answer': response.data.answer
    //     };
    // },
    async find(params): Promise<any> {
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
