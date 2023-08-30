import { useState, useCallback } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import AddButton from 'components/global/gear/button/addButton';

import { Class_addition, Class_legacyContract } from 'hooks/quotation/useLegacyContract';

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

// icon
import iconMove from 'public/image/icon/move.svg';

// css
import styleL from '../local.module.scss';
import scss from './quotationAdditions_legacyContract.module.scss';

export default function QuotationExAddi({
  legacyContract,
  disabled,
}: {
  legacyContract: Class_legacyContract;
  disabled: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const { additionCellConfig: additionCellConfig, addiExchangeList } = legacyContract;

  const { addExAddi } = legacyContract;

  const additionKeyArr = legacyContract.exAddiKeyArr;
  const cellConfig = additionCellConfig.cellConfig;
  // -------------------------------------------------------------------

  const { sensors, dndKeyArr, movingId, onDragEnd, onDragStart } = useVerticalDnd({
    listKeyArr: Object.keys(addiExchangeList),
    resetTrigger: legacyContract,
  });

  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------

  const ExchangeRow = useCallback(function ExchangeRow({
    pIndex,
    delSelf,
    classAddi,
    isMoving,
    id,
  }: {
    pIndex: number;
    delSelf?: () => void;
    classAddi: Class_addition;
    isMoving: boolean;
    id: string;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id,
    });

    const itemStyle = {
      transform: CSS.Transform.toString(transform),
      // transition,
    };

    return (
      <div style={itemStyle} ref={setNodeRef} className={classNames(isMoving && 'z-10', 'relative')}>
        <CellWithBar
          isActive={activeIndex === pIndex}
          className={classNames(styleL.row, scss.row)}
          onClick={() => {
            setActiveIndex(pIndex);
          }}
        >
          {/*  */}
          <ControlBox delSelf={delSelf} index={pIndex + 1} dndAttr={attributes} dndListener={listeners} />
          {/*  */}
          {additionKeyArr.map((key, cIndex) => {
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
                    value: classAddi[key],
                    onChange: (v) => (classAddi[key] = v),
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
      <div className={classNames(scss.container, scss.exchange)}>
        <div className={styleL.header}>
          <h2>變更 配件設定</h2>
        </div>

        <div className={classNames(scss.main)}>
          <div className={scss.left}>
            {/* thead */}
            <div className={styleL.thead + ' ' + scss.thead}>
              <div className={classNames(scss.btnBox, scss.headEmpty, scss.exchange)} />

              {additionKeyArr.map((item, index) => {
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
                  const addi = addiExchangeList[key];

                  if (!addi) {
                    return null;
                  }

                  const classAddi = addi.addi;
                  const delSelf = addi.delSelf;
                  const isMoving = movingId === key;

                  return (
                    <ExchangeRow
                      key={key}
                      id={key}
                      //
                      classAddi={classAddi}
                      pIndex={pIndex}
                      delSelf={delSelf}
                      isMoving={isMoving}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
            <AddButton className={scss.addBtn} label="追加配件" onClick={addExAddi} />
          </div>
        </div>
      </div>
      <div className={classNames(scss.total, scss.exchange)}>
        <span>合計</span>
        <span>+ {legacyContract.addiExTotal.toLocaleString()}</span>
      </div>
      {/* wrapper close */}
    </div>
  );
  // -----------------------------------
} // QuotationExAddi

// =======================================================================

const ControlBox = ({
  delSelf,
  index,
  dndAttr,
  dndListener,
}: {
  delSelf?: () => void;
  index: number | string;

  dndAttr: DraggableAttributes;
  dndListener: SyntheticListenerMap | undefined;
}) => {
  return (
    <div className={classNames(scss.btnBox, scss.exchange, 'chameleon')}>
      <Image className={scss.move} src={iconMove} alt="move" {...dndAttr} {...dndListener} />
      <button className={classNames(scss.btn, !delSelf && scss.hidden)} onClick={delSelf}>
        刪除
      </button>
      <span>{index}</span>
    </div>
  );
};
