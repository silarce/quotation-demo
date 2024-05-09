import { useState, useEffect, useContext } from 'react';
import { useRouter, NextRouter } from 'next/router';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
import BudgeList from 'components/page/domestic/budget/budgetList';

// global gear
import PageHeader02, { TpanelList, Tlink } from 'components/PageHeader/PageHeader02/PageHeader02';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';
import ContractSelector from 'components/global/gear/modal/contractSelector';

// css
import scss from './index.module.scss';

// api
import { Tparams, useGetQuotation_infinite, useGetQuotation_detail_infinite } from 'js/api/api_quotation';

// option lookup
import { optionsCreator_county, Toption } from 'js/utils/options/countryAndDistrict';
import { quotationStatusLookup } from 'config/lookupTable';

// context
import { AppContext } from 'pages/_app';

import { TquotationStatus } from 'js/api/dtoTypes';

// ===========================================================
// const optionDoorModel = optionsCreator_doorModel({ haveEmpty: true });
const optionsCounty = optionsCreator_county();
optionsCounty.unshift({ value: '', label: '不拘' });

// ===========================================================

export default function QuotationList({ userGrade }: { userGrade: number }) {
  const router = useRouter();
  const { county, customerName, projectName, reviewStatus } = router.query as { [key: string]: string };
  // Budget
  // Bidding
  // Contracting
  const status = router.query.status as TquotationStatus;

  const { userInfo } = useContext(AppContext);
  const userEmp = userInfo?.employee;
  let userId = userEmp?.id;

  if (userGrade >= 14) {
    userId = undefined;
  }

  // const [contractSelectShow, setContractSelectShow] = useState(false);

  // ----------------------------------------------------
  //
  // agent 經辦
  // reviewSales 業務
  // reviewSupervisor 業務主管
  // reviewWorkDirector 應收帳款
  // reviewManager 總經理

  // 待審核
  const filter = (() => {
    if (!reviewStatus || reviewStatus === '待審核') {
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
            'latestContent.toWorkDirectorAt': { $null: true },
            'latestContent.toManagerAt': { $null: true },
          },
        };
      }

      return {
        // 使用者為經辦
        'latestContent.agentEmployee.id': { $eq: userId },
        // 還沒送審給任一階段審核者
        $and: {
          'latestContent.toSalesAt': { $null: true },
          'latestContent.toSupervisorAt': { $null: true },
          'latestContent.toWorkDirectorAt': { $null: true },
          'latestContent.toManagerAt': { $null: true },
        },
      };
    }

    // _____________________________________________
    if (reviewStatus === '審核中') {
      // 如果在預算或投標階段
      if (status === 'Budget' || status === 'Bidding' || status === 'Contracting') {
        return {
          // 同時滿足兩個條件
          $and: {
            // 1 使用者為經辦或任一階段的審核者
            '1': {
              $or: {
                'latestContent.agentEmployee.id': { $eq: userId },
                'latestContent.reviewSalesEmployee.id': { $eq: userId },
                'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
                'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
                'latestContent.reviewManagerEmployee.id': { $eq: userId },
              },
            },
            // 2 報價單已送審審核業務或業務主管
            '2': {
              $or: {
                'latestContent.toSalesAt': { $notNull: true },
                'latestContent.toSupervisorAt': { $notNull: true },
                'latestContent.toManagerAt': { $notNull: true },
              },
            },
            // 3 報價單沒有同時被被審核業務與業務主管審核過
            '3': {
              $or: {
                'latestContent.salesReviewedAt': { $null: true },
                'latestContent.supervisorReviewedAt': { $null: true },
                'latestContent.managerReviewedAt': { $null: true },
              },
            },
          },
        };
      }

      return {
        // 同時滿足兩個條件
        $and: {
          // 1 使用者為經辦或任一階段的審核者
          '1': {
            $or: {
              'latestContent.agentEmployee.id': { $eq: userId },
              'latestContent.reviewSalesEmployee.id': { $eq: userId },
              'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
              'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
              'latestContent.reviewManagerEmployee.id': { $eq: userId },
            },
          },
          // 2 報價單已送審給任一階段的審核者(除了業務)
          '2': {
            $or: {
              // 'latestContent.toSalesAt': { $notNull: true },
              'latestContent.toSupervisorAt': { $notNull: true },
              'latestContent.toWorkDirectorAt': { $notNull: true },
              'latestContent.toManagerAt': { $notNull: true },
            },
          },
          // 3 報價單有任一審核者沒有審核過
          '3': {
            $or: {
              'latestContent.salesReviewedAt': { $null: true },
              'latestContent.supervisorReviewedAt': { $null: true },
              'latestContent.workDirectorReviewedAt': { $null: true },
              'latestContent.managerReviewedAt': { $null: true },
            },
          },
        },
      };
    }

    // _____________________________________________
    if (reviewStatus === '審核完成') {
      // 如果在預算或投標階段
      if (status === 'Budget' || status === 'Bidding' || status === 'Contracting') {
        return {
          $and: {
            // 1 使用者為經辦或任一階段的審核者
            '1': {
              $or: {
                'latestContent.agentEmployee.id': { $eq: userId },
                'latestContent.reviewSalesEmployee.id': { $eq: userId },
                'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
                'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
                'latestContent.reviewManagerEmployee.id': { $eq: userId },
              },
            },
            // 2 報價單被業務與業務主管審核過
            '2': {
              $and: {
                'latestContent.salesReviewedAt': { $notNull: true },
                'latestContent.supervisorReviewedAt': { $notNull: true },
                'latestContent.managerReviewedAt': { $notNull: true },
              },
            },
          },
        };
      }

      return {
        $and: {
          // 1 使用者為經辦或任一階段的審核者
          '1': {
            $or: {
              'latestContent.agentEmployee.id': { $eq: userId },
              'latestContent.reviewSalesEmployee.id': { $eq: userId },
              'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
              'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
              'latestContent.reviewManagerEmployee.id': { $eq: userId },
            },
          },
          // 2 報價單被所有審核者審核過
          '2': {
            $and: {
              'latestContent.salesReviewedAt': { $notNull: true },
              'latestContent.supervisorReviewedAt': { $notNull: true },
              'latestContent.workDirectorReviewedAt': { $notNull: true },
              'latestContent.managerReviewedAt': { $notNull: true },
            },
          },
        },
      };
    }

    // _____________________________________________
    return {};
  })();

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
      'latestContent.projectName': {
        $contains: projectName || undefined,
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
    // {
    //   options: optionDoorModel,
    //   placeholder: '選擇門型',
    //   width: '100px',
    //   defaultValue: router.query.doorModel as string,
    // },
    {
      options: optionsCounty,
      placeholder: '選擇地區',
      width: '80px',
      defaultValue: router.query.county as string,
    },
    {
      placeholder: '請輸入客戶名稱',
      defaultValue: router.query.clientName as string,
    },
    {
      placeholder: '請輸入專案名稱',
      defaultValue: router.query.projectName as string,
    },
  ];

  const doSearch = (valueArr: (string | Toption | null)[]) => {
    // const doorType = (valueArr[0] as Toption).value;
    const county = (valueArr[0] as Toption).value;
    const customerName = valueArr[1] as string;
    const projectName = valueArr[2] as string;

    router.push({
      href: '',
      query: {
        ...router.query,
        // doorType,
        county,
        customerName,
        projectName,
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
          pathname: `/domestic/quotationList/quotation`,
          query: {
            status,
          },
        });
      },
    },
  ];

  // ----------------------------------------------------------

  return (
    <SubLayer isLoading_subLayer={isLoadingPage1}>
      <PageHeader02 tag={quotationStatusLookup[status] ?? '--'} panelList={panelList} />
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
    </SubLayer>
  );
}

// ========================================================

const ApprovalsBar = ({ router }: { router: NextRouter }) => {
  const query = router.query;
  const linkList: Tlink[] = [
    {
      label: '待審核',
      linkProps: {
        href: {
          pathname: '',
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
        href: {
          pathname: '',
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
        href: {
          pathname: '',
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
