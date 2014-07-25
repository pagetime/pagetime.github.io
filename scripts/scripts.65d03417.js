"use strict";function oauthCallback(a){var b=angular.element(document.getElementById("main")).injector();b.invoke(["Facebook",function(b){b.oauthCallback(a)}])}var stripUrlHash=function(a){return a.indexOf("#")>-1&&(a=a.replace(/#\//g,"")),a},getAppUrl=function(a,b){var c=a.protocol()+"://"+a.host();return"localhost"===a.host()&&(c+=":"+a.port()),c+"/"+b};angular.module("likebookApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","facebook"]).run(["$rootScope","$location","$window","Facebook",function(a,b,c,d){d.init("668365859920137",getAppUrl(b,"callback.html")),a.$on("$locationChangeStart",function(){c.sessionStorage.fbtoken||b.path("/")}),a.$on("OAuthException",function(){b.path("/")})}]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/home",{templateUrl:"views/home.html",controller:"HomeCtrl"}).when("/logout",{templateUrl:"views/logout.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("likebookApp").controller("MainCtrl",["$scope","$location","Facebook",function(a,b,c){a.logout=function(){c.logout(),b.path("/")},a.facebookLogin=function(){c.login("public_profile,email,user_likes,user_location").then(function(){b.path("/home")},function(){alert("Facebook login failed")})}}]);var getDate=function(a){return new Date((a||"").replace(/-/g,"/").replace(/[TZ]/g," "))};angular.module("likebookApp").controller("HomeCtrl",["$scope","Facebook",function(a,b){b.get("/me?fields=name,likes.fields(name, posts.fields(message,story,from.name,picture,created_time).limit(1))").success(function(b){a.user=b.name,a.posts=[];try{if(b.likes&&b.likes.data)for(var c=b.likes.data,d=0;d<c.length;d++){var e=c[d];if(e)if(e.posts.data)for(var f=e.posts.data,g=0;g<f.length;g++){var h=f[g];h&&a.posts.push(h)}else console.log("error: no posts data for page "+e.from.name)}else console.log("error: looks like you have no pages liked."),console.log("response from FB:"+JSON.stringify(b))}finally{angular.element("#spinner").addClass("hidden"),0===a.posts.length&&angular.element("#error").addClass("show")}}).error(function(){a.user="You!"})}]),angular.module("likebookApp").directive("post",function(){return{restrict:"E",scope:{post:"="},templateUrl:"views/post.html"}}),angular.module("facebook",[]).factory("Facebook",["$rootScope","$q","$window","$http",function(a,b,c,d){function e(a,b){m=a,b&&(n=b)}function f(a){if(!m)return error({error:"Facebook App Id not set."});var c;return a=a||"",o=b.defer(),p=!1,h(),c=window.open(q+"?client_id="+m+"&redirect_uri="+n+"&response_type=token&display=page&scope="+a,"_blank","location=no,height=600,width=740"),o.promise}function g(a){var b,c;p=!0,a.indexOf("access_token=")>0?(b=a.substr(a.indexOf("#")+1),c=l(b),r.fbtoken=c.access_token,o.resolve()):a.indexOf("error=")>0?(b=a.substring(a.indexOf("?")+1,a.indexOf("#")),c=l(b),o.reject(c)):o.reject()}function h(){r.fbtoken=void 0}function i(b){var c=b.method||"GET",e=b.params||{};return e.access_token=r.fbtoken,d({method:c,url:"https://graph.facebook.com"+b.path,params:e}).error(function(b){b.error&&"OAuthException"===b.error.type&&a.$emit("OAuthException")})}function j(a,b){return i({method:"POST",path:a,params:b})}function k(a,b){return i({method:"GET",path:a,params:b})}function l(a){var b=decodeURIComponent(a),c={},d=b.split("&");return d.forEach(function(a){var b=a.split("=");c[b[0]]=b[1]}),c}var m,n,o,p,q="https://www.facebook.com/dialog/oauth",r=window.sessionStorage;return{init:e,login:f,logout:h,api:i,post:j,get:k,oauthCallback:g}}]);