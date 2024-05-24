import React, { useState, Fragment, forwardRef, useRef } from 'react';
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
  itemName: React.ReactNode;
  size: React.ReactNode;
  doorModelName: React.ReactNode;
  materialName: React.ReactNode;
  thickness: React.ReactNode;
  materialSurface: React.ReactNode;
  guideRail: React.ReactNode;
  horsepower: React.ReactNode;
  closingType: React.ReactNode;
  qty: React.ReactNode;
  unitPrice: React.ReactNode;
  totalPrice: React.ReactNode;
  notes: React.ReactNode;
};

type Ttop = {
  contactPerson: React.ReactNode; // 聯絡人
  customerName: React.ReactNode; // 客戶名稱
  contactNumber: React.ReactNode; // 電話
  faxNumber: React.ReactNode; // 傳真

  quotationNumber: React.ReactNode; // 報價編號
  validityPeriod: React.ReactNode; // 報價時效
  quotationDate: React.ReactNode; // 報價日期

  projectName: React.ReactNode; // 工程名稱
  projectWholeAddress: React.ReactNode; // 工程地址
};

type Tbottom = {
  subTotal: React.ReactNode; // 小計
  tax: React.ReactNode; // 營業稅5%
  total: React.ReactNode; // 總計
  total_chinese: React.ReactNode; // 總計(中文)

  deliveryLocation: React.ReactNode; // 交貨地點
  deliveryDate: React.ReactNode; // 交貨日期
  paymentMethods: { label: React.ReactNode; value: React.ReactNode }[]; // 付款辦法
  notesArr: React.ReactNode[];
  qrArr: React.ReactNode[];
  agentName: React.ReactNode;
};

type Tbottom_c = Tbottom & {
  subTotal_page: React.ReactNode; // 小計
};

type Tdata = {
  top: Ttop; // 上
  center: Tprod[]; // 中
  bottom: Tbottom; // 下
};

// ============================================================================

// region START
export default function Modal_quotationPdf({
  //
  visible,
  onCancel,
  data,
}: {
  data?: Tdata;
} & ModalProps) {
  // region RENDER
  return (
    <Modal visible={visible} onCancel={onCancel} width="fit-content" footer={null} closable={false}>
      <div className={scss.body}>
        <div className={scss.pdf}>
          <Top top={fakeTop} page="1" pageTotal="2" />

          <div>
            {fakeProdArr.map((prod, index) => {
              return (
                <div key={index} className={classNames(scss.row)}>
                  {prodKeyArr.map((key) => {
                    const { style, justifyContent_tbody } = config[key];

                    let node = prod[key];

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

          <Bottom bottom_s={fakeBottom} pageTotal={1} isLatestPage={1 === 1} />
        </div>
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

          <div className={scss.page}>
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
    bottom_s,
    pageTotal,
    isLatestPage,
  }: {
    bottom_s: Tbottom_c;
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
  } = bottom_s;

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
              {paymentMethods.map((method, index) => {
                const { label, value } = method;

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

// ------------------------------------------------------------------------------

const Top = forwardRef(Top_pre);
const Bottom = forwardRef(Bottom_pre);

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
  quotationNumber: 'aaaaaa',
  validityPeriod: 'aaaaaa',
  quotationDate: 'aaaaaa',
  projectName: 'aaaaaa',
  projectWholeAddress: 'aaaaaa',
};

const fakeBottom: Tbottom_c = {
  subTotal: 'aaaa',
  tax: 'aaaa',
  total: 'aaaa',
  total_chinese: 'ㄟㄟㄟㄟ',
  deliveryLocation: 'aaaa',
  deliveryDate: 'aaaa',
  paymentMethods: [{ label: 'aaa', value: 'aaa' }],
  notesArr: ['aaaa', 'aaaa', 'aaaa'],
  qrArr: ['aaaa', 'aaaa', 'aaaa'],
  agentName: 'aaaa',
  subTotal_page: 'aaaa',
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
  totalPrice: 'aaa',
  notes: 'aaa',
};

const fakeProdArr = [fakeProd, fakeProd, fakeProd, fakeProd, fakeProd];
