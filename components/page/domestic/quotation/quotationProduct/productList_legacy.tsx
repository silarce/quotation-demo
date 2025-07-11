import { useState, useEffect } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import _ from 'lodash';
// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';
import iconMove from 'public/image/icon/move.svg?url';
import iconReset from 'public/image/icon/reset.svg?url';
import iconChange from 'public/image/icon/change.svg?url';

// css
import scss from './productList.module.scss';
// type

import { TprodCellConfig } from 'hooks/quotation/legacy/useLegacyContract';

// ==========================================================
// ==========================================================
import { Class_legacyContract, Class_product } from 'hooks/quotation/legacy/useLegacyContract';

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
  isAppending,
  onVerticalKeyChange,
}: {
  classQuotation: Class_legacyContract;
  disabled: boolean;
  isAppend?: boolean;
  isAppending?: boolean;
  onVerticalKeyChange: (newKeyArr: string[]) => void;
}) {
  // ---------------------------------------------------------------
  const [activeKey, setActiveKey] = useState<string>();
  // ---------------------------------------------------------------
  const { prodCellConfig, prodList } = classQuotation;

  const theadKeyArr: TtheadKeyArr = isAppend ? prodCellConfig.keyArr : classQuotation.editProdKeyArr;

  // ---------------------------------------------------------------

  const [targetProd, setTargetProd] = useState<Class_product | undefined>();

  const exchangeConfirm_2 = (v: string) => {
    if (!targetProd) {
      return;
    }

    const ressult = targetProd.addExchange(v);

    if (ressult === false) {
      myAlert.warning({ title: '超過上限' });
    } else {
      setTargetProd(undefined);
    }
  };

  const onCancel_2 = () => {
    setTargetProd(undefined);
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
            const prod = prodList[key];

            if (!prod) {
              return null;
            }

            const isMoving = movingId === key;

            // const toSetTargetIndex = () => {
            //   setTargetIndex(`${pIndex}`);
            // };

            const toSetTargeProd = () => {
              setTargetProd(prod);
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
              isActive = activeKey === key;
            }

            return (
              <DndRow
                key={key}
                isActive={isActive}
                pIndex={pIndex}
                delProd={() => prod.delSelf()}
                copyProd={() => prod.copySelf()}
                toSetTargeProd={toSetTargeProd}
                prod={prod}
                theadKeyArr={theadKeyArr}
                id={key}
                isMoving={isMoving}
                disabled={disabled}
                //
                onRowClick={() => {
                  setActiveKey(key);
                }}
                isAppend={isAppend}
                prodCellConfig={prodCellConfig}
                //
                isAppending={isAppending}
              />
            );
          })}
        </SortableContext>
      </DndContext>

      <InputModal
        open={!!targetProd}
        title="請輸入變更數量"
        tip={`上限 : ${targetProd && targetProd.remainQty}`}
        onConfirm={(v) => {
          exchangeConfirm_2(v);
        }}
        onCancel={onCancel_2}
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
            myAlert.confirm({
              title: '確定移除?',
              props: {
                onOk: () => {
                  del();
                },
              },
            });
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
  copySelfToExchange,
  dndAttr,
  dndListener,
  indexNum,
  isAppending,
}: {
  toSetTargetIndex: () => void;
  clearExchange: () => void;
  copySelfToExchange: () => void;
  dndAttr: DraggableAttributes;
  dndListener: SyntheticListenerMap | undefined;
  indexNum: string | number;
  isAppending?: boolean;
}) => {
  return (
    <div className={classNames(scss.buttonBox, scss.resetChange, 'chameleon')}>
      <Image className={scss.iconBtn} src={iconMove} alt="move" {...dndAttr} {...dndListener} />

      <IconCopy
        className={classNames(scss.iconBtn, scss.littleBtn, !isAppending && scss.hidden)}
        //
        onClick={copySelfToExchange}
      />
      <Image
        src={iconReset}
        alt="還原"
        className={classNames(scss.iconBtn, scss.littleBtn, !isAppending && scss.hidden)}
        onClick={clearExchange}
      />
      <Image
        src={iconChange}
        alt="變更"
        className={classNames(scss.iconBtn, scss.littleBtn, !isAppending && scss.hidden)}
        onClick={toSetTargetIndex}
      />

      {/* <button className={classNames(scss.btn, !isAppending && scss.hidden)} onClick={clearExchange}>
        還原
      </button>
      <button className={classNames(scss.btn, !isAppending && scss.hidden)} onClick={toSetTargetIndex}>
        變更
      </button> */}
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
  toSetTargeProd,
  prod,
  theadKeyArr,
  id,
  isMoving,
  disabled,
  //
  onRowClick,
  isAppend,
  prodCellConfig,
  //
  isAppending,
}: {
  isActive: boolean;
  pIndex: number;
  delProd: () => void;
  copyProd: () => void;
  toSetTargeProd: () => void;
  prod: Class_product;
  theadKeyArr: TtheadKeyArr;
  id: string;
  isMoving: boolean;
  disabled: boolean;
  //
  onRowClick: () => void; // () => (classQuotation.activeProd = pIndex)
  isAppend?: boolean;
  prodCellConfig: TprodCellConfig;
  //
  isAppending?: boolean;
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
              toSetTargetIndex={toSetTargeProd}
              clearExchange={() => prod.clearExchange()}
              copySelfToExchange={() => prod.copySelfToExchange()}
              dndAttr={attributes}
              dndListener={listeners}
              indexNum={pIndex + 1}
              isAppending={isAppending}
            />
          )}
          {/*  */}
          {theadKeyArr.map((key) => {
            if (!prod) {
              return null;
            }

            const stateValue = prod[key];
            const inputSelProps = _.cloneDeep(prodCellConfig.cellConfig[key].inputSelProps);
            const { inputProps, selectProps, checkBoxProps, suffix, inputPropsAndSelectProps } = inputSelProps;

            //____
            if (inputProps?.props) {
              inputProps.props.value = stateValue as string;

              inputProps.props.onChange = (e) => {
                (prod[key] as string) = e.target.value;
              };
            }

            //____
            if (selectProps) {
              // if (key === 'doorTrack') {
              //   selectProps.dynaOptionsKey = prod.typhoonProtection ? 'typhoonProtection' : 'normal';
              // }

              selectProps.easyValue = stateValue as string;

              if (selectProps.props) {
                if (key === 'doorTrack') {
                  // selectProps.dynaOptionsKey = prod.typhoonProtection ? 'typhoonProtection' : 'normal';
                  // selectProps.props!.options = prod.options_doorTrack;
                  selectProps.props!.options = prod.options_doorTrack;
                }

                if (key === 'doorType') {
                  selectProps.props!.options = prod.options_doorModel_byQuoteType;
                }

                selectProps.props.onChange = (option) => {
                  (prod[key] as string) = option?.value ?? '';
                };
              }
            }

            //____

            if (inputPropsAndSelectProps) {
              const {
                // bro means brother
                inputProps: inputProps_bro,
                selectProps: selectProps_bro,
              } = inputPropsAndSelectProps;

              if (inputProps_bro?.props) {
                inputProps_bro.props.value = stateValue as string;

                inputProps_bro.props.onChange = (e) => {
                  (prod[key] as string) = e.target.value;
                };
              }

              selectProps_bro.easyValue = stateValue as string;

              if (selectProps_bro.props) {
                selectProps_bro.props.onChange = (option) => {
                  (prod[key] as string) = option?.value ?? '';
                };

                if (key === 'doorType') {
                  selectProps_bro.props.options = prod.options_doorModel_byQuoteType;
                }
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
            return (
              <InputSel
                //
                key={key}
                className={scss.column}
                disabled={disabled}
                showBaseline="auto"
                {...inputSelProps}
              />
            );
          })}
          {/* column */}
        </div>
        {/* row */}
      </CellWithBar>
    </div>
  );
}
