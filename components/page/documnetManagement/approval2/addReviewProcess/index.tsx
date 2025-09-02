import { useState, useEffect, useMemo } from 'react';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';
import DataEntry, { DataEntry_fong, Input, Select } from 'components/global/gear/dataEntry';
import { modal_delete } from 'components/global/gear/modal/fongModal';
import { Container_confirm } from 'components/global/container/modal';

import Icon_trash from 'public/image/icon/fong/trash.svg';
import Icon_up from 'public/image/icon/fong/arrowUp.svg';
import Icon_down from 'public/image/icon/fong/arrowDown.svg';

import scss from './index.module.scss';

// =============================================================================

interface Tstate {
  action: string;
  name: string;
  jobName: string;
}

// =============================================================================

const AddReviewProcesss = () => {
  const instance_useReviewProcess = useReviewProcess(undefined);

  const columns = createColumns(instance_useReviewProcess);

  return (
    <Container_confirm
      title="新增審核流程"
      footerRight={
        <>
          <Btn>取消</Btn>
          <Btn theme="save">儲存</Btn>
        </>
      }
    >
      <div className="flex gap-6 items-end mb-[20px]">
        <DataEntry_fong caption="流程名稱" isMust>
          <Input />
        </DataEntry_fong>
        <Btn onClick={instance_useReviewProcess.addState}>新增關卡</Btn>
      </div>
      <Table_antd
        dataSource={instance_useReviewProcess.stateArr}
        columns={columns}
        className={scss.antdTable}
        scroll={{
          y: 200,
        }}
        pagination={false}
      />
    </Container_confirm>
  );
};

// ============================================================================

const emptyState = (): Tstate => ({
  action: '',
  name: '',
  jobName: '',
});

const useDefaultState = (raw: unknown | undefined) => {
  return useMemo(() => {
    return [] as Tstate[];
  }, [raw]);
};

const useReviewProcess = (raw: unknown | undefined) => {
  const defaultState = useDefaultState(raw);

  const [stateArr, setStateArr] = useState<Tstate[]>([]);

  const editState = (index: number, key: keyof Tstate, value: string) => {
    setStateArr((prev) => {
      const newArr = [...prev];
      newArr[index] = {
        ...newArr[index],
        [key]: value,
      };

      return newArr;
    });
  };

  const deleteState = (index: number) => {
    setStateArr((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);

      return newArr;
    });
  };

  const addState = () => {
    setStateArr((prev) => {
      const newArr = [...prev];
      newArr.push(emptyState());

      return newArr;
    });
  };

  const moveState = (index: number, direction: 'up' | 'down') => {
    setStateArr((prev) => {
      const newArr = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= newArr.length) {
        return newArr;
      }

      const temp = newArr[index];
      newArr[index] = newArr[targetIndex];
      newArr[targetIndex] = temp;

      return newArr;
    });
  };

  const reset = () => {
    setStateArr(defaultState);
  };

  useEffect(reset, [defaultState]);

  return {
    stateArr,
    reset,
    editState,
    deleteState,
    addState,
    moveState,
  };
};

// ============================================================================

// MARK:createColumns

const createColumns = (instance_useReviewProcess: ReturnType<typeof useReviewProcess>) => {
  const { deleteState, moveState } = instance_useReviewProcess;

  const columns: TableProps<Tstate>['columns'] = [
    {
      key: 'step',
      title: '關卡',
      width: 100,
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: 'action',
      title: '程序',
      width: 100,
      render: (v, _, index) => {
        return (
          <DataEntry>
            <Select
              options={[
                { label: '提出', value: '提出' },
                { label: '會簽', value: '會簽' },
                { label: '核准', value: '核准' },
                { label: '知會', value: '知會' },
              ]}
              value={v}
              onChange={(value) => instance_useReviewProcess.editState(index, 'action', value)}
            />
          </DataEntry>
        );
      },
    },
    {
      dataIndex: 'name',
      title: '姓名',
      width: 100,
      render: (v, _, index) => {
        return (
          <DataEntry>
            <Input value={v} onChange={(e) => instance_useReviewProcess.editState(index, 'name', e.target.value)} />
          </DataEntry>
        );
      },
    },
    {
      dataIndex: 'jobName',
      title: '職稱',
      width: 100,
      render: (v, _, index) => {
        return (
          <DataEntry>
            <Select
              options={[
                { label: '經理', value: '經理' },
                { label: '協理', value: '協理' },
                { label: '總經理', value: '總經理' },
              ]}
              value={v}
              onChange={(value) => instance_useReviewProcess.editState(index, 'jobName', value)}
            />
          </DataEntry>
        );
      },
    },
    {
      key: 'action',
      title: '操作',
      width: 80,
      className: 'flex gap-2 justify-center items-center',
      render: (_, record, index) => {
        return (
          <>
            <Icon_trash
              className="cursor-pointer"
              onClick={() => {
                modal_delete({
                  title: '確認移除該關卡?',
                  content: '',
                  onConfirm: () => {
                    deleteState(index);
                  },
                });
              }}
            />
            <Icon_up className="cursor-pointer" onClick={() => moveState(index, 'up')} />
            <Icon_down className="cursor-pointer" onClick={() => moveState(index, 'down')} />
          </>
        );
      },
    },
  ];

  return columns;
};

// ============================================================================

export default AddReviewProcesss;
