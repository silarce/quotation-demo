// 工程聯絡單
// 工程聯絡單
// 工程聯絡單

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import Nav_worksDepartment from 'components/page/worksDepartment/nav_worksDepartment';

import WorkContactDoc_component, {
  TimperativeHandle,
  TonStateChange,
} from 'components/page/worksDepartment/contracList/contract/workContactDoc/workContactDoc_component';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { useGetContract_id } from 'js/api/api_quotation';

import { usePanel_returnWorksDepartmentContractList } from 'components/page/worksDepartment/hook/usePanel_returnWorksDepartmentContractList';

// ============================================================================
type Tquery = {
  contractId: string;
};

// ============================================================================
export default function WorkContactDoc() {
  const router = useRouter();
  const { contractId } = router.query as Tquery;

  // 工程聯絡單的狀態
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPattern, setIsShowPattern] = useState(false);
  const [workContactContractNumber, setWorkContactContractNumber] = useState('');

  const ref_workContact = useRef<TimperativeHandle>(null!);

  const onWorkContactStateChange: TonStateChange = ({ disabled, isLoading, isShowPattern, contractNumber }) => {
    setIsShowPattern(isShowPattern);
    setDisabled(disabled);
    setIsLoading(isLoading);
    setWorkContactContractNumber(contractNumber);
  };

  // ---------------------------------------------------------------------------
  const {
    data: contract,
    update: update_contract,
    isFetching,
    contactThatSkipContract,
  } = useGetContract_id(contractId, {
    preBuiltPopulate: 'worksDepartment02',
  });
  const engineeringContactId = contract?.engineeringContactId;

  // ---------------------------------------------------------------------------

  useEffect(() => {
    (async () => {
      try {
        await update_contract();
      } catch (error) {
        myAlert.err({ title: '取得合約資料失敗' });
      }
    })();
  }, [contractId]);

  // ----------------------------------------------------------------------------
  const panelList_01: TpanelList = [
    { type: 'myButton', label: '匯出工程聯絡單', onClick: () => ref_workContact.current.openPdf() },
    {
      type: 'myButton',
      label: contactThatSkipContract ? '編輯' : '編輯聯絡人',
      onClick: () => ref_workContact.current.setDisabled(false),
    },
    ...usePanel_returnWorksDepartmentContractList(),
  ];
  const panelList_02: TpanelList = [
    {
      type: 'redButton',
      label: '確認',
      onClick: () => {
        ref_workContact.current.reqPatch();
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        ref_workContact.current.setDisabled(true);
      },
    },
  ];

  const panelList_pattern: TpanelList = [
    //
    {
      type: 'myButton',
      label: '關閉工程圖表',
      onClick: () => {
        ref_workContact.current.closePattern();
      },
    },
  ];

  const panelList = isShowPattern ? panelList_pattern : disabled ? panelList_01 : panelList_02;

  // ----------------------------------------------------------------------------
  return (
    <SubLayer isLoading_all={isFetching || isLoading}>
      <div>
        <PageHeader02 tag={`合約編號 ${workContactContractNumber}`} panelList={panelList} />
        <Nav_worksDepartment contactThatSkipContract={contactThatSkipContract} />
      </div>

      <div>
        <WorkContactDoc_component
          ref={ref_workContact}
          contract={contract}
          engineeringContactId={engineeringContactId}
          onStateChange={onWorkContactStateChange}
          onlyAllowEditContact={!contactThatSkipContract}
          showProd={!contactThatSkipContract}
          showPatternPanel={!contactThatSkipContract}
        />
      </div>
    </SubLayer>
  );
}
