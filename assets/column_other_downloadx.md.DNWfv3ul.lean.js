import{_ as c,o as a,c as n,m as l,a3 as p,a4 as u,e as d,q as v,s as w,J as _}from"./chunks/framework.DgWzJD9P.js";const h={data(){return{inputUrl:"",videoUrl:null,showPreview:!1}},methods:{async parseUrl(){try{var t="https://api.yujn.cn/api/jiexi.php?type=json&msg="+this.inputUrl;const e=await fetch(t);if(!e.ok)throw new Error("网络请求失败");const o=await e.json();o&&o.video?(this.videoUrl=o.video,this.showPreview=!1):alert("解析失败，未找到视频地址。")}catch(e){console.error("发生错误：",e),alert("发生错误，无法解析视频地址。")}},previewVideo(){this.showPreview=!0}}},m=t=>(v("data-v-13d194b5"),t=t(),w(),t),f=m(()=>l("div",{class:"tip"}," 因第三方解析原因，浏览器需自行下载插件Allow CORS 规避跨域问题，配置域名： api.yujn.cn ",-1)),U={class:"input-group"},x=["src"];function b(t,e,o,V,r,i){return a(),n("div",null,[f,l("div",U,[p(l("input",{"onUpdate:modelValue":e[0]||(e[0]=s=>r.inputUrl=s),placeholder:"请输入视频链接",class:"input-box"},null,512),[[u,r.inputUrl]]),l("button",{onClick:e[1]||(e[1]=(...s)=>i.parseUrl&&i.parseUrl(...s)),class:"parse-button"},"解析"),r.videoUrl?(a(),n("button",{key:0,onClick:e[2]||(e[2]=(...s)=>i.previewVideo&&i.previewVideo(...s)),class:"preview-button"}," 预览视频 ")):d("",!0)]),r.showPreview?(a(),n("video",{key:0,src:r.videoUrl,controls:"",class:"video-preview"}," 你的浏览器不支持视频预览。 ",8,x)):d("",!0)])}const k=c(h,[["render",b],["__scopeId","data-v-13d194b5"]]),P=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"column/other/downloadx.md","filePath":"column/other/downloadx.md"}'),y={name:"column/other/downloadx.md"},S=Object.assign(y,{setup(t){return(e,o)=>(a(),n("div",null,[_(k)]))}});export{P as __pageData,S as default};