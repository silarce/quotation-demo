import { useEffect } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// global gear
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// components
// import BudgeList from "components/page/domestic/budget/budgetList"
import QueryQuotationList, {
  Tcontrol_queryQuotationList,
} from 'components/page/domestic/queryQuotation/queryQuotationList';

// api
import { Tparams, useGetQuotation, useGetQuotation_infinite } from 'js/api/api_quotation';

// utils
import { quotationStatusLookup } from 'config/lookupTable';
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

import { Toption, optionsCreator_county } from 'js/utils/options/countryAndDistrict';
import { optionsCreator_productMaterial, optionsCreator_doorModel_2 } from 'js/utils/options/productOptions';

const options_productMaterial = optionsCreator_productMaterial({ haveEmpty: true });

// ===========================================

type Tquery = {
  // county: string | undefined;
  // customerName: string | undefined;
  // keyWord: string | undefined;
  // keyWord_prod: string | undefined;
  county: string | undefined;
  prodMaterial: string | undefined;
  doorModel: string | undefined;
  customerName: string | undefined;
  keyWord: string | undefined;
};

// ===========================================

export default function Budget() {
  const router = useRouter();
  let { county, prodMaterial, doorModel, customerName, keyWord } = router.query as Tquery;
  county = county || undefined;
  prodMaterial = prodMaterial || undefined;
  doorModel = doorModel || undefined;
  customerName = customerName || undefined;
  keyWord = keyWord || undefined;

  // ----------------------------------------------------------------------

  const params: Tparams = {
    sort: 'latestContent.quotationDate',
    order: 'DESC',
    populate: [
      'contents.customer',
      // 'latestContent.customer',
      'latestContent.agentEmployee',
      'latestContent.reviewSalesEmployee',
      'latestContent.reviewWorkDirectorEmployee',
      'latestContent.reviewSupervisorEmployee',
      'latestContent.reviewManagerEmployee',
      'latestContent.managerReviewedAt',
      'latestContent.products.quantity',
      'latestContent.products.options',
      'latestContent.contract',
      'attachedToContract',
      'attachedToContractId',
    ],

    filter: {
      // 需求提到 材料配件 目前沒有取product.item，沒有配件資料所以不能搜尋
      // 真的要取product.item的話，回應要等很久很久吧

      // 工程地點
      'latestContent.county': { $eq: county },
      // 客戶名稱
      'contents.customer.name': { $contains: customerName },
      // $and: [
      //   // 工程名稱、聯絡人、完整報價單編號
      //   {
      //     $or: [
      //       {
      //         quotationNumber: { $eq: keyWord },
      //       },
      //       {
      //         'latestContent.projectName': { $contains: keyWord },
      //       },
      //       {
      //         'latestContent.contactPerson': { $contains: keyWord },
      //       },
      //     ],
      //   },
      //   // 主產品門型、材質
      //   {
      //     $or: [
      //       // { 'latestContent.products.doorModelName': { $eq: doorModel } },
      //       // { 'latestContent.products.materialName': { $eq: prodMaterial } },
      //     ],
      //   },
      // ],
      $or: [
        {
          quotationNumber: { $eq: keyWord },
        },
        {
          'latestContent.projectName': { $contains: keyWord },
        },
        {
          'latestContent.contactPerson': { $contains: keyWord },
        },
      ],

      'latestContent.products.doorModelName': { $eq: doorModel },
      'latestContent.products.materialName': { $eq: prodMaterial },
    },
    pageSize: 20,
  };

  const {
    //
    dataArr: quoatationArr,
    viewRef_bottom,
    isLoadingPage1,
    // isLoading,
    init,
    reset,
  } = useGetQuotation_infinite({ customParams: params });

  useEffect(() => {
    reset();
  }, [county, prodMaterial, doorModel, customerName, keyWord]);

  // ----------------------------------------------------------------------

  const panelArr: Tcontrol_queryQuotationList['panelArr'] =
    quoatationArr?.map((quotation, index) => {
      const { contents, latestContent, id } = quotation;
      const {
        status,

        agentEmployee,

        reviewSalesEmployee,
        salesReviewedAt,
        toSalesAt,

        reviewSupervisorEmployee,
        supervisorReviewedAt,
        toSupervisorAt,

        reviewWorkDirectorEmployee,
        workDirectorReviewedAt,
        toWorkDirectorAt,

        reviewManagerEmployee,
        managerReviewedAt,
        toManagerAt,
      } = latestContent;

      const sortedContent = _.sortBy(contents, (content) => content.updatedAt).reverse();

      const isContract = latestContent.status === 'Contract';

      const href_head = isContract
        ? {
            pathname: '/domestic/contract/quotation',
            query: {
              id: latestContent.contract?.id,
              version: 1,
            },
          }
        : {
            pathname: '/domestic/quotationList/quotation',
            query: {
              id: id,
              status: latestContent.status,
            },
          };

      const latestCustomer = sortedContent[0].customer;

      type TprocessChain = Tcontrol_queryQuotationList['panelArr'][number]['header']['processChain'];
      type TdotColor = TprocessChain[number]['dotColor'];

      let dotColor_sales: TdotColor = 'gray';
      toSalesAt && (dotColor_sales = 'red');
      salesReviewedAt && (dotColor_sales = 'green');

      let dotColor_supervisor: TdotColor = 'gray';
      toSupervisorAt && (dotColor_supervisor = 'red');
      supervisorReviewedAt && (dotColor_supervisor = 'green');

      let dotColor_workDirector: TdotColor = 'gray';
      toWorkDirectorAt && (dotColor_workDirector = 'red');
      workDirectorReviewedAt && (dotColor_workDirector = 'green');

      let dotColor_manager: TdotColor = 'gray';
      toManagerAt && (dotColor_manager = 'red');
      managerReviewedAt && (dotColor_manager = 'green');

      const processChain: TprocessChain = [
        {
          label: `經辦 ${agentEmployee.chName}`,
          dotColor: 'green',
        },
        {
          label: `業務 ${reviewSalesEmployee?.chName ?? ''}`,
          dotColor: dotColor_sales,
        },
        {
          label: `業務主管 ${reviewSupervisorEmployee?.chName ?? ''}`,
          dotColor: dotColor_supervisor,
        },
        {
          label: `應收帳款 ${reviewWorkDirectorEmployee?.chName ?? ''}`,
          dotColor: dotColor_workDirector,
        },
        {
          label: `經理 ${reviewManagerEmployee?.chName ?? ''}`,
          dotColor: dotColor_manager,
        },
      ];

      (status === 'Budget' || status === 'Bidding' || status === 'Contracting') && processChain.splice(3, 1);
      status === 'Pending' && processChain.shift();

      const header = {
        quotationNumber: latestContent.quotationNumber,
        status: quotationStatusLookup[latestContent.status],
        quoteDate: moment(convertDate_reduce1911(latestContent.updatedAt)).format('yy-MM-DD'),
        county: latestContent.county,
        projectName: latestContent.projectName,
        customerName: latestCustomer?.name,
        contactPerson: latestContent.contactPerson,
        contactPhoneNumber: latestContent.contactNumber,
        href: href_head,
        viewRef_bottom: quoatationArr.length - 10 === index ? viewRef_bottom : undefined,
        //
        processChain: processChain,
      };

      const body = sortedContent.map((content, index) => {
        const { status, updatedAt, county, projectName, customer } = content;

        const query: { [key: string]: string | number | boolean | undefined } = {
          id: id,
          status: status,
          contentId: content.id,
        };

        if (isContract) {
          query.isContract = isContract;
        }

        const href_body = {
          pathname: '/domestic/quotationList/quotation',
          query,
        };

        return {
          status: quotationStatusLookup[status],
          quoteDate: moment(convertDate_reduce1911(updatedAt)).format('yy-MM-DD'),
          county: county,
          projectName: projectName,
          customerName: customer?.name,
          href: href_body,
        };
      });

      // body.reverse();
      body.shift();

      return {
        header,
        body,
      };
    }) ?? [];

  const control: Tcontrol_queryQuotationList = {
    panelArr: panelArr,
  };

  // ----------------------------------------------------------------------
  // 搜尋用的

  const searchTargetList: TsearchGroup['searchTargetList'] = [
    {
      options: optionsCreator_county({ emptyOption: true }),
      placeholder: '選擇地區',
      defaultValue: county,
    },
    {
      placeholder: '主產品門型',
      options: optionsCreator_doorModel_2({ haveEmpty: true }),
    },
    {
      placeholder: '主產品材質',
      options: options_productMaterial,
    },
    {
      placeholder: '客戶名稱',
      defaultValue: customerName,
    },
    {
      placeholder: '工程名稱、聯絡人、完整報價單編號',
      width: '340px',
      defaultValue: keyWord,
    },
  ];

  const doSearch: TsearchGroup['doSearch'] = (vArr) => {
    const countyOption = vArr[0] as Toption;
    const doorModelOption = vArr[1] as Toption;
    const prodMaterialOption = vArr[2] as Toption;

    const customerName = vArr[3] as string;
    const keyWord = vArr[4] as string;

    const county = countyOption.value;
    const prodMaterial = prodMaterialOption.value;
    const doorModel = doorModelOption.value;

    router.push({
      query: { county, customerName, keyWord, prodMaterial, doorModel },
    });
  };

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch,
  };
  // -----------------------

  const panelList: TpanelList = [{ searchGroup }];

  // ===================================================

  return (
    <SubLayer isLoading_subLayer={isLoadingPage1}>
      {/* header panel */}
      <PageHeader02 tag="報價單列表" panelList={panelList} />
      {/*  */}
      <div>
        <QueryQuotationList control={control} />
      </div>
    </SubLayer>
  );
}
