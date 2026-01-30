interface LinkNode<K, V> {
  key: K;
  value: V;
  prev: LinkNode<K, V> | null;
  next: LinkNode<K, V> | null;
}

class LRU<K, V> {
  private capacity: number;
  private cache: Map<K, LinkNode<K, V>>;
  private size: number;
  private head: LinkNode<K, V>;
  private tail: LinkNode<K, V>;

  /**
   * 初始化LRU缓存
   * @param capacity - 缓存最大容量，默认10
   */
  constructor(capacity: number = 10) {
    this.capacity = capacity > 0 ? capacity : 10; // 容量校验，确保正整数
    this.cache = new Map(); // 哈希表：key -> 节点，O(1)查询
    this.size = 0; // 当前缓存节点数量

    // 初始化双向链表的「虚拟头节点」和「虚拟尾节点」（简化边界操作，无需判断节点是否为头尾）
    this.head = {
      key: undefined as any,
      value: undefined as any,
      prev: null,
      next: null,
    };
    this.tail = {
      key: undefined as any,
      value: undefined as any,
      prev: null,
      next: null,
    };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * 查询缓存值
   * @param key - 要查询的键
   * @returns 存在则返回对应值，不存在返回null
   */
  get(key: K): V | null {
    const node = this.cache.get(key);
    if (!node) return null; // 键不存在，返回null

    this.moveToTail(node); // 移至尾节点，标记为最近使用
    return node.value;
  }

  /**
   * 新增/更新缓存
   * @param key - 缓存键
   * @param value - 缓存值
   */
  set(key: K, value: V): void {
    const node = this.cache.get(key);

    if (node) {
      // 键已存在：更新值 + 移至尾节点
      node.value = value;
      this.moveToTail(node);
      return;
    }

    // 键不存在：新建节点
    const newNode: LinkNode<K, V> = { key, value, prev: null, next: null };
    this.cache.set(key, newNode); // 哈希表注册节点
    this.addToTail(newNode); // 插入尾节点
    this.size++; // 节点数+1

    // 容量满：淘汰最久未使用节点（头节点的后继节点）
    if (this.size > this.capacity) {
      const delNode = this.removeHead(); // 删除链表头节点
      this.cache.delete(delNode.key); // 哈希表删除对应键
      this.size--; // 节点数-1
    }
  }

  /**
   * 将节点添加到尾节点前（虚拟尾节点的前驱）
   */
  private addToTail(node: LinkNode<K, V>): void {
    const prevNode = this.tail.prev!;
    // 双向绑定：前驱节点 <-> 新节点 <-> 虚拟尾节点
    prevNode.next = node;
    node.prev = prevNode;
    node.next = this.tail;
    this.tail.prev = node;
  }

  /**
   * 将节点从链表中移除（通用移除逻辑）
   */
  private removeNode(node: LinkNode<K, V>): void {
    const prevNode = node.prev!;
    const nextNode = node.next!;
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
  }

  /**
   * 将节点移至尾节点（先移除再添加）
   */
  private moveToTail(node: LinkNode<K, V>): void {
    this.removeNode(node);
    this.addToTail(node);
  }

  /**
   * 移除最久未使用节点（虚拟头节点的后继节点）
   */
  private removeHead() {
    const delNode = this.head.next!;
    this.removeNode(delNode);
    return delNode;
  }
}
