import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gaer
import SelectBar from 'components/global/gear/select/selectBar/selectBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel, {
  TinputProps,
  TselectProps,
  TdatePickerProps,
  TcheckBoxProps_v2,
  TinputSelProps,
} from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// type
import type { Toption } from 'js/utils/options/options';
import type { TaccountantDto } from 'js/api/dtoTypes';
import type { AxiosError } from 'axios';

// icon
import {
  IconAddCircle,
  IconRemoveCircle,
  IconCheck02,
  IconEdit,
  IconDelete01,
} from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './index.module.scss';

// api
import {
  Tparams,
  TcreateAccountantDto,
  TupdateAccountantDto,
  TupdateAccountReceivableDeductionDto,
  //
  apiPostAccountant,
  apiPatchAccountant,
  deleteAccountant,
  apiPatchAccountant_accountReceivable,
  //
  useGetAccountant,
  useGetAccountantPreset,
} from 'js/api/api_accountant';

import { apiPostAccountReceivableAccountant } from 'js/api/api_engineering';

import { TperiodType } from 'js/api/dtoTypes';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';

// =============================================================================

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

// type paymentType = '匯款' | '票據' | '現金';
type TpaymentType = TaccountantDto['paymentType'];

type Tquery = {
  paymentType: TpaymentType | undefined;
  year: string | undefined;
  month: string | undefined;
};

type Tstate_accountant = {
  insertDate: Moment | null;
  importAccountingNumber: string;
  noteNumber: string;
  accountingNumber: string;
  vendorName: string;
  price: string;
  billSerialNumber: string;
  notes: string;

  isImported: boolean;
  accountsReceivableDeduction: TupdateAccountReceivableDeductionDto[];

  noteMaturityDate: Moment | null;
};

type TreqPost = (state_accountant: Tstate_accountant) => Promise<void>;
type TreqPatch = (id: string, state_accountant: Tstate_accountant) => Promise<void>;
// type TreqPatchIsImported = (id: string, state_accountant: Tstate_accountant) => Promise<void>;
type TreqPatchIsImported = (
  id: string,
  isImported: boolean,
  accountsReceivableDeduction: TupdateAccountReceivableDeductionDto[]
) => Promise<void>;
type TreqDelete = (id: string) => Promise<void>;

// =============================================================================

const defaultPaymentType: TpaymentType = '匯款';

const ContractSelector = selectModalCreator_multi<['contract']>({
  selectorArr: [
    {
      key: 'contract',
      limit: 1,
      caption: '付款匯入合約',
    },
  ],
});

// =============================================================================

// region START
export default function Collection({ isWorksDepartment = false }: { isWorksDepartment?: boolean }) {
  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth();

  // ------------------------------------------------------------------------------

  const router = useRouter();
  const query = router.query as Tquery;
  const { paymentType = defaultPaymentType, year = String(thisYear), month = String(thisMonth) } = query;

  // ------------------------------------------------------------------------------

  const [disabled = isWorksDepartment, setDisabled] = useState(true);
  const [showNewRow, setShowNewRow] = useState(false);
  const [accountantId, setAccountantId] = useState<string>();

  // ----------------------------------------------------------------------------

  // region get Data

  const {
    data: data_accountant,
    update: update_accountant,
    isFetching,
  } = useGetAccountant({
    params: useMemo(() => {
      const m_date = moment({
        year: Number(year),
        month: Number(month) - 1,
      });

      const params: Tparams = {
        populate: ['accountsReceivableDeduction'],
        sort: 'insertDate',
        filter: {
          insertDate: {
            $gte: m_date.startOf('month').toISOString(),
            $lte: m_date.endOf('month').toISOString(),
          },
          paymentType: {
            $eq: paymentType,
          },
        },
      };

      return params;
    }, [year, month, paymentType]),
  });

  const { data: data_accountantPreset } = useGetAccountantPreset();

  // ----------------------------------------------------------------------------
  // region REQUEST

  const reqPost = async (state_accountant: Tstate_accountant) => {
    if (isWorksDepartment) {
      alert('ReadOnly');

      return;
    }

    if (!state_accountant.insertDate) {
      myAlert.info({ title: '請選擇日期' });

      return;
    }

    const body: TcreateAccountantDto = {
      ...state_accountant,
      insertDate: state_accountant.insertDate.toISOString(true),
      paymentType,
      price: Number(state_accountant.price),
      fee: 0,
      noteMaturityDate: state_accountant.noteMaturityDate?.toISOString(true),
    };

    await apiPostAccountant({ body });
    setShowNewRow(false);
    await update_accountant();
  };

  const reqPatch = async (id: string, state_accountant: Tstate_accountant) => {
    if (isWorksDepartment) {
      alert('isWorksDepartment should be true');

      return;
    }

    if (!state_accountant.insertDate) {
      myAlert.info({ title: '請選擇日期' });

      return;
    }

    const body: TupdateAccountantDto = {
      // ...state_accountant,
      accountingNumber: state_accountant.accountingNumber,
      vendorName: state_accountant.vendorName,
      notes: state_accountant.notes,
      importAccountingNumber: state_accountant.importAccountingNumber,
      noteNumber: state_accountant.noteNumber,

      insertDate: state_accountant.insertDate.toISOString(),
      paymentType,
      price: Number(state_accountant.price),
      // fee: 0,
      noteMaturityDate: state_accountant.noteMaturityDate?.toISOString(true),
    };

    await apiPatchAccountant(id, { body });

    await update_accountant();
  };

  const reqPatchIsImported = async (
    //
    id: string,
    isImported: boolean,
    accountsReceivableDeduction: TupdateAccountReceivableDeductionDto[]
  ) => {
    if (!isWorksDepartment) {
      alert('isWorksDepartment should be false');

      return;
    }

    await apiPatchAccountant_accountReceivable(id, {
      accountsReceivableDeduction,
      isImported,
    });
    await update_accountant();
  }; // reqPatchIsImported

  const reqDelete = async (id: string) => {
    await deleteAccountant(id);
    await update_accountant();
  };

  // 匯入發票
  const reqPostAccountReceivableAccountant = async (accountReceivableId: string, type: TperiodType) => {
    if (!accountantId) {
      alert('accountantId為undefined');

      return;
    }

    try {
      await apiPostAccountReceivableAccountant(accountReceivableId, {
        accountantId: [accountantId],
        type,
      });
      await update_accountant();
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({ title: '匯入失敗', content: err.message });
    }
  };

  const handle_import = (accountReceivableId: string) => {
    const modal = myAlert.btnBar({});
    modal.update({
      title: '請選擇匯入發票類型',
      content: (
        <AddInovice
          onCancel={modal.destroy}
          accountReceivableId={accountReceivableId}
          reqPostAccountReceivableAccountant={reqPostAccountReceivableAccountant}
        />
      ),
    });
  };

  // ----------------------------------------------------------------------------

  // region PROPS

  let d_totalPrice = new Decimal(0);
  data_accountant?.forEach((data) => {
    d_totalPrice = d_totalPrice.add(data.price);
  });
  const totalPrice_localString = d_totalPrice.toNumber().toLocaleString();

  const tagList = useTagList();

  const selectPropsArr = useSelectPropsArr({
    year,
    month,
    yearOptionArr,
    monthOptionArr,
  });

  const bankAccountOptionArr = useMemo(() => {
    const bankAccountOptionArr = (data_accountantPreset ?? []).map((data) => {
      return {
        label: data.accountName,
        value: data.accountName,
      };
    });

    return bankAccountOptionArr;
  }, [data_accountantPreset]);

  // ----------------------------------------------------------------------------
  // region RENDER
  return (
    <SubLayer>
      <PageHeader02
        tagList={tagList}
        customeLeft={[<SelectBar key="selectBar" className={'ml-5'} selectPropsArr={selectPropsArr} />]}
      />
      <div className={scss.body}>
        {/*  */}

        <div className={scss.tabBar}>
          <div className={scss.tab}>{paymentType}</div>
          {!showNewRow && !isWorksDepartment && (
            <IconAddCircle className={scss.newBtn} onClick={() => setShowNewRow(true)} />
          )}
          {showNewRow && !isWorksDepartment && (
            <IconRemoveCircle className={scss.newBtn} onClick={() => setShowNewRow(false)} />
          )}
        </div>

        <div className={scss.table}>
          <Thead paymentType={paymentType} />

          {showNewRow && (
            <Row
              //
              postProps={{
                year: Number(year),
                month: Number(month),
                reqPost,
              }}
              className={scss.newRow}
              data_accountant={undefined}
              paymentType={paymentType}
              //
              isReadOnly={isWorksDepartment}
              bankAccountOptionArr={bankAccountOptionArr}
              isWorksDepartment={isWorksDepartment}
            />
          )}

          {data_accountant?.map((data) => {
            return (
              <Row
                key={data.id}
                data_accountant={data}
                paymentType={paymentType}
                reqPatch={reqPatch}
                reqDelete={reqDelete}
                reqPatchIsImported={reqPatchIsImported}
                isReadOnly={isWorksDepartment}
                setAccountantId={setAccountantId}
                bankAccountOptionArr={bankAccountOptionArr}
                isWorksDepartment={isWorksDepartment}
              />
            );
          })}

          <div className={scss.totalPriceWrapper}>
            <span className={scss.totalPrice}>{totalPrice_localString}</span>
          </div>
        </div>
        <div className={scss.cover_bottom}></div>

        <ContractSelector
          showModal={!!accountantId}
          onConfirm={(arr) => {
            const contractArr = arr[0];
            const accountReceivableId: string | undefined | null = contractArr[0]?.accountReceivableId;

            if (accountReceivableId === null) {
              myAlert.info({ title: '該合約尚未建立應收帳款' });
            }

            if (accountReceivableId) {
              handle_import(accountReceivableId);
            }
          }}
          onCancel={() => {
            setAccountantId(undefined);
          }}
        />

        {/*  */}
      </div>
    </SubLayer>
  );
}
// region END

// =============================================================================
// =============================================================================
// =============================================================================

// region HOOK

const useTagList = () => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { paymentType = defaultPaymentType } = query;

  const switchCategory = (category: TpaymentType) => {
    router.replace({
      query: {
        ...query,
        paymentType: category,
      },
    });
  };

  const tagList: TtagList = [
    {
      label: '匯款',
      isActive: paymentType === '匯款',
      onClick: () => switchCategory('匯款'),
    },
    {
      label: '票據',
      isActive: paymentType === '票據',
      onClick: () => switchCategory('票據'),
    },
    {
      label: '現金',
      isActive: paymentType === '現金',
      onClick: () => switchCategory('現金'),
    },
  ];

  return tagList;
};

// -------------------------------------------------------------------------------
const useYearMonth = () => {
  const m_today = moment();
  const thisYear = m_today.year();
  const thisMonth = m_today.month() + 1;

  const yearOptionArr = useMemo(() => {
    const yearOptionArr = Array.from({ length: 20 }, (_, i) => {
      const year = thisYear - i;
      const year_tw = year - 1911;

      return { label: year_tw.toString(), value: year.toString() };
    });

    return yearOptionArr;
  }, [thisYear]);

  const monthOptionArr = useMemo(() => {
    const monthOptionArr = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;

      return { label: month.toString(), value: month.toString() };
    });

    return monthOptionArr;
  }, []);

  return {
    yearOptionArr,
    monthOptionArr,
    thisYear,
    thisMonth,
  };
};

const useSelectPropsArr = ({
  year,
  month,
  yearOptionArr,
  monthOptionArr,
}: {
  year: string;
  month: string;
  yearOptionArr: Toption[];
  monthOptionArr: Toption[];
}) => {
  const router = useRouter();
  const query = router.query as Tquery;

  const selectPropsArr: TselectPropsArr = useMemo(() => {
    return [
      {
        selectProps: {
          value: year,
          options: yearOptionArr,
          onChange: (option) => {
            if (typeof option?.value === 'string') {
              router.replace({
                query: {
                  ...query,
                  year: option.value,
                },
              });
            }
          },
        },
        placeholder: '選擇年份',
        boxStyle: { width: '140px' },
      },
      {
        selectProps: {
          value: month,
          options: monthOptionArr,
          onChange: (option) => {
            if (typeof option?.value === 'string') {
              router.replace({
                query: {
                  ...query,
                  month: option.value,
                },
              });
            }
          },
        },
        placeholder: '選擇月份',
        boxStyle: { width: '140px' },
      },
    ];
  }, [year, yearOptionArr, month, monthOptionArr, router, query]);

  return selectPropsArr;
};

// ---------------------------------------------------------------------------

// region component

const Cell_span = ({
  //
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) => {
  return (
    <div className={classNames(scss.cell, scss.cell_span, className)} style={style}>
      {children}
    </div>
  );
};

const Thead = ({ paymentType }: { paymentType: TpaymentType }) => {
  const keyArr = lookup_keyArr[paymentType];

  return (
    <div className={classNames(scss.row, scss.thead)}>
      {keyArr.map((key) => {
        const config = configList[key];

        const label = config?.label ?? config?.labelByPaymentType?.[paymentType] ?? key;

        return (
          <Cell_span key={key} {...config}>
            {label}
          </Cell_span>
        );
      })}
    </div>
  );
};

// region Row

const Row = ({
  // children,
  paymentType,
  data_accountant,
  className,
  postProps,
  reqPatch,
  reqDelete,
  isReadOnly,
  setAccountantId,
  bankAccountOptionArr,
  reqPatchIsImported,
  isWorksDepartment,
}: {
  // children: React.ReactNode;
  paymentType: TpaymentType;
  data_accountant: TaccountantDto | undefined;
  className?: string;
  postProps?: {
    year: number;
    month: number;
    reqPost: TreqPost;
  };
  reqPatch?: TreqPatch;
  reqDelete?: TreqDelete;
  isReadOnly: boolean;
  setAccountantId?: (id: string | undefined) => void;
  bankAccountOptionArr: Toption[];
  reqPatchIsImported?: TreqPatchIsImported;
  isWorksDepartment: boolean;
}) => {
  const isNew = !!postProps;

  const [disabled = !!data_accountant?.billSerialNumber, setDisabled] = useState(!isNew);
  const [state_accountant, setState_accountant] = useState<Tstate_accountant>(cre_emptyStateAccountant());

  let keyArr = lookup_keyArr[paymentType];
  keyArr = [...keyArr];

  // keyArr = keyArr.slice(baseArr_before.length);
  keyArr = keyArr.slice(1);

  const theKeyArr = keyArr as Exclude<TaccountantKey, 'btn' | 'accountsReceivableDeduction'>[];

  const limitedDate =
    state_accountant.insertDate ??
    (postProps &&
      moment({
        year: postProps.year,
        month: postProps.month - 1,
      }));

  // ---------------------------------------------------

  const handle_check = async () => {
    if (postProps) {
      postProps.reqPost(state_accountant);
    } else if (data_accountant?.id && reqPatch) {
      await reqPatch(data_accountant.id, state_accountant);
      setDisabled(true);
    } else {
      alert('錯誤，data_accountant.id或reqPatch為undefined');
    }
  };

  const handle_delete = async () => {
    if (data_accountant?.id && reqDelete) {
      myAlert.confirm({
        title: '確定刪除',
        props: {
          onOk: async () => {
            await reqDelete(data_accountant.id);
            setDisabled(true);
          },
        },
      });
    } else {
      alert('錯誤，data_accountant.id或reqDelete為undefined');
    }
  };

  const handle_checkIsImported = async (isImported: boolean) => {
    if (data_accountant?.id && reqPatchIsImported) {
      await reqPatchIsImported(data_accountant.id, isImported, state_accountant.accountsReceivableDeduction);
      // if (data_accountant?.id && reqPatchIsImported) {
      //   await reqPatchIsImported(data_accountant.id, state_accountant);
      //   setDisabled(true);
      // } else {
      //   alert('錯誤，data_accountant.id或reqPatchIsImported為undefined');
      // }
    }
  };

  // ---------------------------------------------------

  useEffect(() => {
    if (!data_accountant) {
      setState_accountant({
        ...cre_emptyStateAccountant(),
      });

      return;
    }

    setState_accountant({
      insertDate: data_accountant.insertDate ? moment(data_accountant.insertDate) : null,
      importAccountingNumber: data_accountant.importAccountingNumber ?? '',
      noteNumber: data_accountant.noteNumber ?? '',
      accountingNumber: data_accountant.accountingNumber ?? ' ',
      vendorName: data_accountant.vendorName ?? '',
      price: String(data_accountant.price),
      billSerialNumber: data_accountant.billSerialNumber ?? '',
      notes: data_accountant.notes ?? '',
      isImported: data_accountant.isImported,
      accountsReceivableDeduction: data_accountant.accountsReceivableDeduction,
      noteMaturityDate: data_accountant.noteMaturityDate ? moment(data_accountant.noteMaturityDate) : null,
    });
  }, [disabled, data_accountant?.id, data_accountant?.updatedAt]);

  // ---------------------------------------------------------------------------
  let isAllowToEditIsImported = false;

  if (!isNew && isWorksDepartment && !state_accountant.billSerialNumber) {
    isAllowToEditIsImported = true;
  }

  // ---------------------------------------------------------------------------

  // region ROW RENDER

  return (
    <div className={classNames(scss.row, className)}>
      <div
        className={classNames(
          //
          scss.cell,
          scss.cell_btn,
          configList?.btn?.className
        )}
        style={configList?.btn?.style}
      >
        {!isReadOnly && !state_accountant.billSerialNumber && (
          <>
            <IconCheck02 className={classNames(disabled && 'invisible')} onClick={handle_check} />
            <IconEdit
              //
              className={classNames(!disabled && scss.active, scss.foo, isNew && 'invisible')}
              onClick={() => setDisabled((state) => !state)}
            />
            <IconDelete01 className={classNames(!disabled && 'invisible')} onClick={handle_delete} />
          </>
        )}
        {isReadOnly && !state_accountant.billSerialNumber && !state_accountant.isImported && (
          <MyButton_v2 px="px22" py="py4" onClick={() => setAccountantId?.(data_accountant?.id)}>
            匯入發票
          </MyButton_v2>
        )}
      </div>

      {theKeyArr.map((key) => {
        const isbillSerialNumber = key === 'billSerialNumber';

        const config = configList[key];

        const value = state_accountant[key];

        const props = config?.inputSelPropsCreator({
          disabled,
          bankAccountOptionArr,
          limitedDate,
          value,
          setState_accountant,
          handle_checkIsImported,
        });

        let theDiasbled = isbillSerialNumber || disabled;

        if (key === 'isImported') {
          theDiasbled = !isAllowToEditIsImported;
        }

        return (
          <div key={key} className={classNames(scss.cell, config?.className)} style={config?.style}>
            <InputSel
              //
              disabled={theDiasbled}
              showBaseline="auto"
              fontSize="14"
              {...config?.inputSelProps}
              {...props}
            />
          </div>
        );
      })}

      {/*  */}
    </div>
  );
};

const AddInovice = ({
  reqPostAccountReceivableAccountant,
  accountReceivableId,
  onCancel,
}: {
  onCancel: () => void;
  accountReceivableId: string;
  reqPostAccountReceivableAccountant: (accountReceivableId: string, type: TperiodType) => Promise<void>;
}) => {
  const handle_訂金 = async () => {
    await reqPostAccountReceivableAccountant(accountReceivableId, '訂金');
    onCancel();
  };

  const handle_請款 = async () => {
    await reqPostAccountReceivableAccountant(accountReceivableId, '請款');
    onCancel();
  };

  return (
    <div>
      <br />
      <div className="flex gap-5 mt-10">
        <MyButton_v2 px="px22" py="py6" onClick={handle_請款}>
          新增請款
        </MyButton_v2>

        <MyButton_v2 px="px22" py="py6" onClick={handle_訂金}>
          新增訂金
        </MyButton_v2>

        <MyButton_v2 theme="danger" px="px22" py="py6" buttonProps={{ htmlType: 'submit' }} onClick={onCancel}>
          取消
        </MyButton_v2>
      </div>
    </div>
  );
};

// =========================================================================

// region config

type TaccountantKey = keyof Tstate_accountant | 'btn' | 'isImported';

type Tconfig = {
  label?: string;
  style: React.CSSProperties;
  className?: string;
  labelByPaymentType?: {
    [key in TpaymentType]?: string;
  };
  inputSelProps?: TinputSelProps;
  // selectProps?:
  inputSelPropsCreator: (props: {
    //
    disabled?: boolean;
    bankAccountOptionArr?: Toption[];
    limitedDate?: Moment;
    value: string | Moment | null | boolean;
    setState_accountant: React.Dispatch<React.SetStateAction<Tstate_accountant>>;
    handle_checkIsImported: (isImported: boolean) => void;
  }) => {
    inputProps?: TinputProps;
    selectProps?: TselectProps;
    datePickerProps?: TdatePickerProps;
    checkBoxProps_v2?: TcheckBoxProps_v2;
  };
};

type TconfigList = {
  [key in TaccountantKey]?: Tconfig;
};

const baseArr_before: TaccountantKey[] = ['btn', 'isImported', 'insertDate'];
const baseArr_after: TaccountantKey[] = ['accountingNumber', 'vendorName', 'price', 'billSerialNumber', 'notes'];

const lookup_keyArr: {
  [key in TpaymentType]: TaccountantKey[];
} = {
  匯款: [...baseArr_before, 'importAccountingNumber', ...baseArr_after],
  // 票據: [...baseArr_before, 'noteNumber', 'noteMaturityDate', ...baseArr_after],
  票據: [
    ...baseArr_before,
    'noteNumber',
    'accountingNumber',
    'vendorName',
    'noteMaturityDate',
    'price',
    'billSerialNumber',
    'notes',
  ],
  現金: [...baseArr_before, ...baseArr_after],
};

const configList: TconfigList = {
  btn: {
    label: '',
    style: {
      width: 120,
    },
    className: '',
    inputSelPropsCreator: () => {
      return {};
    },
  },
  isImported: {
    label: '已匯入紙本應收帳款',
    style: {
      width: 100,
      justifyContent: 'center',
    },
    inputSelProps: {
      wrapperStyle: { width: 16 },
      showBaseline: 'invisible',
      // disabled: false,
    },
    className: '',
    inputSelPropsCreator: ({
      disabled,
      bankAccountOptionArr,
      handle_checkIsImported,
      limitedDate,
      value,
      setState_accountant,
    }) => {
      const value_bool = !!value as boolean;

      const checkBoxProps_v2: TcheckBoxProps_v2 = {
        props: {
          value: value_bool ? ['true'] : [],
          onChange: (arr) => {
            const isImported = arr[0];

            if (isImported === 'true') {
              handle_checkIsImported?.(true);
              // setState_accountant((state) => ({ ...state, isImported: true }));
            } else {
              handle_checkIsImported?.(false);
              // setState_accountant((state) => ({ ...state, isImported: false }));
            }
          },
        },
        checkBoxPropsArr: [
          {
            value: 'true',
          },
        ],
      };

      return { checkBoxProps_v2 };
    },
  },
  insertDate: {
    style: {
      width: 110,
      // justifyContent: 'center',
    },
    className: '',
    labelByPaymentType: {
      匯款: '匯入日期',
      票據: '收票日期',
      現金: '收現日期',
    },
    inputSelPropsCreator: ({ disabled, bankAccountOptionArr, limitedDate, value, setState_accountant }) => {
      const value_moment = value as Moment | null;

      const datePickerProps: TdatePickerProps = {
        props: {
          value: value_moment,
          onChange: (date) => {
            setState_accountant((state) => ({ ...state, insertDate: date }));
          },
          disabledDate: (date) => {
            return !date.isSame(limitedDate, 'month');
          },
        },
      };

      return { datePickerProps };
    },
  },
  noteMaturityDate: {
    label: '票據到期日',
    style: {
      width: 110,
      // justifyContent: 'center',
    },
    className: '',
    inputSelPropsCreator: ({ disabled, bankAccountOptionArr, limitedDate, value, setState_accountant }) => {
      const value_moment = value as Moment | null;

      const datePickerProps: TdatePickerProps = {
        props: {
          value: value_moment,
          onChange: (date) => {
            setState_accountant((state) => ({ ...state, noteMaturityDate: date }));
          },
        },
      };

      return { datePickerProps };
    },
  },
  accountingNumber: {
    label: '付款帳號',
    style: {
      width: 200,
    },
    className: '',
    inputSelPropsCreator: ({ disabled, bankAccountOptionArr, value, setState_accountant }) => {
      const value_str = (value as string) || '';

      // const selectProps: TselectProps = {
      //   props: {
      //     isSearchable: true,
      //     options: bankAccountOptionArr,
      //     value: value_str ? { label: value_str, value: value_str } : null,
      //     onChange: (option) => {
      //       setState_accountant((state) => ({ ...state, ['accountingNumber']: option?.value ?? '' }));
      //     },
      //   },
      // };

      const inputProps: TinputProps = {
        props: {
          placeholder: '請選擇',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => ({ ...state, ['accountingNumber']: e.target.value }));
          },
        },
      };

      return {
        //  selectProps
        inputProps,
      };
    },
  },
  //
  noteNumber: {
    label: '票據號碼',
    style: {
      width: 120,
    },
    className: '',
    inputSelPropsCreator: ({ disabled, value, setState_accountant }) => {
      const value_str = (value as string) || '';
      const inputProps: TinputProps = {
        props: {
          placeholder: '請輸入',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => ({ ...state, ['noteNumber']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  importAccountingNumber: {
    label: '匯入帳號',
    style: {
      width: 120,
    },
    className: '',
    inputSelPropsCreator: ({ disabled, value, setState_accountant }) => {
      const value_str = (value as string) || '';

      const inputProps: TinputProps = {
        props: {
          placeholder: '請輸入',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => ({ ...state, ['importAccountingNumber']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  //
  vendorName: {
    label: '廠商名稱',
    style: {
      width: 200,
    },
    className: '',
    inputSelPropsCreator: ({ disabled, value, setState_accountant }) => {
      const value_str = (value as string) || '';

      const inputProps: TinputProps = {
        props: {
          placeholder: '請輸入',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => ({ ...state, ['vendorName']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  price: {
    label: '金額',
    style: {
      width: 90,
      justifyContent: 'flex-end',
    },
    className: '',
    inputSelPropsCreator: ({ disabled, value, setState_accountant }) => {
      const inputType = disabled ? 'text' : 'number';

      const value_str = (value as string) || '';
      const theValue = disabled ? Number(value_str).toLocaleString() : value_str;

      const inputProps: TinputProps = {
        props: {
          style: { textAlign: 'end' },
          placeholder: '請輸入',
          type: inputType,
          value: theValue,
          onChange: (e) => {
            !disabled && setState_accountant((state) => ({ ...state, ['price']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  billSerialNumber: {
    label: '收入傳票序號',
    style: {
      width: 120,
    },
    className: '',
    inputSelPropsCreator: ({ disabled, value, setState_accountant }) => {
      const value_str = (value as string) || '';
      const inputProps: TinputProps = {
        props: {
          readOnly: true,
          placeholder: '系統自動產生',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            // setState_accountant((state) => ({ ...state, ['billSerialNumber']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  notes: {
    label: '備註',
    style: { flex: 'auto' },
    className: '',
    inputSelPropsCreator: ({ disabled, value, setState_accountant }) => {
      const value_str = (value as string) || '';
      const inputProps: TinputProps = {
        props: {
          placeholder: '請輸入',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => ({ ...state, ['notes']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
};

// =========================================================================

const cre_emptyStateAccountant = (): Tstate_accountant => ({
  insertDate: null,
  importAccountingNumber: '',
  noteNumber: '',
  accountingNumber: '',
  vendorName: '',
  price: '',
  billSerialNumber: '',
  notes: '',
  isImported: false,
  accountsReceivableDeduction: [],
  noteMaturityDate: null,
});
