/**
 * warning service
 */

import { factories } from '@strapi/strapi';
import axios from 'axios';
import { getWaterLevel } from '../helpers/WaterLevel';

export default factories.createCoreService('api::warning.warning', ({ strapi }) => ({
    async find(ctx: any) {
        const lv = [1, 2, 3];
        let result:any = [];
        for (const level of lv) {
            const data = await getWaterLevel(level);
            result.push(...data);
        }
        

        return result;
    },
}));
