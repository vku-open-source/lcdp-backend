import { vndmsAxios } from '../../../axios/AxiosCfg';

const extractRain = (popupInfo: string) => {
    const regex = /Tổng lượng mưa:\s*<b>([^<]+)<\/b>/; 
    const match = popupInfo.match(regex); 
    return match ? match[1] : null; 
};


export const getRainLevel = async (lv1: number, lv2:number, types:number) => {
    const response = await vndmsAxios.get(`/warning_rain?lv1=${lv1}&lv2=${lv2}&types=${types}`);
    const data = response.data;
    const features = data?.features || [];
    const processedData = features.map((feature: any) => {
        const coordinates = feature.geometry?.coordinates || [];
        const properties = feature.properties || {};
        const rainLevel = extractRain(properties.popupInfo);

        return {
            lat: coordinates[1], 
            long: coordinates[0], 
            label: properties.label || "Unknown", 
            popupInfo: properties.popupInfo || "Unknown", 
            warning_type: "warning_rain",
            rain_level: rainLevel
        };
    });

    return processedData;
};

export const getAllRainLevel = async () => {
    const lv:any = [
        {lv1:300,lv2:1000,types:5},
        {lv1:300,lv2:1000,types:4},
        {lv1:300,lv2:1000,types:3},
        {lv1:300,lv2:1000,types:2},
        {lv1:100,lv2:200,types:1},
        {lv1:200,lv2:300,types:1},
        {lv1:100,lv2:200,types:5},
        {lv1:200,lv2:300,types:5},
        {lv1:100,lv2:200,types:4},
        {lv1:200,lv2:300,types:4},
        {lv1:100,lv2:200,types:3},
        {lv1:200,lv2:300,types:3},
        {lv1:200,lv2:300,types:2},
        {lv1:100,lv2:200,types:2},
        {lv1:200,lv2:1000,types:7},
        {lv1:100,lv2:200,types:7},
        {lv1:50,lv2:100,types:1},
        {lv1:50,lv2:100,types:5},
        {lv1:50,lv2:100,types:4},
        {lv1:50,lv2:100,types:3},
        {lv1:50,lv2:100,types:2},
    ];
    let result:any = [];
    for (const level of lv) {
        const data = await getRainLevel(level.lv1,level.lv2,level.types);
        result.push(...data);
    }

    return result;
}