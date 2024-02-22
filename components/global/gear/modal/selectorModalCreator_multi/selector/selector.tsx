import { useState, useEffect, forwardRef, useImperativeHandle, ForwardedRef } from 'react';
import classNames from 'classnames';

import SearchBar, {
  TsearcbBarProps,
  TinputSelProps,
  TinputSelProp_search,
} from 'components/global/gear/inputAndSel_v2/searchBar/searchBar';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// css
import scss from './selector.module.scss';

// type
import { createUseInfinite, Tres, Tparams } from 'js/api/createUseInfinite';

// ==============================================================================

type TuseInfinite = ReturnType<typeof createUseInfinite>;

type TapiData = {
  [key: string]: any;
  id: string;
};

type Tconfig = {
  key: string;
  width?: React.CSSProperties['width'];
  flex?: React.CSSProperties['flex'];

  thead: {
    label: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  };

  tbody?: {
    className?: string;
    style?: React.CSSProperties;
  };
};

type TimperativeHandle = {
  clearSelected: () => void;
};

type TsearchInputSelProps = TsearcbBarProps['inputSelPropsArr'][number];

type TselectorProps<Tdata extends TapiData> = {
  useInfinit: TuseInfinite;
  configArr: readonly Tconfig[];
  selectedKey: keyof Tdata;
  params?: Tparams;
  searchInputSelPropsArr?: TsearchInputSelProps[];
  onRowClick?: (props: { data: Tdata; isRemove: boolean }) => void;
  filter?: (searchStrArr: string[]) => Tparams['filter'];
};

export type { TimperativeHandle, TsearchInputSelProps };

// ==============================================================================

// 參考 https://gist.github.com/IrvingArmenta/a6d7fc76ed538697ad18b7f074accdde
export const Selector = forwardRef(Selector_component) as <Tdata extends TapiData>(
  props: TselectorProps<Tdata> & { ref?: ForwardedRef<TimperativeHandle> }
) => ReturnType<typeof Selector_component>;

export function Selector_component<Tdata extends TapiData>(
  props: TselectorProps<Tdata>,
  ref: React.ForwardedRef<TimperativeHandle>
) {
  const {
    //
    useInfinit,
    configArr,
    selectedKey,
    params: params_out,
    searchInputSelPropsArr,
    onRowClick: onRowClick_callback,
    filter: filter_callback,
  } = props;

  const [selectedList, setSelectedList] = useState<{ [id: string]: Tdata }>({});
  const [searchStrArr, setSearchStrArr] = useState<string[]>([]);

  // ----------------------------------------------------------------------

  const filter = filter_callback && filter_callback(searchStrArr);

  const params: Tparams = {
    filter,
    ...params_out,
  };

  const {
    //
    dataList,
    dataArr,
    viewRef_top,
    viewRef_bottom,
    isLoadingPage1,
    isLoading,
    meta,
    init,
    reset,
    nextPage,
  } = useInfinit({ customParams: params });

  // ----------------------------------------------------------------------

  const onRowClick = (data: Tdata) => {
    const id = data.id;

    let isRemove = false;

    if (selectedList[id]) {
      setSelectedList((list) => {
        delete list[id];

        return { ...list };
      });
      isRemove = true;
    } else {
      setSelectedList((list) => {
        return { ...list, [id]: data };
      });
    }

    onRowClick_callback &&
      onRowClick_callback({
        data,
        isRemove,
      });
  };

  const clearSelected = () => {
    setSelectedList({});
  };

  // ----------------------------------------------------------------------

  // ----------------------------------------------------------------------

  const searcbBarProps: TsearcbBarProps | undefined = searchInputSelPropsArr && {
    onClick: (strArr) => {
      setSearchStrArr(strArr);
    },
    onChange: () => {},
    // inputSelPropsArr: [
    //   {
    //     inputProps: {},
    //   },
    // ],
    inputSelPropsArr: searchInputSelPropsArr ?? [],
  };

  // ----------------------------------------------------------------------

  useImperativeHandle(ref, () => ({
    clearSelected,
  }));

  // ----------------------------------------------------------------------

  useEffect(() => {
    reset();
  }, [searchStrArr]);

  // useEffect(() => {
  //   reset();
  // }, [searchStrArr]);

  // ----------------------------------------------------------------------

  return (
    <div className={scss.container}>
      {/*  */}

      <DataList>
        <DataList_top searcbBarProps={searcbBarProps} />
        <DataList_table<Tdata>
          configArr={configArr}
          dataArr={dataArr}
          onRowClick={onRowClick}
          selectedList={selectedList}
          viewRef_bottom={viewRef_bottom}
        />
      </DataList>
      {/*  */}
      <div className={scss.selectedList}>
        <div className={scss.caption}>已選擇</div>
        <ul className={scss.list}>
          {Object.values(selectedList).map((item, index) => {
            return (
              <li key={index} onClick={() => onRowClick(item)}>
                <CellWithBar>
                  <div className={scss.liContent}>
                    <div className={scss.dot} />
                    <div className={scss.value}>
                      <span>{item[selectedKey]}</span>
                    </div>
                  </div>
                </CellWithBar>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ==============================================================================

function DataList({ children }: { children?: React.ReactNode }) {
  return <div className={scss.dataList}>{children}</div>;
}

const DataList_top = ({ searcbBarProps }: { searcbBarProps?: TsearcbBarProps }) => {
  return (
    <div className={scss.top}>
      <div className={scss.left}>
        <span className={scss.caption}>CAPTION</span>
        <span className={scss.tip}>TIP</span>
      </div>
      <div className={scss.right}>
        {/*  */}
        {searcbBarProps && <SearchBar {...searcbBarProps} />}
      </div>
    </div>
  );
};

function DataList_table<Tdata extends TapiData>({
  //
  configArr,
  dataArr,
  onRowClick,
  selectedList,
  viewRef_bottom,
}: {
  configArr: readonly Tconfig[];
  dataArr: Tdata[];
  onRowClick?: (apiData: Tdata) => void;
  selectedList: { [id: string]: Tdata };
  viewRef_bottom?: (node?: Element | null | undefined) => void;
}) {
  return (
    <div className={scss.table}>
      <div className={scss.theadWrapper}>
        <div className={classNames(scss.thead, scss.row)}>
          {configArr.map((config, index) => {
            const {
              width,
              flex,
              thead: { label, className, style },
            } = config;

            const theStyle = {
              width,
              flex,
              ...style,
            };

            return (
              <div key={index} className={classNames(scss.cell, className)} style={theStyle}>
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/*  */}
      <div className={scss.tbody}>
        {dataArr.map((apiData, index) => {
          const isActive = selectedList[apiData.id] ? true : false;

          const theViewRef_bottom = dataArr.length - 5 === index ? viewRef_bottom : undefined;

          return (
            <DataList_table_row<Tdata>
              key={index}
              configArr={configArr}
              apiData={apiData}
              onClick={() => {
                onRowClick && onRowClick(apiData);
              }}
              isActive={isActive}
              viewRef_bottom={theViewRef_bottom}
            />
          );
        })}
      </div>
    </div>
  );
}

function DataList_table_row<Tdata extends TapiData>({
  //
  configArr,
  apiData,
  onClick,
  isActive,
  viewRef_bottom,
}: {
  configArr: readonly Tconfig[];
  apiData: Tdata;
  onClick?: () => void;
  isActive?: boolean;
  viewRef_bottom?: (node?: Element | null | undefined) => void;
}) {
  return (
    <CellWithBar isActive={isActive} onClick={onClick}>
      <div ref={viewRef_bottom} className={scss.row}>
        {configArr.map((config, index) => {
          const { key, width, flex, tbody } = config;
          const { className, style } = tbody || {};

          const theStyle = {
            width,
            flex,
            ...style,
          };

          const value = apiData[key] as string | number;

          return (
            <div key={index} className={classNames(scss.cell, className)} style={theStyle}>
              <span>{value}</span>
            </div>
          );
        })}
      </div>
    </CellWithBar>
  );
}

// ================================================================

// interface NestedObject {
//   [key: string]: string | NestedObject | undefined;
// }

// const obj: NestedObject = {
//   a: 'a',
//   b: 'b',
//   c: 'c',
//   d: {
//     e: 'e',
//     f: 'f',
//     g: 'g',
//     h: {
//       i: 'i',
//       j: 'j',
//     },
//   },
// };

// const path = 'd.h.i';
// const arr = path.split('.');

// let res: string | NestedObject | undefined = obj;

// for (const key of arr) {
//   if (res) {
//     if (typeof res === 'object') {
//       res = res[key];
//     }
//   }
// }

// console.log(res);
