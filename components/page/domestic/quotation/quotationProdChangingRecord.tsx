import { useState } from 'react';
import moment from 'moment';
import _ from 'lodash';

import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// antd
import { Collapse } from 'antd';

// glogal gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import Checkbox01 from 'components/global/gear/checkbox/checkbox01';
// css
import style from 'components/page/domestic/quotation/quotationProdChangingRecord.module.scss';

// ===================================================================
// ===================================================================
import Table_prod from 'components/page/domestic/contract/table/table_prod';
import { useProductList } from 'hooks/quotation/useProduct';
import {
  TcreateQuotationContentOtherDto,
  TquotationProductDto,
  TquotationContentOtherDto,
  TquotationContractDto,
} from 'js/api/dtoTypes';
// ===================================================================
// ===================================================================

const { Panel } = Collapse;

// =====================================================
export default function TheQuotationProdChangingRecord({
  subContract,
  rootContractTotal,
}: {
  subContract: TquotationContractDto[] | undefined;
  rootContractTotal: number;
}) {
  subContract = _.sortBy(subContract, 'version');

  // const { list, quotationId } = prodChangingRecord;
  // const quotationIdKeyList = Object.keys(list);

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
        {subContract?.map((item, index, arr) => {
          const content = item.content;
          // const preContent = arr[index - 1];
          const contentTotal = content?.total ?? 0;
          // const preContentTotal = index === 0 ? rootContractTotal : preContent?.content.total ?? 0;
          // rootContractTotal

          const record = {
            quotationId: content.quotationNumber,
            date: moment(convertDate_reduce1911(content.quotationDate)).format('yy-MM-DD'),
            // priceChange: `${preContentTotal - contentTotal}`,
            priceChange: `${contentTotal}`,
            remark: content.editNotes,
            // product: prodArr,
          };

          const isActive = activeIndex === index;

          const contentProdArr = _.cloneDeep(content.products);
          // const preContentProdArr = preContent?.content.products;

          contentProdArr.forEach((prod) => {
            if (!prod.rootProductId) {
              rootProdList[prod.id] = _.cloneDeep(prod);
            } else {
              const rootQty = rootProdList[prod.rootProductId]?.quantity ?? 0;
              const copy = _.cloneDeep(prod);
              copy.quantity = rootQty - prod.quantity;
              rootProdList[prod.rootProductId] = prod;
              prod = copy;
            }
          });

          return (
            <Panel key={index} header={<PanelHeader record={record} isActive={isActive} />}>
              <ProdRow prodArr={contentProdArr} />
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
