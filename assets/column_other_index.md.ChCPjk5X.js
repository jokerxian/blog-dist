import{_ as s,o as n,c as i,m as a,a2 as d,J as w}from"./chunks/framework.BgExJILf.js";const l={name:"TvPage",data(){return{videoUrl:"http://www.yujn.cn/api/zzxjj.php",videoTypes:{type1:"http://www.yujn.cn/api/zzxjj.php",type2:"http://www.yujn.cn/api/yuzu.php",type3:"http://www.yujn.cn/api/tianmei.php",type4:"http://www.yujn.cn/api/jksp.php",type5:"http://www.yujn.cn/api/ndym.php",type6:"http://www.yujn.cn/api/sbkl.php",type7:"http://www.yujn.cn/api/rewu.php",type8:"http://www.yujn.cn/api/luoli.php",type9:"http://www.yujn.cn/api/manhuay.php",type10:"http://www.yujn.cn/api/tianmei.php",type11:"http://www.yujn.cn/api/hanfu.php",type12:"http://www.yujn.cn/api/manyao.php",type13:"http://www.yujn.cn/api/diaodai.php",type14:"http://www.yujn.cn/api/qingchun.php",type15:"http://www.yujn.cn/api/COS.php",type16:"http://www.yujn.cn/api/nvgao.php",type17:"http://www.yujn.cn/api/jiepai.php",type18:"http://www.yujn.cn/api/ksbianzhuang.php",type19:"http://www.yujn.cn/api/wmsc.php",type20:"http://www.yujn.cn/api/shwd.php",type21:"http://www.yujn.cn/api/chuanda.php",type22:"http://www.yujn.cn/api/dmsp.php"}}},methods:{selectVideoType(t){this.videoUrl=this.videoTypes[t.target.value],this.togglePower()},togglePower(){const t=this.$refs.videoPlayer;t.style.display==="none"||t.style.display===""?(t.style.display="block",t.src=`${this.videoUrl}?t=${new Date().getTime()}`,t.play()):(t.pause(),t.style.display="none")},switchVideo(){const t=this.$refs.videoPlayer;t.style.display==="block"&&(t.src=`${this.videoUrl}?t=${new Date().getTime()}`,t.play())}}},u={class:"container"},h={class:"tv"},c={ref:"videoPlayer",controls:""},v={class:"buttons"},r=d('<option value="type1" data-v-340908ab>小姐姐视频</option><option value="type2" data-v-340908ab>玉足美腿</option><option value="type3" data-v-340908ab>甜妹系列</option><option value="type4" data-v-340908ab>jk洛丽塔</option><option value="type5" data-v-340908ab>你的欲梦</option><option value="type6" data-v-340908ab>双倍快乐</option><option value="type7" data-v-340908ab>热舞系列</option><option value="type8" data-v-340908ab>萝莉系列</option><option value="type9" data-v-340908ab>漫画芋</option><option value="type10" data-v-340908ab>蛇姐系列</option><option value="type11" data-v-340908ab>汉服系列</option><option value="type12" data-v-340908ab>慢摇系列</option><option value="type13" data-v-340908ab>吊带系列</option><option value="type14" data-v-340908ab>清纯系列</option><option value="type15" data-v-340908ab>COS系列</option><option value="type16" data-v-340908ab>纯情女高</option><option value="type17" data-v-340908ab>街拍系列</option><option value="type18" data-v-340908ab>变装系列</option><option value="type19" data-v-340908ab>完美身材</option><option value="type20" data-v-340908ab>丝滑舞蹈</option><option value="type21" data-v-340908ab>穿搭系列</option><option value="type22" data-v-340908ab>动漫系列</option>',22),_=[r];function b(t,p,y,g,f,e){return n(),i("div",u,[a("div",h,[a("video",c,null,512)]),a("div",v,[a("select",{onChange:p[0]||(p[0]=(...o)=>e.selectVideoType&&e.selectVideoType(...o))},_,32),a("button",{onClick:p[1]||(p[1]=(...o)=>e.togglePower&&e.togglePower(...o))},"开关"),a("button",{onClick:p[2]||(p[2]=(...o)=>e.switchVideo&&e.switchVideo(...o))},"切换")])])}const j=s(l,[["render",b],["__scopeId","data-v-340908ab"]]),T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"column/other/index.md","filePath":"column/other/index.md"}'),m={name:"column/other/index.md"},V=Object.assign(m,{setup(t){return(p,y)=>(n(),i("div",null,[w(j)]))}});export{T as __pageData,V as default};