import { Input } from 'antd';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import scss from './AddRoleTable.module.scss';

//components
import SaveButton from 'components/global/myCom/button/SaveButton';
import AddButton from 'components/global/myCom/button/AddButton';
import ClearButton from 'components/global/myCom/button/clearButton';

//type
import { AddRoleType, UpdateRole } from './schema/system';

interface RoleFormProps {
  editingRole?: UpdateRole;
  onCancel: () => void;
  defaultRole?: string;
  onAddRole: (data: AddRoleType) => void;
  onUpdate?: (data: UpdateRole) => void;
}

const RoleForm: React.FC<RoleFormProps> = ({
  defaultRole = '進階使用者',
  editingRole,
  onCancel,
  onAddRole,
  onUpdate,
}) => {
  const [roleName, setRoleName] = useState('');
  const [roleCode, setRoleCode] = useState('');
  const [description, setDescription] = useState('');

  //==============================新增角色
  const handleSubmit = async () => {
    if (!roleName.trim() || !description.trim() || !roleCode.trim()) {
      alert('請填寫完整資料');

      return;
    }

    if (!editingRole) {
      // 只把表單資料交給父層
      onAddRole({
        role_id: '', // 父層 API 建立後帶回正確 id
        role_name: roleName,
        role_code: roleCode,
        description,
      });
    } else {
      onUpdate?.({
        role_id: editingRole.role_id,
        role_name: roleName,
        description,
        role_code: roleCode,
        created_by: editingRole.created_by,
        created_at: editingRole.created_at,
        updated_at: new Date().toISOString(),
      });
    }
  };

  //=====================================

  useEffect(() => {
    if (editingRole) {
      setRoleName(editingRole.role_name);
      setDescription(editingRole.description);
      setRoleCode(editingRole.role_code);
    } else {
      setRoleName('');
      setDescription('');
      setRoleCode('');
    }
  }, [editingRole]);

  return (
    <div
      className={`${scss.formBlock} h-full bg-white border border-[#616161] flex flex-col px-6 pt-8 relative rounded-lg drop-shadow-lg`}
    >
      <div>
        <div className="flex items-center mb-5">
          <span className="w-[5%] font-semibold">角色名稱</span>
          <Input
            placeholder="請輸入角色"
            className="h-[40px]"
            defaultValue={defaultRole}
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>
        <div className="flex items-center mb-5">
          <span className="w-[5%] font-semibold">角色代碼</span>
          <Input
            className="h-[40px]"
            placeholder="請輸入代碼"
            value={roleCode}
            onChange={(e) => setRoleCode(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <span className="w-[5%] font-semibold">角色描述</span>
          <Input
            className="h-[40px]"
            placeholder="請輸入描述"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      {editingRole && (
        <div className="mt-4 text-sm text-gray-600">
          <div>建立人員：{editingRole.created_by}</div>
          <div>建立日期：{new Date(editingRole.created_at).toLocaleString()}</div>
          {editingRole.updated_at && <div>修改日期：{new Date(editingRole.updated_at).toLocaleString()}</div>}
        </div>
      )}

      <div className="flex justify-end my-[32px] gap-4 h-[40px]">
        {editingRole ? (
          <SaveButton label="儲存資料" onClick={handleSubmit} />
        ) : (
          <AddButton label="新增角色" onClick={handleSubmit} />
        )}
        <ClearButton onClick={onCancel} label="清除" />
      </div>
    </div>
  );
};

export default RoleForm;
