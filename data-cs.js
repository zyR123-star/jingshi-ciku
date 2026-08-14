STAGES.push(
  { id: 401, subject: "cs", name: "计算机与操作系统", en: "Computers & OS", code: "01", goal: "理解计算机组成、内存和操作系统的基本机制。", weeks: "第 1-6 周", color: "#7a5aa6", topics: ["CPU", "内存", "进程", "文件"] },
  { id: 402, subject: "cs", name: "程序设计基础", en: "Programming Basics", code: "02", goal: "掌握变量、函数、循环等编程核心概念。", weeks: "第 7-12 周", color: "#2e6f8f", topics: ["算法", "变量", "函数", "递归"] },
  { id: 403, subject: "cs", name: "数据结构", en: "Data Structures", code: "03", goal: "学会用合适的结构组织和操作数据。", weeks: "第 13-18 周", color: "#0e7c6b", topics: ["数组", "栈与队列", "链表", "树与图"] },
  { id: 404, subject: "cs", name: "网络与安全", en: "Networks & Security", code: "04", goal: "理解网络通信、协议与安全基础。", weeks: "第 19-24 周", color: "#c94f2b", topics: ["网络", "协议", "IP", "加密"] }
);

TERMS.push(
  { id: "algorithm", subject: "cs", term: "算法", en: "Algorithm", stage: 402, cat: "程序设计", diff: 1, def: "解决特定问题的有限步骤序列。", example: "冒泡排序就是一种交换相邻元素的算法。", tip: "算法要有输入、输出和有限步骤。", related: ["program", "complexity", "sort"] },
  { id: "program", subject: "cs", term: "程序", en: "Program", stage: 402, cat: "程序设计", diff: 1, def: "用编程语言编写的可执行指令集合。", example: "一个计算平均分的 Python 脚本就是程序。", tip: "程序是算法在计算机上的实现。", related: ["algorithm", "variable", "function"] },
  { id: "variable", subject: "cs", term: "变量", en: "Variable", stage: 402, cat: "程序设计", diff: 1, def: "用于存储和引用数据的命名空间。", example: "score = 90 把 90 存入 score。", tip: "变量先声明再使用。", related: ["program", "function", "array"] },
  { id: "function", subject: "cs", term: "函数", en: "Function", stage: 402, cat: "程序设计", diff: 1, def: "封装一段可复用逻辑的代码块。", example: "def add(a,b): return a+b 定义加法函数。", tip: "函数有输入参数和返回值。", related: ["program", "variable", "recursion"] },
  { id: "loop", subject: "cs", term: "循环", en: "Loop", stage: 402, cat: "程序设计", diff: 1, def: "重复执行某段代码直到条件改变。", example: "for i in range(5) 会执行五次。", tip: "循环要有终止条件，避免死循环。", related: ["program", "condition", "array"] },
  { id: "condition", subject: "cs", term: "条件", en: "Condition", stage: 402, cat: "程序设计", diff: 1, def: "根据布尔判断选择执行不同分支。", example: "if score >= 60 判断是否及格。", tip: "条件常与比较运算符一起使用。", related: ["program", "loop", "function"] },
  { id: "array", subject: "cs", term: "数组", en: "Array", stage: 403, cat: "数据结构", diff: 1, def: "按索引存储一组相同类型元素的结构。", example: "scores[0] 取出数组第一个分数。", tip: "数组索引通常从 0 开始。", related: ["variable", "loop", "linked_list"] },
  { id: "pointer", subject: "cs", term: "指针", en: "Pointer", stage: 402, cat: "程序设计", diff: 2, def: "保存内存地址的变量，用于访问数据。", example: "指针指向数组首地址后可用地址偏移遍历。", tip: "指针强大多变，操作前要确认目标有效。", related: ["memory", "array", "function"] },
  { id: "recursion", subject: "cs", term: "递归", en: "Recursion", stage: 402, cat: "程序设计", diff: 2, def: "函数直接或间接调用自身来解决问题。", example: "计算阶乘时 f(n)=n*f(n-1) 就是递归。", tip: "递归必须有基准情形和递归步骤。", related: ["function", "stack", "algorithm"] },
  { id: "complexity", subject: "cs", term: "复杂度", en: "Complexity", stage: 403, cat: "算法", diff: 2, def: "衡量算法所需时间或空间随规模增长的量级。", example: "O(n²) 表示输入翻倍时开销约变为四倍。", tip: "复杂度关心增长趋势，不关心常数。", related: ["algorithm", "sort", "search"] },
  { id: "stack", subject: "cs", term: "栈", en: "Stack", stage: 403, cat: "数据结构", diff: 1, def: "后进先出的线性数据结构。", example: "函数调用返回地址按栈保存。", tip: "栈的操作主要是 push 和 pop。", related: ["recursion", "queue", "memory"] },
  { id: "queue", subject: "cs", term: "队列", en: "Queue", stage: 403, cat: "数据结构", diff: 1, def: "先进先出的线性数据结构。", example: "打印任务按提交顺序排队处理。", tip: "队列用 enqueue 和 dequeue 操作。", related: ["stack", "linked_list", "tree"] },
  { id: "linked_list", subject: "cs", term: "链表", en: "Linked List", stage: 403, cat: "数据结构", diff: 2, def: "由节点串成、每个节点指向下一个节点的结构。", example: "在链表中间插入元素只需改指针。", tip: "链表访问慢，插入删除快。", related: ["array", "pointer", "tree"] },
  { id: "tree", subject: "cs", term: "树", en: "Tree", stage: 403, cat: "数据结构", diff: 2, def: "具有层级关系、无环的节点结构。", example: "文件夹目录就是一棵树。", tip: "根、父节点、子节点、叶节点是树的基本概念。", related: ["graph", "linked_list", "hash"] },
  { id: "graph", subject: "cs", term: "图", en: "Graph", stage: 403, cat: "数据结构", diff: 2, def: "由顶点和边组成，可表示复杂关系。", example: "社交网络中的好友关系可用图表示。", tip: "树是图的特殊情况。", related: ["tree", "search", "algorithm"] },
  { id: "hash", subject: "cs", term: "哈希", en: "Hash", stage: 403, cat: "数据结构", diff: 2, def: "通过哈希函数把数据映射到固定位置以加速查找。", example: "字典根据键的哈希值快速找到值。", tip: "好的哈希函数让冲突尽量少。", related: ["array", "tree", "database"] },
  { id: "sort", subject: "cs", term: "排序", en: "Sorting", stage: 403, cat: "算法", diff: 1, def: "按特定顺序重新排列数据。", example: "把成绩从高到低排列就是排序。", tip: "常见排序有冒泡、快速、归并。", related: ["algorithm", "complexity", "binary_search"] },
  { id: "search", subject: "cs", term: "查找", en: "Search", stage: 403, cat: "算法", diff: 1, def: "在数据集中寻找目标元素或信息。", example: "在通讯录里找某个联系人就是查找。", tip: "数据有序时可以用更高效的查找。", related: ["algorithm", "binary_search", "graph"] },
  { id: "binary_search", subject: "cs", term: "二分查找", en: "Binary Search", stage: 403, cat: "算法", diff: 2, def: "在有序数据中每次排除一半范围的查找方法。", example: "猜数字时每次取中间值，就是二分查找。", tip: "二分查找要求数据有序且可随机访问。", related: ["search", "sort", "complexity"] },
  { id: "memory", subject: "cs", term: "内存", en: "Memory", stage: 401, cat: "计算机组成", diff: 1, def: "程序运行时临时保存数据和指令的存储区域。", example: "变量值在程序运行期间存放在内存中。", tip: "内存断电后内容会丢失。", related: ["pointer", "cpu", "operating_system"] },
  { id: "cpu", subject: "cs", term: "CPU", en: "Central Processing Unit", stage: 401, cat: "计算机组成", diff: 1, def: "执行指令、进行运算和控制的中央处理器。", example: "程序的所有计算最终都由 CPU 完成。", tip: "CPU 的周期包括取指、译码和执行。", related: ["memory", "operating_system", "process"] },
  { id: "operating_system", subject: "cs", term: "操作系统", en: "Operating System", stage: 401, cat: "操作系统", diff: 1, def: "管理硬件资源并为程序提供运行环境的系统软件。", example: "Windows、Linux 都是操作系统。", tip: "操作系统负责进程调度、内存管理和文件系统。", related: ["process", "memory", "file"] },
  { id: "process", subject: "cs", term: "进程", en: "Process", stage: 401, cat: "操作系统", diff: 1, def: "正在运行的程序实例，拥有独立资源。", example: "同时打开两个浏览器窗口会运行多个进程。", tip: "进程之间通常有独立的内存空间。", related: ["thread", "operating_system", "cpu"] },
  { id: "thread", subject: "cs", term: "线程", en: "Thread", stage: 401, cat: "操作系统", diff: 2, def: "进程内可独立执行的最小调度单位。", example: "一个进程内可以开多个线程并行下载。", tip: "同一进程的线程共享内存。", related: ["process", "operating_system", "cpu"] },
  { id: "file", subject: "cs", term: "文件", en: "File", stage: 401, cat: "操作系统", diff: 1, def: "存储在持久介质上的数据单元，按名字管理。", example: "文档、图片、程序都以文件形式保存。", tip: "文件系统负责文件的读写和组织。", related: ["operating_system", "database", "memory"] },
  { id: "network", subject: "cs", term: "网络", en: "Network", stage: 404, cat: "网络", diff: 1, def: "多台计算机通过介质连接并交换数据。", example: "手机和电脑连接路由器形成局域网。", tip: "网络传输靠分层协议协作。", related: ["protocol", "ip", "encryption"] },
  { id: "protocol", subject: "cs", term: "协议", en: "Protocol", stage: 404, cat: "网络", diff: 2, def: "通信双方约定的数据格式与规则。", example: "HTTP 规定网页请求和响应格式。", tip: "协议让不同设备能互相理解。", related: ["network", "ip", "encryption"] },
  { id: "ip", subject: "cs", term: "IP 地址", en: "IP Address", stage: 404, cat: "网络", diff: 1, def: "网络设备在网络中的唯一逻辑地址。", example: "192.168.1.1 是常见路由器地址。", tip: "IP 负责寻址，DNS 把域名转成 IP。", related: ["network", "protocol", "encryption"] },
  { id: "encryption", subject: "cs", term: "加密", en: "Encryption", stage: 404, cat: "安全", diff: 2, def: "通过算法把明文转换为不可直接读的密文。", example: "HTTPS 使用加密保护网页传输内容。", tip: "加密保证机密性，密钥管理同样重要。", related: ["network", "protocol", "database"] },
  { id: "database", subject: "cs", term: "数据库", en: "Database", stage: 404, cat: "数据", diff: 1, def: "按结构化方式存储和管理数据的系统。", example: "学生选课系统把课程和成绩存入数据库。", tip: "数据库支持增删改查与索引。", related: ["file", "hash", "encryption"] }
);
