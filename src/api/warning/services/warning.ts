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
            {
                "lat": 12.991999626159668,
                "long": 107.69200134277344,
                "label": "Đắk Nông",
                "popupInfo": "<div class=\"station-popup-info\"><div class=\"row-popup\"><div class=\"col-popup-left\"><li>Tên trạm: <b>Đắk Nông</b> </li><li>Mã trạm: <b>71720</b></li><li>Địa điểm: <b>Đắk Nông</b></li><li>   Sông: <b>Đắk Nông</b></li><li>Nguồn: <b>KTTV</b></li><li><b>Mực nước (589.35(m) 1-06/12)</b> </li><li class='detalRain' data-id='71720' onclick='detailrain(`71720`,`Water`,1)' ><a class=\"description-class\">Chi tiết <i class=\"fa fa-caret-right\" aria-hidden=\"true\"></i> </a></b></li></div><li><img class='agri-chart-img'  src=\"https://quickchart.io/chart?height=175&c={ type: 'bar', data: { 'labels': ['1h \n5/12','7h \n5/12','13h \n5/12','19h \n5/12','1h \n6/12'], datasets: [{ type: 'line', label: 'Dataset 1', borderColor: 'green', borderWidth: 2, fill: false, data: [589.42,589.31,589.4,589.33,589.35 ] } ] }, options: { responsive: true, maintainAspectRatio:false,layout:{padding:{bottom:10,top:20,right:10}}, scales:{yAxes:[{display: false}]},legend:{ display: false},plugins:{datalabels:{display:true,borderRadius:3,align:'top',font: {weight: 'bold'}}}}}\" /></li></div></div>",
                "water_level": "589.35",
                "warning_type": "water_level",
                "warning_level": 1
              },
            ...waterLevels.flat(),
            ...windLevels,
            ...rainLevels,
            ...earthquakeData
        ];

        return result;
    },
}));
