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
import { useGetQuotation } from 'js/api/api_quotation';

// utils
import { quotationStatusLookup } from 'config/lookupTable';
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// ===========================================

export default function Budget() {
  const router = useRouter();
  const { quotationId } = router.query as { quotationId: string };

  // ----------------------------------------------------------------------

  const params = {
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
      id: { $eq: quotationId },
    },
  };

  const { data: quoatationArr, update } = useGetQuotation(params);

  useEffect(() => {
    update();
  }, [quotationId]);

  // ----------------------------------------------------------------------

  const panelArr: Tcontrol_queryQuotationList['panelArr'] =
    quoatationArr?.map((quotation) => {
      const { contents, latestContent, id } = quotation;

      const sortedContent = _.sortBy(contents, (content) => content.updatedAt).reverse();

      const theLatestContent = sortedContent[sortedContent.length - 1];

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

      const header = {
        quotationNumber: latestContent.quotationNumber,
        status: quotationStatusLookup[latestContent.status],
        quoteDate: moment(convertDate_reduce1911(latestContent.updatedAt)).format('yy-MM-DD'),
        customerName: theLatestContent.customer?.name,
        contactPerson: latestContent.contactPerson,
        contactPhoneNumber: latestContent.contactNumber,
        href: href_head,
      };

      const body = sortedContent.map((content, index) => {
        const { status, updatedAt, customer } = content;

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
      value: quotationId,
      placeholder: '請輸入報價單編號',
    },
  ];

  const doSearch: TsearchGroup['doSearch'] = (vArr) => {
    const quotationId = vArr[0] as string;
    router.push({
      query: { quotationId },
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
    <SubLayer>
      {/* header panel */}
      <PageHeader02 tag="報價單列表" panelList={panelList} />
      {/*  */}
      <div>
        <QueryQuotationList control={control} />
      </div>
    </SubLayer>
  );
}
