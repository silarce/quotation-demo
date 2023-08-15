import { useState, useEffect } from 'react';
import { useRouter, NextRouter } from 'next/router';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// global gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

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

// ===========================================
// ===========================================

export default function Budget() {
  const router = useRouter();
  const { county, customerName, projectName, status } = router.query;
  // ===========================================

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
    },
  };

  const { data: quoatationArr, meta, update } = useGetQuotation(params);

  useEffect(() => {
    update();
  }, [county, customerName, projectName, status]);

  // ===========================================

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
          approvalsStatus: '待審核',
        },
      },
      isActive: !query.approvalsStatus || query.approvalsStatus === '待審核',
    },
    {
      label: '審核中',
      href: {
        pathname: '',
        query: {
          ...query,
          approvalsStatus: '審核中',
        },
      },
      isActive: query.approvalsStatus === '審核中',
    },
    {
      label: '審核完成',
      href: {
        pathname: '',
        query: {
          ...query,
          approvalsStatus: '審核完成',
        },
      },
      isActive: query.approvalsStatus === '審核完成',
    },
  ];

  return (
    <div className={scss.approvalsBar}>
      <PageHeader02 linkList={linkList} />
    </div>
  );
};
