import{_ as y,o,c as n,m as a,a2 as c,J as l}from"./chunks/framework.BgExJILf.js";const h={name:"ImagePage",data(){return{imageUrl:"http://api.yujn.cn/api/moyu.php?msg=摸鱼日报&type=image",imageTypes:{type1:"http://api.yujn.cn/api/moyu.php?msg=摸鱼日报&type=image",type2:"http://api.yujn.cn/api/ecy.php",type3:"http://api.yujn.cn/api/yht.php",type4:"http://api.yujn.cn/api/sese.php",type5:"http://api.yujn.cn/api/ksxjj.php",type6:"http://api.yujn.cn/api/jk.php",type7:"http://api.yujn.cn/api/yscos.php",type8:"http://api.yujn.cn/api/yangyan.php",type9:"http://api.yujn.cn/api/tui.php",type10:"http://api.yujn.cn/api/baisi.php",type11:"http://api.yujn.cn/api/heisi.php",type12:"http://api.yujn.cn/api/mjx.php",type13:"http://api.yujn.cn/api/r18.php"}}},methods:{selectImageType(t){this.imageUrl=this.imageTypes[t.target.value],this.toggleImageDisplay()},toggleImageDisplay(){const t=this.$refs.imageViewer;t.style.display==="none"||t.style.display===""?(t.src=`${this.imageUrl}`,t.style.display="block"):t.style.display="none"},switchImage(){const t=this.$refs.imageViewer;t.style.display==="block"&&(t.src=`${this.imageUrl}?t=${new Date().getTime()}`)}}},m={class:"container"},r={class:"image-container"},u={ref:"imageViewer",alt:"selected image"},d={class:"buttons"},g=c("",13),_=[g];function v(t,e,s,I,T,p){return o(),n("div",m,[a("div",r,[a("img",u,null,512)]),a("div",d,[a("select",{onChange:e[0]||(e[0]=(...i)=>p.selectImageType&&p.selectImageType(...i))},_,32),a("button",{onClick:e[1]||(e[1]=(...i)=>p.toggleImageDisplay&&p.toggleImageDisplay(...i))},"开关"),a("button",{onClick:e[2]||(e[2]=(...i)=>p.switchImage&&p.switchImage(...i))},"切换")])])}const j=y(h,[["render",v],["__scopeId","data-v-9386511e"]]),w=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"column/other/pic.md","filePath":"column/other/pic.md"}'),f={name:"column/other/pic.md"},k=Object.assign(f,{setup(t){return(e,s)=>(o(),n("div",null,[l(j)]))}});export{w as __pageData,k as default};