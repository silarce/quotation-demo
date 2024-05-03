import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';

import classNames from 'classnames';

// component
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';

// gear
import ProcessChain, { Tcontrol_processChain } from 'components/global/gear/processChain';

// icon
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './certifiedDocumentList.module.scss';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// api
import { Tparams, TdocType, useGetCertificatedDoc } from 'js/api/api_certificated-doc';

// ===================================== ========================================

type Tquery = {
  documentType: undefined | TdocType;
};

// =============================================================================
export default function CertifiedDocumentList({
  showDocType,
  className,
  defaultDocumentType = '防火證明',
}: {
  showDocType?: TdocType[];
  className?: string;
  defaultDocumentType?: TdocType;
}) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { documentType = defaultDocumentType } = query;

  // ========================================================================

  const params: Tparams = {
    populate: [
      'products',
      'reviewGuarantorEmployee',
      'reviewAccountingEmployee',
      'reviewAuditorEmployee',
      'reviewManagerEmployee',
      'agentEmployee',
    ],

    filter: {
      docStyle: { $eq: documentType },
    },
  };

  const { data: data_certificatedDocArr = [], update: update_certificatedDoc } = useGetCertificatedDoc(params);

  // ========================================================================

  const control_table: Ttable = useMemo(() => {
    //
    const thead: Ttable['thead'] = {
      stickyTop: {
        top: '90px',
      },
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
        // {
        //   children: cellConfig.itemName.label,
        //   ...cellConfig.itemName,
        // },
        // {
        //   children: cellConfig.size.label,
        //   ...cellConfig.size,
        // },
        // {
        //   children: cellConfig.doorModel.label,
        //   ...cellConfig.doorModel,
        // },
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

    const tbodyRowArr: Ttable['tbody']['rowArr'] = data_certificatedDocArr.map((data) => {
      const {
        id,
        createdAt,

        // projectNumber,
        // contractor, // 承包商
        // payment, // 本期請款
        // paymentDate,
        // applicationDate, // 申請日期
        // projectName,
        // valuation, // 本期計價
        // retainage, // 保留款
        // disbursementDate, // 放款日
        // warrantyDate, // 保固日
        // description,
        // note,

        docStyle, // 文件種類
        // snapShot, // 證明書開立快照

        // status, // 狀態(審核中/審核完成尚未用印/已印出)

        products, // 開立產品

        toGuarantorAt,
        reviewGuarantorEmployee,
        guarantorReviewedAt,

        toAccountingAt,
        reviewAccountingEmployee,
        accountingReviewedAt,

        toAuditorAt,
        reviewAuditorEmployee,
        auditorReviewedAt,

        toManagerAt,
        reviewManagerEmployee,
        managerReviewedAt,

        agentEmployee,

        // contractId,
        // contract,
      } = data;

      const qty = products.length;

      const control_processChain: Tcontrol_processChain = {
        statusArr: [
          {
            label: `製表 ${agentEmployee?.chName ?? ''}`,
            dotColor: 'green',
          },
          {
            label: `擔保 ${reviewGuarantorEmployee?.chName ?? ''}`,
            dotColor: checkReview(toGuarantorAt, guarantorReviewedAt),
          },
          {
            label: `會計 ${reviewAccountingEmployee?.chName ?? ''}`,
            dotColor: checkReview(toAccountingAt, accountingReviewedAt),
          },
          {
            label: `審核 ${reviewAuditorEmployee?.chName ?? ''}`,
            dotColor: checkReview(toAuditorAt, auditorReviewedAt),
          },
          {
            label: `總經理 ${reviewManagerEmployee?.chName ?? ''}`,
            dotColor: checkReview(toManagerAt, managerReviewedAt),
          },
        ],
      };

      return {
        minHeight: tableConfig.row.minHeight,
        // onClick: () => {},
        className: scss.row,
        cellArr: [
          {
            children: 'status',
            width: cellConfig.reviewStatus.width,
          },
          {
            children: getTaiwanDateStr(createdAt),
            ...cellConfig.createdAt,
          },
          {
            children: docStyle,
            ...cellConfig.certifyType,
          },
          // {
          //   children: 'SD-111',
          //   ...cellConfig.itemName,
          // },
          // {
          //   children: '200 * 200 + 200',
          //   ...cellConfig.size,
          // },
          // {
          //   children: 'SJ-305D',
          //   ...cellConfig.doorModel,
          // },
          {
            children: qty,
            ...cellConfig.qty,
          },
          {
            children: (
              <IconDetail
                onClick={() => {
                  router.push({
                    query: {
                      ...query,
                      editCertifiedDocument: 'true',
                      certifiedDocumentId: id,
                    },
                  });
                }}
              />
            ),
            ...cellConfig.btn,
          },
          {
            children: <ProcessChain control={control_processChain} />,
            className: classNames(scss.processChainCell, scss.plus),
            style: {
              flex: '0 0 100%',
            },
          },
        ],
      };
    });

    const tbody = {
      rowArr: tbodyRowArr,
    };

    return {
      thead,
      tbody,
      haveBorder: false,
    };
  }, []);

  // ========================================================================

  useEffect(() => {
    update_certificatedDoc();
  }, [documentType]);

  // ========================================================================
  let tabArr: Ttab[] = [
    {
      label: '防火證明',
      isActive: documentType === '防火證明',
      // className: ,
      // style: ,
      onClick: () => {
        router.replace({
          query: {
            ...query,
            documentType: '防火證明',
          },
        });
      },
    },
    {
      label: '出廠證明',
      isActive: documentType === '出廠證明',
      // className: ,
      // style: ,
      onClick: () => {
        router.replace({
          query: {
            ...query,
            documentType: '出廠證明',
          },
        });
      },
    },
    {
      label: '保固書',
      isActive: documentType === '保固書',
      // className: ,
      // style: ,
      onClick: () => {
        router.replace({
          query: {
            ...query,
            documentType: '保固書',
          },
        });
      },
    },
  ];

  if (showDocType) {
    tabArr = tabArr.filter((tab) => showDocType.includes(tab.label as TdocType));
  }

  return (
    <div>
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
    </div>
  );
}

// ====================================================================

const checkReview = (toAt: string | null | undefined, reviewedAt: string | null | undefined) => {
  if (reviewedAt) {
    return 'green';
  }

  if (!reviewedAt && toAt) {
    return 'red';
  }

  return 'gray';
};

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
