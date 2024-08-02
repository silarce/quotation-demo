import { Tcontrol_queryQuotationList } from 'components/page/domestic/queryQuotation/queryQuotationList';
import { TquotationDto } from 'js/api/dtoTypes';

const quotationToReiviewChain = (content: TquotationDto['contents'][number]) => {
  const {
    status,

    agentEmployee,

    reviewSalesEmployee,
    salesReviewedAt,
    toSalesAt,

    reviewSupervisorEmployee,
    supervisorReviewedAt,
    toSupervisorAt,

    toSalesManagerAt,
    reviewSalesManagerEmployee,
    salesManagerReviewedAt,

    reviewWorkDirectorEmployee,
    workDirectorReviewedAt,
    toWorkDirectorAt,

    toCashierAt,
    reviewCashierEmployee,
    cashierReviewedAt,

    reviewManagerEmployee,
    managerReviewedAt,
    toManagerAt,
  } = content;

  type TprocessChain = Tcontrol_queryQuotationList['panelArr'][number]['header']['processChain'];
  type TdotColor = TprocessChain[number]['dotColor'];

  let dotColor_sales: TdotColor = 'gray';
  toSalesAt && (dotColor_sales = 'red');
  salesReviewedAt && (dotColor_sales = 'green');

  let dotColor_supervisor: TdotColor = 'gray';
  toSupervisorAt && (dotColor_supervisor = 'red');
  supervisorReviewedAt && (dotColor_supervisor = 'green');

  let dotColor_salesManager: TdotColor = 'gray';
  toSalesManagerAt && (dotColor_salesManager = 'red');
  salesManagerReviewedAt && (dotColor_salesManager = 'green');

  let dotColor_workDirector: TdotColor = 'gray';
  toWorkDirectorAt && (dotColor_workDirector = 'red');
  workDirectorReviewedAt && (dotColor_workDirector = 'green');

  let dotColor_cashier: TdotColor = 'gray';
  toCashierAt && (dotColor_cashier = 'red');
  cashierReviewedAt && (dotColor_cashier = 'green');

  let dotColor_manager: TdotColor = 'gray';
  toManagerAt && (dotColor_manager = 'red');
  managerReviewedAt && (dotColor_manager = 'green');

  const processChain: TprocessChain = [
    {
      label: `經辦 ${agentEmployee?.chName ?? 'fooo'}`,
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
      label: `業務經理 ${reviewSalesManagerEmployee?.chName ?? ''}`,
      dotColor: dotColor_salesManager,
    },
    {
      label: `應收帳款 ${reviewWorkDirectorEmployee?.chName ?? ''}`,
      dotColor: dotColor_workDirector,
    },
    {
      label: `應收帳款 ${reviewCashierEmployee?.chName ?? ''}`,
      dotColor: dotColor_cashier,
    },
    {
      label: `總經理 ${reviewManagerEmployee?.chName ?? ''}`,
      dotColor: dotColor_manager,
    },
  ];

  (status === 'Budget' || status === 'Bidding' || status === 'Contracting') && processChain.splice(4, 2);
  // status === 'Pending' && processChain.shift();

  return processChain;
};

export { quotationToReiviewChain };
