import { useMemo } from 'react';
import { useRouter } from 'next/router';

import classNames from 'classnames';

// component
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// ===================================== ========================================

type Tquery = {
  certifyType: undefined | 'fireproof' | 'factory' | 'warranty';
};

// =============================================================================
export default function CertifiedDocumentList({ className }: { className?: string }) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { certifyType = 'fireproof' } = query;

  // ========================================================================

  const control_table: Ttable = useMemo(() => {
    //
    const thead: Ttable['thead'] = {
      // stickyTop: {
      //   top: '40px',
      // },
      rowProps: {
        minHeight: tableConfig.row.minHeight,
      },
      cellArr: [
        {
          children: cellConfig.reviewStatus.label,
          ...cellConfig.reviewStatus,
        },
        {
          children: cellConfig.createdAt.label,
          ...cellConfig.createdAt,
        },
        {
          children: cellConfig.certifyType.label,
          ...cellConfig.certifyType,
        },
        {
          children: cellConfig.itemName.label,
          ...cellConfig.itemName,
        },
        {
          children: cellConfig.size.label,
          ...cellConfig.size,
        },
        {
          children: cellConfig.doorModel.label,
          ...cellConfig.doorModel,
        },
        {
          children: cellConfig.qty.label,
          ...cellConfig.qty,
        },
        {
          children: null,
          ...cellConfig.btn,
        },
      ],
    };

    const rowArr = [
      {
        minHeight: tableConfig.row.minHeight,
        onClick: () => {},
        cellArr: [
          {
            children: '已審核',
            width: cellConfig.reviewStatus.width,
          },
          {
            children: '2021-09-01',
            ...cellConfig.createdAt,
          },
          {
            children: '防火影本開立證明文件',
            ...cellConfig.certifyType,
          },
          {
            children: 'SD-111',
            ...cellConfig.itemName,
          },
          {
            children: '200 * 200 + 200',
            ...cellConfig.size,
          },
          {
            children: 'SJ-305D',
            ...cellConfig.doorModel,
          },
          {
            children: '99',
            ...cellConfig.qty,
          },
          {
            children: <IconDetail />,
            ...cellConfig.btn,
          },
        ],
      },
    ];

    const tbody = {
      rowArr: [...rowArr, ...rowArr, ...rowArr, ...rowArr, ...rowArr],
    };

    return {
      thead,
      tbody,
      haveBorder: false,
    };
  }, []);

  // ========================================================================
  const tabArr: Ttab[] = [
    {
      label: '防火證明',
      isActive: certifyType === 'fireproof',
      // className: ,
      // style: ,
      onClick: () => {
        router.push({
          query: {
            ...query,
            documentType: 'fireproof',
          },
        });
      },
    },
    {
      label: '出廠證明',
      isActive: certifyType === 'factory',
      // className: ,
      // style: ,
      onClick: () => {
        router.push({
          query: {
            ...query,
            documentType: 'factory',
          },
        });
      },
    },
    {
      label: '保固證明',
      isActive: certifyType === 'warranty',
      // className: ,
      // style: ,
      onClick: () => {
        router.push({
          query: {
            ...query,
            documentType: 'warranty',
          },
        });
      },
    },
  ];

  return (
    <Wrapper_tab
      className={classNames(className)}
      tabArr={tabArr}
      childrenOption={{
        noBorderTop: true,
      }}
      stickyTop={{
        top: 40,
      }}
    >
      <Table01 {...control_table} />
    </Wrapper_tab>
  );
}

// ====================================================================

type TcellKeyArr =
  | 'reviewStatus'
  //
  | 'createdAt'
  | 'certifyType'
  | 'itemName'
  | 'size'
  | 'doorModel'
  | 'qty'
  | 'btn';

const tableConfig = {
  row: {
    minHeight: '40px',
  },
};

const cellConfig: { [key in TcellKeyArr]: Tconfig_table } = {
  reviewStatus: {
    label: '狀態',
    width: 100,
    justifyContent: 'center',
  },
  createdAt: {
    label: '開立日期',
    width: 150,
    justifyContent: 'center',
  },
  certifyType: {
    label: '開立項目',
    width: 'auto',
    flex: 'auto',
    justifyContent: 'center',
  },
  itemName: {
    label: '項目',
    width: 150,
    justifyContent: 'center',
  },
  size: {
    label: '尺寸',
    width: 150,
    justifyContent: 'center',
  },
  doorModel: {
    label: '門型',
    width: 100,
    justifyContent: 'center',
  },
  qty: {
    label: '數量',
    width: 60,
    justifyContent: 'center',
  },
  btn: {
    width: 60,
    justifyContent: 'center',
  },
};
