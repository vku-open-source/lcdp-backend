import axios from 'axios';

export const getWaterLevel = async (lv: number) => {
    const response = await axios.get(`http://vndms.dmptc.gov.vn/water_level?lv=${lv}`);
    const data = response.data;
    const features = data?.features || [];
    const processedData = features.map((feature: any) => {
        const coordinates = feature.geometry?.coordinates || [];
        const properties = feature.properties || {};
        
        return {
            lat: coordinates[1], 
            long: coordinates[0], 
            label: properties.label || "Unknown", 
            level: lv, 
            warning_type: "water_level" 
        };
    });

    return processedData;
};