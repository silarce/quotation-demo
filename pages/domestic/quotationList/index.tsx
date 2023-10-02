import { useState, useEffect } from 'react';
import { useRouter, NextRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// global gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';

// components
import BudgeList from 'components/page/domestic/budget/budgetList';

// css
import scss from './index.module.scss';

// option
import { optionsCreator_county } from 'js/utils/options/countryAndDistrict';
import { optionsCreator_doorModel, Toption } from 'js/utils/options/productOptions';

const optionDoorModel = optionsCreator_doorModel({ haveEmpty: true });
const optionsCounty = optionsCreator_county();
optionsCounty.unshift({ value: '', label: '不拘' });

// ===========================================
// ===========================================

import { useGetQuotation } from 'js/api/api_quotation';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// ===========================================
// ===========================================

export default function Budget() {
  const router = useRouter();
  const { county, customerName, projectName, status, reviewStatus } = router.query as { [key: string]: string };
  // ----------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);
  // ----------------------------------------------------
  // 未審核

  const reviewStatusFilter_noReview = {
    $and: {
      'latestContent.reviewSalesEmployee': { $null: true },
      'latestContent.reviewSupervisorEmployee': { $null: true },
      'latestContent.reviewWorkDirectorEmployee': { $null: true },
      'latestContent.reviewManagerEmployee': { $null: true },
    },
  };

  //審核中
  const reviewStatusFilter_inReview = {
    $or: {
      'latestContent.reviewSalesEmployee': { $notNull: true },
      'latestContent.reviewSupervisorEmployee': { $notNull: true },
      'latestContent.reviewWorkDirectorEmployee': { $notNull: true },
      'latestContent.reviewManagerEmployee': { $notNull: true },
    },
  };

  // 已審核
  const reviewStatusFilter_reviewed = {
    $and: {
      'latestContent.salesReviewedAt': { $notNull: true },
      'latestContent.supervisorReviewedAt': { $notNull: true },
      'latestContent.workDirectorReviewedAt': { $notNull: true },
      'latestContent.managerReviewedAt': { $notNull: true },
    },
  };

  const reviewStatusFilter =
    reviewStatus === '審核中'
      ? reviewStatusFilter_inReview
      : reviewStatus === '審核完成'
      ? reviewStatusFilter_reviewed
      : reviewStatusFilter_noReview; // 待審核

  const params = {
    filter: {
      'latestContent.status': {
        $eq: status,
      },
      'latestContent.projectName': {
        $contains: projectName || undefined,
      },
      'latestContent.customer.name': {
        $contains: customerName || undefined,
      },
      'latestContent.county': {
        $contains: county || undefined,
      },
      // ...reviewStatusFilter,
    },
  };

  const { data: quoatationArr, meta, update } = useGetQuotation(params);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        await update();
      } catch (error) {
        myAlert.err({ title: '取得資料失敗' });
      }

      setIsLoading(false);
    })();
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

  const panelList: TpanelList = [
    { searchGroup },
    {
      type: 'addButton',
      label: '新增報價單',
      onClick: () => {
        router.push({
          pathname: `/domestic/quotationList/quotation`,
        });
      },
    },
  ];

  // ----------------------------------------------------------

  return (
    <SubLayer>
      <PageHeader02 tag="預算" panelList={panelList} />
      <div>
        <ApprovalsBar router={router} />
        <BudgeList className="m-[4px] mt-0" quotationArr={quoatationArr} />
      </div>
      <LoadingCover01 isLoading={isLoading} />
    </SubLayer>
  );
}

// ========================================================
// ========================================================
// ========================================================
// ========================================================

const ApprovalsBar = ({ router }: { router: NextRouter }) => {
  const query = router.query;
  const linkList = [
    {
      label: '待審核',
      href: {
        pathname: '',
        query: {
          ...query,
          reviewStatus: '待審核',
        },
      },
      isActive: !query.reviewStatus || query.reviewStatus === '待審核',
    },
    {
      label: '審核中',
      href: {
        pathname: '',
        query: {
          ...query,
          reviewStatus: '審核中',
        },
      },
      isActive: query.reviewStatus === '審核中',
    },
    {
      label: '審核完成',
      href: {
        pathname: '',
        query: {
          ...query,
          reviewStatus: '審核完成',
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
