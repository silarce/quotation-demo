import { useState, useMemo, useEffect, useRef } from 'react';
import moment, { Moment } from 'moment';

// antd
import { Spin } from 'antd';

import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import Row, { Cell } from 'components/global/gear/table/row';

import { useGetCustomers_infinite_2, TcustomerDto } from 'js/api/api_customer';

import { useTranslation } from 'react-i18next';

import scss from './searchModal.module.scss';

import { useSearchModal_customer } from './useSearchModal_customer';

import type { Tstate, Tconfig_filter, Tdto, Tconfig } from './types';

export default function Container() {
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
  } = useSearchModal_customer();

  const { t, i18n } = useTranslation('common');

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
        <Filter inputSelPropsArr={inputSelPropsArr} onConfirm={confirmFilter} onClear={clearFilter} />
      </div>
      <div className={scss.right}>
        <Spin spinning={isLoading} delay={300}>
          <Table
            dataArr={dataArr}
            viewRef={viewRef}
            keyArr={dataKeyArr}
            config={dataConfig}
            onDoubleClick={(dto) => {
              console.log(dto);
            }}
          />
        </Spin>
      </div>
    </div>
  );
}

// ===============================================================

const Filter = ({
  inputSelPropsArr,
  onConfirm,
  onClear,
}: {
  inputSelPropsArr: TinputSelProps[];
  onConfirm: () => void;
  onClear: () => void;
}) => {
  const { t, i18n } = useTranslation('common');

  return (
    <div className={scss.filter}>
      <div className={scss.inputPanel}>
        {inputSelPropsArr.map((inputSelProps, index) => {
          return <InputSel key={index} {...inputSelProps} />;
        })}
      </div>

      <div className={scss.btnBar}>
        <SquareBtn label={t('clearConditions')} sharp="long" type="button" onClick={onClear} />
        <SquareBtn label={t('search')} sharp="long" type="submit" onClick={onConfirm} />
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
  onDoubleClick,
}: {
  dataArr: Dto[];
  viewRef?: (node?: Element | null) => void;
  //
  keyArr: (keyof Tconfig<Dto>)[];
  config: Tconfig<Dto>;
  //
  onDoubleClick: (dto: Dto) => void;
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

        const ref = index === dataArr.length - 5 ? viewRef : undefined;

        return (
          <Row key={id} ref={ref} onDoubleClick={() => onDoubleClick(data)}>
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
