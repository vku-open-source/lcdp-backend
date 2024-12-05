import { getEarthQuake } from "../api/warning/helpers/Earthquake";
import { getAllRainLevel } from "../api/warning/helpers/Rain";
import { getWaterLevel } from "../api/warning/helpers/WaterLevel";
import { getAllWindLevel } from "../api/warning/helpers/Wind";
import { llmServiceAxios } from "../axios/AxiosCfg";
import { factories } from "@strapi/strapi";

export default async function () {
  try {
    const lv = [1, 2, 3];

    const waterLevelPromises = lv.map((level) => getWaterLevel(level));

    const [waterLevels, windLevels, rainLevels, earthquakeData] =
      await Promise.all([
        Promise.all(waterLevelPromises),
        getAllWindLevel(),
        getAllRainLevel(),
        getEarthQuake(),
      ]);

    const result = [
      ...waterLevels.flat(),
      ...windLevels,
      ...rainLevels,
      ...earthquakeData,
    ];
    console.log(result);
    const datetime = new Date();
    const NchmfWarningResponse = await strapi.entityService.create(
      "api::vndms-warning.vndms-warning",
      {
        data: {
          datetime: datetime,
          data: result,
        },
      }
    );
  } catch (error) {
    console.error("Error generating vndms warning:", error.message || error);
  }
}
