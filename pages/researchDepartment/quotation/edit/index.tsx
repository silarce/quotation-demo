import { useState } from 'react';

import useRouter from 'next/router';

import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Profile from 'components/page/researchDepartment/quotation/profile';
import QuotationRemark, { Tprops_quotationRemark } from 'components/page/domestic/quotation_v2/QuotationRemark';
import QuotationPayInfo, { Tprops_quotationPayInfo } from 'components/page/domestic/quotation_v2/QuotationPayInfo';
import Table from 'components/page/researchDepartment/quotation/table';

// hook
import { useProfile } from 'components/page/researchDepartment/quotation/hook/useProfile';
import { useProduct, Tinstance_useProduct } from 'components/page/researchDepartment/quotation/hook/useProduct';
import { useOtherInfo, Tinstance_useOtherInfo } from 'components/page/researchDepartment/quotation/hook/useOtherInfo';
import { useRemark, Tinstance_useRemark } from 'components/page/researchDepartment/quotation/hook/useRemark';

// CSS
import scss from './index.module.scss';

export default function Edit() {
  const [disabled, setDisabled] = useState(false);

  const return_useProfile = useProfile();

  const instance_useProduct = useProduct({ rawData: undefined });
  const instance_useOtherInfo = useOtherInfo(undefined);
  const instance_useRemark = useRemark(undefined);

  const props_quotationPayInfo = createQuotationPayInfo({
    instance_useProduct,
    instance_useOtherInfo,
  });

  const { props_remark, props_quotationRange } = createProps_quotationRemark(instance_useRemark);

  return (
    <SubLayer>
      <PageHeader02 tag="新增報價單" />
      <div className={scss.main}>
        <Profile return_useProfile={return_useProfile} />

        <br />
        <br />

        <Table disabled={disabled} instance_useProduct={instance_useProduct} />

        <br />
        <br />

        <div className={scss.summary}>
          <div className={scss.left}>
            <QuotationRemark disabled={disabled} {...props_remark} />
            <QuotationRemark disabled={disabled} {...props_quotationRange} />
          </div>
          {/*  */}
          <div className={scss.right}>
            <QuotationPayInfo disabled={disabled} {...props_quotationPayInfo} />
          </div>
        </div>
      </div>
    </SubLayer>
  );
}

// =============================================================

const createQuotationPayInfo = ({
  instance_useProduct,
  instance_useOtherInfo,
}: {
  instance_useProduct: Tinstance_useProduct;
  instance_useOtherInfo: Tinstance_useOtherInfo;
}) => {
  const { state_otherInfo, setState_otherInfo, addPaymentMethod, removePaymentMethod, editPaymentMethod } =
    instance_useOtherInfo;

  const props_quotationPayInfo: Omit<Tprops_quotationPayInfo, 'disabled'> = {
    form: {
      deliveryLocation: {
        value: state_otherInfo.deliveryLocation,
        onChange: (value) => {
          setState_otherInfo((prev) => ({ ...prev, deliveryLocation: value }));
        },
      },
      deliveryDate: {
        value: state_otherInfo.deliveryDate,
        onChange: (value) => {
          setState_otherInfo((prev) => ({ ...prev, deliveryDate: value }));
        },
      },
      paymentMethodArr: state_otherInfo.paymentMethods.map((item, index) => {
        return {
          milestone: {
            value: item.milestone,
            onChange: (value) => {
              editPaymentMethod({ index, milestone: value });
            },
          },
          totalPaymentRatio: {
            value: item.totalPaymentRatio,
            onChange: (value) => {
              editPaymentMethod({ index, totalPaymentRatio: value });
            },
          },
          onDelete: () => {
            removePaymentMethod(index);
          },
        };
      }),
      addPaymentMethod: addPaymentMethod,

      haveTax: {
        value: instance_useProduct.state_allProd.haveTax,
        onChange: (value) => {
          instance_useProduct.setHaveTax(value);
        },
      },

      tuneTotal: {
        value: instance_useProduct.state_allProd.tuneTotal,
        onChange: (value) => {
          instance_useProduct.setTuneTotal(value);
        },
      },
      discountRate: instance_useProduct.state_allProd.discount_quotation,
      avgDiscount: instance_useProduct.state_allProd.discount_avg,
      subTotal: instance_useProduct.state_allProd.subTotal,
      salesTax: instance_useProduct.state_allProd.salesTax,
      total: instance_useProduct.state_allProd.total,
    },
  };

  return props_quotationPayInfo;
};

// =============================================================

const createProps_quotationRemark = (instance_useRemark: Tinstance_useRemark) => {
  const {
    stateArr_remark,
    stateArr_quotationRange,
    setRemark,
    setQuotationRange,
    addRemark,
    addQuotationRange,
    removeRemark,
    removeQuotationRange,
  } = instance_useRemark;

  const props_remark: Omit<Tprops_quotationRemark, 'disabled'> = {
    label: '備註',
    onAddClick: addRemark,
    onUpponAddClick: () => {
      alert('開發中');
    },
    remarkArr: stateArr_remark.map((item, index) => {
      return {
        value: item,
        onChange: (value: string) => {
          setRemark(index, value);
        },
        onDelete: () => {
          removeRemark(index);
        },
      };
    }),
  };

  const props_quotationRange: Omit<Tprops_quotationRemark, 'disabled'> = {
    label: '報價範圍',
    onAddClick: addQuotationRange,
    onUpponAddClick: () => {
      alert('開發中');
    },
    remarkArr: stateArr_quotationRange.map((item, index) => {
      return {
        value: item,
        onChange: (value: string) => {
          setQuotationRange(index, value);
        },
        onDelete: () => {
          removeQuotationRange(index);
        },
      };
    }),
  };

  return {
    props_remark,
    props_quotationRange,
  };
};
