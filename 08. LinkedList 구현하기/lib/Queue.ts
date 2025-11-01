
import { MyLinkedList } from './MyLinkedList';

export class Queue<T> {
  private list = new MyLinkedList<T>();

  enqueue(data: T): void {
    this.list.add(data);
  }

  dequeue(): T | undefined {
    return this.list.delete(0);
  }

  peek(): T | undefined {
    return this.list.get(0);
  }

  isEmpty(): boolean {
    return this.list.size === 0;
  }

  get size(): number {
    return this.list.size;
  }

  toArray(): T[] {
    return this.list.toArray();
  }
}
