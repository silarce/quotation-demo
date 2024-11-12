import React, { useState, useEffect, useMemo, Fragment, forwardRef, useRef } from 'react';
import moment from 'moment';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Decimal from 'decimal.js';

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

import { TquotationContentDto, TquotationContentOtherDto, TquotationProductDto } from 'js/api/dtoTypes';
//
import { Class_product, Class_other } from 'hooks/quotation/useProduct';
import { Class_legacyContract } from 'hooks/quotation/legacy/useLegacyContract';

// config options
import { optionsCreator_quotationStatus } from 'js/utils/options/options';
import { doorTrackLookup } from 'js/utils/options/doorTrackOptions';
import { findGuideRailUnicode } from 'config/product/lookup';
import { companyInfo } from 'config/companyInfo';
import { lookup_quoteType_doorModelName } from 'js/utils/options/productOptions';

// utils
import changeNumberMoneyToChinese from 'js/tools/numToChineseNum';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import { dlExcel } from './dlExcel';
import { dlPdf } from './dlPdf';

// api
import { apiGetAssets } from 'js/api/api_product';

import { useDoorModelList, useShallow } from 'hooks/globalState/useDoorModelList';

// ============================================================================

// region TYPE

type Tprod = {
  itemName: string;
  size: string;
  doorModelName: string;
  materialName: string;
  thickness: string;
  materialSurface: string;
  guideRail: string; // image url
  horsepower: string;
  closingType: string;
  qty: string;
  unitPrice: string;
  totalPrice: string;
  notes: string;
  //
  unitPrice_num: number;
  totalPrice_num: number;
  qty_num: number;
  guideRailForExcel: string | null;
  unit: string;
  //
  //
  // series 在quotationPdf_new2中還有 series
  // 似乎是用在typeB的
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

type TpdfData = {
  top: Ttop; // 上
  prodArr: Tprod[]; // 中
  bottom: Tbottom; // 下
};

export type { Tprod, Ttop, Tbottom, Tbottom_c, TpdfData };

// ============================================================================

const paddingY = 40;
const excelRowMaxQty = 13; // excel 一頁13列

// ============================================================================
// region START
export default function Modal_quotationPdf({
  //
  visible,
  onCancel,
  // data = fakeData,
  pdfData,
  fileName = '未命名',
}: {
  pdfData?: TpdfData;
  fileName: string;
} & ModalProps) {
  const ref_pdf = useRef<HTMLDivElement[]>([]);

  const [chunkedProdArr, setChunkedProdArr] = useState<Tprod[][]>([]);

  // --------------------------------------------------------------------------

  const handle_dlPdf = () => {
    dlPdf({ ref_pdf, fileName });
  };

  const handle_dlExcel = () => {
    const prodArr = pdfData?.prodArr ?? [];

    const chunkedProdArr_excel = _.chunk(prodArr, excelRowMaxQty);

    pdfData &&
      dlExcel({
        fileName,
        data: pdfData,
        chunkedProdArr: chunkedProdArr_excel,
        excelRowMaxQty,
      });
  };

  // --------------------------------------------------------------------------

  // useEffect(() => {
  //   if (ref_pdf.current.length !== chunkedProdArr?.length) {
  //     alert('注意 請檢查是否缺頁');
  //   }
  // }, [chunkedProdArr, ref_pdf]);

  // ===============================================================================
  // region RENDER

  if (!pdfData) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      width="fit-content"
      footer={null}
      closable={false}
      destroyOnClose={true}
    >
      <div className={scss.body}>
        <div>
          <MyButton_v2 onClick={handle_dlPdf} className="mr-5">
            下載PDF
          </MyButton_v2>
          <MyButton_v2 onClick={handle_dlExcel}>下載EXCEL</MyButton_v2>
        </div>

        {/*  */}
        <PdfTemplate data={pdfData} getChunkedPropArr={setChunkedProdArr} />
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
                data={pdfData}
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
  // html2canvas與其他將dom轉為image的套件
  // 在取得發圖片請求時都不會也不能帶cookie，就被401了
  // 所以要另外取得存在本地
  const [svgList, setSvgList] = useState<{
    [fileName: string]: string | undefined | null;
  }>({});

  const getSvg = async ({ fileName }: { fileName: string }) => {
    if (svgList[fileName] === null) {
      return;
    }

    if (svgList[fileName] === 'isLoading') {
      return;
    }

    if (!!svgList[fileName]) {
      return;
    }

    try {
      svgList[fileName] = 'isLoading';

      const svg = await apiGetAssets(fileName);

      if (svg) {
        setSvgList((list) => ({
          ...list,
          [fileName]: svg,
        }));
      }
    } catch (error) {
      setSvgList((list) => ({
        ...list,
        [fileName]: null,
      }));
    }
  };

  return (
    <div ref={ref}>
      {prodArr.map((prod, index) => {
        return (
          <div key={index} data-component="component_row" className={classNames(scss.row)}>
            {prodKeyArr.map((key) => {
              const { style, justifyContent_tbody } = config[key];

              let node: React.ReactNode = prod[key];

              if (key === 'guideRail' && typeof node === 'string') {
                // 若為本地端的圖片，會以/_next開頭，但應該是用不到
                if (node.startsWith('/_next')) {
                  node = <Image src={node} alt={node} width={30} height={30} />;
                } else {
                  const fileName = node;
                  getSvg({ fileName });
                  const src = svgList[fileName] ?? fileName ?? '';
                  node = <div dangerouslySetInnerHTML={{ __html: src }} className={scss.svgWrapper} />;
                }
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
  data: TpdfData;
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
    data: TpdfData;
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
      flex: '1 1 0',
    },
    justifyContent_thead: 'center',
    justifyContent_tbody: 'right',
  },
  totalPrice: {
    label: '複價',
    style: {
      width: 'auto',
      flex: '1 1 0',
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

// ===========================================================================
// region Hook dataImport

// 專門給報價單使用的
const quotationProdAndOther_ToProdArr = ({
  quotationProductArr,
  quotationOtherArr,
  checkIsSpecialDoor,
}: {
  quotationProductArr: TquotationProductDto[];
  quotationOtherArr: TquotationContentOtherDto[];
  checkIsSpecialDoor: (doorModelName: string) => boolean;
}): Tprod[] => {
  const productArr: Tprod[] = (() => {
    return quotationProductArr.map((pro) => {
      const {
        //
        quoteType,
        itemName,
        doorModelName,
        fullWidth,
        height,
        boxB,
        isAntiTyphoon,
        hasSilencingStrip,
        bounceDoorWidth,
        thickness,
        materialName,
        materialSurface,
        closingType,
        horsepower,
        // quantity,
        unitPrice,
        // totalPrice,
        notes,
        guideRail,
        //
        reduceQty,
      } = pro;

      const name = (() => {
        if (quoteType === '捲門') {
          return doorModelName;
        } else {
          return (lookup_quoteType_doorModelName[quoteType]?.[doorModelName]?.name || doorModelName) as string;
        }
      })();

      const isSpecialDoor = checkIsSpecialDoor(doorModelName);

      let { quantity, totalPrice } = pro;

      if (reduceQty) {
        quantity = -reduceQty;
        totalPrice = new Decimal(unitPrice).mul(-reduceQty).toNumber();
      }

      const fullWidth_cm = new Decimal(fullWidth || 0).div(10).toNumber();
      const height_cm = new Decimal(height || 0).div(10).toNumber();
      const boxB_cm = new Decimal(boxB || 0).div(10).toNumber();
      const bounceDoorWidth_cm = new Decimal(bounceDoorWidth || 0).div(10).toNumber();

      const boxB_formated = boxB_cm ? `＋${boxB_cm}` : '';
      const bounceDoorWidth_formated = bounceDoorWidth_cm ? `＋${bounceDoorWidth_cm}` : '';

      // const size = `${fullWidth_cm}${bounceDoorWidth_formated}Ｘ${height_cm}${boxB_formated}`;
      let size = '';

      if (quoteType === '電動大門') {
        size = `${fullWidth_cm}`;
        boxB_cm && (size += `＋${boxB_cm}`);
        size += `Ｘ${height_cm}`;
      } else {
        size = `${fullWidth_cm}${bounceDoorWidth_formated}Ｘ${height_cm}${boxB_formated}`;
      }

      const thickness_num = Number(thickness || 0);
      const thickness_str = thickness_num === 0 ? '' : new Decimal(thickness_num).toFixed(1) + 't';

      let material = materialName;

      // const doorRailForExcel = isSpecialDoor
      //   ? guideRail
      //   : doorModelName === 'SJ-302'
      //   ? findGuideRailUnicode({
      //       isAntiTyphoon: !!isAntiTyphoon,
      //       isSilencing: !!hasSilencingStrip,
      //     })
      //   : '';
      // const doorRailForExcel = isSpecialDoor
      //   ? guideRail
      //   : doorModelName === 'SJ-302'
      //   ? findGuideRailUnicode({
      //       guideRail,
      //     })
      //   : '';

      const doorRailForExcel = (() => {
        if (isSpecialDoor) {
          return guideRail;
        }

        const guideRailName = guideRail?.replace('.svg', '');

        return guideRailName ? findGuideRailUnicode({ guideRail: guideRailName }) : '';
      })();

      // 曉君要求，當材料為高耐鍍鋅鋼板時只要顯示鍍鋅鋼板
      // 21204-04-12 材料為鐵材烤漆(value為黑鐵)時，也視為鍍鋅鋼板
      if (material === '高耐鍍鋅鋼板' || material === '黑鐵') {
        material = '鍍鋅鋼板';
      }

      const unit = '樘';

      return {
        itemName,
        size,
        doorModelName: name,
        materialName: material,
        thickness: thickness_str,
        materialSurface: materialSurface ?? '',
        // guideRail: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${guideRail}`,
        guideRail: guideRail ?? '',
        horsepower,
        closingType: closingType ?? '',
        qty: String(quantity) + ' ' + unit,
        unitPrice: unitPrice.toLocaleString(),
        totalPrice: totalPrice.toLocaleString(),
        notes,
        //
        unitPrice_num: unitPrice,
        totalPrice_num: totalPrice,
        qty_num: quantity,
        guideRailForExcel: doorRailForExcel,
        unit,
      };
    });
  })();

  const othersArr: Tprod[] = quotationOtherArr.map((item, index) => {
    const { quantity, description, unitPrice, totalPrice, spec, unit } = item;

    const quantity_num = Number(quantity || 0);
    const totalPrice_num = Number(totalPrice || 0);

    return {
      itemName: item.item,
      size: spec ?? '',
      doorModelName: description,
      materialName: '',
      thickness: '',
      materialSurface: '',
      guideRail: '',
      horsepower: '',
      closingType: '',

      qty: quantity_num + ' ' + unit,
      unitPrice: unitPrice.toLocaleString(),
      totalPrice: totalPrice_num ? totalPrice_num.toLocaleString() : '',
      notes: item.notes,
      //
      unitPrice_num: unitPrice,
      totalPrice_num: totalPrice_num,
      qty_num: quantity_num,
      guideRailForExcel: null,
      unit: unit ?? '',
    };
  });

  return [...productArr, ...othersArr];
};

// region useModalQuotationPdf

const useModalQuotationPdf = ({
  //
  quotationContent,
  attachedProdArr,
  emptySomeProperty,
}: {
  quotationContent: TquotationContentDto | undefined;
  // 原本會使用quotationContent裡的products，但如果有attachedProdArr，就會以attachedProdArr替代
  attachedProdArr?: TquotationProductDto[];
  emptySomeProperty?: boolean; // 清空 customerName contactPerson contactNumber faxNumber
}) => {
  const [visible, setVisible] = useState(false);
  const [pdfData, setPdfData] = useState<TpdfData>();
  const checkIsSpecialDoor = useDoorModelList(useShallow((state) => state.checkIsSpecialDoor));

  useEffect(() => {
    if (!quotationContent) {
      return;
    }

    const {
      quotationNumber,
      quotationDate,
      validityPeriod,
      customer,
      projectName,
      county,
      district,
      address,
      // contactPerson,
      // contactNumber,
      // faxNumber,
      //
      subTotal,
      salesTax,
      total,
      deliveryLocation,
      deliveryDate,
      paymentMethods,
      annotations,
      quotationRanges,
      agentEmployee,
      products,
      others,
    } = quotationContent;

    let {
      // customerName,
      contactPerson,
      contactNumber,
      faxNumber,
    } = quotationContent;

    let customerName = customer?.name ?? '';

    if (emptySomeProperty) {
      customerName = '';
      contactPerson = '';
      contactNumber = '';
      faxNumber = '';
    }

    const projectWholeAddress = `${county}${district}${address}`;

    const top: Ttop = {
      contactPerson,
      customerName: customerName,
      contactNumber,
      faxNumber,

      quotationNumber,
      validityPeriod,
      quotationDate: getTaiwanDateStr(quotationDate, { withUnit: true }) ?? '',

      projectName,
      projectWholeAddress,
    };

    const paymentMethodsArr = paymentMethods.map((pm) => {
      let value: string | number = new Decimal(pm.totalPaymentRatio || 0).toNumber();
      value = value ? String(value) : '';

      return {
        label: pm.milestone,
        value: value,
      };
    });

    const bottom: Tbottom = {
      subTotal: subTotal.toLocaleString(),
      tax: salesTax.toLocaleString(),
      total: total.toLocaleString(),
      total_chinese: changeNumberMoneyToChinese(total),

      deliveryLocation,
      deliveryDate: getTaiwanDateStr(deliveryDate, { withUnit: true }) ?? '',
      paymentMethods: paymentMethodsArr,
      notesArr: annotations ?? [],
      qrArr: quotationRanges ?? [],
      agentName: agentEmployee?.chName ?? '',
      //
      subTotal_num: subTotal,
      tax_num: salesTax,
      total_num: total,
    };
    // attachedProdArr

    let quotationProductArr = attachedProdArr || products;

    quotationProductArr = _.sortBy(quotationProductArr, 'order');

    const prodArr = quotationProdAndOther_ToProdArr({
      quotationProductArr: quotationProductArr,
      quotationOtherArr: others ?? [],
      checkIsSpecialDoor,
    });

    setPdfData({ top, prodArr, bottom });
  }, [
    quotationContent,
    emptySomeProperty,
    // attachedProdArr
  ]);

  return {
    visible,
    setVisible,
    pdfData,
  };

  //
};

export { useModalQuotationPdf };
