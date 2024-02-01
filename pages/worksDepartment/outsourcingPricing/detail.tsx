import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList, TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// components
import Table01 from 'components/global/gear/table/table01';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import AddressBar from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';

// css
import scss from './detail.module.scss';

// =======================================================================

// =======================================================================
export default function OutsourcingPricingDetail() {
  const router = useRouter();

  // ---------------------------------------------------------------------
  const [disabled, setDisabled] = useState(false);

  // ---------------------------------------------------------------------

  const panelList_disabled: TpanelList = [
    {
      type: 'redButton',
      label: '編輯',
      onClick: () => {
        setDisabled(false);
      },
    },
    {
      type: 'redButton',
      label: '刪除',
      onClick: () => {},
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
      label: '確認',
      onClick: () => {},
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

  // ---------------------------------------------------------------------

  return (
    <SubLayer>
      <PageHeader02 tag="外包計價單明細" panelList={panelList} />
      <div className={scss.main}>
        {/*  */}
        <div className={scss.profile}>
          <InputSel
            //
            caption={'外包廠商'}
            disabled={disabled}
            showBaseline="auto"
            inputProps={{}}
          />
          <InputSel
            //
            caption={'工程編號'}
            disabled={disabled}
            showBaseline="auto"
            inputProps={{}}
          />
          <InputSel
            //
            caption={'工程日期'}
            disabled={disabled}
            showBaseline="auto"
            inputProps={{}}
          />
          <InputSel
            //
            caption={'安裝人員'}
            disabled={disabled}
            showBaseline="auto"
            inputProps={{}}
          />
          <InputSel
            //
            caption={'工程名稱'}
            className="col-span-2"
            disabled={disabled}
            showBaseline="auto"
            inputProps={{}}
          />
          <AddressBar
            inputSelProps={{
              className: 'col-span-2',
              disabled: disabled,
              showBaseline: 'auto',
            }}
            addressProps={{
              county: {},
              district: {},
              address: {},
            }}
          />
        </div>
        {/*  */}
      </div>
    </SubLayer>
  );
}

// ===========================================================================
