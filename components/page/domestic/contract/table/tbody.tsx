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

// css

import scss from './tbody.module.scss';

// type
import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import type { Toption } from 'js/utils/options/options';

// ==========================================================
type Titem = {
  [key: string]: any;
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
  rowList,
  keyArr,
  prodCellConfig,
  onRowClick,
  panelBox,
  rowHeight,
}: {
  disabled: boolean;
  rowList: TitemList;
  keyArr: string[];
  prodCellConfig: TcellConfig;
  onRowClick?: (obj: { item: Titem; key: string }) => void;
  panelBox?: 'stateBox' | 'easyBox';
  rowHeight?: 'h60' | 'h106';
}) {
  // ---------------------------------------------------------------

  const [activeKey, setActiveKey] = useState('');

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
      {Object.keys(rowList).map((key, pIndex) => {
        if (!rowList[key]) {
          return null;
        }

        const item = rowList[key];

        if (!item) {
          return <NoItem key={key} />;
        }

        return (
          <DndRow
            key={key}
            id={key}
            isActive={activeKey === key}
            pIndex={pIndex}
            item={item}
            keyArr={keyArr}
            disabled={true}
            panelBox={panelBox}
            //
            prodCellConfig={prodCellConfig}
            //
            onRowClick={() => {
              setActiveKey(key);
              onRowClick && onRowClick({ item: item, key });
            }}
            rowHeight={rowHeight}
          />
        );
      })}
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

const easyBox = ({ indexNum }: { indexNum: string | number }) => {
  return (
    <div className={classNames(scss.buttonBox, 'chameleon', 'w-[80px]')}>
      <span>{indexNum}</span>
    </div>
  );
};

const StateBox = ({ indexNum, state }: { indexNum: string | number; state: 'add' | 'div' | undefined }) => {
  return (
    <div className={classNames(scss.buttonBox, 'chameleon', 'w-[80px]')}>
      <div className={classNames(scss.circle, state && scss[state ?? ''])} />
      <span>{indexNum}</span>
    </div>
  );
};

// --------------------------------------------------------

const NoItem = () => {
  return (
    <div className={classNames('relative')}>
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
  disabled,
  onRowClick,
  prodCellConfig,
  isActive,
  panelBox = 'easyBox',
  rowHeight,
}: // state,
{
  id: string;
  pIndex: number;
  item: Titem;
  keyArr: string[];
  disabled: boolean;
  //
  onRowClick?: () => void;
  isAppend?: boolean;
  prodCellConfig: TcellConfig;
  isActive?: boolean;
  panelBox?: 'stateBox' | 'easyBox';
  rowHeight?: 'h60' | 'h106';
  // state: 'add' | 'div';
  //
}) {
  /** 有attachedToProductId 代表是追減 沒有代表是追加 */
  const state = item.attachedToProductId ? 'div' : item.attachedToProductId === null ? 'add' : undefined;

  return (
    <div onClick={onRowClick} className={classNames('relative')}>
      <LoadingCover01 isLoading={item?.isLoading} size={40} />
      <CellWithBar isActive={isActive} className="z-0">
        <div className={classNames(scss.row, rowHeight && scss[rowHeight])} onClick={undefined}>
          {/*  */}

          {panelBox === 'easyBox' && easyBox({ indexNum: pIndex + 1 })}
          {panelBox === 'stateBox' && <StateBox indexNum={pIndex + 1} state={state} />}

          {/*  */}
          {keyArr.map((key) => {
            if (!item) {
              return null;
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
                  <InputSel disabled={disabled} suffix={stateValue} suffixClassName="m-auto" {...inputSelProps} />
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
                <InputSel disabled={disabled} showBaseline="auto" {...inputSelProps} />
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
