import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

// antd
import { Collapse } from 'antd';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
// import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';
// import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// icon
import { IconRemoveCircle, IconEdit, IconCheck01, IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './table_TodoList.module.scss';

import { TtodoDto, TcreateTodoDto } from 'js/api/dtoTypes';

// =======================================================================

const Panel = Collapse.Panel;

// =======================================================================

export default function Table_todoList({ todoListArr }: { todoListArr: TtodoDto[] }) {
  // ===================================================================

  // ===================================================================

  return (
    <div className={'overflow-y-scroll'}>
      <Collapse className={scss.antdCollapse}>
        <Panel className={classNames(scss.antdPanel, scss.plus)} key="1" header={<PanelHeader />}>
          <PanelBody />
          <PanelBody />
          <PanelBody />
        </Panel>
      </Collapse>
    </div>
  );
}

// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================

const PanelHeader = () => {
  return (
    <div className={scss.panelHeader}>
      <div>工程編號: {'foooo'} </div>
      <div>聯絡人: {'XXX'} </div>
      <div> 數量: {'999'} </div>
      <div className={scss.addCell}>
        <MyButton_v2 label="新增" px="px22" py="py4" className={scss.addBtn} />
      </div>
      <div className={'col-span-4'}>工程名稱: FOOOOOOO</div>
    </div>
  );
};

const PanelBody = () =>
  // { todo }: { todo: TtodoDto }
  {
    const [disabled, setDisabled] = useState(true);

    // -------------------------------------------------------------------

    const [state_todo, setState_todo] = useState<TcreateTodoDto>();

    // -------------------------------------------------------------------

    // useEffect(() => {
    //   if (disabled) {
    //     setState_todo({
    //       engineeringContactId: todo.engineeringContactId,
    //       contactPerson: todo.contactPerson,
    //       purpose: todo.purpose ?? '',
    //       notificationDate: todo.notificationDate ?? '',
    //       entryDate: todo.entryDate ?? '',
    //       pointContactPerson: '',
    //       pointContactNumber: '',
    //       content: todo.content,
    //       isAlreadyDisPatching: todo.isAlreadyDisPatching,
    //     });
    //   }
    // }, [disabled]);

    // -------------------------------------------------------------------
    const btnBar_disabled = (
      <>
        <IconEdit onClick={() => setDisabled(false)} />
        <button className={scss.btn_dispatch}>派工</button>
      </>
    );

    const btnBar_enabled = (
      <>
        <IconEdit onClick={() => setDisabled(true)} className={classNames(scss.edit, scss.enabled)} />
        <IconCheck01 />
      </>
    );

    const BtnBar = disabled ? btnBar_disabled : btnBar_enabled;

    return (
      <div className={scss.panelBody}>
        <div className={scss.info}>
          <div>
            <InputSel
              disabled={disabled}
              {...configList_inpuSel.info}
              caption="主旨"
              captionSize="20"
              fontSize="20"
              inputProps={{
                props: {
                  value: 'foo',
                  onChange: () => {},
                },
              }}
            />
          </div>
          <div>
            <InputSel
              disabled={disabled}
              {...configList_inpuSel.info}
              caption="接洽人"
              inputProps={{
                props: {
                  value: 'foo',
                  onChange: () => {},
                },
              }}
            />
          </div>
          <div>
            <InputSel
              disabled={disabled}
              {...configList_inpuSel.info}
              caption="通知日期"
              datePickerProps={{
                props: {
                  // value: 'foo',
                  // onChange: () => {},
                },
              }}
            />
          </div>
          <div>
            <InputSel
              disabled={disabled}
              {...configList_inpuSel.info}
              caption="預計進場日期"
              datePickerProps={{
                props: {
                  // value: 'foo',
                  // onChange: () => {},
                },
              }}
            />
          </div>
        </div>
        {/*  */}
        <div className={scss.btnBar}>
          <div className={scss.top}>{BtnBar}</div>

          <div className={scss.bottom}>
            <IconDelete01 className={scss.btn_delete} />
          </div>
        </div>

        {/*  */}
        <div className={scss.content}>
          <div>
            <span>內容</span>
          </div>
          <div>
            <InputSel
              disabled={disabled}
              showBaseline="invisible"
              textareaProps={{
                allowNewLineByUser: true,
                props: {
                  className: classNames(scss.textarea, disabled && scss.disabled),
                  minRows: 3,
                  // value: '',
                  // onChange: () => {},
                },
              }}
            />
          </div>
        </div>
      </div>
    );
  };

// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================

// const SubRow = ({
//   onRemoveClick,
//   onCheck,
//   isChecked,
//   defaultContent,
//   onOk,
// }: {
//   onRemoveClick?: () => void;
//   onCheck?: (strArr: string[]) => void;
//   isChecked?: boolean;
//   defaultContent?: string;
//   onOk?: (str: string) => void;
// }) => {
//   const [disabled, setDisabled] = useState(true);

//   const [content, setContent] = useState(defaultContent ?? '');

//   const switchDisabled = () => {
//     setDisabled((prev) => !prev);
//   };

//   const theOnOk = () => {
//     onOk && onOk(content ?? '');
//     setDisabled(true);
//   };

//   useEffect(() => {
//     if (disabled) {
//       setContent(defaultContent ?? '');
//     }
//   }, [defaultContent, disabled]);

//   return (
//     <div className={scss.subRow}>
//       <IconRemoveCircle onClick={onRemoveClick} />

//       <IconEdit
//         //
//         className={classNames(scss.svgEdit, !disabled && scss.enabled)}
//         onClick={switchDisabled}
//       />
//       <IconCheck01
//         //
//         className={classNames(disabled && 'invisible')}
//         onClick={theOnOk}
//       />

//       <div>
//         <InputSel
//           className={scss.inputSel}
//           showBaseline="invisible"
//           checkBoxProps={{
//             onChange: onCheck,
//             propsArr: [
//               {
//                 key: 'foo',
//                 value: isChecked,
//               },
//             ],
//           }}
//         />
//       </div>
//       {/* <div>{content}</div> */}

//       <InputSel
//         disabled={disabled}
//         showBaseline="auto"
//         inputProps={{
//           props: {
//             value: content,
//             onChange: (e) => setContent(e.target.value),
//           },
//         }}
//       />
//     </div>
//   );
// };

// ===================================================================

const configList_inpuSel = {
  info: {
    captionSize: '16',
    fontSize: '16',
    showBaseline: 'invisible',
  },
} as const;

const configList = {
  notificationDate: {
    label: '通知日期',
    width: 135,
    justifyContent: 'center',
  },
  projectNumber: {
    label: '工程編號',
    width: 135,
    justifyContent: 'center',
  },
  projectName: {
    label: '工程名稱',
    width: 180,
    justifyContent: 'center',
  },
  willArrivalDate: {
    label: '預計進場日期',
    width: 135,
    justifyContent: 'center',
  },
  qty: {
    label: '數量',
    width: 60,
    justifyContent: 'center',
  },
  purpose: {
    label: '主旨',
    flex: 'auto',
    justifyContent: 'center',
  },
  contactPerson: {
    label: '聯絡人',
    width: 100,
    justifyContent: 'center',
  },
  btnPanel: {
    width: 160,
    justifyContent: 'center',
  },
};

// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// const control_table: Ttable = useMemo(() => {
//   const theadCellArr = [
//     {
//       ...configList.notificationDate,
//       children: configList.notificationDate.label,
//     },
//     {
//       ...configList.projectNumber,
//       children: configList.projectNumber.label,
//     },
//     {
//       ...configList.projectName,
//       children: configList.projectName.label,
//     },
//     {
//       ...configList.willArrivalDate,
//       children: configList.willArrivalDate.label,
//     },
//     {
//       ...configList.qty,
//       children: configList.qty.label,
//     },
//     {
//       ...configList.purpose,
//       children: configList.purpose.label,
//     },
//     {
//       ...configList.contactPerson,
//       children: configList.contactPerson.label,
//     },
//     {
//       ...configList.btnPanel,
//       children: null,
//     },
//   ];

//   const tbodyRowArr: Ttable['tbody']['rowArr'] = [
//     {
//       cellArr: [
//         {
//           ...configList.notificationDate,
//           children: '999年09月09號',
//         },
//         {
//           ...configList.projectNumber,
//           children: 'M-99999',
//         },
//         {
//           ...configList.projectName,
//           children: '肚子餓工程',
//         },
//         {
//           ...configList.willArrivalDate,
//           children: '999年09月09號',
//         },
//         {
//           ...configList.qty,
//           children: 99,
//         },
//         {
//           ...configList.purpose,
//           children: '早餐吃太少',
//         },
//         {
//           ...configList.contactPerson,
//           children: '沒有人',
//         },
//         {
//           ...configList.btnPanel,
//           children: (
//             <div className={scss.btnBar}>
//               <button onClick={() => alert('新增')}>新增</button>
//               <button onClick={() => alert('派工')}>派工</button>
//             </div>
//           ),
//         },
//       ],
//     },
//     //
//     {
//       cellArr: [
//         {
//           className: scss.fullCell,
//           children: (
//             <SubRow
//               onRemoveClick={() => alert('foooo')}
//               // onCheck={(arr) => alert(arr)}
//               defaultContent={
//                 '好想睡覺好想睡覺好想睡覺\n好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺\n好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺'
//               }
//             />
//           ),
//         },
//       ],
//     },
//     {
//       cellArr: [
//         {
//           className: scss.fullCell,
//           children: (
//             <SubRow
//               onRemoveClick={() => alert('foooo')}
//               // onCheck={(arr) => alert(arr)}
//               isChecked={true}
//               defaultContent={
//                 '好想睡覺好想睡覺好想睡覺\n好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺\n好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺'
//               }
//             />
//           ),
//         },
//       ],
//     },
//     {
//       cellArr: [
//         {
//           className: scss.fullCell,
//           children: (
//             <SubRow
//               onRemoveClick={() => alert('foooo')}
//               // onCheck={(arr) => alert(arr)}
//               defaultContent={
//                 '好想睡覺好想睡覺好想睡覺\n好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺\n好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺'
//               }
//             />
//           ),
//         },
//       ],
//     },
//   ];

//   const thead: Ttable['thead'] = {
//     cellArr: theadCellArr,
//   };

//   const tbody: Ttable['tbody'] = {
//     rowArr: tbodyRowArr,
//   };

//   return {
//     thead,
//     tbody,
//   };
// }, []);
