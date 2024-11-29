import { llmServiceAxios } from "../axios/AxiosCfg";
import nchmfWarning from "../api/nchmf-warning/services/nchmf-warning";
import { factories } from '@strapi/strapi';

export default async function () {
    console.log(new Date());
    const date_now = new Date().toISOString().split('T')[0];
    const isExist = await strapi.entityService.findMany('api::nchmf-warning.nchmf-warning', {
        filters: {
            date: date_now,
          },
    });
    if (isExist.length > 0) {
        console.log("Warning data is already exist!");
        return;
    }
    const WarningResponse = await llmServiceAxios.post('/api/v1/chat/generate-warnings');
    console.log(WarningResponse.data);
    const NchmfWarningResponse = await strapi.entityService.create('api::nchmf-warning.nchmf-warning', {
        data: {
            date: date_now,
            data: WarningResponse.data,
        }
    });
    console.log("Cron job ran successfully!");
}