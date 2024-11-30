/**
 * warning service
 */

import { factories } from '@strapi/strapi';
import axios from 'axios';
import { getWaterLevel } from '../helpers/WaterLevel';
import { getAllWindLevel } from '../helpers/Wind';
import { getAllRainLevel } from '../helpers/Rain';
import { getEarthQuake } from '../helpers/Earthquake';

export default factories.createCoreService('api::warning.warning', ({ strapi }) => ({
    async find(ctx: any):Promise<any> {
        const lv = [1, 2, 3];

        const waterLevelPromises = lv.map(level => getWaterLevel(level));

        const [waterLevels, windLevels, rainLevels, earthquakeData] = await Promise.all([
            Promise.all(waterLevelPromises), 
            getAllWindLevel(),          
            getAllRainLevel(),            
            getEarthQuake()                 
        ]);

        const result = [
            ...waterLevels.flat(),
            ...windLevels,
            ...rainLevels,
            ...earthquakeData
        ];

        return result;
    },
}));
