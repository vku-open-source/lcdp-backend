import { vndmsAxios } from '../../../axios/AxiosCfg';

export const getEarthQuake = async () => {
    const response = await vndmsAxios.get(`/EventDisaster/List`);
    const DISASTER_MAPPING = {
        11: "warning_earthquake",
        3: "warning_flood",
        23: "warning_heavy_rain",
    };

    const data = response.data;
    console.log(data);
    const features = data;
    const processedData = features.map((feature: any) => {
        const properties = feature.properties || {};
        return {
            lat: feature.lat, 
            long: feature.lon, 
            label: feature.kv_anhhuong || "Unknown", 
            warning_type: DISASTER_MAPPING[feature.disaster.id] || "Unknown",
        };
    });

    return processedData;
}