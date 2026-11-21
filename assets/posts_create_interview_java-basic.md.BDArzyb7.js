import{_ as s,o as n,c as e,a3 as p}from"./chunks/framework.DUoqtJWi.js";const h=JSON.parse('{"title":"Java 基础","description":"面向对象、泛型、注解、异常、反射与 SPI，把 Java 语法层面的高频考点过一遍。","frontmatter":{"title":"Java 基础","description":"面向对象、泛型、注解、异常、反射与 SPI，把 Java 语法层面的高频考点过一遍。","date":"2026-11-20T00:00:00.000Z","category":"匠心造物","subCategory":"Java 面试","tags":["面试","Java"],"author":"闲生"},"headers":[],"relativePath":"posts/create/interview/java-basic.md","filePath":"posts/create/interview/java-basic.md"}'),l={name:"posts/create/interview/java-basic.md"};function i(t,a,c,o,r,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="java-基础" tabindex="-1">Java 基础 <a class="header-anchor" href="#java-基础" aria-label="Permalink to &quot;Java 基础&quot;">​</a></h1><blockquote><p>Java基础部分，包括语法基础，泛型，注解，异常，反射和其它（如SPI机制等）。</p></blockquote><h2 id="语法基础" tabindex="-1">语法基础 <a class="header-anchor" href="#语法基础" aria-label="Permalink to &quot;语法基础&quot;">​</a></h2><h3 id="面向对象特性" tabindex="-1">面向对象特性？ <a class="header-anchor" href="#面向对象特性" aria-label="Permalink to &quot;面向对象特性？&quot;">​</a></h3><ul><li><strong>封装</strong></li></ul><p>利用抽象数据类型将数据和基于数据的操作封装在一起，使其构成一个不可分割的独立实体。数据被保护在抽象数据类型的内部，尽可能地隐藏内部的细节，只保留一些对外接口使之与外部发生联系。用户无需知道对象内部的细节，但可以通过对象对外提供的接口来访问该对象。</p><p>优点:</p><ul><li>减少耦合: 可以独立地开发、测试、优化、使用、理解和修改</li><li>减轻维护的负担: 可以更容易被程序员理解，并且在调试的时候可以不影响其他模块</li><li>有效地调节性能: 可以通过剖析确定哪些模块影响了系统的性能</li><li>提高软件的可重用性</li><li>降低了构建大型系统的风险: 即使整个系统不可用，但是这些独立的模块却有可能是可用的</li></ul><p>以下 Person 类封装 name、gender、age 等属性，外界只能通过 get() 方法获取一个 Person 对象的 name 属性和 gender 属性，而无法获取 age 属性，但是 age 属性可以供 work() 方法使用。</p><p>注意到 gender 属性使用 int 数据类型进行存储，封装使得用户注意不到这种实现细节。并且在需要修改 gender 属性使用的数据类型时，也可以在不影响客户端代码的情况下进行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>public class Person {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>    private int gender;</span></span>
<span class="line"><span>    private int age;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName() {</span></span>
<span class="line"><span>        return name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getGender() {</span></span>
<span class="line"><span>        return gender == 0 ? &quot;man&quot; : &quot;woman&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void work() {</span></span>
<span class="line"><span>        if (18 &lt;= age &amp;&amp; age &lt;= 50) {</span></span>
<span class="line"><span>            System.out.println(name + &quot; is working very hard!&quot;);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            System.out.println(name + &quot; can&#39;t work any more!&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>继承</strong></li></ul><p>继承实现了 <strong>IS-A</strong> 关系，例如 Cat 和 Animal 就是一种 IS-A 关系，因此 Cat 可以继承自 Animal，从而获得 Animal 非 private 的属性和方法。</p><p>继承应该遵循里氏替换原则，子类对象必须能够替换掉所有父类对象。</p><p>Cat 可以当做 Animal 来使用，也就是说可以使用 Animal 引用 Cat 对象。父类引用指向子类对象称为 <strong>向上转型</strong> 。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>Animal animal = new Cat();</span></span></code></pre></div><ul><li><strong>多态</strong></li></ul><p>多态分为编译时多态和运行时多态:</p><ul><li>编译时多态主要指方法的重载</li><li>运行时多态指程序中定义的对象引用所指向的具体类型在运行期间才确定</li></ul><p>运行时多态有三个条件:</p><ul><li>继承</li><li>覆盖(重写)</li><li>向上转型</li></ul><p>下面的代码中，乐器类(Instrument)有两个子类: Wind 和 Percussion，它们都覆盖了父类的 play() 方法，并且在 main() 方法中使用父类 Instrument 来引用 Wind 和 Percussion 对象。在 Instrument 引用调用 play() 方法时，会执行实际引用对象所在类的 play() 方法，而不是 Instrument 类的方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>public class Instrument {</span></span>
<span class="line"><span>    public void play() {</span></span>
<span class="line"><span>        System.out.println(&quot;Instrument is playing...&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Wind extends Instrument {</span></span>
<span class="line"><span>    public void play() {</span></span>
<span class="line"><span>        System.out.println(&quot;Wind is playing...&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Percussion extends Instrument {</span></span>
<span class="line"><span>    public void play() {</span></span>
<span class="line"><span>        System.out.println(&quot;Percussion is playing...&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Music {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        List&lt;Instrument&gt; instruments = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        instruments.add(new Wind());</span></span>
<span class="line"><span>        instruments.add(new Percussion());</span></span>
<span class="line"><span>        for(Instrument instrument : instruments) {</span></span>
<span class="line"><span>            instrument.play();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="a-a-b-与-a-b-的区别" tabindex="-1">a = a + b 与 a += b 的区别 <a class="header-anchor" href="#a-a-b-与-a-b-的区别" aria-label="Permalink to &quot;a = a + b 与 a += b 的区别&quot;">​</a></h3><p>+= 隐式的将加操作的结果类型强制转换为持有结果的类型。如果两个整型相加，如 byte、short 或者 int，首先会将它们提升到 int 类型，然后在执行加法操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>byte a = 127;</span></span>
<span class="line"><span>byte b = 127;</span></span>
<span class="line"><span>b = a + b; // error : cannot convert from int to byte</span></span>
<span class="line"><span>b += a; // ok</span></span></code></pre></div><p>(因为 a+b 操作会将 a、b 提升为 int 类型，所以将 int 类型赋值给 byte 就会编译出错)</p><h3 id="_3-0-1-0-3-将会返回什么-true-还是-false" tabindex="-1">3*0.1 == 0.3 将会返回什么? true 还是 false? <a class="header-anchor" href="#_3-0-1-0-3-将会返回什么-true-还是-false" aria-label="Permalink to &quot;3\\*0.1 == 0.3 将会返回什么? true 还是 false?&quot;">​</a></h3><p>false，因为有些浮点数不能完全精确的表示出来。</p><h3 id="能在-switch-中使用-string-吗" tabindex="-1">能在 Switch 中使用 String 吗? <a class="header-anchor" href="#能在-switch-中使用-string-吗" aria-label="Permalink to &quot;能在 Switch 中使用 String 吗?&quot;">​</a></h3><p>从 Java 7 开始，我们可以在 switch case 中使用字符串，但这仅仅是一个语法糖。内部实现在 switch 中使用字符串的 hash code。</p><h3 id="对equals-和hashcode-的理解" tabindex="-1">对equals()和hashCode()的理解? <a class="header-anchor" href="#对equals-和hashcode-的理解" aria-label="Permalink to &quot;对equals()和hashCode()的理解?&quot;">​</a></h3><ul><li><strong>为什么在重写 equals 方法的时候需要重写 hashCode 方法</strong>?</li></ul><p>因为有强制的规范指定需要同时重写 hashcode 与 equals 是方法，许多容器类，如 HashMap、HashSet 都依赖于 hashcode 与 equals 的规定。</p><ul><li><strong>有没有可能两个不相等的对象有相同的 hashcode</strong>?</li></ul><p>有可能，两个不相等的对象可能会有相同的 hashcode 值，这就是为什么在 hashmap 中会有冲突。相等 hashcode 值的规定只是说如果两个对象相等，必须有相同的hashcode 值，但是没有关于不相等对象的任何规定。</p><ul><li><strong>两个相同的对象会有不同的 hash code 吗</strong>?</li></ul><p>不能，根据 hash code 的规定，这是不可能的。</p><h3 id="final、finalize-和-finally-的不同之处" tabindex="-1">final、finalize 和 finally 的不同之处? <a class="header-anchor" href="#final、finalize-和-finally-的不同之处" aria-label="Permalink to &quot;final、finalize 和 finally 的不同之处?&quot;">​</a></h3><ul><li>final 是一个修饰符，可以修饰变量、方法和类。如果 final 修饰变量，意味着该变量的值在初始化后不能被改变。</li><li>Java 技术允许使用 finalize() 方法在垃圾收集器将对象从内存中清除出去之前做必要的清理工作。这个方法是由垃圾收集器在确定这个对象没有被引用时对这个对象调用的，但是什么时候调用 finalize 没有保证。</li><li>finally 是一个关键字，与 try 和 catch 一起用于异常的处理。finally 块一定会被执行，无论在 try 块中是否有发生异常。</li></ul><h3 id="string、stringbuffer与stringbuilder的区别" tabindex="-1">String、StringBuffer与StringBuilder的区别？ <a class="header-anchor" href="#string、stringbuffer与stringbuilder的区别" aria-label="Permalink to &quot;String、StringBuffer与StringBuilder的区别？&quot;">​</a></h3><p>第一点: 可变和适用范围。String对象是不可变的，而StringBuffer和StringBuilder是可变字符序列。每次对String的操作相当于生成一个新的String对象，而对StringBuffer和StringBuilder的操作是对对象本身的操作，而不会生成新的对象，所以对于频繁改变内容的字符串避免使用String，因为频繁的生成对象将会对系统性能产生影响。</p><p>第二点: 线程安全。String由于有final修饰，是immutable的，安全性是简单而纯粹的。StringBuilder和StringBuffer的区别在于StringBuilder不保证同步，也就是说如果需要线程安全需要使用StringBuffer，不需要同步的StringBuilder效率更高。</p><h3 id="接口与抽象类的区别" tabindex="-1">接口与抽象类的区别？ <a class="header-anchor" href="#接口与抽象类的区别" aria-label="Permalink to &quot;接口与抽象类的区别？&quot;">​</a></h3><ul><li>一个子类只能继承一个抽象类, 但能实现多个接口</li><li>抽象类可以有构造方法, 接口没有构造方法</li><li>抽象类可以有普通成员变量, 接口没有普通成员变量</li><li>抽象类和接口都可有静态成员变量, 抽象类中静态成员变量访问类型任意，接口只能public static final(默认)</li><li>抽象类可以没有抽象方法, 抽象类可以有普通方法；接口在JDK8之前都是抽象方法，在JDK8可以有default方法，在JDK9中允许有私有普通方法</li><li>抽象类可以有静态方法；接口在JDK8之前不能有静态方法，在JDK8中可以有静态方法，且只能被接口类直接调用（不能被实现类的对象调用）</li><li>抽象类中的方法可以是public、protected; 接口方法在JDK8之前只有public abstract，在JDK8可以有default方法，在JDK9中允许有private方法</li></ul><h3 id="this-super-在构造方法中的区别" tabindex="-1">this() &amp; super()在构造方法中的区别？ <a class="header-anchor" href="#this-super-在构造方法中的区别" aria-label="Permalink to &quot;this() &amp; super()在构造方法中的区别？&quot;">​</a></h3><ul><li>调用super()必须写在子类构造方法的第一行, 否则编译不通过</li><li>super从子类调用父类构造, this在同一类中调用其他构造均需要放在第一行</li><li>尽管可以用this调用一个构造器, 却不能调用2个</li><li>this和super不能出现在同一个构造器中, 否则编译不通过</li><li>this()、super()都指的对象,不可以在static环境中使用</li><li>本质this指向本对象的指针。super是一个关键字</li></ul><h3 id="java移位运算符" tabindex="-1">Java移位运算符？ <a class="header-anchor" href="#java移位运算符" aria-label="Permalink to &quot;Java移位运算符？&quot;">​</a></h3><p>java中有三种移位运算符</p><ul><li><code>&lt;&lt;</code> :左移运算符,<code>x &lt;&lt; 1</code>,相当于x乘以2(不溢出的情况下),低位补0</li><li><code>&gt;&gt;</code> :带符号右移,<code>x &gt;&gt; 1</code>,相当于x除以2,正数高位补0,负数高位补1</li><li><code>&gt;&gt;&gt;</code> :无符号右移,忽略符号位,空位都以0补齐</li></ul><h2 id="泛型" tabindex="-1">泛型 <a class="header-anchor" href="#泛型" aria-label="Permalink to &quot;泛型&quot;">​</a></h2><h3 id="为什么需要泛型" tabindex="-1">为什么需要泛型？ <a class="header-anchor" href="#为什么需要泛型" aria-label="Permalink to &quot;为什么需要泛型？&quot;">​</a></h3><ol><li><strong>适用于多种数据类型执行相同的代码</strong></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>private static int add(int a, int b) {</span></span>
<span class="line"><span>    System.out.println(a + &quot;+&quot; + b + &quot;=&quot; + (a + b));</span></span>
<span class="line"><span>    return a + b;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static float add(float a, float b) {</span></span>
<span class="line"><span>    System.out.println(a + &quot;+&quot; + b + &quot;=&quot; + (a + b));</span></span>
<span class="line"><span>    return a + b;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static double add(double a, double b) {</span></span>
<span class="line"><span>    System.out.println(a + &quot;+&quot; + b + &quot;=&quot; + (a + b));</span></span>
<span class="line"><span>    return a + b;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果没有泛型，要实现不同类型的加法，每种类型都需要重载一个add方法；通过泛型，我们可以复用为一个方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>private static &lt;T extends Number&gt; double add(T a, T b) {</span></span>
<span class="line"><span>    System.out.println(a + &quot;+&quot; + b + &quot;=&quot; + (a.doubleValue() + b.doubleValue()));</span></span>
<span class="line"><span>    return a.doubleValue() + b.doubleValue();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>泛型中的类型在使用时指定，不需要强制类型转换</strong>（<strong>类型安全</strong>，编译器会<strong>检查类型</strong>）</li></ul><p>看下这个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>List list = new ArrayList();</span></span>
<span class="line"><span>list.add(&quot;xxString&quot;);</span></span>
<span class="line"><span>list.add(100d);</span></span>
<span class="line"><span>list.add(new Person());</span></span></code></pre></div><p>我们在使用上述list中，list中的元素都是Object类型（无法约束其中的类型），所以在取出集合元素时需要人为的强制类型转化到具体的目标类型，且很容易出现<code>java.lang.ClassCastException</code>异常。</p><p>引入泛型，它将提供类型的约束，提供编译前的检查：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;String&gt; list = new ArrayList&lt;String&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// list中只能放String, 不能放其它类型的元素</span></span></code></pre></div><h3 id="泛型类如何定义使用" tabindex="-1">泛型类如何定义使用？ <a class="header-anchor" href="#泛型类如何定义使用" aria-label="Permalink to &quot;泛型类如何定义使用？&quot;">​</a></h3><ul><li>从一个简单的泛型类看起：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>class Point&lt;T&gt;{         // 此处可以随便写标识符号，T是type的简称  </span></span>
<span class="line"><span>    private T var ;     // var的类型由T指定，即：由外部指定  </span></span>
<span class="line"><span>    public T getVar(){  // 返回值的类型由外部决定  </span></span>
<span class="line"><span>        return var ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public void setVar(T var){  // 设置的类型也由外部决定  </span></span>
<span class="line"><span>        this.var = var ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>public class GenericsDemo06{  </span></span>
<span class="line"><span>    public static void main(String args[]){  </span></span>
<span class="line"><span>        Point&lt;String&gt; p = new Point&lt;String&gt;() ;     // 里面的var类型为String类型  </span></span>
<span class="line"><span>        p.setVar(&quot;it&quot;) ;                            // 设置字符串  </span></span>
<span class="line"><span>        System.out.println(p.getVar().length()) ;   // 取得字符串的长度  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>多元泛型</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>class Notepad&lt;K,V&gt;{       // 此处指定了两个泛型类型  </span></span>
<span class="line"><span>    private K key ;     // 此变量的类型由外部决定  </span></span>
<span class="line"><span>    private V value ;   // 此变量的类型由外部决定  </span></span>
<span class="line"><span>    public K getKey(){  </span></span>
<span class="line"><span>        return this.key ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public V getValue(){  </span></span>
<span class="line"><span>        return this.value ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public void setKey(K key){  </span></span>
<span class="line"><span>        this.key = key ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public void setValue(V value){  </span></span>
<span class="line"><span>        this.value = value ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>} </span></span>
<span class="line"><span>public class GenericsDemo09{  </span></span>
<span class="line"><span>    public static void main(String args[]){  </span></span>
<span class="line"><span>        Notepad&lt;String,Integer&gt; t = null ;        // 定义两个泛型类型的对象  </span></span>
<span class="line"><span>        t = new Notepad&lt;String,Integer&gt;() ;       // 里面的key为String，value为Integer  </span></span>
<span class="line"><span>        t.setKey(&quot;汤姆&quot;) ;        // 设置第一个内容  </span></span>
<span class="line"><span>        t.setValue(20) ;            // 设置第二个内容  </span></span>
<span class="line"><span>        System.out.print(&quot;姓名；&quot; + t.getKey()) ;      // 取得信息  </span></span>
<span class="line"><span>        System.out.print(&quot;，年龄；&quot; + t.getValue()) ;       // 取得信息  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="泛型接口如何定义使用" tabindex="-1">泛型接口如何定义使用？ <a class="header-anchor" href="#泛型接口如何定义使用" aria-label="Permalink to &quot;泛型接口如何定义使用？&quot;">​</a></h3><ul><li>简单的泛型接口</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>interface Info&lt;T&gt;{        // 在接口上定义泛型  </span></span>
<span class="line"><span>    public T getVar() ; // 定义抽象方法，抽象方法的返回值就是泛型类型  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>class InfoImpl&lt;T&gt; implements Info&lt;T&gt;{   // 定义泛型接口的子类  </span></span>
<span class="line"><span>    private T var ;             // 定义属性  </span></span>
<span class="line"><span>    public InfoImpl(T var){     // 通过构造方法设置属性内容  </span></span>
<span class="line"><span>        this.setVar(var) ;    </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public void setVar(T var){  </span></span>
<span class="line"><span>        this.var = var ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public T getVar(){  </span></span>
<span class="line"><span>        return this.var ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>} </span></span>
<span class="line"><span>public class GenericsDemo24{  </span></span>
<span class="line"><span>    public static void main(String arsg[]){  </span></span>
<span class="line"><span>        Info&lt;String&gt; i = null;        // 声明接口对象  </span></span>
<span class="line"><span>        i = new InfoImpl&lt;String&gt;(&quot;汤姆&quot;) ;  // 通过子类实例化对象  </span></span>
<span class="line"><span>        System.out.println(&quot;内容：&quot; + i.getVar()) ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="泛型方法如何定义使用" tabindex="-1">泛型方法如何定义使用？ <a class="header-anchor" href="#泛型方法如何定义使用" aria-label="Permalink to &quot;泛型方法如何定义使用？&quot;">​</a></h3><p>泛型方法，是在调用方法的时候指明泛型的具体类型。</p><ul><li>定义泛型方法语法格式</li></ul><p><img src="https://cdn.jsdelivr.net/gh/jokerxian/pic/pics/08a648c40e.png" alt=""></p><ul><li>调用泛型方法语法格式</li></ul><p><img src="https://cdn.jsdelivr.net/gh/jokerxian/pic/pics/1e292fdded.png" alt=""></p><p>说明一下，定义泛型方法时，必须在返回值前边加一个<code>&lt;T&gt;</code>，来声明这是一个泛型方法，持有一个泛型<code>T</code>，然后才可以用泛型T作为方法的返回值。</p><p><code>Class&lt;T&gt;</code>的作用就是指明泛型的具体类型，而<code>Class&lt;T&gt;</code>类型的变量c，可以用来创建泛型类的对象。</p><p>为什么要用变量c来创建对象呢？既然是泛型方法，就代表着我们不知道具体的类型是什么，也不知道构造方法如何，因此没有办法去new一个对象，但可以利用变量c的newInstance方法去创建对象，也就是利用反射创建对象。</p><p>泛型方法要求的参数是<code>Class&lt;T&gt;</code>类型，而<code>Class.forName()</code>方法的返回值也是<code>Class&lt;T&gt;</code>，因此可以用<code>Class.forName()</code>作为参数。其中，<code>forName()</code>方法中的参数是何种类型，返回的<code>Class&lt;T&gt;</code>就是何种类型。在本例中，<code>forName()</code>方法中传入的是User类的完整路径，因此返回的是<code>Class&lt;User&gt;</code>类型的对象，因此调用泛型方法时，变量c的类型就是<code>Class&lt;User&gt;</code>，因此泛型方法中的泛型T就被指明为User，因此变量obj的类型为User。</p><p>当然，泛型方法不是仅仅可以有一个参数<code>Class&lt;T&gt;</code>，可以根据需要添加其他参数。</p><p><strong>为什么要使用泛型方法呢</strong>？因为泛型类要在实例化的时候就指明类型，如果想换一种类型，不得不重新new一次，可能不够灵活；而泛型方法可以在调用的时候指明类型，更加灵活。</p><h3 id="泛型的上限和下限" tabindex="-1">泛型的上限和下限？ <a class="header-anchor" href="#泛型的上限和下限" aria-label="Permalink to &quot;泛型的上限和下限？&quot;">​</a></h3><p>在使用泛型的时候，我们可以为传入的泛型类型实参进行上下边界的限制，如：类型实参只准传入某种类型的父类或某种类型的子类。</p><p>上限</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>class Info&lt;T extends Number&gt;{    // 此处泛型只能是数字类型</span></span>
<span class="line"><span>    private T var ;        // 定义泛型变量</span></span>
<span class="line"><span>    public void setVar(T var){</span></span>
<span class="line"><span>        this.var = var ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public T getVar(){</span></span>
<span class="line"><span>        return this.var ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public String toString(){    // 直接打印</span></span>
<span class="line"><span>        return this.var.toString() ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class demo1{</span></span>
<span class="line"><span>    public static void main(String args[]){</span></span>
<span class="line"><span>        Info&lt;Integer&gt; i1 = new Info&lt;Integer&gt;() ;        // 声明Integer的泛型对象</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下限</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>class Info&lt;T&gt;{</span></span>
<span class="line"><span>    private T var ;        // 定义泛型变量</span></span>
<span class="line"><span>    public void setVar(T var){</span></span>
<span class="line"><span>        this.var = var ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public T getVar(){</span></span>
<span class="line"><span>        return this.var ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public String toString(){    // 直接打印</span></span>
<span class="line"><span>        return this.var.toString() ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class GenericsDemo21{</span></span>
<span class="line"><span>    public static void main(String args[]){</span></span>
<span class="line"><span>        Info&lt;String&gt; i1 = new Info&lt;String&gt;() ;        // 声明String的泛型对象</span></span>
<span class="line"><span>        Info&lt;Object&gt; i2 = new Info&lt;Object&gt;() ;        // 声明Object的泛型对象</span></span>
<span class="line"><span>        i1.setVar(&quot;hello&quot;) ;</span></span>
<span class="line"><span>        i2.setVar(new Object()) ;</span></span>
<span class="line"><span>        fun(i1) ;</span></span>
<span class="line"><span>        fun(i2) ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public static void fun(Info&lt;? super String&gt; temp){    // 只能接收String或Object类型的泛型，String类的父类只有Object类</span></span>
<span class="line"><span>        System.out.print(temp + &quot;, &quot;) ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="如何理解java中的泛型是伪泛型" tabindex="-1">如何理解Java中的泛型是伪泛型？ <a class="header-anchor" href="#如何理解java中的泛型是伪泛型" aria-label="Permalink to &quot;如何理解Java中的泛型是伪泛型？&quot;">​</a></h3><p>泛型中类型擦除 Java泛型这个特性是从JDK 1.5才开始加入的，因此为了兼容之前的版本，Java泛型的实现采取了“伪泛型”的策略，即Java在语法上支持泛型，但是在编译阶段会进行所谓的“类型擦除”（Type Erasure），将所有的泛型表示（尖括号中的内容）都替换为具体的类型（其对应的原生态类型），就像完全没有泛型一样。</p><h2 id="注解" tabindex="-1">注解 <a class="header-anchor" href="#注解" aria-label="Permalink to &quot;注解&quot;">​</a></h2><h3 id="注解的作用" tabindex="-1">注解的作用？ <a class="header-anchor" href="#注解的作用" aria-label="Permalink to &quot;注解的作用？&quot;">​</a></h3><p>注解是JDK1.5版本开始引入的一个特性，用于对代码进行说明，可以对包、类、接口、字段、方法参数、局部变量等进行注解。它主要的作用有以下四方面：</p><ul><li>生成文档，通过代码里标识的元数据生成javadoc文档。</li><li>编译检查，通过代码里标识的元数据让编译器在编译期间进行检查验证。</li><li>编译时动态处理，编译时通过代码里标识的元数据动态处理，例如动态生成代码。</li><li>运行时动态处理，运行时通过代码里标识的元数据动态处理，例如使用反射注入实例。</li></ul><h3 id="注解的常见分类" tabindex="-1">注解的常见分类？ <a class="header-anchor" href="#注解的常见分类" aria-label="Permalink to &quot;注解的常见分类？&quot;">​</a></h3><ul><li><strong>Java自带的标准注解</strong>，包括<code>@Override</code>、<code>@Deprecated</code>和<code>@SuppressWarnings</code>，分别用于标明重写某个方法、标明某个类或方法过时、标明要忽略的警告，用这些注解标明后编译器就会进行检查。</li><li><strong>元注解</strong>，元注解是用于定义注解的注解，包括<code>@Retention</code>、<code>@Target</code>、<code>@Inherited</code>、<code>@Documented</code><ul><li><code>@Retention</code>用于标明注解被保留的阶段</li><li><code>@Target</code>用于标明注解使用的范围</li><li><code>@Inherited</code>用于标明注解可继承</li><li><code>@Documented</code>用于标明是否生成javadoc文档</li></ul></li><li><strong>自定义注解</strong>，可以根据自己的需求定义注解，并可用元注解对自定义注解进行注解。</li></ul><h2 id="异常" tabindex="-1">异常 <a class="header-anchor" href="#异常" aria-label="Permalink to &quot;异常&quot;">​</a></h2><h3 id="java异常类层次结构" tabindex="-1">Java异常类层次结构? <a class="header-anchor" href="#java异常类层次结构" aria-label="Permalink to &quot;Java异常类层次结构?&quot;">​</a></h3><ul><li><strong>Throwable</strong> 是 Java 语言中所有错误与异常的超类。 <ul><li><strong>Error</strong> 类及其子类：程序中无法处理的错误，表示运行应用程序中出现了严重的错误。</li><li><strong>Exception</strong> 程序本身可以捕获并且可以处理的异常。Exception 这种异常又分为两类：运行时异常和编译时异常。</li></ul></li></ul><p><img src="https://cdn.jsdelivr.net/gh/jokerxian/pic/pics/dc76013096.png" alt=""></p><ul><li><strong>运行时异常</strong></li></ul><p>都是RuntimeException类及其子类异常，如NullPointerException(空指针异常)、IndexOutOfBoundsException(下标越界异常)等，这些异常是不检查异常，程序中可以选择捕获处理，也可以不处理。这些异常一般是由程序逻辑错误引起的，程序应该从逻辑角度尽可能避免这类异常的发生。</p><p>运行时异常的特点是Java编译器不会检查它，也就是说，当程序中可能出现这类异常，即使没有用try-catch语句捕获它，也没有用throws子句声明抛出它，也会编译通过。</p><ul><li><strong>非运行时异常</strong> （编译异常）</li></ul><p>是RuntimeException以外的异常，类型上都属于Exception类及其子类。从程序语法角度讲是必须进行处理的异常，如果不处理，程序就不能编译通过。如IOException、SQLException等以及用户自定义的Exception异常，一般情况下不自定义检查异常。</p><h3 id="可查的异常-checked-exceptions-和不可查的异常-unchecked-exceptions-区别" tabindex="-1">可查的异常（checked exceptions）和不可查的异常（unchecked exceptions）区别？ <a class="header-anchor" href="#可查的异常-checked-exceptions-和不可查的异常-unchecked-exceptions-区别" aria-label="Permalink to &quot;可查的异常（checked exceptions）和不可查的异常（unchecked exceptions）区别？&quot;">​</a></h3><ul><li><strong>可查异常</strong>（编译器要求必须处置的异常）：</li></ul><p>正确的程序在运行中，很容易出现的、情理可容的异常状况。可查异常虽然是异常状况，但在一定程度上它的发生是可以预计的，而且一旦发生这种异常状况，就必须采取某种方式进行处理。</p><p>除了RuntimeException及其子类以外，其他的Exception类及其子类都属于可查异常。这种异常的特点是Java编译器会检查它，也就是说，当程序中可能出现这类异常，要么用try-catch语句捕获它，要么用throws子句声明抛出它，否则编译不会通过。</p><ul><li><strong>不可查异常</strong>(编译器不要求强制处置的异常)</li></ul><p>包括运行时异常（RuntimeException与其子类）和错误（Error）。</p><h3 id="throw和throws的区别" tabindex="-1">throw和throws的区别？ <a class="header-anchor" href="#throw和throws的区别" aria-label="Permalink to &quot;throw和throws的区别？&quot;">​</a></h3><ul><li><strong>异常的申明(throws)</strong></li></ul><p>在Java中，当前执行的语句必属于某个方法，Java解释器调用main方法执行开始执行程序。若方法中存在检查异常，如果不对其捕获，那必须在方法头中显式声明该异常，以便于告知方法调用者此方法有异常，需要进行处理。 在方法中声明一个异常，方法头中使用关键字throws，后面接上要声明的异常。若声明多个异常，则使用逗号分割。如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>public static void method() throws IOException, FileNotFoundException{</span></span>
<span class="line"><span>    //something statements</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>异常的抛出(throw)</strong></li></ul><p>如果代码可能会引发某种错误，可以创建一个合适的异常类实例并抛出它，这就是抛出异常。如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>public static double method(int value) {</span></span>
<span class="line"><span>    if(value == 0) {</span></span>
<span class="line"><span>        throw new ArithmeticException(&quot;参数不能为0&quot;); //抛出一个运行时异常</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 5.0 / value;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="java-7-的-try-with-resource" tabindex="-1">Java 7 的 try-with-resource? <a class="header-anchor" href="#java-7-的-try-with-resource" aria-label="Permalink to &quot;Java 7 的 try-with-resource?&quot;">​</a></h3><p>如果你的资源实现了 AutoCloseable 接口，你可以使用这个语法。大多数的 Java 标准资源都继承了这个接口。当你在 try 子句中打开资源，资源会在 try 代码块执行后或异常处理后自动关闭。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>public void automaticallyCloseResource() {</span></span>
<span class="line"><span>    File file = new File(&quot;./tmp.txt&quot;);</span></span>
<span class="line"><span>    try (FileInputStream inputStream = new FileInputStream(file);) {</span></span>
<span class="line"><span>        // use the inputStream to read a file</span></span>
<span class="line"><span>    } catch (FileNotFoundException e) {</span></span>
<span class="line"><span>        log.error(e);</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>        log.error(e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="异常的底层" tabindex="-1">异常的底层？ <a class="header-anchor" href="#异常的底层" aria-label="Permalink to &quot;异常的底层？&quot;">​</a></h3><p>提到JVM处理异常的机制，就需要提及Exception Table，以下称为异常表。我们暂且不急于介绍异常表，先看一个简单的 Java 处理异常的小例子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>public static void simpleTryCatch() {</span></span>
<span class="line"><span>   try {</span></span>
<span class="line"><span>       testNPE();</span></span>
<span class="line"><span>   } catch (Exception e) {</span></span>
<span class="line"><span>       e.printStackTrace();</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用javap来分析这段代码（需要先使用javac编译）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>//javap -c Main</span></span>
<span class="line"><span> public static void simpleTryCatch();</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>       0: invokestatic  #3                  // Method testNPE:()V</span></span>
<span class="line"><span>       3: goto          11</span></span>
<span class="line"><span>       6: astore_0</span></span>
<span class="line"><span>       7: aload_0</span></span>
<span class="line"><span>       8: invokevirtual #5                  // Method java/lang/Exception.printStackTrace:()V</span></span>
<span class="line"><span>      11: return</span></span>
<span class="line"><span>    Exception table:</span></span>
<span class="line"><span>       from    to  target type</span></span>
<span class="line"><span>           0     3     6   Class java/lang/Exception</span></span></code></pre></div><p>看到上面的代码，应该会有会心一笑，因为终于看到了Exception table，也就是我们要研究的异常表。</p><p>异常表中包含了一个或多个异常处理者(Exception Handler)的信息，这些信息包含如下</p><ul><li><strong>from</strong> 可能发生异常的起始点</li><li><strong>to</strong> 可能发生异常的结束点</li><li><strong>target</strong> 上述from和to之前发生异常后的异常处理者的位置</li><li><strong>type</strong> 异常处理者处理的异常的类信息</li></ul><h2 id="反射" tabindex="-1">反射 <a class="header-anchor" href="#反射" aria-label="Permalink to &quot;反射&quot;">​</a></h2><h3 id="什么是反射" tabindex="-1">什么是反射？ <a class="header-anchor" href="#什么是反射" aria-label="Permalink to &quot;什么是反射？&quot;">​</a></h3><p>JAVA反射机制是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意一个方法和属性；这种动态获取的信息以及动态调用对象的方法的功能称为java语言的反射机制。</p><p><img src="https://cdn.jsdelivr.net/gh/jokerxian/pic/pics/c2b064c181.png" alt=""></p><h3 id="反射的使用" tabindex="-1">反射的使用？ <a class="header-anchor" href="#反射的使用" aria-label="Permalink to &quot;反射的使用？&quot;">​</a></h3><p>在Java中，Class类与java.lang.reflect类库一起对反射技术进行了全力的支持。在反射包中，我们常用的类主要有Constructor类表示的是Class 对象所表示的类的构造方法，利用它可以在运行时动态创建对象、Field表示Class对象所表示的类的成员变量，通过它可以在运行时动态修改成员变量的属性值(包含private)、Method表示Class对象所表示的类的成员方法，通过它可以动态调用对象的方法(包含private)</p><ul><li>Class类对象的获取</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void classTest() throws Exception {</span></span>
<span class="line"><span>        // 获取Class对象的三种方式</span></span>
<span class="line"><span>        logger.info(&quot;根据类名:  \\t&quot; + User.class);</span></span>
<span class="line"><span>        logger.info(&quot;根据对象:  \\t&quot; + new User().getClass());</span></span>
<span class="line"><span>        logger.info(&quot;根据全限定类名:\\t&quot; + Class.forName(&quot;com.test.User&quot;));</span></span>
<span class="line"><span>        // 常用的方法</span></span>
<span class="line"><span>        logger.info(&quot;获取全限定类名:\\t&quot; + userClass.getName());</span></span>
<span class="line"><span>        logger.info(&quot;获取类名:\\t&quot; + userClass.getSimpleName());</span></span>
<span class="line"><span>        logger.info(&quot;实例化:\\t&quot; + userClass.newInstance());</span></span>
<span class="line"><span>    }</span></span></code></pre></div><ul><li>Constructor类及其用法</li><li>Field类及其用法</li><li>Method类及其用法</li></ul><h3 id="getname、getcanonicalname与getsimplename的区别" tabindex="-1">getName、getCanonicalName与getSimpleName的区别? <a class="header-anchor" href="#getname、getcanonicalname与getsimplename的区别" aria-label="Permalink to &quot;getName、getCanonicalName与getSimpleName的区别?&quot;">​</a></h3><ul><li>getSimpleName：只获取类名</li><li>getName：类的全限定名，jvm中Class的表示，可以用于动态加载Class对象，例如Class.forName。</li><li>getCanonicalName：返回更容易理解的表示，主要用于输出（toString）或log打印，大多数情况下和getName一样，但是在内部类、数组等类型的表示形式就不同了。</li></ul><h2 id="spi机制" tabindex="-1">SPI机制 <a class="header-anchor" href="#spi机制" aria-label="Permalink to &quot;SPI机制&quot;">​</a></h2><h3 id="什么是spi机制" tabindex="-1">什么是SPI机制？ <a class="header-anchor" href="#什么是spi机制" aria-label="Permalink to &quot;什么是SPI机制？&quot;">​</a></h3><p>SPI（Service Provider Interface），是JDK内置的一种 服务提供发现机制，可以用来启用框架扩展和替换组件，主要是被框架的开发人员使用，比如java.sql.Driver接口，其他不同厂商可以针对同一接口做出不同的实现，MySQL和PostgreSQL都有不同的实现提供给用户，而Java的SPI机制可以为某个接口寻找服务实现。Java中SPI机制主要思想是将装配的控制权移到程序之外，在模块化设计中这个机制尤其重要，其核心思想就是 <strong>解耦</strong>。</p><p>SPI整体机制图如下：</p><p><img src="https://cdn.jsdelivr.net/gh/jokerxian/pic/pics/adf43ffdd0.jpg" alt=""></p><p>当服务的提供者提供了一种接口的实现之后，需要在classpath下的<code>META-INF/services/</code>目录里创建一个以服务接口命名的文件，这个文件里的内容就是这个接口的具体的实现类。当其他的程序需要这个服务的时候，就可以通过查找这个jar包（一般都是以jar包做依赖）的<code>META-INF/services/</code>中的配置文件，配置文件中有接口的具体实现类名，可以根据这个类名进行加载实例化，就可以使用该服务了。JDK中查找服务的实现的工具类是：<code>java.util.ServiceLoader</code>。</p><h3 id="spi机制的应用" tabindex="-1">SPI机制的应用？ <a class="header-anchor" href="#spi机制的应用" aria-label="Permalink to &quot;SPI机制的应用？&quot;">​</a></h3><ul><li>SPI机制 - JDBC DriverManager</li></ul><p>在JDBC4.0之前，我们开发有连接数据库的时候，通常会用Class.forName(&quot;com.mysql.jdbc.Driver&quot;)这句先加载数据库相关的驱动，然后再进行获取连接等的操作。<strong>而JDBC4.0之后不需要用Class.forName(&quot;com.mysql.jdbc.Driver&quot;)来加载驱动，直接获取连接就可以了，现在这种方式就是使用了Java的SPI扩展机制来实现</strong>。</p><ul><li>JDBC接口定义</li></ul><p>首先在java中定义了接口<code>java.sql.Driver</code>，并没有具体的实现，具体的实现都是由不同厂商来提供的。</p><ul><li>mysql实现</li></ul><p>在mysql的jar包<code>mysql-connector-java-6.0.6.jar</code>中，可以找到<code>META-INF/services</code>目录，该目录下会有一个名字为<code>java.sql.Driver</code>的文件，文件内容是<code>com.mysql.cj.jdbc.Driver</code>，这里面的内容就是针对Java中定义的接口的实现。</p><ul><li>postgresql实现</li></ul><p>同样在postgresql的jar包<code>postgresql-42.0.0.jar</code>中，也可以找到同样的配置文件，文件内容是<code>org.postgresql.Driver</code>，这是postgresql对Java的<code>java.sql.Driver</code>的实现。</p><ul><li>使用方法</li></ul><p>上面说了，现在使用SPI扩展来加载具体的驱动，我们在Java中写连接数据库的代码的时候，不需要再使用<code>Class.forName(&quot;com.mysql.jdbc.Driver&quot;)</code>来加载驱动了，而是直接使用如下代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>String url = &quot;jdbc:xxxx://xxxx:xxxx/xxxx&quot;;</span></span>
<span class="line"><span>Connection conn = DriverManager.getConnection(url,username,password);</span></span>
<span class="line"><span>.....</span></span></code></pre></div><h3 id="spi机制的简单示例" tabindex="-1">SPI机制的简单示例？ <a class="header-anchor" href="#spi机制的简单示例" aria-label="Permalink to &quot;SPI机制的简单示例？&quot;">​</a></h3><p>我们现在需要使用一个内容搜索接口，搜索的实现可能是基于文件系统的搜索，也可能是基于数据库的搜索。</p><ul><li>先定义好接口</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Search {</span></span>
<span class="line"><span>    public List&lt;String&gt; searchDoc(String keyword);   </span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>文件搜索实现</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>public class FileSearch implements Search{</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public List&lt;String&gt; searchDoc(String keyword) {</span></span>
<span class="line"><span>        System.out.println(&quot;文件搜索 &quot;+keyword);</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>数据库搜索实现</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>public class DatabaseSearch implements Search{</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public List&lt;String&gt; searchDoc(String keyword) {</span></span>
<span class="line"><span>        System.out.println(&quot;数据搜索 &quot;+keyword);</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>resources 接下来可以在resources下新建META-INF/services/目录，然后新建接口全限定名的文件：<code>com.cainiao.ys.spi.learn.Search</code>，里面加上我们需要用到的实现类</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>com.cainiao.ys.spi.learn.FileSearch</span></span></code></pre></div><ul><li>测试方法</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>public class TestCase {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        ServiceLoader&lt;Search&gt; s = ServiceLoader.load(Search.class);</span></span>
<span class="line"><span>        Iterator&lt;Search&gt; iterator = s.iterator();</span></span>
<span class="line"><span>        while (iterator.hasNext()) {</span></span>
<span class="line"><span>           Search search =  iterator.next();</span></span>
<span class="line"><span>           search.searchDoc(&quot;hello world&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到输出结果：文件搜索 hello world</p><p>如果在<code>com.cainiao.ys.spi.learn.Search</code>文件里写上两个实现类，那最后的输出结果就是两行了。</p><p>这就是因为<code>ServiceLoader.load(Search.class)</code>在加载某接口时，会去<code>META-INF/services</code>下找接口的全限定名文件，再根据里面的内容加载相应的实现类。</p><p>这就是spi的思想，接口的实现由provider实现，provider只用在提交的jar包里的<code>META-INF/services</code>下根据平台定义的接口新建文件，并添加进相应的实现类内容就好。</p><hr><blockquote><p>本章整理自 <a href="https://pdai.tech/md/interview/x-interview.html" target="_blank" rel="noreferrer">pdai.tech《Java 全栈知识点问题汇总》</a>，仅作个人复习存档；图片已转存至自建图床，少数原图失效处保留了待补标记。</p></blockquote>`,176)])])}const g=s(l,[["render",i]]);export{h as __pageData,g as default};
