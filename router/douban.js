const express = require('express');
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const { get, set, del } = require("../cacheData");

// 接口信息
const routerInfo = {
   name: "douban",
   title: "豆瓣",
   subtitle: "新片榜",
 };

 // 缓存键名
const cacheKey = "doubanData";

// 调用路径
const url = "https://movie.douban.com/chart";
const headers = {
   "User-Agent":
   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
 };

// 豆瓣新片榜单特殊处理 - 标题
const replaceTitle = (title, score) => {
   return `[★${score}] ` + title.replace(/\n/g, "").replace(/ /g, "").replace(/\//g, " / ").trim();
 };

//处理数据
const getData = (data)=>{
   if(!data) return false;
   const dataList = [];
   const $ = cheerio.load(data);
   try{
      $('.article .item').map((idx,item)=>{
         //获取影视评分
         const score = $(item).find('.rating_nums').text() ?? "";
         dataList.push({
            title:replaceTitle($(item).find('a').text(),score),
            desc:$(item).find("p").text(),
            score,
            comments: $(item).find("span.pl").text().match(/\d+/)[0] ?? "",
            url:$(item).find("a").attr("href") ?? "",
         });
      });
      return dataList;
   }catch(err){
      console.log("数据处理出错"+ err);
      return false
   }
}

router.get("/",async (req,res)=>{
   try{
      let data = await get(cacheKey);
      if(!data){
         console.log("获取doban片榜");
         const response = await axios.get(url,{headers});
         data = getData(response.data);
         // 时间
         let date = new Date()
         let year = date.getFullYear();
         let month = date.getMonth() + 1;
         let day = date.getDate()+1;
         let hour = date.getHours();
         let min = date.getMinutes();
         updateTime = `${year}-${month}-${day}-${hour}:${min}`
         // 将数据写入缓存
         await set(cacheKey,data);
      }
      res.send({
         code:200,
         ...routerInfo,
         data,
         length:data.length,
         updateTime:updateTime
      });
   }catch(err){
      res.send({
         code:500,
         ...routerInfo,
         msg:"获取失败"
      });
   }
});

module.exports = router;