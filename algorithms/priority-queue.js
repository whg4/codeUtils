class BinaryHeap {
  // comparator(a,b) <0 if a<b. 默认最小堆
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.compare = comparator;
  }

  size() { return this.heap.length; }
  peek() { return this.heap[0]; }

  push(value) {
    this.heap.push(value);
    this._siftUp(this.heap.length - 1);
  }

  pop() {
    if (this.size() === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.size() > 0) {
      this.heap[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  // 删除第一个等于 value 的元素（按 === 比较）
  // 复杂度：O(n) 查找 + O(log n) 调整 -> O(n)
  remove(value) {
    const idx = this.heap.indexOf(value);
    if (idx === -1) return false;
    this.removeAt(idx);
    return true;
  }

  // 删除索引为 idx 的节点（已知位置时，用此方法）
  // 复杂度：O(log n)
  removeAt(idx) {
    const lastIdx = this.heap.length - 1;
    if (idx < 0 || idx > lastIdx) return undefined;
    if (idx === lastIdx) return this.heap.pop();
    const removed = this.heap[idx];
    // 用最后元素替换并弹出末尾
    this.heap[idx] = this.heap.pop();
    // 先尝试下调；若没下调再尝试上调
    if (!this._siftDown(idx)) this._siftUp(idx);
    return removed;
  }

  _siftUp(idx) {
    let i = idx;
    const item = this.heap[i];
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      // 如果父节点 <= item，停止（最小堆）
      if (this.compare(this.heap[p], item) <= 0) break;
      this.heap[i] = this.heap[p];
      i = p;
    }
    this.heap[i] = item;
    return i !== idx;
  }

  _siftDown(idx) {
    let i = idx;
    const len = this.heap.length;
    const item = this.heap[i];
    while (true) {
      const left = 2 * i + 1;
      const right = left + 1;
      let best = i;
      if (left < len && this.compare(this.heap[left], this.heap[best]) < 0) best = left;
      if (right < len && this.compare(this.heap[right], this.heap[best]) < 0) best = right;
      if (best === i) break;
      this.heap[i] = this.heap[best];
      i = best;
    }
    this.heap[i] = item;
    return i !== idx;
  }
}