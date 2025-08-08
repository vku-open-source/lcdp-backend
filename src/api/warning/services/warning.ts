/**
 * warning service
 */

import { factories } from "@strapi/strapi";
import axios from "axios";
import { getWaterLevel } from "../helpers/WaterLevel";
import { getAllWindLevel } from "../helpers/Wind";
import { getAllRainLevel } from "../helpers/Rain";
import { getEarthQuake } from "../helpers/Earthquake";

export default factories.createCoreService(
    "api::warning.warning",
    ({ strapi }) => ({
        async find(ctx: any): Promise<any> {
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
                {
                    lat: 16.020327173403796,
                    long: 108.24065211623731,
                    label: "Đà Nẵng",
                    popupInfo:
                        "<div class=\"station-popup-info\"><div class=\"row-popup\"><div class=\"col-popup-left\"><li>Tên trạm: <b>Đà Nẵng</b> </li><li>Mã trạm: <b>48805</b></li><li>Địa điểm: <b>Đà Nẵng</b></li><li>Tổng lượng mưa: <b>131mm (24),197mm (3 ngày),419.9mm (7 ngày)</b></li><li>Nguồn: <b>KT</b></li><li class='detalRain' data-id='48805' onclick='detailrain(`48805`,`KT`,1)' ><a class=\"description-class\">Chi tiết <i class=\"fa fa-caret-right\" aria-hidden=\"true\"></i> </a></b></li></div><img class='agri-chart-img'  src=\"https://quickchart.io/chart?height=175&c={ type: 'bar', data: { 'labels': ['7h \n27/6','13h \n27/6','19h \n27/6','1h \n28/6','7h \n28/6','13h \n28/6'], datasets: [{ type: 'line', label: 'Dataset 1', borderColor: 'green', borderWidth: 2, fill: false, data: [38,6,1,37,84,10 ] } ] }, options: { responsive: true, maintainAspectRatio:false,layout:{padding:{bottom:10,top:20,right:10}}, scales:{yAxes:[{display: false}]},legend:{ display: false},plugins:{datalabels:{display:true,borderRadius:3,align:'top',font: {weight: 'bold'}}}}}\" /></li></div></div>",
                    rain_level: "131mm (24),197mm (3 ngày),419.9mm (7 ngày)",
                    warning_type: "warning_rain",
                },
                {
                    lat: 16.459464831181226,
                    long: 107.59305537584456,
                    label: "Huế",
                    popupInfo:
                        "<div class=\"station-popup-info\"><div class=\"row-popup\"><div class=\"col-popup-left\"><li>Tên trạm: <b>Huế</b> </li><li>Mã trạm: <b>48820</b></li><li>Địa điểm: <b>Huế</b></li><li>Tổng lượng mưa: <b>89mm (24),156mm (3 ngày),285.4mm (7 ngày)</b></li><li>Nguồn: <b>KT</b></li><li class='detalRain' data-id='48820' onclick='detailrain(`48820`,`KT`,1)' ><a class=\"description-class\">Chi tiết <i class=\"fa fa-caret-right\" aria-hidden=\"true\"></i> </a></b></li></div><img class='agri-chart-img'  src=\"https://quickchart.io/chart?height=175&c={ type: 'bar', data: { 'labels': ['7h \n27/6','13h \n27/6','19h \n27/6','1h \n28/6','7h \n28/6','13h \n28/6'], datasets: [{ type: 'line', label: 'Dataset 1', borderColor: 'blue', borderWidth: 2, fill: false, data: [25,12,8,22,65,15 ] } ] }, options: { responsive: true, maintainAspectRatio:false,layout:{padding:{bottom:10,top:20,right:10}}, scales:{yAxes:[{display: false}]},legend:{ display: false},plugins:{datalabels:{display:true,borderRadius:3,align:'top',font: {weight: 'bold'}}}}}\" /></li></div></div>",
                    rain_level: "89mm (24),156mm (3 ngày),285.4mm (7 ngày)",
                    warning_type: "warning_rain",
                },
                {
                    lat: 16.459464831182226,
                    long: 107.59305537584456,
                    label: "Huế",
                    popupInfo:
                        "<div class=\"station-popup-info\"><div class=\"row-popup\"><div class=\"col-popup-left\"><li>Tên trạm: <b>Đắk Nông</b> </li><li>Mã trạm: <b>71720</b></li><li>Địa điểm: <b>Đắk Nông</b></li><li>   Sông: <b>Đắk Nông</b></li><li>Nguồn: <b>KTTV</b></li><li><b>Mực nước (589.35(m) 1-06/12)</b> </li><li class='detalRain' data-id='71720' onclick='detailrain(`71720`,`Water`,1)' ><a class=\"description-class\">Chi tiết <i class=\"fa fa-caret-right\" aria-hidden=\"true\"></i> </a></b></li></div><li><img class='agri-chart-img'  src=\"https://quickchart.io/chart?height=175&c={ type: 'bar', data: { 'labels': ['1h \n5/12','7h \n5/12','13h \n5/12','19h \n5/12','1h \n6/12'], datasets: [{ type: 'line', label: 'Dataset 1', borderColor: 'green', borderWidth: 2, fill: false, data: [589.42,589.31,589.4,589.33,589.35 ] } ] }, options: { responsive: true, maintainAspectRatio:false,layout:{padding:{bottom:10,top:20,right:10}}, scales:{yAxes:[{display: false}]},legend:{ display: false},plugins:{datalabels:{display:true,borderRadius:3,align:'top',font: {weight: 'bold'}}}}}\" /></li></div></div>",
                    water_level: "589.35",
                    warning_type: "water_level",
                    warning_level: 1,
                },
                {
                    lat: 16.020327173405796,
                    long: 108.24065211623731,
                    label: "Đà Nẵng",
                    popupInfo:
                        "<div class=\"station-popup-info\"><div class=\"row-popup\"><div class=\"col-popup-left\"><li>Tên trạm: <b>Quảng Nam</b> </li><li>Mã trạm: <b>58601</b></li><li>Địa điểm: <b>Quảng Nam</b></li><li>   Sông: <b>Vu Gia</b></li><li>Nguồn: <b>KTTV</b></li><li><b>Mực nước (12.45(m) 1-06/12)</b> </li><li class='detalRain' data-id='58601' onclick='detailrain(`58601`,`Water`,1)' ><a class=\"description-class\">Chi tiết <i class=\"fa fa-caret-right\" aria-hidden=\"true\"></i> </a></b></li></div><li><img class='agri-chart-img'  src=\"https://quickchart.io/chart?height=175&c={ type: 'bar', data: { 'labels': ['1h \\n5/12','7h \\n5/12','13h \\n5/12','19h \\n5/12','1h \\n6/12'], datasets: [{ type: 'line', label: 'Dataset 1', borderColor: 'blue', borderWidth: 2, fill: false, data: [12.50,12.48,12.47,12.46,12.45 ] } ] }, options: { responsive: true, maintainAspectRatio:false,layout:{padding:{bottom:10,top:20,right:10}}, scales:{yAxes:[{display: false}]},legend:{ display: false},plugins:{datalabels:{display:true,borderRadius:3,align:'top',font: {weight: 'bold'}}}}}\" /></li></div></div>",
                    water_level: "12.45",
                    warning_type: "water_level",
                    warning_level: 2,
                },
                ...waterLevels.flat(),
                ...windLevels,
                ...rainLevels,
                ...earthquakeData,
            ];

            return result;
        },
    })
);
