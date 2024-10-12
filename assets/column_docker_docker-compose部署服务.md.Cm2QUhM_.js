import{_ as s,c as i,o as a,a2 as n}from"./chunks/framework.DgWzJD9P.js";const y=JSON.parse('{"title":"1、docker-compose部署kafka","description":"","frontmatter":{},"headers":[],"relativePath":"column/docker/docker-compose部署服务.md","filePath":"column/docker/docker-compose部署服务.md"}'),k={name:"column/docker/docker-compose部署服务.md"},p=n(`<h1 id="_1、docker-compose部署kafka" tabindex="-1">1、docker-compose部署kafka <a class="header-anchor" href="#_1、docker-compose部署kafka" aria-label="Permalink to &quot;1、docker-compose部署kafka&quot;">​</a></h1><p>新建docker-compose文件</p><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">version</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;3.1&#39;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">services</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  zookepper</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    image</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">zookeeper</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                                 # 原镜像\`zookeeper\`</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    hostname</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;zookeeper.local&quot;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    container_name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">zookeeper</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                        # 容器名为&#39;zookeeper&#39;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    restart</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">unless-stopped</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                                  # 指定容器退出后的重启策略为始终重启，但是不考虑在Docker守护进程启动时就已经停止了的容器</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    ports</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:                                           </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 映射端口</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2181:2181&quot;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    networks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:                                        </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 设置网络别名</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      local</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        aliases</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;zookeeper.local&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  kafka</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    image</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">wurstmeister/kafka</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                                # 原镜像\`wurstmeister/kafka\`</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    hostname</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;kafka.local&quot;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    container_name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">kafka</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                                    # 容器名为&#39;kafka&#39;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    restart</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">unless-stopped</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                                          # 指定容器退出后的重启策略为始终重启，但是不考虑在Docker守护进程启动时就已经停止了的容器</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    environment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:                                                       </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 设置环境变量,相当于docker run命令中的-e</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      KAFKA_ADVERTISED_HOST_NAME</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">kafka.local</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                          # 本机IP</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      KAFKA_ADVERTISED_PORT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9092</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                                      # 端口</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      KAFKA_BROKER_ID</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                                               # 在kafka集群中，每个kafka都有一个BROKER_ID来区分自己</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      KAFKA_ADVERTISED_LISTENERS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">PLAINTEXT://todo:9092</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">               # TODO 将kafka的地址端口注册给zookeeper</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      KAFKA_LISTENERS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">PLAINTEXT://:9092</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                        # 配置kafka的监听端口</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      KAFKA_ZOOKEEPER_CONNECT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">todo:2181</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                          # TODO zookeeper地址</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      KAFKA_CREATE_TOPICS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;hello_world&quot;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    ports</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:                              </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 映射端口</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;9092:9092&quot;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    networks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:                           </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 设置网络别名</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      local</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        aliases</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;kafka.local&quot;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    depends_on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:                         </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 解决容器依赖启动先后问题</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">zookepper</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 设置网络，名为local</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">networks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  local</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    driver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">bridge</span></span></code></pre></div><p>在当前yml文件下运行 docker-compose up -d 即可</p>`,4),l=[p];function h(t,e,E,r,d,o){return a(),i("div",null,l)}const c=s(k,[["render",h]]);export{y as __pageData,c as default};
