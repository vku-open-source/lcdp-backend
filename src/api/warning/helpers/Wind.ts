import axios from 'axios';
import { vndmsAxios } from '../../../axios/AxiosCfg';

const extractWind = (popupInfo: string) => {
    const regex = /Gió\s+\(([\d.]+)\(km\/h\)/; 
    const match = popupInfo.match(regex); 
    return match ? match[1] : null; 
};


export const getWindLevel = async (lv1: number, lv2:number, types:number) => {
    const response = await vndmsAxios.get(`/warning_wind?lv1=${lv1}&lv2=${lv2}&types=${types}`);
    const data = response.data;
    const features = data?.features || [];
    const processedData = features.map((feature: any) => {
        const coordinates = feature.geometry?.coordinates || [];
        const properties = feature.properties || {};
        const windLevel = extractWind(properties.popupInfo);

        return {
            lat: coordinates[1], 
            long: coordinates[0], 
            label: properties.label || "Unknown", 
            warning_type: "warning_wind",
            wind_level: windLevel
        };
    });

    return processedData;
};

export const getAllWindLevel = async () => {
    const lv:any = [
        {lv1:8, lv2:9, types:1},
        {lv1:6,lv2:7,types:1},
        {lv1:8,lv2:9,types:2},
        {lv1:6,lv2:7,types:2},
        {lv1:6,lv2:7,types:3},
        {lv1:12,lv2:17,types:2},
        {lv1:10,lv2:11,types:2},
        {lv1:10,lv2:11,types:3},
        {lv1:12,lv2:17,types:3},
    ];
    let result:any = [];
    for (const level of lv) {
        const data = await getWindLevel(level.lv1,level.lv2,level.types);
        result.push(...data);
    }

    return result;
}