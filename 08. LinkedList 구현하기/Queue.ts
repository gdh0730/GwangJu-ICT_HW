// src/Queue.ts
import { MyLinkedList } from './MyLinkedList';

export class MyQueue<T> {
  private list = new MyLinkedList<T>();

  get size() { return this.list.size; }
  get isEmpty() { return this.list.isEmpty; }

  /** 뒤로 넣기: O(1) */
  enqueue(v: T) { this.list.add(v); }

  /** 앞에서 꺼내기: O(1) */
  dequeue(): T | undefined {
    if (this.isEmpty) return undefined;
    return this.list.delete(0);
  }

  /** 맨 앞 조회: O(1) */
  peek(): T | undefined {
    if (this.isEmpty) return undefined;
    return this.list.get(0);
  }

  clear() { this.list.clear(); }
  toArray() { return this.list.toArray(); }
}
