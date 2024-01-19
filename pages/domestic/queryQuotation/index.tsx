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

// ===========================================

export default function Budget() {
  const router = useRouter();
  const { quotationNumber: quotationNumber } = router.query as { quotationNumber: string };

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
      quotationNumber: { $eq: quotationNumber },
    },
    pageSize: 20,
  };

  // const { data: quoatationArr, update } = useGetQuotation(params);

  // useEffect(() => {
  //   update();
  // }, [quotationNumber]);

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
  }, [quotationNumber]);

  // ----------------------------------------------------------------------

  const panelArr: Tcontrol_queryQuotationList['panelArr'] =
    quoatationArr?.map((quotation, index) => {
      const { contents, latestContent, id } = quotation;

      const sortedContent = _.sortBy(contents, (content) => content.updatedAt).reverse();

      const href_head =
        latestContent.status === 'Contract'
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
        projectName: latestContent.projectName,
        customerName: latestCustomer?.name,
        contactPerson: latestContent.contactPerson,
        contactPhoneNumber: latestContent.contactNumber,
        href: href_head,
        viewRef_bottom: quoatationArr.length - 10 === index ? viewRef_bottom : undefined,
      };

      const body = sortedContent.map((content, index) => {
        const { status, updatedAt, projectName, customer } = content;

        const href_body = {
          pathname: '/domestic/quotationList/quotation',
          query: {
            id: id,
            status: status,
            contentId: content.id,
          },
        };

        return {
          status: quotationStatusLookup[status],
          quoteDate: moment(convertDate_reduce1911(updatedAt)).format('yy-MM-DD'),
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
      value: quotationNumber,
      placeholder: '請輸入報價單編號',
    },
  ];

  const doSearch: TsearchGroup['doSearch'] = (vArr) => {
    const quotationNumber = vArr[0] as string;
    router.push({
      query: { quotationNumber },
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
