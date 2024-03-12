import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// global gear
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';
import { Tcontrol_pop_form } from 'components/global/gear/pop/pop_form';

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
import { quotationToReiviewChain } from 'js/utils/quotation/quotationToReiviewChain';

import { Toption, optionsCreator_county } from 'js/utils/options/countryAndDistrict';
import { optionsCreator_productMaterial, optionsCreator_doorModel_2 } from 'js/utils/options/productOptions';

// type
import type { Thead_popFormList } from 'components/page/domestic/queryQuotation/queryQuotationList/thead';

// ===========================================

type Tquery = {
  // county: string | undefined;
  // customerName: string | undefined;
  // keyWord: string | undefined;
  // keyWord_prod: string | undefined;
  status: string | undefined;
  county: string | undefined;
  prodMaterial: string | undefined;
  doorModel: string | undefined;
  customerName: string | undefined;
  contactPerson: string | undefined;
  //
  dateStart: string | undefined;
  dateEnd: string | undefined;
  projectName: string | undefined;
  projectNumber: string | undefined;
  //
  order: 'ASC' | 'DESC' | undefined;
};

// ===========================================

const options_productMaterial = optionsCreator_productMaterial({ haveEmpty: true });

// ===========================================

export default function Budget() {
  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    status = undefined,
    county = undefined,
    prodMaterial = undefined,
    doorModel = undefined,
    customerName = undefined,
    contactPerson = undefined,
    dateStart = undefined,
    dateEnd = undefined,
    projectName = undefined,
    projectNumber = undefined,
    order = undefined,
  } = query;
  // county = county || undefined;
  // prodMaterial = prodMaterial || undefined;
  // doorModel = doorModel || undefined;
  // customerName = customerName || undefined;

  const dateStart_moment = dateStart ? moment(dateStart) : undefined;
  dateStart_moment && (dateStart_moment.add(1911, 'year') as moment.Moment);
  const dateEnd_moment = dateEnd ? moment(dateEnd) : undefined;
  dateEnd_moment && (dateEnd_moment.add(1911, 'year') as moment.Moment);

  // ----------------------------------------------------------------------

  const params: Tparams = {
    sort: 'latestContent.quotationDate',
    order: order || 'DESC',
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
      // 狀態
      'latestContent.status': { $eq: status },
      // 工程地點
      'latestContent.county': { $eq: county },
      // 客戶名稱
      'contents.customer.name': { $contains: customerName },
      // 日期起訖 quoteDate
      'latestContent.quotationDate': { $gte: dateStart_moment?.toISOString(), $lte: dateEnd_moment?.toISOString() },
      // 工程名稱
      'latestContent.projectName': { $contains: projectName },
      // 報價編號
      'latestContent.quotationNumber': { $eq: projectNumber },

      'latestContent.contactPerson': { $contains: contactPerson },
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
    reset,
  } = useGetQuotation_infinite({ customParams: params });

  useEffect(() => {
    reset();
    // }, [county, prodMaterial, doorModel, customerName, keyWord]);
  }, [query]);

  // ----------------------------------------------------------------------

  const panelArr: Tcontrol_queryQuotationList['panelArr'] =
    quoatationArr?.map((quotation, index) => {
      const { contents, latestContent, id } = quotation;
      const isContract = latestContent.status === 'Contract';

      const processChain = quotationToReiviewChain(latestContent);
      const sortedContent = _.sortBy(contents, (content) => content.updatedAt).reverse();

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
      placeholder: '主產品門型',
      options: optionsCreator_doorModel_2({ haveEmpty: true }),
    },
    {
      placeholder: '主產品材質',
      options: options_productMaterial,
    },
    {
      placeholder: '聯絡人',
      width: '100px',
      defaultValue: contactPerson,
    },
  ];

  const doSearch: TsearchGroup['doSearch'] = (vArr) => {
    const doorModelOption = vArr[0] as Toption;
    const prodMaterialOption = vArr[1] as Toption;
    const contactPerson = vArr[2] as string;

    const prodMaterial = prodMaterialOption.value;
    const doorModel = doorModelOption.value;

    router.push({
      query: { contactPerson, prodMaterial, doorModel },
    });
  };

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch,
  };
  // -----------------------------------------------------------------------

  const popFormList = usePopFormListCreator();

  // -----------------------------------------------------------------------

  const panelList: TpanelList = [{ searchGroup }];

  // ===================================================

  return (
    <SubLayer isLoading_subLayer={isLoadingPage1}>
      {/* header panel */}
      <PageHeader02 tag="報價單列表" panelList={panelList} />
      {/*  */}
      <div>
        <QueryQuotationList control={control} popFormList={popFormList} />
      </div>
    </SubLayer>
  );
}

// ===================================================================

const usePopFormListCreator = () => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { status, county, customerName, projectName, dateStart, dateEnd, projectNumber, order } = query;

  const popFormList = useMemo(() => {
    const dateStart_moment = dateStart ? moment(dateStart) : undefined;
    dateStart_moment && (dateStart_moment.add(1911, 'year') as moment.Moment);
    const dateEnd_moment = dateEnd ? moment(dateEnd) : undefined;
    dateEnd_moment && (dateEnd_moment.add(1911, 'year') as moment.Moment);

    const popFormList: Thead_popFormList = {
      quotationNumber: {
        onConfirm: (list) => {
          const { projectNumber } = list;
          router.push({
            query: { ...query, projectNumber: projectNumber },
          });
        },
        inputSelArr: [
          {
            caption: '報價編號',
            name: 'projectNumber',
            inputProps: {
              props: {
                defaultValue: projectNumber,
              },
            },
          },
        ],
      },

      status: {
        onConfirm: (list) => {
          const { status } = list;
          router.push({
            query: { ...query, status: status },
          });
        },
        inputSelArr: [
          {
            caption: '狀態',
            name: 'status',
            radioProps: {
              props: {
                defaultValue: status,
                options: [
                  { label: '預算', value: 'Budget' },
                  { label: '投標', value: 'Bidding' },
                  { label: '發包', value: 'Contracting' },
                  { label: '合約', value: 'Contract' },
                  { label: '準合約', value: 'Pending' },
                  { label: '不拘', value: '' },
                ],
              },
            },
          },
        ],
      },
      //
      quoteDate: {
        onConfirm: (list) => {
          const { dateStart, dateEnd, order } = list;
          router.push({
            query: {
              ...query,
              //
              dateStart: dateStart,
              dateEnd: dateEnd,
              order: order,
            },
          });
        },
        inputSelArr: [
          {
            caption: '日期(起)',
            name: 'dateStart',
            datePickerProps: {
              props: {
                defaultValue: dateStart_moment,
                popupStyle: { zIndex: 1070 },
              },
            },
          },
          {
            caption: '日期(訖)',
            name: 'dateEnd',
            datePickerProps: {
              props: {
                defaultValue: dateEnd_moment,
                popupStyle: { zIndex: 1070 },
              },
            },
          },
          {
            caption: '以日期排序',
            name: 'order',
            radioProps: {
              props: {
                defaultValue: order,
                options: [
                  { label: '正序', value: 'ASC' },
                  { label: '逆序', value: 'DESC' },
                ],
              },
            },
          },
        ],
      },
      //
      county: {
        onConfirm: (list) => {
          const { county } = list;
          router.push({
            query: { ...query, county: county },
          });
        },
        inputSelArr: [
          {
            caption: '地區',
            name: 'county',

            selectProps: {
              props: {
                options: optionsCreator_county({ emptyOption: true }),
                defaultValue: county ? { label: county, value: county } : null,
              },
            },
          },
        ],
      },
      projectName: {
        onConfirm: (list) => {
          const { projectName } = list;
          router.push({
            query: { ...query, projectName: projectName },
          });
        },
        inputSelArr: [
          {
            caption: '工程名稱',
            name: 'projectName',
            inputProps: {
              props: {
                defaultValue: projectName,
              },
            },
          },
        ],
      },
      customerName: {
        onConfirm: (list) => {
          const { customerName } = list;
          router.push({
            query: { ...query, customerName: customerName },
          });
        },
        inputSelArr: [
          {
            caption: '客戶名稱',
            name: 'customerName',
            inputProps: {
              props: {
                defaultValue: customerName,
              },
            },
          },
        ],
      },
    };

    return popFormList;
  }, [query]);

  return popFormList;
};
