import { useState } from 'react';

import classNames from 'classnames';
import Image from 'next/image';
import _ from 'lodash';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';
import iconMove from 'public/image/icon/move.svg';
import iconReset from 'public/image/icon/reset.svg';
import iconChange from 'public/image/icon/change.svg';
// css

import scss from './tbody.module.scss';

// type
import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import type { Toption } from 'js/utils/options/options';

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
type Titem = {
  [key: string]: any;
  delSelf?: () => void;
  copySelf?: () => void;
  clearAttach?: () => void;
};

type TitemList = {
  [key: string]: Titem | null;
};

type TcellConfig = {
  [key in string]: {
    label: string;
    isOptionValue?: boolean;
    theadItemClassName?: string;
    isSuffixOnly?: boolean;
    inputSelProps: TinputSelProps;
  };
};

// ==========================================================
export default function Tbody({
  disabled,
  disabled_plus,
  disabledExceptionArr,
  rowList,
  keyArr,
  prodCellConfig,
  onRowClick,
  panelBox,
  defalutVKeyArr,
  onVKeyChange,
  rowHeight,
  showAttatchModal,
}: // onVerticalKeyChange,
{
  disabled: boolean;
  disabled_plus?: boolean;
  disabledExceptionArr?: string[];
  // prodList: TproductList;
  rowList: TitemList;
  keyArr: string[];
  prodCellConfig: TcellConfig;
  onRowClick?: (obj: { item: Titem; key: string }) => void;
  panelBox?: 'copyDelBtnBox' | 'easyBox' | 'comBox' | 'resetChangeBox';
  defalutVKeyArr?: string[];
  onVKeyChange?: (keyArr: string[] | undefined) => void;
  rowHeight?: 'h106';
  showAttatchModal?: () => void;
}) {
  // ---------------------------------------------------------------

  const [activeKey, setActiveKey] = useState('');

  const {
    sensors,
    dndKeyArr: vDndKeyArr,
    movingId,
    onDragEnd,
    onDragStart,
  } = useVerticalDnd({
    // listKeyArr: defalutVKeyArr || Object.keys(rowList),
    listKeyArr: Object.keys(rowList),
    resetTrigger: rowList,
    onKeyChange: onVKeyChange,
  });

  // console.log(rowList);
  // console.log(vDndKeyArr);

  // useEffect(() => {
  //   onVerticalKeyChange(dndKeyArr);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dndKeyArr]);

  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // onVKeyChange
  return (
    <div>
      <DndContext
        sensors={sensors}
        modifiers={[
          restrictToVerticalAxis,
          // restrictToWindowEdges,
        ]}
        // onDragEnd={onDragEnd}
        onDragEnd={(e) => onDragEnd(e)}
        onDragStart={onDragStart}
      >
        <SortableContext items={vDndKeyArr} strategy={verticalListSortingStrategy}>
          {vDndKeyArr.map((key, pIndex) => {
            if (!rowList[key]) {
              return null;
            }

            const item = rowList[key];

            const isMoving = movingId === key;

            if (!item) {
              return <NoItem key={key} id={key} isMoving={isMoving} />;
            }

            return (
              <DndRow
                key={key}
                id={key}
                isActive={activeKey === key}
                pIndex={pIndex}
                item={item}
                keyArr={keyArr}
                isMoving={isMoving}
                disabled={disabled}
                disabled_plus={disabled_plus}
                disabledExceptionArr={disabledExceptionArr}
                panelBox={panelBox}
                //
                prodCellConfig={prodCellConfig}
                //
                onRowClick={() => {
                  setActiveKey(key);
                  onRowClick && onRowClick({ item: item, key });
                }}
                defalutVKeyArr={defalutVKeyArr}
                rowHeight={rowHeight}
                showAttatchModal={showAttatchModal}
                clearAttach={item.clearAttach}
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

const CopyDelBtnBox = ({
  disabled,
  del,
  copy,
  indexNum,
  dndAttr,
  dndListener,
  hiddenDelCopy,
}: {
  disabled: boolean;
  del?: () => void;
  copy?: () => void;
  indexNum: string | number;
  dndAttr: DraggableAttributes;
  dndListener: SyntheticListenerMap | undefined;
  hiddenDelCopy?: boolean;
}) => {
  return (
    <div className={classNames(scss.buttonBox, 'chameleon', 'w-[137px]')}>
      <Image className={scss.move} src={iconMove} alt="move" {...dndAttr} {...dndListener} />

      <IconDelete01
        className={classNames(scss.svgBtn, hiddenDelCopy && scss.hidden)}
        onClick={(e) => {
          e.stopPropagation();

          if (!disabled) {
            del && del();
          }
        }}
      />
      <IconCopy
        className={classNames(scss.svgBtn, hiddenDelCopy && scss.hidden)}
        onClick={() => {
          if (!disabled) {
            copy && copy();
          }
        }}
      />
      <span>{indexNum}</span>
    </div>
  );
};

const EasyBox = ({
  indexNum,
  dndAttr,
  dndListener,
}: {
  indexNum: string | number;
  dndAttr: DraggableAttributes;
  dndListener: SyntheticListenerMap | undefined;
}) => {
  return (
    <div className={classNames(scss.buttonBox, 'chameleon', 'w-[80px]')}>
      <Image className={scss.move} src={iconMove} alt="move" {...dndAttr} {...dndListener} />
      <span>{indexNum}</span>
    </div>
  );
};

const ComBox = ({
  indexNum,
  dndAttr,
  dndListener,
  comName,
}: {
  indexNum: string | number;
  dndAttr: DraggableAttributes;
  dndListener: SyntheticListenerMap | undefined;
  comName: string;
}) => {
  return (
    <div className={classNames(scss.buttonBox, 'chameleon', 'w-[180px]')}>
      <Image className={scss.move} src={iconMove} alt="move" {...dndAttr} {...dndListener} />
      {/* <span>{indexNum}</span> */}
      <span>{comName}</span>
    </div>
  );
};

const ResetChangeBtnBox = ({
  toSetTargetIndex,
  clearExchange,
  dndAttr,
  dndListener,
  indexNum,
  isLatestBatch,
}: {
  toSetTargetIndex: undefined | (() => void);
  clearExchange: undefined | (() => void);
  dndAttr: DraggableAttributes;
  dndListener: SyntheticListenerMap | undefined;
  indexNum: string | number;
  isLatestBatch?: boolean;
}) => {
  return (
    <div className={classNames(scss.buttonBox, scss.resetChange, 'chameleon')}>
      <Image className={scss.iconBtn} src={iconMove} alt="move" {...dndAttr} {...dndListener} />

      <Image
        src={iconReset}
        alt="還原"
        className={classNames(scss.iconBtn, scss.littleBtn, !isLatestBatch && scss.hidden)}
        onClick={clearExchange}
      />
      <Image
        src={iconChange}
        alt="變更"
        className={classNames(scss.iconBtn, scss.littleBtn, !isLatestBatch && scss.hidden)}
        onClick={toSetTargetIndex}
      />

      {/* <button className={classNames(scss.btn, !isLatestBatch && scss.hidden)} onClick={clearExchange}>
        還原
      </button>
      <button className={classNames(scss.btn, !isLatestBatch && scss.hidden)} onClick={toSetTargetIndex}>
        變更
      </button> */}
      <span>{indexNum}</span>
    </div>
  );
};

// --------------------------------------------------------

const NoItem = ({
  id,

  isMoving,
}: {
  id: string;
  isMoving: boolean;

  //
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    // transition,
  };

  return (
    <div style={itemStyle} ref={setNodeRef} className={classNames(isMoving && 'z-10', 'relative')}>
      <CellWithBar isActive={false} className="z-0">
        <div className={scss.row} onClick={undefined}></div>
        {/* row */}
      </CellWithBar>
    </div>
  );
};

// --------------------------------------------------------
function DndRow({
  id,
  pIndex,
  item,
  keyArr: keyArr,
  defalutVKeyArr,
  isMoving,
  //
  disabled,
  disabled_plus,
  disabledExceptionArr,
  //
  onRowClick,
  prodCellConfig,
  isActive,
  panelBox = 'copyDelBtnBox',
  rowHeight,
  showAttatchModal,
  clearAttach,
}: {
  id: string;
  pIndex: number;
  // prod: Class_product;
  item: Titem;
  // prodKeyArr: TprodKey[];
  keyArr: string[];
  defalutVKeyArr?: string[];
  isMoving: boolean;
  //
  disabled: boolean;
  disabled_plus?: boolean;
  disabledExceptionArr?: string[];
  //
  onRowClick?: () => void;
  isAppend?: boolean;
  prodCellConfig: TcellConfig;
  isActive?: boolean;
  panelBox?: 'copyDelBtnBox' | 'easyBox' | 'comBox' | 'resetChangeBox';
  rowHeight?: 'h106';
  showAttatchModal?: () => void;
  clearAttach?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    // transition,
  };

  return (
    <div style={itemStyle} onClick={onRowClick} ref={setNodeRef} className={classNames(isMoving && 'z-10', 'relative')}>
      <LoadingCover01 isLoading={item?.isLoading} size={40} />
      <CellWithBar isActive={isActive} className="z-0">
        <div className={classNames(scss.row, rowHeight && scss[rowHeight])} onClick={undefined}>
          {/*  */}
          {panelBox === 'copyDelBtnBox' && (
            <CopyDelBtnBox
              disabled={disabled}
              del={item.delSelf}
              copy={item.copySelf}
              indexNum={pIndex + 1}
              dndAttr={attributes}
              dndListener={listeners}
              hiddenDelCopy={item.parentProd}
            />
          )}
          {panelBox === 'easyBox' && <EasyBox indexNum={pIndex + 1} dndAttr={attributes} dndListener={listeners} />}
          {panelBox === 'comBox' && (
            <ComBox indexNum={pIndex + 1} dndAttr={attributes} dndListener={listeners} comName={item.comName} />
          )}

          {panelBox === 'resetChangeBox' && (
            <ResetChangeBtnBox
              toSetTargetIndex={showAttatchModal}
              clearExchange={clearAttach}
              dndAttr={attributes}
              dndListener={listeners}
              indexNum={pIndex}
              isLatestBatch={true}
            />
          )}

          {/*  */}
          {keyArr.map((key) => {
            if (!item) {
              return null;
            }

            let theDisabled = disabled;

            if (key === 'quantity') {
              // item.disabled_quantity === true ? (theDisabled = true) : undefined;
              item.disabled_quantity === true
                ? (theDisabled = true)
                : item.disabled_quantity === false
                ? (theDisabled = false)
                : undefined;
            }

            if (disabledExceptionArr?.includes(key)) {
              theDisabled = false;
            }

            if (disabled_plus) {
              theDisabled = true;
            }

            const hiddenKeyArr = item.hiddenKeyArr as string[] | undefined;
            const isHidden = hiddenKeyArr?.includes(key);

            const stateValue = item[key];

            const { inputSelProps, isSuffixOnly } = _.cloneDeep(prodCellConfig[key]);
            const { inputProps, selectProps, checkBoxProps } = inputSelProps;

            if (isSuffixOnly) {
              return (
                <div
                  key={key}
                  className={classNames(scss.column, isHidden && scss.hidden)}
                  style={{ width: inputSelProps.wrapperStyle?.width }}
                >
                  <InputSel disabled={theDisabled} suffix={stateValue} suffixClassName="m-auto" {...inputSelProps} />
                </div>
              );
            }

            //____
            if (inputProps?.props) {
              inputProps.props.value = (stateValue as string) ?? '';

              inputProps.props.onChange = (e) => {
                (item[key] as string) = e.target.value;
              };
            }

            //____
            if (selectProps) {
              if (!selectProps.props) {
                selectProps.props = {};
              }

              const isOptionValue = prodCellConfig[key].isOptionValue;

              // if (key === 'doorTrack') {
              //   selectProps.dynaOptionsKey = item.typhoonProtection ? 'typhoonProtection' : 'normal';
              // }
              const options = item[`options_${key}`] as Toption[] | undefined;

              // ___________________

              if (isOptionValue) {
                selectProps.props.value = stateValue || null;
              } else {
                selectProps.easyValue = (stateValue as string) ?? '';
              }
              // ___________________

              selectProps.props = {
                options,
                ...selectProps.props,
                onChange: (option) => {
                  if (isOptionValue) {
                    item[key] = option;
                  } else {
                    item[key] = option?.value ?? '';
                  }
                },
              };
            }

            //____

            if (checkBoxProps?.propsArr[0]) {
              checkBoxProps.propsArr[0].value = !!stateValue as boolean;

              checkBoxProps.onChange = (arr) => {
                (item[key] as boolean) = !!arr[0];
              };

              inputSelProps.wrapperStyle = {
                justifyContent: 'center',
                ...inputSelProps.wrapperStyle,
              };
            }

            //____
            return (
              <div
                key={key}
                className={classNames(scss.column, isHidden && scss.hidden)}
                style={{ width: inputSelProps.wrapperStyle?.width }}
              >
                <InputSel disabled={theDisabled} showBaseline="auto" {...inputSelProps} />
              </div>
            );
          })}
          {/* column */}
        </div>
        {/* row */}
      </CellWithBar>
    </div>
  );
}

export type { Titem, TitemList, TcellConfig };
