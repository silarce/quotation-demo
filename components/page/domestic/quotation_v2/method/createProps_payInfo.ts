import { useQuotationTotalPrice } from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationPrice';
import { usePayInfo } from 'components/page/domestic/quotation_v2/hook/usePayInfo';
import { Tprops_quotationPayInfo } from 'components/page/domestic/quotation_v2/QuotationPayInfo';

const createProps_payInfo = ({
  instance_quotationPrice: {
    state_quotationTotal,
    setQuotationPriceTotal,
    setTuneTotal,
    setCurrency,
    setExchangeRate,

    haveTax,
    setHaveTax,
  },
  kit_payInfo,
  state_quotationDiscount,
  avgDiscount,
  disabled,
  isAttach,
}: {
  instance_quotationPrice: ReturnType<typeof useQuotationTotalPrice>;
  kit_payInfo: ReturnType<typeof usePayInfo>['kit'];
  state_quotationDiscount: `${number}` | '';
  disabled: boolean;
  avgDiscount: number;
  isAttach: boolean;
}): Tprops_quotationPayInfo['form'] => {
  const props_payInfo: Tprops_quotationPayInfo['form'] = {
    haveTax: {
      value: haveTax,
      onChange(value) {
        setHaveTax(value);
      },
      disabled: isAttach || undefined,
    },
    discountRate: state_quotationDiscount,
    tuneTotal: {
      value: disabled ? Number(state_quotationTotal.tuneTotal).toLocaleString() : state_quotationTotal.tuneTotal,
      onChange(value) {
        setTuneTotal(value);
      },
    },
    currency: {
      value: state_quotationTotal.currency,
      onChange(value) {
        setCurrency(value);
      },
      disabled: isAttach || undefined,
    },
    exchangeRate: {
      value: state_quotationTotal.exchangeRate,
      onChange(value) {
        setExchangeRate(value);
      },
      disabled: isAttach || undefined,
    },
    avgDiscount: avgDiscount,
    subTotal: Number(state_quotationTotal.subTotal).toLocaleString(),
    salesTax: Number(state_quotationTotal.salesTax).toLocaleString(),
    total: Number(state_quotationTotal.total).toLocaleString(),
    foreignTotal: Number(state_quotationTotal.foreignTotal).toLocaleString(),

    ...kit_payInfo,
  };

  return props_payInfo;
};

export { createProps_payInfo };
