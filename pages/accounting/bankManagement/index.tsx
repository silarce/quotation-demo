import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import Row, { Cell } from 'components/global/gear/table/row';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { TablePanel_basic } from 'components/global/gear/table/tablePanel';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { useGetBankAccount, apiPostBankAccount, apiPatchBankAccount } from 'js/api/api_netCore/api_accountant';
import type {
  TaccountantPresetDto,
  TcreateAccountantPresetDto,
  TupdateAccountantPresetDto,
} from 'js/api/api_netCore/api_accountant';

import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

import scss from './index.module.scss';

import { useTranslation } from 'react-i18next';

// =================================================================================

interface Tstate {
  id?: string;
  account_name: string;
  readonly account: string;
  readonly bank_name: string;
  readonly bank_code: string;
}

type TExtractRaw = Pick<TaccountantPresetDto, 'account_name' | 'account' | 'bank_name' | 'bank_code'> & { id?: string };

// =================================================================================

// MARK: START

export default function BankManagement(): React.ReactElement {
  // --------------------------------------------------------------------
  const { t } = useTranslation('accounting', { keyPrefix: 'bankManagement' });
  const config = useConfig();

  // --------------------------------------------------------------------

  const [newBank, setNewBank] = useState<TExtractRaw>();

  // --------------------------------------------------------------------

  const {
    //
    rawData_bankAccount = [],
    update_bankAccount,
    isFetching_bankAccount,
  } = useGetBankAccount();

  // --------------------------------------------------------------------

  // region REQ

  const reqPost = async (state: Tstate) => {
    const body = state as TcreateAccountantPresetDto;

    const { account_name, account, bank_name, bank_code } = body;

    if (!account_name || !account || !bank_name || !bank_code) {
      myAlert.info({ title: '請填寫所有欄位' });

      return Promise.reject();
    }

    await apiPostBankAccount(body).then(async () => {
      await update_bankAccount();
      setNewBank(undefined);
    });
  };

  const reqPatch = async (state: Tstate) => {
    const body = state as TupdateAccountantPresetDto;

    await apiPatchBankAccount(body).then(async () => {
      await update_bankAccount();
    });
  };

  // --------------------------------------------------------------------

  const addBank = () => {
    setNewBank({
      account_name: '',
      account: '',
      bank_name: '',
      bank_code: '',
    });
  };

  const clearAdd = () => {
    setNewBank(undefined);
  };

  // --------------------------------------------------------------------

  useEffect(() => {
    update_bankAccount();
  }, []);

  // --------------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02 tag={t('bankManagement')} />

      <div className={scss.main}>
        <Row thead={true} className={classNames(scss.row, scss.thead)}>
          <Cell style={config.panel.style}>
            {!newBank && <IconAddCircle className="h-[20px]" onClick={addBank} />}
            {newBank && <IconRemoveCircle className="h-[20px]" onClick={clearAdd} />}
          </Cell>

          {keyArr.map((key) => {
            const { label, style } = config[key];

            return (
              <Cell key={key} style={style}>
                {label}
              </Cell>
            );
          })}
        </Row>

        {newBank && <BankRow rawData_bankAccount={newBank} onConfirm={reqPost} />}

        {rawData_bankAccount.map((raw) => {
          return <BankRow key={raw.id} rawData_bankAccount={raw} onConfirm={reqPatch} />;
        })}
      </div>
    </SubLayer>
  );
}
// MARK: END

// =================================================================================
// =================================================================================
// =================================================================================
// =================================================================================
// =================================================================================

// MARK: BankRow

const BankRow = ({
  //
  rawData_bankAccount,
  onConfirm,
}: {
  rawData_bankAccount: TExtractRaw;
  onConfirm: (state: Tstate) => Promise<void>;
}) => {
  const config = useConfig();

  // ----------------------------------------------------------------------------

  const defaultState = useMemo(() => {
    return rawData_bankAccount;
  }, [rawData_bankAccount]);

  // ----------------------------------------------------------------------------
  const [state, setState] = useState<Tstate>(defaultState);
  const isNew = !state.id;

  const [disabled, setDisabled] = useState(!isNew);

  // ----------------------------------------------------------------------------

  const theOnConfifm = async () => {
    await onConfirm(state).then(() => {
      setDisabled(true);
    });
  };

  // ----------------------------------------------------------------------------
  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  return (
    <Row className={classNames(scss.row, isNew && scss.new)}>
      <Cell style={config.panel.style}>
        <TablePanel_basic
          //
          disabled={disabled}
          setDisabled={setDisabled}
          onConfirm={theOnConfifm}
          showEdit={!isNew}
        />
      </Cell>

      {keyArr.map((key) => {
        const inputSelProps = inputSelPropsDict[key]({ state, setState, isNew });

        return (
          <Cell key={key} style={config[key].style}>
            <InputSel {...inputSelProps} disabled={disabled} />
          </Cell>
        );
      })}
    </Row>
  );
};

// =================================================================================

interface Tconfig {
  [key: string]: {
    label?: string;
    style?: React.CSSProperties;
  };
}

interface TinputSelPropsDict {
  [key: string]: ({
    state,
    setState,
    isNew,
  }: {
    state: Tstate;
    setState: React.Dispatch<React.SetStateAction<Tstate>>;
    isNew: boolean;
  }) => TinputSelProps;
}

const keyArr = ['account_name', 'account', 'bank_name', 'bank_code'];

const useConfig = () => {
  const { t } = useTranslation('accounting', { keyPrefix: 'bankManagement' });

  const config: Tconfig = {
    panel: {
      style: {
        width: 50,
      },
    },

    account_name: {
      label: t('accountName'),
      style: { width: 200 },
    },
    account: { label: t('account'), style: { width: 200 } },
    bank_name: { label: t('bankName'), style: { width: 200 } },
    bank_code: { label: t('bankCode'), style: { width: 150 } },
  };

  return config;
};

const inputSelPropsDict: TinputSelPropsDict = {
  account_name: ({ state, setState }) => {
    const inputSelProps: TinputSelProps = {
      showBaseline: 'auto',
      inputProps: {
        props: {
          value: state.account_name,
          onChange: (e) => {
            setState({ ...state, account_name: e.target.value.trim() });
          },
        },
      },
    };

    return inputSelProps;
  },
  account: ({ state, setState, isNew }) => {
    const inputSelProps_old: TinputSelProps = {
      showBaseline: 'invisible',
      node: <div className="text-center">{state.account}</div>,
    };

    const inputSelProps_new: TinputSelProps = {
      showBaseline: 'auto',
      inputProps: {
        props: {
          value: state.account,
          onChange: (e) => {
            setState({ ...state, account: e.target.value.trim() });
          },
        },
      },
    };

    const inputSelProps = isNew ? inputSelProps_new : inputSelProps_old;

    return inputSelProps;
  },
  bank_name: ({ state, setState, isNew }) => {
    const inputSelProps_old: TinputSelProps = {
      showBaseline: 'invisible',
      node: <div className="text-center">{state.bank_name}</div>,
    };

    const inputSelProps_new: TinputSelProps = {
      showBaseline: 'auto',
      inputProps: {
        props: {
          value: state.bank_name,
          onChange: (e) => {
            setState({ ...state, bank_name: e.target.value.trim() });
          },
        },
      },
    };

    const inputSelProps = isNew ? inputSelProps_new : inputSelProps_old;

    return inputSelProps;
  },
  bank_code: ({ state, setState, isNew }) => {
    const inputSelProps_old: TinputSelProps = {
      showBaseline: 'invisible',
      node: <div className="text-center">{state.bank_code}</div>,
    };

    const inputSelProps_new: TinputSelProps = {
      showBaseline: 'auto',
      inputProps: {
        props: {
          value: state.bank_code,
          onChange: (e) => {
            setState({ ...state, bank_code: e.target.value.trim() });
          },
        },
      },
    };

    const inputSelProps = isNew ? inputSelProps_new : inputSelProps_old;

    return inputSelProps;
  },
};

// =================================================================================
