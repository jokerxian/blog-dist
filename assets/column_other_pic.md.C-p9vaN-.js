import{_ as d,o,c as n,m as a,a2 as y,J as c}from"./chunks/framework.BgExJILf.js";const l={name:"ImagePage",data(){return{imageUrl:"http://api.yujn.cn/api/moyu.php?msg=摸鱼日报&type=image",imageTypes:{type1:"http://api.yujn.cn/api/moyu.php?msg=摸鱼日报&type=image",type2:"http://api.yujn.cn/api/ecy.php",type3:"http://api.yujn.cn/api/yht.php",type4:"http://api.yujn.cn/api/sese.php",type5:"http://api.yujn.cn/api/ksxjj.php",type6:"http://api.yujn.cn/api/jk.php",type7:"http://api.yujn.cn/api/yscos.php",type8:"http://api.yujn.cn/api/yangyan.php",type9:"http://api.yujn.cn/api/tui.php",type10:"http://api.yujn.cn/api/baisi.php",type11:"http://api.yujn.cn/api/heisi.php",type12:"http://api.yujn.cn/api/mjx.php",type13:"http://api.yujn.cn/api/r18.php"}}},methods:{selectImageType(t){this.imageUrl=this.imageTypes[t.target.value],this.toggleImageDisplay()},toggleImageDisplay(){const t=this.$refs.imageViewer;t.style.display==="none"||t.style.display===""?(t.src=`${this.imageUrl}`,t.style.display="block"):t.style.display="none"},switchImage(){const t=this.$refs.imageViewer;t.style.display==="block"&&(t.src=this.imageUrl)}}},h={class:"container"},r={class:"image-container"},m={ref:"imageViewer",alt:"selected image"},u={class:"buttons"},g=y('<option value="type1" data-v-8105dd4b>摸鱼日报</option><option value="type2" data-v-8105dd4b>二次元</option><option value="type3" data-v-8105dd4b>随机图片</option><option value="type4" data-v-8105dd4b>色色图片</option><option value="type5" data-v-8105dd4b>快手小姐姐</option><option value="type6" data-v-8105dd4b>JK</option><option value="type7" data-v-8105dd4b>原神cos</option><option value="type8" data-v-8105dd4b>高清养眼</option><option value="type9" data-v-8105dd4b>美腿</option><option value="type10" data-v-8105dd4b>白丝</option><option value="type11" data-v-8105dd4b>黑丝</option><option value="type12" data-v-8105dd4b>买家秀</option><option value="type13" data-v-8105dd4b>R18</option>',13),_=[g];function v(t,e,s,f,I,p){return o(),n("div",h,[a("div",r,[a("img",m,null,512)]),a("div",u,[a("select",{onChange:e[0]||(e[0]=(...i)=>p.selectImageType&&p.selectImageType(...i))},_,32),a("button",{onClick:e[1]||(e[1]=(...i)=>p.toggleImageDisplay&&p.toggleImageDisplay(...i))},"开关"),a("button",{onClick:e[2]||(e[2]=(...i)=>p.switchImage&&p.switchImage(...i))},"切换")])])}const b=d(l,[["render",v],["__scopeId","data-v-8105dd4b"]]),V=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"column/other/pic.md","filePath":"column/other/pic.md"}'),j={name:"column/other/pic.md"},k=Object.assign(j,{setup(t){return(e,s)=>(o(),n("div",null,[c(b)]))}});export{V as __pageData,k as default};
