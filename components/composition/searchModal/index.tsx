import classNames from 'classnames';
import { useState } from 'react';

// antd
import { Spin } from 'antd';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import Row, { Cell } from 'components/global/gear/table/row';

// hook
import { useTranslation } from 'react-i18next';

import scss from './searchModal.module.scss';

import type { Tconfig, Tdto, TuseSearchModal } from './types';

// ============================================================================

interface TdtoDirc<Dto extends Tdto> {
  [id: string]: Dto;
}

interface Tprops<Dto extends Tdto = Tdto> {
  useSearchModal: () => TuseSearchModal<Dto>;
  onRowClick?: (dto: Dto) => void;
  // 在處理好防抖前，先不做doubleClick
  // onRowDoubleClick?: (dto: Dto) => void;
  onConfirm?: (dtoDirc: TdtoDirc<Dto>) => void; // 若為undefined，不會有確認按鈕
  //
  className?: string;
  style?: React.CSSProperties;
  className_filter?: string;
  style_filter?: React.CSSProperties;
  className_table?: string;
  style_table?: React.CSSProperties;
}

type Tprops_refine<Dto extends Tdto = Tdto> = Omit<Tprops<Dto>, 'useSearchModal'>;

// ============================================================================
export default function SearchModal<Dto extends Tdto>({
  useSearchModal,
  onRowClick,
  // onRowDoubleClick,
  onConfirm,
  //
  className,
  style,
  className_filter,
  style_filter,
  className_table,
  style_table,
}: Tprops<Dto>) {
  const [dtoDirc, setDtoDirc] = useState<TdtoDirc<Dto>>({});

  const {
    inputSelPropsArr,
    clearFilter,
    confirmFilter,
    //
    dataArr,
    qty,
    viewRef,
    isLoading,
    dataConfig,
    dataKeyArr,
  } = useSearchModal();

  const { t } = useTranslation('common');

  const onSelect = (dto: Dto) => {
    const id = dto.id;

    setDtoDirc((prev) => {
      const copy = { ...prev };

      if (id in copy) {
        delete copy[id];
      } else {
        copy[id] = dto;
      }

      return copy;
    });
  };

  const checkSelected = (dto: Dto) => {
    return dto.id in dtoDirc;
  };

  const onSelectedConfirm = onConfirm
    ? () => {
        onConfirm(dtoDirc);
      }
    : undefined;

  return (
    <div className={classNames(scss.container, className)} style={style}>
      <div>
        <span>{t('searchCriteria')} : </span>
      </div>
      <div>
        <span>
          {t('count')} : {qty}
        </span>
      </div>
      <div className={scss.left}>
        <Filter
          inputSelPropsArr={inputSelPropsArr}
          onSearch={confirmFilter}
          onClear={clearFilter}
          onSelectedConfirm={onSelectedConfirm}
          className={className_filter}
          style={style_filter}
        />
      </div>
      <div className={scss.right}>
        <Spin spinning={isLoading} delay={300}>
          <Table
            dataArr={dataArr}
            viewRef={viewRef}
            keyArr={dataKeyArr}
            config={dataConfig}
            onRowClick={(dto) => {
              onRowClick?.(dto);
              onSelect(dto);
            }}
            // onRowDoubleClick={(dto) => {
            //   onRowDoubleClick?.(dto);
            // }}
            checkSelected={checkSelected}
            className={className_table}
            style={style_table}
          />
        </Spin>
      </div>
    </div>
  );
}

// ===============================================================

const Filter = ({
  inputSelPropsArr,
  onSearch,
  onClear,
  onSelectedConfirm,
  className,
  style,
}: {
  inputSelPropsArr: TinputSelProps[];
  onSearch: () => void;
  onClear: () => void;
  onSelectedConfirm: (() => void) | undefined;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { t } = useTranslation('common');

  return (
    <div className={classNames(scss.filter, className)} style={style}>
      <div className={scss.inputPanel}>
        {inputSelPropsArr.map((inputSelProps, index) => {
          return <InputSel key={index} {...inputSelProps} />;
        })}
      </div>

      <div className={scss.btnBar}>
        <SquareBtn label={t('clearConditions')} sharp="long" type="button" onClick={onClear} />
        <SquareBtn label={t('search')} sharp="long" type="submit" onClick={onSearch} />

        {onSelectedConfirm && (
          <SquareBtn
            className={'col-span-2'}
            label={t('confirm')}
            sharp="long"
            type="submit"
            onClick={onSelectedConfirm}
          />
        )}
      </div>
    </div>
  );
};

// ===============================================================

function Table<Dto extends Tdto>({
  dataArr,
  viewRef,
  //
  keyArr,
  config,
  //
  onRowClick,
  onRowDoubleClick,
  //
  checkSelected,
  //
  className,
  style,
}: {
  dataArr: Dto[];
  // viewRef是react-intersection-observer的useInView的ref，可以不給
  // 預期與createUseInfinite系列的hook搭配使用
  // 如果api一次就取得所有的資料，那viewRef就沒有用處
  viewRef?: (node?: Element | null) => void; // react-intersection-observer
  //
  keyArr: (keyof Tconfig<Dto>)[];
  config: Tconfig<Dto>;
  //
  onRowClick?: (dto: Dto) => void;
  onRowDoubleClick?: (dto: Dto) => void;
  //
  checkSelected: (dto: Dto) => boolean;
  //
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={classNames(scss.table, className)} style={style}>
      {/*  */}
      <Row thead={true} className={scss.thead}>
        {keyArr.map((key) => {
          const { label, style } = config[key];

          return (
            <Cell key={key} style={style}>
              {label}
            </Cell>
          );
        })}
      </Row>
      {/*  */}
      {dataArr.map((data, index) => {
        const { id } = data;

        const ref = index === dataArr.length - 6 ? viewRef : undefined;

        const isSelected = checkSelected(data);

        return (
          <Row
            key={id ?? index}
            ref={ref}
            className={classNames(scss.row, isSelected && scss.seleted)}
            onClick={() => {
              onRowClick?.(data);
            }}
            onDoubleClick={() => {
              onRowDoubleClick?.(data);
            }}
          >
            {keyArr.map((key) => {
              let value = data[key] as string | number | null | undefined | React.ReactNode;
              const { style, reducer } = config[key];

              reducer && (value = reducer(data, { index }));

              return (
                <Cell key={key} style={style}>
                  {value}
                </Cell>
              );
            })}
          </Row>
        );
      })}
      {/*  */}
    </div>
  );
}

// =========================================================================

export type { Tprops, Tprops_refine as Tprops_refine };
