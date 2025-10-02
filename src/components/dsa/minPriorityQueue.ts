class minPriorityQueue<T> {
  private heap: { key: number; val: T }[] = [];

  private parent(i: number) {
    return Math.floor((i - 1) / 2);
  }
  private left(i: number) {
    return 2 * i + 1;
  }
  private right(i: number) {
    return 2 * i + 2;
  }

  size() {
    return this.heap.length;
  }
  isEmpty() {
    return this.size() === 0;
  }

  push(key: number, val: T) {
    this.heap.push({ key, val });
    this.bubbleUp(this.size() - 1);
  }

  pop(): { key: number; val: T } | undefined {
    if (this.isEmpty()) return undefined;
    this.swap(0, this.size() - 1);
    const out = this.heap.pop();
    this.bubbleDown(0);
    return out;
  }

  private bubbleUp(i: number) {
    while (i > 0 && this.heap[this.parent(i)].key > this.heap[i].key) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }
  private bubbleDown(i: number) {
    while (true) {
      let smallest = i;
      const l = this.left(i),
        r = this.right(i);
      if (l < this.size() && this.heap[l].key < this.heap[smallest].key)
        smallest = l;
      if (r < this.size() && this.heap[r].key < this.heap[smallest].key)
        smallest = r;
      if (smallest === i) break;
      this.swap(i, smallest);
      i = smallest;
    }
  }

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}
export default minPriorityQueue;
