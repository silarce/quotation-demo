import useRouter from 'next/router';

import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Profile from 'components/page/researchDepartment/quotation/profile';
import QuotationRemark, { Tprops_quotationRemark } from 'components/page/domestic/quotation_v2/QuotationRemark';

import scss from './index.module.scss';

export default function Edit() {
  return (
    <SubLayer>
      <PageHeader02 tag="新增報價單" />
      <div>
        <Profile />

        <div className={scss.summary}>
          <div className={scss.left}>
            <QuotationRemark {...propsForTest_quotationRemark} label="備註" />
            <QuotationRemark {...propsForTest_quotationRemark} label="報價範圍" />
          </div>
          {/*  */}
          <div className={scss.right}>445456d</div>
        </div>
      </div>
    </SubLayer>
  );
}

// =============================================================

const propsForTest_quotationRemark: Tprops_quotationRemark = {
  disabled: false,
  label: '備註',
  onAddClick: () => {},
  onUpponAddClick: () => {},
  remarkArr: [
    {
      value: 'test',
      onChange: (v: string) => {},
      onDelete: () => {},
    },
  ],
};
