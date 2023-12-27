// 舊合約追加追減功能(這個page)已經於2023-12-21棄用
// 舊合約追加追減功能(這個page)已經於2023-12-21棄用
// 舊合約追加追減功能(這個page)已經於2023-12-21棄用
// 舊合約追加追減功能(這個page)已經於2023-12-21棄用
// 舊合約追加追減功能(這個page)已經於2023-12-21棄用
// 舊合約追加追減功能(這個page)已經於2023-12-21棄用
// 舊合約追加追減功能(這個page)已經於2023-12-21棄用
// 舊合約追加追減功能(這個page)已經於2023-12-21棄用
// 舊合約追加追減功能(這個page)已經於2023-12-21棄用
// 舊合約追加追減功能(這個page)已經於2023-12-21棄用
// 舊合約追加追減功能(這個page)已經於2023-12-21棄用
// 舊合約追加追減功能(這個page)已經於2023-12-21棄用
// 舊合約追加追減功能(這個page)已經於2023-12-21棄用
// 舊合約追加追減功能(這個page)已經於2023-12-21棄用

// useLegacyContract

// 舊合約
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// import { NextRouter } from 'next/router';
// import { AxiosError } from 'axios';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
// import QuotationProfile from 'components/page/domestic/quotation/legacyContract/quotationProfile_legacyContract';
// import QuotationProduction from 'components/page/domestic/quotation/legacyContract/quotationProduct_legacyContract';
// import QuotationAdditions from 'components/page/domestic/quotation/legacyContract/quotationAdditions_legacyContract';
// import QuotationTotal from 'components/page/domestic/quotation/legacyContract/quotationTotal_legacyContract';
// import QuotationSinature, { Tcontrol_sinature } from 'components/page/domestic/quotation/quotationSinature_2';
// import QuotationExProd from 'components/page/domestic/quotation/legacyContract/quotationExProd_legacyContract';
// import QuotationExAddi from 'components/page/domestic/quotation/legacyContract/quotationExAddi_legacyContract';

// import QuotationPdf from 'components/page/domestic/pdf/quotationPdf/quotationPdf_legacyContract';

// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
// import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
// import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// css
// import scss from './quotation.module.scss';
// ========================================================================
// ========================================================================
// hook
// import { useLegacyContract } from 'hooks/quotation/legacy/useLegacyContract';
// ========================================================================
// ========================================================================
// api
// import {
//   useLegacyContract_id,
//   useLegacyContracts_id_attachments,
//   apiPatchLegacyContracts_id_modify,
// } from 'js/api/api_legacy-contract';

// type
// import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';

// ========================================================================

export default function Quotation() {
  const router = useRouter();
  const isReady = router.isReady;

  if (!isReady) {
    return null;
  }

  // 舊合約追加追減已棄用，改用<Deprecated />提示使用者
  return <Deprecated />;
  // return <TheQuotation router={router} />;
}

// function TheQuotation({ router }: { router: NextRouter }) {
//   const { contractId } = router.query as { [key: string]: string | undefined };
//   const isAppending = (router.query.isAppending as string | undefined) === 'true';

//   const batch = (router.query.batch as `${number}` | undefined) || '0';

//   const [showPdf, setShowPdf] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [verticalKeyArr, setVerticalKeyArr] = useState<string[]>([]);

//   // --------------------------------------------------------------------------
//   const [legacyContractParams, setLegacyContractParams] = useState({
//     populate: [
//       //
//       'customer',
//       'products',
//       'additions',
//       'priceRecord',
//       'manager',
//       'supervisor',
//       'operator',
//       'notesRecord',
//     ],
//   });

//   const { legacyContract, updateLegacyContract } = useLegacyContract_id(contractId, legacyContractParams);

//   if (legacyContract) {
//     legacyContract.contractNumber = '';
//   }

//   // hook
//   // 這是class
//   const {
//     //
//     classLegacyContract,
//     reset,
//     difference_prod,
//     difference_addi,
//     // notesArrBeforeThisBatchAndThisBatch,
//   } = useLegacyContract({
//     //
//     contract: legacyContract,
//     batch: Number(batch),
//     isAppend: true,
//     verticalKeyArr,
//     verticalKeyArr_addi: [],
//   });

//   const { attachments, updateAttachments, domain } = useLegacyContracts_id_attachments(contractId);

//   // --------------------------------------------------------------------------
//   // 其實不會用到，但是有一個元件必須要送進去
//   const [fileInfoArr, setFileInfoArr] = useState<TfileInfo[]>([]);

//   useEffect(() => {
//     const arr = attachments?.map((item) => {
//       const imageReg = /^image/;
//       const pdfReg = /pdf$/;
//       const fileType = imageReg.test(item.mime) ? 'image' : pdfReg.test(item.mime) ? 'pdf' : 'other';

//       return {
//         fileId: item.id,
//         fileType,
//         fileName: item.name,
//         fileSrc: `${domain}file/download/${item.id}`,
//         isNew: false,
//       };
//     });
//     setFileInfoArr(arr ?? []);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [attachments]);

//   const appendixParams = {
//     fileInfoArr,
//     removeFileInfo: () => {},
//     toSetFileInfo: () => {},
//   };

//   // --------------------------------------------------------------------------

//   useEffect(() => {
//     (async () => {
//       try {
//         setIsLoading(true);
//         await Promise.all([updateLegacyContract(), updateAttachments()]);
//       } catch (error) {
//         myAlert.err({ title: '取得舊合約失敗' });
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [contractId, batch]);

//   // --------------------------------------------------------------------------

//   useEffect(() => {
//     reset();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [legacyContract]);

//   // -----------------------------------------------------------------------
//   const tagList: TtagList = [
//     {
//       label: `合約編號 ${classLegacyContract.classBasicInfo.contractNumber}`,
//       onClick: () => {},
//     },
//   ];

//   const uploadPanel: TpanelList[number] = {
//     type: 'myButton',
//     label: '上傳',
//     onClick: async () => {
//       const appendBody = classLegacyContract.appendBody;

//       if (!appendBody) {
//         return;
//       }

//       const id = legacyContract?.id;

//       if (!id) {
//         return;
//       }

//       if (!appendBody.batchNumber) {
//         return myAlert.warning({ title: '請輸入追加追減合約編號', content: '右上方的合約編號欄位' });
//       }

//       //
//       try {
//         setIsLoading(true);
//         const res = await apiPatchLegacyContracts_id_modify({
//           id,
//           body: appendBody,
//         });
//         myAlert.success({ title: '上傳完成' });
//         router.push({
//           pathname: '/domestic/legacyContractIntegration/quotation/append',
//           query: {
//             contractId: contractId,
//             batch: res.latestBatch,
//           },
//         });
//       } catch (error) {
//         const err = error as AxiosError<{
//           error: string;
//           message: string;
//           statusCode: number;
//         }>;

//         myAlert.err({ title: '上傳失敗', content: err.response?.data.message });
//       } finally {
//         setIsLoading(false);
//       }
//       //
//     },
//   };

//   const panel: TpanelList = [
//     //
//     {
//       type: 'myButton',
//       label: '匯出舊合約',
//       onClick: () => {
//         setShowPdf(true);
//       },
//     },
//     {
//       type: 'myButton',
//       label: '取消',
//       onClick: () => {
//         //
//         // router.back();
//         router.push({
//           pathname: '/domestic/legacyContractIntegration/quotation',
//           query: {
//             contractId: contractId,
//           },
//         });
//       },
//     },
//     isAppending ? uploadPanel : undefined,
//   ];

//   // -----------------------------------------------------------------------

//   const conntrol_sinature: Tcontrol_sinature = {
//     manager: {
//       employee: legacyContract?.manager,
//     },
//     director: {
//       employee: legacyContract?.supervisor,
//     },
//     agent: {
//       employee: legacyContract?.operator,
//     },
//   };

//   // -----------------------------------------------------------------------

//   // -----------------------------------------------------------------------
//   if (!classLegacyContract) {
//     return null;
//   }

//   // -----------------------------------------------------------------------
//   // -----------------------------------------------------------------------
//   return (
//     <SubLayer isLoading_all={isLoading}>
//       <PageHeader02 tagList={tagList} panelList={panel} />

//       <div>
//         <div className={scss.quotation}>
//           {/* 基本資料 */}
//           <QuotationProfile
//             classLegacyContract={classLegacyContract}
//             classBasicInfo={classLegacyContract.classBasicInfo}
//             disabled={true}
//             isAppend={true}
//             isAppending={!!isAppending}
//           />
//           {/*  */}
//           <div className={scss.switchBar}>
//             <div className={scss.active}>合約項目</div>
//           </div>
//           {/* 主產品設定 */}
//           <QuotationProduction
//             legacyContract={classLegacyContract}
//             disabled={true}
//             isAppend={true}
//             isAppending={isAppending}
//             difference_prod={difference_prod}
//             control_vKeyArr={{
//               vKeyArr: verticalKeyArr,
//               onChange: setVerticalKeyArr,
//             }}
//           />

//           {/* 配件設定 */}
//           <QuotationAdditions
//             legacyContract={classLegacyContract}
//             disabled={true}
//             isAppend={true}
//             isAppending={isAppending}
//             difference_addi={difference_addi}
//             onVerticalKeyChange={() => {}}
//           />
//           {/* 變更 主產品 */}
//           {isAppending && <QuotationExProd legacyContract={classLegacyContract} disabled={false} />}
//           {/* 變更 配件設定 */}
//           {isAppending && <QuotationExAddi legacyContract={classLegacyContract} disabled={false} />}
//           {/*  */}
//           <div className={scss.exchangeTotal}>
//             <span>總合計</span>
//             {/* <span>{classLegacyContract.exchangeTotal}</span> */}
//             <span>
//               {(() => {
//                 if (isAppending) {
//                   return classLegacyContract.exchangeTotal;
//                 } else {
//                   const difference = difference_prod + difference_addi;
//                   const mark = difference >= 0 ? '+' : '';

//                   return `${mark} ${difference.toLocaleString()}`;
//                 }
//               })()}
//             </span>
//           </div>
//           {/* 備註/報價範圍/付款資訊 */}
//           <QuotationTotal
//             legacyContract={classLegacyContract}
//             disabled={true}
//             appendixParams={appendixParams}
//             isAppending={isAppending}
//           />
//           {/* 簽名 */}
//           <QuotationSinature control={conntrol_sinature} disabled={true} />
//         </div>
//       </div>
//       <QuotationPdf
//         isVisable={showPdf}
//         onCancel={() => {
//           setShowPdf(false);
//         }}
//         classLegacyContract={classLegacyContract}
//         verticalKeyArr={verticalKeyArr}
//         agentName={(legacyContract?.operator?.chName || legacyContract?.operator?.enName) ?? ''}
//         // notesArrBeforeThisBatchAndThisBatch={notesArrBeforeThisBatchAndThisBatch}
//       />
//     </SubLayer>
//   );
// }

const Deprecated = () => {
  const router = useRouter();

  const tagList: TtagList = [
    {
      label: `舊合約追加追減`,
      onClick: () => {},
    },
  ];

  const panel: TpanelList = [
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.back();
      },
    },
  ];

  return (
    <SubLayer>
      <PageHeader02 tagList={tagList} panelList={panel} />
      <div className="p-10">
        <p className="text-5xl text-center">舊合約追加追減功能已被棄用</p>
        <p className="text-3xl text-center mt-5">請點擊右上方返回按鈕返回</p>
        <p className="text-3xl text-center mt-5">如有需求請洽資訊部</p>
      </div>
    </SubLayer>
  );
};
