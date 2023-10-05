import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
import QuotationProfile, { TreturnBody, TquotationProfile } from 'components/page/domestic/quotation/quotationProfile';
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
import { useGetContract_id_forAttach, apiQuotationModify, TcreateModifyQuotationDto } from 'js/api/api_quotation';
import { useGetContract_id, useQuotation_id_attachments } from 'js/api/api_quotation';

// css
import scss from 'pages/domestic/quotationList/quotation/quotation.module.scss';

import { useProductList } from 'hooks/quotation/useProduct';

import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';

// ===========================================================================
// 合約 追加追減介面
export default function AttachContract() {
  const router = useRouter();
  const contractId = router.query.contractId as string | undefined;

  // ----------------------------------------------------
  const { data, update } = useGetContract_id_forAttach(contractId);
  useEffect(() => {
    update();
  }, [contractId]);

  const content = data?.content;

  // ------------------------------------------------------------------
  const {
    productList,
    prodCellConfig,
    prodKeyArr,
    prodVKeyArr,
    setProdVKeyArr,
    addProd,
    changeProdKeyArr,
    //
    comKeyArr,
    comCellConfig,
    changeComKeyArr,
    comVKeyArr,
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
    //
    subTotal: quotationProdSubTotal,
    reset: resetClass,
    //
    attachProdList,
    addProd_attach,
    attachTotal,
  } = useProductList({
    productArr: data?.content.products,
    others: data?.content.others,
    resetTrigger: data,
  });

  const [targetProdKey, setTargetProdKey] = useState<string>('n');
  const targetProd = productList[targetProdKey];

  const [targetProdKey_attach, setTargetProdKey_attach] = useState<string>('n');
  const targetProd_attach = attachProdList[targetProdKey_attach];

  // ------------------------------------------------------------------

  // FIXME 變更與追加後計算的金額有誤
  const subTotal_ori = data?.subTotal ?? 0;
  const subTotal_calced = subTotal_ori + attachTotal;
  const salesTax_calced = Number(new Decimal(subTotal_calced).mul(0.05).toFixed(2));
  const total_calced = subTotal_calced + salesTax_calced;

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

  // ------------------------------------------------------------------

  const reqModify = async () => {
    try {
      showRootLoading(true);

      if (!data || !attachProdList || !contractId) {
        return;
      }

      const content = _.cloneDeep(data.content);

      const attachProdArr = Object.values(attachProdList).map((prod) => {
        return prod.body;
      });

      const body: TcreateModifyQuotationDto = {
        ...content,
        products: attachProdArr,
        agentId: content.agentEmployee?.id,
        managerId: content.managerEmployee?.id,
        supervisorId: content.supervisorEmployee?.id,
        subTotal: subTotal_calced,
        salesTax: salesTax_calced,
        total: total_calced,
      };

      let hasSurface = true;

      body.products?.forEach((item) => {
        if (!item.materialSurface) {
          hasSurface = false;
        }
      });

      if (!hasSurface) {
        return myAlert.warning({ title: '所有主產品必須選擇表面' });
      }

      try {
        await apiQuotationModify(contractId, body);
      } catch (error) {}

      //
      //
    } catch (error) {
      myAlert.err({ title: '上傳失敗' });
    } finally {
      showRootLoading(false);
    }
  };

  // ------------------------------------------------------------------

  const tagList: TtagList = [
    {
      label: `合約編號 ${'foo'}`,
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
        // router.back();
        router.push({
          pathname: '/domestic/legacyContractIntegration/quotation',
          query: {
            contractId: contractId,
          },
        });
      },
    },
  ];

  // ==========================================================================
  return (
    <SubLayer>
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
              prodList={productList}
              prodCellConfig={prodCellConfig}
              prodKeyArr={prodKeyArr}
              changeProdKeyArr={changeProdKeyArr}
              addProd={addProd}
              setTargetProd={setTargetProdKey}
              // defalutVKeyArr={prodVKeyArr}
              onVKeyChange={(keyArr) => setProdVKeyArr(keyArr)}
              rowHeight="h106"
              isAttach={true}
              panelBox="resetChangeBox"
              targetProd={targetProd}
            />
            <br />
            <br />
            <Table_com
              disabled={true}
              comList={targetProd?.comList}
              comCellConfig={comCellConfig}
              comKeyArr={comKeyArr}
              changeComKeyArr={changeComKeyArr}
              defalutVKeyArr={comVKeyArr}
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
            <div className={scss.tableWrapper}>
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
          </div>
          {/*  */}
          {/*  */}
          {/*  */}
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Table_prod
            disabled={false}
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
            onVKeyChange={(keyArr) => {}}
            rowHeight="h106"
            // isAttach={true}
            // panelBox="resetChangeBox"
            // targetProd={targetProd}
          />

          <br />
          <br />
          <Table_com
            disabled={false}
            comList={targetProd_attach?.comList}
            comCellConfig={comCellConfig}
            comKeyArr={comKeyArr}
            changeComKeyArr={() => {}}
            defalutVKeyArr={Object.keys(targetProd_attach?.comList ?? {})}
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
          />

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
