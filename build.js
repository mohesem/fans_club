!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/",t(t.s=14)}([function(e,n){e.exports=require("debug")},function(e,n){e.exports=require("mongoose")},function(e,n){e.exports=require("path")},function(e,n){e.exports=require("jsonwebtoken")},function(e,n){e.exports=require("mongoose-geojson-schema")},function(e,n){e.exports=require("express")},function(e,n){e.exports=require("@turf/turf")},function(e,n){e.exports=require("fs")},function(e,n,t){"use strict";var r=t(1),o=new r.Schema({username:{type:String},password:{type:String}}),a=Object(r.model)("Admin",o);n.a=a},function(e,n){e.exports=require("body-parser")},function(e,n){e.exports=require("cookie-parser")},function(e,n){e.exports=require("cors")},function(e,n){e.exports=require("email-validator")},function(e,n,t){"use strict";var r=t(0),o=t.n(r),a=t(5),i=(t(2),t(7)),u=t.n(i),s=t(12),c=t.n(s);function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e){var n={};return new Promise((function(t){e.forEach((function(r,o){r.required&&!r.value?n["".concat(r.name)]="".concat(r.name," is required"):r.minLength&&r.value.length<r.minLength?n["".concat(r.name)]="".concat(r.name," should have more than ").concat(r.minLength," characters"):r.maxLength&&r.value.maxLength>r.maxLength?n["".concat(r.name)]="".concat(r.name," should have less than ").concat(r.maxLength," characters"):r.length&&"object"!==r.type&&r.value.length!==r.length?n["".concat(r.name)]="".concat(r.name," should have ").concat(r.length," characters"):r.type&&l(r.value)!==r.type?n["".concat(r.name)]="".concat(r.name," type should ba ").concat(r.type):r.email&&!1===c.a.validate(r.value)?n["".concat(r.name)]="".concat(r.name," is invalid"):"object"===r.type?r.length&&Object.keys(r.value).length!==r.length&&(n["".concat(r.name)]="".concat(r.name," object length should be ").concat(r.length)):"object"===r.type?r.keys.forEach((function(e){r.value[e.name]||(n["".concat(r.name)]="".concat(e.name," should be a part of ").concat(r.name))})):"object"===r.type&&r.keys.forEach((function(e){l(r.value[e.name])!==e.type&&(n["".concat(r.name)]="".concat(e.name," type should be ").concat(e.type))})),o===e.length-1&&t(n)}))}))}var d=function(e){return f([{value:e.from,name:"from",required:!0,type:"string"},{value:e.email,name:"email",email:!0},{value:e.firstname,name:"firstname",required:!0,type:"string"},{value:e.lastname,name:"lastname",required:!0,type:"string"},{value:e.fullname,name:"fullname",required:!0,type:"string"},{value:e.thumbnail,name:"thumbnail",required:!0,type:"string"},{value:e.googleId||e.facebookId,name:"id",required:!0,type:"string"},{value:e.location,name:"location",required:!0,type:"object",length:2,keys:[{value:"lng",type:"number"},{value:"lat",type:"number"}]},{value:e.address,name:"address",required:!0,type:"string"},{value:e.birth,name:"birth",required:!0},{value:e.gender,name:"gender",required:!0,type:"string"}])},g=t(6),m=t(3),p=t.n(m),v=t(1),y=t.n(v),b=(t(4),new v.Schema({geo:{type:v.Schema.Types.Point,required:!0},address:{type:String,required:!0},email:{type:String,required:!0,unique:!0},fullname:{type:String},firstname:{type:String},lastname:{type:String},thumbnail:{type:String},picture:{type:String},birth:{type:Date,required:!0},gender:{type:String,required:!0},facebookId:{type:String},googleId:{type:String},activatedOn:{type:Date,default:new Date},likes:[{type:v.Schema.Types.ObjectId,ref:"Team"}],dislikes:[{type:v.Schema.Types.ObjectId,ref:"Team"}],suggests:[{type:v.Schema.Types.ObjectId,ref:"Suggest"}]})),h=Object(v.model)("User",b),x=o()("log:db:makeNewuser"),k=function(e,n){x("-------------------------------------------",process.env.TOKEN);var t=e.from,r=e.email,o=e.firstname,a=e.lastname,i=e.fullname,u=e.picture,s=e.thumbnail,c=e.googleId,l=e.facebookId,f=e.location,d=e.address,m=e.birth,v=e.gender,y=g.point([f.lng,f.lat]),b=new h({geo:y.geometry,address:d,email:r,fullname:i,firstname:o,lastname:a,thumbnail:s,picture:u,birth:new Date(m),gender:v});"google"===t&&(b.googleId=c),"facebook"===t&&(b.facebookId=l);try{b.save((function(e,t){return e?(x("save err",e),11e3===e.code?n(500,{other:"email should be unique"}):n(500,{other:"Internal Server Error"})):(p.a.sign({email:t.email,id:t._id},process.env.TOKEN,(function(e,r){return e?(x("error on creating token",e),n(500,{other:"Server Internal Error"})):(x("++++++++++++++++++++++",r),n(200,{token:r,snackMsg:"hello ".concat(t.firstname)}))})),null)}))}catch(e){return x("eeeeeeeeeeeeeeeeeeeeee",e),n(500,{other:"Internal Server Error"})}};function w(e,n,t,r,o,a,i){try{var u=e[a](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,o)}function S(e){return function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){w(a,r,o,i,u,"next",e)}function u(e){w(a,r,o,i,u,"throw",e)}i(void 0)}))}}var _=o()("log:v1");function I(){return(I=S(regeneratorRuntime.mark((function e(n,t){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("make ne user is :::",n),e.next=3,d(n);case 3:if(r=e.sent,_("test isNewUser",r),!Object.entries(r).length){e.next=7;break}return e.abrupt("return",t(400,{test:r}));case 7:return k(n,(function(e,n){return t(e,n)})),e.abrupt("return",null);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var q=function(e){return f([{value:e,name:"email",required:!0,email:!0}])},O=o()("log:db");function T(e,n){O("gert user by email is working",e),h.findOne({email:e},(function(e,t){return O("getUserByEmail result",e,t),e?n(e,null):n(null,t)}))}function P(e,n,t,r,o,a,i){try{var u=e[a](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,o)}function E(e){return function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){P(a,r,o,i,u,"next",e)}function u(e){P(a,r,o,i,u,"throw",e)}i(void 0)}))}}var R=o()("log:v1");function j(){return(j=E(regeneratorRuntime.mark((function e(n,t){var r,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.email,e.next=3,q(r);case 3:if(o=e.sent,R("test isNewUser",o),!Object.entries(o).length){e.next=7;break}return e.abrupt("return",t(400,o));case 7:return T(r,(function(e,n){return t(200,e?{err:!0,other:"Internal Server Error"}:n?{err:!0,other:"Account exists"}:{msg:"New User"})})),e.abrupt("return",null);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var D=function(e){return f([{value:e,name:"facebook id",required:!0}])};function N(e){return(N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}o()("log:db");function C(e,n){console.log("-----",N(e)),console.log("gert user by facebookId is working",e),h.findOne(e,(function(e,t){return console.log("getUserByFacebookID result",e,t),e?n(e,null):n(null,t)}))}function U(e,n,t,r,o,a,i){try{var u=e[a](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,o)}function M(e){return function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){U(a,r,o,i,u,"next",e)}function u(e){U(a,r,o,i,u,"throw",e)}i(void 0)}))}}var F=o()("log:v1");function B(){return(B=M(regeneratorRuntime.mark((function e(n,t){var r,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.facebookId,e.next=3,D(r);case 3:if(o=e.sent,F("test isNewUser",o),!Object.entries(o).length){e.next=7;break}return e.abrupt("return",t(400,o));case 7:return C({facebookId:r},(function(e,n){return t(200,e?{err:!0,other:"Internal Server Error"}:n?{err:!0,other:"Account exists"}:{msg:"New User"})})),e.abrupt("return",null);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var L=o()("log:db");function $(e,n){L("gert user by email is working",e);var t={};Object.facebookId?t.facebookId=e.facebookId:t.googleId=e.googleId,h.findOne(t).exec((function(e,t){return e?n(e,null):n(null,t)}))}function A(e,n,t,r,o,a,i){try{var u=e[a](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,o)}function K(e){return function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){A(a,r,o,i,u,"next",e)}function u(e){A(a,r,o,i,u,"throw",e)}i(void 0)}))}}var G=o()("log:v1");function W(){return(W=K(regeneratorRuntime.mark((function e(n,t){var r,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.facebookId,o=n.googleId,$({facebookId:r,googleId:o},(function(e,n){return G("result of population ==> ",e,n),e?t(500,{other:"Server Internal Error"}):n?(p.a.sign({email:n.email,id:n._id},process.env.TOKEN,(function(r,o){return e?(G("error on creating token",r),t(500,{other:"Server Internal Error"})):t(200,{token:o,snackMsg:"hello ".concat(n.firstname,", you signed in with ").concat(n.email),firstname:n.firstname,lastname:n.lastname,likes:n.likes||null,dislikes:n.dislikes||null,suggests:n.suggests||null,location:n.geo,from:n.googleId?"google":"facebook",thumbnail:n.thumbnail})})),null):t(400,{other:"no user has been found"})})),e.abrupt("return",null);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}o()("log:db");function z(e,n){h.findById(e).populate("likes").populate("dislikes").exec((function(e,t){return e?n(e,null):n(null,t)}))}var H=o()("log:v1");var J=function(e){return f([{value:e.str,name:"str",required:!0,type:"string"}])},X=new v.Schema({group:{type:String,required:!0},country:{type:String,required:!0},name:{type:String,required:!0},city:{type:String},primary_color:{type:String,required:!0},secondary_color:{type:String,required:!0}});X.index({name:1});var Q=Object(v.model)("Team",X);o()("log:db");function V(e,n){Q.find({name:{$regex:"^".concat(e,".*"),$options:"i"}}).sort({name:1}).limit(10).exec((function(e,t){e?n(e,null):n(null,t)}))}function Y(e,n,t,r,o,a,i){try{var u=e[a](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,o)}function Z(e){return function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){Y(a,r,o,i,u,"next",e)}function u(e){Y(a,r,o,i,u,"throw",e)}i(void 0)}))}}o()("log:v1");function ee(){return(ee=Z(regeneratorRuntime.mark((function e(n,t){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,J(n);case 2:if(r=e.sent,!Object.entries(r).length){e.next=5;break}return e.abrupt("return",t(400,{test:r}));case 5:return V(n.str,(function(e,n){return e?t(500,{other:"Server Internal Error"}):t(200,{clubs:n})})),e.abrupt("return",null);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var ne=new v.Schema({geo:v.Schema.Types.Point,user_id:{type:String},boundy_id:{type:String},team_id:{type:String},name0:{type:String},name1:{type:String},name2:{type:String},fid:{type:Number,require:!0},date:{type:Date,default:new Date},gender:{type:String}});ne.index({geo:"2dsphere"}),ne.index({user_id:1}),ne.index({boundy_id:1}),ne.index({team_id:1}),ne.index({fid:1}),ne.index({date:1}),ne.index({gender:1});var te=Object(v.model)("Like",ne),re=function(e){return f([{value:e.token,name:"token",required:!0,type:"string"},{value:e.club,name:"club",required:!0,type:"object",keys:[{value:"_id",type:"string"},{value:"group",type:"string"},{value:"name",type:"string"},{value:"city",type:"string"},{value:"primary_color",type:"string"},{value:"secondary_color",type:"string"}]}])},oe=new v.Schema({name0:{type:String},name1:{type:String},name2:{type:String},geo:v.Schema.Types.MultiPolygon,fid:{type:Number,required:!0}});oe.index({geo:"2dsphere"}),oe.index({fid:1});var ae=Object(v.model)("GeoJSON",oe);function ie(e,n,t,r,o,a,i){try{var u=e[a](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,o)}function ue(e,n){ae.find({geo:{$geoIntersects:{$geometry:{type:e.type,coordinates:e.coordinates}}}},function(){var e,t=(e=regeneratorRuntime.mark((function e(t,r){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t){e.next=2;break}return e.abrupt("return",n(t,{msg:"Server Internal Error"}));case 2:return e.abrupt("return",n(null,{array:r}));case 3:case"end":return e.stop()}}),e)})),function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){ie(a,r,o,i,u,"next",e)}function u(e){ie(a,r,o,i,u,"throw",e)}i(void 0)}))});return function(e,n){return t.apply(this,arguments)}}())}function se(e,n,t,r,o,a,i){try{var u=e[a](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,o)}function ce(e){return function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){se(a,r,o,i,u,"next",e)}function u(e){se(a,r,o,i,u,"throw",e)}i(void 0)}))}}var le=o()("log:v1");function fe(){return(fe=ce(regeneratorRuntime.mark((function e(n,t){var r,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,re(n);case 2:if(r=e.sent,le("test searchClubs",r),!Object.entries(r).length){e.next=6;break}return e.abrupt("return",t(400,{test:r}));case 6:return o=n.token,p.a.verify(o,process.env.TOKEN,(function(e,r){if(e)return t(500,{other:"Server Internal Error"});z(r.id,function(){var e=ce(regeneratorRuntime.mark((function e(r,o){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(le("----------------------",o),!r){e.next=3;break}return e.abrupt("return",t(500,{other:"Server Internal Error"}));case 3:if(o){e.next=5;break}return e.abrupt("return",t(400,"User doesnt exist"));case 5:if(!(o.likes.length>=5)){e.next=7;break}return e.abrupt("return",t(403,"you can like more than 5 clubs"));case 7:return e.next=9,o.likes.find((function(e){return e._id==n.club._id}));case 9:if(!e.sent){e.next=12;break}return e.abrupt("return",t(403,{other:"you already liked this club"}));case 12:return e.next=14,o.dislikes.find((function(e){return e._id==n.club._id}));case 14:if(!e.sent){e.next=17;break}return e.abrupt("return",t(403,{other:"you can likes clubs you already disliked"}));case 17:return ue(o.geo,function(){var e=ce(regeneratorRuntime.mark((function e(r,a){var i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(le("findBoundries",o.geo,r,a),!r){e.next=3;break}return e.abrupt("return",t(500,{other:"Server Internal Error"}));case 3:if(a.array.length){e.next=5;break}return e.abrupt("return",t(400,{msg:"unable to resolve coordinates"}));case 5:return e.next=7,y.a.startSession();case 7:return(i=e.sent).startTransaction(),e.prev=9,e.next=12,a.array.forEach((function(e){console.log("...........................",e),new te({name0:e.name0,name1:e.name1,name2:e.name2,user_id:o._id,boundy_id:e._id,team_id:n.club._id,geo:o.geo,fid:e.fid,gender:o.gender}).save()}));case 12:return o.likes.push(n.club._id),e.next=15,o.save();case 15:return e.next=17,i.commitTransaction();case 17:return e.next=19,i.endSession();case 19:return e.abrupt("return",null);case 22:return e.prev=22,e.t0=e.catch(9),e.next=26,i.abortTransaction();case 26:return i.endSession(),e.abrupt("return",t(500,{msg:"internal error"}));case 28:return e.prev=28,z(o._id,(function(e,n){return e?t(500,{msg:"internal error"}):t(200,{snackMsg:"hello ".concat(n.firstname),firstname:n.firstname,lastname:n.lastname,likes:n.likes||null,dislikes:n.dislikes||null,suggests:n.suggests||null,location:n.geo})})),e.finish(28);case 31:case"end":return e.stop()}}),e,null,[[9,22,28,31]])})));return function(n,t){return e.apply(this,arguments)}}()),e.abrupt("return",null);case 19:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}())})),e.abrupt("return",null);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var de=new v.Schema({geo:v.Schema.Types.Point,user_id:{type:String},boundy_id:{type:String},team_id:{type:String},name0:{type:String},name1:{type:String},name2:{type:String},fid:{type:Number,require:!0},date:{type:Date,default:new Date},gender:{type:String}});de.index({geo:"2dsphere"}),de.index({user_id:1}),de.index({boundy_id:1}),de.index({team_id:1}),de.index({fid:1}),de.index({date:1}),de.index({gender:1});var ge=Object(v.model)("Dislike",de);function me(e,n,t,r,o,a,i){try{var u=e[a](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,o)}function pe(e){return function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){me(a,r,o,i,u,"next",e)}function u(e){me(a,r,o,i,u,"throw",e)}i(void 0)}))}}var ve=o()("log:v1"),ye=function(e){return f([{value:e.token,name:"token",required:!0,type:"string"},{value:e.club,name:"club",required:!0,type:"object",keys:[{value:"_id",type:"string"},{value:"group",type:"string"},{value:"name",type:"string"},{value:"city",type:"string"},{value:"primary_color",type:"string"},{value:"secondary_color",type:"string"}]}])};function be(){return(be=pe(regeneratorRuntime.mark((function e(n,t){var r,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ye(n);case 2:if(r=e.sent,ve("test searchClubs",r),!Object.entries(r).length){e.next=6;break}return e.abrupt("return",t(400,{test:r}));case 6:return o=n.token,p.a.verify(o,process.env.TOKEN,(function(e,r){if(e)return t(500,{other:"Server Internal Error"});z(r.id,function(){var e=pe(regeneratorRuntime.mark((function e(r,o){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!r){e.next=2;break}return e.abrupt("return",t(500,{other:"Server Internal Error"}));case 2:if(o){e.next=4;break}return e.abrupt("return",t(400,"User doesnt exist"));case 4:if(!(o.dislikes.length>=5)){e.next=6;break}return e.abrupt("return",t(403,"you can dislike more than 5 clubs"));case 6:return e.next=8,o.likes.find((function(e){return e._id==n.club._id}));case 8:if(!e.sent){e.next=11;break}return e.abrupt("return",t(403,{other:'you can"t dislikes clubs you already liked'}));case 11:return e.next=13,o.dislikes.find((function(e){return e._id==n.club._id}));case 13:if(!e.sent){e.next=16;break}return e.abrupt("return",t(403,{other:"you already disliked this club"}));case 16:return ue(o.geo,function(){var e=pe(regeneratorRuntime.mark((function e(r,a){var i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(ve("findBoundries",o.geo,r,a),!r){e.next=3;break}return e.abrupt("return",t(500,{other:"Server Internal Error"}));case 3:if(a.array.length){e.next=5;break}return e.abrupt("return",t(400,{msg:"unable to resolve coordinates"}));case 5:return e.next=7,y.a.startSession();case 7:return(i=e.sent).startTransaction(),e.prev=9,e.next=12,a.array.forEach((function(e){new ge({name0:e.name0,name1:e.name1,name2:e.name2,user_id:o._id,boundy_id:e._id,team_id:n.club._id,geo:o.geo,fid:e.fid,gender:o.gender}).save()}));case 12:return o.dislikes.push(n.club._id),e.next=15,o.save();case 15:return e.next=17,i.commitTransaction();case 17:return e.next=19,i.endSession();case 19:return e.abrupt("return",null);case 22:return e.prev=22,e.t0=e.catch(9),e.next=26,i.abortTransaction();case 26:return i.endSession(),e.abrupt("return",t(500,{msg:"internal error"}));case 28:return e.prev=28,z(o._id,(function(e,n){return e?t(500,{msg:"internal error"}):t(200,{snackMsg:"hello ".concat(n.firstname),firstname:n.firstname,lastname:n.lastname,likes:n.likes||null,dislikes:n.dislikes||null,suggests:n.suggests||null,location:n.geo})})),e.finish(28);case 31:case"end":return e.stop()}}),e,null,[[9,22,28,31]])})));return function(n,t){return e.apply(this,arguments)}}()),e.abrupt("return",null);case 18:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}())})),e.abrupt("return",null);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function he(e,n,t,r,o,a,i){try{var u=e[a](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,o)}function xe(e){return function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){he(a,r,o,i,u,"next",e)}function u(e){he(a,r,o,i,u,"throw",e)}i(void 0)}))}}var ke=o()("log:v1");function we(e,n,t,r){return new Promise((function(o,a){"like"===t?te.countDocuments({team_id:n,gender:r,date:{$gte:new Date(e[0]),$lte:new Date(e[1])}}).exec((function(e,n){e&&(ke("geoWithin err",e),a(e)),o(n)})):ge.countDocuments({team_id:n,gender:r,date:{$gte:new Date(e[0]),$lte:new Date(e[1])}}).exec((function(e,n){e&&(ke("geoWithin err",e),a(e)),o(n)}))}))}var Se=new v.Schema({country:{type:String},name:{type:String},geo:v.Schema.Types.Point,cn:{type:String,unique:!0}});Se.index({geo:"2dsphere"}),Se.index({name:1}),Se.index({country:1}),Se.index({cn:1});var _e=Object(v.model)("City",Se);function Ie(e,n,t,r,o,a,i){try{var u=e[a](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,o)}o()("log:v1");function qe(e,n){Q.findById(e,(function(e,t){if(e)return console.log("error on finding club \n ".concat(e)),n(500,"error on finding club");var r=t.city,o=t.group,a=t.country,i=t.name;if("AFC"!==o||!a||!r)return n(200,t);u.a.readFile("/root/repos/fans_club/routes/logo/".concat(a+r+i,".png"),(function(e,o){if(e)return console.log("---------------------",e),n(200,{club:t,errRead:e});_e.findOne({country:a.trim(),name:r.trim()},function(){var e,r=(e=regeneratorRuntime.mark((function e(r,a){var i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!r){e.next=3;break}return console.log("--------------- finding City",r),e.abrupt("return",n(200,{club:t,errCity:r}));case 3:if(a){e.next=6;break}return console.log("--------------- no city has been found",a),e.abrupt("return",n(200,{club:t,errCity:null}));case 6:return i=Buffer.from(o).toString("base64"),e.abrupt("return",n(200,{city:a,club:t,base64Image:i}));case 8:case"end":return e.stop()}}),e)})),function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){Ie(a,r,o,i,u,"next",e)}function u(e){Ie(a,r,o,i,u,"throw",e)}i(void 0)}))});return function(e,n){return r.apply(this,arguments)}}())}))}))}var Oe=o()("log:v1__serverTiles"),Te=t(17),Pe={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept","Content-Type":"application/x-protobuf"},Ee={"Content-Type":"text/plain"};o()("log:v1");function Re(e,n,t,r,o,a,i){try{var u=e[a](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,o)}o()("log:v1");function je(e){var n=e.likeOrDislike,t=e.reducedDuplicates,r=e.teamId,o={},a=function(e){return e<1e3?e:e<1e4?e+1e3:e+1e4};return new Promise((function(e,i){try{t.forEach(function(){var i,u=(i=regeneratorRuntime.mark((function i(u,s){var c,l;return regeneratorRuntime.wrap((function(i){for(;;)switch(i.prev=i.next){case 0:if("like"!==n){i.next=7;break}return c=a(u),console.log(c),i.next=5,te.countDocuments({fid:c,team_id:r},(function(e,n){e&&console.log(e),o[u]=n}));case 5:i.next=11;break;case 7:return l=a(u),console.log(l),i.next=11,ge.countDocuments({fid:l,team_id:r},(function(e,n){e&&console.log(e),o[u]=n}));case 11:t.length-1===s&&e(o);case 12:case"end":return i.stop()}}),i)})),function(){var e=this,n=arguments;return new Promise((function(t,r){var o=i.apply(e,n);function a(e){Re(o,t,r,a,u,"next",e)}function u(e){Re(o,t,r,a,u,"throw",e)}a(void 0)}))});return function(e,n){return u.apply(this,arguments)}}())}catch(e){i(e)}}))}function De(e,n,t,r,o,a,i){try{var u=e[a](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,o)}function Ne(e){return function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){De(a,r,o,i,u,"next",e)}function u(e){De(a,r,o,i,u,"throw",e)}i(void 0)}))}}o()("log:v1");function Ce(){return(Ce=Ne(regeneratorRuntime.mark((function e(n,t){var r,o,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.token,o=n.club,a=n.type,p.a.verify(r,process.env.TOKEN,(function(e,n){if(e)return t(500,{other:"Server Internal Error"});z(n.id,function(){var e=Ne(regeneratorRuntime.mark((function e(n,r){var i,u,s;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!n){e.next=2;break}return e.abrupt("return",t(500,{other:"Server Internal Error"}));case 2:if(r){e.next=4;break}return e.abrupt("return",t(400,"User doesnt exist"));case 4:return e.next=6,y.a.startSession();case 6:return(i=e.sent).startTransaction(),e.prev=8,e.next=11,r.save();case 11:if("like"!==a){e.next=21;break}return e.next=14,r.likes.filter((function(e){return e._id!=o._id}));case 14:return u=e.sent,r.likes=u,e.next=18,r.save();case 18:return e.next=20,te.deleteMany({user_id:r._id,team_id:o._id});case 20:z(r._id,(function(e,n){return e?t(500,{msg:"internal error"}):t(200,{firstname:n.firstname,lastname:n.lastname,likes:n.likes||null,dislikes:n.dislikes||null,suggests:n.suggests||null,location:n.geo})}));case 21:if("dislike"!==a){e.next=31;break}return e.next=24,r.dislikes.filter((function(e){return e._id!=o._id}));case 24:return s=e.sent,r.dislikes=s,e.next=28,r.save();case 28:return e.next=30,ge.deleteMany({user_id:r._id,team_id:o._id});case 30:z(r._id,(function(e,n){return e?t(500,{msg:"internal error"}):t(200,{firstname:n.firstname,lastname:n.lastname,likes:n.likes||null,dislikes:n.dislikes||null,suggests:n.suggests||null,location:n.geo})}));case 31:return e.next=33,i.commitTransaction();case 33:return e.next=35,i.endSession();case 35:e.next=43;break;case 37:return e.prev=37,e.t0=e.catch(8),e.next=41,i.abortTransaction();case 41:return i.endSession(),e.abrupt("return",t(500,{msg:"internal error"}));case 43:case"end":return e.stop()}}),e,null,[[8,37]])})));return function(n,t){return e.apply(this,arguments)}}())})),e.abrupt("return",null);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var Ue=t(8);function Me(e,n,t,r,o,a,i){try{var u=e[a](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,o)}function Fe(e){return function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){Me(a,r,o,i,u,"next",e)}function u(e){Me(a,r,o,i,u,"throw",e)}i(void 0)}))}}function Be(){return(Be=Fe(regeneratorRuntime.mark((function e(n,t,r){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("=============",n,t),n&&t){e.next=3;break}return e.abrupt("return",r(200,{err:!0,other:"bad request"}));case 3:return Ue.a.findOne({username:n,password:t},(function(e,o){return console.log("************ ",e,o),e?r(200,{err:!0,other:"server internal error"}):o?void p.a.sign({username:n,password:t},process.env.TOKEN,(function(e,n){return e?r(200,{err:!0,other:"internal server error"}):(console.log(n),r(200,{err:!1,token:n}))})):r(200,{err:!0,other:"no uwer had been found"})})),e.abrupt("return",null);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var Le=o()("log:v1"),$e=Object(a.Router)();$e.post("/POST/makeNewUser",(function(e,n){!function(e,n){I.apply(this,arguments)}(e.body,(function(e,t){n.status(e).send(t)}))})),$e.post("/POST/isUserNew",(function(e,n){!function(e,n){j.apply(this,arguments)}(e.body,(function(e,t){n.status(e).send(t)}))})),$e.post("/POST/isUserNewFb",(function(e,n){!function(e,n){B.apply(this,arguments)}(e.body,(function(e,t){n.status(e).send(t)}))})),$e.post("/POST/signin",(function(e,n){!function(e,n){W.apply(this,arguments)}(e.body,(function(e,t){n.status(e).send(t)}))})),$e.get("/GET/getUserInfo/:token",(function(e,n){var t,r;Le("getUesrInfo token is ==> ",e.params.token),t=e.params.token,r=function(e,t){n.status(e).send(t)},p.a.verify(t,process.env.TOKEN,(function(e,n){if(H("??????",e,n),e)return r(500,{other:"Server Internal Error"});z(n.id,(function(e,n){return e?r(500,{other:"Server Internal Error"}):n?r(200,{snackMsg:"hello ".concat(n.firstname),firstname:n.firstname,lastname:n.lastname,likes:n.likes||null,dislikes:n.dislikes||null,suggests:n.suggests||null,location:n.geo,thumbnail:n.thumbnail}):r(400,"User doesnt exist")}))}))})),$e.post("/POST/searchClubs",(function(e,n){Le(e.body),function(e,n){ee.apply(this,arguments)}(e.body,(function(e,t){n.status(e).send(t)}))})),$e.post("/POST/likeClub",(function(e,n){!function(e,n){fe.apply(this,arguments)}(e.body,(function(e,t){n.status(e).send(t)}))})),$e.post("/POST/dislikeClub",(function(e,n){!function(e,n){be.apply(this,arguments)}(e.body,(function(e,t){n.status(e).send(t)}))})),$e.get("/GET/getClubTotalLikes/:mode/:id",(function(e,n){!function(e,n,t){var r=17424e5,o=[1580114579e3,1581856979e3],a=[o[1],o[1]+r],i=[a[1],a[1]+r],u=[i[1],i[1]+r],s=[u[1],u[1]+r],c=[s[1],s[1]+r];try{xe(regeneratorRuntime.mark((function r(){var l,f,d;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,xe(regeneratorRuntime.mark((function t(){var r,l,f,d,g,m;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,we(o,e,n,"male");case 2:return r=t.sent,t.next=5,we(a,e,n,"male");case 5:return t.t0=t.sent,t.t1=r,l=t.t0+t.t1,t.next=10,we(i,e,n,"male");case 10:return t.t2=t.sent,t.t3=l,f=t.t2+t.t3,t.next=15,we(u,e,n,"male");case 15:return t.t4=t.sent,t.t5=f,d=t.t4+t.t5,t.next=20,we(s,e,n,"male");case 20:return t.t6=t.sent,t.t7=d,g=t.t6+t.t7,t.next=25,we(c,e,n,"male");case 25:return t.t8=t.sent,t.t9=g,m=t.t8+t.t9,t.abrupt("return",[r,l,f,d,g,m]);case 29:case"end":return t.stop()}}),t)})))();case 2:return l=r.sent,r.next=5,xe(regeneratorRuntime.mark((function t(){var r,l,f,d,g,m;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,we(o,e,n,"female");case 2:return r=t.sent,t.next=5,we(a,e,n,"female");case 5:return t.t0=t.sent,t.t1=r,l=t.t0+t.t1,t.next=10,we(i,e,n,"female");case 10:return t.t2=t.sent,t.t3=l,f=t.t2+t.t3,t.next=15,we(u,e,n,"female");case 15:return t.t4=t.sent,t.t5=f,d=t.t4+t.t5,t.next=20,we(s,e,n,"female");case 20:return t.t6=t.sent,t.t7=d,g=t.t6+t.t7,t.next=25,we(c,e,n,"female");case 25:return t.t8=t.sent,t.t9=g,m=t.t8+t.t9,t.abrupt("return",[r,l,f,d,g,m]);case 29:case"end":return t.stop()}}),t)})))();case 5:return f=r.sent,r.next=8,Q.findById(e,(function(e,n){return e?t(500,{msg:"Internal Serever Error"}):n}));case 8:return d=r.sent,r.abrupt("return",t(200,{males:l,females:f,team:d}));case 10:case"end":return r.stop()}}),r)})))()}catch(e){return ke(e),t(500,{msg:"Internal Serever Error"})}}(e.params.id,e.params.mode,(function(e,t){n.status(e).send(t)}))})),$e.get("/GET/tiles/:z/:x/:y",(function(e,n){var t=e.params;!function(e,n,t,r){console.log(e,n,t),new Te(e<4?"./mbTiles/0.mbtiles":e<7?"./mbTiles/1.mbtiles":"./mbTiles/2.mbtiles",(function(o,a){a.getTile(e,n,t,(function(e,n){return e?(Oe(e),r(404,Ee,"Tile rendering error: ".concat(e,"\n"))):r(200,Pe,n)}))}))}(t.z,t.x,t.y,(function(e,t,r){console.log("sending tile"),200===e?n.set(t).status(e).send(r):n.sendStatus(204)}))})),$e.get("/GET/membersFromPoly/:swlng/:swlat/:nelng/:nelat/:val/:teamId",(function(e,n){var t=e.params,r=t.swlng,o=t.swlat,a=t.nelng,i=t.nelat,u=t.val,s=t.teamId;console.log(r,o,a,i,u,s),function(e,n,t,r,o,a,i){console.log("........................",a);var u=[e,n,t,r],s=g.bboxPolygon(u);"like"===o?te.find({team_id:a,geo:{$geoWithin:{$geometry:s.geometry}}},(function(e,n){return console.log(n),e?i(500,{msg:"Inernal Server Error"}):i(200,{likes:n})})):ge.find({team_id:a,geo:{$geoWithin:{$geometry:s.geometry}}},(function(e,n){return console.log(n),e?i(500,{msg:"Inernal Server Error"}):i(200,{likes:n})}))}(r,o,a,i,u,s,(function(e,t){n.status(e).send(t)}))})),$e.post("/POST/getLikesForPolys",(function(e,n){var t,r;t=e.body,r=function(e,t){console.log("getLikesForPolys ......",t),n.status(e).send(t)},je(t).then((function(e){return console.time("process is done"),r(200,{likes:e})})).catch((function(e){return r(500,{msg:"Internal Server Error",e:e})}))})),$e.get("/GET/club/:clubId",(function(e,n){qe(e.params.clubId,(function(e,t){n.status(e).send(t)}))})),$e.post("/POST/deleteClub",(function(e,n){!function(e,n){Ce.apply(this,arguments)}(e.body,(function(e,t){Le(e,t),n.status(e).send(t)}))})),$e.get("/admin/verify/:username/:password",(function(e,n){console.log("gggggggggggggggggggggggggggggggggggggggggg"),function(e,n,t){Be.apply(this,arguments)}(e.params.username,e.params.password,(function(e,t){n.status(e).send({trace:t})}))}));var Ae=$e;n.a={v1:Ae}},function(e,n,t){"use strict";t.r(n),function(e){t(15);var n=t(5),r=t.n(n),o=t(10),a=t.n(o),i=t(9),u=t.n(i),s=t(11),c=t.n(s),l=t(2),f=t.n(l),d=t(0),g=t.n(d),m=t(1),p=t.n(m),v=(t(16),t(13)),y=(t(8),g()("server")),b=process.env.PORT||4e3;p.a.connect("mongodb://localhost:27017/fansclub",{useUnifiedTopology:!0,useNewUrlParser:!0,useCreateIndex:!0}),p.a.connection.on("connected",(function(){y("MongoDB connected")})),p.a.connection.on("disconnected",(function(){y("MongoDB disconnected")})),p.a.connection.on("reconnected",(function(){y("MongoDB reconnected")})),p.a.connection.on("error",(function(e){y("MongoDB error: ".concat(e))}));var h=r()();h.use(r.a.static(f.a.resolve("react","build")));var x=["https://www.fansclub.app","http://localhost:3000"],k={origin:function(e,n){-1!==x.indexOf(e)?n(null,!0):(console.log("not allowed by Cors"),n(new Error("Not allowed by CORS")))}};h.use(u.a.json()),h.use(u.a.urlencoded({extended:!1})),h.use(a()()),h.get("/",(function(n,t){console.log(e),console.log("got the req address :: ",f.a.join(e,"react","build","index.html")),t.sendFile(f.a.resolve("react","build","index.html"))})),h.get("/clubs",(function(n,t){console.log(e),console.log("got the req address :: ",f.a.join(e,"react","build","index.html")),t.sendFile(f.a.resolve("react","build","index.html"))})),h.get("/signup",(function(n,t){console.log(e),console.log("got the req address :: ",f.a.join(e,"react","build","index.html")),t.sendFile(f.a.resolve("react","build","index.html"))})),h.get("/signin",(function(n,t){console.log(e),console.log("got the req address :: ",f.a.join(e,"react","build","index.html")),t.sendFile(f.a.resolve("react","build","index.html"))})),h.get("/map/*",(function(n,t){console.log(e),console.log("got the req address :: ",f.a.join(e,"react","build","index.html")),t.sendFile(f.a.resolve("react","build","index.html"))})),h.get("/map",(function(n,t){console.log(e),console.log("got the req address :: ",f.a.join(e,"react","build","index.html")),t.sendFile(f.a.resolve("react","build","index.html"))})),h.get("/auth/*",(function(n,t){console.log(e),console.log("got the req address :: ",f.a.join(e,"react","build","index.html")),t.sendFile(f.a.resolve("react","build","index.html"))})),h.use("/api/v1",c()(k),v.a.v1),h.listen(b,(function(){return y("Listening on port ".concat(b))}))}.call(this,"/")},function(e,n){e.exports=require("regenerator-runtime/runtime")},function(e,n){e.exports=require("dotenv/config")},function(e,n){e.exports=require("@mapbox/mbtiles")}]);