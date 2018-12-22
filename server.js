//imp from "util";

var util  = require("util");
var bodyParser = require("body-parser");
var promise = require("promise");
var express = require('express');
var fs      = require('fs');
var request = require('request');

var cheerio = require('cheerio');
var _       = require('lodash');
var app     = express();

//var bodyParser = express.bodyParser();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var URL = require("./url");

var globalURLMap = {};
var globalTreeMap = new URL("/","","",false, null,null);

var linksMap = new Map();


var hostname = "";
var hosturl= "";


var getFileNameForUrl = function(url){
  if(!util.isNullOrUndefined(url)){
   url =  _.replace(url,"https://","");
    url = url+"_"+".json";
    console.log("outputFilename  :"+url);
    return url;
  }else{
    return null;
  }
}

var filterurl =  function(url , host){
   if(url){
    var urlstring = url.stringify;
    var flag = _.includes(url,host);

    if(flag){
      return url;
    }

   if(url && !url.includes(host)){
     // two possibilities here either /path
     // or an outside url which we  sont need
     if(!(url.includes("http") || (url.includes("https")))){
       // internal path so convert to full url
       url = hostname + url;
       //console.log("constructed full url as  :"+url);
       return url;
     }else{
        // dont need to store this url as it is outside url .
       // console.log("outside url ignoring");
        return null;
     }
   }
  }
}
//

// print links tree
//
var printLinksMap = function(links){
  
    if(util.isNullOrUndefined(linksMap)){
      console.log("Null links Map");
    }else{
       links.array.forEach(element => {
         if(!util.isNullOrUndefined(element)){
            console.log(element.getURL());
            if(element.getChildUrls.size() >0){
              prinLinksMap(element.getChildUrls());
            }
         }
       });
    }
  }

  function getURL(url){
        if(url){
          return url.url;
        }else return null;
  }

function crawlPage(url , host ){
  
  return new Promise(function(resolve , reject){
    
  let links = [];
  
  if(host == null){
    console.log("invalid host URL");
    return reject("Invalid Host URL");
  }
  if(url == null || url == undefined){
        console.log("invalid URL "+url)
        return reject("Invalid request URL"+url);
  }

  request(hosturl, function(error, response, html){
    if(error){
      reject(error);
    }else{
      var $ = cheerio.load(html);
      var urls = $('a');
      var count = 0 ;
      
      for (url in urls) {
        var myurl = urls[url];
        if(!util.isNullOrUndefined(myurl) ||util.isNullOrUndefined(myurl.attribs)){
          if(myurl.attribs && !util.isNullOrUndefined(myurl.attribs.href) ){
           //console.log(count+" :"+myurl.attribs.href);
           var updatedUrl = filterurl( myurl.attribs.href , hosturl);

         //  console.log("Initial URL is "+myurl.attribs.href);
          // console.log("Final URL is "+updatedUrl);

          if(!util.isNullOrUndefined(updatedUrl)){
             //save it and persist it for other operations
            // links.push
          var u = new URL(updatedUrl , host , null,true,null,updatedUrl) ;
          var uri = linksMap.get(updatedUrl);

          if(util.isNullOrUndefined(uri)){ 
            linksMap.set(updatedUrl , u);
            
            links.push(u);
            
            console.log("Child URL "+updatedUrl);
            //console.log("links size"+links.length)
            var fileName = getFileNameForUrl(hosturl);

            //console.log("OutPutFile"+fileName);

            //fs.writeFileSync(fileName, JSON.stringify(links))
            fs.writeFile("output.json",JSON.stringify(links) , { flag: 'w' }, function (err) {
              if (err) throw err;
              console.log("It's saved!");
          });
           // fs.writeFileSync('output.json', JSON.stringify(links))
           // fs.writeFileSync('output.json', JSON.stringify(links.map(getURL)))
            // if it is not already navigated
            // get child urls otherwise no need
            crawlPage(updatedUrl , host).then(function(response){
            
                u.childURLs = response;
                //console.log("returned child promise"+links.length)
                //console.log(response);
                resolve(links)     
           }
          ).catch(response => {
            //console.log("Null response from promise")
            reject(response);
        })
      } else{
           // console.log("Filtered URL is undefined or null");
   }
  }
}
         //console.log("crowling inside :")
}else{
         
}
}
    }
})

//console.log("URL :"+url +"  size :"+links.length);
resolve(links);
})
}

function startCrawl(url , host ){

  return new Promise(function(resolve,reject){

    var flag = false ;
   // wait(10000);
    request(url ,response , function(error , body){
       if(error)
       flag = false;
       else{
          console.log(flag);
          flag = true;
       }
    })

    if(flag)
    resolve(flag);
    else{
      reject(flag);
    }
  })
}
  

app.post('/links',function(request,response){
 
   var inputurl   = request.body.url;
   var isloggedIn = request.body.logged; //boolean parameter
  
  console.log("Input Url"+inputurl);
  console.debug("Input Url"+inputurl);
  console.log("isLoggedIn  :"+isloggedIn)

  console.log("Got Request");
  var loggedIn = false;
  if(loggedIn == true){
    //return links map with logged in tree 
  }else{
    //const data = require('output.json');
    
    fs.readFile("output.json", "utf8", function(err, data){
      if(err) throw err;
       //do operation on data that generates say resultArray;
       //console.log("Got Data"+data);
       response.send(data);
       console.log("Sent Data");
    });
  
  }
   
  });


app.post('/scrape', function(req, res){

  hosturl = 'https://net.s2stagehance.com';
  hostname = "https://net.s2stagehance.com";

  
    var inputurl = req.body.url;
    if(inputurl == null){
      res.send("Invalid inpput param :"+ inputurl);
    }else{
    hosturl = inputurl;
    hostname = inputurl;

var json = { hostname: "", pathname:"", urls: {} , mockIds:{}};

crawlPage(hosturl, hostname).then(function(links){
  console.log("got links:"+links.length);
  for(l in links){
    console.log(l.url);
  }
}).catch(function(err){
  console.log("Encountered error in craeling ");
  res.send('Scrapping of URL failed'+inputurl);
})

res.send('Scrapping of URL :'+inputurl);
}
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
