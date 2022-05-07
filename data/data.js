const mysql = require('mysql2');
const fs = require('fs');
const attractionFile = './attraction-gov.json';// 來源: 政府資料開放平台 https://gis.taiwan.net.tw/XMLReleaseALL_public/scenic_spot_C_f.json 
const hotelFile = './hotel-gov.json';// 來源: 政府資料開放平台 https://gis.taiwan.net.tw/XMLReleaseALL_public/hotel_C_f.json
//觀光資訊標準格式" https://media.taiwan.net.tw/Upload/觀光資訊標準格式V1.0.pdf
const regionFile = './city-county.json';// 來源: https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json
const attractionData = JSON.parse(fs.readFileSync(attractionFile));
const hotelData = JSON.parse(fs.readFileSync(hotelFile));
const regionData = JSON.parse(fs.readFileSync(regionFile));
const attractionResult = attractionData.XML_Head.Infos.Info;
const hotelResult = hotelData.XML_Head.Infos.Info;
require('dotenv').config({path:'./.env'});

const pool = mysql.createPool({
    connectionLimit: 5,
    host: process.env.RDS_HOST,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD, 
    database: process.env.RDS_DATABASE
});

pool.getConnection((err, connection) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to the MySQL server.');
    for(let i = 0; i < attractionResult.length; i++){  //花了約20分鐘輸入5511筆資料
        let name = attractionResult[i].Name;
        let description = attractionResult[i].Description;
        let zipcode = attractionResult[i].Zipcode;
        let region = attractionResult[i].Region;
        let town = attractionResult[i].Town;
        let address = attractionResult[i].Add;
        let phone = attractionResult[i].Tel
        let category = attractionResult[i].Orgclass;
        let opentime = attractionResult[i].Opentime;
        let longitude = attractionResult[i].Py;
        let latitude = attractionResult[i].Px;
        let picture = attractionResult[i].Picture1;
        let website = attractionResult[i].Website;
        connection.query(
            'INSERT INTO `attraction`\
                (name, description, zipcode, region, town, address, phone, category, \
                opentime, latitude, longitude, picture, website) \
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                [name, description, zipcode, region, town, address, phone, category,
                opentime, longitude, latitude, picture, website],
            (error, result) => {
                if (error) {
                    console.log(error);
                }
                console.log(result);
            }
        )
    }
    for(let i = 0; i < hotelResult.length; i++){ //花了約40分鐘11599筆資料
        let name = hotelResult[i].Name;
        let description = hotelResult[i].Description;
        let zipcode = hotelResult[i].Zipcode;
        let region = hotelResult[i].Region;
        let town = hotelResult[i].Town;
        let address = hotelResult[i].Add;
        let phone = hotelResult[i].Tel;
        let longitude = hotelResult[i].Py;
        let latitude = hotelResult[i].Px;
        let picture = hotelResult[i].Picture1;
        let parkinginfo = hotelResult[i].Parkinginfo;
        connection.query(
            'INSERT INTO `hotel`\
                (name, description, zipcode, region, town, address, phone, \
                latitude, longitude, picture, parkinginfo) \
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                [name, description, zipcode, region, town, address, phone,
                longitude, latitude, picture, parkinginfo],
            (error, result) => {
                if (error) {
                    console.log(error);
                }
                console.log(result);
            }
        )
    }
    for(let i = 0; i < regionData.length; i++) {
        let region = regionData[i].CityName;
        for(let j = 0; j < regionData[i].AreaList.length; j++) {
            let zipcode = regionData[i].AreaList[j].ZipCode;
            let town = regionData[i].AreaList[j].AreaName;
            connection.query(
                'INSERT INTO `town`\
                    (zipcode, town, region) \
                    VALUES (?, ?, ?);',
                    [zipcode, town, region],
                (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    console.log(result);
                }
            )
        }
    }

    connection.release();
});