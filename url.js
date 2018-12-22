
class URL {
    constructor(url , baseUrl ,mockIdMap  , visited , childUrls , parent){
        this.url = url;
        this.mockIdMap = {};
        this.baseUrl   = baseUrl;
        this.isVisited = false;
        this.childURLs = [];
        this.parentURL = null;
    }

    setUrl(url){
        this.url = url;
    }
    setMockIDMap(mockIdMap){
        this.setMockIDMap = mockIdMap;
    }
    setChildURL(childurlarray){
      this.childURLs = childurlarray;
    }
    setVisited(){
        this.isVisited = true;
    }
    getURL(){
        return this.url;
    }
    getChileURLs(){
        return this.childURLs;
    }
    /*
    url : "",
    mockIdMap:{},
    isVisited: false,
    parentUrl:"",
    baseUrl:"",
    childUrls:[] //array of child urls
    */
  }
  exports = module.exports = URL ;

