import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

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
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import TwoButtonModal_free, { TwoBtnFooter } from 'components/global/gear/modal/simpleModal/twoButtonModal_free';

// api
import {
  TupdateEngineeringContactDto,
  useGetEngineeringContact,
  apiPatchEngineeringContact,
  apiPostWorkSheet,
  useGetFinalProduct,
} from 'js/api/api_engineering';
import { TquotationProductDto, useGetContract_id_noItems } from 'js/api/api_quotation';
import { TaccountantDto } from 'js/api/api_accountant';
import { TaccountsReceivableDeductionDto } from 'js/api/dtoTypes';

// utils
import { convertDate_reduce1911, getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// css
import scss from './index.module.scss';
import { update } from 'lodash';

// ========================================================================

// type TrequestPayment = {
//   caption: string;
//   paymentRatio: string;
//   loanPeriod: string;
//   remark: string;
// };

type Tinvoice = {
  date: string;
  invoiceNumberPrefix: string;
  invoiceNumber: string;
  price: string;
  remark: string;
};

type Tdeduction = {
  id?: string;
  key: string;
  itemName: string;
  period: number;
  detailedAmount: string;
};

type TdeductionList = {
  [key: string]: {
    itemName: string;
    list: {
      [key: string]: Tdeduction;
    };
  };
};

// ========================================================================

export default function AccountReceivable() {
  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };

  const [disabled, setDisabled] = useState(true);

  // --------------------------------------------------------------------------

  const [showRecordModal, setShowRecordModal] = useState<boolean>(false);
  const [showPeriodModal, setShowPeriodModal] = useState<boolean>(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState<boolean>(false);
  const [showPercentModal, setShowPercentModal] = useState<boolean>(false);

  // --------------------------------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id_noItems(contractId);
  const engineeringContactId = contract?.engineeringContactId;

  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  useEffect(() => {
    (async () => {
      if (contract) {
        return;
      }

      try {
        await update_contract();
      } catch (error) {
        myAlert.err({ title: '取得合約資料失敗' });
      }
    })();

    (async () => {
      try {
        await update_engineeringContact();
      } catch (error) {
        myAlert.err({ title: '取得工程聯絡單失敗', content: '請確認該合約是否已產生工程聯絡單' });
      }
    })();
  }, [contractId, engineeringContactId]);

  // --------------------------------------------------------------------------

  const { data: data_finalProduct, update: update_finalProduct } = useGetFinalProduct(contractId);
  useEffect(() => {
    (async () => {
      const res = await update_finalProduct();
    })();
  }, [contractId]);

  // --------------------------------------------------------------------------

  const { lastestVerifyForm } = useMemo(() => {
    if (!contract) {
      return {};
    }

    const { subContracts } = contract;
    const lastestSubContract = subContracts[subContracts.length - 1];
    const lastestVerifyForm = lastestSubContract.content.verifyForm;

    return { lastestVerifyForm };
  }, [
    contract,
    // engineeringContact,
  ]);

  // --------------------------------------------------------------------------

  // const [requestPaymentArr, setRequestPaymentArr] = useState<TrequestPayment[]>([]);

  // --------------------------------------------------------------------------

  const [invoiceArr, setInvoiceArr] = useState<Tinvoice[]>([]);
  useEffect(() => {
    if (disabled) {
      setInvoiceArr(fakeInvoiceArr);
    }
  }, [disabled]);

  // --------------------------------------------------------------------------

  // 收款明細
  const [accountantArr, setAccountantArr] = useState<TaccountantDto[]>([]);

  const addAccountant = (newArr: TaccountantDto[]) => {
    setAccountantArr((arr) => {
      return [...arr, ...newArr];
    });
  };

  // --------------------------------------------------------------------------

  // deductionDetails 扣款明細

  const [deductionList, setDeductionList] = useState<TdeductionList>({});
  const [changedDeduction, setChangedDeduction] = useState<{ [key: string]: { [key: string]: Tdeduction } }>({});
  const [deductionIdWillDeleteArr, setDeductionIdWillDeleteArr] = useState<string[]>([]);

  const recordChangedDeduction = (data: Tdeduction, pKey: string) => {
    setChangedDeduction((state) => {
      return {
        ...state,
        [pKey]: {
          ...state[pKey],
          [data.key]: data,
        },
      };
    });
  };

  const { periodQty, periodArr, itemNameArr, sortedDeductionList } = useMemo(() => {
    return createDeductionList(fakeAccountsReceivableDeduction);
  }, [fakeAccountsReceivableDeduction]);

  useEffect(() => {
    setDeductionList(sortedDeductionList);
  }, [sortedDeductionList]);

  // --------------------------------------------------------------------------

  const [checkBar01, setCheckBar01] = useState<string[]>([]);
  const [checkBar02, setCheckBar02] = useState<string[]>([]);

  // --------------------------------------------------------------------------

  // 更改發票前綴的modal
  const [isShowInvoicePrefixModal, setIsShowInvoicePrefixModal] = useState<boolean>(false);
  const [invoicePrefix, setInvoicePrefix] = useState<string>('');

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  const control_profile: Tcontrol_profile = {
    // left
    projectName: {
      value: engineeringContact?.projectName ?? '',
    },
    contractor: {
      value: engineeringContact?.contractor ?? '', // 承包商
    },
    companyName: {
      value: '未串接 承包商與承包商名稱是同一個資料嗎?', // 承包商名稱
    },
    contactPerson: {
      value: '未串接 承包商聯絡人', // 承包商聯絡人
    },
    businessIdNumber: {
      value: '未串接 承包商統編', // 承包商統編
    },
    companyAddress: {
      value: '未串接 承包商地址', // 承包商地址
    },
    companyPhoneNumber: {
      value: engineeringContact?.contractorContactNumber ?? '', // 承包商電話
    },
    projectAddress: {
      value: `${engineeringContact?.county}${engineeringContact?.district}${engineeringContact?.address}`,
    },
    projectPhoneNumber: {
      value: engineeringContact?.constructionSiteContactNumber ?? '', // 工地電話
    },
    // right
    warrantyPeriod: {
      value: '未串接',
    },
    projectNumber: {
      value: engineeringContact?.projectNumber ?? '',
    },
    valuationDate: {
      value: contract?.content.verifyForm?.askForPaymentDate ?? '',
    },
    paymentDate: {
      value: contract?.content.verifyForm?.disbursementDate ?? '',
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
    columnArr:
      lastestVerifyForm?.paymentRatio.map((item, index) => {
        return {
          caption: item.level,
          // 請款比例
          paymentRatio: {
            // value: item.paymentRatio,
            value: new Decimal(item.paymentRatio || 0).mul(100).toString() + '%',
          },
          // 放款票期
          loanPeriod: {
            // 合約審核表 TquotationVerifyFormDto.paymentRatioDto 沒有票期 還是說全部都放 paymentTenor?
            value: 'no property',
          },
          // 備註
          remark: {
            value: item.note,
          },
        };
      }) ?? [],
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
  // 控制 發票給予紀錄
  const control_invoiceGivingRecord = useMemo(() => {
    const control_invoiceGivingRecord_rowArr: Tcontrol_dynaTable['rowArr'] = invoiceArr.map((item, index) => {
      const subTable = {
        subHeadRow: {
          panelCell_04: {},
          list: createdHeadRowList_收款紀錄(),
        }, // subHeadRow close
        subRowArr: [
          {
            panelCell_04: {
              onChainBreakClick: () => {},
            },
            list: {
              date: {
                label: '日期',
                cellStyle: { width: '120px' },
                inputProps: {
                  props: {
                    value: 'no property',
                  },
                },
              },
              account: {
                label: '帳號',
                cellStyle: { width: '189px' },
                inputProps: {
                  props: {
                    value: 'foo',
                  },
                },
              },
              chequeNumber: {
                label: '票據號碼',
                cellStyle: { width: '189px' },
                inputProps: {
                  props: {
                    value: 'no property',
                  },
                },
              },
              chequeDate: {
                label: '票據日期',
                cellStyle: { width: '100px' },
                inputProps: {
                  props: {
                    value: 'foo',
                  },
                },
              },
              price: {
                label: '金額',
                cellStyle: { width: '170px' },
                inputProps: {
                  props: {
                    value: item.price,
                  },
                },
              },
              incomingSubpoenaSerialNumber: {
                label: '收入傳票序號',
                cellStyle: { width: '187px' },
                inputProps: {
                  props: {
                    value: 'no property',
                  },
                },
              },
            },
          },
        ],
      };

      return {
        panelCell_03: {
          onChainBreakClick: () => {},
          onEditClick: () => {},
          onAbandonClick: () => {},
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
          period: {
            label: '對應期數',
            cellStyle: { width: '75px' },
            inputProps: {
              props: {
                value: 'no property',
              },
            },
          },
        }, // list close
        subTable: subTable,
      }; // return close
    });

    const control_invoiceGivingRecord: Tcontrol_dynaTable = {
      caption: '發票給予紀錄',
      onSearchClick: (str) => {
        alert(str);
      },
      // tableBottomBtnProps: {
      //   label: '新增發票',
      //   onClick: () => {
      //     setInvoiceArr((arr) => {
      //       const empty = creEmptyInvoice();
      //       empty.invoiceNumberPrefix = invoicePrefix;

      //       return [...arr, empty];
      //     });
      //   },
      // },
      bottomBarProps: {
        label: '合計',
        value: '123,123',
      },
      headRow: {
        panelCell_03: {},
        list: createHeadRowList_發票給予紀錄({
          onDateClick: () => {
            alert('test');
          },
          onPriceClick: () => {
            alert('test');
          },
          onPeriodClick: () => {
            alert('test');
          },
        }),
      },
      rowArr: control_invoiceGivingRecord_rowArr,
    };

    return control_invoiceGivingRecord;
  }, [invoiceArr]);

  // --------------------------------------------------------------------------

  // 收款紀錄 不應該叫paymentRecord的
  const control_accountant = useMemo(() => {
    //
    let priceTotal = 0;

    const control_accountant_rowArr: Tcontrol_dynaTable['rowArr'] = accountantArr.map((item, index) => {
      priceTotal = priceTotal + item.price;

      //
      const subTable: Tcontrol_dynaTable['rowArr'][number]['subTable'] = {
        subHeadRow: {
          panelCell_05: {},
          list: createHeadRowList_發票給予紀錄(),
        },
        subRowArr: [
          {
            panelCell_05: {
              onChainClick: () => {},
              onRemoveClick: () => {},
            },
            list: {
              date: {
                label: '日期',
                cellStyle: { width: '120px' },
                datePickerProps: {
                  props: {
                    value: undefined,
                    onChange: () => {},
                  },
                },
              },
              invoiceNumber: {
                label: '發票號碼',
                cellStyle: { width: '300px' },
                twoInputProps: {
                  one: {
                    props: {
                      value: undefined,
                      onChange: () => {},
                    },
                  },
                  two: {
                    props: {
                      value: undefined,
                      onChange: () => {},
                    },
                  },
                },
              },
              price: {
                label: '金額',
                cellStyle: { width: '290px' },
                inputProps: {
                  props: {
                    value: undefined,
                    onChange: () => {},
                  },
                },
              },
              remark: {
                label: '備註',
                cellStyle: { width: '300px' },
                inputProps: {
                  props: {
                    value: undefined,
                    onChange: () => {},
                  },
                },
              },
              period: {
                label: '對應期數',
                cellStyle: { width: '75px' },
                inputProps: {
                  props: {
                    value: 'no property',
                  },
                },
              },
            },
          },
        ],
      };
      //

      const control_accountant_rowArr: Tcontrol_dynaTable['rowArr'][number] = {
        panelCell_05: {
          onChainClick: () => {},
          onRemoveClick: () => {},
        },
        list: {
          date: {
            label: '日期',
            cellStyle: { width: '120px' },
            inputProps: {
              props: {
                value: 'no property',
              },
            },
          },
          account: {
            label: '帳號',
            cellStyle: { width: '189px' },
            inputProps: {
              props: {
                value: item.accountingNumber,
              },
            },
          },
          chequeNumber: {
            label: '票據號碼',
            cellStyle: { width: '189px' },
            inputProps: {
              props: {
                value: 'no property',
              },
            },
          },
          chequeDate: {
            label: '票據日期',
            cellStyle: { width: '100px' },
            inputProps: {
              props: {
                value: getTaiwanDateStr(item.noteMaturityDate) ?? '',
              },
            },
          },
          price: {
            label: '金額',
            cellStyle: { width: '170px' },
            inputProps: {
              props: {
                value: item.price,
              },
            },
          },
          incomingSubpoenaSerialNumber: {
            label: '收入傳票序號',
            cellStyle: { width: '187px' },
            inputProps: {
              props: {
                value: 'no property',
              },
            },
          },
        },
        subTable,
      };

      return control_accountant_rowArr;
    }); // control_accountant_rowArr

    const control_accountant: Tcontrol_dynaTable = {
      caption: '收款紀錄',
      onSearchClick: (str) => {
        alert(str);
      },
      tableBottomBtnProps: {
        label: '新增收款紀錄',
        onClick: () => {
          setShowRecordModal(true);
        },
      },
      bottomBarProps: {
        label: '合計',
        value: priceTotal.toLocaleString(),
      },
      headRow: {
        panelCell_05: {},
        list: createdHeadRowList_收款紀錄({
          onDateClick: () => {
            alert('test');
          },
          onChequeDateClick: () => {
            alert('test');
          },
          onIncomingSubpoenaSerialNumberClick: () => {
            alert('test');
          },
        }),
      },
      rowArr: control_accountant_rowArr,
    };

    return control_accountant;
  }, [accountantArr]);

  // --------------------------------------------------------------------------

  const control_deductionDetails = useMemo(() => {
    const columnArr = Object.keys(deductionList).map((pKey, itemNameIndex) => {
      let subTotal = 0;
      const itemName = deductionList[pKey]?.itemName;
      const theList = deductionList[pKey]?.list;

      const arr = periodArr.map((period) => {
        const deduction = deductionList?.[pKey]?.list?.[period];

        const detailedAmount = deduction?.detailedAmount ?? '';

        subTotal = subTotal + Number(detailedAmount || '0');

        const controlItem: Tcontrol_deductionDetails['columnArr'][number]['arr'][number] = {
          value: detailedAmount,
          onChange: (str) => {
            setDeductionList((obj) => {
              const newObj = { ...obj };

              if (!newObj[pKey]) {
                newObj[pKey] = {
                  itemName: itemName,
                  list: {},
                };
              }

              if (!newObj[pKey].list[period]) {
                newObj[pKey].list[period] = {
                  key: nanoid(),
                  itemName: itemName,
                  period: Number(period),
                  detailedAmount: '',
                };
              }

              newObj[pKey].list[period].detailedAmount = str;
              recordChangedDeduction(newObj[pKey].list[period], pKey);

              return newObj;
            });
          },
        };

        return controlItem;
      });

      const tax = new Decimal(subTotal).mul(0.05).toNumber();

      const column: Tcontrol_deductionDetails['columnArr'][number] = {
        caption: itemName,
        onChange: (str) => {
          setDeductionList((obj) => {
            const newObj = { ...obj };

            const theItem = newObj[pKey];
            theItem.itemName = str;
            Object.keys(theItem.list).forEach((key) => {
              theItem.list[key].itemName = str;
            });

            newObj[pKey] = theItem;

            return newObj;
          });
        },
        subTotal: subTotal.toLocaleString(),
        tax: tax.toLocaleString(),
        total: (subTotal + tax).toLocaleString(),
        onDeleteClick: () => {
          setDeductionList((obj) => {
            const newObj = { ...obj };
            const list = newObj[pKey].list;
            const idArr = Object.values(list).map((item) => item.id);
            const theIdArr = idArr.filter((id) => id) as string[];
            setDeductionIdWillDeleteArr((arr) => [...arr, ...theIdArr]);
            delete newObj[pKey];

            return newObj;
          });
          setChangedDeduction((obj) => {
            const newObj = { ...obj };
            delete newObj[pKey];

            return newObj;
          });
        },
        arr,
      };

      return column;
    });

    const control_deductionDetails: Tcontrol_deductionDetails = {
      onTopBtnClick: () => {
        setDeductionList((obj) => {
          return {
            ...obj,
            [nanoid()]: {
              itemName: 'new',
              list: {},
            },
          };
        });
      },
      sideColumn: {
        caption: '項目',
        subTotal: '合計',
        tax: '營業稅5%',
        total: '總計',
        arr: periodArr.map((item) => {
          return {
            value: `第${item}期`,
          };
        }),
      },
      columnArr: columnArr,
    };

    return control_deductionDetails;
  }, [deductionList]);

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
      <PageHeader panelList={panelList} contractNumber={engineeringContact?.contractNumber ?? ''} />
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
        <AccountReceivable_dynaTable control={control_accountant} disabled={disabled} />
        {/* 扣款明細 */}
        <DeductionDetails control={control_deductionDetails} disabled={disabled} />
      </div>
      {/*  */}
      <InputModal
        title="當月發票預設前兩碼"
        visible={isShowInvoicePrefixModal}
        // visible={true}
        onConfirm={(value) => {
          setInvoicePrefix(value);
          setIsShowInvoicePrefixModal(false);
        }}
        onCancel={() => setIsShowInvoicePrefixModal(false)}
      />

      <InputModal
        //
        title="請輸入百分比"
        visible={showPercentModal}
        onConfirm={(value) => {}}
        onCancel={() => {
          setShowPercentModal(false);
        }}
      />

      <PaymentRecordSelector
        label="請選擇收款紀錄"
        tip="可複選"
        showModal={showRecordModal}
        onConfirm={addAccountant}
        onCancel={() => {
          setShowRecordModal(false);
        }}
        exceptAccountantArr={accountantArr}
      />

      <TwoButtonModal_free
        //
        title={`"請選擇移除 第${3}期 方式"`}
        visible={showPeriodModal}
        onConfirm={() => {}}
        onCancel={() => {
          setShowPeriodModal(false);
        }}
        modalProps={{
          width: 453,
        }}
      >
        <div className={scss.cleanPeriodBar}>
          <div className={scss.left}>
            <span>往前遞補</span>
          </div>
          <div className={scss.right}>
            <span>留空</span>
          </div>
        </div>
      </TwoButtonModal_free>

      <TwoButtonModal_free
        //
        title="請輸入新增發票"
        visible={showAddInvoiceModal}
        onCancel={() => setShowAddInvoiceModal(false)}
        modalProps={{
          width: 400,
          footer: null,
        }}
      >
        <form
          className={classNames()}
          onSubmit={(e) => {
            e.preventDefault();
            const target = e.target as HTMLFormElement;
            const t0 = target[0] as HTMLInputElement;
            const t1 = target[1] as HTMLInputElement;
            console.log(t0.value);
            console.log(t1.value);
          }}
        >
          <div className={scss.addInvoiceModal}>
            <label>
              <InputSel caption="發票日期" datePickerProps={{}} showBaseline="invisible" />
            </label>
            <label>
              <InputSel caption="發票號碼" inputProps={{}} showBaseline="invisible" />
            </label>
          </div>

          <TwoBtnFooter
            onConfirm={() => {}}
            onCancel={(e) => {
              e.preventDefault();
              setShowAddInvoiceModal(false);
            }}
          />
        </form>
      </TwoButtonModal_free>
    </SubLayer>
  );
}

// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================

// const fakeRequestPayment: TrequestPayment[] = [
//   {
//     caption: '訂約',
//     paymentRatio: 'foo',
//     loanPeriod: 'foo',
//     remark: 'foo',
//   },
//   {
//     caption: '送審',
//     paymentRatio: 'foo',
//     loanPeriod: 'foo',
//     remark: 'foo',
//   },
//   {
//     caption: '丈量',
//     paymentRatio: 'foo',
//     loanPeriod: 'foo',
//     remark: 'foo',
//   },
// ];

// const creEmptyInvoice = (): Tinvoice => ({
//   date: '',
//   invoiceNumberPrefix: '',
//   invoiceNumber: '',
//   price: '',
//   remark: '',
// });

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

const fakeAccountsReceivableDeduction: TaccountsReceivableDeductionDto[] = [
  {
    id: 'u1',
    createdAt: '',
    updatedAt: '',
    itemName: '工作證',
    period: 1,
    detailedAmount: 999,
    accountsReceivableId: '',
  },
  {
    id: 'u2',
    createdAt: '',
    updatedAt: '',
    itemName: '工作證',
    period: 2,
    detailedAmount: 111,
    accountsReceivableId: '',
  },
  {
    id: 'u3',
    createdAt: '',
    updatedAt: '',
    itemName: '工作證',
    period: 3,
    detailedAmount: 333,
    accountsReceivableId: '',
  },
  {
    id: 'u4',
    createdAt: '',
    updatedAt: '',
    itemName: '安衛費',
    period: 1,
    detailedAmount: 11,
    accountsReceivableId: '',
  },
  {
    id: 'u5',
    createdAt: '',
    updatedAt: '',
    itemName: '安衛費',
    period: 3,
    detailedAmount: 322,
    accountsReceivableId: '',
  },
];

/**用來把從後端取得的扣款明細變成這裡可以用的樣子 */
const createDeductionList = (data: TaccountsReceivableDeductionDto[]) => {
  let periodQty = 0;
  const itemNameArr: string[] = [];
  const list: TdeductionList = {};

  data.forEach((item) => {
    const { id, itemName, period } = item;

    if (!itemNameArr.includes(itemName)) {
      itemNameArr.push(itemName);
    }

    if (period > periodQty) {
      periodQty = period;
    }

    if (!list[itemName]) {
      list[itemName] = {
        itemName,
        list: {},
      };
    }

    list[itemName].list[`${period}`] = {
      id: id,
      key: id,
      itemName,
      period,
      detailedAmount: String(item.detailedAmount),
    };

    //
  });

  const periodArr = Array.from({ length: periodQty }, (_, i) => String(i + 1));

  return {
    periodQty,
    periodArr,
    itemNameArr,
    sortedDeductionList: list,
  };
};

const createdHeadRowList_收款紀錄 = (props?: {
  onDateClick?: () => void;
  onChequeDateClick?: () => void;
  onIncomingSubpoenaSerialNumberClick?: () => void;
}) => ({
  date: {
    label: '日期',
    cellStyle: { width: '120px' },
    onClick: props?.onDateClick,
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
    onClick: props?.onChequeDateClick,
  },
  price: {
    label: '金額',
    cellStyle: { width: '170px' },
  },
  incomingSubpoenaSerialNumber: {
    label: '收入傳票序號',
    cellStyle: { width: '187px' },
    onClick: props?.onIncomingSubpoenaSerialNumberClick,
  },
});

const createHeadRowList_發票給予紀錄 = (props?: {
  onDateClick: () => void;
  onPriceClick: () => void;
  onPeriodClick: () => void;
}) => ({
  date: {
    label: '日期',
    cellStyle: { width: '120px' },
    onClick: props?.onDateClick,
  },
  invoiceNumber: {
    label: '發票號碼',
    cellStyle: { width: '300px' },
  },
  price: {
    label: '金額',
    cellStyle: { width: '290px' },
    onClick: props?.onPriceClick,
  },
  remark: {
    label: '備註',
    cellStyle: { width: '300px' },
  },
  period: {
    label: '對應期數',
    cellStyle: { width: '75px' },
    onClick: props?.onPeriodClick,
  },
});
