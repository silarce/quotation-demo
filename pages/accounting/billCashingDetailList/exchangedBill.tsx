import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import Row, { Cell } from 'components/global/gear/table/row';

import scss from './exchangedBill.module.scss';

export default function ExchangedBill() {
  return (
    <SubLayer>
      <PageHeader02 tag="票據兌現" />

      <div className={scss.main}>
        <div className={scss.info}>
          <InputSel
            caption="兌現單號"
            showBaseline="invisible"
            inputProps={{
              props: {
                defaultValue: 'ffff',
                readOnly: true,
              },
            }}
          />
          <InputSel
            caption="兌現日期"
            showBaseline="invisible"
            inputProps={{
              props: {
                defaultValue: 'ffff',
                readOnly: true,
              },
            }}
          />
          <InputSel
            caption="兌現帳戶"
            showBaseline="invisible"
            inputProps={{
              props: {
                defaultValue: 'ffff',
                readOnly: true,
              },
            }}
          />
        </div>

        {/*  */}

        <div className={scss.table}>
          <Row thead={true} fullWidth={true}>
            <Cell>次序</Cell>
            <Cell>票據號碼</Cell>
            <Cell>預兌日</Cell>
            <Cell>到期日</Cell>
            <Cell>票面金額</Cell>
            <Cell>客戶名稱</Cell>
          </Row>
        </div>

        {/*  */}
      </div>
    </SubLayer>
  );
}
// ==========================================================================

type TconfigItem = {
  label: string;
  style?: React.CSSProperties;
};

type Tconfig = {
  [key: string]: TconfigItem;
};

const config: Tconfig = {
  indexNumbe: {
    label: '次序',
  },
};
