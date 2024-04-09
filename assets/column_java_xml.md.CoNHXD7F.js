import{_ as s,c as a,o as i,a2 as n}from"./chunks/framework.D3nF4eGI.js";const m=JSON.parse('{"title":"xml模版","description":"","frontmatter":{},"headers":[],"relativePath":"column/java/xml.md","filePath":"column/java/xml.md"}'),t={name:"column/java/xml.md"},l=n(`<h1 id="xml模版" tabindex="-1">xml模版 <a class="header-anchor" href="#xml模版" aria-label="Permalink to &quot;xml模版&quot;">​</a></h1><h2 id="_1-打开设置" tabindex="-1">1.打开设置 <a class="header-anchor" href="#_1-打开设置" aria-label="Permalink to &quot;1.打开设置&quot;">​</a></h2><p>file-setting-Editor-File And Templates <img src="https://pic.imgdb.cn/item/6613763168eb935713969e77.png" alt="1"></p><h2 id="_2-新建xml" tabindex="-1">2.新建xml <a class="header-anchor" href="#_2-新建xml" aria-label="Permalink to &quot;2.新建xml&quot;">​</a></h2><p>name看需要设置，extension必须xml <img src="https://pic.imgdb.cn/item/6613764f68eb93571396d833.png" alt="2"> 模版：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">xml version=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> encoding=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;UTF-8&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;!</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">DOCTYPE</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> mapper</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> PUBLIC</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;-//mybatis.org//DTD Mapper 3.0//EN&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;http://mybatis.org/dtd/mybatis-3-mapper.dtd&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mapper namespace=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/mapper</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span></code></pre></div><h2 id="_3-新建文件注释自动生成" tabindex="-1">3.新建文件注释自动生成 <a class="header-anchor" href="#_3-新建文件注释自动生成" aria-label="Permalink to &quot;3.新建文件注释自动生成&quot;">​</a></h2><p><img src="https://pic.imgdb.cn/item/6613766b68eb9357139708bb.png" alt="3"> 常用的模版：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * @Author \${USER}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * @create \${DATE} \${TIME}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * Created by \${USER} on \${DATE}.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * Created by IntelliJ IDEA.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * User: \${USER}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * Date: \${DATE}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">按需设置就好</span></span></code></pre></div>`,9),p=[l];function e(h,k,r,d,c,o){return i(),a("div",null,p)}const E=s(t,[["render",e]]);export{m as __pageData,E as default};
