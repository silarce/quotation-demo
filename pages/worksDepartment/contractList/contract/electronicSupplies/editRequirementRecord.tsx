import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import SupplyTable, { Tcontrol_nestedRow } from 'components/page/worksDepartment/electronicSupplies/ui/supplyTable';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// css
import scss from './editRequirementRecord.module.scss';
import { TemployeeDto } from 'js/api/dtoTypes';

// ==================================================================
type Tquery = {
  historyId: string | undefined;
};

// ==================================================================
export default function EditRequirementRecord() {
  const router = useRouter();
  const { historyId } = router.query as Tquery;

  // ------------------------------------------------------------------
  const [disabled, setDisabled] = useState(true);

  const [showSelector, setShowSelector] = useState(false);

  // ------------------------------------------------------------------

  const [employee00, setEmployee00] = useState<TemployeeDto>();
  const [employee01, setEmployee01] = useState<TemployeeDto>();

  // ------------------------------------------------------------------

  const fakeData_lockbox: Tcontrol_nestedRow = {
    name: '鎖盒',
    subTypeArr: [
      {
        name: '智慧型（含主機）',
        needQty_inputAttr: {},
      },
      {
        name: '智慧型（含主機）+ 發訊器',
        needQty_inputAttr: {},
      },
      {
        name: '智慧型（含主機）+ 發射器',
        needQty_inputAttr: {},
      },
      {
        name: '智慧型（含主機）+ 發訊器 + 發射器',
        needQty_inputAttr: {},
      },
      {
        name: '面板式',
        needQty_inputAttr: {},
      },
      {
        name: '埋入式',
        needQty_inputAttr: {},
      },
      {
        name: '外露式',
        needQty_inputAttr: {},
      },
    ],
  };

  const fakeData_key: Tcontrol_nestedRow = {
    name: '鎖匙',
    subTypeArr: [
      {
        name: '鎖號',
        needQty_inputAttr: {},
      },
      {
        name: '特殊鎖號',
        needQty_inputAttr: {},
      },
    ],
  };

  const fakeData_panel: Tcontrol_nestedRow = {
    name: '控制箱/盤',
    typeName: '捲門/水閘門',
    subTypeArr: [
      {
        name: '馬達控制箱 220V 2HP',
        needQty_inputAttr: {},
      },
      {
        name: '馬達控制箱 220V 2HP',
        needQty_inputAttr: {},
      },
      {
        name: '馬達控制箱 220V 2HP',
        needQty_inputAttr: {},
      },
      {
        name: '馬達控制箱 220V 2HP',
        needQty_inputAttr: {},
      },
      {
        name: '馬達控制箱 220V 2HP',
        needQty_inputAttr: {},
      },
    ],
  };

  const fakeData_pressButton: Tcontrol_nestedRow = {
    name: '押扣',
    subTypeArr: [
      {
        name: '三點式（一般）',
        needQty_inputAttr: {},
      },
    ],
  };

  const fakeData_firefightingSupplies: Tcontrol_nestedRow = {
    name: '消防備品',
    subTypeArr: [
      {
        name: '煙感器',
        needQty_inputAttr: {},
      },
      {
        name: '中繼器 1φ 220v',
        needQty_inputAttr: {},
      },
      {
        name: '中繼器 3φ 380v',
        needQty_inputAttr: {},
      },
    ],
  };

  const fakeData_host: Tcontrol_nestedRow = {
    name: '主機',
    subTypeArr: [
      {
        name: '遙控器（1:2）+ 障感器',
        needQty_inputAttr: {},
      },
      {
        name: '遙控器（1:2）',
        needQty_inputAttr: {},
      },
      {
        name: '障感器',
        needQty_inputAttr: {},
      },
    ],
  };

  const fakeData_infrared: Tcontrol_nestedRow = {
    name: '紅外線',
    subTypeArr: [
      {
        name: '反射式',
        needQty_inputAttr: {},
      },
      {
        name: '對照式',
        needQty_inputAttr: {},
      },
    ],
  };

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
            caption="需求日期"
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
        <SupplyTable
          className="mt-[50px]"
          qtyType={'request'}
          rowArr={[
            fakeData_lockbox,
            fakeData_key,
            fakeData_panel,
            fakeData_pressButton,
            fakeData_firefightingSupplies,
            fakeData_host,
            fakeData_infrared,
          ]}
          disabled={disabled}
        />

        {/*  */}
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
