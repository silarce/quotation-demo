import { useState } from 'react';
import classNames from 'classnames';

// antd
import { Spin } from 'antd';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import Row, { Cell } from 'components/global/gear/table/row';

// hook
import { useTranslation } from 'react-i18next';

import scss from './searchModal.module.scss';

import type { TuseSearchModal, Tstate, Tconfig_filter, Tdto, Tconfig } from './types';

// ============================================================================

interface TdtoDirc<Dto extends Tdto> {
  [id: string]: Dto;
}

// ============================================================================
export default function Container<Dto extends Tdto>({
  useSearchModal,
  onRowClick,
  onConfirm,
}: {
  useSearchModal: () => TuseSearchModal<Dto>;
  onRowClick?: (dto: Dto) => void;
  onConfirm?: (dtoDirc: TdtoDirc<Dto>) => void;
}) {
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

  const onSelectedConfirm = () => {
    onConfirm?.(dtoDirc);
  };

  return (
    <div className={scss.container}>
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
            checkSelected={checkSelected}
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
}: {
  inputSelPropsArr: TinputSelProps[];
  onSearch: () => void;
  onClear: () => void;
  onSelectedConfirm: () => void;
}) => {
  const { t } = useTranslation('common');

  return (
    <div className={scss.filter}>
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
  onRowClick: onClick,
  //
  checkSelected,
}: {
  dataArr: Dto[];
  viewRef?: (node?: Element | null) => void;
  //
  keyArr: (keyof Tconfig<Dto>)[];
  config: Tconfig<Dto>;
  //
  onRowClick?: (dto: Dto) => void;
  //
  checkSelected: (dto: Dto) => boolean;
}) {
  return (
    <div className={scss.table}>
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
              onClick?.(data);
            }}
          >
            {keyArr.map((key) => {
              let value = data[key] as string | number | null | undefined | React.ReactNode;
              const { style, reducer } = config[key];

              reducer && (value = reducer({ data, index }));

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
