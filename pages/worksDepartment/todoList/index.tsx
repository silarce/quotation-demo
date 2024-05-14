import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// conmponent
import Table_todoList from 'components/page/worksDepartment/todoList/table_TodoList';
import AddTodoModal from 'components/page/worksDepartment/todoList/addTodoModal';

// global gear
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';
// import SelectBar from 'components/global/gear/select/selectBar/selectBar';

// option
// import { optionsCreator_year, optionsCreator_month, optionsCreator_region } from 'js/utils/options/options';

// api
import { Tparams, useGetTodo } from 'js/api/api_todo';

// css
import scss from './index.module.scss';

// ===============================================================================

type Tquery = {
  year: string | undefined;
  month: string | undefined;
  region: string | undefined;
  keyWord: string | undefined;
};

// type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];
// ===============================================================================

// const today = new Date();
// const thisYear = today.getFullYear() - 1911;
// const thisMonth = today.getMonth() + 1;

// const yearOptionArr = optionsCreator_year();
// const monthOptionArr = optionsCreator_month({ emptyOption: true });
// const regionOptionArr = optionsCreator_region({ emptyOption: true });

// ===============================================================================
export default function TodoList() {
  const router = useRouter();
  const {
    //
    // year = String(thisYear),
    // month = String(thisMonth),
    // region,
    keyWord,
  }: Tquery = router.query as Tquery;

  // ----------------------------------------------------------------

  const [showAdd, setShowAdd] = useState(false);

  // ----------------------------------------------------------------

  const params: Tparams = {
    populate: ['engineeringContact.contract.worksheet.contractProductItems'],
    // sort: 'engineeringContact.createdAt',
    sort: 'createdAt',
    order: 'DESC',
    pageSize: 999999,
    filter: {
      isAlreadyDispatching: {
        $eq: false,
      },
    },
  };

  const { data: todoArr, update: update_todoArr } = useGetTodo<{ engineeringContact: true }>(params);

  // ----------------------------------------------------------------

  const onAddSuccess = async () => {
    setShowAdd(false);
    await update_todoArr();
  };

  // ----------------------------------------------------------------

  const filteredTodoArr = useMemo(() => {
    // 完整工程編號 engineeringContact.projectNumber
    // 工程名稱 engineeringContact.projectName
    // 聯絡人 engineeringContact.contactInfo.[0]
    // 主旨 purpose
    // 接洽人 contactPerson[0].contactPerson

    if (!todoArr) {
      return [];
    }

    if (!keyWord) {
      return todoArr;
    }

    const theKeyWord = keyWord?.trim();

    const filterTodoArr = todoArr.filter((todo) => {
      const { engineeringContact, purpose, contactPerson } = todo;
      const { projectNumber, projectName } = engineeringContact ?? {};

      const contact = engineeringContact?.contactInfo?.[0];
      const contactPerson_engineeringContact = contact?.contactPerson;

      return (
        projectNumber === theKeyWord ||
        projectName?.includes(theKeyWord) ||
        contactPerson_engineeringContact?.includes(theKeyWord) ||
        purpose?.includes(theKeyWord) ||
        contactPerson?.[0]?.contactPerson?.includes(theKeyWord)
      );
    });

    return filterTodoArr;
  }, [todoArr, keyWord]);

  // ----------------------------------------------------------------

  useEffect(() => {
    update_todoArr();
  }, []);

  // ----------------------------------------------------------------

  // const selectPropsArr: TselectPropsArr = [
  //   {
  //     selectProps: {
  //       value: year,
  //       options: yearOptionArr,
  //       onChange: (option) => {
  //         if (typeof option?.value === 'string') {
  //           router.push({
  //             query: {
  //               ...router.query,
  //               year: option.value,
  //             },
  //           });
  //         }
  //       },
  //     },
  //     placeholder: '選擇年份',
  //     boxStyle: { width: '140px' },
  //   },
  //   {
  //     selectProps: {
  //       value: month,
  //       options: monthOptionArr,
  //       onChange: (option) => {
  //         if (typeof option?.value === 'string') {
  //           router.push({
  //             query: {
  //               ...router.query,
  //               month: option.value,
  //             },
  //           });
  //         }
  //       },
  //     },
  //     placeholder: '選擇月份',
  //     boxStyle: { width: '140px' },
  //   },
  //   {
  //     selectProps: {
  //       value: region,
  //       options: regionOptionArr,
  //       onChange: (option) => {
  //         if (typeof option?.value === 'string') {
  //           router.push({
  //             query: {
  //               ...router.query,
  //               region: option.value,
  //             },
  //           });
  //         }
  //       },
  //     },
  //     placeholder: '選擇區域',
  //     boxStyle: { width: '140px' },
  //   },
  // ];

  // const customeLeft = [
  //   //
  //   <SelectBar key="0" className="ml-[6px]" selectPropsArr={selectPropsArr} />,
  // ];

  // ----------------------------------------------------------------

  const searchTargetList: TsearchGroup['searchTargetList'] = [
    {
      width: '370px',
      placeholder: '完整工程編號、工程名稱、聯絡人、主旨、接洽人...',
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
      <PageHeader02
        tag="待辦事項"
        //  customeLeft={customeLeft}
        panelList={panelList}
      />
      <div className={'py-24 px-10'}>
        <Table_todoList todoArr={filteredTodoArr} onTodoChange={update_todoArr} />
        <AddTodoModal visible={showAdd} onAddSuccess={onAddSuccess} onCancel={() => setShowAdd(false)} />
      </div>
    </SubLayer>
  );
}

// ===================================================================
