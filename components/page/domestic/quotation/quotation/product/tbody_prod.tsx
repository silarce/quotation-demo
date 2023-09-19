import { useState, useEffect } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import _ from 'lodash';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';
import iconMove from 'public/image/icon/move.svg';

// css
// import scss from './productList.module.scss';
// import scss from './tbody_prod.module.scss';
import scss_p from '../public.module.scss';

// type
import type { Class_product, TproductList, TprodKey, TcellConfig } from 'hooks/quotation/useProduct';

// dnd
import { useVerticalDnd } from '../../hook/useVerticalDnd';
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
export default function Tbody_prod({
  disabled,
  prodList,
  prodKeyArr,
  prodCellConfig,
}: // onVerticalKeyChange,
{
  disabled: boolean;
  prodList: TproductList;
  prodKeyArr: TprodKey[];
  prodCellConfig: TcellConfig;

  // onVerticalKeyChange: (newKeyArr: string[]) => void;
}) {
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // const { prodCellConfig, prodList: prodList_2, prodKitList_2 } = classQuotation;

  // const theadKeyArr: TtheadKeyArr = isAppend ? prodCellConfig.keyArr : classQuotation.editProdKeyArr;

  // ---------------------------------------------------------------

  // ---------------------------------------------------------------

  const {
    sensors,
    dndKeyArr: vDndKeyArr,
    movingId,
    onDragEnd,
    onDragStart,
  } = useVerticalDnd({
    listKeyArr: Object.keys(prodList),
    // resetTrigger: classQuotation,
  });

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
  return (
    <div className={scss_p.container}>
      <DndContext
        sensors={sensors}
        modifiers={[
          restrictToVerticalAxis,
          // restrictToWindowEdges,
        ]}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
      >
        <SortableContext items={vDndKeyArr} strategy={verticalListSortingStrategy}>
          {vDndKeyArr.map((key, pIndex) => {
            if (!prodList[key]) {
              return null;
            }

            const prod = prodList[key];

            const isMoving = movingId === key;

            return (
              <DndRow
                key={key}
                id={key}
                // isActive={false}
                pIndex={pIndex}
                prod={prod}
                prodKeyArr={prodKeyArr}
                isMoving={isMoving}
                disabled={disabled}
                //

                prodCellConfig={prodCellConfig}
                //
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
}: {
  disabled: boolean;
  del: () => void;
  copy: () => void;
  indexNum: string | number;
  dndAttr: DraggableAttributes;
  dndListener: SyntheticListenerMap | undefined;
}) => {
  return (
    <div className={classNames(scss_p.buttonBox, 'chameleon', 'w-[137px]')}>
      <Image className={scss_p.move} src={iconMove} alt="move" {...dndAttr} {...dndListener} />

      <IconDelete01
        className={scss_p.svgBtn}
        onClick={(e) => {
          e.stopPropagation();

          if (!disabled) {
            del();
          }
        }}
      />
      <IconCopy
        className={scss_p.svgBtn}
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
function DndRow({
  id,
  pIndex,
  prod,
  prodKeyArr,
  isMoving,
  disabled,
  // onRowClick,
  prodCellConfig,
}: {
  id: string;
  pIndex: number;
  prod: Class_product;
  prodKeyArr: TprodKey[];
  isMoving: boolean;
  disabled: boolean;
  //
  // onRowClick: () => void; // () => (classQuotation.activeProd = pIndex)
  isAppend?: boolean;
  prodCellConfig: TcellConfig;
  //
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
      <CellWithBar isActive={false} className="z-0">
        <div className={scss_p.row} onClick={undefined}>
          {/*  */}
          <CopyDelBtnBox
            disabled={disabled}
            del={prod.delSelf}
            copy={prod.copySelf}
            indexNum={pIndex + 1}
            dndAttr={attributes}
            dndListener={listeners}
          />
          {/*  */}
          {prodKeyArr.map((key) => {
            if (!prod) {
              return null;
            }

            const stateValue = prod[key];
            const inputSelProps = _.cloneDeep(prodCellConfig[key].inputSelProps);
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
            return (
              <InputSel
                key={key}
                className={scss_p.column}
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
