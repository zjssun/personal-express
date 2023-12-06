const express = require('express');
const router = express.Router();
const axios = require('axios');
const { get, set, del } = require("../cacheData");

// 接口信息
const routerInfo = {
   name: "36kr",
   title: "36氪",
   subtitle: "热榜",
 };
 
 // 缓存键名
 const cacheKey = "krData";

 // 调用路径
const url = "https://gateway.36kr.com/api/mis/nav/home/nav/rank/hot";

// 数据处理
const getData = (data) => {
   if (!data) return [];
   return data.map((v) => {
     return {
       id: v.itemId,
       title: v.templateMaterial.widgetTitle,
       url: `https://www.36kr.com/p/${v.itemId}`,
     };
   });
 };

 //配置路由
 router.get('/', async (req, res) => {
   try{
      console.log("获取36kr热榜");
      // 从缓存中获取数据
      let data = await get(cacheKey);
      if(!data){
         const response = await axios.post(url,{
            partner_id: "wap",
            param:{
               siteId:1,
               platformId:2,
            },
            timestamp: new Date().getTime(),
         });
         data = getData(response.data.data.hotRankList);
         // 时间
         let date = new Date()
         let year = date.getFullYear();
         let month = date.getMonth() + 1;
         let day = date.getDate();
         let hour = date.getHours();
         let min = date.getMinutes();
         updateTime = `${year}-${month}-${day}-${hour}:${min}`
         // 将数据写入缓存
         await set(cacheKey, data);
      }
      res.send({
         code: 200,
         ...routerInfo,
         data,
         updateTime,
      });
   }catch(err){
      res.send({
         code: 500,
         msg: "获取热榜失败!",
      });
   }
 });

 module.exports = router;