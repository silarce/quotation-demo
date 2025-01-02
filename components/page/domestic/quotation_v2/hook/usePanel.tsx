import { TpanelList } from 'components/PageHeader/PageHeader02/PanelList';

interface Tprops {
  disabled: boolean;
  isNewQuotation: boolean;
  btnEditOnClick: () => void;
  btnCancelOnClick: () => void;
  btnPatchOnClick: () => void;
  btnPostOnClick: () => void;
}

const usePanel = ({
  disabled,
  isNewQuotation,
  btnEditOnClick,
  btnCancelOnClick,
  btnPatchOnClick,
  btnPostOnClick,
}: Tprops): TpanelList => {
  const panelList_01: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: btnEditOnClick,
    },
  ];
  const panelList_02: TpanelList = [
    {
      type: 'redButton',
      label: isNewQuotation ? '新建報價單' : '更新報價單',
      onClick: isNewQuotation ? btnPostOnClick : btnPatchOnClick,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: btnCancelOnClick,
    },
  ];

  const panelList = disabled ? panelList_01 : panelList_02;

  return panelList;
};

export { usePanel };
