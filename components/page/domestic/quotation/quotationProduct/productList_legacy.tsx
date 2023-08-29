import { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import Checkbox01 from 'components/global/gear/checkbox/checkbox01';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import { OptionWithIcon01 } from 'components/global/gear/select/optionWithIcon';
import { SingleValueWithIcon01 } from 'components/global/gear/select/singleValueWithIcon';
import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';
import iconMove from 'public/image/icon/move.svg';

// css
import scss from './productList.module.scss';
import scss_l from '../local.module.scss';

import { Toption } from 'js/utils/options/options';

// dnd
import { DragEndEvent } from '@dnd-kit/core';

// ==========================================================
// ==========================================================
import { Class_legacyContract, Class_product } from 'hooks/quotation/useLegacyContract';
import type {
  TprodInputCellType,
  TprodSelectWithIconCellType,
  TprodCheckboxCellType,
} from 'hooks/quotation/useLegacyContract';
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

  const theadKeyArr = isAppend ? prodCellConfig.keyArr : classQuotation.editProdKeyArr;
  type TtheadKeyArr = typeof theadKeyArr;

  // ---------------------------------------------------------------

  const centerReg = /L|W|h|B|typhoonProof|ejectionDoor/;

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

  const DndRow = useCallback(function DndRow({
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
        <CellWithBar isActive={isActive}>
          <div className={scss.row} onClick={() => (classQuotation.activeProd = pIndex)}>
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
              const stateValue = prod[key];

              if (!prod) {
                return null;
              }

              const { width, id, type, inputType, options } = prodCellConfig.cellConfig[key];
              const textCenter = centerReg.test(id) ? scss_l.textCenter : '';
              const theStyle = { width };
              const TheCell = cellSwitcher({
                dataItem: prod,
                key,
                type,
                disabled,
                stateValue,
                inputType,
                options,
              });

              return (
                <div className={`${scss.column} ${textCenter}`} key={key} style={theStyle}>
                  {TheCell}
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
                key={pIndex}
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
  function cellSwitcher({
    dataItem,
    key,
    type,
    disabled,
    stateValue,
    inputType,
    options,
  }: {
    dataItem: Class_product;
    key: Class_legacyContract['prodCellConfig']['keyArr'][number];
    type: 'input' | 'selectWithIcon' | 'checkbox' | 'select';
    disabled: boolean;
    stateValue: string | boolean | number;
    inputType?: string;
    options?: Toption[];
  }) {
    switch (type) {
      case 'input': {
        if (typeof stateValue !== 'string') {
          return null;
        }

        let showBaseline: 'auto' | 'invisible' = 'auto';

        if (key === 'quotationNumber') {
          disabled = true;
          showBaseline = 'invisible';
        }

        const onChange = (value: string) => (dataItem[key as keyof TprodInputCellType] = value);

        return (
          <InputSel
            disabled={disabled}
            showBaseline={showBaseline}
            inputProps={{
              value: stateValue,
              onChange: onChange,
              inputType: inputType,
            }}
          />
        );
      }

      case 'select': {
        if (typeof stateValue === 'boolean') {
          return null;
        }

        const onChange = (option: Toption | null) =>
          (dataItem[key as keyof TprodSelectWithIconCellType] = option!.value);

        return (
          <InputSel
            disabled={disabled}
            selectProps={{
              value: stateValue,
              options: options ?? [],
              onChange: onChange,
              arrowType: 'black',
              fontSize: '16px',
            }}
          />
        );
      }

      case 'selectWithIcon': {
        if (typeof stateValue === 'boolean') {
          return null;
        }

        const options: Toption[] = dataItem.options_doorTrack;

        const onChange = (option: Toption | null) =>
          (dataItem[key as keyof TprodSelectWithIconCellType] = option!.value);
        const customComponents = {
          Option: OptionWithIcon01,
          SingleValue: SingleValueWithIcon01,
        };

        return (
          <InputSel
            disabled={disabled}
            selectProps={{
              value: stateValue,
              options: options,
              onChange: onChange,
              arrowType: 'black',
              fontSize: '16px',
              customComponents: customComponents,
              selClassNames: {
                singleValue: () => scss.inputSelSingleValue,
                placeholder: () => scss.inputSelPlaceholder,
                input: () => scss.inputSelInput,
              },
            }}
          />
        );
      }

      case 'checkbox': {
        if (typeof stateValue !== 'boolean') {
          return null;
        }

        const onClick = () => {
          if (disabled) {
            return;
          }

          dataItem[key as keyof TprodCheckboxCellType] = !dataItem[key];
        };

        return (
          <div className={scss_l.checkbox}>
            <Checkbox01 stateValue={stateValue} disabled={disabled} onClick={onClick} />
          </div>
        );
      }

      default:
        return null;
    }
  }
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
