import { useState } from 'react';

// antd
import { Collapse } from 'antd';
const { Panel } = Collapse;

// global gear
import { RotatingArrow01 } from 'public/image/icon/iconComponent/rotatingArrow';
import Checkbox01 from 'components/global/gear/checkbox/checkbox01';
// type
import {
  TchangeListItem,
  TchangeRecord,
  TrecordProduct,
} from 'fakeDatabase/domestic/quotation/fakeChangeProductRecord';

// css
import style from './quotationRecord.module.scss';

// config
import { prodCellConfigOri } from './hook/useProduct';

export default function QuotationRecord({ prodChangingRecord }: { prodChangingRecord: TchangeRecord | undefined }) {
  const { list } = prodChangingRecord ?? { list: {} };
  const recordKeyList = Object.keys(list);

  const { keyList: prodKeyList, cellConfig } = prodCellConfigOri();

  // ======================================================
  const [activePanel, setActivePanel] = useState<number[]>([]);

  const activeAllPanel = () => {
    const activeArr = recordKeyList.map((item, index) => index);

    if (activePanel.length === activeArr.length) {
      setActivePanel([]);
    } else {
      setActivePanel(activeArr);
    }
  };

  const isPanelAllActive = activePanel.length === recordKeyList.length;

  // ======================================================
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
          {recordKeyList.map((key, index) => {
            const changeInfo = list[key];
            const { product } = changeInfo;

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
                  <Thead />
                  <Tbody product={product} />
                </div>
              </Panel>
            );
          })}
        </Collapse>
      </div>

      {!prodChangingRecord && (
        <div className={style.noRecord}>
          <span>無追加/追減項目紀錄</span>
        </div>
      )}
    </div>
  ); // return

  // ======================================================
  function RecordInfo({
    changeInfo,
    panelSwitch,
    isActive,
  }: {
    changeInfo: TchangeListItem;
    panelSwitch: () => void;
    isActive: boolean;
  }) {
    const { id, date, priceChange, remark } = changeInfo;

    // 在金額數字前面加上 "+$" 或 "-$" 字串
    // replace的部分是加進千分位
    const formatedPriceChange =
      priceChange > 0
        ? `+$${priceChange}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : `-$${-priceChange}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return (
      <div className={style.recordInfo}>
        <span>{id}</span>
        <span /> {/* 直線 */}
        <span>{date}</span>
        <span>{formatedPriceChange}</span>
        <span>{remark}</span>
      </div>
    );
  } // RecordInfo

  function Thead() {
    return (
      <div className={style.thead}>
        <span></span>
        <span></span>
        {prodKeyList.map((key, index) => {
          const { id, label, width, type } = cellConfig[key];
          const theStyle = { width };
          const styleCenter = type === 'checkbox' ? 'text-center' : '';
          const className = `${style.column} ${styleCenter}`;

          return (
            <div className={className} key={index} style={theStyle}>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    );
  } // Thead

  function Tbody({ product }: { product: TrecordProduct[] }) {
    return (
      <>
        {
          product.map((item, index) => {
            const { action } = item;
            const classAction = action === 'add' ? style.add : action === 'remove' ? style.remove : '';

            return (
              <div key={index} className={style.tbody}>
                <span className={`${style.action} ${classAction}`}></span>
                <span>{index + 1}</span>
                {
                  prodKeyList.map((key, index) => {
                    const { width, type } = cellConfig[key];
                    const value = item[key];
                    const theStyle = { width };

                    if (type === 'selectWithIcon') {
                      const { label, icon } = value as {
                        label: string;
                        icon: string;
                      };

                      return (
                        <div className={style.column} key={index} style={theStyle}>
                          {/*  eslint-disable-next-line @next/next/no-img-element */}
                          <img src={icon} alt="" />
                          <span>{label}</span>
                        </div>
                      );
                    }

                    if (type === 'checkbox') {
                      return (
                        <div className={`${style.column} text-center`} key={index} style={theStyle}>
                          <Checkbox01 stateValue={value as boolean} cursor="auto" />
                        </div>
                      );
                    }

                    return (
                      <div className={style.column} key={index} style={theStyle}>
                        <span>{value as string}</span>
                      </div>
                    );
                  }) /* prodKeyList */
                }
              </div>
            );
          }) /* product */
        }
      </>
    );
  } // Tbody
} // QuotationRecord

// ================================================================
// ================================================================
// ================================================================
