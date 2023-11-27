const express = require('express');
const router = express.Router();
const axios = require("axios");
const { get, set, del } = require("../cacheData");

// 接口信息
const routerInfo = {
  name: "bilibili",
  title: "哔哩哔哩",
  subtitle: "热门榜",
};
// 缓存键名
const cacheKey = "bilibiliData";

// 调用路径
const url = "https://api.bilibili.com/x/web-interface/ranking/v2";

// 数据处理
const getData = (data) => {
   if (!data) return [];
   return data.map((v) => {
     return {
       id: v.bvid,
       title: v.title,
       hot: v.stat.view,
       url: `https://www.bilibili.com/video/${v.bvid}`
     };
   });
 };

router.get("/",async (req,res)=>{
   try{
      console.log("获取哔哩哔哩热门榜");
      // 从缓存中获取数据
      let data = await get(cacheKey);
      // 如果缓存中不存在数据
      if (!data) {
         console.log("从服务端重新获取哔哩哔哩热门榜");
         // 从服务器拉取数据
         const response = await axios.get(url);
         data = getData(response.data.data.list);
         // 时间
         let date = new Date()
         let year = date.getFullYear();
         let month = date.getMonth() + 1;
         let day = date.getDate()+1;
         let hour = date.getHours();
         let min = date.getMinutes();
         updateTime = `${year}-${month}-${day}-${hour}:${min}`
         // 将数据写入缓存
         await set(cacheKey, data);
       }
       res.send({...routerInfo,
                  data:data,
                  length:data.length,
                  updateTime
               })
   }catch(err){
      console.log(err);
   }
}); 

module.exports = router;