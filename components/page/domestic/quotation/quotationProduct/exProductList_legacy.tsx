import { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import Image from 'next/image';
import classNames from 'classnames';
// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import Checkbox01 from 'components/global/gear/checkbox/checkbox01';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import { OptionWithIcon01 } from 'components/global/gear/select/optionWithIcon';
import { SingleValueWithIcon01 } from 'components/global/gear/select/singleValueWithIcon';

// dnd
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DraggableAttributes,
} from '@dnd-kit/core';

import {
  arrayMove,
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
import scss_l from '../local.module.scss';

import { Toption } from 'js/utils/options/options';

// ==========================================================
// ==========================================================
import { Class_legacyContract, Class_product } from 'hooks/quotation/useLegacyContract';
import type {
  TprodInputCellType,
  TprodSelectWithIconCellType,
  TprodCheckboxCellType,
} from 'hooks/quotation/useLegacyContract';

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
  const { prodExchangeList, prodCellConfig } = classQuotation;
  // const exChnageArr = Object.values(prodExchangeList);
  const exChnageKeyArr = Object.keys(prodExchangeList);

  // const theadIndex = prodCellConfig.keyList;
  const theadIndex = classQuotation.exProdKeyLArr;
  // ---------------------------------------------------------------

  const centerReg = /L|W|h|B|typhoonProof|ejectionDoor/;

  // ---------------------------------------------------------------
  const [activeIndex, setActiveIndex] = useState(-1);

  // ---------------------------------------------------------------

  const sensors = useSensors(useSensor(PointerSensor));

  const [movingId, setMovingId] = useState<string>();
  const [dndKeyArr, setDndKeyArr] = useState<string[]>([]);

  useEffect(() => {
    const newArr = Object.keys(prodExchangeList);

    if (newArr.length > dndKeyArr.length) {
      const newKeyArr = _.difference(newArr, dndKeyArr);
      setDndKeyArr([...dndKeyArr, ...newKeyArr]);
    }

    if (newArr.length < dndKeyArr.length) {
      const delDndKey = _.difference(dndKeyArr, newArr)[0];
      const delIndex = dndKeyArr.indexOf(delDndKey);
      dndKeyArr.splice(delIndex, 1);
      setDndKeyArr([...dndKeyArr]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exChnageKeyArr.length]);

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id) {
      const oldIndex = dndKeyArr.indexOf(active.id as string);
      const newIndex = dndKeyArr.indexOf(over?.id as string);

      const newKeyArr = arrayMove(dndKeyArr, oldIndex, newIndex);
      setDndKeyArr(newKeyArr);
    }

    setMovingId(undefined);
  };

  function onDragStart(e: DragStartEvent) {
    const { id } = e.active;
    setMovingId(id as string);
  }

  // ---------------------------------------------------------------

  const ExchangeRow = useCallback(function ExchangeRow({
    pIndex,
    isActive,
    isMoving,
    delSelf,
    prod,
    id,
  }: {
    pIndex: number;
    isActive: boolean;
    isMoving: boolean;
    delSelf?: () => void;
    prod: Class_product;
    id: string;
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
          <div className={scss.row} onClick={() => (classQuotation.activeProd = pIndex)}>
            {/*  */}
            <ControlBox delSelf={delSelf} index={pIndex + 1} dndAttr={attributes} dndListener={listeners} />
            {/*  */}
            {theadIndex.map((key) => {
              const { width, id, type, inputType, options } = prodCellConfig.cellConfig[key];
              const textCenter = centerReg.test(id) ? scss_l.textCenter : '';
              const theStyle = { width };
              const stateValue = prod[key];
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
            })}{' '}
            {/* column */}
          </div>{' '}
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
            // const { prod, delSelf } = prodExchangeList[key];
            const obj = prodExchangeList[key];

            if (!obj) {
              return null;
            }

            const { prod, delSelf } = obj;

            const isActive = pIndex === activeIndex;
            const isMoving = movingId === key;

            return (
              <ExchangeRow
                key={key}
                id={key}
                //
                pIndex={pIndex}
                isActive={isActive}
                isMoving={isMoving}
                delSelf={delSelf}
                prod={prod}
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
  // ------------------------

  // function ExchangeRow({
  //   pIndex,
  //   isActive,
  //   isMoving,
  //   delSelf,
  //   prod,
  //   id,
  // }: {
  //   pIndex: number;
  //   isActive: boolean;
  //   isMoving: boolean;
  //   delSelf?: () => void;
  //   prod: Class_product;
  //   id: string;
  // }) {
  //   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
  //     id,
  //   });

  //   const itemStyle = {
  //     transform: CSS.Transform.toString(transform),
  //     transition,
  //   };

  //   return (
  //     <div style={itemStyle} ref={setNodeRef} className={classNames(isMoving && 'z-10', 'relative')}>
  //       <CellWithBar
  //         isActive={isActive}
  //         onClick={() => {
  //           setActiveIndex(pIndex);
  //         }}
  //       >
  //         <div className={scss.row} onClick={() => (classQuotation.activeProd = pIndex)}>
  //           {/*  */}
  //           <ControlBox delSelf={delSelf} index={pIndex + 1} dndAttr={attributes} dndListener={listeners} />
  //           {/*  */}
  //           {theadIndex.map((key) => {
  //             const { width, id, type, inputType, options } = prodCellConfig.cellConfig[key];
  //             const textCenter = centerReg.test(id) ? scss_l.textCenter : '';
  //             const theStyle = { width };
  //             const stateValue = prod[key];
  //             const TheCell = cellSwitcher({
  //               dataItem: prod,
  //               key,
  //               type,
  //               disabled,
  //               stateValue,
  //               inputType,
  //               options,
  //             });

  //             return (
  //               <div className={`${scss.column} ${textCenter}`} key={key} style={theStyle}>
  //                 {TheCell}
  //               </div>
  //             );
  //           })}{' '}
  //           {/* column */}
  //         </div>{' '}
  //         {/* row */}
  //       </CellWithBar>
  //     </div>
  //   );
  // }
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

// <div key={pIndex}>
//   <CellWithBar isActive={isActive} onClick={() => setActiveIndex(pIndex)}>
//     <div className={scss.row} onClick={() => (classQuotation.activeProd = pIndex)}>
//       {/*  */}
//       <ControlBox delSelf={delSelf} index={pIndex + 1} />
//       {/*  */}
//       {theadIndex.map((key) => {
//         const { width, id, type, inputType, options } = prodCellConfig.cellConfig[key];
//         const textCenter = centerReg.test(id) ? scss_l.textCenter : '';
//         const theStyle = { width };
//         const stateValue = prod[key];
//         const TheCell = cellSwitcher({
//           dataItem: prod,
//           key,
//           type,
//           disabled,
//           stateValue,
//           inputType,
//           options,
//         });

//         return (
//           <div className={`${scss.column} ${textCenter}`} key={key} style={theStyle}>
//             {TheCell}
//           </div>
//         );
//       })}{' '}
//       {/* column */}
//     </div>{' '}
//     {/* row */}
//   </CellWithBar>
// </div>
