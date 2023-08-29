import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import _ from 'lodash';

// components
import ExchangePanel, { ExchangeRow } from './exchangePanel/exchangePanel';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import AddButton from 'components/global/gear/button/addButton';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';

import { Class_legacyContract, Class_addition } from 'hooks/quotation/useLegacyContract';

// icon
import { IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';
import iconMove from 'public/image/icon/move.svg';

// css
import styleL from '../local.module.scss';
import scss from './quotationAdditions_legacyContract.module.scss';

// ==========================================================================
// dnd
import { useVerticalDnd } from '../hook/useVerticalDnd';
import {
  DndContext,
  // PointerSensor,
  // useSensor,
  // useSensors,
  // DragStartEvent,
  // DragEndEvent,
  DraggableAttributes,
} from '@dnd-kit/core';

import {
  // arrayMove,
  SortableContext,
  // horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  restrictToVerticalAxis,
  //  restrictToHorizontalAxis, restrictToWindowEdges
} from '@dnd-kit/modifiers';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

// ==========================================================================
export default function QuotationAdditions({
  legacyContract,
  disabled,
  isAppend,
}: {
  legacyContract: Class_legacyContract;
  disabled: boolean;
  isAppend?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const { additionCellConfig: additionCellConfig, addiList } = legacyContract;

  const classAdditionArr = legacyContract.classAdditionArr;

  const { addAddition, delAddition } = legacyContract ?? {};

  // const additionKeyindex = additionCellConfig.keyArr;
  const additionKeyindex = isAppend ? additionCellConfig.keyArr : legacyContract.editAddiKeyArr;

  const cellConfig = additionCellConfig.cellConfig;
  // -------------------------------------------------------------------
  const [targetIndex, setTargetIndex] = useState<`${number}`>();

  const exchangeConfirm = (v: string) => {
    if (!targetIndex) {
      return;
    }

    const ressult = classAdditionArr[targetIndex].addExchange(v);

    if (ressult === false) {
      myAlert.warning({ title: '超過上限' });
    } else {
      setTargetIndex(undefined);
    }
  };

  const onCancel = () => {
    setTargetIndex(undefined);
  };

  // -------------------------------------------------------------------
  let exchangeTotal = 0;

  // -------------------------------------------------------------------

  const { sensors, dndKeyArr, movingId, onDragEnd, onDragStart } = useVerticalDnd({
    listKeyArr: Object.keys(addiList),
    resetTrigger: legacyContract,
  });

  const DndRow = useCallback(function DndRow({
    isActive,
    pIndex,
    toSetTargetIndex,
    addi,
    disabled,
    id,
    isMoving,
  }: {
    isActive: boolean;
    pIndex: number;
    toSetTargetIndex: () => void;
    addi: Class_addition;
    disabled?: boolean;
    id: string;
    isMoving: boolean;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id,
    });

    const itemStyle = {
      transform: CSS.Transform.toString(transform),
      //不知為何，會有回到原位的動畫(即使動畫結束後位置的確改變了)。乾脆把transition拿掉
      // 連同其他地方的transition也拿掉
      // transition
    };

    return (
      <div style={itemStyle} ref={setNodeRef} className={classNames(isMoving && 'z-10', 'relative')}>
        <CellWithBar
          isActive={isActive}
          className={classNames(styleL.row, scss.row)}
          onClick={() => {
            setActiveIndex(pIndex);
          }}
        >
          {/*  */}
          {!isAppend && (
            <EditBtnBox
              dndAttr={attributes}
              dndListener={listeners}
              disabled={disabled}
              del={() => delAddition(pIndex)}
              indexNumber={pIndex + 1}
            />
          )}
          {isAppend && <ResetChangeBtnBox toSetTargetIndex={toSetTargetIndex} clearExchange={addi.clearExchange} />}

          {/*  */}
          {additionKeyindex.map((key, cIndex) => {
            const { width, flex, type, inputType } = cellConfig[key];
            const theStyle = { width, flex };

            let showBaseline: 'auto' | 'invisible' = 'auto';

            let theDisabled = disabled;

            if (key === 'quotationNumber') {
              theDisabled = true;
              showBaseline = 'invisible';
            }

            return (
              <div className={scss.column} key={cIndex} style={theStyle}>
                <InputSel
                  disabled={theDisabled}
                  showBaseline={showBaseline}
                  inputProps={{
                    value: addi[key],
                    onChange: (v) => (addi[key] = v),
                    inputType: inputType,
                  }}
                />
              </div>
            );
          })}
        </CellWithBar>
      </div>
    );
  },
  []);

  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  return (
    <div className={scss.wrapper}>
      <div className={scss.container}>
        <div className={styleL.header}>
          <h2>配件設定</h2>
        </div>

        <div className={scss.main}>
          <div className={scss.left}>
            {/* thead */}
            <div className={styleL.thead + ' ' + scss.thead}>
              <div className={classNames(scss.btnBox, scss.headEmpty, isAppend && scss.resetChange)} />

              {additionKeyindex.map((item, index) => {
                const { label, flex, width } = cellConfig[item];
                const theStyle = { width, flex };

                return (
                  <div className={classNames(styleL.theadCell, 'relative')} key={index} style={theStyle}>
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
            {/* tbody */}

            <DndContext
              sensors={sensors}
              modifiers={[
                restrictToVerticalAxis,
                // restrictToWindowEdges,
              ]}
              onDragEnd={onDragEnd}
              onDragStart={onDragStart}
            >
              <SortableContext items={dndKeyArr} strategy={verticalListSortingStrategy}>
                {dndKeyArr?.map((key, pIndex) => {
                  const addi = addiList[key];

                  if (!addi) {
                    return null;
                  }

                  const isMoving = movingId === key;

                  const toSetTargetIndex = () => {
                    setTargetIndex(`${pIndex}`);
                  };

                  let isActive = false;

                  if (isAppend) {
                    if (addi.reduceQty !== '0') {
                      isActive = true;
                    }

                    if (addi.exchangeQty !== 0) {
                      isActive = true;
                    }
                  } else {
                    isActive = activeIndex === pIndex;
                  }

                  return (
                    <DndRow
                      key={pIndex}
                      id={key}
                      //
                      addi={addi}
                      pIndex={pIndex}
                      isActive={isActive}
                      toSetTargetIndex={toSetTargetIndex}
                      disabled={disabled}
                      isMoving={isMoving}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>

            {!disabled && <AddButton className={scss.addBtn} label="新增項目" onClick={addAddition} />}
          </div>
          {isAppend && (
            <ExchangePanel>
              {classAdditionArr.map((addi, index) => {
                exchangeTotal += Number(addi.reduceExchangePrice);

                return (
                  <ExchangeRow
                    key={index}
                    oriQty={addi.quantity}
                    reduce={addi.reduceQty}
                    reduceOnChange={(v) => {
                      addi.reduceQty = v;
                    }}
                    exchange={addi.exchangeQty}
                    changedMoney={addi.reduceExchangePrice}
                  />
                );
              })}
            </ExchangePanel>
          )}
          {/* main close */}
        </div>

        {/* container close */}
      </div>
      <div className={classNames(scss.total)}>
        <span>合計</span>
        <span>- {exchangeTotal.toLocaleString()}</span>
      </div>

      {/*  */}
      <InputModal
        visible={!!targetIndex}
        title="請輸入變更數量"
        tip={`上限 : ${targetIndex && classAdditionArr[targetIndex].remainQty}`}
        onConfirm={(v) => {
          exchangeConfirm?.(v);
        }}
        onCancel={onCancel}
        inputAttr={{ type: 'number', placeholder: '請輸入數量' }}
      />

      {/* wrapper close */}
    </div>
  );
}

// =======================================================================
const EditBtnBox = ({
  disabled,
  del,
  indexNumber,
  dndAttr,
  dndListener,
}: {
  disabled?: boolean;
  del: () => void;
  indexNumber: number | string;
  dndAttr: DraggableAttributes;
  dndListener: SyntheticListenerMap | undefined;
}) => {
  return (
    <div className={classNames(scss.btnBox, 'chameleon')}>
      <Image className={scss.move} src={iconMove} alt="move" {...dndAttr} {...dndListener} />
      <div className={scss.delBtn}>
        <IconDelete01
          onClick={(e) => {
            e.stopPropagation();

            if (disabled) {
              return;
            }

            del;
          }}
        />
      </div>

      <span>{indexNumber}</span>
    </div>
  );
};

const ResetChangeBtnBox = ({
  toSetTargetIndex,
  clearExchange,
}: {
  toSetTargetIndex: () => void;
  clearExchange: () => void;
}) => {
  return (
    <div className={classNames(scss.btnBox, scss.resetChange, 'chameleon')}>
      <button className={scss.btn} onClick={clearExchange}>
        還原
      </button>
      <button className={scss.btn} onClick={toSetTargetIndex}>
        變更
      </button>
      <span>1</span>
    </div>
  );
};
