
export interface Expense {
  id: string;
  name: string;
  amount: number;
}

export interface AlertState {
  show: boolean;
  text: string;
  type: 'success' | 'danger';
}
