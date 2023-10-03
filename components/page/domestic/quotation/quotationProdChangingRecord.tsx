import { useState } from 'react';
import moment from 'moment';

// antd
import { Collapse } from 'antd';

// glogal gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import Checkbox01 from 'components/global/gear/checkbox/checkbox01';
// css
import style from 'components/page/domestic/quotation/quotationProdChangingRecord.module.scss';

// type
import type {
  TchangeRecord,
  // TchangeListItem
} from 'fakeDatabase/domestic/quotation/fakeChangeProductRecord';

// config
import { prodCellConfigOri } from './hook/useProduct';
const prodCellConfig = prodCellConfigOri();

// ===================================================================
// ===================================================================
import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
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

// export default function QuotationProdChangingRecord({
//   prodChangingRecord,
// }: {
//   prodChangingRecord: TchangeRecord | undefined;
// }) {
//   if (!prodChangingRecord) {
//     return null;
//   }

//   return <TheQuotationProdChangingRecord prodChangingRecord={prodChangingRecord} />;
// }

// =====================================================
export default function TheQuotationProdChangingRecord({
  subContract,
}: {
  subContract: TquotationContractDto[] | undefined;
}) {
  // const { list, quotationId } = prodChangingRecord;
  // const quotationIdKeyList = Object.keys(list);

  // 點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1);

  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string);
    setActiveIndex(activeIndex);
  };

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
      <Collapse
        expandIcon={() => <></>}
        accordion={true}
        destroyInactivePanel={true}
        className={style.collapse}
        onChange={changeActive}
      >
        {subContract?.map((item, index) => {
          const content = item.content;
          const prodArr = content.products;

          const isActive = activeIndex === index;

          const record = {
            quotationId: content.quotationNumber,
            date: moment(content.quotationDate).format('yy-MM-DD'),
            priceChange: '-10000',
            remark: content.editNotes,
            // product: prodArr,
          };

          // return (
          //   <Panel key={index} header={<PanelHeader record={record} isActive={isActive} />}>
          //     <CollapseBody record={record} />
          //   </Panel>
          // );
          return (
            <Panel key={index} header={<PanelHeader record={record} isActive={isActive} />}>
              <ProdRow prodArr={prodArr} />
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
// const CollapseBody = ({ record }: { record: TchangeListItem }) => {
//   const { product } = record;

//   const { keyList, cellConfig } = prodCellConfig;

//   return (
//     <div>
//       <div className={style.panelBodyHeader}>
//         <span></span>
//         <span></span>
//         {keyList.map((key, index) => {
//           const { label, width } = cellConfig[key];
//           const theStyle = { width };

//           return (
//             <div className={style.column} key={index} style={theStyle}>
//               <span>{label}</span>
//             </div>
//           );
//         })}
//       </div>

//       {/*  */}
//       {product.map((item, index) => {
//         const { action } = item;
//         const classAction = action === 'add' ? style.add : action === 'remove' ? style.remove : '';

//         return (
//           <div key={index} className={style.panelBodyBody}>
//             <span className={`${style.action} ${classAction}`}></span>
//             <span>{index + 1}</span>
//             {keyList.map((key, index) => {
//               const { width, type } = cellConfig[key];
//               const value = item[key];
//               const theStyle = { width };

//               if (type === 'checkbox') {
//                 return (
//                   <div className={`${style.column} text-center`} key={index} style={theStyle}>
//                     <Checkbox01 stateValue={value as boolean} cursor="auto" />
//                   </div>
//                 );
//               }

//               if (type === 'selectWithIcon') {
//                 const { label, icon } = value as {
//                   label: string;
//                   icon: string;
//                 };

//                 return (
//                   <div className={style.column} key={index} style={theStyle}>
//                     {/*  eslint-disable-next-line @next/next/no-img-element */}
//                     <img src={icon} alt="" />
//                     <span>{label}</span>
//                   </div>
//                 );
//               }

//               return (
//                 <div className={style.column} key={index} style={theStyle}>
//                   <span>{value as string}</span>
//                 </div>
//               );
//             })}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

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
    reRender,
    reset,
    //
    productList,
    prodCellConfig,
    prodKeyArr,
    prodVKeyArr,
    setProdVKeyArr,
    addProd,
    changeProdKeyArr,
    //
    subTotal,
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
    changeOthersKeyArr,
    addOthers,
    getOthersPostBodyArr,
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
      />
    </div>
  );
};
