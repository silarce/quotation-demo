import { Modal, Switch } from 'antd';
import Btn from 'components/global/gear/button/btn_fong';
import { CreateDepFormState } from './type';
import { DataEntry_fong, Input as AntdInput } from 'components/global/gear/dataEntry';

interface DepartmentModalProps {
  visible: boolean;
  formState: CreateDepFormState;
  onFormChange: (key: keyof CreateDepFormState) => (value: string | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditMode: boolean;
}

const DepartmentModal = ({ visible, formState, onFormChange, onSave, onCancel, isEditMode }: DepartmentModalProps) => {
  return (
    <Modal
      title={<div className="text-[16px] font-bold">{isEditMode ? '編輯部門' : '新增部門'}</div>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      centered
    >
      <div className="flex flex-col gap-5">
        <DataEntry_fong caption="部門代號" isMust>
          <AntdInput value={formState.depCode} onChange={(e) => onFormChange('depCode')(e.target.value)} />
        </DataEntry_fong>

        <DataEntry_fong caption="部門名稱" isMust>
          <AntdInput value={formState.depChName} onChange={(e) => onFormChange('depChName')(e.target.value)} />
        </DataEntry_fong>

        <DataEntry_fong caption="部門英文名稱" isMust>
          <AntdInput value={formState.depEnName} onChange={(e) => onFormChange('depEnName')(e.target.value)} />
        </DataEntry_fong>

        <DataEntry_fong caption="部門描述">
          <AntdInput value={formState.description} onChange={(e) => onFormChange('description')(e.target.value)} />
        </DataEntry_fong>

        <DataEntry_fong caption="啟用" isMust childrenWrapperProps={{ className: '!border-none !p-0' }}>
          <Switch
            className="w-[40px] bg-[#BFBFBF]"
            checked={formState.isEnabled}
            onChange={(checked) => onFormChange('isEnabled')(checked)}
          />
        </DataEntry_fong>
      </div>

      {/* <div className="mr-6 text-[#909090] mt-3">
        <div className="flex gap-4 ">
          <p>建立者:王大名</p>
          <p>建立日期:2024/04/30</p>
        </div>
        <div className="flex gap-4 mt-[8px]">
          <p>更新者:黃鐘可</p>
          <p>更新日期:2024/04/30</p>
        </div>
        <div className="flex gap-4 mt-[8px]">
          <p>刪除者:王小明</p>
          <p>刪除日期:2024/04/30</p>
        </div>
      </div> */}

      <div className="flex justify-end h-[40px] gap-4 mt-3 ">
        <Btn onClick={onCancel}>取消</Btn>
        <Btn theme="save" onClick={onSave}>
          儲存
        </Btn>
      </div>
    </Modal>
  );
};

export default DepartmentModal;
