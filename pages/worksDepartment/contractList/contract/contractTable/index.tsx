import { useState, useEffect, useMemo, Fragment } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// gear
import Row, { Cell } from 'components/global/gear/table/row';

// api
import { useGetEngineeringContact } from 'js/api/api_engineering';
import { useGetContract_id } from 'js/api/api_quotation';

// type
import { Tcurrency, TerpFeatureDto, TquotationProductDto, TquotationContractDto } from 'js/api/dtoTypes';

// css
import scss from './index.module.scss';

import { cutCurrency } from 'js/utils/currency/cutCurrency';

// globalState
import { useUrlHistory } from 'hooks/globalState/useUrlHistory';

// ========================================================================

interface Tproduct {
  quotationNumber: string;
  itemName: string;
  size: string;
  version: number;

  rootContract: {
    qty: string;
    unitPrice: string;
    totalPrice: string;
  };

  remain: {
    quantity: string;
    totalPrice: string;
  };

  restVersion: {
    quantity: string;
    totalPrice: string;
  }[];

  version1: {
    quotationNumber: React.ReactNode;
    itemName: React.ReactNode;
    size: React.ReactNode;
    qty: React.ReactNode;
    unitPrice: React.ReactNode;
    totalPrice: React.ReactNode;
  };

  addVersion: (arg: { index: number; remainQty: number; remainTotalPrice: number }) => unknown;
}

interface TproductDict {
  [productId: string]: Tproduct;
}

interface TversionSummary {
  tuneTotal: string;
  subTotal: string;
  salesTax: string;
  total: string;
  foreignTotal: string;
}

// ========================================================================
export default function ContracTable({
  isAdmin,
  userErpFeature,
}: {
  isAdmin: boolean;
  userErpFeature: TerpFeatureDto[] | undefined;
}) {
  const history_contractList = useUrlHistory((state) => state.contractList);

  const havePermissionToSee = useMemo(() => {
    if (isAdmin) {
      return true;
    }

    const isHave = userErpFeature?.some((item) => {
      return item.name === '應收帳款';
    });

    return !!isHave;
  }, [userErpFeature]);

  // -------------------------------------------------------------
  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id(contractId, {
    customPopulate: ['subContracts.content.products.rootProdductId'],
  });
  const engineeringContactId = contract?.engineeringContactId;

  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  useEffect(() => {
    if (!havePermissionToSee) {
      return;
    }

    (async () => {
      setIsLoading(true);

      if (!contract) {
        await update_contract();
      }

      await update_engineeringContact();
      setIsLoading(false);
    })();
  }, [contractId, engineeringContactId]);

  // -------------------------------------------------------------

  // -------------------------------------------------------------
  // -------------------------------------------------------------

  // FIXME
  // 追加的rootProductId不等於id，與後端告知的規則不符
  // 導致後續的處理錯誤，待修正在將以下的註解解除
  // const {
  //   productDict,
  //   productArr = [],
  //   versionCount_withoutFirst = 0,
  //   version1Summary,
  //   versionSummaryArr = [],
  //   versionSummeryTotal,
  // } = useMemo(() => {
  //   if (!contract?.subContracts) {
  //     return {};
  //   }

  //   Product.versionCount_withoutFirst = contract.subContracts.length - 1;

  //   // ___________________________________________________________

  //   let subContracts = contract.subContracts;
  //   subContracts = _.sortBy(subContracts, 'version');

  //   const productDict = initProductDict(subContracts);
  //   const productArr = Object.values(productDict);

  //   // ___________________________________________________________

  //   const versionSummaryTotal_pre = {
  //     tuneTotal: new Decimal(0),
  //     subTotal: new Decimal(0),
  //     salesTax: new Decimal(0),
  //     total: new Decimal(0),
  //     foreignTotal: new Decimal(0),
  //   };
  //   let currency_pre: Tcurrency = '' as Tcurrency;

  //   const versionSummaryArr: TversionSummary[] = subContracts.map((item) => {
  //     const { tuneTotal, subTotal, salesTax, total, foreignTotal, currency } = item.content;

  //     versionSummaryTotal_pre.tuneTotal = versionSummaryTotal_pre.tuneTotal.plus(tuneTotal || 0);
  //     versionSummaryTotal_pre.subTotal = versionSummaryTotal_pre.subTotal.plus(subTotal || 0);
  //     versionSummaryTotal_pre.salesTax = versionSummaryTotal_pre.salesTax.plus(salesTax || 0);
  //     versionSummaryTotal_pre.total = versionSummaryTotal_pre.total.plus(total || 0);
  //     versionSummaryTotal_pre.foreignTotal = versionSummaryTotal_pre.foreignTotal.plus(foreignTotal || 0);
  //     currency_pre = currency;

  //     const tuneTotal_locale = Number(tuneTotal).toLocaleString();
  //     const subTotal_locale = Number(subTotal).toLocaleString();
  //     const salesTax_locale = Number(salesTax).toLocaleString();
  //     const total_locale = Number(total).toLocaleString();
  //     const foreignTotal_locale = Number(foreignTotal).toLocaleString();

  //     return {
  //       tuneTotal: tuneTotal_locale,
  //       subTotal: subTotal_locale,
  //       salesTax: salesTax_locale,
  //       total: total_locale,
  //       foreignTotal: cutCurrency(currency) + '　' + foreignTotal_locale,
  //     };
  //   });

  //   const version1Summary: TversionSummary | undefined = versionSummaryArr.shift();

  //   const versionSummeryTotal: TversionSummary = {
  //     tuneTotal: versionSummaryTotal_pre.tuneTotal.toNumber().toLocaleString(),
  //     subTotal: versionSummaryTotal_pre.subTotal.toNumber().toLocaleString(),
  //     salesTax: versionSummaryTotal_pre.salesTax.toNumber().toLocaleString(),
  //     total: versionSummaryTotal_pre.total.toNumber().toLocaleString(),
  //     foreignTotal: cutCurrency(currency_pre) + '　' + versionSummaryTotal_pre.foreignTotal.toNumber().toLocaleString(),
  //   };

  //   // ___________________________________________________________

  //   return {
  //     productDict,
  //     productArr,
  //     versionCount_withoutFirst: Product.versionCount_withoutFirst,
  //     versionSummaryArr,
  //     version1Summary,
  //     versionSummeryTotal,
  //   };
  // }, [contract?.subContracts]);

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  return (
    <SubLayer isLoading_subLayer={isLoading}>
      <PageHeader contractNumber={engineeringContact?.contractNumber ?? ''} />

      <div className={scss.main}>
        <h1 className="text-9xl">施工中</h1>

        {/* <div className={scss.tableContainer}>
          <div className={scss.tablewrapper}>
            <div className={scss.table}>
              <Thead subContractQty={versionCount_withoutFirst} />
              <Tbody productArr={productArr} />
              <Ttotal
                version1Summary={version1Summary}
                versionSummaryArr={versionSummaryArr}
                versionSummeryTotal={versionSummeryTotal}
              />
            </div>
          </div>
        </div> */}
      </div>
    </SubLayer>
  );
}

// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================

// region COMPONENTS
//
//
//
//

// MARK:Thead
const Thead = ({ subContractQty }: { subContractQty: number }) => {
  return (
    <Row thead={true} className={scss.row}>
      {keyArr_version1.map((key) => {
        const { label, style } = config[key];

        return (
          <Cell key={key} style={style}>
            {label}
          </Cell>
        );
      })}

      {Array(subContractQty)
        .fill('')
        .map((item, index) => {
          return (
            <Fragment key={index}>
              {keyArr_restVersion.map((key) => {
                const { dynaLable, style } = config[key];

                return (
                  <Cell key={key} style={style}>
                    {dynaLable?.(index + 1)}
                  </Cell>
                );
              })}
            </Fragment>
          );
        })}

      {keyArr_remain.map((key) => {
        const { label, style } = config[key];

        return (
          <Cell key={key} style={style}>
            {label}
          </Cell>
        );
      })}
    </Row>
  );
};

// MARK:Tbody
const Tbody = ({ productArr }: { productArr: Tproduct[] }) => {
  return (
    <>
      {productArr.map((prod, index) => {
        const { version, version1, restVersion, remain } = prod;
        const theRemain = {
          remainQty: remain.quantity,
          remainTotalPrice: remain.totalPrice,
        };

        return (
          <Row key={index} className={classNames(scss.row, scss[`remainder${version % 3}`])}>
            {keyArr_version1.map((key) => {
              const { style, className } = config[key];

              return (
                <Cell key={key} style={style} className={classNames(scss.cell, className)}>
                  {version1[key]}
                </Cell>
              );
            })}

            {restVersion.map((item, index_restVersion) => {
              const foo = {
                versionQty: item.quantity,
                versionTotalPrice: item.totalPrice,
              };

              return (
                <Fragment key={item.quantity}>
                  {keyArr_restVersion.map((key) => {
                    const { style, className } = config[key];

                    return (
                      <Cell
                        //
                        key={key}
                        style={style}
                        className={classNames(scss.cell, className, scss[`remainder${(index_restVersion + 2) % 3}`])}
                      >
                        {foo[key]}
                      </Cell>
                    );
                  })}
                </Fragment>
              );
            })}

            {keyArr_remain.map((key) => {
              const { style, className } = config[key];
              const value = theRemain[key];

              return (
                <Cell key={key} style={style} className={className}>
                  {value}
                </Cell>
              );
            })}
          </Row>
        );
      })}
    </>
  );
};

// MARK:Ttotal
const Ttotal = ({
  version1Summary,
  versionSummaryArr,
  versionSummeryTotal,
}: {
  version1Summary: TversionSummary | undefined;
  versionSummaryArr: TversionSummary[];
  versionSummeryTotal: TversionSummary | undefined;
}) => {
  return (
    <Row className={scss.row}>
      {keyArr_version1.slice(0, keyArr_version1.length - 2).map((key) => {
        const { style } = config[key];

        return <Cell key={key} style={style}></Cell>;
      })}
      {/* version1Summary */}
      <Cell style={config.unitPrice.style} className={classNames(scss.cell_summary_label, scss.plus)}>
        {kerArr_summary.map((key) => {
          const { labelClassName, labelDict } = config_summary.version1Summary;
          const label = labelDict[key];

          return (
            <span key={key} className={labelClassName}>
              {label}
            </span>
          );
        })}
      </Cell>
      <Cell
        //
        style={config.totalPrice.style}
        className={classNames(scss.cell_summary_value, scss.plus)}
      >
        {kerArr_summary.map((key) => {
          const { valueClassName } = config_summary.version1Summary;
          const value = version1Summary?.[key];

          return (
            <span key={key} className={valueClassName}>
              {value}
            </span>
          );
        })}
      </Cell>
      {/* versionSummaryArr */}
      {versionSummaryArr.map((item, index) => {
        return (
          <Fragment key={index}>
            <Cell style={config.versionQty.style} className={classNames(scss.cell_summary_label, scss.plus)}>
              {kerArr_summary.map((key) => {
                const { labelClassName, labelDict } = config_summary.versionArr;
                const label = labelDict[key];

                return (
                  <span key={key} className={labelClassName}>
                    {label}
                  </span>
                );
              })}
            </Cell>
            <Cell style={config.versionTotalPrice.style} className={classNames(scss.cell_summary_value, scss.plus)}>
              {kerArr_summary.map((key) => {
                const { valueClassName } = config_summary.versionArr;
                const value = item[key];

                return (
                  <span key={key} className={valueClassName}>
                    {value}
                  </span>
                );
              })}
            </Cell>
          </Fragment>
        );
      })}

      {/* versionSummeryTotal */}
      <Cell
        //
        style={config.remainQty.style}
        className={classNames(scss.cell_summary_label, scss.plus)}
      >
        {kerArr_summary.map((key) => {
          const { labelClassName, labelDict } = config_summary.versionTotal;
          const label = labelDict[key];

          return (
            <span key={key} className={labelClassName}>
              {label}
            </span>
          );
        })}
      </Cell>
      <Cell
        //
        style={config.remainTotalPrice.style}
        className={classNames(scss.cell_summary_value, scss.plus)}
      >
        {kerArr_summary.map((key) => {
          const { valueClassName } = config_summary.versionTotal;
          const value = versionSummeryTotal?.[key];

          return (
            <span key={key} className={valueClassName}>
              {value}
            </span>
          );
        })}
      </Cell>
    </Row>
  );
};

// ===============================================================================
// ===============================================================================
// ===============================================================================

// MARK:Product
class Product implements Tproduct {
  static versionCount_withoutFirst = 0;

  //
  readonly quotationNumber: string;
  readonly itemName: string;
  readonly size: string;
  readonly rootContract;
  readonly _version;
  private _eachSubContract: (Tproduct['restVersion'][number] | undefined)[] = [];
  private _remain;
  // readonly versionCount: number;

  constructor({
    quotationNumber,
    quotationProduct,
    isRootContract = true,
    version,
  }: {
    quotationNumber: string; // 若為原合約則放''
    quotationProduct: TquotationProductDto;
    isRootContract?: boolean;
    version: number;
  }) {
    const {
      //
      id,
      itemName,
      fullWidth,
      height,
      boxB,
      quantity,
      unitPrice,
      totalPrice,
    } = quotationProduct;

    // this.versionCount = versionCount;
    this._version = version;

    this.quotationNumber = quotationNumber;
    this.itemName = itemName;

    const fullWidth_cm = new Decimal(fullWidth || 0).div(10).toString();
    const height_cm = new Decimal(height || 0).div(10).toString();
    const boxB_cm = new Decimal(boxB || 0).div(10).toString();

    this.size = `${fullWidth_cm}*${height_cm}+${boxB_cm}`;

    if (isRootContract) {
      this.rootContract = {
        qty: quantity.toString(),
        unitPrice: unitPrice.toString(),
        totalPrice: totalPrice.toString(),
      };
      this._remain = {
        quantity: quantity,
        totalPrice: totalPrice,
      };
    } else {
      this.rootContract = {
        qty: '0',
        unitPrice: unitPrice.toString(),
        totalPrice: '0',
      };
      this._remain = {
        quantity: 0,
        totalPrice: 0,
      };
    }
  } // constructor

  // -------------------------------------------------------------
  get remain() {
    return {
      quantity: this._remain.quantity.toLocaleString(),
      totalPrice: this._remain.totalPrice.toLocaleString(),
    };
  }

  get restVersion() {
    const eachSubContract = Array(Product.versionCount_withoutFirst).fill({
      quantity: '0',
      totalPrice: '0',
    });

    this._eachSubContract.forEach((item, index) => {
      if (item) {
        eachSubContract[index] = item;
      }
    });

    return eachSubContract;
  }

  get version1() {
    let { qty, unitPrice, totalPrice } = this.rootContract;
    qty = qty;
    unitPrice = Number(unitPrice || 0).toLocaleString();
    totalPrice = Number(totalPrice || 0).toLocaleString();

    return {
      quotationNumber: this.quotationNumber,
      itemName: this.itemName,
      size: this.size,
      qty,
      unitPrice,
      totalPrice,
    };
  }

  get version() {
    if (this._version === 1) {
      return -1;
    }

    return this._version;
  }

  // -------------------------------------------------------------

  addVersion({
    index,
    remainQty, //這個數量
    remainTotalPrice: remainTotalPrice,
  }: {
    index: number;
    remainQty: number;
    remainTotalPrice: number;
  }) {
    // 追加追減報價單的數量是最後剩下的數量
    // 所以要知道差額，就要與上一次的數量相減
    const diff_quantity = new Decimal(remainQty).minus(this._remain.quantity).toNumber();
    const diff_totalPrice = new Decimal(remainTotalPrice).minus(this._remain.totalPrice).toNumber();

    this._eachSubContract[index] = {
      quantity: diff_quantity.toLocaleString(),
      totalPrice: diff_totalPrice.toLocaleString(),
    };

    this._remain.quantity = remainQty;
    this._remain.totalPrice = remainTotalPrice;

    return this;
  }
} // Product

// ===============================================================================

const initProductDict = (subContractArr: TquotationContractDto[]) => {
  // subContractArr = _.sortBy(subContractArr, 'version');
  subContractArr = [...subContractArr];
  const productDict: TproductDict = {};

  // 在這裡將原合約抽出
  const rootContractProductArr = subContractArr.shift()?.content.products ?? [];

  rootContractProductArr.forEach((prod) => {
    productDict[prod.id] = new Product({
      quotationNumber: '',
      quotationProduct: prod,
      version: 1,
    });
  });

  subContractArr.forEach((subContract, index_subContract) => {
    const quotationNumber = subContract.content.quotationNumber;
    const productArr = subContract.content.products;
    const version = subContract.version;

    productArr.forEach((prod) => {
      const { id, rootProductId, attachedToProductId } = prod;
      const type = checkProd(prod);

      if (type === 'root') {
        productDict[id] = new Product({
          quotationNumber: quotationNumber,
          quotationProduct: prod,
          isRootContract: false,
          version,
        });

        productDict[id].addVersion({
          index: index_subContract,
          remainQty: prod.quantity,
          remainTotalPrice: prod.totalPrice,
        });
      }

      //
      if (type === 'exchangeAdd') {
        // 變更追加意味著有對應的追減
        // 找到另一個相同attachedToProductId的product就是追減
        // 追減的rootProductId就是根產品

        const rootProductId = productArr.find(
          (item) => item.attachedToProductId === attachedToProductId && item.id !== id
        )?.rootProductId;

        if (!rootProductId) {
          throw new Error('變更追加找不到對應的追減');
        }

        const rootProduct = productDict[rootProductId];
        rootProduct.addVersion({
          index: index_subContract,
          remainQty: prod.quantity,
          remainTotalPrice: prod.totalPrice,
        });
      }

      //
      if (type === 'exchangeSub') {
        const product = productDict[rootProductId];
        product.addVersion({
          index: index_subContract,
          remainQty: prod.quantity,
          remainTotalPrice: prod.totalPrice,
        });
      }

      if (type === 'unknown') {
        throw new Error('未知的主產品追加追減類型');
      }
    });
  });

  return productDict;
};

const checkProd = (prod: TquotationProductDto) => {
  const { id, rootProductId, attachedToProductId } = prod;

  if (!attachedToProductId && id === rootProductId) {
    return 'root'; // 追加
  }

  if (attachedToProductId && id !== rootProductId) {
    return 'exchangeSub'; // 追減
  }

  if (attachedToProductId && id === rootProductId) {
    return 'exchangeAdd'; // 變更追加
  }

  return 'unknown';
};

// ===============================================================================
// ===============================================================================
// ===============================================================================

interface Tconfig {
  [key: string]: {
    label?: string;
    dynaLable?: (str: string | number) => string;
    style?: React.CSSProperties;
    className?: string;
  };
}

interface Tconfig_summary_item {
  labelStyle?: React.CSSProperties;
  labelClassName?: string;
  valueStyle?: React.CSSProperties;
  valueClassName?: string;
  labelDict: {
    tuneTotal: string;
    subTotal: string;
    salesTax: string;
    total: string;
    foreignTotal: string;
  };
}

interface Tconfig_summary {
  version1Summary: Tconfig_summary_item;
  versionArr: Tconfig_summary_item;
  versionTotal: Tconfig_summary_item;
}

const config: Tconfig = {
  quotationNumber: {
    label: '追加追減',
    style: { width: 120 },
  },
  itemName: {
    label: '項目',
    style: { width: 80 },
  },
  size: {
    label: '尺寸 (cm)',
    style: { width: 100 },
  },
  qty: {
    label: '數量',
    style: { width: 50 },
  },
  unitPrice: {
    label: '合約單價',
    style: { width: 110, justifyContent: 'flex-end' },
    // className: classNames(scss.cell_value, scss.plus),
  },
  totalPrice: {
    label: '合約金額',
    style: { width: 110, justifyContent: 'flex-end' },
    // className: classNames(scss.cell_value, scss.plus),
  },
  versionQty: {
    dynaLable: (str) => `數量(變更${str})`,
    style: { width: 110 },
  },
  versionTotalPrice: {
    dynaLable: (str) => `金額(變更${str})`,
    style: { width: 110, justifyContent: 'flex-end' },
    // className: classNames(scss.cell_value, scss.plus),
  },
  remainQty: {
    label: '變更後數量',
    style: { width: 150 },
    className: scss.cell_remain,
  },
  remainTotalPrice: {
    label: '變更後金額',
    style: { width: 150, justifyContent: 'flex-end' },
    className: scss.cell_remain,
    // className: classNames(scss.cell_value, scss.plus),
  },
};

const config_summary: Tconfig_summary = {
  version1Summary: {
    labelClassName: scss.summaryLabel,
    valueClassName: scss.summaryValue,
    labelDict: {
      tuneTotal: '合約小計調整',
      subTotal: '合約小計',
      salesTax: '營業稅5%',
      total: '合約總計',
      foreignTotal: '合約外幣計價',
    },
  },
  versionArr: {
    labelClassName: scss.summaryLabel,
    valueClassName: scss.summaryValue,
    labelDict: {
      tuneTotal: '實作小計調整',
      subTotal: '實作小計',
      salesTax: '營業稅5%',
      total: '實作總計',
      foreignTotal: '實作外幣計價',
    },
  },
  versionTotal: {
    labelClassName: scss.summaryLabel,
    valueClassName: scss.summaryValue,
    labelDict: {
      tuneTotal: '累計小計調整',
      subTotal: '累計小計',
      salesTax: '營業稅5%',
      total: '累計總計',
      foreignTotal: '累計外幣計價',
    },
  },
};

const keyArr_version1 = ['quotationNumber', 'itemName', 'size', 'qty', 'unitPrice', 'totalPrice'] as const;
const keyArr_restVersion = ['versionQty', 'versionTotalPrice'] as const;
const keyArr_remain = ['remainQty', 'remainTotalPrice'] as const;

const kerArr_summary: (keyof Tconfig_summary_item['labelDict'])[] = [
  'tuneTotal',
  'subTotal',
  'salesTax',
  'total',
  'foreignTotal',
];
// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================
