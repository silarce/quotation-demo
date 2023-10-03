import { useState, useEffect, useContext } from 'react';
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

import { AppContext } from 'pages/_app';

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

export default function QuotationList() {
  const router = useRouter();
  const { county, customerName, projectName, status, reviewStatus } = router.query as { [key: string]: string };

  const { userInfo } = useContext(AppContext);
  const userId = userInfo?.employee?.id;

  // ----------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);
  // ----------------------------------------------------

  /**
grade14以上的帳號理論上只會有一個

我要怎麼知道user的哪個身分?是經辦或是主管或其他的身分?
 */

  // 未審核
  const reviewStatusFilter_noReview = {
    'latestContent.agentEmployee.id': { $eq: userId }, // 使用者創建的報價單才會出現
    $and: {
      'latestContent.reviewSalesEmployee.id': { $null: true },
      'latestContent.reviewSupervisorEmployee.id': { $null: true },
      'latestContent.reviewWorkDirectorEmployee.id': { $null: true },
      'latestContent.reviewManagerEmployee.id': { $null: true },
    },
  };

  //審核中
  const reviewStatusFilter_inReview = {
    $or: {
      'latestContent.agentEmployee.id': { $eq: userId }, // 使用者創建的報價單才會出現
      'latestContent.reviewSalesEmployee.id': { $eq: userId },
      'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
      'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
      'latestContent.reviewManagerEmployee.id': { $eq: userId },
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
    $or: {
      'latestContent.agentEmployee.id': { $eq: userId }, // 使用者創建的報價單才會出現
      'latestContent.reviewSalesEmployee.id': { $eq: userId },
      'latestContent.reviewSupervisorEmployee.id': { $eq: userId },
      'latestContent.reviewWorkDirectorEmployee.id': { $eq: userId },
      'latestContent.reviewManagerEmployee.id': { $eq: userId },
    },
  };

  const reviewStatusFilter =
    reviewStatus === 'Bidding'
      ? reviewStatusFilter_inReview
      : reviewStatus === 'Contracting'
      ? reviewStatusFilter_reviewed
      : reviewStatusFilter_noReview; // 待審核

  const params = {
    filter: {
      'latestContent.status': {
        $eq: status,
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
      ...reviewStatusFilter,
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
          reviewStatus: 'Budget',
        },
      },
      isActive: !query.reviewStatus || query.reviewStatus === 'Budget',
    },
    {
      label: '審核中',
      href: {
        pathname: '',
        query: {
          ...query,
          reviewStatus: 'Bidding',
        },
      },
      isActive: query.reviewStatus === 'Bidding',
    },
    {
      label: '審核完成',
      href: {
        pathname: '',
        query: {
          ...query,
          reviewStatus: 'Contracting',
        },
      },
      isActive: query.reviewStatus === 'Contracting',
    },
  ];

  return (
    <div className={scss.approvalsBar}>
      <PageHeader02 linkList={linkList} />
    </div>
  );
};
