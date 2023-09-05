import { useState, useCallback } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import _ from 'lodash';

// components
import ExchangePanel, { ExchangeRow } from './exchangePanel/exchangePanel';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import InputSel, { TinputProps } from 'components/global/gear/inputAndSel_v2/inputSel';
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

  const {
    additionCellConfig: additionCellConfig,

    additionList,
    addAddition_2,
  } = legacyContract;

  const additionKeyindex = isAppend ? additionCellConfig.keyArr : legacyContract.editAddiKeyArr;

  const cellConfig = additionCellConfig.cellConfig;
  // -------------------------------------------------------------------

  const [targetAddi, setTargetAddi] = useState<Class_addition>();

  const exchangeConfirm = (v: string) => {
    if (!targetAddi) {
      return;
    }

    const ressult = targetAddi.addExchange(v);

    if (ressult === false) {
      myAlert.warning({ title: '超過上限' });
    } else {
      setTargetAddi(undefined);
    }
  };

  const onCancel = () => {
    setTargetAddi(undefined);
  };

  // -------------------------------------------------------------------
  let exchangeTotal = 0;

  // -------------------------------------------------------------------

  const { sensors, dndKeyArr, movingId, onDragEnd, onDragStart } = useVerticalDnd({
    listKeyArr: Object.keys(additionList),
    resetTrigger: legacyContract,
  });

  const DndRow = useCallback(function DndRow({
    isActive,
    pIndex,
    toSetTarget,
    addi,
    disabled,
    id,
    isMoving,
  }: {
    isActive: boolean;
    pIndex: number;
    toSetTarget: () => void;
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
              del={() => {
                addi.delSelf();
              }}
              indexNumber={pIndex + 1}
            />
          )}
          {isAppend && (
            <ResetChangeBtnBox
              toSetTargetIndex={toSetTarget}
              clearExchange={addi.clearExchange}
              indexNumber={pIndex + 1}
              dndAttr={attributes}
              dndListener={listeners}
            />
          )}

          {/*  */}
          {additionKeyindex.map((key, cIndex) => {
            const inputSelPorps = _.cloneDeep(cellConfig[key].inputSelPorps);

            const inputProps: TinputProps = {
              ...inputSelPorps.inputProps,
              props: {
                value: addi[key],
                onChange: (e) => (addi[key] = e.target.value),
                ...inputSelPorps?.inputProps?.props,
              },
            };

            return (
              <InputSel
                key={cIndex}
                className={scss.column}
                disabled={disabled}
                showBaseline="auto"
                {...inputSelPorps}
                inputProps={inputProps}
              />
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
                const { label, inputSelPorps } = cellConfig[item];
                const theStyle = inputSelPorps?.wrapperStyle;

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
                  const addi = additionList[key];

                  if (!addi) {
                    return null;
                  }

                  const isMoving = movingId === key;

                  const toSetTarget = () => {
                    setTargetAddi(addi);
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
                      toSetTarget={toSetTarget}
                      disabled={disabled}
                      isMoving={isMoving}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>

            {!disabled && <AddButton className={scss.addBtn} label="新增項目" onClick={addAddition_2} />}
          </div>
          {isAppend && (
            <ExchangePanel>
              {dndKeyArr.map((key, index) => {
                const addi = additionList[key];

                if (!addi) {
                  return null;
                }

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
        visible={!!targetAddi}
        title="請輸入變更數量"
        tip={`上限 : ${targetAddi && targetAddi.remainQty}`}
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

            del();
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
  dndAttr,
  dndListener,
  indexNumber,
}: {
  toSetTargetIndex: () => void;
  clearExchange: () => void;
  dndAttr: DraggableAttributes;
  dndListener: SyntheticListenerMap | undefined;
  indexNumber: number | string;
}) => {
  return (
    <div className={classNames(scss.btnBox, scss.resetChange, 'chameleon')}>
      <Image className={scss.move} src={iconMove} alt="move" {...dndAttr} {...dndListener} />
      <button className={scss.btn} onClick={clearExchange}>
        還原
      </button>
      <button className={scss.btn} onClick={toSetTargetIndex}>
        變更
      </button>
      <span>{indexNumber}</span>
    </div>
  );
};
