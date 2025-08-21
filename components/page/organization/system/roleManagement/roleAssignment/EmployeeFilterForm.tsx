import ClearButton from 'components/global/myCom/button/clearButton';
import MyInput from 'components/global/myCom/Input/Input';
import CustomSelect from 'components/page/organization/system/usres/CustomSelect';

import Btn from 'components/global/gear/button/btn_fong';
import SearchButton from 'components/global/myCom/button/searchButton';
import { getRoleList } from '../api_role';
import { useEffect, useState } from 'react';
import scss from './EmployeeFilterForm.module.scss';
import { DataEntry_fong, Select_rs } from 'components/global/gear/dataEntry';

interface Props {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  selectedRole: string;
  setSelectedRole: React.Dispatch<React.SetStateAction<string>>;
  checkedUserIds: string[];
}

type Role = {
  role_name: string;
};

const EmployeeFilterForm = ({ searchText, setSearchText, selectedRole, setSelectedRole, checkedUserIds }: Props) => {
  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);

  // 本地輸入狀態：不影響外層 state，只有按下搜尋時才會同步
  const [localSearchText, setLocalSearchText] = useState(searchText);
  const [localSelectedRole, setLocalSelectedRole] = useState(selectedRole);

  const fetchRoleList = async () => {
    const roles: Role[] = await getRoleList();
    const options = roles.map((role) => ({
      value: role.role_name,
      label: role.role_name,
    }));
    setRoleOptions([{ value: '', label: '請選擇' }, ...options]);
  };

  const handleSearch = () => {
    setSearchText(localSearchText);
    setSelectedRole(localSelectedRole);
  };

  useEffect(() => {
    fetchRoleList();
  }, []);

  return (
    <>
      <div className={`flex justify-between items-center gap-4 ${scss.customInput} w-full`}>
        <div className="flex items-center gap-4">
          <div className="w-[250px]">
            <MyInput
              label={<div className="font-bold">搜索欄</div>}
              value={localSearchText}
              onChange={(value) => setLocalSearchText(value)}
              placeholder="請輸入編號/姓名/部門"
              marginLeft="16px"
            />
          </div>
          <div className="w-[150px] h-[40px]">
            <DataEntry_fong>
              <Select_rs
                options={roleOptions}
                value={roleOptions.find((option) => option.value === localSelectedRole) || null}
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    setLocalSelectedRole(selectedOption.value);
                  } else {
                    setLocalSelectedRole('');
                  }
                }}
              ></Select_rs>
            </DataEntry_fong>
            {/* <CustomSelect
              options={roleOptions}
              placeholder="請選擇角色"
              value={roleOptions.find((option) => option.value === localSelectedRole) || null}
              onChange={(selectedOption) => setLocalSelectedRole(selectedOption.value)}
            /> */}
          </div>
          <SearchButton onClick={handleSearch} className="h-[40px]" />
        </div>
        {checkedUserIds.length > 0 && (
          <Btn theme="trash" onClick={() => console.log('Hi')}>
            全部刪除
          </Btn>
        )}
      </div>
    </>
  );
};

export default EmployeeFilterForm;
