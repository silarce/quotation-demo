import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import Row, { Cell } from 'components/global/gear/table/row';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// utils
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';

import { optionsCreator_invoiceType } from 'js/utils/options/options';

// api
import {
  Tparams,
  useGetAccountantInvoiceBook,
  apiPostAccountantInvoiceBook,
  apiPatchAccountantInvoiceBook,
} from 'js/api/api_accountant';

import type { TinvoiceType } from 'js/api/dtoTypes';

// css
import scss from './index.module.scss';

// ------------------------------------------------------------------------

type Tquery = {
  year: string;
  month: string;
  keyword: string;
};

type Tstate = {
  readonly id: string;
  isChanged: boolean;

  // type: TinvoiceType;
  type: string;
  alphabeticletter: string;
  startNumber: string;
  readonly endNumber: string;
  readonly latestInvoiceNumber: string | null;
};

type TstateList = {
  [id: string]: Tstate;
};

type Thandle_edit = ({
  id,
  key,
  value,
}: {
  id: string;
  key: keyof Pick<Tstate, 'type' | 'alphabeticletter' | 'startNumber'>;
  value: string;
}) => void;

// ____________________________________________________________________________
// ____________________________________________________________________________
type Tkey = keyof Pick<Tstate, 'type' | 'alphabeticletter' | 'startNumber' | 'endNumber' | 'latestInvoiceNumber'>;

type TconfigItem = {
  label: string;
  style?: React.CSSProperties;
  className?: string;
  createInputProps: (props: {
    disabled: boolean;
    state: Tstate;
    // setState: React.Dispatch<React.SetStateAction<Tstate>>;
    handle_edit: Thandle_edit;
  }) => TinputSelProps;
};

type Tconfig = {
  [key in Tkey]: TconfigItem;
};

// ------------------------------------------------------------------------

// MARK: START

export default function InvoiceBook() {
  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth_options();

  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    year = thisYear.toString(),
    month = thisMonth.toString(),
    keyword,
  } = query;

  // ------------------------------------------------------------------------

  const params: Tparams = useMemo(() => {
    return {
      pageSIze: 99999,
      sort: 'startNumber',
    };
  }, [year, month, keyword]);

  const { data: data_invoiceBook = [], update: update_invoiceBook } = useGetAccountantInvoiceBook({ params });

  // ------------------------------------------------------------------------

  const [state_bookList, setState_bookList] = useState<TstateList>({});
  const state_bookArr = Object.values(state_bookList);

  // ------------------------------------------------------------------------

  const handle_edit = ({
    id,
    key,
    value,
  }: {
    id: string;
    key: keyof Pick<Tstate, 'type' | 'alphabeticletter' | 'startNumber'>;
    value: string;
  }) => {
    const list = { ...state_bookList };
    const item = list[id];

    if (item) {
      item.isChanged = true;
      item[key] = value;
      setState_bookList(list);
    }
  };

  // ------------------------------------------------------------------------

  // region PROPS

  const selectPropsArr = useYearMonth_selectBar_query({
    year: year,
    month: month,
    yearOptionArr,
    monthOptionArr,
  });

  const searchGroup: TsearchGroup = {
    searchTargetList: [
      {
        value: keyword,
        placeholder: '請輸入關鍵字',
        width: '200px',
      },
    ],
    doSearch: (arr) => {
      const keyword = arr[0] as string;
      router.replace({
        query: {
          ...query,
          keyword,
        },
      });
    },
  };

  const panelList: TpanelList = [
    { searchGroup },
    {
      type: 'myButton',
      label: '新增',
      onClick: () => {},
    },
  ];

  // --------------------------------------------------------------------------

  useEffect(() => {
    const list: TstateList = data_invoiceBook.reduce((acc, item) => {
      const { id, type, alphabeticletter, startNumber, endNumber, latestInvoiceNumber } = item;

      acc[id] = {
        id,
        isChanged: false,
        type,
        alphabeticletter,
        startNumber,
        endNumber,
        latestInvoiceNumber,
      };

      return acc;
    }, {} as TstateList);

    setState_bookList(list);
  }, [data_invoiceBook]);

  // --------------------------------------------------------------------------
  // MARK:RENDER
  return (
    <SubLayer>
      <PageHeader02
        tag="購買發票"
        customeLeft={[<SelectBar key="selectBar" className="ml-10" selectPropsArr={selectPropsArr} />]}
        panelList={panelList}
      />

      <div className={scss.table}>
        <Row thead={true} fullWidth={true}>
          {keyArr.map((key) => {
            const { label, style } = config[key];

            return (
              <Cell key={key} style={style}>
                {label}
              </Cell>
            );
          })}
        </Row>

        {state_bookArr.map((state) => {
          const { id } = state;

          return (
            <Row key={id}>
              {keyArr.map((key) => {
                const { label, style, createInputProps } = config[key];

                const props = createInputProps({
                  disabled: false,
                  state,
                  handle_edit,
                });

                return (
                  <Cell key={key} style={style}>
                    <InputSel {...props} />
                  </Cell>
                );
              })}
            </Row>
          );
        })}

        {/* <Row fullWidth={true}></Row> */}
      </div>
    </SubLayer>
  );
}

// MARK: END

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------

const keyArr: Tkey[] = ['type', 'alphabeticletter', 'startNumber', 'endNumber', 'latestInvoiceNumber'];

const config: Tconfig = {
  type: {
    label: '發票種類',
    style: { width: 120 },
    createInputProps: ({ state, handle_edit }) => {
      return {
        selectProps: {
          props: {
            options: optionsCreator_invoiceType(),
            value: { value: state.type, label: state.type },
            onChange: (option) => {
              if (option) {
                handle_edit({ id: state.id, key: 'type', value: option.value });
              }
            },
          },
        },
      };
    },
  },
  alphabeticletter: {
    label: '字軌',
    style: { width: 120 },
    createInputProps: ({ state, handle_edit }) => {
      return {
        inputProps: {
          props: {
            value: state.alphabeticletter,
            onChange: (e) => {
              handle_edit({ id: state.id, key: 'alphabeticletter', value: e.target.value });
            },
          },
        },
      };
    },
  },
  startNumber: {
    label: '起始號碼',
    style: { width: 120 },
    createInputProps: ({ state, handle_edit }) => {
      return {
        inputProps: {
          props: {
            value: state.startNumber,
            onChange: (e) => {
              handle_edit({ id: state.id, key: 'startNumber', value: e.target.value });
            },
          },
        },
      };
    },
  },
  endNumber: {
    label: '截止號碼',
    style: { width: 120 },
    createInputProps: ({ state, handle_edit }) => {
      return {
        inputProps: {
          props: {
            readOnly: true,
            value: state.endNumber,
            onChange: () => {},
          },
        },
      };
    },
  },
  latestInvoiceNumber: {
    label: '當前號碼',
    style: { width: 120 },
    createInputProps: ({ state, handle_edit }) => {
      return {
        inputProps: {
          props: {
            value: state.latestInvoiceNumber ?? '',
            onChange: () => {},
          },
        },
      };
    },
  },
};
