import { useState, useEffect } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import _ from 'lodash';
// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';
import iconMove from 'public/image/icon/move.svg';

// css
import scss from './productList.module.scss';
// type

import { TprodCellConfig } from 'hooks/quotation/useLegacyContract';

// ==========================================================
// ==========================================================
import { Class_legacyContract, Class_product } from 'hooks/quotation/useLegacyContract';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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

// ==========================================================

type TtheadKeyArr = TprodCellConfig['keyArr'] | Class_legacyContract['editProdKeyArr'];

// ==========================================================
export default function ProductList_legacy({
  classQuotation,
  disabled,
  isAppend,
  onVerticalKeyChange,
}: {
  classQuotation: Class_legacyContract;
  disabled: boolean;
  isAppend?: boolean;
  onVerticalKeyChange: (newKeyArr: string[]) => void;
}) {
  // ---------------------------------------------------------------
  const { classProductArr, prodCellConfig, activeProd, prodList } = classQuotation;

  const theadKeyArr: TtheadKeyArr = isAppend ? prodCellConfig.keyArr : classQuotation.editProdKeyArr;

  // ---------------------------------------------------------------

  // const centerReg = /L|W|h|B|typhoonProof|ejectionDoor/;

  // ---------------------------------------------------------------
  const [targetIndex, setTargetIndex] = useState<`${number}`>();

  const exchangeConfirm = (v: string) => {
    if (!targetIndex) {
      return;
    }

    const ressult = classProductArr[targetIndex].addExchange(v);

    if (ressult === false) {
      myAlert.warning({ title: '超過上限' });
    } else {
      setTargetIndex(undefined);
    }
  };

  const onCancel = () => {
    setTargetIndex(undefined);
  };

  // ---------------------------------------------------------------

  const { sensors, dndKeyArr, movingId, onDragEnd, onDragStart } = useVerticalDnd({
    listKeyArr: Object.keys(prodList),
    resetTrigger: classQuotation,
  });

  useEffect(() => {
    onVerticalKeyChange(dndKeyArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dndKeyArr]);

  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
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
            if (!prodList[key]) {
              return null;
            }

            const { prod, del, copy } = prodList[key];

            const isMoving = movingId === key;

            const toSetTargetIndex = () => {
              setTargetIndex(`${pIndex}`);
            };

            let isActive = false;

            if (isAppend) {
              if (prod.reduceQty !== '0') {
                isActive = true;
              }

              if (prod.exchangeQty !== 0) {
                isActive = true;
              }
            } else {
              isActive = activeProd === pIndex;
            }

            return (
              <DndRow
                key={key}
                isActive={isActive}
                pIndex={pIndex}
                // del 跟 copy在這個情況好像不對
                // 刪除或複製的對象會是?
                delProd={del}
                copyProd={copy}
                toSetTargetIndex={toSetTargetIndex}
                prod={prod}
                theadKeyArr={theadKeyArr}
                id={key}
                isMoving={isMoving}
                disabled={disabled}
                //
                onRowClick={() => {
                  classQuotation.activeProd = pIndex;
                }}
                isAppend={isAppend}
                prodCellConfig={prodCellConfig}
              />
            );
          })}
        </SortableContext>
      </DndContext>

      <InputModal
        visible={!!targetIndex}
        title="請輸入變更數量"
        tip={`上限 : ${targetIndex && classProductArr[targetIndex].remainQty}`}
        onConfirm={(v) => {
          exchangeConfirm?.(v);
        }}
        onCancel={onCancel}
        inputAttr={{ type: 'number', placeholder: '請輸入數量' }}
      />
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

const CopyDelBtnBox = ({
  disabled,
  del,
  copy,
  indexNum,
  dndAttr,
  dndListener,
}: {
  disabled: boolean;
  del: () => void;
  copy: () => void;
  indexNum: string | number;
  dndAttr: DraggableAttributes;
  dndListener: SyntheticListenerMap | undefined;
}) => {
  return (
    <div className={classNames(scss.buttonBox, 'chameleon')}>
      <Image className={scss.move} src={iconMove} alt="move" {...dndAttr} {...dndListener} />

      <IconDelete01
        className={scss.svgBtn}
        onClick={(e) => {
          e.stopPropagation();

          if (!disabled) {
            del();
          }
        }}
      />
      <IconCopy
        className={scss.svgBtn}
        onClick={() => {
          if (!disabled) {
            copy();
          }
        }}
      />
      <span>{indexNum}</span>
    </div>
  );
};

// --------------------------------------------------------

const ResetChangeBtnBox = ({
  toSetTargetIndex,
  clearExchange,
  dndAttr,
  dndListener,
  indexNum,
}: {
  toSetTargetIndex: () => void;
  clearExchange: () => void;
  dndAttr: DraggableAttributes;
  dndListener: SyntheticListenerMap | undefined;
  indexNum: string | number;
}) => {
  return (
    <div className={classNames(scss.buttonBox, scss.resetChange, 'chameleon')}>
      <Image className={scss.move} src={iconMove} alt="move" {...dndAttr} {...dndListener} />
      <button className={scss.btn} onClick={clearExchange}>
        還原
      </button>
      <button className={scss.btn} onClick={toSetTargetIndex}>
        變更
      </button>
      <span>{indexNum}</span>
    </div>
  );
};

// --------------------------------------------------------
function DndRow({
  isActive,
  pIndex,
  delProd,
  copyProd,
  toSetTargetIndex,
  prod,
  theadKeyArr,
  id,
  isMoving,
  disabled,
  //
  onRowClick,
  isAppend,
  prodCellConfig,
}: {
  isActive: boolean;
  pIndex: number;
  delProd: () => void;
  copyProd: () => void;
  toSetTargetIndex: () => void;
  prod: Class_product;
  theadKeyArr: TtheadKeyArr;
  id: string;
  isMoving: boolean;
  disabled: boolean;
  //
  onRowClick: () => void; // () => (classQuotation.activeProd = pIndex)
  isAppend?: boolean;
  prodCellConfig: TprodCellConfig;
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
      <CellWithBar isActive={isActive} className="z-0">
        <div className={scss.row} onClick={onRowClick}>
          {/*  */}
          {!isAppend && (
            <CopyDelBtnBox
              disabled={disabled}
              del={() => delProd()}
              copy={() => copyProd()}
              indexNum={pIndex + 1}
              dndAttr={attributes}
              dndListener={listeners}
            />
          )}
          {isAppend && (
            <ResetChangeBtnBox
              toSetTargetIndex={toSetTargetIndex}
              clearExchange={prod.clearExchange}
              dndAttr={attributes}
              dndListener={listeners}
              indexNum={pIndex + 1}
            />
          )}
          {/*  */}
          {theadKeyArr.map((key) => {
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
              if (key === 'doorTrack') {
                selectProps.dynaOptionsKey = prod.typhoonProtection ? 'typhoonProtection' : 'normal';
              }

              selectProps.easyValue = stateValue as string;

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

            //____
            return <InputSel key={key} className={scss.column} disabled={disabled} {...inputSelProps} />;
          })}
          {/* column */}
        </div>
        {/* row */}
      </CellWithBar>
    </div>
  );
}
