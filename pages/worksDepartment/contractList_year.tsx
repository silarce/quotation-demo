import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// global gear
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// components
import ContractList_sorted, {
  Tcontract,
  Tcontrol_sortedContractList,
} from 'components/page/worksDepartment/contracList/contractList_sorted';

// css
import style from './contractList.module.scss';

// api
import { useGetContract, Tparams } from 'js/api/api_quotation';

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
  year: string | undefined;
  isDone: string | undefined;
};

export default function WdContractList() {
  const router = useRouter();
  const { doorType, county, customerName, projectName, year, isDone } = router.query as Tquery;

  const { yearStart, yearEnd } = useMemo(() => {
    if (!year) {
      return { yearStart: undefined, yearEnd: undefined };
    }

    const yearStart = moment().year(Number(year)).startOf('year').toISOString();
    const yearEnd = moment().year(Number(year)).endOf('year').toISOString();

    return { yearStart, yearEnd };
  }, [year]);

  const params: Tparams = {
    pageSize: 99999,
    populate: ['content.customer', 'content.agentEmployee', 'content.reviewSalesEmployee', 'accountReceivable'],

    filter: {
      'content.product.doorModelName': { $eq: doorType },
      'content.county': { $eq: customerName },
      'content.customer.name': { $contains: customerName },
      'content.projectName': { $contains: projectName },
      engineeringContactId: { $notNull: true },
      'content.quotationDate': {
        $gte: yearStart,
        $lte: yearEnd,
      },

      // 報價單若沒有accountReceivable，取得的資料連accountReceivable這個property都不會有
      // 導致filter出錯
      // 在後端做出處置前，先在前端過濾
      // 'accountReceivable.isDone': isDone === 'true' ? { $eq: true } : isDone === 'false' ? { $eq: false } : undefined,
      // 'accountReceivable.isDone': isDone === 'true' ? { $eq: true } : { $ne: true },
      // accountReceivable: { $notNull: true },
    },
  };

  const { data, update } = useGetContract(params);
  // const dataArr = data ?? [];
  const dataArr = (data ?? []).filter((item) => {
    if (isDone === 'true') {
      return item.accountReceivable?.isDone === true;
    } else {
      return item.accountReceivable?.isDone !== true;
    }
  });

  useEffect(() => {
    update();
  }, [doorType, county, customerName, projectName]);

  const control_sortedContractList: Tcontrol_sortedContractList = useMemo(() => {
    const list: Tcontrol_sortedContractList = {
      northernArr: [],
      centralArr: [],
      southernArr: [],
      easternArr: [],
      abroadArr: [],
    };

    dataArr.forEach((contract) => {
      const { content } = contract;

      const {
        quotationNumber,
        customer,
        contactPerson,
        contactNumber,
        agentEmployee,
        quotationDate,
        county,
        projectName,
      } = content;

      const obj = {
        contractId: contract.id,
        quotationNumber,
        customerName: customer.name,
        contactName: contactPerson,
        contactNumber: contactNumber,
        agentName: agentEmployee.chName || agentEmployee.enName || '',
        date: quotationDate,
        county,
        projectName,
      };

      if (northernCountyArr.includes(county)) {
        list.northernArr.push(obj);
      } else if (centralCountyArr.includes(county)) {
        list.centralArr.push(obj);
      } else if (southernCountyArr.includes(county)) {
        list.southernArr.push(obj);
      } else if (easternCountyArr.includes(county)) {
        list.easternArr.push(obj);
      } else if (abroadArr.includes(county)) {
        list.abroadArr.push(obj);
      }
    });

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
        ...router.query,
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

  const panelList: TpanelList = [
    { searchGroup },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.push({
          pathname: '/worksDepartment/contractList_yearCatalog',
        });
      },
    },
  ];

  // ===================================================

  const contractArr: Tcontract[] = dataArr.map((item) => {
    const { content } = item;

    const foo: Tcontract = {
      contractId: item.id,
      quotationNumber: content.quotationNumber,
      customerName: content.customer.name,
      contactName: content.contactPerson,
      contactNumber: content.contactNumber,
      agentName: content.agentEmployee.chName,
      // discount: content.discount,
      // doorQty: String(content.quantity),
      // totalPrice: content.total.toLocaleString(),
      date: content.quotationDate,
      county: content.county,
      projectName: content.projectName,
    };

    return foo;
  });

  // ===================================================

  return (
    <div className={style.container}>
      {/* header panel */}
      <PageHeader02 tag="合約" panelList={panelList} />
      {/*  */}
      <div className={style.mainContainer}>
        <ContractList_sorted control={control_sortedContractList} />
      </div>
    </div>
  );
}

// 判斷依據是跟後端要的
const northernCountyArr = ['臺北市', '新北市', '基隆市', '新竹市', '桃園市', '新竹縣', '宜蘭縣'];
const centralCountyArr = ['臺中市', '苗栗縣', '彰化縣', '南投縣', '雲林縣'];
const southernCountyArr = ['高雄市', '臺南市', '嘉義市', '嘉義縣', '屏東縣', '澎湖縣'];
const easternCountyArr = ['花蓮縣', '臺東縣'];
const abroadArr = ['海外'];
