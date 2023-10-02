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
import QuotationSinature from 'components/page/domestic/quotation/quotationSinature';
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

// hook

import useProduct from 'components/page/domestic/quotation/hook/useProduct';

// icon
import iconUpload from 'public/image/icon/upload.svg';

// css
import style from './quotation.module.scss';

// fakeData type
import { Tquotation, fakeQuotationObjListOri } from 'fakeDatabase/domestic/quotation/fakeQuotationList';
import { fakeProdChangingRecordList } from 'fakeDatabase/domestic/quotation/fakeChangeProductRecord';

// 生成假資料
const fakeQuotationObjList = fakeQuotationObjListOri();

// =============================================================
// =============================================================
// =============================================================
import { fakeApi_quotation_creator } from 'fakeDatabase/fakeAPI/fakeQuotationApi';
import { useQuotation } from 'hooks/quotation/useQuotation';
import { fakeApi_client } from 'fakeDatabase/fakeAPI/fakeClientApi';
import { fakeApi_memo } from 'fakeDatabase/fakeAPI/fakeMemoApi';
import { fakeApi_quoteRange } from 'fakeDatabase/fakeAPI/fakeQuoteRangeApi';

// =============================================================
// =============================================================
// =============================================================

import { useGetQuotation_id } from 'js/api/api_quotation';

import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
import Table_com from 'components/page/domestic/quotation/quotation/product/table_component';
import Table_accessories from 'components/page/domestic/quotation/quotation/product/table_accessories';
import Table_others from 'components/page/domestic/quotation/quotation/product/table_others';

import { prodCellConfig } from 'hooks/quotation/prodCellConfig';

import { useProductList } from 'hooks/quotation/useProduct';

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
    quotationId, //報價單id
  } = router.query;

  // =========================================================

  const { data, update } = useGetQuotation_id(quotationId as string | undefined);

  useEffect(() => {
    update();
  }, [quotationId]);

  // =========================================================
  // 正式接上api前先這樣處理
  const quotationData: Tquotation | undefined = fakeQuotationObjList[quotationId as string];

  // =========================================================
  // 是否可編輯
  const [allowEdit, setAllowEdit] = useState(quotationId === 'newQuotation' ? true : false);
  // =========================================================
  // =========================================================
  // =========================================================
  const fakeApiQuotaion = fakeApi_quotation_creator(router.query.quotationId as string);

  const { classQuotation, reNew: reNewClassQuotation } = useQuotation(fakeApiQuotaion?.get());
  const fakeClientList = fakeApi_client.get();
  const classSignature = classQuotation?.classSignature;
  const signatureArr = [
    {
      label: '經理',
      signature: classSignature?.manager ?? '',
      onChange: (v: string) => {
        if (classSignature) {
          classSignature.manager = v;
        }
      },
    },
    {
      label: '主管',
      signature: classSignature?.director ?? '',
      onChange: (v: string) => {
        if (classSignature) {
          classSignature.director = v;
        }
      },
    },
    {
      label: '經辦',
      signature: classSignature?.attn ?? '',
      onChange: (v: string) => {
        if (classSignature) {
          classSignature.attn = v;
        }
      },
    },
  ];

  const getFakeMemo = fakeApi_memo.get;
  const getFakeQuotaRange = fakeApi_quoteRange.get;

  useEffect(() => {
    reNewClassQuotation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowEdit]);

  // ======================================================
  // ======================================================
  // ======================================================
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
  // 主產品資料
  const prodState = useProduct(quotationData?.productList, !allowEdit);

  // =========================================================
  // 追加追減項目
  const prodChangingRecord = useMemo(() => {
    if (typeof quotationId === 'string') {
      return fakeProdChangingRecordList[quotationId];
    }
  }, [quotationId]);
  // =========================================================

  const tagList: TtagList = [
    {
      label: `報價編號 ${quotationId}`,
      onClick: () => alert(quotationId),
    },
    { label: '工程聯絡單', onClick: () => alert('工程聯絡單') },
  ];

  const panel_quotation01: TpanelList = [
    {
      type: 'myButton',
      label: '追加追減報價單',
      onClick: () => setSwitch02(() => true),
    },
    {
      type: 'myButton',
      label: '匯出報價單',
      img: iconUpload.src,
      onClick: () => setShowPdf(true),
    },
    {
      type: 'myButton',
      label: '匯出材料/配件',
      img: iconUpload.src,
      onClick: () => setShowPdf_part(true),
    },
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
    {
      type: 'myButton',
      label: '匯出報價單',
      img: iconUpload.src,
      onClick: () => alert('匯出單價分析'),
    },
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
  const latestcontent = data?.latestContent;
  const firstContent = (_.sortBy(data?.contents, 'createdAt') ?? [])[0];

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
    productArr: latestcontent?.products ?? [],
    others: [],
    resetTrigger: undefined,
  }); // latest

  const [targetProdKey, setTargetProdKey] = useState<string>('n');
  const targetProd = productList[targetProdKey];

  // -----------------------------------------------------------------
  const {
    reRender: reRender_fist,
    reset: reset_fist,
    //
    productList: productList_first,
    prodCellConfig: prodCellConfig_first,
    prodKeyArr: prodKeyArr_first,
    prodVKeyArr: prodVKeyArr_first,
    setProdVKeyArr: setProdVKeyArr_first,
    addProd: addProd_first,
    changeProdKeyArr: changeProdKeyArr_first,
    //
    subTotal: subTotal_first,
    //
    comKeyArr: comKeyArr_first,
    comVKeyArr: comVKeyArr_first,
    comCellConfig: comCellConfig_first,
    changeComKeyArr: changeComKeyArr_first,
    //
    accessoriesKeyArr: accessoriesKeyArr_first,
    changeAccessoriesKeyArr: changeAccessoriesKeyArr_first,
    accessoriesCellConfig: accessoriesCellConfig_first,
    //
    othersKeyArr: othersKeyArr_first,
    othersList: othersList_first,
    othersCellConfig: othersCellConfig_first,
    changeOthersKeyArr: changeOthersKeyArr_first,
    addOthers: addOthers_first,
    getOthersPostBodyArr: getOthersPostBodyArr_first,
  } = useProductList({
    productArr: firstContent?.products ?? [],
    others: [],
    resetTrigger: undefined,
  }); // latest

  // -----------------------------------------------------------------
  // =========================================================
  // =========================================================
  // =========================================================
  // =========================================================
  // 如果報價單編號錯誤(找不到這筆報價單)，就return NoQuotation
  // if (quotationId !== "newQuotation" && !quotationData)
  if (!classQuotation) {
    return <NoQuotation quotationId={quotationId as string} />;
  }

  // =========================================================
  const quotationPdf_part_mainProductArr = (() => {
    const theArr = classQuotation.mainProductArr.map((mp) => {
      return {
        ...mp.allData,
        part: mp.partArr.map((part) => part.allData),
      };
    });

    return theArr;
  })();

  // =========================================================

  // =========================================================
  return (
    <div className={style.container}>
      <PageHeader02 tagList={tagList} panelList={panelList} />
      {/*  */}
      <div className={style.mainContainer}>
        <div className={style.quotation}>
          {/* 報價單基本資料 */}
          <QuotationProfile profile={latestcontent} disabled={true} onProfileChange={() => {}} />

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
              />
              {/* 原報價項目 */}
              {/* {switch02 && <OldQuotationProduction classQuotation={classQuotation} />} */}
              {switch02 && (
                <Table_prod
                  disabled={true}
                  prodList={productList_first}
                  prodCellConfig={prodCellConfig_first}
                  prodKeyArr={prodKeyArr_first}
                  changeProdKeyArr={changeProdKeyArr}
                  addProd={() => {}}
                  setTargetProd={setTargetProdKey}
                />
              )}
              <div className={style.redWrapper}>
                {/* 材料配件設定 */}
                {/* <QuotationComponent classQuotation={classQuotation} disabled={!allowEdit} /> */}
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
                {/* <QuotationAccessory activeRow={prodState.activeRow} /> */}
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
                  onSelectorConfirm={(arr) => {
                    if (targetProd) {
                      targetProd.addAcce(arr);
                    }
                  }}
                />
              </div>
            </>
          ) : (
            // 追加/追減項目
            <QuotationProdChangingRecord prodChangingRecord={prodChangingRecord} />
          )}

          {/* 展開版本的追加追減紀錄 (在很下面)*/}
          {switch02 && <QuotationRecord prodChangingRecord={prodChangingRecord} />}

          {/* 備註/報價範圍/付款資訊 */}
          <QuotationTotal
            classQuotation={classQuotation}
            getFakeMemo={getFakeMemo}
            getFakeQuotaRange={getFakeQuotaRange}
            disabled={!allowEdit}
          />
          {/* 簽名 */}
          {/* <QuotationSinature signatureArr={signatureArr} disabled={!allowEdit} /> */}
        </div>
      </div>
      <QuotationPdf
        isVisable={showPdf}
        onCancel={() => {
          setShowPdf(false);
        }}
        classQuotation={classQuotation}
      />

      <QuotationPdf_part
        isVisable={showPdf_part}
        onCancel={() => {
          setShowPdf_part(false);
        }}
        mainProductArr={quotationPdf_part_mainProductArr}
        quotationId={classQuotation.quotationId}
      />
    </div>
  );
}

// ===============================================================

const NoQuotation = ({ quotationId }: { quotationId: string }) => {
  const router = useRouter();

  const toBack = () => {
    router.back();
  };

  return (
    <div className={style.noQuotation}>
      <span>沒有這個報價單ID</span>
      <span>{quotationId}</span>
      <button onClick={toBack}>回上一頁</button>
    </div>
  );
};

// =========================================================

const OldQuotationProduction = ({
  classQuotation,
}: {
  classQuotation: Parameters<typeof QuotationProduction>[0]['classQuotation'];
}) => {
  const [isActive, setIsActive] = useState(false);
  const panelSwitch = () => setIsActive(!isActive);

  return (
    <Collapse
      className={`${style.oldQuotationProduction}`}
      expandIcon={() => <></>}
      accordion={false}
      activeKey={+!isActive} //在這個情境 0會開 其他數字會關 所以要把這邊的isActive反轉
    >
      <Panel key={0} header={<OqpHeader isActive={isActive} panelSwitch={panelSwitch} />}>
        {/* <QuotationProduction
          className={style.quotationProduction}
          mainProductArr={productStates} /> */}
        <QuotationProduction className={style.quotationProduction} classQuotation={classQuotation} disabled={true} />
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
