import { useEffect, useMemo } from 'react';
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
import {
  Tparams,
  useGetQuotation,
  useGetQuotation_infinite,
  apiPatchQuotationContent_id_progress,
} from 'js/api/api_quotation';

// utils
import { quotationStatusLookup } from 'config/lookupTable';
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';
import { quotationToReiviewChain } from 'js/utils/quotation/quotationToReiviewChain';

import { Toption, optionsCreator_county } from 'js/utils/options/countryAndDistrict';
import { optionsCreator_productMaterial, optionsCreator_doorModelName } from 'js/utils/options/productOptions';

// type
import type { Thead_popFormList } from 'components/page/domestic/queryQuotation/queryQuotationList/thead';

import { useGlobal_OptionalConfig } from 'hooks/globalState/useGlobal_OptionalConfig';
// ===========================================

type Tquery = {
  // county: string | undefined;
  // customerName: string | undefined;
  // keyWord: string | undefined;
  // keyWord_prod: string | undefined;
  status?: string | undefined;
  county?: string | undefined;
  prodMaterial?: string | undefined;
  doorModel?: string | undefined;
  customerName?: string | undefined;
  contactPerson?: string | undefined;
  //
  dateStart?: string | undefined;
  dateEnd?: string | undefined;
  projectName?: string | undefined;
  projectNumber?: string | undefined;
  //
  order?: 'ASC' | 'DESC' | undefined;
  isLost?: 'true' | 'false' | undefined;
  agentName: string | undefined;
  salesName: string | undefined;
  //
  reviewStatus: '未送審' | '審核中' | '審核完成' | undefined;
};

// ===========================================

const options_productMaterial = optionsCreator_productMaterial({ haveEmpty: true });

// ===========================================

// MARK: START

export default function Budget() {
  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    status,
    county,
    prodMaterial,
    doorModel,
    customerName,
    contactPerson,
    dateStart,
    dateEnd,
    projectName,
    projectNumber,
    order,
    isLost: isLost_str,
    agentName,
    salesName,
    reviewStatus,
  } = query;

  const isLost = isLost_str === 'true' ? true : isLost_str === 'false' ? false : undefined;

  const dateStart_moment = dateStart ? moment(dateStart) : undefined;
  dateStart_moment && (dateStart_moment.add(1911, 'year') as moment.Moment);
  const dateEnd_moment = dateEnd ? moment(dateEnd) : undefined;
  dateEnd_moment && (dateEnd_moment.add(1911, 'year') as moment.Moment);

  // ----------------------------------------------------------------------

  const optionalConfig = useGlobal_OptionalConfig();
  const { isRefactoredQuotaion } = optionalConfig;

  // ----------------------------------------------------------------------

  const params: Tparams = {
    sort: 'latestContent.quotationDate',
    order: order || 'DESC',
    populate: [
      'contents.customer',
      // 'latestContent.customer',
      'latestContent.agentEmployee',
      'latestContent.reviewSalesEmployee',
      'latestContent.reviewSalesManagerEmployee',
      'latestContent.reviewWorkDirectorEmployee',
      'latestContent.reviewCashierEmployee',
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
      'latestContent.quotationNumber': { $contains: projectNumber },
      // 失件
      'latestContent.isLost': { $eq: isLost },

      'latestContent.agentEmployee.chName': { $contains: agentName },
      'latestContent.reviewSalesEmployee.chName': { $contains: salesName },

      'latestContent.contactPerson': { $contains: contactPerson },
      'latestContent.products.doorModelName': { $eq: doorModel },
      'latestContent.products.materialName': { $eq: prodMaterial },
      ...filter_reviewStatus(reviewStatus),
    },
    pageSize: 20,
  };

  const {
    dataArr: quoatationArr,
    dataList,
    viewRef_bottom,
    isLoadingPage1,
    reset,
    setDataList,
  } = useGetQuotation_infinite({ customParams: params });

  // ----------------------------------------------------------------------

  // region PROPS

  const panelArr = useMemo(() => {
    const panelArr: Tcontrol_queryQuotationList['panelArr'] = [];

    const pageArr = Object.keys(dataList);

    pageArr.forEach((key, pageIndex) => {
      const arr = dataList[key as keyof typeof dataList];
      const isLastPage = pageArr.length - 1 === pageIndex;

      arr.forEach((quotation, index) => {
        const { contents, latestContent, id, attachedToContractId } = quotation;
        const isContract = latestContent.status === 'Contract';

        const isAttachtQuotation = !!attachedToContractId;

        const processChain = quotationToReiviewChain(latestContent);
        const sortedContent = _.sortBy(contents, (content) => content.version).reverse();

        const href_contract = {
          pathname: '/domestic/contract/quotation',
          query: {
            id: latestContent.contract?.id,
            version: latestContent.contract?.version,
          },
        };

        isAttachtQuotation && (href_contract.query.id = attachedToContractId);

        const href_quotation = {
          // pathname: '/domestic/quotationList/quotation',
          pathname: isRefactoredQuotaion ? optionalConfig.path_refactoredQuotation : optionalConfig.path_oldQuotation,
          query: {
            id: id,
            status: latestContent.status,
          },
        };

        const href_attachQuotation = {
          // pathname: '/domestic/quotationList/attachQuotation',
          pathname: isRefactoredQuotaion
            ? optionalConfig.path_refactoredQuotation
            : optionalConfig.path_attachQuotation,
          // pathname: '/domestic/quotationList/quotation',
          query: {
            id: id,
            status: latestContent.status,
          },
        };

        const href_head = isContract ? href_contract : isAttachtQuotation ? href_attachQuotation : href_quotation;

        const latestCustomer = sortedContent[0].customer;

        const header: Tcontrol_queryQuotationList['panelArr'][number]['header'] = {
          quotationNumber: latestContent.quotationNumber,
          status: <Status status={quotationStatusLookup[latestContent.status]} isLost={latestContent.isLost} />,
          quoteDate: moment(convertDate_reduce1911(latestContent.quotationDate)).format('yy-MM-DD'),
          county: latestContent.county,
          projectName: latestContent.projectName,
          customerName: latestCustomer?.name ?? '',
          contactPerson: latestContent.contactPerson,
          contactPhoneNumber: latestContent.contactNumber,
          href: href_head,
          viewRef_bottom: isLastPage && arr.length - 5 === index ? viewRef_bottom : undefined,
          //
          processChain: processChain,
          trackProgress: latestContent.trackProgress,
          projectProgress: latestContent.projectProgress,

          isAttachQuotation: isAttachtQuotation,

          onEditConfirm: async ({ trackProgress, projectProgress }) => {
            const body = { trackProgress, projectProgress };

            try {
              const res = await apiPatchQuotationContent_id_progress(latestContent.id, body);

              if (res) {
                setDataList((list) => {
                  const latestContent = _.cloneDeep(list[key as keyof typeof dataList][index].latestContent);
                  latestContent.trackProgress = trackProgress;
                  latestContent.projectProgress = projectProgress;
                  list[key as keyof typeof dataList][index].latestContent = latestContent;

                  return {
                    ...list,
                  };
                });
              }

              return !!res;
            } catch (error) {}

            return false;
          },
        };

        const body = sortedContent.map((content) => {
          const { status, quotationDate, county, projectName, customer, version } = content;

          const query: { [key: string]: string | number | boolean | undefined } = {
            id: id,
            status: status,
            contentId: content.id,
            contentVersion: version,
          };

          if (isContract) {
            query.isContract = isContract;
          }

          const href_body = {
            // pathname: '/domestic/quotationList/quotation',
            pathname: isRefactoredQuotaion ? optionalConfig.path_refactoredQuotation : optionalConfig.path_oldQuotation,
            query,
          };
          const href_body_attach = {
            // pathname: '/domestic/quotationList/attachQuotation',
            pathname: isRefactoredQuotaion
              ? optionalConfig.path_refactoredQuotation
              : optionalConfig.path_attachQuotation,
            query: {
              ...query,
            },
          };

          const href = isAttachtQuotation ? href_body_attach : href_body;

          return {
            status: <Status status={quotationStatusLookup[status]} isLost={content.isLost} />,
            quoteDate: moment(convertDate_reduce1911(quotationDate)).format('yy-MM-DD'),
            county: county,
            projectName: projectName,
            customerName: customer?.name ?? '',
            href,
          };
        });

        // body.reverse();
        body.shift();

        panelArr.push({
          header,
          body,
        });
      });
    });

    return panelArr;
  }, [quoatationArr]);

  const control: Tcontrol_queryQuotationList = {
    panelArr: panelArr,
  };

  // 搜尋用的
  const searchTargetList: TsearchGroup['searchTargetList'] = [
    {
      placeholder: '主產品門型',
      options: optionsCreator_doorModelName({ haveEmpty: true }),
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
    {
      placeholder: '經辦',
      width: '100px',
      defaultValue: '',
    },
    {
      placeholder: '業務',
      width: '100px',
      defaultValue: '',
    },
  ];

  const doSearch: TsearchGroup['doSearch'] = (vArr) => {
    const doorModelOption = vArr[0] as Toption;
    const prodMaterialOption = vArr[1] as Toption;
    const contactPerson = vArr[2] as string;
    const agentName = vArr[3] as string;
    const salesName = vArr[4] as string;

    const prodMaterial = prodMaterialOption.value;
    const doorModel = doorModelOption.value;

    router.push({
      query: clearEmptyProperty({
        ...query,
        contactPerson,
        prodMaterial,
        doorModel,
        agentName,
        salesName,
      }),
    });
  };

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch,
  };

  // ____________________________________________________________________________
  // ____________________________________________________________________________

  const popFormList = usePopFormListCreator();
  const panelList: TpanelList = [{ searchGroup }];

  // -----------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    reset();
    // }, [county, prodMaterial, doorModel, customerName, keyWord]);
  }, [query]);

  // -----------------------------------------------------------------------

  // MARK: RENDER

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

// MARK: END

// ===================================================================

const usePopFormListCreator = () => {
  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    status,
    county,
    customerName,
    projectName,
    dateStart,
    dateEnd,
    projectNumber,
    order,
    isLost,
    reviewStatus,
  } = query;

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
            query: clearEmptyProperty({ ...query, projectNumber: projectNumber }),
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
          const { status, isLost, reviewStatus } = list;

          const theQuery = clearEmptyProperty({
            ...query,
            status,
            isLost: isLost === 'undefined' ? undefined : isLost,
            reviewStatus: reviewStatus === 'undefined' ? undefined : reviewStatus,
          });
          router.push({
            query: theQuery,
          });
        },
        inputSelArr: [
          {
            caption: '狀態',
            name: 'status',
            radioProps: {
              props: {
                defaultValue: status ?? '',
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
          {
            caption: '失件',
            name: 'isLost',
            radioProps: {
              props: {
                defaultValue: isLost || 'undefined',
                options: [
                  { label: '是', value: 'true' },
                  { label: '否', value: 'false' },
                  { label: '不拘', value: 'undefined' },
                ],
              },
            },
          },
          {
            caption: '審核狀態',
            name: 'reviewStatus',
            radioProps: {
              props: {
                defaultValue: reviewStatus || 'undefined',
                options: [
                  { label: '未送審', value: '未送審' },
                  { label: '審核中', value: '審核中' },
                  { label: '審核完成', value: '審核完成' },
                  { label: '不拘', value: 'undefined' },
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
            query: clearEmptyProperty({
              ...query,
              dateStart: dateStart,
              dateEnd: dateEnd,
              order: order,
            }),
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
            query: clearEmptyProperty({ ...query, county: county }),
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
            query: clearEmptyProperty({ ...query, projectName: projectName }),
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
            query: clearEmptyProperty({ ...query, customerName: customerName }),
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

// ============================================================================

const Status = ({ status, isLost }: { status: string; isLost: boolean }) => {
  return (
    <>
      <span className="text-danger">{status}</span>
      {isLost && (
        <>
          <br />
          <span className="text-[#999]">失件</span>
        </>
      )}
    </>
  );
};

const clearEmptyProperty = (obj: { [key: string]: any }) => {
  return _.omitBy(obj, (item) => {
    return item === undefined || item === '';
  });
};

const filter_reviewStatus = (reviewStatus: Tquery['reviewStatus']) => {
  if (reviewStatus === '未送審') {
    return {
      'latestContent.toSalesAt': { $null: true },
      'latestContent.toSupervisorAt': { $null: true },
      'latestContent.toSalesManagerAt': { $null: true },
      'latestContent.toWorkDirectorAt': { $null: true },
      'latestContent.toCashierAt': { $null: true },
      'latestContent.toManagerAt': { $null: true },
    };
  } else if (reviewStatus === '審核中') {
    return {
      $or: [
        {
          'latestContent.toSalesAt': { $notNull: true },
        },
        {
          'latestContent.toSupervisorAt': { $notNull: true },
        },
        {
          'latestContent.toSalesManagerAt': { $notNull: true },
        },
        {
          'latestContent.toWorkDirectorAt': { $notNull: true },
        },
        {
          'latestContent.toCashierAt': { $notNull: true },
        },
        {
          'latestContent.toManagerAt': { $notNull: true },
        },
      ],
    };
  } else if (reviewStatus === '審核完成') {
    return {
      'latestContent.managerReviewedAt': { $notNull: true },
    };
  } else {
    return undefined;
  }
};
