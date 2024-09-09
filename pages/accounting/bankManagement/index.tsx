import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import Row, { Cell } from 'components/global/gear/table/row';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { TablePanel_basic } from 'components/global/gear/table/tablePanel';

// api
import { useGetBankAccount, apiPostBankAccount, apiPatchBankAccount } from 'js/api/api_netCore/api_accountant';
import type {
  TaccountantPresetDto,
  TcreateAccountantPresetDto,
  TupdateAccountantPresetDto,
} from 'js/api/api_netCore/api_accountant';

// =================================================================================

interface Tstate {
  id?: string;
  account_name: string;
  readonly account: string;
  readonly bank_name: string;
  readonly bank_code: string;
}

// =================================================================================

// MARK: START

export default function BankManagement(): React.ReactElement {
  // --------------------------------------------------------------------

  const { rawData_bankAccount = [], update_bankAccount, isFetching_bankAccount } = useGetBankAccount();

  // --------------------------------------------------------------------

  // --------------------------------------------------------------------

  // const panelList_disabled: TpanelList = [
  //   {
  //     type: 'myButton',
  //     label: '編輯',
  //     onClick: () => {
  //       switchDisabled(false);
  //     },
  //   },
  // ];

  const panelList_abled: TpanelList = [
    // {
    //   type: 'redButton',
    //   label: reqPost ? '確定新增' : reqPatch ? '確定更新' : '後端設定錯誤',
    //   onClick: () => {
    //     if (reqPost) {
    //       reqPost();
    //     } else if (reqPatch) {
    //       reqPatch();
    //     } else {
    //       myAlert.err({ title: '後端設定錯誤' });
    //     }
    //   },
    // },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        // switchDisabled(true);
      },
    },
  ];

  // const panelList = disabled ? panelList_disabled : panelList_abled;

  // --------------------------------------------------------------------

  // const post = async () => {
  //   await apiPostBankAccount({
  //     account_name: '王汪汪',
  //     account: '123-223-323',
  //     bank_code: '45-678989-23',
  //     bank_name: '汪汪小銀行',
  //   });
  // };

  // --------------------------------------------------------------------

  useEffect(() => {
    update_bankAccount();
  }, []);

  // --------------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02
        tag="銀行管理"
        // panelList={panelList}
      />

      <div>
        <Row thead={true} className="px-5">
          <Cell style={config.panel.style} />

          {keyArr.map((key) => {
            const { label, style } = config[key];

            return (
              <Cell key={key} style={style}>
                {label}
              </Cell>
            );
          })}
        </Row>
        {rawData_bankAccount.map((raw) => {
          return <BankRow key={raw.id} rawData_bankAccount={raw} update_bankAccount={update_bankAccount} />;
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

const BankRow = ({
  //
  rawData_bankAccount,
  update_bankAccount,
}: {
  rawData_bankAccount: TaccountantPresetDto;
  update_bankAccount: () => void;
}) => {
  const defaultState = useMemo(() => {
    return rawData_bankAccount;
  }, [rawData_bankAccount]);

  // ----------------------------------------------------------------------------

  const [disabled, setDisabled] = useState(true);

  const [state, setState] = useState<Tstate>(defaultState);
  // ----------------------------------------------------------------------------

  const reqPost = async (body: TcreateAccountantPresetDto) => {
    await apiPostBankAccount(body)
      .then(async () => {
        await update_bankAccount();
        setDisabled(true);
      })
      .catch(() => {});
  };

  const reqPatch = async (body: TupdateAccountantPresetDto) => {
    await apiPatchBankAccount(body)
      .then(async () => {
        await update_bankAccount();
        setDisabled(true);
      })
      .catch(() => {});
  };

  // ----------------------------------------------------------------------------

  const onConfifm = () => {
    const body = state;

    if (body.id) {
      reqPatch(body as TupdateAccountantPresetDto);
    } else {
      reqPost(body as TcreateAccountantPresetDto);
    }
  };

  // ----------------------------------------------------------------------------
  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  return (
    <Row className="px-5">
      <Cell style={config.panel.style}>
        <TablePanel_basic disabled={disabled} setDisabled={setDisabled} onConfirm={onConfifm} />
      </Cell>

      {keyArr.map((key) => {
        const inputSelProps = inputSelPropsDict[key]({ state, setState });

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
  }: {
    state: Tstate;
    setState: React.Dispatch<React.SetStateAction<Tstate>>;
  }) => TinputSelProps;
}

const keyArr = ['account_name', 'account', 'bank_name', 'bank_code'];

const config: Tconfig = {
  panel: {
    style: {
      width: 50,
    },
  },

  account_name: {
    label: '帳戶名',
    style: { width: 200 },
  },
  account: { label: '帳戶', style: { width: 200 } },
  bank_name: { label: '銀行', style: { width: 200 } },
  bank_code: { label: '銀行代號', style: { width: 150 } },
};

const inputSelPropsDict: TinputSelPropsDict = {
  account_name: ({ state, setState }) => {
    const inputSelProps: TinputSelProps = {
      showBaseline: 'auto',
      inputProps: {
        props: {
          value: state.account_name,
          onChange: (e) => {
            setState({ ...state, account_name: e.target.value });
          },
        },
      },
    };

    return inputSelProps;
  },
  account: ({ state }) => {
    const inputSelProps: TinputSelProps = {
      showBaseline: 'invisible',
      node: <div className="text-center">{state.account}</div>,
    };

    return inputSelProps;
  },
  bank_name: ({ state }) => {
    const inputSelProps: TinputSelProps = {
      showBaseline: 'invisible',
      node: <div className="text-center">{state.bank_name}</div>,
    };

    return inputSelProps;
  },
  bank_code: ({ state }) => {
    const inputSelProps: TinputSelProps = {
      showBaseline: 'invisible',
      node: <div className="text-center">{state.bank_code}</div>,
    };

    return inputSelProps;
  },
};

// =================================================================================

// // icon
