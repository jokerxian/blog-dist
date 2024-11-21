import{_ as a,c as e,o as t,a2 as i}from"./chunks/framework.DgWzJD9P.js";const q=JSON.parse('{"title":"Java基础","description":"","frontmatter":{},"headers":[],"relativePath":"column/java/java.md","filePath":"column/java/java.md"}'),l={name:"column/java/java.md"},o=i(`<h1 id="java基础" tabindex="-1">Java基础 <a class="header-anchor" href="#java基础" aria-label="Permalink to &quot;Java基础&quot;">​</a></h1><h2 id="_1、面向对象" tabindex="-1">1、面向对象 <a class="header-anchor" href="#_1、面向对象" aria-label="Permalink to &quot;1、面向对象&quot;">​</a></h2><blockquote><p>面向对象是把构成问题事务分解成各个对象，分别设计这些对象，然后将他们组装成有完整功能的系统。面向过程只用函数实现，面向对象是用类实现各个功能模块。</p></blockquote><h2 id="_2、string-stringbuffer-和-stringbuilder区别" tabindex="-1">2、String, StringBuffer 和 StringBuilder区别 <a class="header-anchor" href="#_2、string-stringbuffer-和-stringbuilder区别" aria-label="Permalink to &quot;2、String, StringBuffer 和 StringBuilder区别&quot;">​</a></h2><blockquote><p><strong>1. 可变性</strong></p><ul><li>String 不可变</li><li>StringBuffer 和 StringBuilder 可变</li></ul><p><strong>2. 线程安全</strong></p><ul><li>String 不可变，因此是线程安全的</li><li>StringBuilder 不是线程安全的</li><li>StringBuffer 是线程安全的，内部使用 synchronized 进行同步</li></ul></blockquote><h2 id="_3、final关键字的作用" tabindex="-1">3、final关键字的作用 <a class="header-anchor" href="#_3、final关键字的作用" aria-label="Permalink to &quot;3、final关键字的作用&quot;">​</a></h2><blockquote><ul><li>final 修饰的类不能被继承。</li><li>final 修饰的方法不能被重写。</li><li>final 修饰的变量叫常量，常量必须初始化，初始化之后值就不能被修改。</li></ul></blockquote><h2 id="_4、重载和重写" tabindex="-1">4、重载和重写 <a class="header-anchor" href="#_4、重载和重写" aria-label="Permalink to &quot;4、重载和重写&quot;">​</a></h2><blockquote><p><strong>同个类中的多个方法可以有相同的方法名称，但是有不同的参数列表，这就称为方法重载。</strong></p><p><strong>方法的重写描述的是父类和子类之间的。当父类的功能无法满足子类的需求，可以在子类对方法进行重写。</strong></p></blockquote><h2 id="_5、接口和抽象类的区别" tabindex="-1">5、接口和抽象类的区别 <a class="header-anchor" href="#_5、接口和抽象类的区别" aria-label="Permalink to &quot;5、接口和抽象类的区别&quot;">​</a></h2><blockquote><p>1、<strong>语法层面</strong>上的区别</p><ul><li>抽象类可以有方法实现，而接口的方法中只能是抽象方法（Java 8 开始接口方法可以有默认实现）；</li><li>抽象类中的成员变量可以是各种类型的，接口中的成员变量只能是public static final类型；</li><li>接口中不能含有静态代码块以及静态方法，而抽象类可以有静态代码块和静态方法；</li><li>一个类只能继承一个抽象类，而一个类却可以实现多个接口。</li></ul><p>2、<strong>设计层面</strong>上的区别</p><ul><li>抽象层次不同。抽象类是对整个类整体进行抽象，包括属性、行为，但是接口只是对类行为进行抽象。继承抽象类是一种&quot;是不是&quot;的关系，而接口实现则是 &quot;有没有&quot;的关系。如果一个类继承了某个抽象类，则子类必定是抽象类的种类，而接口实现则是具备不具备的关系，比如鸟是否能飞。</li><li>继承抽象类的是具有相似特点的类，而实现接口的却可以不同的类。</li></ul></blockquote><h1 id="java集合" tabindex="-1">Java集合 <a class="header-anchor" href="#java集合" aria-label="Permalink to &quot;Java集合&quot;">​</a></h1><h2 id="_1、常见集合" tabindex="-1">1、常见集合 <a class="header-anchor" href="#_1、常见集合" aria-label="Permalink to &quot;1、常见集合&quot;">​</a></h2><p><img src="https://img.java-family.cn/202305141800341.png" alt="Java集合主要关系"></p><blockquote><p>其中<code>Collection</code>是集合<code>List</code>、<code>Set</code>的父接口，它主要有两个子接口：</p><ul><li><code>List</code>：存储的元素有序，可重复。</li><li><code>Set</code>：存储的元素不无序，不可重复。</li></ul><p><code>Map</code>是另外的接口，是键值对映射结构的集合。</p></blockquote><h2 id="_2、arraylist和linkedlist的区别" tabindex="-1">2、ArrayList和LinkedList的区别 <a class="header-anchor" href="#_2、arraylist和linkedlist的区别" aria-label="Permalink to &quot;2、ArrayList和LinkedList的区别&quot;">​</a></h2><blockquote><p>ArrayList是基于动态数组实现的，可以随机访问数组中的元素，并且它的查询速度很快，但是增 加或删除元素会导致数组长度发生变化，需要重新分配内存空间。</p><p>LinkedList是基于双向链表实现的，每个节点指向前一个和后一个节点，可以很快地进行插入和删 除操作，因为不需要分配连续的内存空间。但是，LinkedList的查询性能较差，因为需要从头节点 或尾节点不断地遍历查找元素。</p></blockquote><p>**扩容机制 **</p><blockquote><p>ArrayList是基于数组的集合，数组的容量是在定义的时候确定的，如果数组满了，再插入，就会数组溢出。所以在插入时候，会先检查是否需要扩容，如果当前容量+1超过数组长度，就会进行扩容，ArrayList的扩容是创建一个<strong>1.5倍</strong>的新数组，然后把原数组的值拷贝过去。</p></blockquote><h2 id="_3、list和set的区别" tabindex="-1">3、list和set的区别 <a class="header-anchor" href="#_3、list和set的区别" aria-label="Permalink to &quot;3、list和set的区别&quot;">​</a></h2><blockquote><p>List的主要实现类为ArrayList和LinkList；Set的主要实现类为HashSet和TreeSet List有序且允许有重复值；</p><p>Set无需且不可以有重复值，TreeSet通过 Comparator 或者 Comparable 维护了一个排序顺序，List可以插入多个null值；</p><p>Set只允许插入一个null值 List方法常用的实现类有ArrayList、LinkedList 和 Vector。其中ArrayList 最为流行，它提供了使 用索引的随意访问，</p><p>而LinkedList 则对于经常需要从 List 中添加或删除元素的场合更为合适， Vector 表示底层数组，线程安全</p></blockquote><h2 id="_4、hashmap和hashtable哪个线程安全-怎么用hashmap又安全又快" tabindex="-1">4、hashmap和hashtable哪个线程安全，怎么用hashmap又安全又快 <a class="header-anchor" href="#_4、hashmap和hashtable哪个线程安全-怎么用hashmap又安全又快" aria-label="Permalink to &quot;4、hashmap和hashtable哪个线程安全，怎么用hashmap又安全又快&quot;">​</a></h2><blockquote><p>在Java中， Hashtable 是线程安全的，而 HashMap 则不是线程安全的。</p><p>Hashtable 是早期版本的线程安全哈希表实现，它的所有公共方法都是同步的 （synchronized）。这意味着在多线程环境下， Hashtable 可以安全地被多个线程同时访问和修 改，以确保线程安全性。</p><p>然而，由于所有的访问都需要获取同步锁，因此在高并发场景下， Hashtable 的性能可能相对较低。 相比之下， HashMap 不是线程安全的。它的操作不是同步的，因此在多线程环境下同时进行读写 操作可能会导致不确定的结果或产生并发安全问题。</p><p>如果需要在多线程环境中使用 HashMap ，需 要采取额外的措施来保证线程安全性，例如使用 Collections.synchronizedMap() 方法来获取 一个同步的 Map 。 要同时确保 HashMap 安全和快速，可以考虑以下方法：</p><ol><li>使用 ConcurrentHashMap ： ConcurrentHashMap 是 Java 提供的线程安全的哈希表实现。 它通过分段锁（Segment Locking）的方式将数据分成多个段，不同的线程可以同时访问不 同的段，从而提高并发性能。</li><li>使用 Collections.synchronizedMap() ：可以通过调用 Collections.synchronizedMap() 方法来创建一个同步的 HashMap 。这会返回一个线程 安全的 Map ，对其进行读写操作时会自动进行同步，但在高并发情况下性能可能较低。</li><li>使用锁机制：在多线程环境中，可以使用显式的锁机制（如 ReentrantLock ）来保护对 HashMap 的并发访问。通过合理地使用锁，可以实现线程安全并控制并发访问的粒度，以提 高性能。 需要根据具体的应用场景和需求来选择合适的方法。如果不需要线程安全性，而且对性能要求较 高，可以选择使用非线程安全的 HashMap 。如果需要线程安全性，可以考虑使用 ConcurrentHashMap 或其他线程安全的 Map 实现。</li></ol></blockquote><h1 id="java并发" tabindex="-1">Java并发 <a class="header-anchor" href="#java并发" aria-label="Permalink to &quot;Java并发&quot;">​</a></h1><h1 id="mysql" tabindex="-1">MYSQL <a class="header-anchor" href="#mysql" aria-label="Permalink to &quot;MYSQL&quot;">​</a></h1><h2 id="_1、mysql事务的四大特性-acid" tabindex="-1">1、MYSQL事务的四大特性（ACID） <a class="header-anchor" href="#_1、mysql事务的四大特性-acid" aria-label="Permalink to &quot;1、MYSQL事务的四大特性（ACID）&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>原子性：事务作为一个整体被执行，包含在其中的对数据库的操作要么全部被执行，要么都不执行。</span></span>
<span class="line"><span>一致性：指在事务开始之前和事务结束以后，数据不会被破坏，假如 A 账户给 B 账户转 10 块钱，不管成功与否，A 和 B 的总金额是不变的。</span></span>
<span class="line"><span>隔离性：多个事务并发访问时，事务之间是相互隔离的，即一个事务不影响其它事务运行效果。简言之，就是事务之间是进水不犯河水的。</span></span>
<span class="line"><span>持久性：表示事务完成以后，该事务对数据库所作的操作更改，将持久地保存在数据库之中。</span></span></code></pre></div>`,27),s=[o];function r(n,h,c,p,d,u){return t(),e("div",null,s)}const k=a(l,[["render",r]]);export{q as __pageData,k as default};