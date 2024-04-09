import{_ as s,c as i,o as a,a2 as n}from"./chunks/framework.D3nF4eGI.js";const y=JSON.parse('{"title":"Docker-Compose","description":"","frontmatter":{},"headers":[],"relativePath":"column/docker/dockercompose.md","filePath":"column/docker/dockercompose.md"}'),e={name:"column/docker/dockercompose.md"},p=n(`<h1 id="docker-compose" tabindex="-1">Docker-Compose <a class="header-anchor" href="#docker-compose" aria-label="Permalink to &quot;Docker-Compose&quot;">​</a></h1><h2 id="_1-下载docker-compose" tabindex="-1">1.下载Docker-Compose <a class="header-anchor" href="#_1-下载docker-compose" aria-label="Permalink to &quot;1.下载Docker-Compose&quot;">​</a></h2><p>去github官网搜索docker-compose，下载自己需要的版本的Docker-Compose <a href="https://github.com/docker/compose/releases" target="_blank" rel="noreferrer">https://github.com/docker/compose/releases</a><img src="https://pic.imgdb.cn/item/6613688568eb9357137a54e3.png" alt="图片"> （直接命令联网下载curl可能会导致下载文件不全导致报错，建议用这种方法）</p><h2 id="_2-设置权限" tabindex="-1">2.设置权限 <a class="header-anchor" href="#_2-设置权限" aria-label="Permalink to &quot;2.设置权限&quot;">​</a></h2><div class="language-powershell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">powershell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#放入/usr/local/bin/ 路径下并重新命名添加可执行权限</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mv docker</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">compose</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">linux</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">x86_64 docker</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">compose</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">chmod </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">x docker</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">compose</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#查看版本是否成功</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">docker</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">compose </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">v</span></span></code></pre></div><p><img src="https://pic.imgdb.cn/item/6613692968eb9357137b8169.png" alt="图"></p><h2 id="_3-配置环境变量-成功忽略-没成功继续" tabindex="-1">3.配置环境变量（成功忽略，没成功继续） <a class="header-anchor" href="#_3-配置环境变量-成功忽略-没成功继续" aria-label="Permalink to &quot;3.配置环境变量（成功忽略，没成功继续）&quot;">​</a></h2><div class="language-powershell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">powershell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#-v成功就不用以下操作了</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">vi </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">etc</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">profile</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 添加内容： export PATH=$JAVA_HOME:/usr/local/bin:$PATH</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">source </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">etc</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">profile</span></span></code></pre></div><h2 id="_4-docker-compose基本命令" tabindex="-1">4.docker-compose基本命令 <a class="header-anchor" href="#_4-docker-compose基本命令" aria-label="Permalink to &quot;4.docker-compose基本命令&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 1. 基于docker-compose.yml启动管理的容器</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker-compose</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> up</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 2. 关闭并删除容器</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker-compose</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> down</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 3. 开启|关闭|重启已经存在的由docker-compose维护的容器</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker-compose</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> start</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stop</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">restart</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 4. 查看由docker-compose管理的容器</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker-compose</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ps</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 5. 查看日志</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker-compose</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> logs</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span></span></code></pre></div><p>在使用docker-compose的命令时 ，默认会在当前目录下找docker-compose.yml文件</p><h2 id="_5-docker-compose启动mysql" tabindex="-1">5.docker-compose启动mysql <a class="header-anchor" href="#_5-docker-compose启动mysql" aria-label="Permalink to &quot;5.docker-compose启动mysql&quot;">​</a></h2><p>首先编写docker-compose.yml文件</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">version:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;3.1&#39;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">services:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  mysql:</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">           # 服务的名称</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    restart:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> always</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   # 代表只要docker启动，那么这个容器就跟着一起启动</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    image:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> mysql:8.0</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # 指定镜像路径</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    container_name:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> mysql</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # 指定容器名称</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ports:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">      -</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 3306:3306</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   #  指定端口号的映射</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    environment:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">      MYSQL_ROOT_PASSWORD:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 123456</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 指定MySQL的ROOT用户登录密码</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">      TZ:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Asia/Shanghai</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # 指定时区</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    volumes:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     -</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /opt/docker_compose_data/mysql:/var/lib/mysql</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   # 映射数据卷 宿主机：容器</span></span></code></pre></div><p>在当前目录下 docker-compose up -d</p>`,15),l=[p];function h(k,t,o,r,c,d){return a(),i("div",null,l)}const F=s(e,[["render",h]]);export{y as __pageData,F as default};
