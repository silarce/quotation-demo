import { Modal, Switch } from 'antd';
import Input from 'components/global/myCom/Input/Input';
import SaveButton from 'components/global/myCom/button/SaveButton';
import CancelButton from 'components/global/myCom/button/cancelButton';
import { formState } from './type';

interface DepartmentModalProps {
  visible: boolean;
  formState: formState;
  onFormChange: (key: keyof formState) => (value: string) => void;
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
      <Input
        label={<div className="text-[14px] font-normal">部門代號：</div>}
        value={formState.dep_code}
        onChange={onFormChange('dep_code')}
        placeholder="請輸入部門代號"
        labelWidth="w-[20%]"
        marginLeft="36px"
        className="mt-3"
      />

      <Input
        label={<div className="text-[14px] font-normal">部門名稱：</div>}
        value={formState.dep_ch_name}
        onChange={onFormChange('dep_ch_name')}
        placeholder="請輸入部門名稱"
        labelWidth="w-[20%]"
        marginLeft="36px"
        className="mt-3"
      />

      <Input
        label={<div className="text-[14px] font-normal">部門英文名稱：</div>}
        value={formState.dep_en_name}
        onChange={onFormChange('dep_en_name')}
        placeholder="請輸入部門英文名稱"
        labelWidth="w-[30%]"
        marginLeft="1px"
        className="mt-3"
      />

      <Input
        label={<div className="text-[14px] font-normal">部門描述：</div>}
        value={formState.description}
        onChange={onFormChange('description')}
        placeholder="請輸入部門描述"
        labelWidth="w-[20%]"
        marginLeft="36px"
        className="mt-3"
      />

      <div className="flex mt-3 gap-[68px]">
        <p>啟用：</p>
        <Switch />
      </div>

      <div className="mr-6 text-[#909090] mt-3">
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
      </div>

      <div className="flex justify-end h-[40px] gap-4 mt-3 ">
        <CancelButton label="取消" onClick={onCancel} />
        <SaveButton label="儲存" onClick={onSave} />
      </div>
    </Modal>
  );
};

export default DepartmentModal;
