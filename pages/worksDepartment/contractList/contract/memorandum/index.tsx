import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import Table01, { Ttable } from 'components/global/gear/table/table01';
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';

// icon
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// api
import { useGetContract_id } from 'js/api/api_quotation';

import { useGetMemorandum } from 'js/api/api_memorandum';

// type
import { Tparams } from 'js/api/dtoTypes';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// ============================================================================

type Tquery = {
  contractId: string | undefined;
  memotype:
    | 'all'
    | 'recived' // 收件
    | 'sent'; // 寄件
};

// ============================================================================
export default function Memorandum() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { contractId, memotype = 'all' } = query;

  // ---------------------------------------------------------------------------

  // 合約
  const {
    data: contract,
    update: update_contract,
    contactThatSkipContract,
    isFetching: isFetching_contract,
  } = useGetContract_id(contractId, {
    customPopulate: ['engineeringContact'],
  });

  const { engineeringContact } = contract ?? {};

  const params: Tparams = {
    populate: ['poster', 'recipient'],
    filter: {
      isPoster: { $eq: memotype === 'sent' ? true : memotype === 'recived' ? false : undefined },
      isRootMail: { $eq: true },
    },
  };

  const {
    isFetching: isFetching_memorandum,
    data: data_memorandum,
    update: update_memorandum,
  } = useGetMemorandum<{
    poster: true;
    recipient: true;
  }>(contractId, { customParams: params });

  // ---------------------------------------------------------------------------
  useEffect(() => {
    update_contract();
  }, [contractId]);

  useEffect(() => {
    update_memorandum();
  }, [contractId, memotype]);

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
        {
          children: null,
          width: cellCofig.detail.width,
        },
      ],
    };

    const bodyRowArr = (data_memorandum ?? []).map((data) => {
      const {
        id,
        // createdAt,
        // updatedAt,
        // posterId,
        poster,
        postDate,
        // recipientId,
        recipient,
        // date,
        // replyDate,
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

      let replyDate: string | null = null;

      if (isPoster) {
        replyDate = postDate;
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
          {
            children: (
              <>
                <span>{getTaiwanDateStr(replyDate || null)}</span>
                <br />
                <span>{poster?.name}</span>
              </>
            ),
            width: cellCofig.reply.width,
            className: 'text-center',
          },
          {
            children: (
              <IconDetail
                onClick={() => {
                  router.push({
                    pathname: '/worksDepartment/contractList/contract/memorandum/edit',
                    query: {
                      contractId,
                      memorandumId: id,
                      memotype,
                    },
                  });
                }}
              />
            ),
            width: cellCofig.detail.width,
          },
        ],
      };

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
            memotype,
          },
        });
      },
    },
  ];

  // ---------------------------------------------------------------------------
  return (
    <SubLayer bodyOverflowY="scroll" isLoading_subLayer={isFetching_memorandum || isFetching_contract}>
      <PageHeader
        panelList={panelList}
        contractNumber={engineeringContact?.contractNumber ?? ''}
        contactThatSkipContract={contactThatSkipContract}
      />
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
    label: '回簽日期',
    width: '150px',
  },
  detail: {
    label: '',
    width: '50px',
  },
};

// ============================================================================
