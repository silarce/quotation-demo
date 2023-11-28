import { useState, useEffect, CSSProperties, Fragment, useMemo } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Decimal from 'decimal.js';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import InputSel, { TinputSelProps, TcheckboxProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import TwoButtonModal_free, { TwoBtnFooter } from 'components/global/gear/modal/simpleModal/twoButtonModal_free';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  TcreateAccountReceivableInvoiceDto,
  TaccountsReceivableInvoiceDto,
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
  apiPostAccountReceivableIncoice,
  useGetAccountReceivableProductPayments,
} from 'js/api/api_engineering';
import { TquotationProductDto, useGetContract_id_noItems } from 'js/api/api_quotation';
import { TaccountantDto } from 'js/api/api_accountant';
import { TaccountsReceivableDeductionDto } from 'js/api/dtoTypes';

// utils
import { convertDate_add1911, getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import { IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './table_request.module.scss';

// =================================================
export default function Table_request({
  contractId,
  accountReceivableId,
  invoiceArr,
  onInvoiceAdd,
}: {
  contractId: string | undefined;
  accountReceivableId: string | undefined;
  invoiceArr: TaccountsReceivableInvoiceDto[] | undefined;
  onInvoiceAdd?: (invoice: TaccountsReceivableInvoiceDto) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState<boolean>(false);

  // console.log('invoiceArr', invoiceArr);

  // ---------------------------------------------------------

  const { data: data_finalProduct, update: update_finalProduct } = useGetFinalProduct(contractId);

  const { data: data_payments, update: update_payments } = useGetAccountReceivableProductPayments(accountReceivableId);

  // const {} = useGetAccountReceivable_id();

  useEffect(() => {
    (async () => {
      const res01 = await update_finalProduct();
      // console.log('finalProduct', res01);
      // console.log('====================================');
    })();
  }, [contractId]);

  useEffect(() => {
    (async () => {
      const res02 = await update_payments();
      // console.log('payments', res02);
      // console.log('====================================');
    })();
  }, [accountReceivableId]);

  // console.log(invoiceArr);

  // ---------------------------------------------------------

  const { peroidList, invoiceList } = useMemo(() => {
    // console.log(invoiceArr);

    const peroidList: TperoidList = {};
    const invoiceList: Tcontrol['invoiceList'] = {};

    invoiceArr?.forEach((invoice) => {
      const { period, invoiceStatus, invoiceDate, invoiceNumber } = invoice;

      if (invoiceStatus === '已作廢') {
        return;
      }

      if (period) {
        peroidList[period] = {
          period: String(period),
          onDeleteClick: () => {
            alert('test');
          },
        };
        invoiceList[period] = {
          period: String(period),
          date: getTaiwanDateStr(invoiceDate) ?? '',
          invoiceNumber,
        };
      }
    });

    return {
      peroidList,
      invoiceList,
    };
  }, [invoiceArr]);

  const { firstContractRow, appendContractRow, appendContractRowQty, totalRow01 } = useMemo(() => {
    // console.log(data_finalProduct);
    const periodArr = Object.keys(peroidList);

    const { finalRootContractProduct, finalAppendContractProducts } = data_finalProduct ?? {};

    const firstContractRow: Trow[] = (finalRootContractProduct ?? []).map((item) => {
      const { itemName, fullWidth, height, boxB, unitPrice, totalPrice, deliveryStatus } = item;

      const periodList: Trow['periodList'] = {};

      periodArr.forEach((period) => {
        periodList[period] = (deliveryStatus ?? []).map((item) => {
          return {
            completeItem: item.itemName ?? '',
            percentage: {
              value: '0',
              onClick: () => {},
            },
            completePrice: 1,
          };
        });

        if (periodList[period].length === 0) {
          periodList[period].push({
            completeItem: '',
            percentage: {
              value: '0',
              onClick: () => {},
            },
            completePrice: 1,
          });
        }
      });

      return {
        left: {
          itemName,
          fullWidth: String(fullWidth),
          height: String(height),
          boxB: String(boxB),
          qty: '1',
          unitPrice: unitPrice,
          totalPrice: totalPrice,
        },
        periodList,
      };
    });

    const appendContractRow: Trow[] = (finalAppendContractProducts ?? []).map((item) => {
      const { itemName, fullWidth, height, boxB, unitPrice, totalPrice, deliveryStatus } = item;

      const periodList: Trow['periodList'] = {};

      periodArr.forEach((period) => {
        periodList[period] = (deliveryStatus ?? []).map((item) => {
          return {
            completeItem: item.itemName ?? '',
            percentage: {
              value: '0',
              onClick: () => {},
            },
            completePrice: 1,
          };
        });

        if (periodList[period].length === 0) {
          periodList[period].push({
            completeItem: '',
            percentage: {
              value: '0',
              onClick: () => {},
            },
            completePrice: 1,
          });
        }
      });

      return {
        left: {
          itemName,
          fullWidth: String(fullWidth),
          height: String(height),
          boxB: String(boxB),
          qty: '1',
          unitPrice: unitPrice,
          totalPrice: totalPrice,
        },
        periodList,
      };
    });

    const appendContractRowQty = appendContractRow.length;

    const totalRow01 = (() => {
      let unitPriceTotal = 0;
      let unitPriceTax = 0;
      let unitPriceSubTotal = 0;

      let totalPriceTotal = 0;
      let totalPriceTotalTax = 0;
      let totalPriceTotalSubTotal = 0;

      const periodList: TtotalRow['periodList'] = {};

      firstContractRow.forEach((item) => {
        const { unitPrice, totalPrice } = item.left;
        unitPriceTotal += Number(unitPrice);
        unitPriceTax = Number(new Decimal(unitPriceTotal).mul(0.05).toFixed(0));
        unitPriceSubTotal = new Decimal(unitPriceTotal).add(unitPriceTax).toNumber();

        totalPriceTotal += Number(totalPrice);
        totalPriceTotalTax = Number(new Decimal(totalPriceTotal).mul(0.05).toFixed(0));
        totalPriceTotalSubTotal = new Decimal(totalPriceTotal).add(totalPriceTotalTax).toNumber();

        const { periodList: itemPeriodList } = item;
        Object.keys(itemPeriodList).forEach((key) => {
          const item = itemPeriodList[key];

          if (!periodList[key]) {
            periodList[key] = {
              period: key,
              completePrice: 0,
              tax: 0,
              totalWithTax: 0,
            };
          }

          item.forEach((item) => {
            periodList[key].completePrice += Number(item.completePrice);
            // periodList[key].tax += new Decimal(item.completePrice).mul(0.05).toNumber();
            periodList[key].tax += Number(new Decimal(item.completePrice).mul(0.05).toFixed(0));
            periodList[key].totalWithTax += new Decimal(item.completePrice).add(periodList[key].tax).toNumber();
          });
        });
        //
      });

      appendContractRow.forEach((item) => {
        const { unitPrice, totalPrice } = item.left;
        unitPriceTotal += Number(unitPrice);
        totalPriceTotal += Number(totalPrice);

        const { periodList: itemPeriodList } = item;
        Object.keys(itemPeriodList).forEach((key) => {
          const item = itemPeriodList[key];

          if (!periodList[key]) {
            periodList[key] = {
              period: key,
              completePrice: 0,
              tax: 0,
              totalWithTax: 0,
            };
          }

          item.forEach((item) => {
            periodList[key].completePrice += Number(item.completePrice);
            periodList[key].tax += Number(new Decimal(item.completePrice).mul(0.05).toFixed(0));
            periodList[key].totalWithTax += new Decimal(item.completePrice).add(periodList[key].tax).toNumber();
          });
        });

        //
      });

      return {
        left: {
          unitPrice: unitPriceTotal,
          unitPriceTax,
          unitPriceSubTotal,
          totalPrice: totalPriceTotal,
          totalPriceTotalTax: totalPriceTotalTax,
          totalPriceTotalSubTotal: totalPriceTotalSubTotal,
        },
        periodList,
      };

      //
    })();

    return { firstContractRow, appendContractRow, appendContractRowQty, totalRow01 };
  }, [peroidList]);

  // console.log(peroidList);

  // ---------------------------------------------------------

  /**新增發票 */
  const reqPostAccountReceivableIncoice = async (body: TcreateAccountReceivableInvoiceDto) => {
    if (!accountReceivableId || isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiPostAccountReceivableIncoice(accountReceivableId, body);
      setShowAddInvoiceModal(false);
      onInvoiceAdd?.(res);
    } catch (error) {
      const err = error as Error;
      myAlert.err({
        title: '新增發票失敗',
        content: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------
  const control: Tcontrol = {
    onAddClick: () => {
      setShowAddInvoiceModal(true);
    },
    periodList: peroidList,
    // firstContractRow: fakeFirstRow,
    firstContractRow: firstContractRow,
    // appendContractRow: fakeFirstRow,
    appendContractRow: appendContractRow,
    // appendContractRowQty: '99999',
    appendContractRowQty: String(appendContractRowQty),
    // totalRow01: fakeTotalRow,
    totalRow01: totalRow01,
    // totalRow02: fakeTotalRow,
    // totalRow03: fakeTotalRow,
    // invoiceList: fakeInvoiceList,
    invoiceList: invoiceList,
  };

  // ---------------------------------------------------------
  return (
    <>
      <View control={control} />
      {/*  */}
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
          onSubmit={async (e) => {
            e.preventDefault();
            const target = e.target as HTMLFormElement;
            const invoiceDate = (target[0] as HTMLInputElement).value;
            const invoiceNumber = (target[1] as HTMLInputElement).value;
            const price = Number((target[2] as HTMLInputElement).value);
            const note = (target[3] as HTMLInputElement).value;

            reqPostAccountReceivableIncoice({
              invoiceDate: convertDate_add1911(invoiceDate),
              invoiceNumber,
              price,
              note,
            });
          }}
        >
          <div className={scss.addInvoiceModal}>
            <label>
              <InputSel caption="發票日期" datePickerProps={{}} showBaseline="invisible" />
            </label>
            <label>
              <InputSel caption="發票號碼" inputProps={{}} showBaseline="invisible" />
            </label>
            <label>
              <InputSel caption="發票金額" inputProps={{ props: { type: 'number' } }} showBaseline="invisible" />
            </label>
            <label>
              <InputSel caption="發票備註" inputProps={{}} showBaseline="invisible" />
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
    </>
  );
}

// =================================================

// row要固定高

type Trow = {
  left: {
    itemName: string;
    fullWidth: string;
    height: string;
    boxB: string;
    qty: string;
    unitPrice: number;
    totalPrice: number;
  };
  periodList: {
    [key: string]: {
      completeItem: string;
      percentage: {
        value: string;
        onClick: () => void;
      };
      completePrice: number;
    }[];
  };
};

type TtotalRow = {
  left?: {
    unitPrice: number;
    unitPriceTax: number;
    unitPriceSubTotal: number;

    totalPrice: number;
    totalPriceTotalTax: number;
    totalPriceTotalSubTotal: number;
  };
  periodList: {
    [key: string]: {
      period: string;
      // completePrice: string;
      completePrice: number;
      tax: number;
      totalWithTax: number;
    };
  };
};

type TperoidList = {
  [key: string]: {
    period: string;
    onDeleteClick: () => void;
  };
};

type Tcontrol = {
  onAddClick: () => void;

  periodList: TperoidList;

  firstContractRow: Trow[];
  appendContractRow: Trow[];
  appendContractRowQty: string;

  totalRow01: TtotalRow;
  // totalRow02: TtotalRow;
  // totalRow03: TtotalRow;

  invoiceList: {
    [key: string]: {
      period: string;
      date: string;
      invoiceNumber: string;
    };
  };
};

const View = ({ control }: { control: Tcontrol }) => {
  const {
    //
    onAddClick,
    periodList,
    firstContractRow,
    appendContractRow,
    appendContractRowQty,
    totalRow01,
    // totalRow02,
    // totalRow03,
    invoiceList,
  } = control;

  return (
    <div className={scss.container}>
      <div className={scss.wrapper}>
        <div className={scss.top}>
          <div>
            <span>請款單</span>
          </div>
          <div>
            <MyButton_v2 label="新增發票、期數" preImg="add" onClick={onAddClick} />
          </div>
        </div>
        {/*  */}
        <div className={scss.main}>
          {/* thead */}
          <div className={classNames(scss.row, scss.thead)}>
            <div className={scss.left}>
              {leftKeyArr.map((key, index) => {
                const { label, style } = config[key];

                return (
                  <div key={index} style={style} className={scss.cell}>
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
            <div className={scss.right}>
              {Object.values(periodList).map((item, index) => {
                const { period, onDeleteClick } = item;

                const { completeItem, percentage, completePrice, deleteIcon } = config;

                return (
                  <Fragment key={index}>
                    <div className={scss.periodGroup}>
                      <div className={classNames(scss.cell)} style={completeItem.style}>
                        <span>{`第${period}期`}</span>
                        <span>{completeItem.label}</span>
                      </div>
                      <div className={classNames(scss.cell)} style={percentage.style}>
                        <span>{percentage.label}</span>
                      </div>
                      <div className={classNames(scss.cell)} style={completePrice.style}>
                        <span>{`第${period}期`}</span>
                        <span>{completePrice.label}</span>
                      </div>
                      <div className={classNames(scss.cell)} style={deleteIcon.style}>
                        <IconDelete01 onClick={onDeleteClick} />
                      </div>
                    </div>
                    <div className={scss.pilar} />
                  </Fragment>
                );
              })}
            </div>
          </div>
          {/* firstContract */}
          {firstContractRow.map((item, index) => {
            const { left, periodList } = item;

            return (
              <div key={index} className={classNames(scss.row)}>
                <div className={scss.left}>
                  {leftKeyArr.map((key, lIndex) => {
                    const { style } = config[key];
                    const value = left[key];

                    return (
                      <div key={lIndex} style={style} className={classNames(scss.cell)}>
                        <span>{value}</span>
                      </div>
                    );
                  })}
                </div>
                <div className={scss.right}>
                  {Object.values(periodList).map((itemArr, rIndex) => {
                    return (
                      <Fragment key={rIndex}>
                        <div className={scss.periodGroup}>
                          {itemArr.map((item, cindex) => {
                            const { completeItem, percentage, completePrice } = item;

                            return (
                              <Fragment key={cindex}>
                                <div className={classNames(scss.cell)} style={config.completeItem.style}>
                                  <span>{completeItem}</span>
                                </div>
                                <div
                                  className={classNames(scss.cell)}
                                  style={config.percentage.style}
                                  onClick={percentage.onClick}
                                >
                                  <span>{percentage.value}</span>
                                </div>
                                <div className={classNames(scss.cell)} style={config.completePrice.style}>
                                  <span>{completePrice}</span>
                                </div>
                                <div className={classNames(scss.cell)} style={config.deleteIcon.style}></div>
                              </Fragment>
                            );
                          })}
                        </div>
                        <div className={scss.pilar}></div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {/* 追加款項 */}
          <div className={classNames(scss.row, scss.thead)}>
            <div className={scss.left}>
              {leftKeyArr.map((key, lIndex) => {
                const { label, style } = config[key];

                return (
                  <div key={lIndex} style={style} className={scss.cell}>
                    {lIndex === 0 && <span className={'whitespace-nowrap'}>追加款項：{appendContractRowQty}</span>}
                  </div>
                );
              })}
            </div>
            <div className={classNames(scss.right, 'w-full')}></div>
          </div>
          {/* appendContractRow */}
          {appendContractRow.map((item, index) => {
            const { left, periodList } = item;

            return (
              <div key={index} className={classNames(scss.row)}>
                <div className={scss.left}>
                  {leftKeyArr.map((key, index) => {
                    const { style } = config[key];
                    const value = left[key];

                    return (
                      <div key={index} style={style} className={classNames(scss.cell)}>
                        <span>{value}</span>
                      </div>
                    );
                  })}
                </div>
                <div className={scss.right}>
                  {Object.values(periodList).map((itemArr, index) => {
                    return (
                      <Fragment key={index}>
                        <div className={scss.periodGroup}>
                          {itemArr.map((item, cindex) => {
                            const { completeItem, percentage, completePrice } = item;

                            return (
                              <Fragment key={cindex}>
                                <div className={classNames(scss.cell)} style={config.completeItem.style}>
                                  <span>{completeItem}</span>
                                </div>
                                <div
                                  className={classNames(scss.cell)}
                                  style={config.percentage.style}
                                  onClick={percentage.onClick}
                                >
                                  <span>{percentage.value}</span>
                                </div>
                                <div className={classNames(scss.cell)} style={config.completePrice.style}>
                                  <span>{completePrice}</span>
                                </div>
                                <div className={classNames(scss.cell)} style={config.deleteIcon.style}></div>
                              </Fragment>
                            );
                          })}
                        </div>
                        <div className={scss.pilar}></div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {/* totalRow01 */}
          <div className={classNames(scss.row, scss.totalRow, scss.firstTotalRow)}>
            <div className={scss.left}>
              <div style={config.itemName.style} className={classNames(scss.cell, scss.title)}>
                <span>{'合計'}</span>
              </div>
              <div style={config.fullWidth.style} className={classNames(scss.cell)} />
              <div style={config.height.style} className={classNames(scss.cell)} />
              <div style={config.boxB.style} className={classNames(scss.cell)} />
              <div style={config.qty.style} className={classNames(scss.cell)} />
              <div style={config.unitPrice.style} className={classNames(scss.cell)}>
                <span>{totalRow01.left?.unitPrice}</span>
              </div>
              <div style={config.totalPrice.style} className={classNames(scss.cell)}>
                <span>{totalRow01.left?.totalPrice}</span>
              </div>
            </div>
            {/* right */}
            <div className={scss.right}>
              {Object.values(totalRow01.periodList).map((item, index) => {
                return (
                  <Fragment key={index}>
                    <div className={scss.periodGroup}>
                      <div className={classNames(scss.cell)} style={config.completeItem.style}></div>
                      <div className={classNames(scss.cell)} style={config.percentage.style}>
                        <span>{`第${item.period}期合計`}</span>
                      </div>
                      <div className={classNames(scss.cell)} style={config.completePrice.style}>
                        <span>{item.completePrice}</span>
                      </div>
                      <div className={classNames(scss.cell)} style={config.deleteIcon.style}></div>
                    </div>
                    <div className={scss.pilar}></div>
                  </Fragment>
                );
              })}
            </div>
          </div>
          {/* totalRow02 */}
          <div className={classNames(scss.row, scss.totalRow)}>
            <div className={scss.left}>
              <div style={config.itemName.style} className={classNames(scss.cell, scss.title)}>
                <span>{'營業稅'}</span>
              </div>
              <div style={config.fullWidth.style} className={classNames(scss.cell)} />
              <div style={config.height.style} className={classNames(scss.cell)} />
              <div style={config.boxB.style} className={classNames(scss.cell)} />
              <div style={config.qty.style} className={classNames(scss.cell)} />
              <div style={config.unitPrice.style} className={classNames(scss.cell)}>
                <span>{totalRow01.left?.unitPriceTax}</span>
              </div>
              <div style={config.totalPrice.style} className={classNames(scss.cell)}>
                <span>{totalRow01.left?.totalPriceTotalTax}</span>
              </div>
            </div>
            {/* right */}
            <div className={scss.right}>
              {Object.values(totalRow01.periodList).map((item, index) => {
                return (
                  <Fragment key={index}>
                    <div className={scss.periodGroup}>
                      <div className={classNames(scss.cell)} style={config.completeItem.style}></div>
                      <div className={classNames(scss.cell)} style={config.percentage.style}>
                        <span>{`第${item.period}期合計`}</span>
                      </div>
                      <div className={classNames(scss.cell)} style={config.completePrice.style}>
                        <span>{item.tax}</span>
                      </div>
                      <div className={classNames(scss.cell)} style={config.deleteIcon.style}></div>
                    </div>
                    <div className={scss.pilar}></div>
                  </Fragment>
                );
              })}
            </div>
          </div>
          {/* totalRow3 */}
          <div className={classNames(scss.row, scss.totalRow)}>
            <div className={scss.left}>
              <div style={config.itemName.style} className={classNames(scss.cell, scss.title)}></div>
              <div style={config.fullWidth.style} className={classNames(scss.cell)} />
              <div style={config.height.style} className={classNames(scss.cell)} />
              <div style={config.boxB.style} className={classNames(scss.cell)} />
              <div style={config.qty.style} className={classNames(scss.cell)} />
              <div style={config.unitPrice.style} className={classNames(scss.cell)}>
                <span>{totalRow01.left?.unitPriceSubTotal}</span>
              </div>
              <div style={config.totalPrice.style} className={classNames(scss.cell)}>
                <span>{totalRow01.left?.totalPriceTotalSubTotal}</span>
              </div>
            </div>
            {/* right */}
            <div className={scss.right}>
              {Object.values(totalRow01.periodList).map((item, index) => {
                return (
                  <Fragment key={index}>
                    <div className={scss.periodGroup}>
                      <div className={classNames(scss.cell)} style={config.completeItem.style}></div>
                      <div className={classNames(scss.cell)} style={config.percentage.style}>
                        <span>{`第${item.period}期合計`}</span>
                      </div>
                      <div className={classNames(scss.cell)} style={config.completePrice.style}>
                        <span>{item.totalWithTax}</span>
                      </div>
                      <div className={classNames(scss.cell)} style={config.deleteIcon.style}></div>
                    </div>
                    <div className={scss.pilar}></div>
                  </Fragment>
                );
              })}
            </div>
          </div>
          {/* 發票 invoiceList */}
          {/* invoiceList */}
          <div className={scss.row}>
            <div className={scss.left}>
              {leftKeyArr.map((key, index) => {
                const { style } = config[key];

                return <div key={index} style={style} className={scss.cell}></div>;
              })}
            </div>

            <div className={scss.right}>
              {Object.values(invoiceList).map((item, index) => {
                const { period, date, invoiceNumber } = item;

                return (
                  <Fragment key={index}>
                    <div className={scss.invoiceCell}>
                      <div>
                        <p>{`第${period}期`}</p>
                        <p>發票日期/發票號碼</p>
                      </div>
                      <div>
                        <p>{date}</p>
                        <p>{invoiceNumber}</p>
                      </div>
                    </div>
                    <div className={scss.pilar} />
                  </Fragment>
                );
              })}
            </div>
          </div>

          {/* main close */}
        </div>
        {/*  */}
      </div>
    </div>
  );
};

// =====================================================================
// =====================================================================
// =====================================================================
// =====================================================================

const leftKeyArr: (keyof Trow['left'])[] = [
  //
  'itemName',
  'fullWidth',
  'height',
  'boxB',
  'qty',
  'unitPrice',
  'totalPrice',
];

type Tconfig = {
  [key: string]: {
    label: string;
    style: CSSProperties;
  };
};

const config: Tconfig = {
  itemName: {
    label: '項目',
    style: { width: '80px' },
  },
  fullWidth: {
    label: '實L',
    style: { width: '60px' },
  },
  height: {
    label: '實H',
    style: { width: '60px' },
  },
  boxB: {
    label: '實B',
    style: { width: '60px' },
  },
  qty: {
    label: '實作數量',
    style: { width: '43px' },
  },
  unitPrice: {
    label: '合約單價',
    style: { width: '75px' },
  },
  totalPrice: {
    label: '合約金額',
    style: { width: '75px' },
  },
  completeItem: {
    label: '完成項目',
    style: { width: '100px' },
  },
  percentage: {
    label: '百分比',
    style: { width: '70px' },
  },
  completePrice: {
    label: '完成金額',
    style: { width: '100px' },
  },
  deleteIcon: {
    label: '',
    style: { width: '20px' },
  },
};

// =============================================================

// const fakeperiodList = {
//   '1': {
//     period: '1',
//     onDeleteClick: () => {
//       alert('test');
//     },
//   },
//   '2': {
//     period: '2',
//     onDeleteClick: () => {
//       alert('test');
//     },
//   },
//   '3': {
//     period: '3s',
//     onDeleteClick: () => {
//       alert('test');
//     },
//   },
// };

// const fakeFirstRow: Trow[] = [
//   {
//     left: {
//       itemName: 'string',
//       fullWidth: 'string',
//       height: 'string',
//       boxB: 'string',
//       qty: 'string',
//       unitPrice: 'string',
//       totalPrice: 'string',
//     },
//     periodList: {
//       '1': [
//         {
//           completeItem: 'foo',
//           percentage: {
//             value: 'foo',
//             onClick: () => alert('test'),
//           },
//           completePrice: 'foo',
//         },
//         // {
//         //   completeItem: 'foo',
//         //   percentage: {
//         //     value: 'foo',
//         //     onClick: () => alert('test'),
//         //   },
//         //   completePrice: 'foo',
//         // },
//       ],
//       '2': [
//         {
//           completeItem: 'foo',
//           percentage: {
//             value: 'foo',
//             onClick: () => alert('test'),
//           },
//           completePrice: 'foo',
//         },
//         {
//           completeItem: 'foo',
//           percentage: {
//             value: 'foo',
//             onClick: () => alert('test'),
//           },
//           completePrice: 'foo',
//         },
//       ],
//     },
//   },
// ];

// const fakeTotalRow: TtotalRow = {
//   left: {
//     unitPrice: 9999,
//     totalPrice: 9999,
//   },
//   periodList: {
//     '1': {
//       period: '1',
//       completePrice: 9999,
//     },
//     '2': {
//       period: '2',
//       completePrice: 9999,
//     },
//     '3': {
//       period: '3',
//       completePrice: 9999,
//     },
//   },
// };

// const fakeInvoiceList = {
//   '1': {
//     period: '1',
//     date: 'string',
//     invoiceNumber: 'string',
//   },
//   '2': {
//     period: '2',
//     date: 'string',
//     invoiceNumber: 'string',
//   },
//   '3': {
//     period: '3',
//     date: 'string',
//     invoiceNumber: 'string',
//   },
// };
