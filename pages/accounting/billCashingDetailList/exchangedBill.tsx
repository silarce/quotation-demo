import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
// import Pdf_exchangedBill from './pdf_exchangedBill';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import Row, { Cell } from 'components/global/gear/table/row';

import scss from './exchangedBill.module.scss';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// api
import { TaccountantDto, useGetAccountantExchangeFrom } from 'js/api/api_accountant';

// ==========================================================================

type Tquery = {
  id: string;
};

// ==========================================================================

// MARK: START

export default function ExchangedBill() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { id } = query;

  // ---------------------------------------------------------------------------

  const [showPdf, setShowPdf] = useState(false);

  // ---------------------------------------------------------------------------

  const { data } = useGetAccountantExchangeFrom(id);
  const {
    accountant = [],

    sheetNumber,
    cashExchangeAccount,
    cashExchangeDate,
  } = data ?? {};

  const priceTotal = accountant.reduce((acc, curr) => acc + (curr.price ?? 0), 0).toLocaleString();

  // ---------------------------------------------------------------------------

  // MARK: PROPS
  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '列印',
      onClick: () => {},
    },
  ];

  // ---------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer>
      <PageHeader02 tag="票據兌現" panelList={panelList} />

      <div className={scss.main}>
        <div className={scss.info}>
          <InputSel
            caption="兌現單號"
            showBaseline="invisible"
            inputProps={{
              props: {
                defaultValue: sheetNumber ?? '',
                readOnly: true,
              },
            }}
          />
          <InputSel
            caption="兌現日期"
            showBaseline="invisible"
            inputProps={{
              props: {
                defaultValue: cashExchangeDate ? getTaiwanDateStr(cashExchangeDate) || '' : '',
                readOnly: true,
              },
            }}
          />
          <InputSel
            caption="兌現帳戶"
            showBaseline="invisible"
            inputProps={{
              props: {
                defaultValue: cashExchangeAccount ?? '',
                readOnly: true,
              },
            }}
          />
        </div>

        {/*  */}

        <div className={scss.table}>
          <Row className={scss.thead} thead={true} fullWidth={true}>
            {keyArr.map((key) => {
              const { label, style } = config[key];

              return (
                <Cell key={key} style={style}>
                  {label}
                </Cell>
              );
            })}
          </Row>

          {accountant.map((acc, index) => {
            const { id, noteNumber, receiptEstimatedDate, noteMaturityDate, price, vendorName } = acc;

            const list = {
              indexNumber: index + 1,
              noteNumber,
              receiptEstimatedDate: getTaiwanDateStr(receiptEstimatedDate) || '',
              noteMaturityDate: getTaiwanDateStr(noteMaturityDate) || '',
              price: price?.toLocaleString() ?? '',
              vendorName,
            };

            return (
              <Row className={scss.tbodyRow} key={id} fullWidth={true}>
                {keyArr.map((key) => {
                  const { style } = config[key];

                  return (
                    <Cell key={key} style={style}>
                      {list[key]}
                    </Cell>
                  );
                })}
              </Row>
            );
          })}
          {/* ============================================================ */}
          {/* ============================================================ */}

          {/* ============================================================ */}
          {/* ============================================================ */}
        </div>
        <div className={scss.bottomRowWrapper}>
          <Row className={scss.totalRow} thead={true} fullWidth={true}>
            {keyArr_half.map((key) => {
              const { style } = config[key];

              return <Cell key={key} style={style} />;
            })}

            <Cell style={config[keyArr[3]].style}>兌現金額合計</Cell>
            <Cell style={config[keyArr[4]].style}>{priceTotal}</Cell>
            <Cell style={{ flex: 1, backgroundColor: 'white' }}></Cell>
          </Row>
          <div className={scss.block} />
        </div>

        {/*  */}
      </div>
      {/* {data && <Pdf_exchangedBill accountantExchangeFromDto={data} />} */}
    </SubLayer>
  );
}

// MARK: END

// ==========================================================================

type Tkey =
  | keyof Pick<TaccountantDto, 'noteNumber' | 'receiptEstimatedDate' | 'noteMaturityDate' | 'price' | 'vendorName'>
  | 'indexNumber';

type TconfigItem = {
  label: string;
  style?: React.CSSProperties;
};

type Tconfig = {
  [key in Tkey]: TconfigItem;
};

const keyArr: Tkey[] = [
  //
  'indexNumber',
  'noteNumber',
  'receiptEstimatedDate',
  'noteMaturityDate',
  'price',
  'vendorName',
];

const keyArr_half = keyArr.slice(0, 3);

const config: Tconfig = {
  indexNumber: {
    label: '次序',
    style: { width: 50 },
  },
  noteNumber: {
    label: '票據號碼',
    style: { width: 100 },
  },
  receiptEstimatedDate: {
    label: '預兌日',
    style: { width: 120 },
  },
  noteMaturityDate: {
    label: '到期日',
    style: { width: 120 },
  },
  price: {
    label: '票面金額',
    style: { width: 120 },
  },
  vendorName: {
    label: '客戶名稱',
    style: { width: 300 },
  },
};
