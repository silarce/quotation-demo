import { useEffect, useContext } from 'react';
import { useRouter, NextRouter } from 'next/router';

// components
import BudgeList from 'components/page/domestic/budget/budgetList';

// global gear
import PageHeader02, { TpanelList, Tlink } from 'components/PageHeader/PageHeader02/PageHeader02';

// css
import scss from './index.module.scss';

// api
import { Tparams, useGetQuotation_detail_infinite } from 'js/api/api_quotation';

// option lookup
import { optionsCreator_county, Toption } from 'js/utils/options/countryAndDistrict';
import { quotationStatusLookup } from 'config/lookupTable';

// context
import { useGlobal_userInfo } from 'hooks/globalState/useGlobal_userInfo';

import { TquotationStatus } from 'js/api/dtoTypes';

import { useGlobal_optionalConfig } from 'hooks/globalState/useGlobal_OptionalConfig';

// ===========================================================

type Tquery = {
  county: string | undefined;
  customerName: string | undefined;
  keyWord: string | undefined;
  reviewStatus: string | undefined;
  status: TquotationStatus | undefined;
};

// ===========================================================

const optionsCounty = optionsCreator_county();
optionsCounty.unshift({ value: '', label: '不拘' });

// ===========================================================

export default function QuotationList({ userGrade }: { userGrade: number }) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { county, customerName, keyWord: keyWord, reviewStatus, status } = query;

  const { userInfo } = useGlobal_userInfo();
  const userEmp = userInfo?.employee;
  let userId = userEmp?.id;

  if (userGrade >= 14) {
    userId = undefined;
  }

  const { quotationPathList } = useGlobal_optionalConfig();

  // ----------------------------------------------------
  //

  // 待審核
  const filter = createFilter({
    reviewStatus,
    status,
    userId,
  });

  const params: Tparams = {
    // sort: 'updatedAt',
    sort: 'latestContent.quotationDate',
    order: 'DESC',
    populate: [
      // 'contents.agentEmployee',
      // 'contents.reviewSalesEmployee',
      // 'contents.reviewWorkDirectorEmployee',
      // 'contents.reviewSupervisorEmployee',
      // 'contents.reviewManagerEmployee',

      // 'contents',

      'quotationList',
      'attachedToContract',

      'latestContent.agentEmployee',
      'latestContent.reviewSalesEmployee',
      'latestContent.reviewWorkDirectorEmployee',
      'latestContent.reviewSupervisorEmployee',
      // 'latestContent.reviewSalesManagerEmployee',
      'latestContent.reviewCashierEmployee',
      'latestContent.reviewManagerEmployee',

      'latestContent.customer',
    ],
    filter: {
      'latestContent.status': {
        // $eq: status,
        $in: [status, status === 'Pending' ? 'TempPending' : undefined],
      },
      'latestContent.county': {
        $contains: county || undefined,
      },
      'latestContent.customer.name': {
        $contains: customerName || undefined,
      },
      $or: {
        'latestContent.projectName': {
          $contains: keyWord || undefined,
        },
        'latestContent.quotationNumber': {
          $contains: keyWord || undefined,
        },
      },
      'latestContent.isLost': { $eq: false },
      // ...reviewStatusFilter,
      ...filter,
    },
  };

  const {
    //
    dataArr: quoatationArr,
    viewRef_bottom,
    isLoadingPage1,
    // isLoading,
    reset,
  } = useGetQuotation_detail_infinite({ customParams: params });

  useEffect(() => {
    reset();
  }, [router.query]);

  // ----------------------------------------------------------
  // panelList

  const searchTargetList = [
    {
      options: optionsCounty,
      placeholder: '選擇地區',
      width: '80px',
      defaultValue: query.county,
    },
    {
      placeholder: '請輸入客戶名稱',
      defaultValue: query.customerName,
    },
    {
      placeholder: '請輸入專案名稱或報價單編號',
      defaultValue: query.keyWord,
    },
  ];

  const doSearch = (valueArr: (string | Toption | null)[]) => {
    // const doorType = (valueArr[0] as Toption).value;
    const county = (valueArr[0] as Toption).value;
    const customerName = valueArr[1] as string;
    const keyWord = valueArr[2] as string;

    router.replace({
      query: {
        ...query,
        county,
        customerName,
        keyWord,
      },
    });
  };

  const searchGroup = {
    searchTargetList,
    doSearch,
  };

  // ----------------------------------------------------------

  // const attatchBtn = {
  //   type: 'myButton',
  //   label: '追加追減',
  //   onClick: () => {
  //     setContractSelectShow(true);
  //   },
  // } as const;

  const panelList: TpanelList = [
    { searchGroup },
    // status === 'Contracting' ? attatchBtn : null,
    {
      type: 'addButton',
      label: '新增報價單',
      onClick: () => {
        router.push({
          // pathname: `/domestic/quotationList/quotation`,
          // pathname: isRefactoredQuotaion ? optionalConfig.path_refactoredQuotation : optionalConfig.path_oldQuotation,
          pathname: quotationPathList.path_quotation,
          query: {
            status,
          },
        });
      },
    },
  ];

  // ----------------------------------------------------------

  return (
    <div>
      <PageHeader02 tag={status ? quotationStatusLookup[status] : '--'} panelList={panelList} />
      <div>
        <ApprovalsBar router={router} />
        <BudgeList className="m-[4px] mt-0" quotationArr={quoatationArr} viewRef_bottom={viewRef_bottom} />
      </div>
      {/* <ContractSelector
        showModal={contractSelectShow}
        onConfirm={(v) => {
          if (!v[0]) {
            return;
          }

          router.push({
            pathname: '/domestic/contract/attachContract',
            query: {
              contractId: v[0].id,
            },
          });
        }}
        onCancel={() => setContractSelectShow(false)}
      /> */}
    </div>
  );
}

// ========================================================

const ApprovalsBar = ({ router }: { router: NextRouter }) => {
  const query = router.query;
  const linkList: Tlink[] = [
    {
      label: '待審核',
      linkProps: {
        replace: true,
        href: {
          query: {
            ...query,
            reviewStatus: '待審核',
          },
        },
      },
      isActive: !query.reviewStatus || query.reviewStatus === '待審核',
    },
    {
      label: '審核中',
      linkProps: {
        replace: true,
        href: {
          query: {
            ...query,
            reviewStatus: '審核中',
          },
        },
      },
      isActive: query.reviewStatus === '審核中',
    },
    {
      label: '審核完成',
      linkProps: {
        replace: true,
        href: {
          query: {
            ...query,
            reviewStatus: '審核完成',
          },
        },
      },
      isActive: query.reviewStatus === '審核完成',
    },
  ];

  return (
    <div className={scss.approvalsBar}>
      <PageHeader02 linkList={linkList} />
    </div>
  );
};
// =============================================================================

const createFilter = ({
  //
  reviewStatus,
  status,
  userId,
}: {
  //
  reviewStatus: string | undefined;
  status: TquotationStatus | undefined;
  userId: string | undefined;
}) => {
  // agent 經辦
  // reviewSales 業務
  // reviewSupervisor 業務主管
  // reviewSalesManager 業務經理
  // reviewWorkDirector 應收帳款
  //  reviewCashier 也是 應收帳款
  // reviewManager 總經理

  if (!reviewStatus || reviewStatus === '待審核') {
    // 準合約階段
    if (status === 'Pending' || status === 'TempPending') {
      return {
        // 使用者為經辦或審核業務
        $or: {
          'latestContent.agentEmployee.id': { $eq: userId },
          'latestContent.reviewSalesEmployee.id': { $eq: userId },
        },
        // 還沒送審給業務以外的任一階段審核者
        $and: {
          // 'latestContent.toSalesAt': { $null: true },
          'latestContent.toSupervisorAt': { $null: true },
          // 'latestContent.toSalesManagerAt': { $null: true },
          'latestContent.toWorkDirectorAt': { $null: true },
          'latestContent.cashierReviewedAt': { $null: true },
          'latestContent.toManagerAt': { $null: true },
        },
      };
    }

    //  預算、投標、發包階段
    return {
      // 使用者為經辦
      'latestContent.agentEmployee.id': { $eq: userId },
      // 還沒送審給任一階段審核者
      $and: {
        'latestContent.toSalesAt': { $null: true },
        'latestContent.toSupervisorAt': { $null: true },
        // 'latestContent.toSalesManagerAt': { $null: true },
        'latestContent.toWorkDirectorAt': { $null: true },
        'latestContent.cashierReviewedAt': { $null: true },
        'latestContent.toManagerAt': { $null: true },
      },
    };
  }

  // _____________________________________________
  if (reviewStatus === '審核中') {
    // 如果在 預算 或 投標 或 發包 階段
    if (status === 'Budget' || status === 'Bidding' || status === 'Contracting') {
      return {
        // 同時滿足兩個條件
        $and: {
          // 1 使用者為經辦或任一階段的審核者，WorkDirector與cashier除外
          '1': {
            $or: {
              'latestContent.agentEmployee.id': { $eq: userId },
              'latestContent.reviewSalesEmployee.id': { $eq: userId },
              'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
              // 'latestContent.reviewSalesManagerEmployee.id': { $eq: userId },
              // 'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
              'latestContent.reviewManagerEmployee.id': { $eq: userId },
            },
          },
          // 2 報價單已送審審核業務或業務主管或業務經理
          '2': {
            $or: {
              'latestContent.toSalesAt': { $notNull: true },
              'latestContent.toSupervisorAt': { $notNull: true },
              // 'latestContent.toSalesManagerAt': { $notNull: true },
              'latestContent.toManagerAt': { $notNull: true },
            },
          },
          // // 3 報價單沒有同時被 審核業務 業務主管 業務經理 審核過
          // 3 報價單沒有被總經理審核過
          '3': {
            // $or: {
            //   'latestContent.salesReviewedAt': { $null: true },
            //   'latestContent.supervisorReviewedAt': { $null: true },
            //   'latestContent.salesManagerReviewedAt': { $null: true },
            //   'latestContent.managerReviewedAt': { $null: true },
            // },
            'latestContent.managerReviewedAt': { $null: true },
          },
        },
      };
    }

    // 準合約階段
    return {
      // 同時滿足3個條件
      $and: {
        // 1 使用者為經辦或任一階段的審核者
        '1': {
          $or: {
            'latestContent.agentEmployee.id': { $eq: userId },
            'latestContent.reviewSalesEmployee.id': { $eq: userId },
            'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
            // 'latestContent.reviewSalesManagerEmployee.id': { $eq: userId },
            'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
            'latestContent.reviewCashierEmployee.id': { $eq: userId },
            'latestContent.reviewManagerEmployee.id': { $eq: userId },
          },
        },
        // 2 報價單已送審給任一階段的審核者(除了業務)
        '2': {
          $or: {
            // 'latestContent.toSalesAt': { $notNull: true },
            'latestContent.toSupervisorAt': { $notNull: true },
            // 'latestContent.toSalesManagerAt': { $notNull: true },
            'latestContent.toWorkDirectorAt': { $notNull: true },
            'latestContent.toCashierAt': { $notNull: true },
            'latestContent.toManagerAt': { $notNull: true },
          },
        },
        // // 3 報價單有任一審核者沒有審核過
        // 3 總經理沒有審核過
        '3': {
          // $or: {
          //   'latestContent.salesReviewedAt': { $null: true },
          //   'latestContent.supervisorReviewedAt': { $null: true },
          //   'latestContent.salesManagerReviewedAt': { $null: true },
          //   'latestContent.workDirectorReviewedAt': { $null: true },
          //   'latestContent.managerReviewedAt': { $null: true },
          // },
          'latestContent.managerReviewedAt': { $null: true },
        },
      },
    };
  }

  // _____________________________________________
  if (reviewStatus === '審核完成') {
    // 如果在 預算 投標 發包 階段
    if (status === 'Budget' || status === 'Bidding' || status === 'Contracting') {
      return {
        $and: {
          // 1 使用者為經辦或任一階段的審核者 WorkDirector與cashier除外
          '1': {
            $or: {
              'latestContent.agentEmployee.id': { $eq: userId },
              'latestContent.reviewSalesEmployee.id': { $eq: userId },
              'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
              // 'latestContent.reviewSalesManagerEmployee.id': { $eq: userId },
              // 'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
              'latestContent.reviewManagerEmployee.id': { $eq: userId },
            },
          },
          // // 2 報價單被 業務 業務主管 業務經理 審核過
          //  2 報價單被總經理審核過
          '2': {
            // $and: {
            //   'latestContent.salesReviewedAt': { $notNull: true },
            //   'latestContent.supervisorReviewedAt': { $notNull: true },
            //   'latestContent.salesManagerReviewedAt': { $notNull: true },
            //   'latestContent.managerReviewedAt': { $notNull: true },
            // },
            'latestContent.managerReviewedAt': { $notNull: true },
          },
        },
      };
    }

    // 準合約階段
    return {
      $and: {
        // 1 使用者為經辦或任一階段的審核者
        '1': {
          $or: {
            'latestContent.agentEmployee.id': { $eq: userId },
            'latestContent.reviewSalesEmployee.id': { $eq: userId },
            'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
            // 'latestContent.reviewSalesManagerEmployee.id': { $eq: userId },
            'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
            'latestContent.reviewCashierEmployee.id': { $eq: userId },
            'latestContent.reviewManagerEmployee.id': { $eq: userId },
          },
        },
        // // 2 報價單被所有審核者審核過\
        // 2 報價單被總經理審核過
        '2': {
          // $and: {
          //   'latestContent.salesReviewedAt': { $notNull: true },
          //   'latestContent.supervisorReviewedAt': { $notNull: true },
          //   'latestContent.salesManagerReviewedAt': { $notNull: true },
          //   'latestContent.workDirectorReviewedAt': { $notNull: true },
          //   'latestContent.managerReviewedAt': { $notNull: true },
          // },
          'latestContent.managerReviewedAt': { $notNull: true },
        },
      },
    };
  }

  // _____________________________________________
  return {};
};

// 舊的filter 留做參考又或許未來某天會拿出來用
// 要注意的是，裡面忘記對cashier做處理
// const filter = (() => {
//   if (!reviewStatus || reviewStatus === '待審核') {
//     if (status === 'Pending' || status === 'TempPending') {
//       return {
//         // 使用者為經辦或審核業務
//         $or: {
//           'latestContent.agentEmployee.id': { $eq: userId },
//           'latestContent.reviewSalesEmployee.id': { $eq: userId },
//         },
//         // 還沒送審給業務以外的任一階段審核者
//         $and: {
//           // 'latestContent.toSalesAt': { $null: true },
//           'latestContent.toSupervisorAt': { $null: true },
//           'latestContent.toSalesManagerAt': { $null: true },
//           'latestContent.toWorkDirectorAt': { $null: true },
//           'latestContent.cashierReviewedAt': { $null: true },
//           'latestContent.toManagerAt': { $null: true },
//         },
//       };
//     }

//     return {
//       // 使用者為經辦
//       'latestContent.agentEmployee.id': { $eq: userId },
//       // 還沒送審給任一階段審核者
//       $and: {
//         'latestContent.toSalesAt': { $null: true },
//         'latestContent.toSupervisorAt': { $null: true },
//         'latestContent.toSalesManagerAt': { $null: true },
//         'latestContent.toWorkDirectorAt': { $null: true },
//         'latestContent.cashierReviewedAt': { $null: true },
//         'latestContent.toManagerAt': { $null: true },
//       },
//     };
//   }

//   // _____________________________________________
//   if (reviewStatus === '審核中') {
//     // 如果在預算或投標階段
//     if (status === 'Budget' || status === 'Bidding' || status === 'Contracting') {
//       return {
//         // 同時滿足兩個條件
//         $and: {
//           // 1 使用者為經辦或任一階段的審核者
//           '1': {
//             $or: {
//               'latestContent.agentEmployee.id': { $eq: userId },
//               'latestContent.reviewSalesEmployee.id': { $eq: userId },
//               'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
//               'latestContent.reviewSalesManagerEmployee.id': { $eq: userId },
//               'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
//               'latestContent.reviewManagerEmployee.id': { $eq: userId },
//             },
//           },
//           // 2 報價單已送審審核業務或業務主管或業務經理
//           '2': {
//             $or: {
//               'latestContent.toSalesAt': { $notNull: true },
//               'latestContent.toSupervisorAt': { $notNull: true },
//               'latestContent.toSalesManagerAt': { $notNull: true },
//               'latestContent.toManagerAt': { $notNull: true },
//             },
//           },
//           // 3 報價單沒有同時被 審核業務 業務主管 業務經理 審核過
//           '3': {
//             $or: {
//               'latestContent.salesReviewedAt': { $null: true },
//               'latestContent.supervisorReviewedAt': { $null: true },
//               'latestContent.salesManagerReviewedAt': { $null: true },
//               'latestContent.managerReviewedAt': { $null: true },
//             },
//           },
//         },
//       };
//     }

//     return {
//       // 同時滿足兩個條件
//       $and: {
//         // 1 使用者為經辦或任一階段的審核者
//         '1': {
//           $or: {
//             'latestContent.agentEmployee.id': { $eq: userId },
//             'latestContent.reviewSalesEmployee.id': { $eq: userId },
//             'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
//             'latestContent.reviewSalesManagerEmployee.id': { $eq: userId },
//             'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
//             'latestContent.reviewManagerEmployee.id': { $eq: userId },
//           },
//         },
//         // 2 報價單已送審給任一階段的審核者(除了業務)
//         '2': {
//           $or: {
//             // 'latestContent.toSalesAt': { $notNull: true },
//             'latestContent.toSupervisorAt': { $notNull: true },
//             'latestContent.toSalesManagerAt': { $notNull: true },
//             'latestContent.toWorkDirectorAt': { $notNull: true },
//             'latestContent.toManagerAt': { $notNull: true },
//           },
//         },
//         // 3 報價單有任一審核者沒有審核過
//         '3': {
//           $or: {
//             'latestContent.salesReviewedAt': { $null: true },
//             'latestContent.supervisorReviewedAt': { $null: true },
//             'latestContent.salesManagerReviewedAt': { $null: true },
//             'latestContent.workDirectorReviewedAt': { $null: true },
//             'latestContent.managerReviewedAt': { $null: true },
//           },
//         },
//       },
//     };
//   }

//   // _____________________________________________
//   if (reviewStatus === '審核完成') {
//     // 如果在預算或投標階段
//     if (status === 'Budget' || status === 'Bidding' || status === 'Contracting') {
//       return {
//         $and: {
//           // 1 使用者為經辦或任一階段的審核者
//           '1': {
//             $or: {
//               'latestContent.agentEmployee.id': { $eq: userId },
//               'latestContent.reviewSalesEmployee.id': { $eq: userId },
//               'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
//               'latestContent.reviewSalesManagerEmployee.id': { $eq: userId },
//               'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
//               'latestContent.reviewManagerEmployee.id': { $eq: userId },
//             },
//           },
//           // 2 報價單被 業務 業務主管 業務經理 審核過
//           '2': {
//             $and: {
//               'latestContent.salesReviewedAt': { $notNull: true },
//               'latestContent.supervisorReviewedAt': { $notNull: true },
//               'latestContent.salesManagerReviewedAt': { $notNull: true },
//               'latestContent.managerReviewedAt': { $notNull: true },
//             },
//           },
//         },
//       };
//     }

//     return {
//       $and: {
//         // 1 使用者為經辦或任一階段的審核者
//         '1': {
//           $or: {
//             'latestContent.agentEmployee.id': { $eq: userId },
//             'latestContent.reviewSalesEmployee.id': { $eq: userId },
//             'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
//             'latestContent.reviewSalesManagerEmployee.id': { $eq: userId },
//             'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
//             'latestContent.reviewManagerEmployee.id': { $eq: userId },
//           },
//         },
//         // 2 報價單被所有審核者審核過
//         '2': {
//           $and: {
//             'latestContent.salesReviewedAt': { $notNull: true },
//             'latestContent.supervisorReviewedAt': { $notNull: true },
//             'latestContent.salesManagerReviewedAt': { $notNull: true },
//             'latestContent.workDirectorReviewedAt': { $notNull: true },
//             'latestContent.managerReviewedAt': { $notNull: true },
//           },
//         },
//       },
//     };
//   }

//   // _____________________________________________
//   return {};
// })();
