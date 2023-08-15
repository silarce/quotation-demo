import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import moment from 'moment';
import { useInView } from 'react-intersection-observer';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { TsearchObj } from 'components/global/gear/HOC/searchBar/searchBar';
// component
import Thead01 from 'components/page/domestic/ui/table01/Thead01';
import TbodyItem01, { TBodyItemContent } from 'components/page/domestic/ui/table01/TbodyItem01';

// option
import { optionsCreator_doorType, Toption } from 'js/utils/options/options';
import { optionsCreator_county } from 'js/utils/options/countryAndDistrict';
const optionsDoorType = optionsCreator_doorType();
const optionsCounty = optionsCreator_county();
optionsDoorType.unshift({ value: '', label: '不拘' });
optionsCounty.unshift({ value: '', label: '不拘' });

// css
import scss from './legacyContract.module.scss';
// ==================================================================

// api
import { Tparams, useLegacyContracts } from 'js/api/api_legacy-contract';

export default function LegacyContractIntegration() {
  const router = useRouter();

  const [viewRef, inView] = useInView();

  // -----------------------------------------------------------------------

  // 搜尋用的 //這個資料不會render在畫面上
  // render在畫面上的是PageHeader02元件裡的狀態
  const [searchObj, setSearchObj] = useState<TsearchObj>();

  // -----------------------------------------------------------------------
  const [page, setPage] = useState(1);

  const filter = {
    'products.doorType': { $eq: searchObj?.doorType },
    projectCity: { $eq: searchObj?.projectCity },
    customerName: { $contains: searchObj?.customerName },
    projectName: { $contains: searchObj?.projectName },
  };

  const params: Tparams = {
    page: page,
    pageSize: 7,
    populate: ['products'],
    filter,
    sort: 'quoteDate',
    order: 'DESC',
  };

  const { legacyContractsArr, legacyContractsMeta, updateLegacyContracts, updateLegacyContracts_infinite } =
    useLegacyContracts(params);

  useEffect(() => {
    if (!searchObj) {
      return;
    }

    (async () => await updateLegacyContracts())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchObj]);

  useEffect(() => {
    if (!inView) {
      return;
    }

    if (page === 1) {
      return;
    }

    (async () => await updateLegacyContracts_infinite())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!legacyContractsMeta?.hasNextPage || !inView) {
      return;
    }

    setPage((page) => ++page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // -----------------------------------------------------------------------

  useEffect(() => {
    const { doorType, projectCity, customerName, projectName } = router.query as Record<string, string | undefined>;
    setSearchObj({
      doorType: doorType ?? '',
      projectCity: projectCity ?? '',
      customerName: customerName ?? '',
      projectName: projectName ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  // --------------------------------------------------------------------

  const searchTargetList = [
    {
      stateValue: optionsDoorType[0],
      options: optionsDoorType,
      placeholder: '選擇門型',
      width: '100px',
    },
    {
      stateValue: optionsCounty[0],
      options: optionsCounty,
      placeholder: '選擇地區',
      width: '80px',
    },
    {
      stateValue: '',
      placeholder: '請輸入客戶名稱',
    },
    {
      stateValue: '',
      placeholder: '請輸入專案名稱',
    },
  ];

  const doSearch = (valueArr: (string | Toption | null)[]) => {
    const [doorTypeOption, projectCityOption, customerName, projectName] = valueArr;
    const query = _.cloneDeep(router.query);
    const params = [
      { key: 'doorType', value: (doorTypeOption as Toption).value },
      { key: 'projectCity', value: (projectCityOption as Toption).value },
      { key: 'customerName', value: customerName as string },
      { key: 'projectName', value: projectName as string },
    ];
    params.forEach(({ key, value }) => {
      value = value.trim();

      if (value) {
        query[key] = value;
      } else {
        delete query[key];
      }
    });

    setPage(1);
    router.push({
      query,
    });
  };

  // -------------------------------------------------------
  const panelList: TpanelList = [
    {
      searchGroup: {
        searchTargetList,
        doSearch,
      },
    },
    {
      type: 'addButton',
      label: '新增舊合約',
      onClick: () => {
        router.push({
          pathname: `/domestic/legacyContractIntegration/quotation`,
        });
      },
    },
  ];

  return (
    <SubLayer>
      <PageHeader02 tag="舊合約" panelList={panelList} />
      <div className={scss.main}>
        <Thead01 />
        <div>
          {legacyContractsArr?.map((item, index, arr) => {
            const discountRate = (() => {
              const discountRate = Math.round(parseFloat(item.discountRate) * 100);

              return discountRate.toString() + '%';
            })();

            const tempDoorQty = (() => {
              let qty = 0;
              item.products.forEach((prod) => {
                qty = qty + prod.quantity;
              });

              return qty;
            })();

            const basicInfo = {
              quotationId: item.contractNumber,
              constructionName: item.projectName,
              /**承辦人 */
              undertaker: item.operatorName,
              totalDiscount: discountRate,
              tempDoorQty: tempDoorQty,
              tempBudgetAmount: item.total,
              // date: item.quoteDate,
              date: moment(item.quoteDate).format('YYYY-MM-DD'),
              constructionCounty: item.projectCity,
            };
            const clientData = {
              name: item.customerName,
              contact: [
                {
                  name: item.contactPerson,
                  phone: item.contactNumber,
                },
              ],
            };
            // const projectData = { basicInfo, clientData };
            const quotationContent: TBodyItemContent = {
              quotationNumber: item.contractNumber, // 合約編號
              quotationDate: moment(item.quoteDate).format('YYYY-MM-DD'), //報價日期
              projectName: item.projectName /**工程名稱 */,
              county: item.projectCity /**工地位置縣市 */,
              contactPerson: item.contactPerson /**聯絡人 */,
              contactNumber: item.contactNumber /**聯絡電話 */,
              discount: discountRate /**折扣率 */,
              quantity: tempDoorQty /**產品 數量 計算來的*/,
              totalPrice: item.total /**總計 */,
              customerName: item.customerName /**客戶名稱 */,
              agentEmployeeName: item.operatorName /**經辦人 */,
            };

            const href = {
              pathname: '/domestic/legacyContractIntegration/quotation/',
              query: { contractId: item.id },
            };

            return (
              <div key={index} ref={arr.length - 3 === index ? viewRef : undefined}>
                <TbodyItem01
                  quotationContent={quotationContent}
                  isActive={false}
                  openQuotation={() => {
                    router.push(href);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </SubLayer>
  );
}
