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
import scss from './budget.module.scss';

// option
import { optionsCreator_county } from 'js/utils/options/countryAndDistrict';
import { optionsCreator_doorModel, Toption } from 'js/utils/options/productOptions';

const optionDoorModel = optionsCreator_doorModel({ haveEmpty: true });
const optionsCounty = optionsCreator_county();
optionsCounty.unshift({ value: '', label: '不拘' });

// fakeData
// fake
import { fakeApi_projectSimple } from 'fakeDatabase/fakeAPI/fakeQuotationSimpleArrApi';

// ===========================================
// 預算、投標、發包 的介面完全一樣，僅是取得之資料的狀態不同
// 點進去的報價單也一樣，僅是取得之資料的狀態不同
// 預算、投標、發包 的介面完全一樣，僅是取得之資料的狀態不同
// 點進去的報價單也一樣，僅是取得之資料的狀態不同
// 預算、投標、發包 的介面完全一樣，僅是取得之資料的狀態不同
// 點進去的報價單也一樣，僅是取得之資料的狀態不同
// 預算、投標、發包 的介面完全一樣，僅是取得之資料的狀態不同
// 點進去的報價單也一樣，僅是取得之資料的狀態不同

// ===========================================
// ===========================================

import { useGetQuotation, apiPostQuotation } from 'js/api/api_quotation';

// ===========================================
// ===========================================

export default function Budget() {
  const router = useRouter();
  // ===========================================

  const { data: quoatationArr, meta, update } = useGetQuotation();

  useEffect(() => {
    update();
  }, []);

  // ===========================================

  // ----------------------------------------------------------
  // panelList

  const searchTargetList = [
    {
      options: optionDoorModel,
      placeholder: '選擇門型',
      width: '100px',
      defaultValue: router.query.doorModel as string,
    },
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
    const doorModel = (valueArr[0] as Toption).value;
    const county = (valueArr[1] as Toption).value;
    const clientName = valueArr[2] as string;
    const projectName = valueArr[3] as string;

    router.push({
      href: '',
      query: {
        ...router.query,
        doorModel,
        county,
        clientName,
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
        // let newQuotationId = `${projectArr.length + 1}`.padStart(2, '0');
        // newQuotationId = 'S-110211-' + newQuotationId;
        router.push({
          pathname: `/domestic/budget/quotation`,
          query: {
            quotationId: 'new',
            isNewQuotation: true,
          },
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
