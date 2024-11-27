import axios from 'axios';

const extractWaterLevel = (popupInfo: string) => {
    const regex = /Mực nước \(([\d.]+)\(m\)/; // Biểu thức chính quy tìm mực nước (xử lý giá trị dạng 1.41(m))
    const match = popupInfo.match(regex); // Tìm kiếm theo biểu thức chính quy
    return match ? match[1] : null; // Trả về mực nước nếu tìm thấy, ngược lại trả về null
};


export const getWaterLevel = async (lv: number) => {
    const response = await axios.get(`http://vndms.dmptc.gov.vn/water_level?lv=${lv}`);
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
            warning_level: lv, 
            warning_type: "water_level",
            water_level: waterLevel
        };
    });

    return processedData;
};