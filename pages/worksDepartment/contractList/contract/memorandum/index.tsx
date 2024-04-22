import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import Table01, { Ttable } from 'components/global/gear/table/table01';
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// api
import { useGetContract_id } from 'js/api/api_quotation';
import {
  // TupdateEngineeringDeliveryList,
  // TupdateDeliveryStatus,
  TupdateEngineeringDeliveryStatusDto,
  TcreateEngineeringDeliveryStatusDto,
  useGetEngineeringContact,
  useGetEngineeringDeliveryList,
  apiPatchEngineeringDeliveryList,
  apiPostDeliveryStatus,
  apiPatchDeliveryStatus,
  apiDeleteDeliveryStatus,
} from 'js/api/api_engineering';

// type
import { TmemorandumDto, TcustomerDto } from 'js/api/dtoTypes';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// ============================================================================

type Tquery = {
  contractId: string | undefined;
  memotype:
    | 'all'
    | 'recived' // 收件
    | 'sent'; // 寄件
};

type TmemorandumDto_whole = TmemorandumDto<{
  poster: true;
  recipient: true;
}>;

// ============================================================================
export default function Memorandum() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { contractId, memotype = 'all' } = query;

  // ---------------------------------------------------------------------------

  // 合約
  const {
    //
    data: contract,
    update: update_contract,
  } = useGetContract_id(contractId, {
    customPopulate: ['engineeringContact'],
  });

  const { engineeringContact } = contract ?? {};

  const [data_memorandum] = useState<TmemorandumDto_whole[]>(fake_memorandumArr);

  // ---------------------------------------------------------------------------
  useEffect(() => {
    update_contract();
  }, []);
  // ---------------------------------------------------------------------------

  const control_table = useMemo(() => {
    const thead: Ttable['thead'] = {
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

    const bodyRowArr = data_memorandum.map((data) => {
      const {
        id,
        // createdAt,
        // updatedAt,
        // posterId,
        poster,
        // recipientId,
        recipient,
        // date,
        replyDate,
        issueNumber,
        purpose,
        // description,
        isPoster,
      } = data;

      if (memotype === 'recived' && isPoster) {
        return null;
      }

      if (memotype === 'sent' && !isPoster) {
        return null;
      }

      const props: Ttable['tbody']['rowArr'][number] = {
        minHeight: tableConfig.row.minHeight,
        cellArr: [
          {
            // 暫時先放createdAt，後端計畫要加property紀錄發文日期
            children: getTaiwanDateStr(data.createdAt),
            width: cellCofig.sentDate.width,
          },
          {
            children: issueNumber,
            width: cellCofig.sentNumber.width,
          },
          {
            children: recipient?.name ?? '',
            width: cellCofig.reciver.width,
          },
          {
            children: purpose,
            flex: cellCofig.subject.flex,
          },
        ],
      };

      if (data.replyDate) {
        const str = `${getTaiwanDateStr(replyDate || null)} ${poster?.name}`;
        props.cellArr.push({
          children: str,
          width: cellCofig.reply.width,
          className: 'text-center',
        });

        props.onClick = () => {
          router.push({
            pathname: '/worksDepartment/contractList/contract/memorandum/edit',
            query: {
              contractId,
              memorandumId: id,
            },
          });
        };
      } else {
        props.cellArr.push({
          children: (
            <MyButton_v2
              label="回簽"
              px="px28"
              py="py6"
              onClick={() => {
                router.push({
                  pathname: '/worksDepartment/contractList/contract/memorandum/edit',
                  query: {
                    contractId,
                    memorandumId: id,
                  },
                });
              }}
            />
          ),
          width: cellCofig.reply.width,
        });
      }

      return props;
    });

    const control_table: Ttable = {
      haveBorder: false,
      thead,
      tbody: {
        rowArr: bodyRowArr,
      },
    };

    return control_table;
  }, [data_memorandum, memotype]);

  // ---------------------------------------------------------------------------

  const tabArr: Ttab[] = [
    {
      label: '全部公文',
      isActive: memotype === 'all',
      onClick: () => {
        router.push({
          query: {
            ...query,
            memotype: 'all',
          },
        });
      },
    },
    {
      label: '收信匣',
      isActive: memotype === 'recived',
      onClick: () => {
        router.push({
          query: {
            ...query,
            memotype: 'recived',
          },
        });
      },
    },
    {
      label: '寄信匣',
      isActive: memotype === 'sent',
      onClick: () => {
        router.push({
          query: {
            ...query,
            memotype: 'sent',
          },
        });
      },
    },
  ];

  // ---------------------------------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '新增',
      onClick: () => {
        router.push({
          pathname: '/worksDepartment/contractList/contract/memorandum/edit',
          query: {
            contractId,
          },
        });
      },
    },
  ];

  // ---------------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader panelList={panelList} contractNumber={engineeringContact?.contractNumber ?? ''} />
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
          {/* <Table01 {...fakeTable} /> */}
          <Table01 {...control_table} />
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
          children: (
            <MyButton_v2
              label="回簽"
              px="px28"
              py="py6"
              onClick={() => {
                alert('回簽');
              }}
            />
          ),
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
          children: (
            <MyButton_v2
              label="回簽"
              px="px28"
              py="py6"
              onClick={() => {
                alert('回簽');
              }}
            />
          ),
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
          children: (
            <MyButton_v2
              label="回簽"
              px="px28"
              py="py6"
              onClick={() => {
                alert('回簽');
              }}
            />
          ),
          width: cellCofig.reply.width,
        },
      ],
    },
  ],
};

const fakeTable: Ttable = {
  thead: fakeThead,
  tbody: fakeTbody,
  haveBorder: false,
};

// ============================================================================

const fake_memorandumArr: TmemorandumDto_whole[] = [
  {
    id: '001',
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    posterId: 'p001',
    poster: { id: 'p001', name: 'poster001' } as TcustomerDto,
    recipientId: 'r001',
    recipient: { id: 'r001', name: '受文者11111111111' } as TcustomerDto,
    replyDate: '2021-09-01T00:00:00.000Z',
    issueNumber: 'IN-001',
    purpose: '主旨11111111',
    description: 'aaaaaaaa',
    isPoster: true,
  },
  {
    id: '002',
    createdAt: '2022-08-01T00:00:00.000Z',
    updatedAt: '2022-08-01T00:00:00.000Z',
    posterId: 'p002',
    poster: { id: 'p002', name: 'poster002' } as TcustomerDto,
    recipientId: 'recipient002',
    recipient: { id: 'r002', name: '受文者22222222' } as TcustomerDto,
    // replyDate: '2022-08-01T00:00:00.000Z',
    issueNumber: 'IN-002',
    purpose: '主旨2222222',
    description: 'bbbbbb',
    isPoster: false,
  },
  {
    id: '003',
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
    posterId: 'p003',
    poster: { id: 'p003', name: 'poster003' } as TcustomerDto,
    recipientId: 'recipient003',
    recipient: { id: 'r003', name: '受文者33333333' } as TcustomerDto,
    replyDate: '2025-02-01T00:00:00.000Z',
    issueNumber: 'IN-003',
    purpose: '主旨3333333',
    description: 'ccccccc',
    isPoster: false,
  },
];
