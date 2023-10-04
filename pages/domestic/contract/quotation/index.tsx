import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextRouter } from 'next/router';
import _ from 'lodash';

// components
// import QuotationProfile, { TquotationProfile } from 'components/page/domestic/quotation/quotationProfile';
import QuotationProfile, { TreturnBody } from 'components/page/domestic/quotation/quotationProfile';
import QuotationProduction from 'components/page/domestic/quotation/quotationProduct';
import QuotationComponent from 'components/page/domestic/quotation/quotationComponent';
import QuotationAccessory from 'components/page/domestic/quotation/quotationAccessory';
import QuotationTotal from 'components/page/domestic/quotation/quotationTotal';
// import QuotationSinature from 'components/page/domestic/quotation/quotationSinature';
import QuotationProdChangingRecord from 'components/page/domestic/quotation/quotationProdChangingRecord';
import QuotationRecord from 'components/page/domestic/quotation/quotationRecord';
import QuotationPdf from 'components/page/domestic/pdf/quotationPdf/quotationPdf';
import QuotationPdf_part from 'components/page/domestic/pdf/quotationPdf_part/quotationPdf_part';
//

// antd
import { Collapse } from 'antd';
const { Panel } = Collapse;

// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { RotatingArrow01 } from 'public/image/icon/iconComponent/rotatingArrow';

// icon
import iconUpload from 'public/image/icon/upload.svg';

// css
import style from './quotation.module.scss';

// =============================================================
// =============================================================
// =============================================================

import { useGetContract_id, useQuotation_id_attachments } from 'js/api/api_quotation';

// import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
// import Table_com from 'components/page/domestic/quotation/quotation/product/table_component';
// import Table_accessories from 'components/page/domestic/quotation/quotation/product/table_accessories';
// import Table_others from 'components/page/domestic/quotation/quotation/product/table_others';
import Table_prod from 'components/page/domestic/contract/table/table_prod';
import Table_com from 'components/page/domestic/contract/table/table_component';
import Table_accessories from 'components/page/domestic/contract/table/table_accessories';
import Table_others from 'components/page/domestic/contract/table/table_others';

import Summary, {
  TsummaryControl,
  TpayInfoControl,
} from 'components/page/domestic/quotation/quotation/summary/summary';
import QuotationSinature, { TsignatureProps } from 'components/page/domestic/quotation/quotationSinature';

import { useProductList } from 'hooks/quotation/useProduct';

import type { TquotationContentDto } from 'js/api/api_quotation';

import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';

// =============================================================
// =============================================================
// =============================================================
export default function Quotation() {
  const router = useRouter();
  const isReady = router.isReady;

  if (!isReady) {
    return null;
  }

  return <TheQuotation router={router} />;
}

// ===========================================================
function TheQuotation({ router }: { router: NextRouter }) {
  const {
    id, //報價單id
  } = router.query;

  // =========================================================

  const { data, update } = useGetContract_id(id as string | undefined);

  useEffect(() => {
    update();
  }, [id]);

  // =========================================================
  // 是否可編輯
  const [allowEdit, setAllowEdit] = useState(id === 'newQuotation' ? true : false);
  const [showPdf, setShowPdf] = useState(false);
  const [showPdf_part, setShowPdf_part] = useState(false);

  // ======================================================

  // 合約項目 追加/追減項目的開關
  // 按鈕是profile下面的 "合約項目"與 "追加/追減項目"
  const [switch01, setSwitch01] = useState(true);

  // 展開版本追加追減紀錄的開關
  // 按鈕是panelList的"追加追減報價單"
  const [switch02, setSwitch02] = useState(false);

  // =========================================================

  const tagList: TtagList = [
    {
      label: `報價編號 ${data?.content.quotationNumber}`,
      onClick: () => {},
    },
    { label: '工程聯絡單', onClick: () => {} },
  ];

  const panel_quotation01: TpanelList = [
    {
      type: 'myButton',
      label: '追加追減報價單',
      onClick: () => setSwitch02(() => true),
    },
    // TODO 要記得把這個功能再做出來
    // {
    //   type: 'myButton',
    //   label: '匯出報價單',
    //   img: iconUpload.src,
    //   onClick: () => setShowPdf(true),
    // },
    // {
    //   type: 'myButton',
    //   label: '匯出材料/配件',
    //   img: iconUpload.src,
    //   onClick: () => setShowPdf_part(true),
    // },
    { type: 'myButton', label: '送審', onClick: () => alert('送審') },
    {
      type: 'myButton',
      label: `編輯`,
      onClick: () => setAllowEdit((state) => true),
    },
    { type: 'myButton', label: '返回', onClick: () => router.back() },
  ];

  const panel_quotation02: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: () => alert('上傳'),
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => setAllowEdit(() => false),
    },
  ];

  const panel_quotation03: TpanelList = [
    // TODO 要記得把這個功能再做出來
    // {
    //   type: 'myButton',
    //   label: '匯出報價單',
    //   img: iconUpload.src,
    //   onClick: () => alert('匯出單價分析'),
    // },
    {
      type: 'redButton',
      label: '上傳',
      onClick: () => alert('上傳'),
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => setSwitch02(() => false),
    },
  ];

  const panelList = allowEdit ? panel_quotation02 : switch02 ? panel_quotation03 : panel_quotation01;

  // =========================================================
  // =========================================================
  // =========================================================
  // =========================================================

  const content = data?.content;
  const rootContent = data?.rootContract.content;

  // latest
  const {
    reRender,
    reset,
    //
    productList,
    prodCellConfig,
    prodKeyArr,
    prodVKeyArr,
    setProdVKeyArr,
    addProd,
    changeProdKeyArr,
    //
    subTotal,
    //
    comKeyArr,
    comVKeyArr,
    comCellConfig,
    changeComKeyArr,
    //
    accessoriesKeyArr,
    changeAccessoriesKeyArr,
    accessoriesCellConfig,
    //
    othersKeyArr,
    othersList,
    othersCellConfig,
    changeOthersKeyArr,
    addOthers,
    getOthersPostBodyArr,
  } = useProductList({
    productArr: content?.products ?? [],
    others: content?.others ?? [],
    resetTrigger: content?.products,
  }); // latest

  const [targetProdKey, setTargetProdKey] = useState<string>('n');
  const targetProd = productList[targetProdKey];

  // -----------------------------------------------------------------
  const control_anno: TsummaryControl = {
    stringArr: data?.annotations ?? [],
    editString: (index, v) => {},
    addString: (v: string) => {},
    delString: (index: number) => {},
    addStrArr: (vArr: string[]) => {},
  };

  const control_qr: TsummaryControl = {
    stringArr: data?.quotationRanges ?? [],
    editString: (index, v) => {},
    addString: (v: string) => {},
    delString: (index: number) => {},
    addStrArr: (vArr: string[]) => {},
  };

  const payInfoControl: TpayInfoControl = {
    payment: {
      discountRate: {
        inputAttr: {
          disabled: true,
          value: data?.discount ?? '',
          onChange: (e) => {},
        },
      },
      subTotal: {
        inputAttr: {
          disabled: true,
          value: data?.subTotal ?? '',
        },
      },
      salesTax: {
        inputAttr: {
          disabled: true,
          value: data?.salesTax ?? '',
        },
      },
      total: {
        inputAttr: {
          disabled: true,
          value: data?.total ?? '',
        },
      },
    },

    delivery: {
      deliveryLocation: {
        value: data?.deliveryLocation ?? '',
        onChange: (v) => {},
      },
      deliveryDate: {
        value: data?.deliveryDate ?? '',
        onChange: (v) => {},
      },
    },
    paymentMethod: {
      arr:
        data?.paymentMethods.map((item, index) => {
          const { milestone, totalPaymentRatio } = item;

          return {
            label: milestone,
            value: totalPaymentRatio,
            onChange: () => {},
            delSelf: () => {},
          };
          //
        }) ?? [],
      addMethod: (v) => {},
    },
  };

  const signatureArr = [
    {
      label: '總經理',
      inputProps: {
        props: {
          value: content?.reviewManagerEmployee?.chName ?? '',
        },
      },
    },
    {
      label: '工務主管',
      inputProps: {
        props: {
          value: content?.reviewWorkDirectorEmployee?.chName ?? '',
        },
      },
    },
    {
      label: '主管',
      inputProps: {
        props: {
          value: content?.reviewSupervisorEmployee?.chName ?? '',
        },
      },
    },
    {
      label: '業務',
      inputProps: {
        props: {
          value: content?.reviewSalesEmployee?.chName ?? '',
        },
      },
    },
    {
      label: '經辦',
      inputProps: {
        props: {
          value: content?.agentEmployee?.chName ?? '',
        },
      },
    },
  ];

  // 附件
  const { attachments, updateAttachments, domain } = useQuotation_id_attachments(content?.id);

  const [fileInfoArr, setFileInfoArr] = useState<TfileInfo[]>([]);

  useEffect(() => {
    const arr = attachments?.map((item) => {
      const imageReg = /^image/;
      const pdfReg = /pdf$/;
      const fileType = imageReg.test(item.mime) ? 'image' : pdfReg.test(item.mime) ? 'pdf' : 'other';

      return {
        fileId: item.id,
        fileType,
        fileName: item.name,
        fileSrc: `${domain}/file/download/${item.id}`,
        isNew: false,
      };
    });
    setFileInfoArr(arr ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachments]);

  const appendixParams = {
    fileInfoArr,
    removeFileInfo: () => {},
    toSetFileInfo: () => {},
  };

  // -----------------------------------------------------------------
  // =========================================================
  // =========================================================
  // =========================================================
  // =========================================================
  // 如果報價單編號錯誤(找不到這筆報價單)，就return NoQuotation
  // if (quotationId !== "newQuotation" && !quotationData)
  // if (!classQuotation) {
  //   return <NoQuotation quotationId={quotationId as string} />;
  // }

  // =========================================================

  // TODO: 暫時先註解
  // const quotationPdf_part_mainProductArr = (() => {
  //   const theArr = classQuotation.mainProductArr.map((mp) => {
  //     return {
  //       ...mp.allData,
  //       part: mp.partArr.map((part) => part.allData),
  //     };
  //   });

  //   return theArr;
  // })();

  // =========================================================

  // =========================================================
  return (
    <div className={style.container}>
      <PageHeader02 tagList={tagList} panelList={panelList} />
      {/*  */}
      <div className={style.mainContainer}>
        <div className={style.quotation}>
          {/* 報價單基本資料 */}
          <QuotationProfile profile={content} disabled={true} onProfileChange={() => {}} />

          {/* switch01 */}
          <div className={style.switchBar}>
            {!switch02 && (
              <div className={(switch01 && style.active) || ''} onClick={() => setSwitch01(true)}>
                合約項目
              </div>
            )}
            <div className={switch02 || !switch01 ? style.active : ''} onClick={() => setSwitch01(false)}>
              追加 / 追減項目
            </div>
          </div>

          {/* 合約項目 追加/追減項目 */}
          {switch01 || switch02 ? (
            <>
              {/* 主產品設定 */}
              {/* <QuotationProduction classQuotation={classQuotation} disabled={!allowEdit} /> */}
              <Table_prod
                disabled={true}
                prodList={productList}
                prodCellConfig={prodCellConfig}
                prodKeyArr={prodKeyArr}
                changeProdKeyArr={changeProdKeyArr}
                addProd={() => {}}
                setTargetProd={setTargetProdKey}
                panelBox="easyBox"
                emptyBlockWidth="80px"
                rowHeight={'h106'}
              />
              {/* 原報價項目 */}

              {switch02 && <OldQuotationProduction rootContent={rootContent} />}
              <br />
              <div className={style.redWrapper}>
                {/* 材料配件設定 */}
                <Table_com
                  disabled={true}
                  comList={targetProd?.comList}
                  comCellConfig={comCellConfig}
                  comKeyArr={comKeyArr}
                  changeComKeyArr={changeComKeyArr}
                  defalutVKeyArr={comVKeyArr}
                />
                <hr />
                {/* 選配設定 */}
                <br />
                <Table_accessories
                  disabled={true}
                  list={targetProd?.accessoriesList}
                  cellConfig={accessoriesCellConfig}
                  keyArr={accessoriesKeyArr}
                  changeKeyArr={changeAccessoriesKeyArr}
                  defalutVKeyArr={targetProd?.accessoriesVKeyArr}
                  onVKeyChange={(keyArr) => {
                    if (targetProd) {
                      targetProd.accessoriesVKeyArr = keyArr;
                    }
                  }}
                  doorModel={targetProd?.doorType}
                  onSelectorConfirm={(arr) => {}}
                  panelBox="easyBox"
                  emptyBlockWidth="80px"
                />
                <br />
                {/* 其他設定 */}
                <Table_others
                  disabled={true}
                  list={othersList}
                  cellConfig={othersCellConfig}
                  keyArr={othersKeyArr}
                  changeKeyArr={() => {}}
                  add={() => {}}
                />
              </div>
            </>
          ) : (
            // 追加/追減項目
            <QuotationProdChangingRecord subContract={data?.subContracts} rootContractTotal={rootContent?.total ?? 0} />
          )}

          {/* 展開版本的追加追減紀錄 (在很下面)*/}
          {switch02 && <QuotationRecord subContract={data?.subContracts} rootContractTotal={rootContent?.total ?? 0} />}

          <Summary
            disabled={true}
            payInfoControl={payInfoControl}
            control_anno={control_anno}
            control_qr={control_qr}
            appendixParams={appendixParams}
          />

          {/* 簽名 */}
          <QuotationSinature signatureArr={signatureArr} disabled={true} />
        </div>
      </div>
      {/* TODO 暫時先註解 */}
      {/* <QuotationPdf
        isVisable={showPdf}
        onCancel={() => {
          setShowPdf(false);
        }}
        classQuotation={classQuotation}
      /> */}
      {/* TODO 暫時先註解 */}
      {/* <QuotationPdf_part
        isVisable={showPdf_part}
        onCancel={() => {
          setShowPdf_part(false);
        }}
        mainProductArr={quotationPdf_part_mainProductArr}
        quotationId={classQuotation.quotationId}
      /> */}
    </div>
  );
}

// ===============================================================
// 應該用不到了
// const NoQuotation = ({ quotationId }: { quotationId: string }) => {
//   const router = useRouter();

//   const toBack = () => {
//     router.back();
//   };

//   return (
//     <div className={style.noQuotation}>
//       <span>沒有這個報價單ID</span>
//       <span>{quotationId}</span>
//       <button onClick={toBack}>回上一頁</button>
//     </div>
//   );
// };

// =========================================================

const OldQuotationProduction = ({
  // prodList,
  // prodCellConfig,
  // prodKeyArr,
  // changeProdKeyArr,
  // setTargetProd,
  rootContent,
}: {
  // prodList: Parameters<typeof Table_prod>[0]['prodList'];
  // prodCellConfig: Parameters<typeof Table_prod>[0]['prodCellConfig'];
  // prodKeyArr: Parameters<typeof Table_prod>[0]['prodKeyArr'];
  // changeProdKeyArr: Parameters<typeof Table_prod>[0]['changeProdKeyArr'];
  // setTargetProd: Parameters<typeof Table_prod>[0]['setTargetProd'];
  rootContent: TquotationContentDto | undefined;
}) => {
  const [isActive, setIsActive] = useState(false);
  const panelSwitch = () => setIsActive(!isActive);

  const {
    reRender,
    reset,
    //
    productList,
    prodCellConfig,
    prodKeyArr,
    prodVKeyArr,
    setProdVKeyArr,
    addProd,
    changeProdKeyArr,
    //
    subTotal,
    //
    comKeyArr,
    comVKeyArr,
    comCellConfig,
    changeComKeyArr,
    //
    accessoriesKeyArr,
    changeAccessoriesKeyArr,
    accessoriesCellConfig,
    //
    othersKeyArr,
    othersList,
    othersCellConfig,
    changeOthersKeyArr,
    addOthers,
    getOthersPostBodyArr,
  } = useProductList({
    productArr: rootContent?.products ?? [],
    others: [],
    resetTrigger: rootContent?.products,
  });

  const [targetProdKey, setTargetProdKey] = useState<string>('n');
  const targetProd = productList[targetProdKey];

  return (
    <Collapse
      className={`${style.oldQuotationProduction}`}
      expandIcon={() => <></>}
      accordion={false}
      activeKey={+!isActive} //在這個情境 0會開 其他數字會關 所以要把這邊的isActive反轉
    >
      <Panel key={0} header={<OqpHeader isActive={isActive} panelSwitch={panelSwitch} />}>
        <Table_prod
          disabled={true}
          prodList={productList}
          prodCellConfig={prodCellConfig}
          prodKeyArr={prodKeyArr}
          changeProdKeyArr={changeProdKeyArr}
          addProd={() => {}}
          setTargetProd={setTargetProdKey}
        />

        {/* <Table_com
          disabled={true}
          comList={targetProd?.comList}
          comCellConfig={comCellConfig}
          comKeyArr={comKeyArr}
          changeComKeyArr={changeComKeyArr}
          defalutVKeyArr={comVKeyArr}
        /> */}

        {/* <Table_accessories
          disabled={true}
          list={targetProd?.accessoriesList}
          cellConfig={accessoriesCellConfig}
          keyArr={accessoriesKeyArr}
          changeKeyArr={changeAccessoriesKeyArr}
          defalutVKeyArr={targetProd?.accessoriesVKeyArr}
          onVKeyChange={(keyArr) => {
            if (targetProd) {
              targetProd.accessoriesVKeyArr = keyArr;
            }
          }}
          doorModel={targetProd?.doorType}
          onSelectorConfirm={(arr) => {
            if (targetProd) {
              targetProd.addAcce(arr);
            }
          }}
        /> */}
      </Panel>
    </Collapse>
  );
};

// oqp就是OldQuotationProduction
const OqpHeader = ({ isActive, panelSwitch }: { isActive: boolean; panelSwitch: () => void }) => {
  const active = isActive ? style.active : '';

  return (
    <div className={`${style.OqpHeader} ${active}`}>
      <span>原報價項目</span>
      <button className={style.panelButton} onClick={panelSwitch}>
        <span>展開</span>
        <RotatingArrow01 deg={0} defaultDeg={-180} isActive={!isActive} />
      </button>
    </div>
  );
};

// ======================================================================

// const OldQuotationProduction = ({
//   classQuotation,
// }: {
//   classQuotation: Parameters<typeof QuotationProduction>[0]['classQuotation'];
// }) => {
//   const [isActive, setIsActive] = useState(false);
//   const panelSwitch = () => setIsActive(!isActive);

//   return (
//     <Collapse
//       className={`${style.oldQuotationProduction}`}
//       expandIcon={() => <></>}
//       accordion={false}
//       activeKey={+!isActive} //在這個情境 0會開 其他數字會關 所以要把這邊的isActive反轉
//     >
//       <Panel key={0} header={<OqpHeader isActive={isActive} panelSwitch={panelSwitch} />}>
//         {/* <QuotationProduction
//           className={style.quotationProduction}
//           mainProductArr={productStates} /> */}
//         {/* <QuotationProduction className={style.quotationProduction} classQuotation={classQuotation} disabled={true} /> */}
//       </Panel>
//     </Collapse>
//   );
// };
