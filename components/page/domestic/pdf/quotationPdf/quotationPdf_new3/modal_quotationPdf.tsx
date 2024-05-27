import React, { useState, useEffect, useMemo, Fragment, forwardRef, useRef } from 'react';
import moment from 'moment';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Decimal from 'decimal.js';
import ExcelJs from 'exceljs';
import classNames from 'classnames';
import Image from 'next/image';

// component
// import Header from './header';
// import Profile, { Tprofile as Ttop } from './profile';
// import Table, { TtableProdList, TtableProdListItem } from './table';
// import Table_quoteTypeSum, { TquoteTypeSumList } from './table_quoteTypeSum';
// import Total, { TmemoArr, Tsettlement } from './total';
// import Other from './other';

// global gear
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// antd
import Modal, { ModalProps } from 'antd/lib/modal/Modal';

// css
import scss from './quotationPdf.module.scss';

// type
import { TquotationContentDto } from 'js/api/api_quotation';
//
import { Class_product, Class_other } from 'hooks/quotation/useProduct';
import { Class_legacyContract } from 'hooks/quotation/legacy/useLegacyContract';

// config options
import { optionsCreator_quotationStatus } from 'js/utils/options/options';
import { doorTrackLookup } from 'js/utils/options/doorTrackOptions';
import { findGuideRailUnicode } from 'config/product/lookup';
import { companyInfo } from 'config/companyInfo';

// utils
import changeNumberMoneyToChinese from 'js/tools/numToChineseNum';

// ============================================================================

// region TYPE

type Tprod = {
  itemName: string;
  size: string;
  doorModelName: string;
  materialName: string;
  thickness: string;
  materialSurface: string;
  guideRail: string;
  horsepower: string;
  closingType: string;
  qty: string;
  unitPrice: string;
  totalPrice: string;
  notes: string;
  //
  totalPrice_num: number;
  qty_num: number;
  unitPrice_num: number;
  guideRailForExcel: string | null;
};

// const guideRailForExcel =
// doorModelName !== 'SJ-302'
//   ? ''
//   : findGuideRailUnicode({
//       isAntiTyphoon: typhoonProtection,
//       isSilencing: doorTrackSilencerStrip,
//     });

type Ttop = {
  contactPerson: string; // 聯絡人
  customerName: string; // 客戶名稱
  contactNumber: string; // 電話
  faxNumber: string; // 傳真

  quotationNumber: string; // 報價編號
  validityPeriod: string; // 報價時效
  quotationDate: string; // 報價日期

  projectName: string; // 工程名稱
  projectWholeAddress: string; // 工程地址
  //
};

type Tbottom = {
  subTotal: string; // 小計
  tax: string; // 營業稅5%
  total: string; // 總計
  total_chinese: string; // 總計(中文)

  deliveryLocation: string; // 交貨地點
  deliveryDate: string; // 交貨日期
  paymentMethods: { label: string; value: string }[]; // 付款辦法
  notesArr: string[];
  qrArr: string[];
  agentName: string;
  //
  subTotal_num: number;
  tax_num: number;
  total_num: number;
};

type Tbottom_c = Tbottom & {
  subTotal_page: string; // 小計
};

type Tdata = {
  top: Ttop; // 上
  prodArr: Tprod[]; // 中
  bottom: Tbottom; // 下
};

// ============================================================================

const paddingY = 40;
const excelRowMaxQty = 13;

// ============================================================================
// region START
export default function Modal_quotationPdf({
  //
  visible,
  onCancel,
  // data = fakeData,
  data = fakeData,
  fileName = '未命名',
}: {
  data?: Tdata;
  fileName: string;
} & ModalProps) {
  const ref_pdf = useRef<HTMLDivElement[]>([]);

  const [chunkedProdArr, setChunkedProdArr] = useState<Tprod[][]>([]);

  // --------------------------------------------------------------------------

  const handle_dlPdf = () => {
    dlPdf({ ref_pdf, fileName });
  };

  const handle_dlExcel = () => {
    dlExcel({
      fileName,
      data,
      chunkedProdArr,
    });
  };

  // --------------------------------------------------------------------------

  useEffect(() => {
    if (ref_pdf.current.length !== chunkedProdArr?.length) {
      alert('注意 請檢查是否缺頁');
    }
  }, [chunkedProdArr, ref_pdf]);

  // ===============================================================================
  // region RENDER
  return (
    <Modal visible={visible} onCancel={onCancel} width="fit-content" footer={null} closable={false}>
      <div className={scss.body}>
        <div>
          <MyButton_v2 onClick={handle_dlPdf} className="mr-5">
            下載PDF
          </MyButton_v2>
          <MyButton_v2 onClick={handle_dlExcel}>下載EXCEL</MyButton_v2>
        </div>

        {/*  */}
        <PdfTemplate data={data} getChunkedPropArr={setChunkedProdArr} />
        <br />
        {chunkedProdArr.map((prodArr, index) => {
          return (
            <Fragment key={index}>
              <PdfPage
                //
                ref={(ele) => {
                  if (ele) {
                    ref_pdf.current[index] = ele;
                  }
                }}
                data={data}
                prodArr={prodArr}
                page={index + 1}
                pageTotal={chunkedProdArr.length}
              />
              <br />
              <br />
            </Fragment>
          );
        })}
      </div>
    </Modal>
  );
}
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

// region COMPONENT
//
//
//
//

const Header = () => {
  return (
    <div className={scss.header}>
      <h1>{companyInfo.name}</h1>
      <div className={scss.contactInfo}>
        <div>
          <span>總公司工廠</span>
          <span className={scss.semi}>:</span>
          <span>{companyInfo.headOffice.wholeAddress}</span>
        </div>
        <div className={scss.phone}>
          <div>
            <span>TEL</span>
            <span className={scss.semi}>:</span>
            <span>{companyInfo.headOffice.tel2}</span>
          </div>
          <div>
            <span>FAX</span>
            <span className={scss.semi}>:</span>
            <span>{companyInfo.headOffice.fax}</span>
          </div>
        </div>
        <div>
          <span>台北分公司</span>
          <span className={scss.semi}>:</span>
          <span>{companyInfo.taipeiOffice.wholeAddress}</span>
        </div>
        <div className={scss.phone}>
          <div>
            <span>TEL</span>
            <span className={scss.semi}>:</span>
            <span>{companyInfo.taipeiOffice.tel2}</span>
          </div>
          <div>
            <span>FAX</span>
            <span className={scss.semi}>:</span>
            <span>{companyInfo.taipeiOffice.fax}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// region Top_pre

const Top_pre = (
  {
    top,
    page,
    pageTotal,
  }: //

  {
    top: Ttop;
    page: React.ReactNode;
    pageTotal: React.ReactNode;
  },
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const {
    contactPerson,
    customerName,
    contactNumber,
    faxNumber,
    quotationNumber,
    validityPeriod,
    quotationDate,
    projectName,
    projectWholeAddress,
  } = top;

  return (
    <div ref={ref}>
      <Header />
      {/*  */}
      <div className={scss.profile}>
        <h1>報 價 單</h1>
        <div className={scss.grid}>
          <div className={scss.customer}>
            <div className={scss.info}>
              <span className={scss.flexSpan}>
                <span>聯</span>
                <span>絡</span>
                <span>人</span>
              </span>
              <span className={scss.semi}>:</span>
              <span>{contactPerson}</span>
            </div>
            <div className={scss.info}>
              <span className={scss.flexSpan}>
                <span>客</span>
                <span>戶</span>
                <span>名</span>
                <span>稱</span>
              </span>
              <span className={scss.semi}>:</span>
              <span>{customerName}</span>
            </div>
            <div className={scss.info}>
              <span className={scss.flexSpan}>
                <span>電</span>
                <span>話</span>
              </span>
              <span className={scss.semi}>:</span>
              <span>{contactNumber}</span>
            </div>
            <div className={scss.info}>
              <span className={scss.flexSpan}>
                <span>傳</span>
                <span>真</span>
              </span>
              <span className={scss.semi}>:</span>
              <span>{faxNumber}</span>
            </div>
          </div>

          <div className={scss.date}>
            {/* <div className={scss.info}>
            <span>報價狀態</span>
            <span className={scss.semi}>:</span>
            <span>{quatitionStatus}</span>
          </div> */}
            <div className={scss.info}>
              <span>報價編號</span>
              <span className={scss.semi}>:</span>
              <span>{quotationNumber}</span>
            </div>
            <div className={scss.info}>
              <span>報價時效</span>
              <span className={scss.semi}>:</span>
              <span>
                {validityPeriod ?? ''}
                {!!validityPeriod && '天內'}
              </span>
            </div>
            <div className={scss.info}>
              <span>報價日期</span>
              <span className={scss.semi}>:</span>
              <span>{quotationDate}</span>
            </div>
          </div>

          <div className={scss.pageCount}>
            <div>
              <span>頁次</span>
              <span className={scss.semi}>:</span>
              <span>{`${page}/${pageTotal}`}</span>
            </div>
          </div>
        </div>

        <div className={scss.info2}>
          <span className={scss.flexSpan}>
            <span>工</span>
            <span>程</span>
            <span>名</span>
            <span>稱</span>
          </span>
          <span className={scss.semi}>:</span>
          <span>{projectName}</span>
        </div>
        <div className={scss.info2}>
          <span className={scss.flexSpan}>
            <span>工</span>
            <span>程</span>
            <span>地</span>
            <span>點</span>
          </span>
          <span className={scss.semi}>:</span>
          <span>{projectWholeAddress}</span>
        </div>
      </div>

      {/*  */}
      <div className={classNames(scss.row, scss.thead)}>
        {prodKeyArr.map((key) => {
          const { label, style, justifyContent_thead } = config[key];

          return (
            <div
              key={key}
              className={scss.cell}
              style={{
                ...style,
                justifyContent: justifyContent_thead,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------
// region Bottom_pre
const Bottom_pre = (
  {
    bottom_c,
    pageTotal,
    isLatestPage,
  }: {
    bottom_c: Tbottom_c;
    pageTotal: number | string;
    isLatestPage: boolean;
  },
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const {
    subTotal,
    tax,
    total,
    total_chinese,
    deliveryLocation,
    deliveryDate,
    paymentMethods,
    notesArr,
    qrArr,
    agentName,
    //
    subTotal_page,
  } = bottom_c;

  const paymentMethods_fillingEmpty = _.cloneDeep(paymentMethods);

  if (paymentMethods_fillingEmpty.length < 4) {
    const len = 4 - paymentMethods_fillingEmpty.length;

    for (let i = 0; i < len; i++) {
      paymentMethods_fillingEmpty.push({ label: '', value: '' });
    }
  }

  return (
    <div ref={ref}>
      {/*  */}
      <div className={scss.total}>
        <div className={scss.remark}>
          <div>
            <span>備註</span>
            <span className={scss.semi}>:</span>
          </div>
          <div>
            <ul>
              {notesArr.map((content, index) => {
                return (
                  <li key={index}>
                    {/* <span>{`(${index + 1})`}</span> */}
                    <span>{content}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div>
          <div className={scss.count}>
            <div>
              {isLatestPage && (
                <>
                  <div>
                    <span>小</span>
                    <span>計</span>
                  </div>
                  <span>{`(共 ${pageTotal} 頁)`}</span>
                </>
              )}
              {!isLatestPage && (
                <>
                  <div>
                    <span>本</span>
                    <span>頁</span>
                    <span>合</span>
                    <span>計</span>
                  </div>
                </>
              )}
            </div>
            <div>
              <span>{isLatestPage ? subTotal : subTotal_page}</span>
            </div>
            <div></div>
          </div>

          <div className={scss.count}>
            <div>
              <div>{isLatestPage && <span>營業稅5%</span>}</div>
            </div>
            <div>
              <span>{isLatestPage ? tax : '　'}</span>
            </div>
            <div></div>
          </div>

          <div className={scss.count}>
            <div>
              {isLatestPage && (
                <>
                  <div>
                    <span>總</span>
                    <span>計</span>
                  </div>
                  <span>新台幣:</span>
                  <span>{total_chinese}元整</span>
                  <span>總金額</span>
                </>
              )}
              {!isLatestPage && (
                <>
                  <div>
                    <span>　</span>
                  </div>
                  <span>　</span>
                  <span>　</span>
                  <span>　</span>
                </>
              )}
            </div>
            <div>
              <span>{isLatestPage ? total : '　'}</span>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      {/*  */}

      <div className={scss.other}>
        <div className={scss.range}>
          <h2>一、報價範圍</h2>
          <ol>
            {qrArr.map((qr, index) => {
              return <li key={index}>{qr}</li>;
            })}
          </ol>
        </div>

        <div>
          <div className={scss.address}>
            <h2>二、交貨地點 : </h2>
            <div>
              <span>{deliveryLocation ?? ''}</span>
            </div>
          </div>
          <div className={scss.date}>
            <h2>三、交貨日期 : </h2>
            <div>
              <span>{deliveryDate}</span>
            </div>
          </div>

          <div className={scss.pay}>
            <h2>四、付款辦法 : </h2>
            <ol>
              {paymentMethods_fillingEmpty.map((method, index) => {
                const { label, value } = method;

                if (!label && !value) {
                  return (
                    <li key={index} className="invisible">
                      <h2>　</h2>
                      <h2>　</h2>
                      <h2>　</h2>
                    </li>
                  );
                }

                return (
                  <li key={index}>
                    <h2>{label}</h2>
                    <h2>{value}</h2>
                    <h2>%</h2>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className={scss.handle}>
            <h2>經辦人 : {agentName}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

const Center_pre = (
  {
    prodArr,
  }: {
    prodArr: Tprod[];
  },
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return (
    <div ref={ref}>
      {prodArr.map((prod, index) => {
        return (
          <div key={index} data-component="component_row" className={classNames(scss.row)}>
            {prodKeyArr.map((key) => {
              const { style, justifyContent_tbody } = config[key];

              let node: React.ReactNode = prod[key];

              if (key === 'guideRail' && typeof node === 'string') {
                const src = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${node}`;
                node = <Image src={src} alt={node} width={30} height={30} />;
              }

              return (
                <div
                  key={key}
                  className={scss.cell}
                  style={{
                    ...style,
                    justifyContent: justifyContent_tbody,
                  }}
                >
                  {node}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// region PdfTemplate

const PdfTemplate = ({
  data,
  getChunkedPropArr,
}: {
  data: Tdata;
  getChunkedPropArr: (chunkedProdArr: Tprod[][]) => void;
}) => {
  const { top, prodArr: prodArr, bottom } = data;

  const bottome_c = {
    ...bottom,
    subTotal_page: '0',
  };

  const ref_temp = useRef<HTMLDivElement>(null);
  const ref_top = useRef<HTMLDivElement>(null);
  const ref_bottom = useRef<HTMLDivElement>(null);
  const ref_center = useRef<HTMLDivElement>(null);

  const chunkedProdArr = useMemo(() => {
    const h_pdf = ref_temp.current?.offsetHeight ?? 0;
    const h_top = ref_top.current?.offsetHeight ?? 0;
    const h_bottom = ref_bottom.current?.offsetHeight ?? 0;

    const rowCollection = ref_center.current?.querySelectorAll('[data-component="component_row"]');
    const rowArr = Array.from(rowCollection ?? []) as HTMLDivElement[];

    const chunkedProdArr: Tprod[][] = [];
    let tempArr: Tprod[] = []; // length不超過excelRowMaxQty
    let heightCount = 0;
    const allowedHeight = h_pdf - h_top - h_bottom - paddingY * 2; // 有一點誤差，應該是offsetHeight沒有算到小數的關係

    rowArr.forEach((row, index) => {
      const h = row.offsetHeight;

      if (heightCount + h >= allowedHeight || tempArr.length >= excelRowMaxQty) {
        chunkedProdArr.push(tempArr);
        tempArr = [];
        heightCount = 0;
      }

      heightCount = heightCount + h;
      tempArr.push(prodArr[index]);

      if (index + 1 === rowArr.length) {
        chunkedProdArr.push(tempArr);
      }
    });

    return chunkedProdArr;

    //
  }, [ref_temp.current, ref_top.current, ref_bottom.current, ref_center.current]);

  useEffect(() => {
    getChunkedPropArr?.(chunkedProdArr);
  }, [chunkedProdArr]);

  return (
    <div style={{ padding: `${paddingY}px 60px` }} ref={ref_temp} className={classNames(scss.pdf, scss.template)}>
      <Top ref={ref_top} top={top} page="1" pageTotal="2" />
      <Center prodArr={prodArr} ref={ref_center} />
      <Bottom ref={ref_bottom} bottom_c={bottome_c} pageTotal={1} isLatestPage={1 === 1} />
    </div>
  );
};

// region PdfPage_pre
const PdfPage_pre = (
  {
    //
    data,
    prodArr,
    page,
    pageTotal,
  }: {
    data: Tdata;
    prodArr: Tprod[];
    page: number;
    pageTotal: number;
  },
  ref_pdf: React.ForwardedRef<HTMLDivElement>
) => {
  const { top, bottom } = data;

  let subTotal = 0;
  prodArr.forEach((row) => {
    subTotal = subTotal + row.totalPrice_num;
  });

  const bottom_c: Tbottom_c = {
    ...bottom,
    subTotal_page: subTotal.toLocaleString(),
  };

  return (
    <div style={{ padding: `${paddingY}px 60px` }} ref={ref_pdf} className={scss.pdf}>
      <Top top={top} page={page} pageTotal={pageTotal} />
      <Center prodArr={prodArr} />
      <Bottom bottom_c={bottom_c} pageTotal={pageTotal} isLatestPage={page === pageTotal} />
    </div>
  );
};

// ------------------------------------------------------------------------------

const Top = forwardRef(Top_pre);
const Bottom = forwardRef(Bottom_pre);
const Center = forwardRef(Center_pre);
// const PdfTemplate = forwardRef(PdfTemplate_pre);
const PdfPage = forwardRef(PdfPage_pre);
// ==============================================================================

// region config

type TprodKeys =
  | 'itemName'
  | 'size'
  | 'doorModelName'
  | 'materialName'
  | 'thickness'
  | 'materialSurface'
  | 'guideRail'
  | 'horsepower'
  | 'closingType'
  | 'qty'
  | 'unitPrice'
  | 'totalPrice'
  | 'notes';

type TconfigItem = {
  label: string;
  style: {
    width: React.CSSProperties['width'];
    flex?: React.CSSProperties['flex'];
  };
  justifyContent_thead: React.CSSProperties['justifyContent'];
  justifyContent_tbody: React.CSSProperties['justifyContent'];
};

type Tconfig = {
  [key in TprodKeys]: TconfigItem;
};

const prodKeyArr: readonly TprodKeys[] = [
  'itemName',
  'size',
  'doorModelName',
  'materialName',
  'thickness',
  'materialSurface',
  'guideRail',
  'horsepower',
  'closingType',
  'qty',
  'unitPrice',
  'totalPrice',
  'notes',
];

const config: Tconfig = {
  itemName: {
    label: '項目',
    style: {
      width: '80px',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'left',
  },
  size: {
    label: '尺寸(單位:cm)',
    style: {
      width: '180px',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'left',
  },
  doorModelName: {
    label: '門型',
    style: {
      width: '94px',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'left',
  },
  materialName: {
    label: '材料',
    style: {
      width: '104px',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'center',
  },
  thickness: {
    label: '厚度',
    style: {
      width: '50px',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'center',
  },
  materialSurface: {
    label: '表面',
    style: {
      width: '50px',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'center',
  },
  guideRail: {
    label: '門軌',
    style: {
      width: '50px',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'center',
  },
  horsepower: {
    label: '馬力',
    style: {
      width: '75px',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'center',
  },
  closingType: {
    label: '開閉方式',
    style: {
      width: '75px',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'center',
  },
  qty: {
    label: '數量',
    style: {
      width: '60px',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'center',
  },
  unitPrice: {
    label: '單價',
    style: {
      width: 'auto',
      flex: '1 1 auto',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'right',
  },
  totalPrice: {
    label: '複價',
    style: {
      width: 'auto',
      flex: '1 1 auto',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'right',
  },
  notes: {
    label: '備註',
    style: {
      width: '80px',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'center',
  },
};

// region fakedata

const fakeTop: Ttop = {
  contactPerson: 'aaaaaa',
  customerName: 'aaaaaa',
  contactNumber: 'aaaaaa',
  faxNumber: 'aaaaaa',
  quotationNumber: 'S-9999',
  validityPeriod: '999',
  quotationDate: '99年09月09號',
  projectName: '種花工程',
  projectWholeAddress: '台中市花巷草弄20號',
};

const fakeBottom: Tbottom = {
  subTotal: '111',
  tax: 'aaaa',
  total: 'aaaa',
  total_chinese: 'ㄟㄟㄟㄟ',
  deliveryLocation: 'aaaa',
  deliveryDate: 'aaaa',
  paymentMethods: [{ label: 'aaa', value: 'aaa' }],
  notesArr: ['aaaa', 'aaaa', 'aaaa'],
  qrArr: ['aaaa', 'aaaa', 'aaaa'],
  agentName: 'aaaa',
  // subTotal_page: 'aaaa',
  //
  subTotal_num: 999,
  tax_num: 999,
  total_num: 999,
};

const fakeProd: Tprod = {
  itemName: 'aaa',
  size: 'aaa',
  doorModelName: 'aaa',
  materialName: 'aaa',
  thickness: 'aaa',
  materialSurface: 'aaa',
  guideRail: 'SJ302_30.svg',
  horsepower: 'aaa',
  closingType: 'aaa',
  qty: 'aaa',
  unitPrice: 'aaa',
  totalPrice: '111',
  notes: 'aaa',
  //
  totalPrice_num: 111,
  qty_num: 99,
  unitPrice_num: 10,
  guideRailForExcel: '\uE010',
};
const fakeProd2: Tprod = {
  itemName: 'aaaaaaaaaaaaaaaaaaa',
  size: 'aaa',
  doorModelName: 'aaa',
  materialName: 'aaa',
  thickness: 'aaa',
  materialSurface: 'aaa',
  guideRail: 'SJ302_30.svg',
  horsepower: 'aaa',
  closingType: 'aaa',
  qty: 'aaa',
  unitPrice: 'aaa',
  totalPrice: '111',
  notes: 'aaa',
  //
  totalPrice_num: 111,
  qty_num: 99,
  unitPrice_num: 10,
  guideRailForExcel: '\uE010',
};
const fakeProd3: Tprod = {
  itemName: 'aaa',
  size: 'aaa',
  doorModelName: 'aaa',
  materialName: 'aaa',
  thickness: 'aaa',
  materialSurface: 'aaa',
  guideRail: 'SJ302_30.svg',
  horsepower: 'aaa',
  closingType: 'aaa',
  qty: 'aaa',
  unitPrice: 'aaa',
  totalPrice: '111',
  notes: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  //
  totalPrice_num: 111,
  qty_num: 99,
  unitPrice_num: 10,
  guideRailForExcel: '',
};

const fakeProd_latest: Tprod = {
  itemName: 'latest',
  size: 'aaa',
  doorModelName: 'aaa',
  materialName: 'aaa',
  thickness: 'aaa',
  materialSurface: 'aaa',
  guideRail: 'SJ302_30.svg',
  horsepower: 'aaa',
  closingType: 'aaa',
  qty: 'aaa',
  unitPrice: 'aaa',
  totalPrice: '111',
  notes: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  //
  totalPrice_num: 111,
  qty_num: 99,
  unitPrice_num: 10,
  guideRailForExcel: '',
};

const fakeProdArr = [
  fakeProd,
  fakeProd2,
  fakeProd,
  fakeProd3,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd2,
  fakeProd,
  fakeProd3,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd2,
  fakeProd,
  fakeProd3,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd,
  fakeProd_latest,
];

const fakeData: Tdata = {
  top: fakeTop,
  prodArr: fakeProdArr,
  bottom: fakeBottom,
};

// ===========================================================================
// region dlPdf
const dlPdf = async ({
  ref_pdf,
  fileName,
}: {
  ref_pdf: React.MutableRefObject<HTMLDivElement[]>;
  fileName: string;
}) => {
  if (!ref_pdf.current[0]) {
    return;
  }

  showRootLoading(true, '正在處理PDF');

  const doc = new jsPDF('p', 'px', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  const pageHeight = doc.internal.pageSize.getHeight();

  let isFirst = true;
  let item;

  for (item of ref_pdf.current) {
    if (!item) {
      continue;
    }

    const image = await html2canvas(item, {
      scale: 3,
      // useCORS: true,
      // allowTaint: true,
    }).then((canvas) => {
      const image = canvas.toDataURL('image/JPEG');

      return image;
    });

    if (!isFirst) {
      doc.addPage();
    }

    isFirst = false;
    // 留作參考
    // doc.addImage(image, "JPEG", 0, 0, 595, 842);
    // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);
    doc.addImage(image, 'JPEG', 0, 0, pageWidth, pageHeight);
  }

  doc.save(`${fileName}.pdf`);
  showRootLoading(false);
};

// ===========================================================
// ===========================================================
// ===========================================================
// ===========================================================
// ===========================================================
// region dlExcel
const dlExcel = async ({
  fileName,
  chunkedProdArr,
  // prodArr,
  data,
}: {
  fileName: string;
  chunkedProdArr: Tprod[][];
  // prodArr: Tprod[];
  data: Tdata;
}) => {
  // 一頁13列產品
  const excelRowMaxQty = 13;

  // console.log(control_prodArr);

  // const {
  //   quotationDate,
  //   quotationNumber,
  //   projectName,
  //   // quotationStatus,
  //   customerName,
  //   contactPerson,
  //   contactNumber,
  //   faxNumber,
  //   allAddress,
  //   subTotal,
  //   salesTax,
  //   total,
  //   agentName,
  //   tradingDate,
  //   tradingLocation,
  //   validityPeriod,
  //   payWayArr,
  // } = control_basicInfo;

  const {
    top: {
      contactPerson,
      customerName,
      contactNumber,
      faxNumber,
      quotationNumber,
      validityPeriod,
      quotationDate,
      projectName,
      projectWholeAddress,
      //
    },
    bottom: {
      subTotal,
      tax,
      total,
      total_chinese,
      deliveryLocation,
      deliveryDate,
      paymentMethods,
      notesArr,
      qrArr,
      agentName,
      //
      subTotal_num,
      tax_num,
      total_num,
    },
    // prodArr,
  } = data;

  // const chunkProdArr = _.chunk(prodArr, excelRowMaxQty);
  const chunkProdArr = chunkedProdArr; // chunkedProdArr的陣列長度限制為excelRowMaxQty

  let qrArr_formated = _.cloneDeep(qrArr);
  qrArr_formated = qrArr_formated.map((qr, index) => {
    return `${index + 1}. ` + qr;
  });

  if (paymentMethods.length > 4) {
    paymentMethods.splice(4);
  }

  const payWayArr_formated = paymentMethods.map((payway, index) => {
    const { value, label } = payway;

    if (!value) {
      return `           ${index + 1}. ${label} ________%`;
    } else {
      return `           ${index + 1}. ${label}      ${value}     %`;
    }
  });

  // -------------------------------------------------------------------

  // -------------------------------------------------------------------
  const workbook = new ExcelJs.Workbook();
  const sheetName = quotationNumber;
  const sheet = workbook.addWorksheet(sheetName, {
    pageSetup: {
      paperSize: 9, // A4 paper size
      orientation: 'portrait', // page orientation
      // showGridLines: true,
      // fitToPage: true, // fit to page
      // fitToWidth: 1, // fit to one page wide
      // fitToHeight: 0, // auto height
    },
  });

  // const worksheetWriter = workbookWriter.addWorksheet('sheet', {
  //   pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
  // });

  // 之后调整页面设置配置
  sheet.pageSetup.margins = {
    left: 0.2,
    right: 0.2,
    top: 0.2,
    bottom: 0.2,
    header: 0.3,
    footer: 0.3,
  };

  // 打開excel右下方的視圖模式 設為"頁面配置"
  // 欄寬的單位就會是cm
  // 0.1"大約"等於0.02cm
  // 會有怎麼樣都無法調整到想要的公分值的情況

  // 調整欄寬時建議視圖模式不要用"標準"
  // 怪怪的

  // 這個放到最後再調整
  sheet.columns = [
    { width: 1 }, // A // 0.56
    { width: 7.6 }, // B // 6.33
    { width: 14.25 }, // C // 12.33
    // { width: 10.9 }, // D // 9.33
    // { width: 6.7 }, // E // 5.33
    { width: 8.9 }, // D // 8.14
    { width: 8.7 }, // E // 8
    { width: 6.1 }, // F // 4.89
    { width: 6.1 }, // G // 4.89
    { width: 6.1 }, // H // 4.89
    { width: 6.1 }, // I // 4.89
    { width: 7.6 }, // J // 6.33
    { width: 4.4 }, // K // 3.33
    { width: 2.9 }, // L // 1.89
    { width: 9.7 }, // M // 8.33
    { width: 11.5 }, // N // 9.89
    { width: 6.2 }, // O // 4.89
    { width: 0.65 }, // P // 0.38
  ];

  sheet.columns.forEach((item) => (item.font = { size: 11 }));

  //
  // 公司有些電腦的excel是2010版本
  // 在2010版本，同樣的height，呈現的列高不一樣
  // 所以要用這個方式來調整列高
  // const rowHeightAdjust = 1.25;
  const rowHeightAdjust = 1.05;

  // const rowHeight_pageDeparate = 20 * rowHeightAdjust;
  const rowHeight_pageDeparate = 15.8 * rowHeightAdjust;
  const rowHeight_companyName = 30 * rowHeightAdjust;
  const rowHeight_companyInfo = 15 * rowHeightAdjust;
  const rowHeight_hr = 5 * rowHeightAdjust;
  // const rowHeight_title = 30 * rowHeightAdjust;
  const rowHeight_title = 25 * rowHeightAdjust;
  const rowHeight_thead = 24.9 * rowHeightAdjust;
  const rowHeight_tbody = 20 * rowHeightAdjust;
  // const rowHeight_tbody = 19.9 * rowHeightAdjust;
  // const rowHeight_tbody = 16 * rowHeightAdjust;
  const rowHeight_notes = 14.1 * rowHeightAdjust;
  const rowHeight_total = 20.1 * rowHeightAdjust;

  // const rowHeight_otherFirstRow = 20.1 * rowHeightAdjust;
  const rowHeight_otherFirstRow = 18 * rowHeightAdjust;
  const rowHeight_other_beforePayWay = 13.5 * rowHeightAdjust;
  const rowHeight_other_payWay = 18 * rowHeightAdjust;
  const rowHeight_other_afterPayWay = 9.9 * rowHeightAdjust;
  const rowHeight_other_agent = 15 * rowHeightAdjust;

  // -----------------------------------------------------------

  // -----------------------------------------------------------

  //
  chunkProdArr.forEach((prodArr, index) => {
    const page = index + 1;

    const totalRowPerPage = 50;
    const notesRowQty = 10;
    const quotaionRangeRowQty = 12;

    const beginRow = index * totalRowPerPage;

    const letterArr = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

    //
    const r1 = beginRow + 1;
    const r2 = beginRow + 2;
    const r3 = beginRow + 3;
    const r4 = beginRow + 4;
    const r5 = beginRow + 5;
    const r6 = beginRow + 6;
    const r7 = beginRow + 7;
    const r8 = beginRow + 8;
    const r9 = beginRow + 9;
    const r10 = beginRow + 10;
    const r11 = r10 + 1;
    // const rThead = beginRow + 11;
    const rThead = r11 + 1;
    const rTbody = rThead + 1;
    const rTbodyLatest = rTbody + excelRowMaxQty - 1;
    // const r12 = beginRow + 12;
    // const r24 = beginRow + 24;
    const rNotes = rThead + excelRowMaxQty + 1;
    const rNotesLatest = rNotes + notesRowQty - 1;
    const rSubToTal = rNotesLatest + 1;
    const rTax = rSubToTal + 1;
    const rTotal = rSubToTal + 2;
    const rOther = rTotal + 1;
    const rQuotationRange = rOther + 1;
    const rQuotationRangeLatest = rQuotationRange + quotaionRangeRowQty - 2;

    const rPayWay = rOther + 4;
    const rAgent = rPayWay + 6;

    //
    const row1 = sheet.getRow(r1);
    row1.height = rowHeight_pageDeparate;
    //____________________________________________________
    const B2O2 = sheet.getCell(`B${r2}`);
    sheet.mergeCells(`B${r2}:O${r2}`);
    B2O2.value = '三久建材工業股份有限公司';
    B2O2.alignment = { horizontal: 'center', vertical: 'top' };
    B2O2.font = { size: 16, bold: true };
    //
    const B3 = sheet.getCell(`B${r3}`);
    B3.value = '總公司工廠：台中市霧峰區峰北路666號';
    //
    const B4 = sheet.getCell(`B${r4}`);
    B4.value = '台北分公司：台北市內湖路一段387巷5號2樓之2';
    //
    const O3 = sheet.getCell(`O${r3}`);
    O3.value = 'TEL：04-24069939(七線)   FAX：04-24069909';
    O3.alignment = { horizontal: 'right' };
    //
    const O4 = sheet.getCell(`O${r4}`);
    O4.value = 'TEL：02-26581508(三線)   FAX：02-26581507';
    O4.alignment = { horizontal: 'right' };
    //

    const row2 = sheet.getRow(r2);
    row2.height = rowHeight_companyName;
    const row3 = sheet.getRow(r3);
    row3.height = rowHeight_companyInfo;
    const row4 = sheet.getRow(r4);
    row4.height = rowHeight_companyInfo;

    //
    const row5 = sheet.getRow(r5);
    row5.height = rowHeight_hr;

    sheet.getCell(`O${r5}`).border = {
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
    };

    row5.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber !== 1) {
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
        };
      }
    });

    //____________________________________________________
    const row6 = sheet.getRow(r6);
    row6.height = rowHeight_title;

    const B6O6 = sheet.getCell(`B${r6}`);
    sheet.mergeCells(`B${r6}:O${r6}`);
    B6O6.alignment = { horizontal: 'center', vertical: 'bottom' };
    B6O6.font = { size: 16, bold: true };
    B6O6.value = '報價單';

    //

    const B7 = sheet.getCell(`B${r7}`);
    B7.value = `A T T N ：${contactPerson}`;
    const B8 = sheet.getCell(`B${r8}`);
    B8.value = `客戶名稱：${customerName}`;
    const B9 = sheet.getCell(`B${r9}`);
    B9.value = `電　　話： ${contactNumber}`;
    const B10 = sheet.getCell(`B${r10}`);
    B10.value = `工程名稱：${projectName}`;
    const B11 = sheet.getCell(`B${r11}`);
    B11.value = `工程地點：${projectWholeAddress}`;

    const E9 = sheet.getCell(`E${r9}`);
    E9.value = `傳　　真：${faxNumber}`;

    const K7 = sheet.getCell(`K${r7}`);
    K7.value = `報價編號：${quotationNumber}`;
    const K8 = sheet.getCell(`K${r8}`);
    K8.value = `報價時效：${validityPeriod} 天內`;
    const K9 = sheet.getCell(`K${r9}`);
    K9.value = `報價日期：${quotationDate}`;

    const O7 = sheet.getCell(`O${r7}`);
    O7.value = `頁次:${index + 1}/${chunkProdArr.length}`;
    O7.alignment = { horizontal: 'right' };
    // O7.font = { size: 9 };
    //____________________________________________________

    const headArr = [
      //
      '項目',
      '尺寸(單位:cm)',
      '門型',
      '材料',
      '厚度',
      '表面',
      '門軌',
      '馬力',
      '開閉方式',
      '數量',
      '',
      '單價',
      '複價',
      '備註',
    ];
    headArr.forEach((head, headIndex) => {
      const letter = letterArr[headIndex];
      const cell = sheet.getCell(`${letter}${rThead}`);
      cell.value = head;

      cell.alignment = { horizontal: 'center' };

      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      };

      cell.font = { bold: true };

      if (headIndex === 0) {
        cell.border.left = { style: 'thin', color: { argb: '000000' } };
      }

      if (letter === 'J') {
        cell.font = { size: 8 };
      }

      return cell;
    });

    sheet.mergeCells(`K${rThead}:L${rThead}`);

    const rowThead = sheet.getRow(rThead);
    rowThead.height = rowHeight_thead;

    for (let i = rTbody; i <= rTbodyLatest; i++) {
      const row = sheet.getRow(i);
      row.height = rowHeight_tbody;
    }

    let pageSubTotal = 0;

    //
    prodArr.forEach((prod, prodRowIndex) => {
      prodRowIndex = prodRowIndex + 1;

      const {
        itemName,
        // size,
        doorModelName,
        // materialName,
        thickness,
        materialSurface,
        guideRail,
        horsepower,
        closingType,
        qty,
        unitPrice,
        totalPrice,
        notes,
        //
        unitPrice_num,
        totalPrice_num,
        qty_num,
        guideRailForExcel,
      } = prod;

      // const doorRailUnicode

      let { size, materialName } = prod;

      size = size.replaceAll('Ｘ', ' x ');
      size = size.replaceAll('＋', ' + ');

      if (materialName.includes('鍍鋅')) {
        materialName = '鍍鋅';
      } else if (materialName.includes('#304')) {
        materialName = 'SST304#';
      } else if (materialName.includes('#316')) {
        materialName = 'SST316#';
      } else if (
        //
        materialName.includes('SST') &&
        !materialName.includes('304') &&
        !materialName.includes('316')
      ) {
        materialName = 'SST304#';
      }
      // else if (materialName === '黑鐵') {
      //   materialName = '鍍鋅';
      // }

      // const qty_num = Number(qty.replaceAll(',', ''));
      // const unitPrice_num = Number(unitPrice.replaceAll(',', ''));
      // const priceTotal_num = Number(priceTotal.replaceAll(',', ''));

      pageSubTotal = pageSubTotal + totalPrice_num;

      const [cellB, cellC, cellD, cellE, cellF, cellG, cellH, cellI, cellJ, cellK, cellL, cellM, cellN, cellO] =
        letterArr.map((letter, letterIndex) => {
          const cell = sheet.getCell(`${letter}${rThead + prodRowIndex}`);

          cell.font = { size: 10 };
          cell.alignment = { vertical: 'top' };

          cell.border = {
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } },
          };

          if (letterIndex === 0) {
            cell.border.left = { style: 'thin', color: { argb: '000000' } };
          }

          return cell;
        });
      cellB.value = itemName;
      cellC.value = size;
      cellD.value = doorModelName;
      cellE.value = materialName;
      cellF.value = thickness;
      cellG.value = materialSurface;
      cellH.value = guideRailForExcel;
      cellI.value = horsepower;
      cellJ.value = closingType;
      cellK.value = qty_num;
      cellL.value = '樘';
      cellM.value = unitPrice_num;
      cellN.value = totalPrice_num;
      cellO.value = notes;

      const cellArr = [
        cellB,
        cellC,
        cellD,
        cellE,
        cellF,
        cellG,
        cellH,
        cellI,
        cellJ,
        cellK,
        cellL,
        cellM,
        cellN,
        cellO,
      ];

      cellArr.forEach((cell) => {
        cell.alignment.wrapText = true;
      });

      cellE.alignment.horizontal = 'center';
      cellF.alignment.horizontal = 'center';
      cellG.alignment.horizontal = 'center';
      cellH.alignment.horizontal = 'center';
      cellI.alignment.horizontal = 'center';
      cellJ.alignment.horizontal = 'center';
      cellO.alignment.horizontal = 'center';

      cellH.font = { size: 10 };

      cellM.numFmt = '###,##0';
      cellN.numFmt = '###,##0';

      cellK.border.right = undefined;
    });

    //____________________________________________________

    for (let i = rNotes; i <= rNotesLatest; i++) {
      const row = sheet.getRow(i);
      row.height = rowHeight_notes;
    }

    //

    const notesCaptionCell = sheet.getCell(`B${rNotes}`);
    notesCaptionCell.value = '備註：';
    // notesCaptionCell.border.top = { style: 'thin', color: { argb: '000000' } };
    notesCaptionCell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
    };

    const notesCaptionLatestCell = sheet.getCell(`B${rNotesLatest}`);
    // notesCaptionLatestCell.border.bottom = { style: 'thin', color: { argb: '000000' } };
    notesCaptionLatestCell.border = {
      bottom: { style: 'thin', color: { argb: '000000' } },
    };

    for (let i = rNotes; i <= rNotesLatest; i++) {
      const cell = sheet.getCell(`B${i}`);

      if (!cell.border) {
        cell.border = {};
      }

      cell.border.left = {
        style: 'thin',
        color: { argb: '000000' },
      };
    }

    //
    const notesCell = sheet.getCell(`C${rNotes}`);
    sheet.mergeCells(`C${rNotes}:O${rNotesLatest}`);
    notesCell.value = notesArr.join('\n');
    notesCell.alignment = { vertical: 'top', wrapText: true };
    notesCell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    };
    notesCell.font = { size: 10 };

    //____________________________________________________

    const totalRowIndexArr = [rSubToTal, rTax, rTotal];

    totalRowIndexArr.forEach((totalRowIndex) => {
      const row = sheet.getRow(totalRowIndex);
      row.height = rowHeight_total;

      letterArr.forEach((letter, letterIndex) => {
        const cell = sheet.getCell(`${letter}${totalRowIndex}`);
        cell.border = {
          bottom: { style: 'thin', color: { argb: '000000' } },
        };

        if (letterIndex === 0) {
          cell.border.left = { style: 'thin', color: { argb: '000000' } };
        }

        if (letterIndex === letterArr.length - 1) {
          cell.border.right = { style: 'thin', color: { argb: '000000' } };
        }
      });

      const cellM = sheet.getCell(`M${totalRowIndex}`);
      cellM.border.right = { style: 'thin', color: { argb: '000000' } };
      const cellN = sheet.getCell(`N${totalRowIndex}`);
      cellN.border.right = { style: 'thin', color: { argb: '000000' } };
    });

    const subTotalCaptionCell = sheet.getCell(`B${rSubToTal}`);
    const subTotalCell = sheet.getCell(`N${rSubToTal}`);
    subTotalCell.numFmt = '###,##0';
    subTotalCell.font = { size: 10 };

    const taxCaptionCell = sheet.getCell(`B${rTax}`);
    const taxCell = sheet.getCell(`N${rTax}`);
    taxCell.numFmt = '###,##0';
    taxCell.font = { size: 10 };

    const totalCaptionCell = sheet.getCell(`B${rTotal}`);
    const totalCell = sheet.getCell(`N${rTotal}`);
    totalCell.numFmt = '###,##0';
    const totalChineseCell = sheet.getCell(`D${rTotal}`);
    sheet.mergeCells(`D${rTotal}:L${rTotal}`);
    totalCell.font = { size: 10 };

    totalChineseCell.alignment = { horizontal: 'right' };
    totalChineseCell.border.right = {
      style: 'thin',
      color: { argb: '000000' },
    };
    totalChineseCell.font = { size: 12 };

    if (page !== chunkProdArr.length) {
      subTotalCaptionCell.value = '　本頁合計';
      subTotalCell.value = pageSubTotal;
    } else {
      subTotalCaptionCell.value = `　小　　計  (共  ${chunkProdArr.length}  頁)`;
      subTotalCaptionCell.alignment = { wrapText: false };
      subTotalCell.value = subTotal_num;

      taxCaptionCell.value = '　營業稅5％';
      taxCell.value = tax_num;

      totalCaptionCell.value = '　總　　計   新台幣:';
      totalCaptionCell.alignment = { wrapText: false };
      totalCell.value = total_num;
      totalChineseCell.value = total_num;
      totalChineseCell.numFmt = '[DBNum2][$-404]General元整';

      sheet.getCell(`M${rTotal}`).value = '總金額';
      sheet.getCell(`M${rTotal}`).font = { size: 12 };
    }

    //____________________________________________________

    const rowOtherFirstRow = sheet.getRow(rOther);
    rowOtherFirstRow.height = rowHeight_otherFirstRow;

    for (let i = rQuotationRange; i <= rQuotationRangeLatest; i++) {
      const row = sheet.getRow(i);
      row.height = rowHeight_other_beforePayWay;
    }

    for (let i = rPayWay + 1; i <= rPayWay + 5; i++) {
      const row = sheet.getRow(i);
      row.height = rowHeight_other_payWay;
    }

    sheet.getRow(rPayWay + 5).height = rowHeight_other_afterPayWay;
    sheet.getRow(rAgent).height = rowHeight_other_agent;

    //

    const quotationRangeCaptionCell = sheet.getCell(`B${rOther}`);
    quotationRangeCaptionCell.value = '一、報價範圍';
    const cellQuotationRange = sheet.getCell(`B${rQuotationRange}`);
    sheet.mergeCells(`B${rQuotationRange}:H${rQuotationRangeLatest}`);
    cellQuotationRange.alignment = {
      vertical: 'top',
      wrapText: true,
    };
    cellQuotationRange.font = { size: 9 };
    cellQuotationRange.value = qrArr_formated.join('\n');

    //____________________________________________________
    const cellTradingLocation = sheet.getCell(`J${rOther}`);
    cellTradingLocation.value = `      二、交貨地點：  ${deliveryLocation}`;

    const cellTradingDate = sheet.getCell(`J${rOther + 2}`);
    cellTradingDate.value = `      三、交貨日期：  ${deliveryDate}`;

    //____________________________________________________
    const cellPayWay = sheet.getCell(`J${rPayWay}`);
    cellPayWay.value = '      四、付款辦法：  ';

    payWayArr_formated.forEach((payWayStr, index) => {
      const cellPayWayContent = sheet.getCell(`J${rPayWay + index + 1}`);
      cellPayWayContent.value = payWayStr;
    });

    //____________________________________________________

    const cellAgent = sheet.getCell(`J${rAgent}`);
    cellAgent.value = `      經辦人： ${agentName}`;

    //
  }); // chunkProdArr.forEach close

  // -----------------------------------------------------------

  // -----------------------------------------------------------

  await workbook.xlsx.writeBuffer();

  // -----------------------------------------------------------
  // 表格裡面的資料都填寫完成之後，訂出下載的callback function
  // 異步的等待他處理完之後，創建url與連結，觸發下載
  workbook.xlsx.writeBuffer().then((content) => {
    const link = document.createElement('a');
    const blobData = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });

    const today = moment().format('yyyy-MM-DD');
    link.download = `${quotationNumber}_${today}.xlsx`;
    link.href = URL.createObjectURL(blobData);
    link.click();
    link.remove();
  });

  //
  //
  //
};
