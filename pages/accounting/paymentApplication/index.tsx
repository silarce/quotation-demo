import classNames from 'classnames';

import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Table_paymentApplication from 'components/page/accounting/paymentApplication/table_paymentApplication';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './index.module.scss';

// =========================================================================
export default function PaymentApplication() {
  return (
    <SubLayer bodyPreStyle="style01">
      <PageHeader02 tag="付款申請" />

      <div>
        <BtnBar className="mb-5" />
        <Profile className="mb-5" />
        <Table_paymentApplication />
      </div>
    </SubLayer>
  );
}

// =========================================================================

const BtnBar = ({ className }: { className?: string }) => {
  return (
    <div className={classNames(scss.btnBar, className)}>
      <div>
        <SquareBtn content="search" />
      </div>
      <div>
        <SquareBtn content="save" />
        <SquareBtn content="cancel" />
      </div>
      <div>
        <SquareBtn content="delete" />
      </div>
    </div>
  );
};

const inputSelConfig_profile: TinputSelProps = {
  captionSize: '18',
  fontSize: '18',
  captionStyle: { width: 120 },
  // wrapperStyle: { width: 250 },
};

const Profile = ({ className }: { className?: string }) => {
  return (
    <div className={classNames(scss.profile, className)}>
      <InputSel {...inputSelConfig_profile} caption="付款申請單號" />
      <InputSel {...inputSelConfig_profile} caption="申請日期" />
      <InputSel {...inputSelConfig_profile} caption="經辦人員" />

      <InputSel
        {...inputSelConfig_profile}
        caption="廠商代號"
        suffix={<SquareBtn className="mr-2" sharp="mini" label="選擇廠商" onClick={() => {}} />}
        inputProps={{}}
      />
      <InputSel {...inputSelConfig_profile} caption="扣稅類別" />
      <InputSel {...inputSelConfig_profile} caption="立帳方式" />

      <InputSel
        {...inputSelConfig_profile}
        caption="發票號碼"
        suffix={
          <SquareBtn
            className="mr-2"
            sharp="mini"
            label="選擇發票"
            onClick={() => {
              console.log('fooo');
            }}
          />
        }
        inputProps={{}}
      />
    </div>
  );
};
