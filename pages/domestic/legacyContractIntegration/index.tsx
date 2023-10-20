import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import Link from 'next/link';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Thead01 from 'components/page/domestic/ui/table01/Thead01';
import TbodyItem01, { TBodyItemContent } from 'components/page/domestic/ui/table01/TbodyItem01';

// gear
import SearchBar, { TsearcbBarProps } from 'components/global/gear/inputAndSel_v2/searchBar/searchBar';

// antd
import { Collapse } from 'antd';
const { Panel } = Collapse;

// option
// import { optionsCreator_doorType } from 'js/utils/options/options';
import { optionsCreator_county } from 'js/utils/options/countryAndDistrict';
import { optionsCreator_doorModel } from 'js/utils/options/productOptions';
const optionsDoorType = optionsCreator_doorModel({ haveEmpty: true });
const optionsCounty = optionsCreator_county();

optionsCounty.unshift({ value: '', label: '不拘' });

// icon
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// utils
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// css
import scss from './legacyContract.module.scss';

// api
import { Tparams, TlegacyContractDto, useLegacyContract_infinite } from 'js/api/api_legacy-contract';

// ==================================================================
let timeoutId: NodeJS.Timeout;

// ==================================================================
export default function LegacyContractIntegration() {
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(-1);

  // -----------------------------------------------------------------------

  const filter = {
    'products.doorType': { $eq: router.query.doorType },
    projectCity: { $eq: router.query.projectCity },
    customerName: { $contains: router.query.customerName },
    projectName: { $contains: router.query.projectName },
  };

  const params: Tparams = {
    // page: page,
    // pageSize: 10,
    pageSize: 5,
    populate: ['products', 'additions', 'priceRecord'],
    filter,
    sort: 'contractNumber',
    // order: 'DESC',
    order: 'ASC',
  };

  const { dataArr, viewRef_bottom, isLoadingPage1, isLoading, reset } = useLegacyContract_infinite({
    customParams: params,
  });
  const [shouldShowIsLoading, setIsShowIsLoading] = useState(false);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    //
    router.query.doorType,
    router.query.projectCity,
    router.query.customerName,
    router.query.projectName,
  ]);

  useEffect(() => {
    if (isLoading) {
      setIsShowIsLoading(false);
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setIsShowIsLoading(true);
    }, 2000);
  }, [isLoading]);

  // --------------------------------------------------------------------

  // SearchBar
  const searchBarProps: TsearcbBarProps = {
    inputSelPropsArr: [
      //
      {
        wrapperStyle: { width: '100px' },
        selectProps: {
          easyDefaultValue: (router.query.doorType as string) || null,
          props: {
            options: optionsDoorType,
            placeholder: '選擇門型',
          },
        },
      },
      {
        wrapperStyle: { width: '100px' },
        selectProps: {
          easyDefaultValue: (router.query.projectCity as string) || null,
          props: {
            options: optionsCounty,
            placeholder: '選擇地區',
          },
        },
      },
      {
        pilarAttr: undefined,
      },
      {
        wrapperStyle: { width: '150px' },
        inputProps: {
          props: {
            defaultValue: router.query.customerName || '',
            placeholder: '請輸入客戶名稱',
          },
        },
      },
      {
        pilarAttr: undefined,
      },
      {
        wrapperStyle: { width: '150px' },
        inputProps: {
          props: {
            defaultValue: router.query.projectName || '',
            placeholder: '請輸入專案名稱',
          },
        },
      },
      //
    ],
    onClick: (arr) => {
      const [doorType, projectCity, customerName, projectName] = arr;

      router.push({
        query: {
          ...router.query,
          doorType: doorType || undefined,
          projectCity: projectCity || undefined,
          customerName: customerName || undefined,
          projectName: projectName || undefined,
        },
      });
    },
  };

  // -------------------------------------------------------
  const panelList: TpanelList = [
    {
      custom: <SearchBar {...searchBarProps} key={router.asPath} />,
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

  // -----------------------------------------------------------------------
  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string);
    setActiveIndex(activeIndex);
  };
  // -----------------------------------------------------------------------

  return (
    // <SubLayer isLoading_subLayer={isLoadingPage1}>
    <SubLayer isLoading_subLayer={isLoadingPage1 || (shouldShowIsLoading && isLoading)}>
      <PageHeader02 tag="舊合約" panelList={panelList} />
      <div className={scss.main}>
        <Thead01 />
        <div>
          {/*  */}
          <Collapse expandIcon={() => <></>} accordion={true} destroyInactivePanel={true} onChange={changeActive}>
            {dataArr?.map((item, index, arr) => {
              const discountRate = (() => {
                const discountRate = Math.round(parseFloat(item.discountRate) * 100);

                return discountRate.toString() + '%';
              })();

              let doorQty = 0;
              item.products.forEach((prod) => {
                if (prod.batch === 0) {
                  doorQty = doorQty + prod.quantity;
                }
              });

              const dateStr = item.createdAt
                ? moment(convertDate_reduce1911(item.createdAt)).format('yy-MM-DD')
                : '無日期';

              const quotationContent: TBodyItemContent = {
                quotationNumber: item.contractNumber, // 合約編號

                quotationDate: dateStr, //建立日期
                projectName: item.projectName /**工程名稱 */,
                county: item.projectCity /**工地位置縣市 */,
                contactPerson: item.contactPerson /**聯絡人 */,
                contactNumber: item.contactNumber /**聯絡電話 */,
                discount: discountRate /**折扣率 */,
                quantity: doorQty /**產品 數量 計算來的*/,
                totalPrice: item.total /**總計 */,
                customerName: item.customerName /**客戶名稱 */,
                agentEmployeeName: item.operatorName /**經辦人 */,
              };

              const href = {
                pathname: '/domestic/legacyContractIntegration/quotation/',
                query: { contractId: item.id },
              };

              const isActive = activeIndex === index;

              return (
                <Panel
                  key={index}
                  className={scss.panel}
                  header={
                    <div
                      //  ref={arr.length - 3 === index ? viewRef_bottom : undefined}
                      ref={arr.length - 2 === index ? viewRef_bottom : undefined}
                    >
                      <TbodyItem01
                        quotationContent={quotationContent}
                        isActive={isActive}
                        openQuotation={() => {
                          router.push(href);
                        }}
                      />
                    </div>
                  }
                >
                  <AppendList contract={item} />
                </Panel>
              );
            })}
          </Collapse>
          {/*  */}
        </div>
      </div>
    </SubLayer>
  );
}

// ===========================================================================

const AppendList = ({ contract }: { contract: TlegacyContractDto }) => {
  const {
    id,
    attachBatchNumbers,
    products,
    additions,
    // priceRecord
  } = contract;

  const pricelist: { [key: string]: number } = {};

  products.forEach((item) => {
    const { batch, totalPrice } = item;

    if (!pricelist[`${batch}`]) {
      pricelist[`${batch}`] = 0;
    }

    pricelist[`${batch}`] = pricelist[`${batch}`] + totalPrice;
  });

  additions.forEach((item) => {
    const { batch, totalPrice } = item;

    if (!pricelist[`${batch}`]) {
      pricelist[`${batch}`] = 0;
    }

    pricelist[`${batch}`] = pricelist[`${batch}`] + totalPrice;
  });

  return (
    <div className={scss.appendList}>
      {attachBatchNumbers.map((batchNumber, index) => {
        if (index === 0) {
          return null;
        }

        const lastBatchPrice = pricelist[`${index - 1}`] ?? 0;
        const price = pricelist[index] - lastBatchPrice;

        const href = {
          pathname: '/domestic/legacyContractIntegration/quotation/append',
          query: { contractId: id, batch: index },
        };

        return (
          <Fragment key={index}>
            {/* <span>{index}</span> */}
            <span>{batchNumber}</span>
            <span>{price}</span>
            <Link href={href}>
              <IconDetail className={scss.linkBtn} />
            </Link>
          </Fragment>
        );
      })}

      {Object.keys(attachBatchNumbers).length === 1 && <span className={scss.noAppend}>無追加追減紀錄</span>}
    </div>
  );
};
