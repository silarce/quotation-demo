import { useMemo } from 'react';
import classNames from 'classnames';

// gear
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
// import scss from './receivedHistory.module.scss';
import scss_p from './_public.module.scss';

export default function ReceivedHistory() {
  const control_table = useMemo(() => {
    //
    const thead: Ttable['thead'] = {
      cellArr: keysArr.map((key) => {
        return {
          ...configList[key],
          children: configList[key].label,
        };
      }),
    };
    //

    const tbodyRowArr: Ttable['tbody']['rowArr'] = [
      {
        cellArr: [
          {
            ...configList.date,
            children: '111-11-11',
          },
          {
            ...configList.ingredientTechnician,
            children: '蓋特機器人',
          },
          {
            ...configList.doorModelName,
            children: 'SJ-302',
          },
          {
            ...configList.qty,
            children: 9999,
          },
          {
            ...configList.materialHandler,
            children: '無敵鐵金剛',
          },
          {
            children: <IconDetail onClick={() => alert('肚子餓')} />,
            width: 100,
          },
        ],
      },
    ];

    const tbody: Ttable['tbody'] = {
      // rowArr: tbodyRowArr,
      rowArr: [
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
        ...tbodyRowArr,
      ],
    };

    return { thead, tbody };

    //
  }, []);

  return <Table01 {...control_table} className={classNames(scss_p.table)} />;
}

// ==================================================================

const keysArr = [
  //
  'date', // 領料日期
  'ingredientTechnician', // 領料人員
  'doorModelName',
  'qty',
  'materialHandler', // 備料人員
  'btn',
];

const configList: { [key: string]: Tconfig_table } = {
  date: {
    label: '領料日期',
    flex: '20%',
  },
  ingredientTechnician: {
    label: '領料人員',
    flex: '20%',
  },
  doorModelName: {
    label: '門型',
    flex: '20%',
  },
  qty: {
    label: '樘數',
    flex: '20%',
  },
  materialHandler: {
    label: '備料人員',
    flex: '20%',
  },
  btn: {
    width: 100,
  },
};
