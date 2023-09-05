import { useState, useCallback } from 'react';
import _ from 'lodash';
import Image from 'next/image';
import classNames from 'classnames';
// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// dnd
import { useVerticalDnd } from '../hook/useVerticalDnd';
import { DndContext, DraggableAttributes } from '@dnd-kit/core';

import {
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
import scss from './productList.module.scss';

// ==========================================================
// ==========================================================
import { Class_legacyContract, Class_product } from 'hooks/quotation/useLegacyContract';

// ==========================================================
// ==========================================================
export default function ExProductList_legacy({
  classQuotation,
  disabled,
}: {
  classQuotation: Class_legacyContract;
  disabled: boolean;
}) {
  // ---------------------------------------------------------------
  const {
    prodCellConfig,
    //
    exProdList,
  } = classQuotation;
  const theadIndexArr = classQuotation.exProdKeyArr;
  type TtheadIndexArr = typeof theadIndexArr;

  // ---------------------------------------------------------------
  const [activeIndex, setActiveIndex] = useState(-1);

  // ---------------------------------------------------------------

  const { sensors, dndKeyArr, movingId, onDragEnd, onDragStart } = useVerticalDnd({
    listKeyArr: Object.keys(exProdList),
    resetTrigger: classQuotation,
  });

  // ---------------------------------------------------------------

  const ExchangeRow = useCallback(function ExchangeRow({
    pIndex,
    isActive,
    isMoving,
    delSelf,
    prod,
    id,
    theadIndexArr,
  }: {
    pIndex: number;
    isActive: boolean;
    isMoving: boolean;
    delSelf?: () => void;
    prod: Class_product;
    id: string;
    theadIndexArr: TtheadIndexArr;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id,
    });

    const itemStyle = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div style={itemStyle} ref={setNodeRef} className={classNames(isMoving && 'z-10', 'relative')}>
        <CellWithBar
          isActive={isActive}
          onClick={() => {
            setActiveIndex(pIndex);
          }}
        >
          <div className={scss.row}>
            {/*  */}
            <ControlBox delSelf={delSelf} index={pIndex + 1} dndAttr={attributes} dndListener={listeners} />
            {/*  */}
            {theadIndexArr.map((key) => {
              if (!prod) {
                return null;
              }

              const stateValue = prod[key];
              const inputSelProps = _.cloneDeep(prodCellConfig.cellConfig[key].inputSelProps);
              const { inputProps, selectProps, checkBoxProps } = inputSelProps;

              //____
              if (inputProps?.props) {
                inputProps.props.value = stateValue as string;

                inputProps.props.onChange = (e) => {
                  (prod[key] as string) = e.target.value;
                };
              }

              //____
              if (selectProps) {
                let dynyOptionsKey;

                if (key === 'doorTrack') {
                  dynyOptionsKey = prod.typhoonProtection ? 'typhoonProtection' : 'normal';
                }

                selectProps.easyValue = stateValue as string;

                selectProps.dynaOptionsKey = dynyOptionsKey;

                if (selectProps.props) {
                  selectProps.props.onChange = (option) => {
                    (prod[key] as string) = option?.value ?? '';
                  };
                }
              }

              //____

              if (checkBoxProps?.propsArr[0]) {
                checkBoxProps.propsArr[0].value = stateValue as boolean;

                checkBoxProps.onChange = (arr) => {
                  (prod[key] as boolean) = !!arr[0];
                };
              }

              return (
                <div
                  key={key}
                  // className={scss.column}
                >
                  <InputSel key={key} className={scss.column} disabled={disabled} {...inputSelProps} />
                </div>
              );
            })}
            {/* column */}
          </div>
          {/* row */}
        </CellWithBar>
      </div>
    );
  },
  []);

  // ---------------------------------------------------------------
  return (
    <div className={scss.container}>
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
          {dndKeyArr.map((key, pIndex) => {
            const exProd = exProdList[key];

            if (!exProd) {
              return null;
            }

            const isActive = pIndex === activeIndex;
            const isMoving = movingId === key;

            const hasParent = exProd.hasParent;

            const delSelf = !hasParent
              ? () => {
                  exProd.delSelf();
                }
              : undefined;

            return (
              <ExchangeRow
                key={key}
                id={key}
                //
                pIndex={pIndex}
                isActive={isActive}
                isMoving={isMoving}
                delSelf={delSelf}
                // delSelf={exProd.delSelf}
                prod={exProd}
                theadIndexArr={theadIndexArr}
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  ); // return

  // ===========================================================
  // ===========================================================
  // ===========================================================
  // ===========================================================
  // ===========================================================
  // ===========================================================
} //ProductList

// ================================================

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
    <div className={classNames(scss.buttonBox, scss.exchange, 'chameleon')}>
      <Image className={scss.move} src={iconMove} alt="move" {...dndAttr} {...dndListener} />
      <button className={classNames(scss.btn, !delSelf && scss.hidden)} onClick={delSelf}>
        刪除
      </button>
      <span>{index}</span>
    </div>
  );
};
