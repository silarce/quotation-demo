// component
import SupplyTable from './ui/supplyTable';

// css
import scss from './supplyList.module.scss';

// ==================================================================

type TstateItem = {
  itemName: string;
  subItemName?: string | null;
  category: string;

  // 已領數量
  pickUpQuantity?: number | null;
  // 未領數量
  stayQuantity?: number | null;
  // 總需求數量
  quantity?: number | null;

  // 領取數量
  pickupRecord?: number | null;
  // 需求數量
  requirementQty?: number | null;
};

export type { TstateItem };

// ==================================================================

export default function SupplyList() {
  return <div className={scss.supplyList}>{/* <SupplyTable /> */}</div>;
}

// ==================================================================

// const fakeData_lockbox: Tcontrol_nestedRow = {
//   name: '鎖盒',
//   subTypeArr: [
//     {
//       name: '智慧型（含主機）',
//       unclaimedQty: 1,
//       receivedQty: 2,
//       needQty: 3,
//     },
//     {
//       name: '智慧型（含主機）+ 發訊器',
//       unclaimedQty: 5,
//       receivedQty: <span className={'text-success'}>OK</span>,
//       needQty: 3,
//     },
//     {
//       name: '智慧型（含主機）+ 發射器',
//       unclaimedQty: 9,
//       receivedQty: <span className={'text-pass'}>OK</span>,
//       needQty: 9,
//     },
//     {
//       name: '智慧型（含主機）+ 發訊器 + 發射器',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '面板式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '埋入式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '外露式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };

// const fakeData_key: Tcontrol_nestedRow = {
//   name: '鎖匙',
//   subTypeArr: [
//     {
//       name: '鎖號',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '特殊鎖號',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };

// const fakeData_panel: Tcontrol_nestedRow = {
//   name: '控制箱/盤',
//   typeName: '捲門/水閘門',
//   subTypeArr: [
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };

// const fakeData_pressButton: Tcontrol_nestedRow = {
//   name: '押扣',
//   subTypeArr: [
//     {
//       name: '三點式（一般）',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };
// const fakeData_firefightingSupplies: Tcontrol_nestedRow = {
//   name: '消防備品',
//   subTypeArr: [
//     {
//       name: '煙感器',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '中繼器 1φ 220v',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '中繼器 3φ 380v',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };

// const fakeData_host: Tcontrol_nestedRow = {
//   name: '主機',
//   subTypeArr: [
//     {
//       name: '遙控器（1:2）+ 障感器',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '遙控器（1:2）',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '障感器',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };
// const fakeData_infrared: Tcontrol_nestedRow = {
//   name: '紅外線',
//   subTypeArr: [
//     {
//       name: '反射式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '對照式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };
