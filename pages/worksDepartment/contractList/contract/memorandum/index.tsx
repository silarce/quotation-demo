import { useState } from 'react';
import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import Table01, { Ttable } from 'components/global/gear/table/table01';
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// ============================================================================

type TtabState = 'all' | 'recived' | 'sent';

// ============================================================================
export default function Memorandum() {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  const [tabState, setTabState] = useState<TtabState>('all');

  // ---------------------------------------------------------------------------

  const tabArr: Ttab[] = [
    {
      label: '全部公文',
      isActive: tabState === 'all',
      onClick: () => {
        setTabState('all');
      },
    },
    {
      label: '收信匣',
      isActive: tabState === 'recived',

      onClick: () => {
        setTabState('recived');
      },
    },
    {
      label: '寄信匣',
      isActive: tabState === 'sent',
      onClick: () => {
        setTabState('sent');
      },
    },
  ];

  // ---------------------------------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '新增',
      onClick: () => {
        router.push('/worksDepartment/contractList/contract/memorandum/edit');
      },
    },
  ];

  // ---------------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader contractNumber={'foooo'} panelList={panelList} />
      <div>
        <Wrapper_tab
          className={'m-auto'}
          childrenOption={{
            noBorderTop: true,
          }}
          tabArr={tabArr}
          stickyTop={{
            top: 40,
          }}
        >
          <Table01 {...fakeTable} />
        </Wrapper_tab>

        <br />
        <br />
      </div>
    </SubLayer>
  );
}

// ============================================================================

// ============================================================================

type TcellConfig = {
  [key: string]: {
    label: string;
    width?: React.CSSProperties['width'];
    flex?: React.CSSProperties['flex'];
  };
};

const tableConfig = {
  row: {
    minHeight: '60px',
  },
};

const cellCofig: TcellConfig = {
  sentDate: {
    label: '發文日期',
    width: '100px',
  },
  sentNumber: {
    label: '發文字號',
    width: '250px',
  },
  reciver: {
    label: '受文者',
    width: '250px',
  },
  subject: {
    label: '主旨',
    flex: 'auto',
  },
  reply: {
    label: '回簽',
    width: '150px',
  },
};

const fakeThead: Ttable['thead'] = {
  stickyTop: {
    top: '90px',
  },
  rowProps: {
    minHeight: tableConfig.row.minHeight,
  },
  cellArr: [
    {
      children: cellCofig.sentDate.label,
      width: cellCofig.sentDate.width,
    },
    {
      children: cellCofig.sentNumber.label,
      width: cellCofig.sentNumber.width,
    },
    {
      children: cellCofig.reciver.label,
      width: cellCofig.reciver.width,
    },
    {
      children: cellCofig.subject.label,
      flex: cellCofig.subject.flex,
    },
    {
      children: cellCofig.reply.label,
      width: cellCofig.reply.width,
    },
  ],
};

const fakeTbody: Ttable['tbody'] = {
  rowArr: [
    {
      minHeight: tableConfig.row.minHeight,
      cellArr: [
        {
          children: '112/1/2',
          width: cellCofig.sentDate.width,
        },
        {
          children: '三建工(112)年第11205321號',
          width: cellCofig.sentNumber.width,
        },
        {
          children: '皇昌營造股份有限公司',
          width: cellCofig.reciver.width,
        },
        {
          children: `捲門安裝位置，\n相關管線及障礙物須諸貴公司協助修改。`,
          flex: cellCofig.subject.flex,
        },
        {
          children: <MyButton_v2 label="回簽" />,
          width: cellCofig.reply.width,
        },
      ],
    },
    {
      minHeight: tableConfig.row.minHeight,
      onClick: () => {
        alert('foooo');
      },
      cellArr: [
        {
          children: '112/1/2',
          width: cellCofig.sentDate.width,
        },
        {
          children: '三建工(112)年第11205321號',
          width: cellCofig.sentNumber.width,
        },
        {
          children: '皇昌營造股份有限公司',
          width: cellCofig.reciver.width,
        },
        {
          children: `捲門安裝位置`,
          flex: cellCofig.subject.flex,
        },
        {
          children: '112/1/3 珮宸',
          width: cellCofig.reply.width,
        },
      ],
    },
    {
      minHeight: tableConfig.row.minHeight,
      cellArr: [
        {
          children: '112/1/2',
          width: cellCofig.sentDate.width,
        },
        {
          children: '三建工(112)年第11205321號',
          width: cellCofig.sentNumber.width,
        },
        {
          children: '皇昌營造股份有限公司',
          width: cellCofig.reciver.width,
        },
        {
          children: `捲門安裝位置`,
          flex: cellCofig.subject.flex,
        },
        {
          children: <MyButton_v2 label="回簽" px="px28" py="py6" />,
          width: cellCofig.reply.width,
        },
      ],
    },
    {
      minHeight: tableConfig.row.minHeight,
      cellArr: [
        {
          children: '112/1/2',
          width: cellCofig.sentDate.width,
        },
        {
          children: '三建工(112)年第11205321號',
          width: cellCofig.sentNumber.width,
        },
        {
          children: '皇昌營造股份有限公司',
          width: cellCofig.reciver.width,
        },
        {
          children: `捲門安裝位置\n捲門安裝位置\n捲門安裝位置\n捲門安裝位置\n`,
          flex: cellCofig.subject.flex,
        },
        {
          children: <MyButton_v2 label="回簽" px="px28" py="py6" />,
          width: cellCofig.reply.width,
        },
      ],
    },
  ],
};

const fakeTable: Ttable = {
  thead: fakeThead,
  tbody: fakeTbody,
};
