import { useState, useEffect } from 'react';
import { NextRouter, useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import CustomerList from 'components/page/domestic/customer/customerList';

// antd
import { Pagination } from 'antd';

// global gear
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  TapiGetCustomersParams,
  useCustomers,
  customerTypesLookup,
  customerTypesArr,
  TcustomerDto_TC,
} from 'js/api/api_customer';

// css
import style from './customer.module.scss';

// option
import { optionsCreator_county } from 'js/utils/options/countryAndDistrict';
import { optionsCreator_clientSearch, Toption } from 'js/utils/options/options';
const clientSearchOptions = optionsCreator_clientSearch();
const clientSearchOptionsObj: { [key: string]: Toption } = {};
clientSearchOptions.forEach((item, index) => {
  const { value, label } = item;
  clientSearchOptionsObj[value] = { value, label };
});

// 類別optionArr
const typesOptionArr = (() => {
  const optionArr: { value: string; label: string }[] = customerTypesArr.map((types) => {
    return {
      value: types.value,
      label: types.label,
    };
  });
  optionArr.unshift({ value: '', label: '類別不拘' });

  return optionArr;
})();
// 城市optionArr
const optionCountyArr = (() => {
  const arr = optionsCreator_county();
  arr.unshift({ value: '', label: '地區不拘' });
  arr.push({ value: '國外', label: '國外' });

  return arr;
})();

// ========================================================

type Tquery = {
  page: string;
  searchTypes: string;
  searchCounty: string;
  searchOther: string;
  searchOtherValue: string;
};

// ========================================================
export default function Customer() {
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  return <TheCustomer router={router} />;
}
// ========================================================

function TheCustomer({ router }: { router: NextRouter }) {
  const [isLoading, setIsLoading] = useState(false);

  // -----------------------------------------------------

  const { page, searchTypes, searchCounty, searchOther, searchOtherValue } = router.query as Tquery;

  const theParams: TapiGetCustomersParams = {
    page: Number(page || 1),
    pageSize: 8,
    populate: ['contacts', 'types'],
    sort: 'customerNumber',
    filter: {
      'types.name': { $eq: searchTypes },
      county: { $contains: searchCounty },
      [`${searchOther}`]: { $contains: searchOtherValue },
    },
  };

  const { data: dataOri, meta, update } = useCustomers(theParams);
  const data = (dataOri ?? []) as TcustomerDto_TC[];

  // -----------------------------------------------------

  const changePage = (page: number) => {
    router.push({
      query: {
        ...router.query,
        page,
      },
    });
  };

  // -----------------------------------------------------
  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        await update();
      } catch {
        myAlert.err({ title: '取得資料失敗' });
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  // -----------------------------------------------------
  // pageHeader

  const searchTargetList = [
    {
      options: typesOptionArr,
      width: '90px',
      placeholder: '類別不拘',
      defaultValue: customerTypesLookup[searchTypes as keyof typeof customerTypesLookup],
    },
    {
      options: optionCountyArr,
      width: '90px',
      placeholder: '地區不拘',
      defaultValue: searchCounty,
    },
    {
      options: clientSearchOptions,
      width: '90px',
      defaultValue: clientSearchOptionsObj[searchOther] ?? clientSearchOptions[0],
    },
    {
      placeholder: '請輸入搜尋內容',
      defaultValue: searchOtherValue ?? '',
    },
  ];

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch: (valueArr: (Toption | null | string)[]) => {
      const searchTypes = (valueArr[0] as Toption).value;
      const searchCounty = (valueArr[1] as Toption).value;
      const searchOther = (valueArr[2] as Toption).value;
      const searchOtherValue = valueArr[3] as string;
      router.push({
        query: {
          ...router.query,
          page: 1,
          searchTypes,
          searchCounty,
          searchOther,
          searchOtherValue,
        },
      });
    },
  };

  const panelList: TpanelList = [
    {
      searchGroup,
    },
    {
      type: 'addButton',
      label: '新增客戶資料',
      onClick: () =>
        router.push({
          pathname: '/domestic/customer/add',
          query: router.query,
        }),
    },
  ];

  // -----------------------------------------------------
  return (
    <SubLayer
    // 取得客戶資料非常快，還放loading cover會有閃爍感，UX反而不好
    // isLoading_subLayer={isLoading}
    >
      <PageHeader02 tag="客戶列表" panelList={panelList} />
      <div className={style.body}>
        <CustomerList customersList={data} toUpdate={update} isLoading={isLoading} />
        <div className={style.paginationBox}>
          <Pagination
            current={meta?.page ?? 1}
            total={meta?.itemCount ?? 0}
            pageSize={meta?.pageSize ?? 0}
            onChange={changePage}
            showSizeChanger={false}
          />
        </div>
      </div>
    </SubLayer>
  );
}
