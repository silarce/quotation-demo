import { useState, useEffect, useMemo } from 'react';

import classNames from 'classnames';

import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Table_paymentApplication from 'components/page/accounting/paymentApplication/table_paymentApplication';
import { SearchModal_customer } from 'components/composition/searchModal/useSearchModal/useSearchModal_customer';
import { SearchModal_invoice } from 'components/composition/searchModal/useSearchModal/useSearchModal_invoice';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import scss from './index.module.scss';

// =========================================================================

interface TfakeDto {
  id: string;

  付款申請單號: string;
  申請日期: string;
  經辦人員: string;
  廠商代號: string;
  扣款類別: string;
  立帳方式: string;
  發票號碼: string;
}

interface state {
  id?: string;

  付款申請單號: string;
  申請日期: string;
  經辦人員: string;
  廠商代號: string;
  扣款類別: string;
  立帳方式: string;
  發票號碼: string;
}

// interface TinputSelPr

// =========================================================================
export default function PaymentApplication({ isAdmin }: { isAdmin: boolean }) {
  const defaultState = useDefaultState(fakeData);

  const [disabled, setDisabled] = useState(true);
  const [state, setState] = useState<state>(defaultState);

  // 主表資料要放在這一層，資料同時要送到Profile與Table_paymentApplication

  // --------------------------------------------------------------------------

  const onEdit = () => {
    setDisabled(false);
  };

  const onCancel = () => {
    setDisabled(true);
  };

  const onConfirm = () => {
    setDisabled(true);
  };

  // --------------------------------------------------------------------------

  useEffect(() => {
    setState(defaultState);
  }, [defaultState, disabled]);

  // --------------------------------------------------------------------------

  if (!isAdmin) {
    return (
      <SubLayer bodyPreStyle="style01">
        <PageHeader02 tag="付款申請" />

        <div>
          <h1 className="text-5xl">施工中</h1>
        </div>
      </SubLayer>
    );
  }

  return (
    <SubLayer bodyPreStyle="style01">
      <PageHeader02 tag="付款申請" />

      <div>
        <BtnBar className="mb-5" disabled={disabled} onEdit={onEdit} onCancel={onCancel} onConfirm={onConfirm} />
        <Profile className="mb-5" disabled={disabled} state={state} setState={setState} />
        <Table_paymentApplication />
      </div>
    </SubLayer>
  );
}

// =========================================================================

const BtnBar = ({
  disabled,
  onEdit,
  onCancel,
  onConfirm,
  className,
}: {
  disabled: boolean;

  onEdit: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  className?: string;
}) => {
  return (
    <div className={classNames(scss.btnBar, className)}>
      <div>
        <SquareBtn content="search" />
      </div>
      <div className="flex gap-1">
        {disabled && (
          <>
            <SquareBtn className="invisible" />
            <SquareBtn content="edit" onClick={onEdit} />
          </>
        )}
        {!disabled && (
          <>
            <SquareBtn content="save" onClick={onConfirm} />
            <SquareBtn content="cancel" theme="danger" onClick={onCancel} />
          </>
        )}
      </div>
      <div>
        <SquareBtn content="delete" theme="danger" />
      </div>
    </div>
  );
};

const Profile = ({
  //
  disabled,
  state,
  setState,
  className,
}: {
  disabled: boolean;
  className?: string;
  state: state;
  setState: React.Dispatch<React.SetStateAction<state>>;
}) => {
  const inputSelConfig_profile: TinputSelProps = {
    disabled,
    showBaseline: 'auto',
    captionSize: '18',
    fontSize: '18',
    captionStyle: { width: 120 },
    // wrapperStyle: { width: 250 },
  };

  const selectCustomer = () => {
    const { unmount } = DragableModal.create({
      children: (
        <SearchModal_customer
          onRowClick={(customer) => {
            setState((prev) => {
              return { ...prev, 廠商代號: customer.customerNumber };
            });
            unmount();
          }}
        />
      ),
    });
  };

  const selectInvoice = () => {
    const { unmount } = DragableModal.create({
      children: (
        <SearchModal_invoice
          onRowClick={(invoice) => {
            setState((prev) => {
              return { ...prev, 發票號碼: invoice.invoiceNumber };
            });
            unmount();
          }}
        />
      ),
    });
  };

  return (
    <div className={classNames(scss.profile, className)}>
      <InputSel {...inputSelConfig_profile} caption="付款申請單號" showBaseline="invisible" node={state.付款申請單號} />
      <InputSel
        {...inputSelConfig_profile}
        caption="申請日期"
        showBaseline="invisible"
        node={getTaiwanDateStr(state.申請日期)}
      />
      <InputSel {...inputSelConfig_profile} caption="經辦人員" showBaseline="invisible" node={state.經辦人員} />

      <InputSel
        {...inputSelConfig_profile}
        caption="廠商代號"
        htmlFor=""
        showBaseline="invisible"
        suffix={
          <SquareBtn
            className={classNames('mr-2', disabled && 'invisible')}
            sharp="mini"
            label="選擇廠商"
            onClick={selectCustomer}
          />
        }
        node={state.廠商代號}
      />
      <InputSel
        {...inputSelConfig_profile}
        caption="扣稅類別"
        inputProps={{
          props: {
            value: state.扣款類別,
            onChange: (e) => {
              setState((prev) => {
                return { ...prev, 扣款類別: e.target.value };
              });
            },
          },
        }}
      />
      <InputSel
        {...inputSelConfig_profile}
        caption="立帳方式"
        inputProps={{
          props: {
            value: state.立帳方式,
            onChange: (e) => {
              setState((prev) => {
                return { ...prev, 立帳方式: e.target.value };
              });
            },
          },
        }}
      />

      <InputSel
        {...inputSelConfig_profile}
        caption="發票號碼"
        htmlFor=""
        showBaseline="invisible"
        suffix={
          <SquareBtn
            className={classNames('mr-2', disabled && 'invisible')}
            sharp="mini"
            label="選擇發票"
            onClick={selectInvoice}
          />
        }
        node={state.發票號碼}
      />
    </div>
  );
};

// =========================================================================

const useDefaultState = (fakeData: TfakeDto) => {
  const defaultState: state = useMemo(() => {
    return { ...fakeData };
  }, [fakeData]);

  return defaultState;
};

// =========================================================================

const fakeData: TfakeDto = {
  id: '1',

  付款申請單號: '123',
  申請日期: '2021/01/01',
  經辦人員: 'larry',
  廠商代號: '456',
  扣款類別: '789',
  立帳方式: '101112',
  發票號碼: '131415',
};
