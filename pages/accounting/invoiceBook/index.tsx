import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// antd
import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

// gear
import Row, { Cell } from 'components/global/gear/table/row';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// utils
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';
import { optionsCreator_invoiceType } from 'js/utils/options/options';

// icon
import { IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

// api
import {
  Tparams,
  useGetAccountantInvoiceBook,
  apiPostAccountantInvoiceBook,
  apiPatchAccountantInvoiceBook,
  deleteAccountantInvoiceBook,
} from 'js/api/api_accountant';

import type { TinvoiceType, TcreateAccountantInvoiceBookDto, TupdateAccountantInvoiceBookDto } from 'js/api/dtoTypes';

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
  alphabeticLetter: string;
  startNumber: string;
  readonly endNumber: string;
  readonly latestInvoiceNumber: string | null;
  //
  mark?: 'delete' | 'new';
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
  key: keyof Pick<Tstate, 'type' | 'alphabeticLetter' | 'startNumber'>;
  value: string;
}) => void;

// ____________________________________________________________________________
// ____________________________________________________________________________
type Tkey = keyof Pick<Tstate, 'type' | 'alphabeticLetter' | 'startNumber' | 'endNumber' | 'latestInvoiceNumber'>;

type TconfigItem = {
  label: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  createInputProps?: (props: {
    disabled: boolean;
    state: Tstate;
    // setState: React.Dispatch<React.SetStateAction<Tstate>>;
    handle_edit: Thandle_edit;
  }) => TinputSelProps;
};

type Tconfig = {
  [key in Tkey | 'btnCell']: TconfigItem;
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
      sort: 'endNumber',
      filter: {
        year: {
          $eq: year,
        },
        month: {
          $eq: month,
        },
        $or: {
          type: {
            $eq: keyword,
          },
          alphabeticLetter: {
            $contains: keyword,
          },
          startNumber: {
            $eq: keyword,
          },
          endNumber: {
            $eq: keyword,
          },
          latestInvoiceNumber: {
            $eq: keyword,
          },
        },
      },
    };
  }, [year, month, keyword]);

  const { data: data_invoiceBook = [], update: update_invoiceBook } = useGetAccountantInvoiceBook({ params });

  // ------------------------------------------------------------------------
  const [disabled, setDisabled] = useState(true);

  const [state_bookList, setState_bookList] = useState<TstateList>({});
  const [state_bookList_new, setState_bookList_new] = useState<TstateList>({});

  const state_bookArr = Object.values(state_bookList);
  const state_bookArr_new = Object.values(state_bookList_new);

  // ------------------------------------------------------------------------

  // region REQUEST

  const reqPost = async (body: TcreateAccountantInvoiceBookDto) => {
    return await apiPostAccountantInvoiceBook(body);
  };

  const reqPatch = async (id: string, body: TupdateAccountantInvoiceBookDto) => {
    return await apiPatchAccountantInvoiceBook(id, body);
  };

  const reqDelete = async (id: string) => {
    return await deleteAccountantInvoiceBook(id);
  };

  // ------------------------------------------------------------------------
  // region FUNCTION

  // _________________________________________________________________________
  // _________________________________________________________________________

  const create_handle_edit = (isNew?: boolean) => {
    const setState = isNew ? setState_bookList_new : setState_bookList;

    const handle_edit = ({
      id,
      key,
      value,
    }: {
      id: string;
      key: keyof Pick<Tstate, 'type' | 'alphabeticLetter' | 'startNumber'>;
      value: string;
    }) => {
      setState((list) => {
        const copy = { ...list };
        const item = copy[id];

        if (item) {
          item.isChanged = true;
          item[key] = value;
        }

        return copy;
      });
    };

    return handle_edit;
  };

  const handle_edit = create_handle_edit();
  const handle_edit_new = create_handle_edit(true);

  // _________________________________________________________________________
  // _________________________________________________________________________
  const addNewBook = () => {
    const id = nanoid();

    setState_bookList_new((list) => {
      return {
        ...list,
        [id]: createEmptyState(id),
      };
    });
  };

  // _________________________________________________________________________
  // _________________________________________________________________________

  const handle_delete = async (id: string) => {
    if (id in state_bookList_new) {
      setState_bookList_new((list) => {
        const copy = { ...list };
        delete copy[id];

        return copy;
      });
    }

    if (id in state_bookList) {
      setState_bookList((list) => {
        const copy = { ...list };
        const item = { ...copy[id] };

        if (item.mark === 'delete') {
          item.mark = undefined;
        } else {
          item.mark = 'delete';
        }

        copy[id] = item;

        return copy;
      });
    }
  };

  // _________________________________________________________________________
  // _________________________________________________________________________
  const handle_confirm = async () => {
    const callReq = async () => {
      // delete
      for (const book of state_bookArr) {
        const { id, mark } = book;

        if (mark === 'delete') {
          try {
            await reqDelete(id);
          } catch (error) {
            alert('error_delete');
          }
        }
      }

      // post
      for (const book of state_bookArr_new) {
        const { type, alphabeticLetter: alphabeticletter, startNumber } = book;

        const body: TcreateAccountantInvoiceBookDto = {
          year,
          month,
          bookQuantity: 1,
          type: type as TinvoiceType,
          alphabeticLetter: alphabeticletter,
          startNumber,
        };

        try {
          await reqPost(body);
        } catch (error) {
          alert('error_post');
        }
      }

      // patch
      for (const book of state_bookArr) {
        const { id, type, alphabeticLetter: alphabeticletter, startNumber, isChanged, mark } = book;

        if (!isChanged || mark === 'delete') {
          continue;
        }

        const body: TupdateAccountantInvoiceBookDto = {
          id,
          year,
          month,
          type: type as TinvoiceType,
          alphabeticLetter: alphabeticletter,
          startNumber,
        };

        try {
          await reqPatch(id, body);
        } catch (error) {
          alert('error_patch');
        }
      }

      await update_invoiceBook();
      setDisabled(true);
    }; // callReq

    const isStartNumberInvalid =
      state_bookArr_new.some((item) => !checkStartNumber(item.startNumber)) ||
      state_bookArr.some((item) => !checkStartNumber(item.startNumber));

    if (isStartNumberInvalid) {
      myAlert.info({ title: '起始號碼格式不符' });

      return;
    }

    const hasDelete = state_bookArr.some((item) => item.mark === 'delete');

    if (hasDelete) {
      myAlert.confirm({
        title: '確定刪除發票簿?',
        props: {
          onOk: callReq,
        },
      });
    } else {
      callReq();
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
        defaultValue: keyword,
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

  const penalList_disabled: TpanelList = [
    { searchGroup },
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => setDisabled(false),
    },
  ];

  const panelList_abled: TpanelList = [
    {
      type: 'redButton',
      label: '確認',
      onClick: handle_confirm,
    },
    {
      type: 'myButton',
      label: '新增',
      onClick: addNewBook,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => setDisabled(true),
    },
  ];

  const panelList = disabled ? penalList_disabled : panelList_abled;

  // --------------------------------------------------------------------------

  // MARK: useEffect

  useEffect(() => {
    const list: TstateList = data_invoiceBook.reduce((acc, item) => {
      const { id, type, alphabeticLetter: alphabeticletter, startNumber, endNumber, latestInvoiceNumber } = item;

      acc[id] = {
        id,
        isChanged: false,
        type,
        alphabeticLetter: alphabeticletter,
        startNumber,
        endNumber,
        latestInvoiceNumber,
      };

      return acc;
    }, {} as TstateList);

    setState_bookList(list);
    setState_bookList_new({});
  }, [data_invoiceBook, disabled]);

  useEffect(() => {
    setDisabled(true);
  }, [year, month, keyword]);

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
        <Row thead={true} fullWidth={true} className={scss.row}>
          <Cell style={config.btnCell.style}></Cell>

          {keyArr.map((key) => {
            const { label, style } = config[key];

            return (
              <Cell key={key} style={style}>
                {label}
              </Cell>
            );
          })}
        </Row>

        {state_bookArr_new.map((state) => {
          const { id } = state;

          return (
            <Row key={id} fullWidth={true} className={classNames(scss.row, scss.new)}>
              <Cell style={config.btnCell.style} className={classNames(disabled && 'invisible')}>
                <IconDelete01 onClick={() => handle_delete(id)} />
              </Cell>
              {keyArr.map((key) => {
                const { label, style, createInputProps } = config[key];

                const props = createInputProps?.({
                  disabled: false,
                  state,
                  handle_edit: handle_edit_new,
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

        {state_bookArr.map((state) => {
          const { id, mark } = state;

          return (
            <Row key={id} fullWidth={true} className={classNames(scss.row, mark === 'delete' && scss.delete)}>
              <Cell style={config.btnCell.style} className={classNames(disabled && 'invisible')}>
                <IconDelete01 onClick={() => handle_delete(id)} />
              </Cell>
              {keyArr.map((key) => {
                const { label, style, createInputProps } = config[key];

                const props = createInputProps?.({
                  disabled: false,
                  state,
                  handle_edit,
                });

                return (
                  <Cell key={key} style={style}>
                    <InputSel disabled={disabled} showBaseline="auto" {...props} />
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

const checkStartNumber = (value: string) => {
  // 所有的字都是阿拉伯數字
  return value.length === 8 && /^\d+$/.test(value);
};

// region CONFIG

const keyArr: Tkey[] = ['type', 'alphabeticLetter', 'startNumber', 'endNumber', 'latestInvoiceNumber'];

const config: Tconfig = {
  btnCell: {
    label: '',
    style: { width: 30 },
  },
  type: {
    label: '發票種類',
    style: { width: 120 },
    createInputProps: ({ state, handle_edit }) => {
      return {
        selectProps: {
          props: {
            className: 'text-center',
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
  alphabeticLetter: {
    label: '字軌',
    style: { width: 120 },
    createInputProps: ({ state, handle_edit }) => {
      return {
        inputProps: {
          props: {
            className: 'text-center',
            value: state.alphabeticLetter,
            onChange: (e) => {
              handle_edit({ id: state.id, key: 'alphabeticLetter', value: e.target.value });
            },
          },
        },
      };
    },
  },
  startNumber: {
    // label: '起始號碼',
    label: (
      <div>
        <Popover
          className="flex items-center gap-1"
          content={
            <>
              <span>格式為數字8碼</span>
            </>
          }
          trigger="hover"
        >
          <span>起始號碼</span>
          <InfoCircleOutlined />
        </Popover>
      </div>
    ),
    style: { width: 120 },
    createInputProps: ({ state, handle_edit }) => {
      const value = state.startNumber;

      const isValueValid = checkStartNumber(value);

      return {
        inputProps: {
          props: {
            className: classNames('text-center', !isValueValid && 'text-red-500'),
            placeholder: '數字八碼',
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
        showBaseline: 'invisible',
        inputProps: {
          props: {
            className: 'text-center',
            placeholder: '',
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
        showBaseline: 'invisible',
        inputProps: {
          props: {
            className: 'text-center',
            placeholder: '',
            value: state.latestInvoiceNumber ?? '',
            onChange: () => {},
          },
        },
      };
    },
  },
};

// ===========================================================================

const createEmptyState = (id?: string): Tstate => ({
  id: id ?? '',
  isChanged: true,
  type: '',
  alphabeticLetter: '',
  startNumber: '',
  endNumber: '',
  latestInvoiceNumber: null,
  mark: 'new',
});
