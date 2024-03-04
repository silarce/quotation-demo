import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';
import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';

// icon
import { IconRemoveCircle, IconEdit, IconCheck01 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './table_TodoList.module.scss';

import { TtodoDto } from 'js/api/dtoTypes';

// =======================================================================

// =======================================================================

export default function Table_todoList({ todoListArr }: { todoListArr: TtodoDto[] }) {
  // ===================================================================

  // ===================================================================
  const control_table: Ttable = useMemo(() => {
    const theadCellArr = [
      {
        ...configList.notificationDate,
        children: configList.notificationDate.label,
      },
      {
        ...configList.projectNumber,
        children: configList.projectNumber.label,
      },
      {
        ...configList.projectName,
        children: configList.projectName.label,
      },
      {
        ...configList.willArrivalDate,
        children: configList.willArrivalDate.label,
      },
      {
        ...configList.qty,
        children: configList.qty.label,
      },
      {
        ...configList.purpose,
        children: configList.purpose.label,
      },
      {
        ...configList.contactPerson,
        children: configList.contactPerson.label,
      },
      {
        ...configList.btnPanel,
        children: null,
      },
    ];

    const tbodyRowArr: Ttable['tbody']['rowArr'] = [
      {
        cellArr: [
          {
            ...configList.notificationDate,
            children: '999年09月09號',
          },
          {
            ...configList.projectNumber,
            children: 'M-99999',
          },
          {
            ...configList.projectName,
            children: '肚子餓工程',
          },
          {
            ...configList.willArrivalDate,
            children: '999年09月09號',
          },
          {
            ...configList.qty,
            children: 99,
          },
          {
            ...configList.purpose,
            children: '早餐吃太少',
          },
          {
            ...configList.contactPerson,
            children: '沒有人',
          },
          {
            ...configList.btnPanel,
            children: (
              <div className={scss.btnBar}>
                <button onClick={() => alert('新增')}>新增</button>
                <button onClick={() => alert('派工')}>派工</button>
              </div>
            ),
          },
        ],
      },
      //
      {
        cellArr: [
          {
            className: scss.fullCell,
            children: (
              <SubRow
                onRemoveClick={() => alert('foooo')}
                // onCheck={(arr) => alert(arr)}
                defaultContent={
                  '好想睡覺好想睡覺好想睡覺\n好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺\n好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺'
                }
              />
            ),
          },
        ],
      },
      {
        cellArr: [
          {
            className: scss.fullCell,
            children: (
              <SubRow
                onRemoveClick={() => alert('foooo')}
                // onCheck={(arr) => alert(arr)}
                isChecked={true}
                defaultContent={
                  '好想睡覺好想睡覺好想睡覺\n好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺\n好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺'
                }
              />
            ),
          },
        ],
      },
      {
        cellArr: [
          {
            className: scss.fullCell,
            children: (
              <SubRow
                onRemoveClick={() => alert('foooo')}
                // onCheck={(arr) => alert(arr)}
                defaultContent={
                  '好想睡覺好想睡覺好想睡覺\n好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺\n好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺好想睡覺'
                }
              />
            ),
          },
        ],
      },
    ];

    const thead: Ttable['thead'] = {
      cellArr: theadCellArr,
    };

    const tbody: Ttable['tbody'] = {
      rowArr: tbodyRowArr,
    };

    return {
      thead,
      tbody,
    };
  }, []);

  return (
    <Wrapper_tab>
      <div></div>
      <div></div>
      <div></div>
      <Table01 {...control_table} />
    </Wrapper_tab>
  );
}

// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================

const SubRow = ({
  onRemoveClick,
  onCheck,
  isChecked,
  defaultContent,
  onOk,
}: {
  onRemoveClick?: () => void;
  onCheck?: (strArr: string[]) => void;
  isChecked?: boolean;
  defaultContent?: string;
  onOk?: (str: string) => void;
}) => {
  const [disabled, setDisabled] = useState(true);

  const [content, setContent] = useState(defaultContent ?? '');

  const switchDisabled = () => {
    setDisabled((prev) => !prev);
  };

  const theOnOk = () => {
    onOk && onOk(content ?? '');
    setDisabled(true);
  };

  useEffect(() => {
    if (disabled) {
      setContent(defaultContent ?? '');
    }
  }, [defaultContent, disabled]);

  return (
    <div className={scss.subRow}>
      <IconRemoveCircle onClick={onRemoveClick} />

      <IconEdit
        //
        className={classNames(scss.svgEdit, !disabled && scss.enabled)}
        onClick={switchDisabled}
      />
      <IconCheck01
        //
        className={classNames(disabled && 'invisible')}
        onClick={theOnOk}
      />

      <div>
        <InputSel
          className={scss.inputSel}
          showBaseline="invisible"
          checkBoxProps={{
            onChange: onCheck,
            propsArr: [
              {
                key: 'foo',
                value: isChecked,
              },
            ],
          }}
        />
      </div>
      {/* <div>{content}</div> */}

      <InputSel
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {
            value: content,
            onChange: (e) => setContent(e.target.value),
          },
        }}
      />
    </div>
  );
};

// ===================================================================

const configList: { [key: string]: Tconfig_table } = {
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
