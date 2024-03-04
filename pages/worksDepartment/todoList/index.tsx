import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// conmponent
import Table_todoList from 'components/page/worksDepartment/todoList/table_TodoList';
import AddTodoModal from 'components/page/worksDepartment/todoList/addTodoModal';

// global gear
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';
import SelectBar from 'components/global/gear/select/selectBar/selectBar';

// option
import { optionsCreator_year, optionsCreator_month, optionsCreator_region } from 'js/utils/options/options';

// api
import { useGetTodo } from 'js/api/api_todo';

// css
import scss from './index.module.scss';

// ===============================================================================

type Tquery = {
  year: string | undefined;
  month: string | undefined;
  region: string | undefined;
  keyWord: string | undefined;
};

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];
// ===============================================================================

const today = new Date();
const thisYear = today.getFullYear() - 1911;
const thisMonth = today.getMonth() + 1;

const yearOptionArr = optionsCreator_year();
const monthOptionArr = optionsCreator_month({ emptyOption: true });
const regionOptionArr = optionsCreator_region({ emptyOption: true });

// ===============================================================================
export default function TodoList() {
  const router = useRouter();
  const {
    //
    year = String(thisYear),
    month = String(thisMonth),
    region,
    keyWord,
  }: Tquery = router.query as Tquery;

  // ----------------------------------------------------------------

  const [showAdd, setShowAdd] = useState(false);

  // ----------------------------------------------------------------

  const { data: todoArr, update: update_todoArr } = useGetTodo();

  // ----------------------------------------------------------------

  const onAddSuccess = async () => {
    await update_todoArr();
  };

  // ----------------------------------------------------------------

  useEffect(() => {
    update_todoArr();
  }, []);

  // ----------------------------------------------------------------

  const selectPropsArr: TselectPropsArr = [
    {
      selectProps: {
        value: year,
        options: yearOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.push({
              query: {
                ...router.query,
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
            router.push({
              query: {
                ...router.query,
                month: option.value,
              },
            });
          }
        },
      },
      placeholder: '選擇月份',
      boxStyle: { width: '140px' },
    },
    {
      selectProps: {
        value: region,
        options: regionOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.push({
              query: {
                ...router.query,
                region: option.value,
              },
            });
          }
        },
      },
      placeholder: '選擇區域',
      boxStyle: { width: '140px' },
    },
  ];

  const customeLeft = [
    //
    <SelectBar key="0" className="ml-[6px]" selectPropsArr={selectPropsArr} />,
  ];

  // ----------------------------------------------------------------

  const searchTargetList = [
    {
      placeholder: '搜尋...',
      defaultValue: keyWord,
    },
  ];

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch: (arr) => {
      const keyWord = arr[0] as string;

      router.push({
        query: {
          ...router.query,
          keyWord,
        },
      });
    },
  };

  const panelList: TpanelList = [
    { searchGroup },
    {
      type: 'myButton',
      label: '新增待辦事項',
      onClick: () => {
        setShowAdd(true);
      },
    },
  ];

  // ----------------------------------------------------------------
  return (
    <SubLayer bodyClassName={classNames(scss.subLayerBody, scss.plus)}>
      <PageHeader02 tag="待辦事項" customeLeft={customeLeft} panelList={panelList} />
      <div className={'py-24 px-10'}>
        <Table_todoList todoListArr={todoArr ?? []} />
        <AddTodoModal visible={showAdd} onAddSuccess={onAddSuccess} onCancel={() => setShowAdd(false)} />
      </div>
    </SubLayer>
  );
}

// ===================================================================
