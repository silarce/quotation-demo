// 舊合約
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextRouter } from 'next/router';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
import QuotationProfile from 'components/page/domestic/quotation/legacyContract/quotationProfile_legacyContract';
import QuotationProduction from 'components/page/domestic/quotation/legacyContract/quotationProduct_legacyContract';
import QuotationAdditions from 'components/page/domestic/quotation/legacyContract/quotationAdditions_legacyContract';
import QuotationTotal from 'components/page/domestic/quotation/legacyContract/quotationTotal_legacyContract';
import QuotationSinature, { TinputProps } from 'components/page/domestic/quotation/quotationSinature';
import QuotationExProd from 'components/page/domestic/quotation/legacyContract/quotationExProd_legacyContract';
import QuotationExAddi from 'components/page/domestic/quotation/legacyContract/quotationExAddi_legacyContract';

import QuotationPdf from 'components/page/domestic/pdf/quotationPdf/quotationPdf_legacyContract';

// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// css
import scss from './quotation.module.scss';
// ========================================================================
// ========================================================================
// hook
import { useLegacyContract } from 'hooks/quotation/legacy/useLegacyContract';
// ========================================================================
// ========================================================================
// api
import {
  useLegacyContract_id,
  useLegacyContracts_id_attachments,
  apiPatchLegacyContracts_id_modify,
} from 'js/api/api_legacy-contract';

// type
import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';

// ========================================================================
// ========================================================================
// ========================================================================

export default function Quotation() {
  const router = useRouter();
  const isReady = router.isReady;

  if (!isReady) {
    return null;
  }

  return <TheQuotation router={router} />;
}

function TheQuotation({ router }: { router: NextRouter }) {
  /**合約id，若為undefined就逮代表為新增合約 */
  const contractId = router.query.contractId as string | undefined;
  const batch = (router.query.batch as `${number}` | undefined) || '0';

  const [showPdf, setShowPdf] = useState(false);

  // --------------------------------------------------------------------------
  const [legacyContractParams, setLegacyContractParams] = useState({
    populate: ['customer', 'products', 'additions', 'priceRecord'],
  });

  const { legacyContract, updateLegacyContract } = useLegacyContract_id(contractId, legacyContractParams);

  if (legacyContract) {
    legacyContract.contractNumber = '';
  }

  // 這是class
  const { classLegacyContract, reset } = useLegacyContract({
    //
    contract: legacyContract,
    batch: Number(batch),
    isAppend: true,
  });

  const { attachments, updateAttachments, domain } = useLegacyContracts_id_attachments(contractId);

  const isLatestBatch = legacyContract?.latestBatch === Number(batch);

  // --------------------------------------------------------------------------
  // 其實不會用到，但是有一個元件必須要送進去
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
        fileSrc: `${domain}file/download/${item.id}`,
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

  // --------------------------------------------------------------------------

  useEffect(() => {
    (async () => {
      await Promise.all([updateLegacyContract(), updateAttachments()]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId, batch]);

  // --------------------------------------------------------------------------

  const classSignature = classLegacyContract.classSignature;
  const signatureArr: { label: string; inputProps: TinputProps }[] = [
    {
      label: '經理',
      inputProps: {
        props: {
          value: classSignature.managerName,
        },
      },
    },
    {
      label: '主管',
      inputProps: {
        props: {
          value: classSignature.supervisorName,
        },
      },
    },
    {
      label: '經辦',
      inputProps: {
        props: {
          value: classSignature.operatorName,
        },
      },
    },
  ];

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legacyContract]);

  // -----------------------------------------------------------------------
  const tagList: TtagList = [
    {
      label: `合約編號 ${classLegacyContract.classBasicInfo.contractNumber}`,
      onClick: () => {},
    },
  ];

  const uploadPanel: TpanelList[number] = {
    type: 'myButton',
    label: '上傳',
    onClick: async () => {
      const appendBody = classLegacyContract.appendBody;

      if (!appendBody) {
        return;
      }

      const id = legacyContract?.id;

      if (!id) {
        return;
      }

      if (!appendBody.batchNumber) {
        return myAlert.warning({ title: '請輸入追加追減合約編號', content: '右上方的合約編號欄位' });
      }

      //
      try {
        showRootLoading(true);
        const res = await apiPatchLegacyContracts_id_modify({
          id,
          body: appendBody,
        });
        myAlert.success({ title: '上傳完成' });

        showRootLoading(false);
        router.push({
          pathname: '/domestic/legacyContractIntegration/quotation/append',
          query: {
            contractId: contractId,
            batch: res.latestBatch,
          },
        });
      } catch (error) {
        myAlert.err({ title: '上傳失敗' });
      } finally {
        showRootLoading(false);
      }
      //
    },
  };

  const panel: TpanelList = [
    //
    {
      type: 'myButton',
      label: '匯出報價單',
      onClick: () => {
        setShowPdf(true);
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        //
        // router.back();
        router.push({
          pathname: '/domestic/legacyContractIntegration/quotation',
          query: {
            contractId: contractId,
          },
        });
      },
    },
    isLatestBatch ? uploadPanel : undefined,
  ];

  // -----------------------------------------------------------------------
  if (!classLegacyContract) {
    return null;
  }

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader02 tagList={tagList} panelList={panel} />

      <div>
        <div className={scss.quotation}>
          {/* 基本資料 */}
          <QuotationProfile
            classLegacyContract={classLegacyContract}
            classBasicInfo={classLegacyContract.classBasicInfo}
            disabled={true}
            isAppend={true}
            isLatestBatch={isLatestBatch}
          />
          {/*  */}
          <div className={scss.switchBar}>
            <div className={scss.active}>合約項目</div>
          </div>
          {/* 主產品設定 */}
          <QuotationProduction
            legacyContract={classLegacyContract}
            disabled={true}
            isAppend={true}
            isLatestBatch={isLatestBatch}
          />
          {/* 配件設定 */}
          <QuotationAdditions
            legacyContract={classLegacyContract}
            disabled={true}
            isAppend={true}
            isLatestBatch={isLatestBatch}
          />
          {/* 變更 主產品 */}
          {isLatestBatch && <QuotationExProd legacyContract={classLegacyContract} disabled={false} />}
          {/* 變更 配件設定 */}
          {isLatestBatch && <QuotationExAddi legacyContract={classLegacyContract} disabled={false} />}
          {/*  */}
          <div className={scss.exchangeTotal}>
            <span>總合計</span>
            <span>{classLegacyContract.exchangeTotal}</span>
          </div>
          {/* 備註/報價範圍/付款資訊 */}
          <QuotationTotal legacyContract={classLegacyContract} disabled={true} appendixParams={appendixParams} />
          {/* 簽名 */}
          <QuotationSinature signatureArr={signatureArr} disabled={true} />
        </div>
      </div>
      <QuotationPdf
        isVisable={showPdf}
        onCancel={() => {
          setShowPdf(false);
        }}
        classLegacyContract={classLegacyContract}
      />
    </SubLayer>
  );
}
