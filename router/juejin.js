const express = require('express');
const router = express.Router();
const axios = require('axios');
const { get, set, del } = require("../cacheData");

// 缓存键名
const cacheKey = "juejinData";

// 接口信息
const routerInfo = {
   name: "juejin",
   title: "稀土掘金",
   subtitle: "热榜",
 };

 // 调用路径
const url = "https://api.juejin.cn/content_api/v1/content/article_rank?category_id=1&type=hot";

// 数据处理
const getData = (data) => {
   if (!data) return [];
   return data.map((v) => {
     return {
       id: v.content.content_id,
       title: v.content.title,
       url: `https://juejin.cn/post/${v.content.content_id}`,
     };
   });
 };

 //配置路由
 router.get("/",async (req,res)=>{
   try{
      console.log("获取掘金热榜数据");
      // 从缓存中获取数据
      let data = await get(cacheKey);
      if(!data){
         // 缓存中没有数据，从接口获取
         const respone = await axios.get(url);
         data = getData(respone.data.data);
         // 时间
         let date = new Date()
         let year = date.getFullYear();
         let month = date.getMonth() + 1;
         let day = date.getDate();
         let hour = date.getHours();
         let min = date.getMinutes();
         updateTime = `${year}-${month}-${day}-${hour}:${min}`
         // 设置缓存
         await set(cacheKey,data);
      }
      res.send({
         code: 200,
         ...routerInfo,
         data,
         updateTime:updateTime,
      });
   }catch(err){
      res.send({
         code: 500,
         msg: "获取数据失败"
      });
   }
 });

module.exports = router;