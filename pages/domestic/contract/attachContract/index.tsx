// reqModify
// apiGetQuotationProducts

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
import QuotationProfile, {
  TreturnBody,
  TquotationProfile,
} from 'components/page/domestic/quotation/quotationProfile_old';
import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
import Table_com from 'components/page/domestic/quotation/quotation/product/table_component';
import Table_accessories from 'components/page/domestic/quotation/quotation/product/table_accessories';
import Table_others from 'components/page/domestic/quotation/quotation/product/table_others';
import Summary, {
  TsummaryControl,
  TpayInfoControl,
} from 'components/page/domestic/quotation/quotation/summary/summary';
import QuotationSinature, { TsignatureProps } from 'components/page/domestic/quotation/quotationSinature';

// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  useGetContract_id_forAttach,
  apiQuotationModify,
  TcreateModifyQuotationDto,
  TcreateQuotationProductDto,
  TquotationProductDto,
  useGetContract_id,
  useQuotation_id_attachments,
  apiGetQuotationProducts,
} from 'js/api/api_quotation';

// css
import scss from 'pages/domestic/quotationList/quotation/quotation.module.scss';

import { useProductList } from 'hooks/quotation/useProduct';

import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';

// ===========================================================================
// 合約 追加追減介面
export default function AttachContract() {
  const router = useRouter();
  const contractId = router.query.contractId as string | undefined;

  const [isLading, setIsLading] = useState(false);

  // ----------------------------------------------------
  const { data, update } = useGetContract_id_forAttach(contractId);
  useEffect(() => {
    (async () => {
      try {
        setIsLading(true);
        await update();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '讀取追加追減報價單失敗', content: err.message });
      } finally {
        setIsLading(false);
      }
    })();
  }, [contractId]);

  // const content = data?.content;

  const formatedContent = useMemo(() => {
    if (!data) {
      return undefined;
    }

    const content_copy = _.cloneDeep(data.content);

    let subContracts = data.subContracts;

    subContracts = _.sortBy(subContracts, 'version');

    const list: { [key: string]: TquotationProductDto } = {};

    let subTotal = 0;
    let salesTax = 0;
    let total = 0;

    subContracts.forEach((contract) => {
      subTotal += contract.content.subTotal;
      salesTax += contract.content.salesTax;
      total += contract.content.total;
      const prodArr = contract.content.products;
      prodArr.forEach((prod) => {
        list[prod.rootProductId] = prod;
      });
    });

    content_copy.products = Object.values(list);
    content_copy.subTotal = subTotal;
    content_copy.salesTax = salesTax;
    content_copy.total = total;

    return content_copy;
  }, [data]);

  // ------------------------------------------------------------------
  const {
    productList,
    prodCellConfig,
    prodKeyArr,
    // prodVKeyArr,
    setProdVKeyArr,
    addProd,
    changeProdKeyArr,
    //
    comKeyArr,
    comCellConfig,
    // changeComKeyArr,
    // comVKeyArr,
    //
    accessoriesKeyArr,
    changeAccessoriesKeyArr,
    accessoriesCellConfig,
    //
    othersKeyArr,
    othersList,
    othersCellConfig,
    changeOthersKeyArr,
    // addOthers,
    // getOthersPostBodyArr,
    // //
    // subTotal: quotationProdSubTotal,
    // reset: resetClass,
    //
    attachProdList,
    addProd_attach,
    attachAddTotal,
    attachDivTotal,
    attachTotal,
  } = useProductList({
    productArr: formatedContent?.products,
    others: formatedContent?.others,
    resetTrigger: data,
  });

  const [targetProdKey, setTargetProdKey] = useState<string>('n');
  const targetProd = productList[targetProdKey];

  const [targetProdKey_attach, setTargetProdKey_attach] = useState<string>('n');
  const targetProd_attach = attachProdList[targetProdKey_attach];

  useEffect(() => {
    targetProd?.getComAndAcce();
  }, [targetProd]);

  // ------------------------------------------------------------------

  const subTotal_ori = attachTotal ?? 0;
  const subTotal_calced = subTotal_ori;
  const salesTax_calced = Number(new Decimal(subTotal_calced).mul(0.05).toFixed(0));
  const total_calced = subTotal_calced + salesTax_calced;

  const control_anno: TsummaryControl = {
    stringArr: data?.annotations ?? [],
    editString: () => {},
    addString: () => {},
    delString: () => {},
    addStrArr: () => {},
  };

  const control_qr: TsummaryControl = {
    stringArr: data?.quotationRanges ?? [],
    editString: () => {},
    addString: () => {},
    delString: () => {},
    addStrArr: () => {},
  };

  const payInfoControl: TpayInfoControl = {
    payment: {
      discountRate: {
        inputAttr: {
          disabled: true,
          value: data?.discount ?? '',
          onChange: () => {},
        },
      },
      subTotal: {
        inputAttr: {
          disabled: true,
          value: subTotal_calced,
        },
      },
      salesTax: {
        inputAttr: {
          disabled: true,
          value: salesTax_calced,
        },
      },
      total: {
        inputAttr: {
          disabled: true,
          value: total_calced,
        },
      },
    },

    delivery: {
      deliveryLocation: {
        value: data?.deliveryLocation ?? '',
        onChange: () => {},
      },
      deliveryDate: {
        value: data?.deliveryDate ?? '',
        onChange: () => {},
      },
    },
    paymentMethod: {
      arr:
        data?.paymentMethods.map((item) => {
          const { milestone, totalPaymentRatio } = item;

          return {
            label: milestone,
            value: totalPaymentRatio,
            onChange: () => {},
            delSelf: () => {},
          };
          //
        }) ?? [],
      addMethod: () => {},
    },
  };

  const signatureArr = [
    {
      label: '總經理',
      inputProps: {
        props: {
          value: formatedContent?.reviewManagerEmployee?.chName ?? '',
        },
      },
    },
    {
      label: '工務主管',
      inputProps: {
        props: {
          value: formatedContent?.reviewWorkDirectorEmployee?.chName ?? '',
        },
      },
    },
    {
      label: '主管',
      inputProps: {
        props: {
          value: formatedContent?.reviewSupervisorEmployee?.chName ?? '',
        },
      },
    },
    {
      label: '業務',
      inputProps: {
        props: {
          value: formatedContent?.reviewSalesEmployee?.chName ?? '',
        },
      },
    },
    {
      label: '經辦',
      inputProps: {
        props: {
          value: formatedContent?.agentEmployee?.chName ?? '',
        },
      },
    },
  ];

  // 附件
  const { attachments, updateAttachments, domain } = useQuotation_id_attachments(formatedContent?.id);

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

  // ------------------------------------------------------------------

  const reqModify = async () => {
    try {
      setIsLading(true);

      if (!data || !attachProdList || !contractId) {
        return;
      }

      const content = _.cloneDeep(data.content);

      // 追減，要送給後端的是追減後的資料
      // 原本五個，追減兩個，送給後端的要是三個
      const divProdArr = (() => {
        const arr = Object.values(productList).map((item) => {
          if (item.isAttachDiv) {
            return item.body_attachDiv;
          }

          return undefined;
        });

        return arr.filter((item) => !!item) as (TcreateQuotationProductDto & {
          id: string | undefined;
        })[];
      })();

      // 追加跟變更
      const attachProdArr = Object.values(attachProdList).map((prod) => {
        return prod.body;
      });

      const body: TcreateModifyQuotationDto = {
        ...content,
        products: [...divProdArr, ...attachProdArr],
        agentId: content.agentEmployee?.id,
        managerId: content.managerEmployee?.id,
        supervisorId: content.supervisorEmployee?.id,
        subTotal: subTotal_calced,
        salesTax: salesTax_calced,
        total: total_calced,
      };

      try {
        await apiQuotationModify(contractId, body);
        setIsLading(false);
        router.back();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '上傳失敗', content: err.message });
      }
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '上傳失敗', content: err.message });
    } finally {
      setIsLading(false);
    }
  };

  // ------------------------------------------------------------------

  const tagList: TtagList = [
    {
      label: `合約編號 ${formatedContent?.quotationNumber}`,
      onClick: () => {},
    },
  ];

  const panel: TpanelList = [
    //
    {
      type: 'redButton',
      label: '上傳',
      onClick: reqModify,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        //
        router.back();
      },
    },
  ];

  // ==========================================================================
  return (
    <SubLayer isLoading_all={isLading}>
      <PageHeader02 tagList={tagList} panelList={panel} />
      <div>
        <div className={scss.quotation}>
          {/*  */}
          <QuotationProfile profile={data?.content} disabled={true} onProfileChange={() => {}} />
          {/*  */}
          <div className={classNames(scss.switchBar)}>
            <div>合約項目</div>
          </div>
          {/*  */}

          <div className={scss.tableWrapper}>
            {/* 主產品設定 */}

            <Table_prod
              disabled={true}
              exchangeDiabled={false}
              prodList={productList}
              prodCellConfig={prodCellConfig}
              prodKeyArr={prodKeyArr}
              changeProdKeyArr={changeProdKeyArr}
              addProd={addProd}
              setTargetProd={setTargetProdKey}
              // defalutVKeyArr={prodVKeyArr}
              onVKeyChange={(keyArr) => setProdVKeyArr(keyArr)}
              rowHeight="h60"
              isAttach={true}
              panelBox="resetChangeBox"
              targetProd={targetProd}
              attachTotal={attachDivTotal.toLocaleString()}
            />

            <br />
            <br />
            <Table_com
              disabled={true}
              // comList={targetProd?.comList}
              // FIXME 之後要把型別處理好
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              comList={{ ...targetProd?.comList, ...targetProd?.subComList }}
              comCellConfig={comCellConfig}
              comKeyArr={comKeyArr}
              changeComKeyArr={() => {}}
              // defalutVKeyArr={comVKeyArr}
            />
            <br />
            <br />
            <Table_accessories
              disabled={true}
              list={targetProd?.accessoriesList}
              cellConfig={accessoriesCellConfig}
              keyArr={accessoriesKeyArr}
              changeKeyArr={changeAccessoriesKeyArr}
              // defalutVKeyArr={}
              // onVKeyChange={}
              doorModel={targetProd?.doorType}
              onSelectorConfirm={() => {}}
              // panelBox={}
              // emptyBlockWidth={}
            />
            <br />
            <br />
            {/* 其他設定 */}
            <Table_others
              disabled={true}
              list={othersList}
              cellConfig={othersCellConfig}
              keyArr={othersKeyArr}
              changeKeyArr={changeOthersKeyArr}
              add={() => {}}
            />
          </div>
          {/*  */}
          {/*  */}
          {/*  */}
          <br />
          <div className={scss.tableWrapper}>
            <Table_prod
              disabled={false}
              exchangeDiabled={true}
              prodList={attachProdList}
              prodCellConfig={prodCellConfig}
              prodKeyArr={prodKeyArr}
              // changeProdKeyArr={changeProdKeyArr}
              // addProd={addProd}
              // setTargetProd={setTargetProdKey}
              changeProdKeyArr={() => {}}
              addProd={addProd_attach}
              setTargetProd={setTargetProdKey_attach}
              defalutVKeyArr={Object.keys(attachProdList)}
              // onVKeyChange={(keyArr) => setProdVKeyArr(keyArr)}
              onVKeyChange={() => {}}
              rowHeight="h60"
              // isAttach={true}
              // panelBox="resetChangeBox"
              // targetProd={targetProd}
              attachTotal={attachAddTotal}
              isRedBorder={true}
            />

            <br />
            <br />
            <Table_com
              disabled={false}
              // FIXME 之後要把型別處理好
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              // comList={targetProd_attach?.comList}
              comList={{ ...targetProd_attach?.comList, ...targetProd_attach?.subComList }}
              comCellConfig={comCellConfig}
              comKeyArr={comKeyArr}
              changeComKeyArr={() => {}}
              // defalutVKeyArr={Object.keys(targetProd_attach?.comList ?? {})}
              isRedBorder={true}
            />

            <br />
            <br />

            <Table_accessories
              disabled={false}
              list={targetProd_attach?.accessoriesList}
              cellConfig={accessoriesCellConfig}
              keyArr={accessoriesKeyArr}
              changeKeyArr={() => {}}
              // defalutVKeyArr={}
              // onVKeyChange={}
              doorModel={targetProd_attach?.doorType}
              onSelectorConfirm={(arr) => {
                if (targetProd_attach) {
                  targetProd_attach.addAcce(arr);
                }
              }}
              // panelBox={}
              // emptyBlockWidth={}
              isRedBorder={true}
            />
          </div>

          {/*  */}
        </div>
        {/*  */}
        {/*  */}
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
    </SubLayer>
  );
}

/**

追加追減流程
在發包列表選擇合約，開始該合約的追加追減
page url
/domestic/contract/attachContract?contractId=uuid
在這個介面可以設定、編輯要 追加追減 的主產品
然後把 追加的主產品 還有 計入追加追減主產品後的 小計、營業稅、總計 送去給後端
所以要怎麼把追減的部分交給後端?
Gina說product裡面帶id，之後這個product就會有attachedToProductId
可以用這個來判斷是不是追減的產品
跟其他追加的產品同樣放在products這個property裡?
這樣是不是怪怪的? products裡面可以放虛(追減)的資料嗎
在追加追減後新增的報價單，我要怎麼呈現追減的資料?


我覺得追加追減這樣處理應該會比較直觀且簡單
在追加追減時，送給後端所有還存在的主產品
就是包括原本的主產品，還有追加的主產品

請後端在CreateModifyQuotationDto設一個property，只要可以存字串就好了
由前端這裡紀錄該次追加追減的資料，轉成JSON後送給後端紀錄，這樣後端應該也不用加開資料表

於是在追加追減比較表的追加追減項目的部分，我可以直接用這個property來呈現追加追減紀錄
合約項目的部分也可以直接取content的products，
而不用分析比較sunContract裡的資料，找出哪些是該呈現的哪些是不該呈現的



其他問題
追加追減介面一開始呈現的資料，是根合約，還是最新版的合約?
是最新版的合約的合約的話，是應該只呈現追加的主產品，還是應該呈現所有還存在的主產品?

以追加追減程序新增的報價單，是否可以被編輯?


 */
