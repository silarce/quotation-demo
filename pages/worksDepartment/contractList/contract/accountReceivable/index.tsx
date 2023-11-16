import { useState, useEffect } from 'react';
import classNames from 'classnames';
import moment from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import Profile, {
  Tcontrol_profile,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/profile';
import Table_requestPayment, {
  Tcontrol_table_requestPayment,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/table_requestPayment';
import AccountReceivable_dynaTable, {
  Tcontrol_dynaTable,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/accountReceivable_dynaTable';
import DeductionDetails, {
  Tcontrol_deductionDetails,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/deductionDetails';

// gear
import InputSel, { TinputSelProps, TcheckboxProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';
import PaymentRecordSelector from 'components/global/gear/modal/paymentRecordSelector';

// css
import scss from './index.module.scss';
// ========================================================================

type TrequestPayment = {
  caption: string;
  paymentRatio: string;
  loanPeriod: string;
  remark: string;
};

type Tinvoice = {
  date: string;
  invoiceNumberPrefix: string;
  invoiceNumber: string;
  price: string;
  remark: string;
};

// ========================================================================

export default function AccountReceivable() {
  const [disabled, setDisabled] = useState(true);

  // --------------------------------------------------------------------------

  const [requestPaymentArr, setRequestPaymentArr] = useState<TrequestPayment[]>([]);

  useEffect(() => {
    if (disabled) {
      setRequestPaymentArr(fakeRequestPayment);
    }
  }, [disabled]);

  // --------------------------------------------------------------------------

  const [invoiceArr, setInvoiceArr] = useState<Tinvoice[]>([]);
  useEffect(() => {
    if (disabled) {
      setInvoiceArr(fakeInvoiceArr);
    }
  }, [disabled]);

  // --------------------------------------------------------------------------

  const [checkBar01, setCheckBar01] = useState<string[]>([]);
  const [checkBar02, setCheckBar02] = useState<string[]>([]);

  // --------------------------------------------------------------------------

  const [isShowInvoicePrefixModal, setIsShowInvoicePrefixModal] = useState<boolean>(false);
  const [invoicePrefix, setInvoicePrefix] = useState<string>('');

  // --------------------------------------------------------------------------
  const control_profile: Tcontrol_profile = {
    // left
    projectName: {
      value: 'fooo',
    },
    contractor: {
      value: 'fooo',
    },
    companyName: {
      value: 'fooo',
    },
    contactPerson: {
      value: 'fooo',
    },
    businessIdNumber: {
      value: 'fooo',
    },
    companyAddress: {
      value: 'fooo',
    },
    companyPhoneNumber: {
      value: 'fooo',
    },
    projectAddress: {
      value: 'fooo',
    },
    projectPhoneNumber: {
      value: 'fooo',
    },
    // right
    warrantyPeriod: {
      value: 'fooo',
    },
    projectNumber: {
      value: 'fooo',
    },
    valuationDate: {
      value: 'fooo',
    },
    paymentDate: {
      value: 'fooo',
    },
  };

  // --------------------------------------------------------------------------

  const control_checkBar01: TcheckboxProps = {
    onChange: (arr) => {
      setCheckBar01(arr);
    },
    propsArr: [
      {
        key: 'performanceCheque',
        label: '履約保證票',
        value: checkBar01.includes('performanceCheque'),
        props: {
          className: classNames(checkBar01.includes('performanceCheque') && scss.checkActive),
        },
      },
      {
        key: 'depositGuaranteeCheque',
        label: '訂金款保證票',
        value: checkBar01.includes('depositGuaranteeCheque'),
        props: {
          className: classNames(checkBar01.includes('depositGuaranteeCheque') && scss.checkActive),
        },
      },
      {
        key: 'warrantyCheque',
        label: '保固票',
        value: checkBar01.includes('warrantyCheque'),
        props: {
          className: classNames(checkBar01.includes('warrantyCheque') && scss.checkActive),
        },
      },
    ],
  };

  // --------------------------------------------------------------------------

  const control_table_requestPayment: Tcontrol_table_requestPayment = {
    columnArr: requestPaymentArr.map((item, index) => {
      return {
        caption: item.caption,
        // 請款比例
        paymentRatio: {
          value: item.paymentRatio,
          onChange: (str) => {
            setRequestPaymentArr((arr) => {
              const newArr = [...requestPaymentArr];
              arr[index].paymentRatio = str;

              return newArr;
            });
          },
        },
        // 放款票期
        loanPeriod: {
          value: item.loanPeriod,
          onChange: (str) => {
            const arr = [...requestPaymentArr];
            arr[index].loanPeriod = str;
            setRequestPaymentArr(arr);
          },
        },
        // 備註
        remark: {
          value: item.remark,
          onChange: (str) => {
            const arr = [...requestPaymentArr];
            arr[index].remark = str;
            setRequestPaymentArr(arr);
          },
        },
      };
    }),
  };

  // --------------------------------------------------------------------------

  const control_checkBar02: TcheckboxProps = {
    onChange: (arr) => {
      setCheckBar02(arr);
    },
    propsArr: [
      {
        key: 'abnormal',
        label: '異常燈號：工作表已開立，合約尚未簽回',
        value: checkBar02.includes('abnormal'),
        props: {
          className: classNames(checkBar02.includes('abnormal') && scss.checkActive),
        },
      },
      {
        key: 'remind',
        label: '提醒燈號：已出具說明，尚未收足款項 ',
        value: checkBar02.includes('remind'),
        props: {
          className: classNames(checkBar02.includes('remind') && scss.checkActive),
        },
      },
      {
        key: 'notInstalled',
        label: '已出貨因故尚未安裝',
        value: checkBar02.includes('notInstalled'),
        props: {
          className: classNames(checkBar02.includes('notInstalled') && scss.checkActive),
        },
      },
    ],
  };

  // --------------------------------------------------------------------------

  const control_invoiceGivingRecord_rowArr: Tcontrol_dynaTable['rowArr'] = invoiceArr.map((item, index) => {
    return {
      panelCell_01: {
        onDeleteClick: () => {
          setInvoiceArr((arr) => {
            const newArr = [...arr];
            newArr.splice(index, 1);

            return newArr;
          });
        },
        onChainClick: () => {
          alert('test');
        },
      },
      list: {
        date: {
          label: '日期',
          cellStyle: { width: '120px' },
          datePickerProps: {
            props: {
              value: item.date ? moment(item.date) : null,
              onChange: (date) => {
                setInvoiceArr((arr) => {
                  const newArr = [...arr];
                  const theDate = date?.toISOString() ?? '';
                  newArr[index].date = theDate;

                  return newArr;
                });
              },
            },
          },
        },
        invoiceNumber: {
          label: '發票號碼',
          cellStyle: { width: '300px' },
          twoInputProps: {
            one: {
              props: {
                value: item.invoiceNumberPrefix,
                onChange: (e) => {
                  const arr = [...invoiceArr];
                  arr[index].invoiceNumberPrefix = e.target.value;
                  setInvoiceArr(arr);
                },
              },
            },
            two: {
              props: {
                value: item.invoiceNumber,
                onChange: (e) => {
                  const arr = [...invoiceArr];
                  arr[index].invoiceNumber = e.target.value;
                  setInvoiceArr(arr);
                },
              },
            },
          },
        },
        price: {
          label: '金額',
          cellStyle: { width: '290px' },
          inputProps: {
            props: {
              value: item.price,
              onChange: (e) => {
                const arr = [...invoiceArr];
                arr[index].price = e.target.value;
                setInvoiceArr(arr);
              },
            },
          },
        },
        remark: {
          label: '備註',
          cellStyle: { width: '300px' },
          inputProps: {
            props: {
              value: item.remark,
              onChange: (e) => {
                const arr = [...invoiceArr];
                arr[index].remark = e.target.value;
                setInvoiceArr(arr);
              },
            },
          },
        },
      }, // list close
    };
  });

  const control_invoiceGivingRecord: Tcontrol_dynaTable = {
    caption: '發票給予紀錄',
    topRightBtnProps: {
      label: `更改發票前綴:${invoicePrefix}`,
      onClick: () => {
        setIsShowInvoicePrefixModal(true);
      },
    },
    tableBottomBtnProps: {
      label: '新增發票',
      onClick: () => {
        setInvoiceArr((arr) => {
          const empty = creEmptyInvoice();
          empty.invoiceNumberPrefix = invoicePrefix;

          return [...arr, empty];
        });
      },
    },
    bottomBarProps: {
      label: '合計',
      value: '123,123',
    },
    headRow: {
      panelCell_01: {},
      list: {
        date: {
          label: '日期',
          cellStyle: { width: '100px' },
        },
        invoiceNumber: {
          label: '發票號碼',
          cellStyle: { width: '300px' },
        },
        price: {
          label: '金額',
          cellStyle: { width: '290px' },
        },
        remark: {
          label: '備註',
          cellStyle: { width: '300px' },
        },
      },
    },
    rowArr: control_invoiceGivingRecord_rowArr,

    // rowArr: [
    //   {
    //     panelCell_01: {
    //       onDeleteClick: () => {
    //         alert('test');
    //       },
    //       onChainClick: () => {
    //         alert('test');
    //       },
    //     },
    //     list: {
    //       date: {
    //         label: '日期',
    //         cellStyle: { width: '100px' },
    //         inputProps: {
    //           props: {
    //             value: '111-11-11',
    //           },
    //         },
    //       },
    //       invoiceNumber: {
    //         label: '發票號碼',
    //         cellStyle: { width: '300px' },
    //         twoInputProps: {
    //           one: {
    //             props: {
    //               value: '12345678',
    //             },
    //           },
    //           two: {
    //             props: {
    //               value: '999',
    //             },
    //           },
    //         },
    //       },
    //       price: {
    //         label: '金額',
    //         cellStyle: { width: '290px' },
    //         inputProps: {
    //           props: {
    //             value: 'aaa',
    //           },
    //         },
    //       },
    //       remark: {
    //         label: '備註',
    //         cellStyle: { width: '300px' },
    //         inputProps: {
    //           props: {
    //             value: 'aaa',
    //           },
    //         },
    //       },
    //     }, // list close
    //   },
    // ],
  };

  // --------------------------------------------------------------------------
  const control_paymentRecord: Tcontrol_dynaTable = {
    caption: '收款紀錄',
    topRightBtnProps: {
      label: '新增收款紀錄',
      onClick: () => {
        alert('test');
      },
    },
    bottomBarProps: {
      label: '合計',
      value: '123,123',
    },
    headRow: {
      panelCell_02: {},
      list: {
        date: {
          label: '日期',
          cellStyle: { width: '100px' },
        },
        account: {
          label: '帳號',
          cellStyle: { width: '189px' },
        },
        chequeNumber: {
          label: '票據號碼',
          cellStyle: { width: '189px' },
        },
        chequeDate: {
          label: '票據日期',
          cellStyle: { width: '100px' },
        },
        price: {
          label: '金額',
          cellStyle: { width: '170px' },
        },
        incomingSubpoenaSerialNumber: {
          label: '收入傳票序號',
          cellStyle: { width: '187px' },
        },
        //
      },
    },
    rowArr: [
      {
        panelCell_02: {
          onDeleteClick: () => {
            alert('test');
          },
        },
        list: {
          date: {
            label: '日期',
            cellStyle: { width: '120px' },
            // inputProps: {
            //   props: {
            //     value: '',
            //   },
            // },
            datePickerProps: {
              props: {
                value: undefined,
              },
            },
          },
          account: {
            label: '帳號',
            cellStyle: { width: '189px' },
            inputProps: {
              props: {
                value: 'XXXXXX',
              },
            },
          },
          chequeNumber: {
            label: '票據號碼',
            cellStyle: { width: '189px' },
            inputProps: {
              props: {
                value: 'XXXXXX',
              },
            },
          },
          chequeDate: {
            label: '票據日期',
            cellStyle: { width: '100px' },
            inputProps: {
              props: {
                value: '111-11-11',
              },
            },
          },
          price: {
            label: '金額',
            cellStyle: { width: '170px' },
            inputProps: {
              props: {
                value: '999,999',
              },
            },
          },
          incomingSubpoenaSerialNumber: {
            label: '收入傳票序號',
            cellStyle: { width: '187px' },
            inputProps: {
              props: {
                value: '1110304001',
              },
            },
          },
        }, // list close
      },
    ],
  };

  // --------------------------------------------------------------------------

  const control_deductionDetails: Tcontrol_deductionDetails = {
    sideColumn: {
      caption: '項目',
      subTotal: '合計',
      tax: '營業稅5%',
      total: '總計',
      arr: [
        {
          value: '第一期',
        },
        {
          value: '第二期',
        },
        {
          value: '第三期',
        },
        {
          value: '第四期',
        },
      ],
    },
    columnArr: [
      {
        caption: '工作證',
        subTotal: '999999',
        tax: '999999',
        total: '999999',
        arr: [
          {
            value: '999',
          },
          {
            value: '999',
          },
          {
            value: '999',
          },
          {
            value: '999',
          },
        ],
      },
      {
        caption: '安衛費',
        subTotal: '999999',
        tax: '999999',
        total: '999999',
        arr: [
          {
            value: '999',
          },
          {
            value: '999',
          },
          {
            value: '999',
          },
          {
            value: '999',
          },
        ],
      },
    ],
  };

  // --------------------------------------------------------------------------
  const panelList_01: TpanelList = [
    //
    { type: 'myButton', label: '編輯', onClick: () => setDisabled(false) },
  ];
  const panelList_02: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: () => {
        alert('test');
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

  const panelList = disabled ? panelList_01 : panelList_02;
  // --------------------------------------------------------------------------

  return (
    <SubLayer>
      <PageHeader
        //
        panelList={panelList}
        // contractNumber={engineeringContact?.contractNumber ?? ''}
        contractNumber={'foo'}
      />
      <div className={scss.main}>
        <Profile control={control_profile} />

        <div className={scss.checkBar01}>
          <InputSel showBaseline="invisible" checkBoxProps={control_checkBar01} />
        </div>
        {/* 請款表格 */}
        <Table_requestPayment disabled={disabled} control={control_table_requestPayment} />

        <div className={scss.checkBar02}>
          <InputSel showBaseline="invisible" checkBoxProps={control_checkBar02} />
        </div>

        {/* 發票給予紀錄 */}
        <AccountReceivable_dynaTable control={control_invoiceGivingRecord} disabled={disabled} />
        {/* 收款紀錄*/}
        <AccountReceivable_dynaTable control={control_paymentRecord} disabled={disabled} />
        {/* 扣款明細 */}
        <DeductionDetails control={control_deductionDetails} disabled={disabled} />
      </div>
      {/*  */}
      <InputModal
        title="當月預設發票前綴"
        visible={isShowInvoicePrefixModal}
        onConfirm={(value) => {
          setInvoicePrefix(value);
          setIsShowInvoicePrefixModal(false);
        }}
        onCancel={() => setIsShowInvoicePrefixModal(false)}
      />
      <PaymentRecordSelector
        label="請選擇收款紀錄"
        tip="可複選"
        showModal={true}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    </SubLayer>
  );
}

// ========================================================================

const fakeRequestPayment: TrequestPayment[] = [
  {
    caption: '訂約',
    paymentRatio: 'foo',
    loanPeriod: 'foo',
    remark: 'foo',
  },
  {
    caption: '送審',
    paymentRatio: 'foo',
    loanPeriod: 'foo',
    remark: 'foo',
  },
  {
    caption: '丈量',
    paymentRatio: 'foo',
    loanPeriod: 'foo',
    remark: 'foo',
  },
];

const creEmptyInvoice = (): Tinvoice => ({
  date: '',
  invoiceNumberPrefix: '',
  invoiceNumber: '',
  price: '',
  remark: '',
});

const fakeInvoiceArr: Tinvoice[] = [
  {
    date: '',
    invoiceNumberPrefix: '55555',
    invoiceNumber: '123',
    price: '999',
    remark: 'aaaaaa',
  },
  {
    date: '',
    invoiceNumberPrefix: '55555',
    invoiceNumber: '123',
    price: '999',
    remark: 'bbbbb',
  },
];
