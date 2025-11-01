
import { MyLinkedList } from './MyLinkedList';

export class Stack<T> {
  private list = new MyLinkedList<T>();

  push(data: T): void {
    this.list.add(data);
  }

  pop(): T | undefined {
    return this.list.delete(this.list.size - 1);
  }

  peek(): T | undefined {
    return this.list.get(this.list.size - 1);
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
