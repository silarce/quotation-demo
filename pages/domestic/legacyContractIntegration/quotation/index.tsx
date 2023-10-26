// 舊合約
// 舊合約
// 舊合約

/**
關於垂直排序記錄功能
現在後端沒有紀錄order
前端也沒有做在Class_legacyContract裡做紀錄

現在的垂直排序是因應臨時需求做出來的
只有很簡單的在QuotationProduction.ProductList_legacy裡面
使用useVerticalDnd做垂直排序

之後要做這樣的功能的話
預期後端會在product裡面放order
前端再用order排序prodcut
建立prodList的時候以order為key
如果有重複的order，就用nanoid代替
再用prodList建立prodKeyArr

然後把prodList送進useVerticalDnd
useVerticalDnd的onChange用來改變prodKeyArr
prodKeyArr用來map 主產品列表、與exchangePanel(追加追減面板)與pdf

上傳前，先用prodKeyArr.forEach，依序改變prodList的order就可以了

 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
import QuotationProfile from 'components/page/domestic/quotation/legacyContract/quotationProfile_legacyContract';
import QuotationProduction from 'components/page/domestic/quotation/legacyContract/quotationProduct_legacyContract';
import QuotationAdditions from 'components/page/domestic/quotation/legacyContract/quotationAdditions_legacyContract';
import QuotationTotal from 'components/page/domestic/quotation/legacyContract/quotationTotal_legacyContract';
import QuotationSinature, { TinputProps } from 'components/page/domestic/quotation/quotationSinature';

import QuotationPdf from 'components/page/domestic/pdf/quotationPdf/quotationPdf_legacyContract';

// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
// import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// icon
import iconUpload from 'public/image/icon/upload.svg';

// css
import style from './quotation.module.scss';
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
  apiPostLegacyContracts,
  apiPatchLegacyContracts_id,
  apiPostLegacyContracts_id_attachments,
  apiDelLegacyContracts_id_attachments,
} from 'js/api/api_legacy-contract';

// type
import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';
import { fi } from 'date-fns/locale';

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

// =====================================================================
// =====================================================================
// =====================================================================
function TheQuotation({ router }: { router: NextRouter }) {
  /**合約id，若為undefined就逮代表為新增合約 */
  const contractId = router.query.contractId as string | undefined;

  // --------------------------------------------------------------------------
  const [allowEdit, setAllowEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [verticalKeyArr, setVerticalKeyArr] = useState<string[]>([]);
  console.log(verticalKeyArr);

  // --------------------------------------------------------------------------
  const [legacyContractParams, setLegacyContractParams] = useState({
    populate: ['customer', 'products', 'additions'],
  });

  const { legacyContract, updateLegacyContract } = useLegacyContract_id(contractId, legacyContractParams);
  const latestBatch = legacyContract?.latestBatch;

  // 這是class
  const { classLegacyContract, reset } = useLegacyContract({ contract: legacyContract, batch: 0 });

  const { attachments, updateAttachments, domain } = useLegacyContracts_id_attachments(contractId);

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

  const removeFileInfo = (index: number) => {
    fileInfoArr[index].willDelete = true;
    setFileInfoArr([...fileInfoArr]);
    // removeFile(index)
  };

  const toSetFileInfo = (newImgInfoArr: TfileInfo[]) => {
    setFileInfoArr([...newImgInfoArr]);
  };

  const appendixParams = {
    fileInfoArr,
    removeFileInfo,
    toSetFileInfo,
  };

  const uploadAttachment = async (contractId: string) => {
    // 移除附件
    for (const info of fileInfoArr) {
      const { fileId, willDelete, isNew } = info;

      if (!fileId || !willDelete || isNew) {
        continue;
      }

      try {
        await apiDelLegacyContracts_id_attachments(contractId, fileId);
      } catch (error) {
        console.log(error);
      }
    }

    // 上傳附件
    for (const info of fileInfoArr) {
      const { fileId, willDelete, isNew, file } = info;

      if (fileId || !file || willDelete || !isNew) {
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        await apiPostLegacyContracts_id_attachments(contractId, formData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await Promise.all([updateLegacyContract(), updateAttachments()]);
      } catch (error) {
        myAlert.err({ title: '取得舊合約失敗' });
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);

  // --------------------------------------------------------------------------

  const classSignature = classLegacyContract.classSignature;
  const signatureArr: { label: string; inputProps: TinputProps }[] = [
    {
      label: '經理',
      inputProps: {
        props: {
          value: classSignature.managerName,
          onChange: (e) => {
            classSignature.managerName = e.target.value;
          },
        },
      },
    },
    {
      label: '主管',
      inputProps: {
        props: {
          value: classSignature.supervisorName,
          onChange: (e) => {
            classSignature.supervisorName = e.target.value;
          },
        },
      },
    },
    {
      label: '經辦',
      inputProps: {
        props: {
          value: classSignature.operatorName,
          onChange: (e) => {
            classSignature.operatorName = e.target.value;
          },
        },
      },
    },
  ];

  useEffect(() => {
    if (allowEdit) {
      return;
    }

    reset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowEdit, legacyContract]);

  // -----------------------------------------------------------------------
  const [showPdf, setShowPdf] = useState(false);
  // -----------------------------------------------------------------------
  const tagList: TtagList = [
    {
      label: `合約編號 ${classLegacyContract.classBasicInfo.contractNumber}`,
      onClick: () => {},
    },
    // { label: "工程聯絡單", onClick: () => alert("工程聯絡單") },
  ];

  const panel_editable: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: async () => {
        const postBody = classLegacyContract.postBody;

        if (!postBody) {
          return;
        }

        if (!postBody.contractNumber) {
          return myAlert.warning({ title: '請輸入合約編號' });
        }

        if (!postBody.projectName) {
          return myAlert.warning({ title: '請輸入工程名稱' });
        }

        // if (!postBody.customerId) {
        //   return myAlert.warning({ title: '請選擇客戶' });
        // }

        const { projectCity, projectDistrict, projectAddress } = postBody;

        if (!projectCity && !projectDistrict && !projectAddress) {
          return myAlert.warning({ title: '請輸入地址' });
        }

        try {
          setIsLoading(true);
          const res = contractId
            ? await apiPatchLegacyContracts_id(contractId, classLegacyContract.postBody)
            : await apiPostLegacyContracts(classLegacyContract.postBody);

          await uploadAttachment(res.id);

          if (contractId) {
            await Promise.all([updateLegacyContract(), updateAttachments()]);
          } else {
            router.push({ query: { contractId: res.id } });
          }

          myAlert.success({ title: '上傳完成' });
          setAllowEdit(false);
        } catch {
          myAlert.err({ title: '上傳失敗' });
        } finally {
          setIsLoading(false);
        }
      },
    },
    { type: 'myButton', label: '取消', onClick: () => setAllowEdit(false) },
  ];

  const editBtn: TpanelList[number] = !latestBatch
    ? {
        type: 'myButton',
        label: '編輯',
        onClick: () => setAllowEdit(true),
      }
    : undefined;

  const panel_noEditable: TpanelList = [
    !contractId
      ? undefined
      : {
          type: 'myButton',
          label: '追加追減',
          onClick: () =>
            router.push({
              // target: '_blank', // 不能用
              pathname: '/domestic/legacyContractIntegration/quotation/append',
              query: {
                contractId: router.query.contractId,
                batch: latestBatch,
                isAppending: 'true',
              },
            }),
        },
    {
      type: 'myButton',
      label: '匯出舊合約',
      img: iconUpload.src,
      onClick: () => setShowPdf(true),
    },

    editBtn,

    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        // router.back()
        router.push({
          pathname: '/domestic/legacyContractIntegration',
        });
      },
    },
  ];

  // -----------------------------------------------------------------------
  if (!classLegacyContract) {
    return null;
  }

  // console.log(classLegacyContract.postBody);

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader02 tagList={tagList} panelList={allowEdit ? panel_editable : panel_noEditable} />

      <div>
        <div className={style.quotation}>
          {/* 基本資料 */}
          <QuotationProfile
            classLegacyContract={classLegacyContract}
            classBasicInfo={classLegacyContract.classBasicInfo}
            disabled={!allowEdit}
          />
          {/*  */}
          <div className={style.switchBar}>
            <div className={style.active}>合約項目</div>
          </div>
          {/* 主產品設定 */}
          <QuotationProduction
            legacyContract={classLegacyContract}
            disabled={!allowEdit}
            isAppend={false}
            control_vKeyArr={{
              vKeyArr: verticalKeyArr,
              onChange: setVerticalKeyArr,
            }}
          />
          {/* 其他設定 */}
          <QuotationAdditions legacyContract={classLegacyContract} disabled={!allowEdit} />
          {/* 備註/報價範圍/付款資訊 */}
          <QuotationTotal legacyContract={classLegacyContract} disabled={!allowEdit} appendixParams={appendixParams} />
          {/* 簽名 */}
          <QuotationSinature signatureArr={signatureArr} disabled={!allowEdit} />
        </div>
      </div>
      <QuotationPdf
        isVisable={showPdf}
        onCancel={() => {
          setShowPdf(false);
        }}
        classLegacyContract={classLegacyContract}
        verticalKeyArr={verticalKeyArr}
      />
    </SubLayer>
  );
}
