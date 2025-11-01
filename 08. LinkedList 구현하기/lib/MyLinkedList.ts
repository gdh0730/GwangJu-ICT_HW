
class LinkedListNode<T> {
  public next: LinkedListNode<T> | null = null;
  constructor(public data: T) {}
}

export class MyLinkedList<T> implements Iterable<T> {
  private head: LinkedListNode<T> | null = null;
  public size: number = 0;

  add(data: T): void {
    const newNode = new LinkedListNode(data);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }

  private getNode(index: number): LinkedListNode<T> | null {
    if (index < 0 || index >= this.size) {
      return null;
    }
    let current = this.head;
    let i = 0;
    while (i < index && current) {
      current = current.next;
      i++;
    }
    return current;
  }

  get(index: number): T | undefined {
    const node = this.getNode(index);
    return node ? node.data : undefined;
  }

  delete(index: number): T | undefined {
    if (index < 0 || index >= this.size) {
      return undefined;
    }

    let deletedNodeData: T;

    if (index === 0 && this.head) {
      deletedNodeData = this.head.data;
      this.head = this.head.next;
    } else {
      const prevNode = this.getNode(index - 1);
      if (!prevNode || !prevNode.next) {
        return undefined;
      }
      deletedNodeData = prevNode.next.data;
      prevNode.next = prevNode.next.next;
    }
    this.size--;
    return deletedNodeData;
  }
  
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.data;
      current = current.next;
    }
  }

  toArray(): T[] {
    return [...this];
  }
}
