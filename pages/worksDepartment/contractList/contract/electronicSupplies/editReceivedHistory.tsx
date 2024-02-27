import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// css
import scss from './editReceivedHistory.module.scss';
import { TemployeeDto } from 'js/api/dtoTypes';

export default function EditReceivedHistory() {
  const router = useRouter();

  // ------------------------------------------------------------------
  const [disabled, setDisabled] = useState(true);

  const [showSelector, setShowSelector] = useState(false);

  // ------------------------------------------------------------------

  const [employee00, setEmployee00] = useState<TemployeeDto>();
  const [employee01, setEmployee01] = useState<TemployeeDto>();

  // ------------------------------------------------------------------

  const panelList_disabled: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        setDisabled(false);
      },
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.back();
      },
    },
  ];

  const panelList_enabled: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: () => {
        alert('上傳');
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
      },
    },
  ];

  const panelList = disabled ? panelList_disabled : panelList_enabled;

  // ------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader
        panelList={panelList}
        //  contractNumber={contract?.contractNumber ?? '---'}
        contractNumber={'foooo'}
      />

      <div className={scss.container}>
        {/* info */}
        <div className={scss.info}>
          <InputSel
            caption="領料日期"
            {...confit_inputSel}
            disabled={disabled}
            inputProps={{ props: { value: '111-11-11' } }}
          />
          <InputSel
            caption="領料單號"
            {...confit_inputSel}
            disabled={disabled}
            inputProps={{ props: { value: 'A-112233' } }}
          />
          <InputSel
            caption="領料人員"
            {...confit_inputSel}
            disabled={disabled}
            onClick={() => setShowSelector(true)}
            inputProps={{ props: { value: employee00?.chName ?? '孔巴德拉V' } }}
          />
          <InputSel
            caption="備料人員"
            {...confit_inputSel}
            disabled={disabled}
            onClick={() => setShowSelector(true)}
            inputProps={{ props: { value: employee01?.chName ?? '泰坦三' } }}
          />
          <InputSel
            caption="門型"
            {...confit_inputSel}
            disabled={disabled}
            inputProps={{ props: { value: 'SJ-302' } }}
          />
          <InputSel caption="樘數" {...confit_inputSel} disabled={disabled} inputProps={{ props: { value: '9999' } }} />
        </div>
        {/* table */}
        <div></div>

        <SelectorGroup
          showModal={showSelector}
          onConfirm={(arr) => {
            setEmployee00(arr[0][0]);
            setEmployee01(arr[1][0]);
          }}
          onCancel={() => {
            setShowSelector(false);
          }}
        />
      </div>
    </SubLayer>
  );
}

// ==================================================================

const confit_inputSel: TinputSelProps = {
  showBaseline: 'auto',
  captionStyle: { width: '80px' },
  wrapperStyle: { gap: '25px' },
};

const SelectorGroup = selectModalCreator_multi<['employee', 'employee']>({
  selectorArr: [
    {
      key: 'employee',
      caption: '領料人員',
      tip: '單選',
      limit: 1,
    },
    {
      key: 'employee',
      caption: '備料人員',
      tip: '單選',
      limit: 1,
    },
  ],
});
