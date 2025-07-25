import { useReducer } from 'react';

export interface DetailItem {
  employeeid: string;
  name: string;
  department: string;
  role: string;
}

type Action = { type: 'ADD'; payload: DetailItem } | { type: 'REMOVE'; index: number };

const initialDetailItems: DetailItem[] = [
  {
    employeeid: '24672',
    name: '王大明',
    department: '管理部(GM)',
    role: '系統管理員',
  },
  {
    employeeid: '74557',
    name: '陳中翠',
    department: '業務部(SD)',
    role: '模組管理員、一般使用者',
  },
  {
    employeeid: '67758',
    name: '王大明',
    department: '管理部(GM)',
    role: '一般使用者',
  },
];

const reducer = (state: DetailItem[], action: Action): DetailItem[] => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'REMOVE':
      return state.filter((_, i) => i !== action.index);
    default:
      return state;
  }
};

export function useEmployeeReducer() {
  return useReducer(reducer, initialDetailItems);
}
