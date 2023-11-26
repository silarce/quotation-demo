/**
 * 常用變數 accountReceivableId
 */

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
  Trow,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/accountReceivable_dynaTable';
import DeductionDetails, {
  Tcontrol_deductionDetails,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/deductionDetails';
import Table_request from 'components/page/worksDepartment/contracList/contract/accountReceivable/table_request';

// gear
import InputSel, { TinputSelProps, TcheckboxProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';
import PaymentRecordSelector from 'components/global/gear/modal/paymentRecordSelector';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import TwoButtonModal_free, { TwoBtnFooter } from 'components/global/gear/modal/simpleModal/twoButtonModal_free';
import InvoiceSelector from 'components/global/gear/modal/invoiceSelector';

// api
import {
  TupdateEngineeringContactDto,
  TupdateAccountReceivableDto,
  TaccountReceivableDto,
  useGetEngineeringContact,
  apiPatchEngineeringContact,
  apiPostWorkSheet,
  useGetFinalProduct,
  useGetAccountReceivable_id,
  apiPatchAccountReceivable,
  useGetAccountReceivableAccountants,
  apiPostAccountReceivableAccountant,
  apiDeleteAccountReceivableAccountant,
  useGetAccountReceivableIncoices,
  TaccountsReceivableInvoiceDto,
  apiPatchAccountReceivableInvoice,
  TupdateAccountReceivableInvoiceDto,
  apiPatchAccountReceivableAccountant,
} from 'js/api/api_engineering';
import { TquotationProductDto, useGetContract_id_noItems } from 'js/api/api_quotation';
import { TaccountantDto } from 'js/api/api_accountant';
import { TaccountsReceivableDeductionDto } from 'js/api/dtoTypes';

// utils
import { convertDate_reduce1911, getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// css
import scss from './index.module.scss';

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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(true);

  // --------------------------------------------------------------------------

  const [showRecordModal, setShowRecordModal] = useState<boolean>(false);
  const [showPeriodModal, setShowPeriodModal] = useState<boolean>(false);
  const [showPercentModal, setShowPercentModal] = useState<boolean>(false);

  // --------------------------------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id_noItems(contractId);

  const { engineeringContactId, accountReceivableId } = contract ?? {};

  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  const doUpdate_contract = async () => {
    if (contract) {
      return;
    }

    try {
      await update_contract();
    } catch (error) {
      myAlert.err({ title: '取得合約資料失敗' });
    }
  };

  useEffect(() => {
    const req02 = async () => {
      try {
        await update_engineeringContact();
      } catch (error) {
        myAlert.err({ title: '取得工程聯絡單失敗', content: '請確認該合約是否已產生工程聯絡單' });
      }
    };

    (async () => {
      try {
        setIsLoading(true);
        await doUpdate_contract();
        await req02();
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, [contractId, engineeringContactId]);

  // --------------------------------------------------------------------------

  // _use收款紀錄
  const { data: data_accountantArr, update: update_accountantArr } =
    useGetAccountReceivableAccountants(accountReceivableId);

  const [targetAccountant, setTargetAccountant] = useState<TaccountantDto>();

  // _use發票給予紀錄
  const { data: data_invoiceArr, update: update_invoiceArr } = useGetAccountReceivableIncoices(accountReceivableId);

  // --------------------------------------------------------------------------

  // 應收帳款明細
  const [accountReceivable, setAccountReceivable] = useState<TaccountReceivableDto>();

  // console.log(accountReceivable);

  // --------------------------------------------------------------------------

  const { data: data_finalProduct, update: update_finalProduct } = useGetFinalProduct(contractId);

  // const {} = useGetAccountReceivable_id();

  useEffect(() => {
    (async () => {
      const res = await update_finalProduct();
    })();
  }, [contractId]);

  // --------------------------------------------------------------------------

  useEffect(() => {
    const accountReceivable = contract?.accountReceivable;
    // console.log(contract);
    setAccountReceivable(accountReceivable);
  }, [contract, disabled]);

  useEffect(() => {
    update_accountantArr();
    update_invoiceArr();
  }, [accountReceivableId]);

  const {
    lastestVerifyForm, // 請款比例表用的
  } = useMemo(() => {
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

  const [invoiceArr, setInvoiceArr] = useState<TaccountsReceivableInvoiceDto[]>([]);

  const [targetInvoice, setTargetInvoice] = useState<TaccountsReceivableInvoiceDto>();

  useEffect(() => {
    if (disabled) {
      setInvoiceArr(data_invoiceArr ?? []);
    }
  }, [data_invoiceArr, disabled]);

  // --------------------------------------------------------------------------

  // 收款明細

  // --------------------------------------------------------------------------

  // deductionDetails 扣款明細

  // const [deductionList, setDeductionList] = useState<TdeductionList>({});
  // const [changedDeduction, setChangedDeduction] = useState<{ [key: string]: { [key: string]: Tdeduction } }>({});
  // const [deductionIdWillDeleteArr, setDeductionIdWillDeleteArr] = useState<string[]>([]);

  // const recordChangedDeduction = (data: Tdeduction, pKey: string) => {
  //   setChangedDeduction((state) => {
  //     return {
  //       ...state,
  //       [pKey]: {
  //         ...state[pKey],
  //         [data.key]: data,
  //       },
  //     };
  //   });
  // };

  // const { periodQty, periodArr, itemNameArr, sortedDeductionList } = useMemo(() => {
  //   return createDeductionList(fakeAccountsReceivableDeduction);
  // }, [fakeAccountsReceivableDeduction]);

  // useEffect(() => {
  //   setDeductionList(sortedDeductionList);
  // }, [sortedDeductionList]);

  // --------------------------------------------------------------------------

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
      value: accountReceivable?.valuationDate ?? '',
      onChange_date: (str) => {
        setAccountReceivable((state) => {
          if (!state) {
            return state;
          }

          return {
            ...state,
            valuationDate: str,
          };
        });
      },
    },
    paymentDate: {
      value: accountReceivable?.payOffDay ?? '',
      onChange_date: (str) => {
        setAccountReceivable((state) => {
          if (!state) {
            return state;
          }

          return {
            ...state,
            payOffDay: str,
          };
        });
      },
    },
  };

  // --------------------------------------------------------------------------

  // console.log(accountReceivable);

  const control_checkBar01: TcheckboxProps = {
    onChange: (arr) => {
      const performanceBond = arr.includes('performanceBond');
      const depositGuaranteeTicket = arr.includes('depositGuaranteeTicket');
      const warrantyTicket = arr.includes('warrantyTicket');

      setAccountReceivable((state) => {
        if (!state) {
          return state;
        }

        const copy = { ...state };
        copy.performanceBond = performanceBond;
        copy.depositGuaranteeTicket = depositGuaranteeTicket;
        copy.warrantyTicket = warrantyTicket;

        return copy;
      });
    },
    propsArr: [
      {
        key: 'performanceBond',
        label: '履約保證票',
        value: accountReceivable?.performanceBond,
        props: {
          className: classNames(accountReceivable?.performanceBond && scss.checkActive),
        },
      },
      {
        key: 'depositGuaranteeTicket',
        label: '訂金款保證票',
        value: accountReceivable?.depositGuaranteeTicket,
        props: {
          className: classNames(accountReceivable?.depositGuaranteeTicket && scss.checkActive),
        },
      },
      {
        key: 'warrantyTicket',
        label: '保固票',
        value: accountReceivable?.warrantyTicket,
        props: {
          className: classNames(accountReceivable?.warrantyTicket && scss.checkActive),
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
            value: item.note ?? '',
          },
        };
      }) ?? [],
  };

  // --------------------------------------------------------------------------

  const control_checkBar02: TcheckboxProps = {
    onChange: (arr) => {
      const hasNoContract = arr.includes('hasNoContract');
      const hasUncollectedAmounts = arr.includes('hasUncollectedAmounts');
      const hasNotInstall = arr.includes('hasNotInstall');

      setAccountReceivable((state) => {
        if (!state) {
          return state;
        }

        const copy = { ...state };
        copy.hasNoContract = hasNoContract;
        copy.hasUncollectedAmounts = hasUncollectedAmounts;
        copy.hasNotInstall = hasNotInstall;

        return copy;
      });
    },
    propsArr: [
      {
        key: 'hasNoContract',
        label: '異常燈號：工作表已開立，合約尚未簽回',
        value: accountReceivable?.hasNoContract,
        props: {
          className: classNames(accountReceivable?.hasNoContract && scss.checkActive),
        },
      },
      {
        key: 'hasUncollectedAmounts',
        label: '提醒燈號：已出具說明，尚未收足款項 ',
        value: accountReceivable?.hasUncollectedAmounts,
        props: {
          className: classNames(accountReceivable?.hasUncollectedAmounts && scss.checkActive),
        },
      },
      {
        key: 'hasNotInstall',
        label: '已出貨因故尚未安裝',
        value: accountReceivable?.hasNotInstall,
        props: {
          className: classNames(accountReceivable?.hasNotInstall && scss.checkActive),
        },
      },
    ],
  };

  // --------------------------------------------------------------------------
  // __invoice control
  // data_invoiceArr
  // 控制 發票給予紀錄
  const control_invoiceGivingRecord = useMemo(() => {
    const control_invoiceGivingRecord_rowArr: Tcontrol_dynaTable['rowArr'] = invoiceArr.map((item, index) => {
      const accountantArr = item.accountantList;

      const subRowArr: Trow[] = accountantArr.map((accountant) => {
        const {
          //
          createdAt,
          paymentType,
          accountingNumber, // 編號/存入帳號
          price,
          notes,
          billSerialNumber, // 收入傳票序號
          noteMaturityDate, // 票據到期日
        } = accountant;

        return {
          panelCell_04: {
            onChainBreakClick: () => {},
          },
          list: {
            date: {
              label: '日期',
              cellStyle: { width: '120px' },
              inputProps: {
                props: {
                  // value: 'no property',
                  value: getTaiwanDateStr(createdAt) ?? '',
                },
              },
            },
            account: {
              label: '帳號',
              cellStyle: { width: '189px' },
              inputProps: {
                props: {
                  value: accountingNumber,
                },
              },
            },
            chequeNumber: {
              label: '票據號碼',
              cellStyle: { width: '189px' },
              inputProps: {
                props: {
                  value: accountingNumber,
                },
              },
            },
            chequeDate: {
              label: '票據日期',
              cellStyle: { width: '100px' },
              inputProps: {
                props: {
                  value: getTaiwanDateStr(noteMaturityDate) ?? '',
                },
              },
            },
            price: {
              label: '金額',
              cellStyle: { width: '170px' },
              inputProps: {
                props: {
                  value: price,
                },
              },
            },
            incomingSubpoenaSerialNumber: {
              label: '收入傳票序號',
              cellStyle: { width: '187px' },
              inputProps: {
                props: {
                  value: billSerialNumber ?? '',
                },
              },
            },
          },
        };
      });

      const subTable = {
        subHeadRow: {
          panelCell_04: {},
          list: createdHeadRowList_收款紀錄(),
        }, // subHeadRow close
        subRowArr: subRowArr,
      };

      return {
        panelCell_03: {
          onChainBreakClick: () => {},
          onEditClick: () => {
            setTargetInvoice(item);
          },
          onAbandonClick: () => {},
        },
        list: {
          date: {
            label: '日期',
            cellStyle: { width: '120px' },
            datePickerProps: {
              props: {
                value: item.invoiceDate ? moment(item.invoiceDate) : null,
                onChange: (date) => {
                  setInvoiceArr((arr) => {
                    const newArr = [...arr];
                    const theDate = date?.toISOString() ?? '';
                    newArr[index].invoiceDate = theDate;

                    return newArr;
                  });
                },
              },
            },
          },
          invoiceNumber: {
            label: '發票號碼',
            cellStyle: { width: '300px' },
            // twoInputProps: {
            //   one: {
            //     props: {
            //       // value: item.invoiceNumberPrefix,
            //       // onChange: (e) => {
            //       //   const arr = [...invoiceArr];
            //       //   arr[index].invoiceNumberPrefix = e.target.value;
            //       //   setInvoiceArr(arr);
            //       // },
            //       value: '',
            //       onChange: (e) => {
            //         // const arr = [...invoiceArr];
            //         // arr[index].invoiceNumberPrefix = e.target.value;
            //         // setInvoiceArr(arr);
            //       },
            //     },
            //   },
            //   two: {
            //     props: {
            //       value: item.invoiceNumber ?? '',
            //       onChange: (e) => {
            //         const arr = [...invoiceArr];
            //         arr[index].invoiceNumber = e.target.value;
            //         setInvoiceArr(arr);
            //       },
            //     },
            //   },
            // },
            inputProps: {
              props: {
                value: item.invoiceNumber ?? '',
                onChange: (e) => {
                  const arr = [...invoiceArr];
                  arr[index].invoiceNumber = e.target.value;
                  setInvoiceArr(arr);
                },
              },
            },
          },
          price: {
            label: '金額',
            cellStyle: { width: '290px' },
            inputProps: {
              props: {
                type: 'number',
                value: String(item.price) ?? '',
                onChange: (e) => {
                  const arr = [...invoiceArr];
                  arr[index].price = Number(e.target.value);
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
                value: item.note ?? '',
                onChange: (e) => {
                  const arr = [...invoiceArr];
                  arr[index].note = e.target.value;
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

  // __accountant control

  // 收款紀錄 不應該叫paymentRecord的
  const control_accountant = useMemo(() => {
    //
    let priceTotal = 0;

    const control_accountant_rowArr: Tcontrol_dynaTable['rowArr'] = (data_accountantArr ?? []).map((item, index) => {
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
          onChainClick: () => {
            setTargetAccountant(item);
          },
          onRemoveClick: () => {
            deleteAccountant(item.id);
          },
        },
        list: {
          date: {
            label: '日期',
            cellStyle: { width: '120px' },
            inputProps: {
              props: {
                value: getTaiwanDateStr(item.createdAt) ?? '',
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
                value: item.accountingNumber,
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
                value: item.billSerialNumber ?? '',
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
  }, [data_accountantArr]);

  // --------------------------------------------------------------------------

  // const control_deductionDetails = useMemo(() => {
  //   const columnArr = Object.keys(deductionList).map((pKey, itemNameIndex) => {
  //     let subTotal = 0;
  //     const itemName = deductionList[pKey]?.itemName;
  //     const theList = deductionList[pKey]?.list;

  //     const arr = periodArr.map((period) => {
  //       const deduction = deductionList?.[pKey]?.list?.[period];

  //       const detailedAmount = deduction?.detailedAmount ?? '';

  //       subTotal = subTotal + Number(detailedAmount || '0');

  //       const controlItem: Tcontrol_deductionDetails['columnArr'][number]['arr'][number] = {
  //         value: detailedAmount,
  //         onChange: (str) => {
  //           setDeductionList((obj) => {
  //             const newObj = { ...obj };

  //             if (!newObj[pKey]) {
  //               newObj[pKey] = {
  //                 itemName: itemName,
  //                 list: {},
  //               };
  //             }

  //             if (!newObj[pKey].list[period]) {
  //               newObj[pKey].list[period] = {
  //                 key: nanoid(),
  //                 itemName: itemName,
  //                 period: Number(period),
  //                 detailedAmount: '',
  //               };
  //             }

  //             newObj[pKey].list[period].detailedAmount = str;
  //             recordChangedDeduction(newObj[pKey].list[period], pKey);

  //             return newObj;
  //           });
  //         },
  //       };

  //       return controlItem;
  //     });

  //     const tax = new Decimal(subTotal).mul(0.05).toNumber();

  //     const column: Tcontrol_deductionDetails['columnArr'][number] = {
  //       caption: itemName,
  //       onChange: (str) => {
  //         setDeductionList((obj) => {
  //           const newObj = { ...obj };

  //           const theItem = newObj[pKey];
  //           theItem.itemName = str;
  //           Object.keys(theItem.list).forEach((key) => {
  //             theItem.list[key].itemName = str;
  //           });

  //           newObj[pKey] = theItem;

  //           return newObj;
  //         });
  //       },
  //       subTotal: subTotal.toLocaleString(),
  //       tax: tax.toLocaleString(),
  //       total: (subTotal + tax).toLocaleString(),
  //       onDeleteClick: () => {
  //         setDeductionList((obj) => {
  //           const newObj = { ...obj };
  //           const list = newObj[pKey].list;
  //           const idArr = Object.values(list).map((item) => item.id);
  //           const theIdArr = idArr.filter((id) => id) as string[];
  //           setDeductionIdWillDeleteArr((arr) => [...arr, ...theIdArr]);
  //           delete newObj[pKey];

  //           return newObj;
  //         });
  //         setChangedDeduction((obj) => {
  //           const newObj = { ...obj };
  //           delete newObj[pKey];

  //           return newObj;
  //         });
  //       },
  //       arr,
  //     };

  //     return column;
  //   });

  //   const control_deductionDetails: Tcontrol_deductionDetails = {
  //     onTopBtnClick: () => {
  //       setDeductionList((obj) => {
  //         return {
  //           ...obj,
  //           [nanoid()]: {
  //             itemName: 'new',
  //             list: {},
  //           },
  //         };
  //       });
  //     },
  //     sideColumn: {
  //       caption: '項目',
  //       subTotal: '合計',
  //       tax: '營業稅5%',
  //       total: '總計',
  //       arr: periodArr.map((item) => {
  //         return {
  //           value: `第${item}期`,
  //         };
  //       }),
  //     },
  //     columnArr: columnArr,
  //   };

  //   return control_deductionDetails;
  // }, [deductionList]);

  // --------------------------------------------------------------------------
  // __request

  // patch應收帳款明細
  const reqPatchAccountReceivable = async () => {
    if (!accountReceivable || !accountReceivableId) {
      return;
    }

    try {
      setIsLoading(true);
      await apiPatchAccountReceivable(accountReceivableId, accountReceivable);
      setDisabled(true);
      await doUpdate_contract();
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // 編輯發票
  const reqPatchAccountReceivableInvoice = async (preBody: {
    invoiceDate: string;
    invoiceNumber: string;
    price: number;
    note: string;
  }) => {
    if (!targetInvoice) {
      return;
    }

    const accountants = targetInvoice.accountantList.map((item) => item.id);

    const body: TupdateAccountReceivableInvoiceDto = {
      invoiceDate: preBody.invoiceDate,
      invoiceNumber: preBody.invoiceNumber,
      price: preBody.price,
      note: preBody.note,
      accountants,
    };

    try {
      await apiPatchAccountReceivableInvoice(targetInvoice.id, body);
      setTargetInvoice(undefined);
      update_invoiceArr();
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '編輯發票失敗', content: err.message });
    } finally {
    }
  };

  /** 新增收款明細*/
  const addAccountant = async (newArr: TaccountantDto[]) => {
    if (!accountReceivableId) {
      return;
    }

    const accountantId = newArr.map((item) => item.id);

    const body = {
      accountantId,
    };

    try {
      await apiPostAccountReceivableAccountant(accountReceivableId, body);
      await update_accountantArr();
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '新增收款明細失敗', content: err.message });
    }
  };

  /**移除收款明細 */
  const deleteAccountant = async (id: string) => {
    if (!accountReceivableId) {
      return;
    }

    try {
      await apiDeleteAccountReceivableAccountant(accountReceivableId, id);
      await update_accountantArr();
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '移除收款明細失敗', content: err.message });
    }
  };

  /** 更新 收款紀錄與發票關聯 account-receivable-accountant*/
  const reqPatchAccountReceivableAccountant = async (arr: TaccountsReceivableInvoiceDto[]) => {
    if (!targetAccountant || !accountReceivableId) {
      return;
    }

    const body = arr.map((item) => item.id);

    try {
      await apiPatchAccountReceivableAccountant(accountReceivableId, targetAccountant.id, body);
      setTargetAccountant(undefined);
      await update_accountantArr();
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '更新收款紀錄與發票關聯失敗', content: err.message });
    }
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
      onClick: reqPatchAccountReceivable,
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
    <SubLayer isLoading_all={isLoading}>
      <PageHeader panelList={panelList} contractNumber={engineeringContact?.contractNumber ?? ''} />
      <div className={scss.main}>
        <Profile control={control_profile} disabled={disabled} />

        <div className={scss.checkBar01}>
          <InputSel disabled={disabled} showBaseline="invisible" checkBoxProps={control_checkBar01} />
        </div>
        {/* 請款表格 */}
        <Table_requestPayment disabled={disabled} control={control_table_requestPayment} />

        <div className={scss.checkBar02}>
          <InputSel disabled={disabled} showBaseline="invisible" checkBoxProps={control_checkBar02} />
        </div>

        {/* 請款單表格 */}
        <Table_request
          contractId={contractId}
          accountReceivableId={accountReceivableId}
          invoiceArr={data_invoiceArr}
          onInvoiceAdd={update_invoiceArr}
        />

        {/* 發票給予紀錄 */}
        <AccountReceivable_dynaTable control={control_invoiceGivingRecord} disabled={disabled} />
        {/* 收款紀錄*/}
        <AccountReceivable_dynaTable control={control_accountant} disabled={disabled} />
        {/* 扣款明細 */}
        <DeductionDetails disabled={disabled} />
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
        exceptAccountantArr={data_accountantArr}
      />

      <InvoiceSelector
        accountReceivableId={accountReceivableId}
        label="請選擇發票"
        tip="可複選"
        showModal={!!targetAccountant}
        onConfirm={reqPatchAccountReceivableAccountant}
        onCancel={() => {
          setTargetAccountant(undefined);
        }}
        exceptInvoiceArr={[]}
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

      {/* 編輯發票 */}
      <TwoButtonModal_free
        //
        title="編輯發票"
        visible={!!targetInvoice}
        onCancel={() => setTargetInvoice(undefined)}
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
            const invoiceDate = (target[0] as HTMLInputElement).value;
            const invoiceNumber = (target[1] as HTMLInputElement).value;
            const price = Number((target[2] as HTMLInputElement).value);
            const note = (target[3] as HTMLInputElement).value;
            reqPatchAccountReceivableInvoice({
              invoiceDate,
              invoiceNumber,
              price,
              note,
            });
          }}
        >
          <div className={scss.addInvoiceModal}>
            <label>
              <InputSel
                caption="發票日期"
                datePickerProps={{
                  props: {
                    defaultValue: moment(targetInvoice?.invoiceDate),
                  },
                }}
                showBaseline="invisible"
              />
            </label>
            <label>
              <InputSel
                caption="發票號碼"
                inputProps={{
                  props: {
                    defaultValue: targetInvoice?.invoiceNumber,
                  },
                }}
                showBaseline="invisible"
              />
            </label>
            <label>
              <InputSel
                caption="發票金額"
                inputProps={{
                  props: {
                    defaultValue: targetInvoice?.price,

                    type: 'number',
                  },
                }}
                showBaseline="invisible"
              />
            </label>
            <label>
              <InputSel
                caption="發票備註"
                inputProps={{
                  props: {
                    defaultValue: targetInvoice?.note ?? '',
                  },
                }}
                showBaseline="invisible"
              />
            </label>
          </div>

          <TwoBtnFooter
            onConfirm={() => {}}
            onCancel={(e) => {
              e.preventDefault();
              setTargetInvoice(undefined);
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

// const fakeAccountsReceivableDeduction: TaccountsReceivableDeductionDto[] = [
//   {
//     id: 'u1',
//     createdAt: '',
//     updatedAt: '',
//     itemName: '工作證',
//     period: 1,
//     detailedAmount: 999,
//     accountsReceivableId: '',
//   },
//   {
//     id: 'u2',
//     createdAt: '',
//     updatedAt: '',
//     itemName: '工作證',
//     period: 2,
//     detailedAmount: 111,
//     accountsReceivableId: '',
//   },
//   {
//     id: 'u3',
//     createdAt: '',
//     updatedAt: '',
//     itemName: '工作證',
//     period: 3,
//     detailedAmount: 333,
//     accountsReceivableId: '',
//   },
//   {
//     id: 'u4',
//     createdAt: '',
//     updatedAt: '',
//     itemName: '安衛費',
//     period: 1,
//     detailedAmount: 11,
//     accountsReceivableId: '',
//   },
//   {
//     id: 'u5',
//     createdAt: '',
//     updatedAt: '',
//     itemName: '安衛費',
//     period: 3,
//     detailedAmount: 322,
//     accountsReceivableId: '',
//   },
// ];

// /**用來把從後端取得的扣款明細變成這裡可以用的樣子 */
// const createDeductionList = (data: TaccountsReceivableDeductionDto[]) => {
//   let periodQty = 0;
//   const itemNameArr: string[] = [];
//   const list: TdeductionList = {};

//   data.forEach((item) => {
//     const { id, itemName, period } = item;

//     if (!itemNameArr.includes(itemName)) {
//       itemNameArr.push(itemName);
//     }

//     if (period > periodQty) {
//       periodQty = period;
//     }

//     if (!list[itemName]) {
//       list[itemName] = {
//         itemName,
//         list: {},
//       };
//     }

//     list[itemName].list[`${period}`] = {
//       id: id,
//       key: id,
//       itemName,
//       period,
//       detailedAmount: String(item.detailedAmount),
//     };

//     //
//   });

//   const periodArr = Array.from({ length: periodQty }, (_, i) => String(i + 1));

//   return {
//     periodQty,
//     periodArr,
//     itemNameArr,
//     sortedDeductionList: list,
//   };
// };

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
