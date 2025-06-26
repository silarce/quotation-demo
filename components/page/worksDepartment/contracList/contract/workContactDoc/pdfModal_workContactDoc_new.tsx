import { useState, useEffect, useMemo, forwardRef, useRef, useCallback } from 'react';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// antd
import { Modal, ModalProps } from 'antd';

// gear
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// css
import scss from './pdfModal_workContactDoc.module.scss';

// import { ThasPattern } from './projectPattern';

import { TengineerContactExport, useApiEngineerContactExport } from 'js/api/api_netCore/api_engineer';

// ==============================================================================

type Tprops = {
  // visible: boolean;
  // onCancel: () => void;
  // engineeringContact: TengineeringContactDto | undefined;
  // productArr: TquotationProductDto[];
  // hasPattern: ThasPattern;
  engineeringContactId: string;
};

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
};

type ThasPattern = {
  floorPlan: boolean;
  designDiagram: boolean;
};

type TproductDetails = TengineerContactExport['productDetails'];

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
export default function PdfModal({ engineeringContactId }: Tprops) {
  //

  const { engineerContactExport, patternList, hasPattern, hasPattern_bool } =
    useApiEngineerContactExport(engineeringContactId);

  const {
    //
    projectName,
    productDetails,
    // annotations, // api還沒給
  } = engineerContactExport ?? {};

  const annotations: string[] = ['api還沒給'];

  // --------------------------------------------------------------------------
  const ref_pdf = useRef<(HTMLDivElement | null)[]>([]);

  const [prodArrArr, setProdArrArr] = useState<TproductDetails[]>([]);
  // --------------------------------------------------------------------------

  // ========================================================================

  const dlPdf = async () => {
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

    doc.save(`工程聯絡單_${projectName}.pdf`);
    showRootLoading(false);
  };

  // ========================================================================
  const { infoArr } = useMemo(() => {
    if (!engineerContactExport) {
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

      address,
      projectPrincipal,
      projectContent,

      // constructionSitePrincipalContactNumber, // api還沒給
    } = engineerContactExport;

    const constructionSitePrincipalContactNumber = 'api還沒給';

    const wholeAddress = address;

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
            <span>公司傳真：</span>
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
            <span>工地傳真：</span>
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
        value: projectPrincipal + ' ' + constructionSitePrincipalContactNumber,
      },
      projectContent: {
        label: '工程內容：',
        value: projectContent,
      },
    };
    //

    return {
      infoArr: Object.values(info),
    };

    //
  }, [engineerContactExport]);

  return (
    <div className={scss.body}>
      <MyButton_v2 onClick={dlPdf}>下載</MyButton_v2>
      <br />
      <br />

      <PdfTemp
        isTemplate={true}
        infoArr={infoArr}
        productArr={productDetails}
        // annotations={engineeringContact?.annotations}
        annotations={annotations}
        onChunkProdArrArrCreated={setProdArrArr}
        page={0}
        allPage={prodArrArr.length}
        hasPattern={hasPattern}
      />

      {prodArrArr.map((prodArr, index) => {
        return (
          <PdfTemp
            key={index}
            ref={(ele) => {
              ref_pdf.current[index] = ele;
            }}
            infoArr={infoArr}
            productArr={prodArr}
            annotations={annotations}
            page={index + 1}
            allPage={prodArrArr.length}
            hasPattern={hasPattern}
          />
        );
      })}
    </div>
  );
}

// ===============================================================================

//  ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████
// ██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██
// ██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██
// ██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██
//  ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██

const Header_pre = (
  { infoArr, page, allPage }: { infoArr: Tinfo[]; page: React.ReactNode; allPage: React.ReactNode },
  ref: React.ForwardedRef<HTMLDivElement>
) => {
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

        <div>
          {/* <span>{'頁次：'}</span>
          <span>{page}</span> */}
          <span>{'頁次：'}</span>
          <span>{`${page}/${allPage}`}</span>
        </div>
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

const Body_pre = (
  {
    productArr,
  }: {
    //
    productArr: TproductDetails | undefined;
  },
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return (
    <div ref={ref} className={scss.body}>
      {(productArr ?? []).map((prod, index) => {
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
          bounceDoorWidth,
        } = prod;

        // cm
        const width_cm = new Decimal(fullWidth).div(10).toNumber();
        const height_cm = new Decimal(height).div(10).toNumber();
        const boxB_cm = new Decimal(boxB).div(10).toNumber();
        const bounceDoorWidth_cm = new Decimal(bounceDoorWidth ?? 0).div(10).toNumber();

        let size = `${width_cm}`;
        bounceDoorWidth_cm && (size = `${size} + ${bounceDoorWidth_cm}`);
        size = `${size} x ${height_cm}`;
        boxB_cm && (size = `${size} + ${boxB_cm}`);

        const doorTrack = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${guideRail}`;

        return (
          <div
            key={id + index}
            id={id}
            //  data-id={id}
            data-component={'row'}
            className={scss.row}
          >
            <div>{itemName}</div>
            <div>{size}</div>
            <div className="whitespace-pre-wrap">{doorModelName}</div>
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

const Footer_pre = (
  {
    annotations,
    hasPattern,
    hasPattern_bool,
  }: { annotations: string[]; hasPattern: ThasPattern; hasPattern_bool: boolean },
  ref: React.ForwardedRef<HTMLDivElement>
) => {
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
            {/* <li>{'(1)TEST'}</li>
            <li>{'(2)TEST'}</li>
            <li>{'(3)TEST'}</li> */}
          </ul>
        </div>

        <div>圖面</div>
        <div>備註</div>

        <div>設計圖</div>
        <div>{hasPattern.designDiagram && 'V'}</div>

        <div>簽認圖</div>
        <div>{hasPattern.floorPlan && 'V'}</div>

        <div>無圖面</div>
        <div>{!hasPattern_bool && 'V'}</div>
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
    className,
    isTemplate,
    infoArr = [],
    productArr,
    annotations = [],
    onChunkProdArrArrCreated,
    page,
    allPage,
    hasPattern,
  }: {
    className?: string;
    isTemplate?: boolean;
    // style?: React.CSSProperties;
    infoArr: Tinfo[] | undefined;
    productArr: TproductDetails | undefined;
    annotations: string[] | undefined | null;
    onChunkProdArrArrCreated?: (chunkProdArrArr: TproductDetails[]) => void;
    page: React.ReactNode;
    allPage: React.ReactNode;
    hasPattern: ThasPattern;
  },
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const ref_header = useRef<HTMLDivElement>(null);
  const ref_body = useRef<HTMLDivElement>(null);
  const ref_footer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onChunkProdArrArrCreated) {
      return;
    }

    const prodList: { [id: string]: TproductDetails[number] } = {};

    productArr?.forEach((prod) => {
      prodList[prod.id] = prod;
    });

    const headerHeight = ref_header.current?.offsetHeight ?? 0;
    // const bodyHeight = ref_body.current?.offsetHeight ?? 0;
    const footerHeight = ref_footer.current?.offsetHeight ?? 0;
    const allowHeight = a4ContentHeight - headerHeight - footerHeight;

    const bodyRowsCollection = (ref_body.current?.querySelectorAll('[data-component="row"]') ?? []) as HTMLDivElement[];
    const rowArr = [...bodyRowsCollection];

    const chunkProdArrArr: TproductDetails[] = [];
    let tempArr: TproductDetails = [];
    let tempHeight = 0;

    rowArr.forEach((ele, index) => {
      const eleHeight = ele.offsetHeight;

      const id = ele.id;
      const prod = prodList[id ?? 'undefined'];

      if (tempHeight + eleHeight >= allowHeight) {
        chunkProdArrArr.push(tempArr);
        tempArr = [];
        tempHeight = 0;
      }

      tempArr.push(prod);
      tempHeight = tempHeight + eleHeight;

      if (index === rowArr.length - 1) {
        chunkProdArrArr.push(tempArr);
      }

      onChunkProdArrArrCreated(chunkProdArrArr);
    });

    //
  }, [ref_header, ref_body, ref_footer]);

  // 如果要設定container的height、paddingTop、paddingBottome等會影響到高度的樣式
  // 到上面的a4Style設定
  return (
    <div className={classNames(scss.a4Wrapper, isTemplate && scss.sizeHidden)}>
      <div ref={ref} className={classNames(scss.a4Container, className)} style={{ ...a4Style }}>
        <Header ref={ref_header} infoArr={infoArr} page={page} allPage={allPage} />
        <Body ref={ref_body} productArr={productArr} />
        <Footer ref={ref_footer} annotations={annotations ?? []} hasPattern={hasPattern} hasPattern_bool={} />
      </div>
    </div>
  );
};

const Header = forwardRef(Header_pre);
const Body = forwardRef(Body_pre);
const Footer = forwardRef(Footer_pre);
const PdfTemp = forwardRef(PdfTemp_pre);
