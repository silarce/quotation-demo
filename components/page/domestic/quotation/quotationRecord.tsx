import { useState } from 'react';
import moment from 'moment';
import _ from 'lodash';

// antd
import { Collapse } from 'antd';
const { Panel } = Collapse;

// global gear
import { RotatingArrow01 } from 'public/image/icon/iconComponent/rotatingArrow';

// helper
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// css
import style from './quotationRecord.module.scss';

// ===================================================================

import Table_prod from 'components/page/domestic/contract/table/table_prod';
import { useProductList } from 'hooks/quotation/useProduct';
import { TquotationProductDto, TquotationContractDto } from 'js/api/dtoTypes';
// ===================================================================

export default function QuotationRecord({ subContract }: { subContract: TquotationContractDto[] | undefined }) {
  // ======================================================
  const [activePanel, setActivePanel] = useState<number[]>([]);

  const activeAllPanel = () => {
    const activeArr = subContract?.map((item, index) => index) ?? [];

    if (activePanel.length === activeArr.length) {
      setActivePanel([]);
    } else {
      setActivePanel(activeArr);
    }
  };

  const isPanelAllActive = activePanel.length === subContract?.length;

  // ----------------------------------------------------------

  const rootProdList: { [key: string]: TquotationProductDto } = {};

  // ----------------------------------------------------------

  return (
    <div className={style.container}>
      <div className={style.title}>
        <span>追加 / 追減項目紀錄</span>
        <div>
          <span />
          <span>追加</span>
        </div>
        <div>
          <span />
          <span>追減</span>
        </div>
        <div>
          <button className={style.panelButton} onClick={activeAllPanel}>
            <span>全展開</span>
            <RotatingArrow01 deg={0} defaultDeg={-180} isActive={isPanelAllActive} />
          </button>
        </div>
      </div>

      {/* table */}
      <div className={style.recordList}>
        <Collapse
          className={`${style.collapse} ${style.recordContainer}`}
          expandIcon={() => <></>}
          accordion={false}
          activeKey={activePanel}
        >
          {subContract?.map((item, index, arr) => {
            const content = item.content;

            const activeIndex = activePanel.findIndex((item) => item === index);
            const isActive = activeIndex === -1 ? false : true;

            const panelSwitch = () => {
              if (activeIndex === -1) {
                activePanel.push(index);
                setActivePanel([...activePanel]);
              } else {
                activePanel.splice(activeIndex, 1);
                setActivePanel([...activePanel]);
              }
            };

            const changeInfo = {
              quotationId: content.quotationNumber,
              date: moment(convertDate_reduce1911(content.quotationDate)).format('yy-MM-DD'),
              priceChange: content.total,
              remark: content.editNotes,
            };

            const contentProdArr = _.cloneDeep(content.products);

            contentProdArr.forEach((prod, index) => {
              if (!rootProdList[prod.rootProductId]) {
                rootProdList[prod.rootProductId] = _.cloneDeep(prod);
              } else {
                const rootQty = rootProdList[prod.rootProductId]?.quantity ?? 0;
                const copy = _.cloneDeep(prod);
                copy.quantity = rootQty - copy.quantity;
                rootProdList[prod.rootProductId] = _.cloneDeep(prod);
                // 替換掉原本的
                contentProdArr[index] = copy;
              }
            });

            return (
              <Panel
                key={index}
                header={<RecordInfo changeInfo={changeInfo} panelSwitch={panelSwitch} isActive={isActive} />}
                extra={
                  <button className={style.panelButton} onClick={panelSwitch}>
                    <span>展開</span>
                    <RotatingArrow01 deg={0} defaultDeg={-180} isActive={isActive} />
                  </button>
                }
              >
                <div className={style.prodContainer}>
                  {/* <Thead />
                  <Tbody product={product} /> */}
                  <ProdRow prodArr={contentProdArr} />
                </div>
              </Panel>
            );
          })}
        </Collapse>
      </div>

      {/* {!prodChangingRecord && (
        <div className={style.noRecord}>
          <span>無追加/追減項目紀錄</span>
        </div>
      )} */}
    </div>
  ); // return

  // ======================================================
  interface TchangeListItem {
    quotationId: string; // 編號
    date: string; // 日期
    priceChange: number | string; // 追加追減項目
    remark: string; // 備註
  }

  function RecordInfo({
    changeInfo,
    panelSwitch,
    isActive,
  }: {
    changeInfo: TchangeListItem;
    panelSwitch: () => void;
    isActive: boolean;
  }) {
    const { quotationId, date, priceChange, remark } = changeInfo;

    // 在金額數字前面加上 "+$" 或 "-$" 字串
    // replace的部分是加進千分位
    // const formatedPriceChange =
    //   priceChange > 0
    //     ? `+$${priceChange}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    //     : `-$${-priceChange}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return (
      <div className={style.recordInfo}>
        <span>{quotationId}</span>
        <span /> {/* 直線 */}
        <span>{date}</span>
        <span>{priceChange}</span>
        <span>{remark}</span>
      </div>
    );
  } // RecordInfo
} // QuotationRecord

// ================================================================
// ================================================================
// ================================================================

const ProdRow = ({ prodArr }: { prodArr: TquotationProductDto[] | undefined }) => {
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
    productArr: prodArr ?? [],
    others: [],
    resetTrigger: prodArr,
  });

  return (
    <div>
      <Table_prod
        disabled={true}
        prodList={productList}
        prodCellConfig={prodCellConfig}
        prodKeyArr={prodKeyArr}
        changeProdKeyArr={changeProdKeyArr}
        addProd={() => {}}
        setTargetProd={() => {}}
        emptyBlockWidth="80px"
        rowHeight={'h106'}
        panelBox="stateBox"
      />
    </div>
  );
};
