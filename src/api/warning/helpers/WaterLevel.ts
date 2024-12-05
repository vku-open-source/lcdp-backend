import axios from 'axios';
import { vndmsAxios } from '../../../axios/AxiosCfg';

const extractWaterLevel = (popupInfo: string) => {
    const regex = /Mực nước \(([\d.]+)\(m\)/; 
    const match = popupInfo.match(regex); 
    return match ? match[1] : null; 
};


export const getWaterLevel = async (lv: number) => {
    const response = await vndmsAxios.get(`/water_level?lv=${lv}`);
    const data = response.data;
    const features = data?.features || [];
    const processedData = features.map((feature: any) => {
        const coordinates = feature.geometry?.coordinates || [];
        const properties = feature.properties || {};
        const waterLevel = extractWaterLevel(properties.popupInfo);

        return {
            lat: coordinates[1], 
            long: coordinates[0], 
            label: properties.label || "Unknown", 
            popupInfo: properties.popupInfo || "Unknown", 
            warning_level: lv, 
            warning_type: "water_level",
            water_level: waterLevel
        };
    });

    return processedData;
};

