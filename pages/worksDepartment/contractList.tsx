import { useEffect } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// components
import ContractList, { Tcontract } from 'components/page/worksDepartment/contracList/contractList';

// css
import style from './contractList.module.scss';

// api
import { useContract_infinite, Tparams } from 'js/api/api_quotation';

// type
import { Toption } from 'js/utils/options/options';

// option
import { optionsCreator_county } from 'js/utils/options/countryAndDistrict';
import { optionsCreator_doorModel_2 } from 'js/utils/options/productOptions';

// ===========================================
const optionDoorModel = optionsCreator_doorModel_2({ haveEmpty: true });
const optionsCounty = optionsCreator_county();
optionsCounty.unshift({ value: '', label: '不拘' });
// ===========================================

type Tquery = {
  doorType: string | undefined;
  county: string | undefined;
  customerName: string | undefined;
  projectName: string | undefined;
};

export default function WdContractList() {
  const router = useRouter();
  const { doorType, county, customerName, projectName } = router.query as Tquery;

  const params: Tparams = {
    filter: {
      'content.product.doorModelName': { $eq: doorType },
      'content.county': { $eq: customerName },
      'content.customer.name': { $contains: customerName },
      'content.projectName': { $contains: projectName },
      engineeringContactId: { $notNull: true },
    },
  };

  const { dataArr, viewRef_bottom, isLoadingPage1, reset } = useContract_infinite({
    customParams: params,
  });

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doorType, county, customerName, projectName]);

  // ===================================================

  const searchTargetList: TsearchGroup['searchTargetList'] = [
    {
      defaultValue: doorType ?? '',
      options: optionDoorModel,
      placeholder: '選擇門型',
      width: '90px',
    },
    {
      defaultValue: county ?? '',
      options: optionsCounty,
      placeholder: '選擇地區',
      width: '80px',
    },
    {
      defaultValue: customerName ?? '',
      placeholder: '請輸入客戶名稱',
    },
    {
      defaultValue: projectName ?? '',
      placeholder: '請輸入專案名稱',
    },
  ];

  const doSearch: TsearchGroup['doSearch'] = (vArr) => {
    const doorType = (vArr[0] as Toption).value;
    const county = (vArr[1] as Toption).value;
    const customerName = vArr[2] as string;
    const projectName = vArr[3] as string;
    router.push({
      query: {
        doorType,
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
  // -----------------------

  const panelList: TpanelList = [{ searchGroup }];

  // ===================================================

  const contractArr: Tcontract[] = dataArr.map((item) => {
    const { content } = item;

    const obj: Tcontract = {
      contractId: item.id,
      quotationNumber: content.quotationNumber,
      customerName: content.customer.name,
      contactName: content.contactPerson,
      contactNumber: content.contactNumber,
      agentName: content.agentEmployee.chName,
      date: content.quotationDate,
      county: content.county,
      projectName: content.projectName,
    };

    return obj;
  });

  // ===================================================

  return (
    <SubLayer isLoading_subLayer={isLoadingPage1}>
      <PageHeader02 tag="合約" panelList={panelList} />
      <div className={style.mainContainer}>
        <ContractList viewRef={viewRef_bottom} contractArr={contractArr} />
      </div>
    </SubLayer>
  );
}
