import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';
import MyInput from 'components/global/myCom/Input/Input';

//button
import CancelButton from 'components/global/myCom/button/cancelButton';
import SaveButton from 'components/global/myCom/button/SaveButton';
import EditButton from 'components/global/myCom/button/EditButton';
import { LogoUploader2 } from 'components/page/organization/editDepartment/button';
import { useState } from 'react';

export default function Companydata2() {
  const mapPageHeaderTop: MapPageHeader = {
    title: [
      {
        name: 'companyData2',
      },
    ],
  };

  const [input, setInput] = useState('');
  console.log(input);

  return (
    <>
      <div className="flex justify-between items-center">
        <PageHeader {...mapPageHeaderTop} />
        <div className="flex  gap-4">
          <CancelButton label="返回" className="h-[40px] w-[60px]" />
          <SaveButton label="儲存" className="h-[40px] w-[95px]" />
          <EditButton label="編輯" className="h-[40px] w-[95px]" />
        </div>
      </div>
      <div>
        <div className="border border-[#616161] rounded-md shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-center w-full">
              <span className="font-semibold mr-2 whitespace-nowrap">🏢公司LOGO</span>
              <div className="h-px bg-[#909090] flex-1 rounded-[10px]" />
            </div>
            <div className="mt-3">
              <LogoUploader2 />
            </div>
          </div>
        </div>
        <div className="border border-[#616161] rounded-md shadow-xl mt-8">
          <div className="p-6">
            <div className="flex items-center justify-center w-full">
              <span className="font-semibold mr-2 whitespace-nowrap">🏬公司基本資料</span>
              <div className="h-px bg-[#616161] flex-1 rounded-[10px]" />
            </div>
            <div className="ml-[14px] mt-4 flex flex-col gap-5">
              <MyInput
                label={<span className="global_tip_must">公司名稱</span>}
                labelWidth="w-[4.4%]"
                onChange={setInput}
              />
              <MyInput label="公司電話" labelWidth="w-[4.4%]" onChange={setInput} />
              <MyInput label="公司傳真" labelWidth="w-[4.4%]" onChange={setInput} />
              <MyInput label="公司信箱" labelWidth="w-[4.4%]" onChange={setInput} />
              <MyInput label="公司統編" labelWidth="w-[4.4%]" onChange={setInput} />
              <MyInput label="公司地址" labelWidth="w-[4.4%]" onChange={setInput} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
