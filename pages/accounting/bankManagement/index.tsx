import { useEffect } from 'react';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

import { useGetBankAccount, apiPostBankAccount } from 'js/api/api_netCore/api_accountant';

// =================================================================================

// MARK: START

export default function BankManagement(): React.ReactElement {
  // --------------------------------------------------------------------

  const { rawData_bankAccount, update_bankAccount, isFetching_bankAccount } = useGetBankAccount();

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

  const post = async () => {
    await apiPostBankAccount({
      accountName: '陳喵喵',
      account: '123-223-323',
      bankCode: '45-678989-23',
      bankName: '喵喵大銀行',
    });
  };

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
        <button onClick={post}>post</button>
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
