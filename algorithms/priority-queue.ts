/**
 * 最小堆实现的优先队列
 */
export class MinHeap<T = number> {
  private heap: T[];
  private compare: (a: T, b: T) => number;

  constructor(compare?: (a: T, b: T) => number) {
    this.heap = [];
    // 默认比较函数：数字升序
    this.compare = compare || ((a: any, b: any) => a - b);
  }

  /**
   * 获取父节点索引
   */
  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  /**
   * 获取左子节点索引
   */
  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  /**
   * 获取右子节点索引
   */
  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  /**
   * 交换两个节点
   */
  private swap(index1: number, index2: number): void {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  /**
   * 上浮操作：将节点向上移动到正确位置
   */
  private heapifyUp(index: number): void {
    let currentIndex = index;
    
    while (currentIndex > 0) {
      const parentIndex = this.getParentIndex(currentIndex);
      
      if (this.compare(this.heap[currentIndex], this.heap[parentIndex]) < 0) {
        this.swap(currentIndex, parentIndex);
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
  }

  /**
   * 下沉操作：将节点向下移动到正确位置
   */
  private heapifyDown(index: number): void {
    let currentIndex = index;
    const length = this.heap.length;

    while (this.getLeftChildIndex(currentIndex) < length) {
      const leftChildIndex = this.getLeftChildIndex(currentIndex);
      const rightChildIndex = this.getRightChildIndex(currentIndex);
      let smallerChildIndex = leftChildIndex;

      // 找到更小的子节点
      if (
        rightChildIndex < length &&
        this.compare(this.heap[rightChildIndex], this.heap[leftChildIndex]) < 0
      ) {
        smallerChildIndex = rightChildIndex;
      }

      // 如果当前节点大于子节点，则交换
      if (this.compare(this.heap[currentIndex], this.heap[smallerChildIndex]) > 0) {
        this.swap(currentIndex, smallerChildIndex);
        currentIndex = smallerChildIndex;
      } else {
        break;
      }
    }
  }

  /**
   * 插入元素
   */
  push(value: T): void {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  /**
   * 删除并返回最小元素
   */
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    
    return min;
  }

  /**
   * 查看最小元素但不删除
   */
  peek(): T | undefined {
    return this.heap[0];
  }

  /**
   * 获取堆大小
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * 判断堆是否为空
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * 清空堆
   */
  clear(): void {
    this.heap = [];
  }

  /**
   * 获取堆数组（用于调试）
   */
  toArray(): T[] {
    return [...this.heap];
  }
}
