// 工程聯絡單
// 工程聯絡單
// 工程聯絡單

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import PageHeader from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import WorkContactDoc_component, {
  TimperativeHandle,
  TonStateChange,
} from 'components/page/worksDepartment/contracList/contract/workContactDoc/workContactDoc_component';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { useGetContract_id } from 'js/api/api_quotation';

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
  const { data: contract, update: update_contract } = useGetContract_id(contractId, {
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

  // ---------------------------------------------------------------------------

  // const reqCreateWorkSheet = async () => {
  //   if (!contractId) {
  //     return myAlert.info({ title: '無合約id', content: '請回到工務部合約列表再次選擇合約' });
  //   }

  //   try {
  //     setIsLoading(true);
  //     await apiPostWorkSheet({ contractId });
  //     myAlert.success({ title: '產生工作表成功' });
  //   } catch (error) {
  //     const err = error as Error;

  //     myAlert.info({ title: '產生工作表失敗', content: err.message });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // ----------------------------------------------------------------------------
  const panelList_01: TpanelList = [
    // contract?.worksheetId ? null : { type: 'myButton', label: '產生工作表', onClick: reqCreateWorkSheet },
    { type: 'myButton', label: '匯出工程聯絡單', onClick: () => ref_workContact.current.openPdf() },
    { type: 'myButton', label: '編輯聯絡人', onClick: () => ref_workContact.current.setDisabled(false) },
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

  // ----------------------------------------------------------------------------
  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader
        //
        showReturnBtn={!(isShowPattern || !disabled)}
        panelList={panelList}
        contractNumber={workContactContractNumber}
      />

      <div>
        <WorkContactDoc_component
          ref={ref_workContact}
          contract={contract}
          engineeringContactId={engineeringContactId}
          onStateChange={onWorkContactStateChange}
          readonly={true}
        />
      </div>
    </SubLayer>
  );
}
