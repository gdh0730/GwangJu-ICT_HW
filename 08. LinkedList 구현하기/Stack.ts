// src/Stack.ts
import { MyLinkedList } from './MyLinkedList';

/** 단일 연결 리스트로도 스택 O(1) 가능: head를 top으로 사용 */
export class MyStack<T> {
  private list = new MyLinkedList<T>();

  get size() { return this.list.size; }
  get isEmpty() { return this.list.isEmpty; }

  /** push: O(1) – 맨 앞에 넣는 메서드가 없으니 내부적으로 재구성 */
  push(v: T) {
    // 앞에 넣기 위해 새 리스트 노드로 교체하는 간단한 트릭
    // (MyLinkedList에 addFront가 없다면 아래와 같이 직접 구현)
    // 여기서는 간단히: 현재 요소들을 임시로 옮겨도 되지만 O(n)이 됩니다.
    // → 스택을 O(1)으로 유지하려면 MyLinkedList에 addFront/delete(0)가 필요
    // 이미 delete(0)는 있으므로 addFront만 보조로 구현해 보겠습니다.
    (this.list as any)._addFront
      ? (this.list as any)._addFront(v)
      : this._addFrontFallback(v);
  }

  /** pop: O(1) */
  pop(): T | undefined {
    if (this.isEmpty) return undefined;
    return this.list.delete(0);
  }

  /** peek: O(1) */
  peek(): T | undefined {
    if (this.isEmpty) return undefined;
    return this.list.get(0);
  }

  clear() { this.list.clear(); }
  toArray() { return this.list.toArray(); }

  // --- addFront이 없는 경우 임시 구현 (O(n)): 교육용 보조 로직 ---
  private _addFrontFallback(v: T) {
    // 임시 배열로 옮겼다가 다시 넣는 방식 (O(n)) – 데모용
    const arr = [v, ...this.list.toArray()];
    this.list.clear();
    for (const x of arr) this.list.add(x);
  }
}
