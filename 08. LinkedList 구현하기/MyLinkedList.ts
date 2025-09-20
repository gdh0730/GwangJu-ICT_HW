// src/MyLinkedList.ts
export class MyLinkedList<T> implements Iterable<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  private _size = 0;

  get size(): number {
    return this._size;
  }
  get isEmpty(): boolean {
    return this._size === 0;
  }

  /** 맨 뒤에 추가: O(1) */
  add(data: T): void {
    const node: Node<T> = { data, next: null };
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail!.next = node;
      this.tail = node;
    }
    this._size++;
  }

  /** i번째 값 반환: O(n) */
  get(i: number): T {
    this.ensureIndex(i);
    return this.nodeAt(i)!.data;
  }

  /** i번째 값 삭제하여 반환: O(n) */
  delete(i: number): T {
    this.ensureIndex(i);

    // 삭제 대상이 head인 경우
    if (i === 0) {
      const val = this.head!.data;
      this.head = this.head!.next;
      if (!this.head) this.tail = null; // 비어버린 경우 tail 초기화
      this._size--;
      return val;
    }

    // 그 외: prev → curr → next
    const prev = this.nodeAt(i - 1)!;
    const curr = prev.next!;
    const val = curr.data;

    prev.next = curr.next;
    if (curr === this.tail) this.tail = prev; // tail 삭제 시 갱신
    this._size--;
    return val;
  }

  /** 전부 비우기: O(1) */
  clear(): void {
    this.head = this.tail = null;
    this._size = 0;
  }

  /** 배열로 변환: O(n) */
  toArray(): T[] {
    const out: T[] = [];
    for (const v of this) out.push(v);
    return out;
  }

  /** for...of 지원 (Iterator 하위과제) */
  *[Symbol.iterator](): IterableIterator<T> {
    let cur = this.head;
    while (cur) {
      yield cur.data;
      cur = cur.next;
    }
  }

  // --- 내부 유틸 ---
  private ensureIndex(i: number) {
    if (!Number.isInteger(i)) throw new TypeError('index must be an integer');
    if (i < 0 || i >= this._size) throw new RangeError(`index out of range: ${i}`);
  }
  private nodeAt(i: number): Node<T> | null {
    let cur = this.head, idx = 0;
    while (cur && idx < i) {
      cur = cur.next;
      idx++;
    }
    return cur;
  }
}

type Node<T> = {
  data: T;
  next: Node<T> | null;
};
