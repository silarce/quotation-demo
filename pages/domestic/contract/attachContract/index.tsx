// 舊合約
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextRouter } from 'next/router';
import _ from 'lodash';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
import QuotationProfile, { TreturnBody, TquotationProfile } from 'components/page/domestic/quotation/quotationProfile';
import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
import Table_com from 'components/page/domestic/quotation/quotation/product/table_component';
import Table_accessories from 'components/page/domestic/quotation/quotation/product/table_accessories';
import Table_others from 'components/page/domestic/quotation/quotation/product/table_others';

// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { useGetContract_id_forAttach, apiQuotationModify, TcreateModifyQuotationDto } from 'js/api/api_quotation';

// css
import scss from 'pages/domestic/quotationList/quotation/quotation.module.scss';

import { useProductList } from 'hooks/quotation/useProduct';

// ===========================================================================
export default function AttachContract() {
  const router = useRouter();
  const contractId = router.query.contractId as string | undefined;

  // ----------------------------------------------------
  const { data, update } = useGetContract_id_forAttach(contractId);
  useEffect(() => {
    update();
  }, [contractId]);

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

  const tagList: TtagList = [
    {
      label: `合約編號 ${'foo'}`,
      onClick: () => {},
    },
  ];

  const uploadPanel: TpanelList[number] = {
    type: 'myButton',
    label: '上傳',
    onClick: async () => {
      //
      try {
        showRootLoading(true);
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
      type: 'redButton',
      label: '上傳',
      onClick: async () => {
        //
        try {
          showRootLoading(true);

          if (!data || !attachProdList || !contractId) {
            return;
          }

          const attachProdArr = Object.values(attachProdList).map((prod) => {
            return prod.body;
          });

          const body: TcreateModifyQuotationDto = {
            // ...data.content,
            products: attachProdArr,
          };

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
        //
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
            // defalutVKeyArr={prodVKeyArr}
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
      </div>
    </SubLayer>
  );
}
