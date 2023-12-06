const express = require('express');
const router = express.Router();
const axios = require('axios');
const { get, set, del } = require("../cacheData");

// 接口信息
const routerInfo = {
   name: "thepaper",
   title: "澎湃新闻",
   subtitle: "热榜",
 };

 // 缓存键名
const cacheKey = "thepaperData";

// 调用路径
const url = "https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar";

// 数据处理
const getData = (data) => {
   if (!data) return [];
   return data.map((v) => {
     return {
       id: v.contId,
       title: v.name,
       url: `https://www.thepaper.cn/newsDetail_forward_${v.contId}`,
     };
   });
 };

 router.get('/', async (req, res) => {
   try{
      // 从缓存中获取数据
      let data = await get(cacheKey);
      if(!data){
         console.log("获取澎湃新闻热榜");
         const response = await axios.get(url);
         data = getData(response.data.data.hotNews);
         // 时间
         let date = new Date()
         let year = date.getFullYear();
         let month = date.getMonth() + 1;
         let day = date.getDate();
         let hour = date.getHours();
         let min = date.getMinutes();
         updateTime = `${year}-${month}-${day}-${hour}:${min}`
         await set(cacheKey,data);
      }
      res.send({
         code: 200,
         ...routerInfo,
         data,
         updateTime
      })
   }catch(err){
      res.send({
         code: 500,
         msg: "获取澎湃新闻热榜失败！",
      })
   }

 })

 module.exports = router;