// 追加/追減項目
// QuotationProdChangingRecord

// 展開版本的追加追減紀錄 (在很下面)
// QuotationRecord

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextRouter } from 'next/router';
import _ from 'lodash';
import Decimal from 'decimal.js';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
import QuotationProfile from 'components/page/domestic/quotation/quotationProfile';
import QuotationProdChangingRecord from 'components/page/domestic/quotation/quotationProdChangingRecord';
import QuotationRecord from 'components/page/domestic/quotation/quotationRecord';

// antd
import { Collapse } from 'antd';
const { Panel } = Collapse;

// global gear
import PageHeader02, { TtagList, TpanelList, Tlink, TlinkArr } from 'components/PageHeader/PageHeader02/PageHeader02';
import { RotatingArrow01 } from 'public/image/icon/iconComponent/rotatingArrow';

// css
import style from './quotation.module.scss';

// =============================================================
// =============================================================
// =============================================================

// api
import { useGetContract_id_noItems, useQuotation_id_attachments, apiGetQuotationProducts } from 'js/api/api_quotation';
import { apiPostEngineeringContact } from 'js/api/api_engineering';

// component
import Table_prod from 'components/page/domestic/contract/table/table_prod';
import Table_com from 'components/page/domestic/contract/table/table_component';
import Table_accessories from 'components/page/domestic/contract/table/table_accessories';
import Table_others from 'components/page/domestic/contract/table/table_others';

import Summary, {
  TsummaryControl,
  TpayInfoControl,
} from 'components/page/domestic/quotation/quotation/summary/summary';
import QuotationSinature from 'components/page/domestic/quotation/quotationSinature';

import { useProductList } from 'hooks/quotation/useProduct';

import type { TquotationContentDto } from 'js/api/api_quotation';

import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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
    version,
  } = router.query as {
    id: string | undefined;
    version: string | undefined;
  };

  const [isLoading, setIsLoading] = useState(false);

  // =========================================================

  const { data, update } = useGetContract_id_noItems(id as string | undefined);
  const engineeringContactId = data?.engineeringContactId;

  useEffect(() => {
    update();
  }, [id]);

  // =========================================================

  // const [showPdf, setShowPdf] = useState(false);
  // const [showPdf_part, setShowPdf_part] = useState(false);

  // =========================================================

  /**
合約項目
選中合約版本的contnet
可以用url的version判斷
version===1 是根合約
version>1 是子合約

如果是根合約，追加追減項目就取得所有的subContract
如果是子合約，追加追減項目就取得所有比子合約版本小的subContract (包括這個子合約)

原報價項目，就是根合約的content
 */

  const { content, rootContent, subContracts, totalInfo } = useMemo(() => {
    if (!data) {
      return {};
    }

    let subContracts = data.subContracts.filter((item) => {
      if (version === '1') {
        return true;
      } else {
        return item.version <= Number(version ?? 0);
      }
    });

    subContracts = _.sortBy(subContracts, 'version');

    const rootContent = subContracts[0]?.content;

    const content = (() => {
      if (version === '1') {
        return data?.content;
      } else if (version) {
        const index = Number(version) - 1;
        const contract = subContracts[index];

        return contract?.content;
      }
    })();

    let subTotal = new Decimal(0);
    let salesTax = new Decimal(0);
    let total = new Decimal(0);

    subContracts.forEach((item) => {
      subTotal = subTotal.plus(item.subTotal);
      salesTax = salesTax.plus(item.salesTax);
      total = total.plus(item.total);
    });

    const totalInfo = {
      subTotal: subTotal.toNumber(),
      salesTax: salesTax.toNumber(),
      total: total.toNumber(),
    };

    return {
      content,
      rootContent,
      subContracts,
      totalInfo,
    };
  }, [data, version]);

  // 合約項目
  const {
    // reRender,
    // reset,
    //
    productList,
    prodCellConfig,
    prodKeyArr,
    // prodVKeyArr,
    // setProdVKeyArr,
    // addProd,
    changeProdKeyArr,
    //
    // subTotal,
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
    // changeOthersKeyArr,
    // addOthers,
    // getOthersPostBodyArr,
  } = useProductList({
    productArr: content?.products ?? [],
    others: content?.others ?? [],
    resetTrigger: content?.products,
  }); // 合約項目

  const [targetProdKey, setTargetProdKey] = useState<string>('n');
  const targetProd = productList[targetProdKey];

  useEffect(() => {
    (async () => {
      if (targetProd?.id) {
        try {
          const res = await apiGetQuotationProducts(targetProd.id);
          const componentsArr = res.items?.[0].components ?? [];
          const acceArr = res.items?.[0].accessories ?? [];
          // creComList_dyna

          targetProd.creComList_dyna({ componentsArr: componentsArr });
          targetProd.creAcceList_dyna({ acceArr });
        } catch (error) {}
      }
    })();

    // apiGetQuotationProducts
  }, [targetProd]);

  // -----------------------------------------------------------------
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
          value: totalInfo?.subTotal ?? '',
        },
      },
      salesTax: {
        inputAttr: {
          disabled: true,
          value: totalInfo?.salesTax ?? '',
        },
      },
      total: {
        inputAttr: {
          disabled: true,
          value: totalInfo?.total ?? '',
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
          value: data?.content?.reviewManagerEmployee?.chName ?? '',
        },
      },
    },
    {
      label: '工務主管',
      inputProps: {
        props: {
          value: data?.content?.reviewWorkDirectorEmployee?.chName ?? '',
        },
      },
    },
    {
      label: '主管',
      inputProps: {
        props: {
          value: data?.content?.reviewSupervisorEmployee?.chName ?? '',
        },
      },
    },
    {
      label: '業務',
      inputProps: {
        props: {
          value: data?.content?.reviewSalesEmployee?.chName ?? '',
        },
      },
    },
    {
      label: '經辦',
      inputProps: {
        props: {
          value: data?.content?.agentEmployee?.chName ?? '',
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
    },
  ];
  const linkArr: TlinkArr = [
    engineeringContactId
      ? {
          label: '工程聯絡單',
          linkProps: {
            href: {
              pathname: '/worksDepartment/contractList/contract/workContactDoc',
              query: {
                contractId: id,
                engineeringContactId,
                version: '1',
              },
            },
            target: '_blank',
          },
        }
      : null,
  ];

  const panel_quotation01: TpanelList = [
    (() =>
      version === '1' && !engineeringContactId
        ? {
            type: 'myButton',
            label: '新增工程聯絡單',
            onClick: async () => {
              let isOk = true;

              try {
                setIsLoading(true);
                await apiPostEngineeringContact({ contractId: id });
                myAlert.success({ title: '新增工程聯絡單成功' });
              } catch (error) {
                const err = error as Error;
                isOk = false;
                myAlert.err({ title: '新增工程聯絡單失敗', content: err.message });
              } finally {
                setIsLoading(false);
              }

              if (isOk) {
                update();
              }
            },
          }
        : null)(),
    {
      type: 'myButton',
      label: '追加追減報價單',
      onClick: () => setSwitch02(() => true),
    },
    { type: 'myButton', label: '返回', onClick: () => router.back() },
  ];

  const panel_quotation03: TpanelList = [
    {
      type: 'myButton',
      label: '取消',
      onClick: () => setSwitch02(() => false),
    },
  ];

  const panelList = switch02 ? panel_quotation03 : panel_quotation01;

  // -----------------------------------------------------------------

  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader02 tagList={tagList} panelList={panelList} linkList={linkArr} />
      {/*  */}
      <div>
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
            <QuotationProdChangingRecord subContract={subContracts} />
          )}

          {/* 展開版本的追加追減紀錄 (在很下面)*/}
          {switch02 && <QuotationRecord subContract={subContracts} />}

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
    </SubLayer>
  );
}

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
    // reRender,
    // reset,
    //
    productList,
    prodCellConfig,
    prodKeyArr,
    // prodVKeyArr,
    // setProdVKeyArr,
    // addProd,
    changeProdKeyArr,
    //
    // subTotal,
    //
    // comKeyArr,
    // comVKeyArr,
    // comCellConfig,
    // changeComKeyArr,
    //
    // accessoriesKeyArr,
    // changeAccessoriesKeyArr,
    // accessoriesCellConfig,
    //
    // othersKeyArr,
    // othersList,
    // othersCellConfig,
    // changeOthersKeyArr,
    // addOthers,
    // getOthersPostBodyArr,
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
