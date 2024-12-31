import { TpanelList } from 'components/PageHeader/PageHeader02/PanelList';

const usePanel = ({
  disabled,
  props_panelList_01,
  props_panelList_02,
}: {
  disabled: boolean;
  props_panelList_01: {
    onEdit: () => void;
  };
  props_panelList_02: {
    onCancel: () => void;
    onUpload: () => void;
  };
}): TpanelList => {
  const panelList_01: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: props_panelList_01.onEdit,
    },
  ];
  const panelList_02: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: props_panelList_02.onUpload,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: props_panelList_02.onCancel,
    },
  ];

  const panelList = disabled ? panelList_01 : panelList_02;

  return panelList;
};

export { usePanel };
