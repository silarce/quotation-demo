import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gaer
import SelectBar, { TselectProps } from 'components/global/gear/select/selectBar/selectBar';
import myAlert, { TbtnPropsArr } from 'components/global/gear/modal/simpleModal/alertModals';
import ProcessChain, { Tcontrol_processChain } from 'components/global/gear/processChain';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// option
import { optionsCreator_month, optionsCreator_year } from 'js/utils/options/options';

// css
import scss from './bonusStatisticsTable.module.scss';

// ========================================================================

type Tquery = {
  year: string | number;
  month: string | number;
};

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

// ========================================================================

const yearOptionArr = optionsCreator_year();
const monthOptionArr = optionsCreator_month({ emptyOption: true });

// ========================================================================

export default function BonusStatisticsTable() {
  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    year = new Date().getFullYear() - 1911,
    month,
  } = query;

  // --------------------------------------------------------------------
  const selectPropsArr: TselectPropsArr = [
    {
      selectProps: {
        value: year,
        options: yearOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.replace({
              query: {
                ...query,
                year: option.value,
              },
            });
          }
        },
      },
      placeholder: '選擇年份',
      boxStyle: { width: '140px' },
    },
    {
      selectProps: {
        value: month,
        options: monthOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.replace({
              query: {
                ...query,
                month: option.value,
              },
            });
          }
        },
      },
      placeholder: '選擇月份',
      boxStyle: { width: '140px' },
    },
  ];

  const tagList: TtagList = [
    {
      label: '個人業績統計表',
      onClick: () => {
        router.replace('/domestic/personalPerformanceStatistics');
      },
    },
    {
      label: '獎金統計表',
      onClick: () => {},
      isActive: true,
    },
  ];

  // --------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader02 tagList={tagList} />
      <div className="ml-5 mb-5">
        <div className={scss.selectBarWrapper}>
          <SelectBar selectPropsArr={selectPropsArr} />
        </div>
        <div className={classNames(scss.table)}>
          <Thead />
          <div className={classNames(scss.tbody)}>
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
          </div>
        </div>
      </div>
    </SubLayer>
  );
}

// ====================================================================

//  ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████
// ██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██
// ██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██
// ██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██
//  ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██

const Thead = () => {
  return (
    <div className={classNames(scss.thead)}>
      <div className={scss.cell}>員工姓名</div>
      <div className={scss.cell}>當月業績</div>
      <div className={scss.cell}>當月獎金</div>
      <div className={scss.cell}>備註</div>
    </div>
  );
};

const Row = () => {
  const statusArr: Tcontrol_processChain['statusArr'] = [
    {
      label: `課長 ${''}`,
      dotColor: 'green',
    },
    {
      label: `經理 ${''}`,
      dotColor: 'red',
    },
    {
      label: `總經理 ${''}`,
      dotColor: 'gray',
    },
  ];

  return (
    <div className={scss.row}>
      <div className={scss.cell}>阿喵</div>
      <div className={scss.cell}>999,999</div>
      <div className={scss.cell}>999,999</div>
      <div className={scss.cell}>喵喵喵</div>
      {/*  */}
      <div className={classNames(scss.cell, scss.cell_processChain, 'col-span-4')}>
        <ProcessChain className={scss.processChain} control={{ statusArr }} />
        <MyButton_v2
          py="py4"
          px="px22"
          onClick={() => {
            const modal = myAlert.btnBar({
              title: '是否通過審核?',
              btnPropsArr: [
                {
                  label: '通過審核',
                  theme: 'danger',
                  onClick: () => {},
                },
                {
                  label: '不通過審核',
                  onClick: () => {},
                },
                {
                  label: '取消',
                  onClick: () => {
                    modal.destroy();
                  },
                },
              ],
            });
          }}
        >
          審核
        </MyButton_v2>
        {/* cell_processChain close*/}
      </div>
      {/*  */}
    </div>
  );
};
