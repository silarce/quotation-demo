import { useState } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';

import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// antd
import { Collapse } from 'antd';

// glogal gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// css
import style from 'components/page/domestic/quotation/quotationProdChangingRecord.module.scss';

// ===================================================================
// ===================================================================
import Table_prod from 'components/page/domestic/contract/table/table_prod';
import { useProductList } from 'hooks/quotation/useProduct';
import { TquotationProductDto, TquotationContractDto } from 'js/api/dtoTypes';
// ===================================================================
// ===================================================================

const { Panel } = Collapse;

// =====================================================
export default function TheQuotationProdChangingRecord({
  subContract,
}: {
  subContract: TquotationContractDto[] | undefined;
}) {
  subContract = _.sortBy(subContract, 'version');

  // 點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1);

  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string);
    setActiveIndex(activeIndex);
  };

  // ----------------------------------------------------------

  const rootProdList: { [key: string]: TquotationProductDto } = {};

  // ----------------------------------------------------------

  return (
    <div className={style.container}>
      <div className={`${style.row} ${style.outHeader}`}>
        {theadIndex.map((item, index) => {
          const { label } = theadConfigList[item];

          return (
            <div className={style.column} key={index}>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      {/*  */}
      <Collapse
        expandIcon={() => <></>}
        accordion={true}
        destroyInactivePanel={true}
        className={style.collapse}
        onChange={changeActive}
      >
        {subContract?.map((item, index) => {
          const content = item.content;

          const contentTotal = content?.subTotal ?? 0;

          const record = {
            quotationId: content.quotationNumber,
            date: dayjs(convertDate_reduce1911(content.quotationDate)).format('yy-MM-DD'),
            priceChange: `${contentTotal}`,
            remark: content.editNotes,
          };

          const isActive = activeIndex === index;

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

          // 上面的演算法必須執行，所以 return null放在下面
          if (index === 0) {
            return null;
          }

          return (
            <Panel key={index} header={<PanelHeader record={record} isActive={isActive} />}>
              <ProdRow prodArr={contentProdArr} quotationDiscount={Number(content.discount || '100')} />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}

// =======================================================
// =======================================================
// =======================================================
type TchangeListItem = {
  quotationId: string; // 編號
  date: string; // 日期
  priceChange: number | string; // 追加追減價格
  remark: string; // 備註
  // product: TrecordProduct[];
};

const PanelHeader = ({ record, isActive }: { record: TchangeListItem; isActive: boolean }) => {
  return (
    <CellWithBar isActive={isActive}>
      <div className={style.panelHeader}>
        <div className={style.column}>
          <span>{record.quotationId}</span>
        </div>
        <div className={style.column}>
          <span>{record.date}</span>
        </div>
        <div className={style.column}>
          <span>{record.priceChange}</span>
        </div>
        <div className={style.column}>
          <span>{record.remark}</span>
        </div>
      </div>
    </CellWithBar>
  );
};

// =======================================================

// =======================================================
// =======================================================
// =======================================================

interface TtheadConfig {
  label: string;
}

interface TtheadConfigList {
  id: TtheadConfig;
  date: TtheadConfig;
  priceChange: TtheadConfig;
  remark: TtheadConfig;
}

type TtheadIndex = (keyof TtheadConfigList)[];

const theadIndex: TtheadIndex = ['id', 'date', 'priceChange', 'remark'];

const theadConfigList: TtheadConfigList = {
  id: {
    label: '編號',
    // width: "110px",
  },
  date: {
    label: '日期',
    // width: "88px",
  },
  priceChange: {
    label: '追加追減價格',
    // width: "105px",
  },
  remark: {
    label: '備註',
    // width: "auto",
  },
};
// ===================================================================

const ProdRow = ({
  //
  prodArr,
  quotationDiscount,
}: {
  prodArr: TquotationProductDto[] | undefined;
  quotationDiscount: number;
}) => {
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
    averageDiscount: null,
    resetTrigger: prodArr,
    quotationDiscount: quotationDiscount,
    discount_fromData: quotationDiscount,
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
        rowHeight={'h60'}
        panelBox="stateBox"
      />
    </div>
  );
};
