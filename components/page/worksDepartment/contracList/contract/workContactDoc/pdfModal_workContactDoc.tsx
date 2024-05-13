import { useState, useEffect, useMemo, forwardRef, useRef } from 'react';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// antd
import { Modal, ModalProps } from 'antd';

import scss from './pdfModal_workContactDoc.module.scss';

import { TengineeringContactDto, TquotationProductDto } from 'js/api/dtoTypes';

// ==============================================================================

type Tprops = {
  visible: boolean;
  onCancel: () => void;
  engineeringContact: TengineeringContactDto | undefined;
  productArr: TquotationProductDto[];
};

// ==============================================================================

const a4Height = 2000;
const a4Pt = 80;
const a4Pb = 40;
const a4ContentHeight = a4Height - a4Pt - a4Pb;
const a4Style = {
  height: a4Height,
  paddingTop: a4Pt,
  paddingBottom: a4Pb,
};

// ==============================================================================
export default function PdfModal({
  //
  visible,
  onCancel,
  engineeringContact,
  productArr,
}: Tprops) {
  //

  const ref_pdf = useRef<(HTMLDivElement | null)[]>([]);

  const testProductArr = [...productArr, ...productArr, ...productArr, ...productArr];

  const { infoArr } = useMemo(() => {
    if (!engineeringContact) {
      return {};
    }

    const {
      projectName,
      projectNumber,
      contractor,
      contractorContactNumber,
      contractorFaxNumber,
      contractorPrincipal,
      constructionSiteContactNumber,
      constructionSiteFaxNumber,
      // wholeAddress,
      zipCode,
      county,
      district,
      address,
      projectPrincipal,
      projectContent,
    } = engineeringContact;

    const wholeAddress = zipCode + county + district + address;

    const info: TinfoList = {
      projectName: {
        label: '工程名稱：',
        value: projectName,
      },
      projectNumber: {
        label: '工程編號：',
        value: projectNumber,
      },
      contractor: {
        label: '承包商：',
        value: contractor,
      },
      contractorContactNumber: {
        label: (
          <>
            <span>公司電話：</span>
            <br />
            <span>FAX：</span>
          </>
        ),
        value: (
          <>
            <span>{contractorContactNumber}</span>
            <br />
            <span>{contractorFaxNumber}</span>
          </>
        ),
      },
      contractorPrincipal: {
        label: '負責人：',
        value: contractorPrincipal,
      },
      constructionSiteContactNumber: {
        label: (
          <>
            <span>工地電話：</span>
            <br />
            <span>FAX：</span>
          </>
        ),
        value: (
          <>
            <span>{constructionSiteContactNumber}</span>
            <br />
            <span>{constructionSiteFaxNumber}</span>
          </>
        ),
      },
      wholeAddress: {
        label: '地點：',
        value: wholeAddress,
      },
      projectPrincipal: {
        label: '工程負責人：',
        value: projectPrincipal,
      },
      projectContent: {
        label: '工程內容：',
        value: projectContent,
      },
      pageIndex: {
        label: '頁次：',
        value: '0',
      },
    };
    //

    return {
      infoArr: Object.values(info),
    };

    //
  }, [engineeringContact]);

  return (
    <Modal
      //
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      width={'fit-content'}
      destroyOnClose={true}
    >
      <div className={scss.body}>
        {/* <PdfTemp
          infoArr={infoArr}
          productArr={productArr}
          annotations={engineeringContact?.annotations}
          ref={(ele) => {
            ref_pdf.current[0] = ele;
          }}
        /> */}
        <PdfTemp
          infoArr={infoArr}
          productArr={testProductArr}
          annotations={engineeringContact?.annotations}
          ref={(ele) => {
            ref_pdf.current[0] = ele;
          }}
        />
        {/* <PdfTemp infoArr={infoArr} productArr={testProductArr} annotations={engineeringContact?.annotations} /> */}
      </div>
    </Modal>
  );
}

// ===============================================================================

type Tinfo = {
  label: React.ReactNode;
  value: React.ReactNode;
};

type TinfoList = {
  projectName: Tinfo;
  projectNumber: Tinfo;
  contractor: Tinfo;
  contractorContactNumber: Tinfo;
  contractorPrincipal: Tinfo;
  constructionSiteContactNumber: Tinfo;
  wholeAddress: Tinfo;
  projectPrincipal: Tinfo;
  projectContent: Tinfo;
  pageIndex: Tinfo;
};

//  ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████
// ██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██
// ██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██
// ██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██
//  ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██

const Header_pre = ({ infoArr }: { infoArr: Tinfo[] }, ref: React.ForwardedRef<HTMLDivElement>) => {
  return (
    <div ref={ref} className={scss.header} id="pdfModal_workContactDoc_top">
      <div className={scss.caption}>
        <p>三久建材工業股份有限公司</p>
        <p>附件四</p>
      </div>

      <h1 className={scss.title}>工程聯絡單</h1>

      <div className={scss.info}>
        {infoArr?.map((info, index) => {
          return (
            <div key={index}>
              <span>{info.label}</span>
              <span>{info.value}</span>
            </div>
          );
        })}
      </div>

      <div className={scss.thead}>
        <div>項目</div>
        <div>{'尺寸(cm)'}</div>
        <div>門型</div>
        <div>材料</div>
        <div>厚度</div>
        <div>表面</div>
        <div>門軌</div>
        <div>開關方式</div>
        <div>馬力</div>
        <div>數量</div>
        <div>備註</div>
      </div>
    </div>
  );
};

const Body_pre = ({ productArr }: { productArr: TquotationProductDto[] }, ref: React.ForwardedRef<HTMLDivElement>) => {
  return (
    <div ref={ref} className={scss.body}>
      {productArr.map((prod, index) => {
        const {
          id,
          itemName,
          doorModelName,
          fullWidth,
          height,
          boxB,
          materialName,
          materialSurface,
          guideRail,
          closingType,
          horsepower,
          quantity,
          notes,

          thickness,
        } = prod;

        // cm
        const width_cm = new Decimal(fullWidth).div(10).toString();
        const height_cm = new Decimal(height).div(10).toString();
        const boxB_cm = new Decimal(boxB).div(10).toString();

        let size = `${width_cm} x ${height_cm}`;
        boxB_cm && (size += ` + ${boxB_cm}`);

        const doorTrack = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${guideRail}`;

        return (
          <div key={id + index} className={scss.row}>
            <div>{itemName}</div>
            <div>{boxB_cm}</div>
            <div>{doorModelName}</div>
            <div>{materialName}</div>
            <div>{thickness}</div>
            <div>{materialSurface}</div>
            <div>
              {/*  eslint-disable-next-line @next/next/no-img-element */}
              <img src={doorTrack} alt={guideRail ?? ''} />
            </div>
            <div>{closingType}</div>
            <div>{horsepower}</div>
            <div>{quantity}</div>
            <div>{notes}</div>
          </div>
        );
      })}
    </div>
  );
};

const Footer_pre = ({ annotations }: { annotations: string[] }, ref: React.ForwardedRef<HTMLDivElement>) => {
  return (
    <div ref={ref} className={scss.footer}>
      <div className={scss.note}>
        <div>
          <span>備註：</span>
        </div>
        <ul>
          {annotations?.map((str, index) => {
            return <li key={index}>{str}</li>;
          })}
        </ul>
      </div>

      <div className={scss.other}>
        <div className={scss.note}>
          <div>
            <span>預定進度：</span>
          </div>
          <ul>
            {/* {engineeringContact?.annotations?.map((str, index) => {
          return <li key={index}>{str}</li>;
        })} */}
            <li>{'(1)fsdfsdaf'}</li>
            <li>{'(1)fdfghdfh'}</li>
            <li>{'(1)fdfdfddd'}</li>
          </ul>
        </div>

        <div>圖面</div>
        <div>備註</div>

        <div>設計圖</div>
        <div>V</div>

        <div>簽認圖</div>
        <div></div>

        <div>無圖面</div>
        <div></div>
      </div>

      <div className={scss.signature}>
        <div>
          審
          <br />核
        </div>
        <div>
          資料
          <br />
          檢核
        </div>
        <div>
          主辦
          <br />
          業務
        </div>
        <div>
          填
          <br />表
        </div>
      </div>
    </div>
  );
};

const PdfTemp_pre = (
  {
    //
    infoArr = [],
    productArr,
    annotations = [],
  }: {
    infoArr: Tinfo[] | undefined;
    productArr: TquotationProductDto[];
    annotations: string[] | undefined | null;
  },
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const ref_header = useRef<HTMLDivElement>(null);
  const ref_body = useRef<HTMLDivElement>(null);
  const ref_footer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('ref_header', ref_header.current?.offsetHeight);
    console.log('ref_body', ref_body.current?.offsetHeight);
    console.log('ref_footer', ref_footer.current?.offsetHeight);

    const headerHeight = ref_header.current?.offsetHeight ?? 0;
    const bodyHeight = ref_body.current?.offsetHeight ?? 0;
    const footerHeight = ref_footer.current?.offsetHeight ?? 0;

    const allowHeight = a4ContentHeight - headerHeight - footerHeight;

    //
  }, [ref_header, ref_body, ref_footer]);

  return (
    <div ref={ref} className={scss.a4Container} style={a4Style}>
      <Header ref={ref_header} infoArr={infoArr} />
      <Body ref={ref_body} productArr={productArr} />
      <Footer ref={ref_footer} annotations={annotations ?? []} />
    </div>
  );
};

const Header = forwardRef(Header_pre);
const Body = forwardRef(Body_pre);
const Footer = forwardRef(Footer_pre);
const PdfTemp = forwardRef(PdfTemp_pre);
