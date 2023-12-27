// 舊合約
// 舊合約
// 舊合約

/**
關於主產品的垂直排序
主產品的垂直排序，紀錄排序的property是order
在useLegacyContract裡用
copyContract.products = _.sortBy(copyContract.products, 'order');
之後會改用[verticalKeyArr,setVerticalKeyArr]紀錄排序狀態
排序的功能則在QuotationProduction裡的ProductList_legacy裡的useVerticalDnd處理

上傳時，在useLegacyContract的postBody

  const orderedProdArr = this.verticalKeyArr.map((key) => {
      return this._prodList[key];
    });
    
    legacyContractCopy.products = Object.values(orderedProdArr).map((prod, index) => {
      const thePost = prod.postProd;
      thePost.order = index;

      return thePost;
    });

得到正確排序的陣列，置入order
然後才送給後端

 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextRouter } from 'next/router';
import _ from 'lodash';
import { AxiosError } from 'axios';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
import QuotationProfile from 'components/page/domestic/quotation/legacyContract/quotationProfile_legacyContract';
import QuotationProduction from 'components/page/domestic/quotation/legacyContract/quotationProduct_legacyContract';
import QuotationAdditions from 'components/page/domestic/quotation/legacyContract/quotationAdditions_legacyContract';
import QuotationTotal from 'components/page/domestic/quotation/legacyContract/quotationTotal_legacyContract';
import QuotationSinature, {
  Tcontrol_sinature,
  TemployeeDto,
} from 'components/page/domestic/quotation/quotationSinature_2';

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
function TheQuotation({ router }: { router: NextRouter }) {
  /**合約id，若為undefined就逮代表為新增合約 */
  const contractId = router.query.contractId as string | undefined;

  // --------------------------------------------------------------------------
  const [disbaled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [verticalKeyArr, setVerticalKeyArr] = useState<string[]>([]);
  const [verticalKeyArr_addi, setVerticalKeyArr_addi] = useState<string[]>([]);

  // --------------------------------------------------------------------------
  const [legacyContractParams, setLegacyContractParams] = useState({
    populate: [
      //
      'customer',
      'products',
      'additions',
      'manager',
      'supervisor',
      'operator',
      'notesRecord',
    ],
  });

  const { legacyContract, updateLegacyContract } = useLegacyContract_id(contractId, legacyContractParams);
  const latestBatch = legacyContract?.latestBatch;

  // 這是class
  const {
    classLegacyContract,
    reset,
    //  notesArrBeforeThisBatchAndThisBatch
  } = useLegacyContract({
    contract: legacyContract,
    batch: 0,
    verticalKeyArr,
    verticalKeyArr_addi,
  });

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

  useEffect(() => {
    if (disbaled) {
      reset();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disbaled, legacyContract]);

  // -----------------------------------------------------------------------
  const [showPdf, setShowPdf] = useState(false);
  // -----------------------------------------------------------------------
  const tagList: TtagList = [
    {
      label: `合約編號 ${classLegacyContract.classBasicInfo.contractNumber}`,
      onClick: () => {},
    },
  ];

  const panel_editable: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: async () => {
        const postBody = _.cloneDeep(classLegacyContract.postBody);

        if (!postBody) {
          return;
        }

        if (!postBody.contractNumber) {
          return myAlert.warning({ title: '請輸入合約編號' });
        }

        if (!postBody.projectName) {
          return myAlert.warning({ title: '請輸入工程名稱' });
        }

        const { projectCity, projectDistrict, projectAddress } = postBody;

        if (!projectCity && !projectDistrict && !projectAddress) {
          return myAlert.warning({ title: '請輸入地址' });
        }

        postBody.managerId = emp_manager?.id || null;
        postBody.supervisorId = emp_director?.id || null;
        postBody.operatorId = emp_agent?.id || null;

        postBody.additions = postBody.additions.map((item, index) => {
          item.order = index;

          return item;
        });

        try {
          setIsLoading(true);
          const res = contractId
            ? await apiPatchLegacyContracts_id(contractId, postBody)
            : await apiPostLegacyContracts(postBody);

          await uploadAttachment(res.id);

          if (contractId) {
            await Promise.all([updateLegacyContract(), updateAttachments()]);
          } else {
            router.push({ query: { contractId: res.id } });
          }

          myAlert.success({ title: '上傳完成' });
          setDisabled(true);
        } catch (error) {
          const err = error as AxiosError<{
            error: string;
            message: string;
            statusCode: number;
          }>;

          myAlert.err({ title: '上傳失敗', content: err.response?.data.message });
        } finally {
          setIsLoading(false);
        }
      },
    },
    { type: 'myButton', label: '取消', onClick: () => setDisabled(true) },
  ];

  const editBtn: TpanelList[number] = !latestBatch
    ? {
        type: 'myButton',
        label: '編輯',
        onClick: () => setDisabled(false),
      }
    : undefined;

  const panel_noEditable: TpanelList = [
    // 舊合約的追加追減功能已棄用
    !contractId
      ? undefined
      : {
          type: 'myButton',
          label: '追加追減',
          className: ' opacity-50',
          onClick: () => {
            myAlert.info({ title: '此功能已棄用', content: '如有需求請洽資訊部' });
            // router.push({
            //   pathname: '/domestic/legacyContractIntegration/quotation/append',
            //   query: {
            //     contractId: router.query.contractId,
            //     batch: latestBatch,
            //     isAppending: 'true',
            //   },
            // });
          },
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

  const [emp_manager, setEmp_manager] = useState<TemployeeDto | null>();
  const [emp_director, setEmp_director] = useState<TemployeeDto | null>();
  const [emp_agent, setEmp_agent] = useState<TemployeeDto | null>();

  useEffect(() => {
    const { manager, supervisor, operator } = legacyContract ?? {};
    setEmp_manager(manager);
    setEmp_director(supervisor);
    setEmp_agent(operator);
  }, [disbaled, legacyContract]);

  const control_sinature: Tcontrol_sinature = {
    manager: {
      employee: emp_manager,
      onChange: (v) => {
        setEmp_manager(v);
      },
    },
    director: {
      employee: emp_director,
      onChange: (v) => {
        setEmp_director(v);
      },
    },
    agent: {
      employee: emp_agent,
      onChange: (v) => {
        setEmp_agent(v);
      },
    },
  };

  // -----------------------------------------------------------------------
  if (!classLegacyContract) {
    return null;
  }

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader02 tagList={tagList} panelList={!disbaled ? panel_editable : panel_noEditable} />

      <div>
        <div className={style.quotation}>
          {/* 基本資料 */}
          <QuotationProfile
            classLegacyContract={classLegacyContract}
            classBasicInfo={classLegacyContract.classBasicInfo}
            disabled={disbaled}
          />
          {/*  */}
          <div className={style.switchBar}>
            <div className={style.active}>合約項目</div>
          </div>
          {/* 主產品設定 */}
          <QuotationProduction
            legacyContract={classLegacyContract}
            disabled={disbaled}
            isAppend={false}
            control_vKeyArr={{
              vKeyArr: verticalKeyArr,
              onChange: setVerticalKeyArr,
            }}
          />
          {/* 其他設定 */}
          <QuotationAdditions
            legacyContract={classLegacyContract}
            disabled={disbaled}
            onVerticalKeyChange={(arr) => {
              setVerticalKeyArr_addi(arr);
            }}
          />
          {/* 備註/報價範圍/付款資訊 */}
          <QuotationTotal legacyContract={classLegacyContract} disabled={disbaled} appendixParams={appendixParams} />
          {/* 簽名 */}
          <QuotationSinature control={control_sinature} disabled={disbaled} />
        </div>
      </div>
      <QuotationPdf
        isVisable={showPdf}
        onCancel={() => {
          setShowPdf(false);
        }}
        classLegacyContract={classLegacyContract}
        verticalKeyArr={verticalKeyArr}
        agentName={(emp_agent?.chName || emp_agent?.enName) ?? ''}
        // notesArrBeforeThisBatchAndThisBatch={notesArrBeforeThisBatchAndThisBatch}
      />
    </SubLayer>
  );
}
