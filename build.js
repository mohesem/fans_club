!function(e){var n={};function t(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,t),a.l=!0,a.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var a in e)t.d(r,a,function(n){return e[n]}.bind(null,a));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/",t(t.s=14)}([function(e,n){e.exports=require("mongoose")},function(e,n){e.exports=require("debug")},function(e,n){e.exports=require("path")},function(e,n){e.exports=require("jsonwebtoken")},function(e,n){e.exports=require("mongoose-geojson-schema")},function(e,n){e.exports=require("express")},function(e,n){e.exports=require("body-parser")},function(e,n){e.exports=require("@turf/turf")},function(e,n){e.exports=require("fs")},function(e,n){e.exports=require("cookie-parser")},function(e,n){e.exports=require("cors")},function(e,n){e.exports=require("morgan")},function(e,n){e.exports=require("email-validator")},function(e,n,t){"use strict";var r=t(1),a=t.n(r),o=t(5),i=(t(2),t(8)),u=t.n(i),s=t(12),c=t.n(s);function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function d(e){var n={};return new Promise((function(t){e.forEach((function(r,a){r.required&&!r.value?n["".concat(r.name)]="".concat(r.name," is required"):r.minLength&&r.value.length<r.minLength?n["".concat(r.name)]="".concat(r.name," should have more than ").concat(r.minLength," characters"):r.maxLength&&r.value.maxLength>r.maxLength?n["".concat(r.name)]="".concat(r.name," should have less than ").concat(r.maxLength," characters"):r.length&&"object"!==r.type&&r.value.length!==r.length?n["".concat(r.name)]="".concat(r.name," should have ").concat(r.length," characters"):r.type&&l(r.value)!==r.type?n["".concat(r.name)]="".concat(r.name," type should ba ").concat(r.type):r.email&&!1===c.a.validate(r.value)?n["".concat(r.name)]="".concat(r.name," is invalid"):"object"===r.type?r.length&&Object.keys(r.value).length!==r.length&&(n["".concat(r.name)]="".concat(r.name," object length should be ").concat(r.length)):"object"===r.type?r.keys.forEach((function(e){r.value[e.name]||(n["".concat(r.name)]="".concat(e.name," should be a part of ").concat(r.name))})):"object"===r.type&&r.keys.forEach((function(e){l(r.value[e.name])!==e.type&&(n["".concat(r.name)]="".concat(e.name," type should be ").concat(e.type))})),a===e.length-1&&t(n)}))}))}var f=function(e){return d([{value:e.from,name:"from",required:!0,type:"string"},{value:e.email,name:"email",required:!0,email:!0},{value:e.firstname,name:"firstname",required:!0,type:"string"},{value:e.lastname,name:"lastname",required:!0,type:"string"},{value:e.fullname,name:"fullname",required:!0,type:"string"},{value:e.picture,name:"picture",required:!0,type:"string"},{value:e.thumbnail,name:"thumbnail",required:!0,type:"string"},{value:e.googleId||e.facebookId,name:"id",required:!0,type:"string"},{value:e.location,name:"location",required:!0,type:"object",length:2,keys:[{value:"lng",type:"number"},{value:"lat",type:"number"}]},{value:e.address,name:"address",required:!0,type:"string"},{value:e.birth,name:"birth",required:!0},{value:e.gender,name:"gender",required:!0,type:"string"}])},m=t(7),p=t(3),g=t.n(p),v=t(0),y=t.n(v),b=(t(4),new v.Schema({geo:{type:v.Schema.Types.Point,required:!0},address:{type:String,required:!0},email:{type:String,required:!0,unique:!0},fullname:{type:String},firstname:{type:String},lastname:{type:String},thumbnail:{type:String},picture:{type:String},birth:{type:Date,required:!0},gender:{type:String,required:!0},facebookId:{type:String},googleId:{type:String},activatedOn:{type:Date,default:new Date},likes:[{type:v.Schema.Types.ObjectId,ref:"Team"}],dislikes:[{type:v.Schema.Types.ObjectId,ref:"Team"}],suggests:[{type:v.Schema.Types.ObjectId,ref:"Suggest"}]})),h=Object(v.model)("User",b),x=a()("log:db:makeNewuser"),k=function(e,n){x("-------------------------------------------",process.env.TOKEN);var t=e.from,r=e.email,a=e.firstname,o=e.lastname,i=e.fullname,u=e.picture,s=e.thumbnail,c=e.googleId,l=e.facebookId,d=e.location,f=e.address,p=e.birth,v=e.gender,y=m.point([d.lng,d.lat]),b=new h({geo:y.geometry,address:f,email:r,fullname:i,firstname:a,lastname:o,thumbnail:s,picture:u,birth:new Date(p),gender:v});"google"===t&&(b.googleId=c),"facebook"===t&&(b.facebookId=l);try{b.save((function(e,t){return e?(x("save err",e),11e3===e.code?n(500,{other:"email should be unique"}):n(500,{other:"Internal Server Error"})):(g.a.sign({email:t.email,id:t._id},process.env.TOKEN,(function(e,r){return e?(x("error on creating token",e),n(500,{other:"Server Internal Error"})):(x("++++++++++++++++++++++",r),n(200,{token:r,snackMsg:"hello ".concat(t.firstname)}))})),null)}))}catch(e){return x("eeeeeeeeeeeeeeeeeeeeee",e),n(500,{other:"Internal Server Error"})}};function S(e,n,t,r,a,o,i){try{var u=e[o](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,a)}function w(e){return function(){var n=this,t=arguments;return new Promise((function(r,a){var o=e.apply(n,t);function i(e){S(o,r,a,i,u,"next",e)}function u(e){S(o,r,a,i,u,"throw",e)}i(void 0)}))}}var _=a()("log:v1");function q(){return(q=w(regeneratorRuntime.mark((function e(n,t){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f(n);case 2:if(r=e.sent,_("test isNewUser",r),!Object.entries(r).length){e.next=6;break}return e.abrupt("return",t(400,{test:r}));case 6:return k(n,(function(e,n){return t(e,n)})),e.abrupt("return",null);case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var T=function(e){return d([{value:e,name:"email",required:!0,email:!0}])},I=a()("log:db");function O(e,n){I("gert user by email is working",e),h.findOne({email:e},(function(e,t){return I("getUserByEmail result",e,t),e?n(e,null):n(null,t)}))}function P(e,n,t,r,a,o,i){try{var u=e[o](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,a)}function j(e){return function(){var n=this,t=arguments;return new Promise((function(r,a){var o=e.apply(n,t);function i(e){P(o,r,a,i,u,"next",e)}function u(e){P(o,r,a,i,u,"throw",e)}i(void 0)}))}}var E=a()("log:v1");function R(){return(R=j(regeneratorRuntime.mark((function e(n,t){var r,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.email,e.next=3,T(r);case 3:if(a=e.sent,E("test isNewUser",a),!Object.entries(a).length){e.next=7;break}return e.abrupt("return",t(400,a));case 7:return O(r,(function(e,n){return t(200,e?{err:!0,other:"Internal Server Error"}:n?{err:!0,other:"Account exists"}:{msg:"New User"})})),e.abrupt("return",null);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var C=a()("log:db");function D(e,n){C("gert user by email is working",e),h.findOne({email:e.email,facebookId:e.facebookId,googleId:e.googleId}).exec((function(e,t){return e?n(e,null):n(null,t)}))}function N(e,n,t,r,a,o,i){try{var u=e[o](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,a)}function U(e){return function(){var n=this,t=arguments;return new Promise((function(r,a){var o=e.apply(n,t);function i(e){N(o,r,a,i,u,"next",e)}function u(e){N(o,r,a,i,u,"throw",e)}i(void 0)}))}}var M=a()("log:v1");function B(){return(B=U(regeneratorRuntime.mark((function e(n,t){var r,a,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.email,a=n.facebookId,o=n.googleId,D({email:r,facebookId:a,googleId:o},(function(e,n){return M("result of population ==> ",e,n),e?t(500,{other:"Server Internal Error"}):n?(g.a.sign({email:n.email,id:n._id},process.env.TOKEN,(function(r,a){return e?(M("error on creating token",r),t(500,{other:"Server Internal Error"})):(M("++++++++++++++++++++++",a),t(200,{token:a,snackMsg:"hello ".concat(n.firstname),firstname:n.firstname,lastname:n.lastname,likes:n.likes||null,dislikes:n.dislikes||null,suggests:n.suggests||null,location:n.geo}))})),null):t(400,{other:"no user has been found"})})),e.abrupt("return",null);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}a()("log:db");function L(e,n){h.findById(e).populate("likes").populate("dislikes").exec((function(e,t){return e?n(e,null):n(null,t)}))}var F=a()("log:v1");var G=function(e){return d([{value:e.str,name:"str",required:!0,type:"string"}])},$=new v.Schema({group:{type:String,required:!0},country:{type:String,required:!0},name:{type:String,required:!0},city:{type:String},primary_color:{type:String,required:!0},secondary_color:{type:String,required:!0}});$.index({name:1});var A=Object(v.model)("Team",$);a()("log:db");function K(e,n){A.find({name:{$regex:"^".concat(e,".*"),$options:"i"}}).sort({name:1}).limit(10).exec((function(e,t){e?n(e,null):n(null,t)}))}function J(e,n,t,r,a,o,i){try{var u=e[o](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,a)}function W(e){return function(){var n=this,t=arguments;return new Promise((function(r,a){var o=e.apply(n,t);function i(e){J(o,r,a,i,u,"next",e)}function u(e){J(o,r,a,i,u,"throw",e)}i(void 0)}))}}a()("log:v1");function z(){return(z=W(regeneratorRuntime.mark((function e(n,t){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,G(n);case 2:if(r=e.sent,!Object.entries(r).length){e.next=5;break}return e.abrupt("return",t(400,{test:r}));case 5:return K(n.str,(function(e,n){return e?t(500,{other:"Server Internal Error"}):t(200,{clubs:n})})),e.abrupt("return",null);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var H=new v.Schema({geo:v.Schema.Types.Point,user_id:{type:v.Schema.Types.ObjectId,ref:"User",required:!0},boundy_id:{type:v.Schema.Types.ObjectId,ref:"GeoJSON",required:!0},team_id:{type:v.Schema.Types.ObjectId,ref:"Team",required:!0},name0:{type:String},name1:{type:String},name2:{type:String},fid:{type:String,require:!0},date:{type:Date,default:new Date},gender:{type:String}});H.index({geo:"2dsphere"}),H.index({user_id:1}),H.index({boundy_id:1}),H.index({team_id:1}),H.index({fid:1}),H.index({date:1}),H.index({gender:1});var X=Object(v.model)("Like",H),Q=function(e){return d([{value:e.token,name:"token",required:!0,type:"string"},{value:e.club,name:"club",required:!0,type:"object",keys:[{value:"_id",type:"string"},{value:"group",type:"string"},{value:"name",type:"string"},{value:"city",type:"string"},{value:"primary_color",type:"string"},{value:"secondary_color",type:"string"}]}])},V=new v.Schema({name0:{type:String},name1:{type:String},name2:{type:String},geo:v.Schema.Types.MultiPolygon,fid:{type:Number,required:!0}});V.index({geo:"2dsphere"}),V.index({fid:1});var Y=Object(v.model)("GeoJSON",V);function Z(e,n,t,r,a,o,i){try{var u=e[o](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,a)}function ee(e,n){Y.find({geo:{$geoIntersects:{$geometry:{type:e.type,coordinates:e.coordinates}}}},function(){var e,t=(e=regeneratorRuntime.mark((function e(t,r){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t){e.next=2;break}return e.abrupt("return",n(t,{msg:"Server Internal Error"}));case 2:return e.abrupt("return",n(null,{array:r}));case 3:case"end":return e.stop()}}),e)})),function(){var n=this,t=arguments;return new Promise((function(r,a){var o=e.apply(n,t);function i(e){Z(o,r,a,i,u,"next",e)}function u(e){Z(o,r,a,i,u,"throw",e)}i(void 0)}))});return function(e,n){return t.apply(this,arguments)}}())}function ne(e,n,t,r,a,o,i){try{var u=e[o](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,a)}function te(e){return function(){var n=this,t=arguments;return new Promise((function(r,a){var o=e.apply(n,t);function i(e){ne(o,r,a,i,u,"next",e)}function u(e){ne(o,r,a,i,u,"throw",e)}i(void 0)}))}}var re=a()("log:v1");function ae(){return(ae=te(regeneratorRuntime.mark((function e(n,t){var r,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Q(n);case 2:if(r=e.sent,re("test searchClubs",r),!Object.entries(r).length){e.next=6;break}return e.abrupt("return",t(400,{test:r}));case 6:return a=n.token,g.a.verify(a,process.env.TOKEN,(function(e,r){if(e)return t(500,{other:"Server Internal Error"});L(r.id,function(){var e=te(regeneratorRuntime.mark((function e(r,a){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(re("----------------------",a),!r){e.next=3;break}return e.abrupt("return",t(500,{other:"Server Internal Error"}));case 3:if(a){e.next=5;break}return e.abrupt("return",t(400,"User doesnt exist"));case 5:if(!(a.likes.length>=5)){e.next=7;break}return e.abrupt("return",t(403,"you can like more than 5 clubs"));case 7:return e.next=9,a.likes.find((function(e){return e._id==n.club._id}));case 9:if(!e.sent){e.next=12;break}return e.abrupt("return",t(403,{other:"you already liked this club"}));case 12:return e.next=14,a.dislikes.find((function(e){return e._id==n.club._id}));case 14:if(!e.sent){e.next=17;break}return e.abrupt("return",t(403,{other:"you can likes clubs you already disliked"}));case 17:return ee(a.geo,function(){var e=te(regeneratorRuntime.mark((function e(r,o){var i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(re("findBoundries",a.geo,r,o),!r){e.next=3;break}return e.abrupt("return",t(500,{other:"Server Internal Error"}));case 3:if(o.array.length){e.next=5;break}return e.abrupt("return",t(400,{msg:"unable to resolve coordinates"}));case 5:return e.next=7,y.a.startSession();case 7:return(i=e.sent).startTransaction(),e.prev=9,e.next=12,o.array.forEach((function(e){new X({name0:e.name0,name1:e.name1,name2:e.name2,user_id:a._id,boundy_id:e._id,team_id:n.club._id}).save()}));case 12:return a.likes.push(n.club._id),e.next=15,a.save();case 15:return e.next=17,i.commitTransaction();case 17:return e.next=19,i.endSession();case 19:return e.abrupt("return",null);case 22:return e.prev=22,e.t0=e.catch(9),e.next=26,i.abortTransaction();case 26:return i.endSession(),e.abrupt("return",t(500,{msg:"internal error"}));case 28:return e.prev=28,L(a._id,(function(e,n){return e?t(500,{msg:"internal error"}):t(200,{snackMsg:"hello ".concat(n.firstname),firstname:n.firstname,lastname:n.lastname,likes:n.likes||null,dislikes:n.dislikes||null,suggests:n.suggests||null,location:n.geo})})),e.finish(28);case 31:case"end":return e.stop()}}),e,null,[[9,22,28,31]])})));return function(n,t){return e.apply(this,arguments)}}()),e.abrupt("return",null);case 19:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}())})),e.abrupt("return",null);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var oe=new v.Schema({geo:v.Schema.Types.Point,user_id:{type:v.Schema.Types.ObjectId,ref:"User",required:!0},boundy_id:{type:v.Schema.Types.ObjectId,ref:"GeoJSON",required:!0},team_id:{type:v.Schema.Types.ObjectId,ref:"Team",required:!0},name0:{type:String},name1:{type:String},name2:{type:String},fid:{type:String,require:!0},date:{type:Date,default:new Date},gender:{type:String}});oe.index({geo:"2dsphere"}),oe.index({user_id:1}),oe.index({boundy_id:1}),oe.index({team_id:1}),oe.index({fid:1}),oe.index({date:1}),oe.index({gender:1});var ie=Object(v.model)("Dislike",oe);function ue(e,n,t,r,a,o,i){try{var u=e[o](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,a)}function se(e){return function(){var n=this,t=arguments;return new Promise((function(r,a){var o=e.apply(n,t);function i(e){ue(o,r,a,i,u,"next",e)}function u(e){ue(o,r,a,i,u,"throw",e)}i(void 0)}))}}var ce=a()("log:v1"),le=function(e){return d([{value:e.token,name:"token",required:!0,type:"string"},{value:e.club,name:"club",required:!0,type:"object",keys:[{value:"_id",type:"string"},{value:"group",type:"string"},{value:"name",type:"string"},{value:"city",type:"string"},{value:"primary_color",type:"string"},{value:"secondary_color",type:"string"}]}])};function de(){return(de=se(regeneratorRuntime.mark((function e(n,t){var r,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,le(n);case 2:if(r=e.sent,ce("test searchClubs",r),!Object.entries(r).length){e.next=6;break}return e.abrupt("return",t(400,{test:r}));case 6:return a=n.token,g.a.verify(a,process.env.TOKEN,(function(e,r){if(e)return t(500,{other:"Server Internal Error"});L(r.id,function(){var e=se(regeneratorRuntime.mark((function e(r,a){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!r){e.next=2;break}return e.abrupt("return",t(500,{other:"Server Internal Error"}));case 2:if(a){e.next=4;break}return e.abrupt("return",t(400,"User doesnt exist"));case 4:if(!(a.dislikes.length>=5)){e.next=6;break}return e.abrupt("return",t(403,"you can dislike more than 5 clubs"));case 6:return e.next=8,a.likes.find((function(e){return e._id==n.club._id}));case 8:if(!e.sent){e.next=11;break}return e.abrupt("return",t(403,{other:'you can"t dislikes clubs you already liked'}));case 11:return e.next=13,a.dislikes.find((function(e){return e._id==n.club._id}));case 13:if(!e.sent){e.next=16;break}return e.abrupt("return",t(403,{other:"you already disliked this club"}));case 16:return ee(a.geo,function(){var e=se(regeneratorRuntime.mark((function e(r,o){var i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(ce("findBoundries",a.geo,r,o),!r){e.next=3;break}return e.abrupt("return",t(500,{other:"Server Internal Error"}));case 3:if(o.array.length){e.next=5;break}return e.abrupt("return",t(400,{msg:"unable to resolve coordinates"}));case 5:return e.next=7,y.a.startSession();case 7:return(i=e.sent).startTransaction(),e.prev=9,e.next=12,o.array.forEach((function(e){new ie({name0:e.name0,name1:e.name1,name2:e.name2,user_id:a._id,boundy_id:e._id,team_id:n.club._id}).save()}));case 12:return a.dislikes.push(n.club._id),e.next=15,a.save();case 15:return e.next=17,i.commitTransaction();case 17:return e.next=19,i.endSession();case 19:return e.abrupt("return",null);case 22:return e.prev=22,e.t0=e.catch(9),e.next=26,i.abortTransaction();case 26:return i.endSession(),e.abrupt("return",t(500,{msg:"internal error"}));case 28:return e.prev=28,L(a._id,(function(e,n){return e?t(500,{msg:"internal error"}):t(200,{snackMsg:"hello ".concat(n.firstname),firstname:n.firstname,lastname:n.lastname,likes:n.likes||null,dislikes:n.dislikes||null,suggests:n.suggests||null,location:n.geo})})),e.finish(28);case 31:case"end":return e.stop()}}),e,null,[[9,22,28,31]])})));return function(n,t){return e.apply(this,arguments)}}()),e.abrupt("return",null);case 18:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}())})),e.abrupt("return",null);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function fe(e,n,t,r,a,o,i){try{var u=e[o](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,a)}function me(e){return function(){var n=this,t=arguments;return new Promise((function(r,a){var o=e.apply(n,t);function i(e){fe(o,r,a,i,u,"next",e)}function u(e){fe(o,r,a,i,u,"throw",e)}i(void 0)}))}}var pe=a()("log:v1");function ge(e,n,t){return new Promise((function(r,a){X.countDocuments({team_id:n,gender:t,date:{$gte:new Date(e[0]),$lte:new Date(e[1])}}).exec((function(e,n){e&&(pe("geoWithin err",e),a(e)),r(n)}))}))}var ve=new v.Schema({country:{type:String},name:{type:String},geo:v.Schema.Types.Point,cn:{type:String,unique:!0}});ve.index({geo:"2dsphere"}),ve.index({name:1}),ve.index({country:1}),ve.index({cn:1});var ye=Object(v.model)("City",ve);function be(e,n,t,r,a,o,i){try{var u=e[o](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,a)}var he=a()("log:v1");function xe(e,n){A.findById(e,(function(e,t){if(e)return console.log("error on finding club \n ".concat(e)),n(500,"error on finding club");console.log("club ==> ",t),he("club ==> ",t);var r=t.city,a=t.group,o=t.country,i=t.name;if("AFC"!==a||!o||!r)return n(200,t);u.a.readFile("/root/repos/fans_club/routes/logo/".concat(o+r+i,".png"),(function(e,a){if(e)return console.log("---------------------",e),n(200,{club:t,errRead:e});console.log("tewaeeeeeeeeeeeeeeeeam with logo has been found"),ye.findOne({country:o.trim(),name:r.trim()},function(){var e,r=(e=regeneratorRuntime.mark((function e(r,o){var i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!r){e.next=3;break}return console.log("--------------- finding City",r),e.abrupt("return",n(200,{club:t,errCity:r}));case 3:if(o){e.next=6;break}return console.log("--------------- no city has been found",o),e.abrupt("return",n(200,{club:t,errCity:null}));case 6:return i=Buffer.from(a).toString("base64"),console.log("-----------------",o),e.abrupt("return",n(200,{city:o,club:t,base64Image:i}));case 9:case"end":return e.stop()}}),e)})),function(){var n=this,t=arguments;return new Promise((function(r,a){var o=e.apply(n,t);function i(e){be(o,r,a,i,u,"next",e)}function u(e){be(o,r,a,i,u,"throw",e)}i(void 0)}))});return function(e,n){return r.apply(this,arguments)}}())}))}))}var ke=a()("log:v1__serverTiles"),Se=t(17),we={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept","Content-Type":"application/x-protobuf"},_e={"Content-Type":"text/plain"};a()("log:v1");function qe(e,n,t,r,a,o,i){try{var u=e[o](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,a)}a()("log:v1");function Te(e){var n=e.reducedDuplicates,t=(e.teamId,{});return new Promise((function(e,r){try{n.forEach(function(){var r,a=(r=regeneratorRuntime.mark((function r(a,o){return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,X.countDocuments({fid:String(a),team_id:"5e6aa5e6075d200d2a9d7530"},(function(e,n){e&&console.log(e),t[a]=n}));case 2:n.length-1===o&&e(t);case 3:case"end":return r.stop()}}),r)})),function(){var e=this,n=arguments;return new Promise((function(t,a){var o=r.apply(e,n);function i(e){qe(o,t,a,i,u,"next",e)}function u(e){qe(o,t,a,i,u,"throw",e)}i(void 0)}))});return function(e,n){return a.apply(this,arguments)}}())}catch(e){r(e)}}))}function Ie(e,n,t,r,a,o,i){try{var u=e[o](i),s=u.value}catch(e){return void t(e)}u.done?n(s):Promise.resolve(s).then(r,a)}function Oe(e){return function(){var n=this,t=arguments;return new Promise((function(r,a){var o=e.apply(n,t);function i(e){Ie(o,r,a,i,u,"next",e)}function u(e){Ie(o,r,a,i,u,"throw",e)}i(void 0)}))}}a()("log:v1");function Pe(){return(Pe=Oe(regeneratorRuntime.mark((function e(n,t){var r,a,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.token,a=n.club,o=n.type,g.a.verify(r,process.env.TOKEN,(function(e,n){if(e)return t(500,{other:"Server Internal Error"});L(n.id,function(){var e=Oe(regeneratorRuntime.mark((function e(n,r){var i,u,s;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!n){e.next=2;break}return e.abrupt("return",t(500,{other:"Server Internal Error"}));case 2:if(r){e.next=4;break}return e.abrupt("return",t(400,"User doesnt exist"));case 4:return e.next=6,y.a.startSession();case 6:return(i=e.sent).startTransaction(),e.prev=8,e.next=11,r.save();case 11:if("like"!==o){e.next=21;break}return e.next=14,r.likes.filter((function(e){return e._id!=a._id}));case 14:return u=e.sent,r.likes=u,e.next=18,r.save();case 18:return e.next=20,X.deleteMany({user_id:r._id,team_id:a._id});case 20:L(r._id,(function(e,n){return e?t(500,{msg:"internal error"}):t(200,{firstname:n.firstname,lastname:n.lastname,likes:n.likes||null,dislikes:n.dislikes||null,suggests:n.suggests||null,location:n.geo})}));case 21:if("dislike"!==o){e.next=31;break}return e.next=24,r.dislikes.filter((function(e){return e._id!=a._id}));case 24:return s=e.sent,r.dislikes=s,e.next=28,r.save();case 28:return e.next=30,ie.deleteMany({user_id:r._id,team_id:a._id});case 30:L(r._id,(function(e,n){return e?t(500,{msg:"internal error"}):t(200,{firstname:n.firstname,lastname:n.lastname,likes:n.likes||null,dislikes:n.dislikes||null,suggests:n.suggests||null,location:n.geo})}));case 31:return e.next=33,i.commitTransaction();case 33:return e.next=35,i.endSession();case 35:e.next=43;break;case 37:return e.prev=37,e.t0=e.catch(8),e.next=41,i.abortTransaction();case 41:return i.endSession(),e.abrupt("return",t(500,{msg:"internal error"}));case 43:case"end":return e.stop()}}),e,null,[[8,37]])})));return function(n,t){return e.apply(this,arguments)}}())})),e.abrupt("return",null);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var je=a()("log:v1"),Ee=Object(o.Router)();Ee.post("/POST/makeNewUser",(function(e,n){!function(e,n){q.apply(this,arguments)}(e.body,(function(e,t){n.status(e).send(t)}))})),Ee.post("/POST/isUserNew",(function(e,n){!function(e,n){R.apply(this,arguments)}(e.body,(function(e,t){n.status(e).send(t)}))})),Ee.post("/POST/signin",(function(e,n){!function(e,n){B.apply(this,arguments)}(e.body,(function(e,t){n.status(e).send(t)}))})),Ee.get("/GET/getUserInfo/:token",(function(e,n){var t,r;je("getUesrInfo token is ==> ",e.params.token),t=e.params.token,r=function(e,t){n.status(e).send(t)},g.a.verify(t,process.env.TOKEN,(function(e,n){if(F("??????",e,n),e)return r(500,{other:"Server Internal Error"});L(n.id,(function(e,n){return e?r(500,{other:"Server Internal Error"}):n?r(200,{snackMsg:"hello ".concat(n.firstname),firstname:n.firstname,lastname:n.lastname,likes:n.likes||null,dislikes:n.dislikes||null,suggests:n.suggests||null,location:n.geo}):r(400,"User doesnt exist")}))}))})),Ee.post("/POST/searchClubs",(function(e,n){console.log("asdf asdf"),je(e.body),function(e,n){z.apply(this,arguments)}(e.body,(function(e,t){n.status(e).send(t)}))})),Ee.post("/POST/likeClub",(function(e,n){!function(e,n){ae.apply(this,arguments)}(e.body,(function(e,t){n.status(e).send(t)}))})),Ee.post("/POST/dislikeClub",(function(e,n){!function(e,n){de.apply(this,arguments)}(e.body,(function(e,t){n.status(e).send(t)}))})),Ee.get("/GET/getClubTotalLikes/:id",(function(e,n){!function(e,n){pe("get total likes",e);var t="5e6aa5e6075d200d2a9d7530",r=17424e5,a=[1580114579e3,1581856979e3],o=[a[1],a[1]+r],i=[o[1],o[1]+r],u=[i[1],i[1]+r],s=[u[1],u[1]+r],c=[s[1],s[1]+r];try{me(regeneratorRuntime.mark((function e(){var r,l,d;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,me(regeneratorRuntime.mark((function e(){var n,r,l,d,f,m;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ge(a,t,"male");case 2:return n=e.sent,e.next=5,ge(o,t,"male");case 5:return e.t0=e.sent,e.t1=n,r=e.t0+e.t1,e.next=10,ge(i,t,"male");case 10:return e.t2=e.sent,e.t3=r,l=e.t2+e.t3,e.next=15,ge(u,t,"male");case 15:return e.t4=e.sent,e.t5=l,d=e.t4+e.t5,e.next=20,ge(s,t,"male");case 20:return e.t6=e.sent,e.t7=d,f=e.t6+e.t7,e.next=25,ge(c,t,"male");case 25:return e.t8=e.sent,e.t9=f,m=e.t8+e.t9,e.abrupt("return",[n,r,l,d,f,m]);case 29:case"end":return e.stop()}}),e)})))();case 2:return r=e.sent,e.next=5,me(regeneratorRuntime.mark((function e(){var n,r,l,d,f,m;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ge(a,t,"female");case 2:return n=e.sent,e.next=5,ge(o,t,"female");case 5:return e.t0=e.sent,e.t1=n,r=e.t0+e.t1,e.next=10,ge(i,t,"female");case 10:return e.t2=e.sent,e.t3=r,l=e.t2+e.t3,e.next=15,ge(u,t,"female");case 15:return e.t4=e.sent,e.t5=l,d=e.t4+e.t5,e.next=20,ge(s,t,"female");case 20:return e.t6=e.sent,e.t7=d,f=e.t6+e.t7,e.next=25,ge(c,t,"female");case 25:return e.t8=e.sent,e.t9=f,m=e.t8+e.t9,e.abrupt("return",[n,r,l,d,f,m]);case 29:case"end":return e.stop()}}),e)})))();case 5:return l=e.sent,e.next=8,A.findById("5e6aa5e6075d200d2a9d7530",(function(e,t){return e?n(500,{msg:"Internal Serever Error"}):t}));case 8:return d=e.sent,e.abrupt("return",n(200,{males:r,females:l,team:d}));case 10:case"end":return e.stop()}}),e)})))()}catch(e){return pe(e),n(500,{msg:"Internal Serever Error"})}}(e.params.id,(function(e,t){n.status(e).send(t)}))})),Ee.get("/GET/tiles/:z/:x/:y",(function(e,n){var t=e.params,r=t.z,a=t.x,o=t.y;console.log(a,r,o),je(r,a,o),function(e,n,t,r){ke(e,n,t),new Se(e<4?"./mbTiles/0.mbtiles":e<7?"./mbTiles/1.mbtiles":"./mbTiles/2.mbtiles",(function(a,o){o.getTile(e,n,t,(function(e,n){return e?(ke(e),r(404,_e,"Tile rendering error: ".concat(e,"\n"))):r(200,we,n)}))}))}(r,a,o,(function(e,t,r){n.set(t).status(e).send(r)}))})),Ee.get("/GET/membersFromPoly/:swlng/:swlat/:nelng/:nelat/:val/:teamId",(function(e,n){var t=e.params,r=t.swlng,a=t.swlat,o=t.nelng,i=t.nelat;t.val,t.teamId;!function(e,n,t,r,a,o,i){var u=[e,n,t,r],s=m.bboxPolygon(u);X.find({team_id:"5e6aa5e6075d200d2a9d7530",geo:{$geoWithin:{$geometry:s.geometry}}},(function(e,n){return console.log(n),e?i(500,{msg:"Inernal Server Error"}):i(200,{likes:n})}))}(r,a,o,i,0,0,(function(e,t){n.status(e).send(t)}))})),Ee.post("/POST/getLikesForPolys",(function(e,n){var t,r;t=e.body,r=function(e,t){n.status(e).send(t)},Te(t).then((function(e){return console.time("process is done"),r(200,{likes:e})})).catch((function(e){return r(500,{msg:"Internal Server Error",e:e})}))})),Ee.get("/GET/club/:clubId",(function(e,n){console.log("get cluuuuuuub"),xe(e.params.clubId,(function(e,t){console.log(e,t),n.status(e).send(t)}))})),Ee.post("/POST/deleteClub",(function(e,n){!function(e,n){Pe.apply(this,arguments)}(e.body,(function(e,t){je(e,t),n.status(e).send(t)}))}));var Re=Ee;n.a={v1:Re}},function(e,n,t){"use strict";t.r(n),function(e){t(15);var n=t(5),r=t.n(n),a=t(9),o=t.n(a),i=t(6),u=t.n(i),s=t(10),c=t.n(s),l=t(2),d=t.n(l),f=t(11),m=t.n(f),p=t(1),g=t.n(p),v=t(0),y=t.n(v),b=(t(16),t(13)),h=g()("server"),x=process.env.PORT||4e3;y.a.connect("mongodb://localhost:27017/fansclub",{useUnifiedTopology:!0,useNewUrlParser:!0,useCreateIndex:!0}),y.a.connection.on("connected",(function(){h("MongoDB connected")})),y.a.connection.on("disconnected",(function(){h("MongoDB disconnected")})),y.a.connection.on("reconnected",(function(){h("MongoDB reconnected")})),y.a.connection.on("error",(function(e){h("MongoDB error: ".concat(e))}));var k=r()();k.use(r.a.static(d.a.resolve("react","build"))),k.use(c()()),k.use(u.a.json()),k.use(u.a.urlencoded({extended:!1})),k.use(o()()),k.use(m()("dev")),k.use(c()()),k.use(u.a.json()),k.use(u.a.urlencoded({extended:!1})),k.use(o()()),k.get("/",(function(n,t){console.log(e),console.log("got the req address :: ",d.a.join(e,"react","build","index.html")),t.sendFile(d.a.resolve("react","build","index.html"))})),k.get("/clubs",(function(n,t){console.log(e),console.log("got the req address :: ",d.a.join(e,"react","build","index.html")),t.sendFile(d.a.resolve("react","build","index.html"))})),k.get("/signup",(function(n,t){console.log(e),console.log("got the req address :: ",d.a.join(e,"react","build","index.html")),t.sendFile(d.a.resolve("react","build","index.html"))})),k.get("/signin",(function(n,t){console.log(e),console.log("got the req address :: ",d.a.join(e,"react","build","index.html")),t.sendFile(d.a.resolve("react","build","index.html"))})),k.get("/v/*",(function(n,t){console.log(e),console.log("got the req address :: ",d.a.join(e,"react","build","index.html")),t.sendFile(d.a.resolve("react","build","index.html"))})),k.get("/auth/*",(function(n,t){console.log(e),console.log("got the req address :: ",d.a.join(e,"react","build","index.html")),t.sendFile(d.a.resolve("react","build","index.html"))})),k.use("/api/v1",b.a.v1),k.listen(x,(function(){return h("Listening on port ".concat(x))}))}.call(this,"/")},function(e,n){e.exports=require("regenerator-runtime/runtime")},function(e,n){e.exports=require("dotenv/config")},function(e,n){e.exports=require("@mapbox/mbtiles")}]);