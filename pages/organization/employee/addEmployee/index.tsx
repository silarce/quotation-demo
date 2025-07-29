import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Switch } from 'antd';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import { v4 as uuidv4 } from 'uuid';
import { useFormReducer } from 'components/page/organization/employee/addEmployee/formReducer';
//scss
import scss from './employeeData.module.scss';

//api
import { getAllEmployeeSelectOptions, createEmployee } from 'components/page/organization/employee/api';

//components
import SaveButton from 'components/global/myCom/button/SaveButton';
import AddButton from 'components/global/myCom/button/AddButton';
import ClearButton from 'components/global/myCom/button/clearButton';
import LabeledInputV2 from 'components/global/myCom/Input/InputV2';
import LeaveModal from 'components/global/myCom/myModal/leaveModal';
import BackButton from 'components/global/myCom/button/BackButton';
import ExtendButton from 'components/global/myCom/button/ExtendButton';
import LabeledSelectV2 from 'components/global/myCom/select/mySelectV2';
import LabeledDatePickerV2 from 'components/global/myCom/date/myDateV2';
import Btn from 'components/global/gear/button/btn_fong';

import { Checkbox } from 'components/global/gear/dataEntry';

export type OptionType = {
  label: string;
  value: string;
};

interface Dependent {
  id: string;
  name: string;
  birthday: string;
  idNumber: string;
  isForeign: string;
  relation: string;
  isInsured?: boolean;
}

interface InsuranceHistory {
  id: string;
  changeDate: string;
  laborLevel: string;
  healthLevel: string;
  reason: string;
  effectiveDate: string;
}

export default function Organization() {
  const mapPageHeaderTop: MapPageHeader = {
    title: [
      {
        name: 'companyBasicInformation',
      },
    ],
  };
  const [formState, dispatch] = useFormReducer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnable, setIsEnable] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [labor, setLabor] = useState(false);
  const [health, setHealth] = useState(false);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [laborInsurance, setLaborInsurance] = useState<InsuranceHistory[]>([]);
  const [healthInsurance, setHealthInsurance] = useState<InsuranceHistory[]>([]);

  const updateField = useMemo(
    () =>
      debounce((field: string, value: string) => {
        dispatch({ type: 'SET_FIELD', field, value });
      }),
    []
  );

  const router = useRouter();
  const { com_id } = router.query;

  const [selectOptionsMap, setSelectOptionsMap] = useState<Record<string, { label: string; value: string }[]>>({});

  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        const data = await getAllEmployeeSelectOptions();
        const map: Record<string, OptionType[]> = {};

        data.data.forEach((item: any) => {
          // 在每個欄位選項前加入「請選擇」
          const options = [{ label: '請選擇', value: '' }, ...item.items];
          map[item.target] = options;
        });

        setSelectOptionsMap(map);
      } catch (err) {
        console.error('Failed to load select options:', err);
      }
    };

    fetchSelectOptions();
  }, []);

  //新增員工
  const handleSave = async () => {
    try {
      const payload = {
        emp_code: formState.emp_id, // 這邊假設 emp_code 來自 emp_id
        id_no: 'A123456789', // ➜ 若你有對應欄位可取代這個
        emp_ch_name: formState.emp_name,
        emp_en_name: '', // ➜ 若你有英文名欄位，請補上
        email: formState.email,
        birthday_date: formState.birthday_date,
        gender_pcode: formState.gender_pcode,
        marital_pcode: formState.marital_pcode,
        education_pcode: formState.education_pcode,
        phone1: formState.contact_phone,
        phone2: formState.contact_phone2,
        residence_county_pcode: formState.residence_county_pcode,
        residence_district_pcode: '', // ➜ 請補上對應區域欄位
        residence_address: formState.residence_address,
        mailing_county_pcode: formState.mailing_county_pcode,
        mailing_district_pcode: '', // ➜ 請補上對應區域欄位
        mailing_address: formState.mailing_address,
        seniority: formState.seniority,
        start_date: formState.start_date,
        leave_date: formState.leave_date,
        retire_date: formState.retire__date,
        severance_date: formState.severance__date,
        military_service_type_pcode: formState.military_service_type_pcode,
        emergency_contact_phone: formState.urgent_phone,
        emergency_contact_relationship: formState.emergency_contact_relationship,
        phone_number: formState.contact_phone,
        department: formState.department,
        job_grade_id: formState.job_grade_id,
        hire_date: formState.start_date,
        is_enable: isEnable,
      };

      const res = await createEmployee(payload);
      console.log('✅ 新增成功:', res);
      // 可加跳轉或提示
    } catch (error) {
      console.error('❌ 新增失敗:', error);
    }
  };

  //新增眷屬
  const handleAddDependent = () => {
    setDependents((prev) => [
      ...prev,
      {
        id: uuidv4(),
        name: '',
        birthday: '',
        idNumber: '',
        isForeign: '',
        relation: '',
      },
    ]);
  };

  const updateDependentField = (id: string, key: keyof Dependent, value: string | boolean) => {
    setDependents((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

  const handleRemove = (id: string) => {
    setDependents((prev) => prev.filter((item) => item.id !== id));
  };
  //=============================

  //新增勞保歷程
  const handleAddLaborInsurance = () => {
    setLaborInsurance((prev) => [
      ...prev,
      {
        id: uuidv4(),
        changeDate: '',
        laborLevel: '',
        healthLevel: '',
        reason: '',
        effectiveDate: '',
      },
    ]);
  };

  const updateLaborInsuranceField = (id: string, key: keyof InsuranceHistory, value: string) => {
    setLaborInsurance((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

  const handleRemoveLaborInsurance = (id: string) => {
    setLaborInsurance((prev) => prev.filter((item) => item.id !== id));
  };

  //新增健保歷程

  const handleAddHealthInsurance = () => {
    setHealthInsurance((prev) => [
      ...prev,
      {
        id: uuidv4(),
        changeDate: '',
        laborLevel: '',
        healthLevel: '',
        reason: '',
        effectiveDate: '',
      },
    ]);
  };

  const updateHealthInsuranceField = (id: string, key: keyof InsuranceHistory, value: string) => {
    setHealthInsurance((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

  const handleRemoveHealthInsurance = (id: string) => {
    setHealthInsurance((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="flex justify-between">
        <PageHeader {...mapPageHeaderTop} />
        <div className="flex items-center  gap-4">
          <BackButton
            label="返回"
            onClick={() => {
              router.push(`/organization/employee`);
            }}
            className=" h-[40px]"
          />
          <Btn theme="trash" onClick={() => console.log('Clear!')}>
            刪除
          </Btn>
          <Btn theme="save" onClick={() => console.log('save')}>
            儲存
          </Btn>
          <LeaveModal isOpen={isModalOpen} onConfirm={() => router.back()} onCancel={() => setIsModalOpen(false)} />
        </div>
      </div>
      <div className="flex items-center justify-center w-full mb-[20px] mt-[40px]">
        <span className="font-semibold mr-2 whitespace-nowrap text-[16px]">👤人員基本資料</span>
        <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
      </div>
      <div className="flex w-full flex-col mt-3">
        <div className="grid grid-cols-6 gap-[24px]">
          <LabeledInputV2
            label="員工姓名"
            value={formState.emp_id}
            onChange={(val) => updateField('emp_id', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledSelectV2
            label="性別"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.gender_pcode}
            onChange={(val) => updateField('gender_pcode', val)}
            options={selectOptionsMap.gender_pcode || []}
          />
          <LabeledDatePickerV2
            label="出生日期"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.birthday_date ? dayjs(formState.birthday_date) : null}
            onChange={(date, dateString) => updateField('birthday_date', dateString as string)}
          />
          <LabeledSelectV2
            label="婚姻"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.marital_pcode}
            onChange={(val) => updateField('marital_pcode', val)}
            options={selectOptionsMap.marital_pcode || []}
          />
          <LabeledSelectV2
            label="學歷"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.education_pcode}
            onChange={(val) => updateField('education_pcode', val)}
            options={selectOptionsMap.education_pcode || []}
          />
          <LabeledSelectV2
            label="兵役別"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.military_service_type_pcode}
            onChange={(val) => updateField('military_service_type_pcode', val)}
            options={selectOptionsMap.military_service_type_pcode || []}
          />
          <LabeledSelectV2
            label="國籍"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.gender_pcode}
            onChange={(val) => updateField('gender_pcode', val)}
            options={selectOptionsMap.gender_pcode || []}
          />
        </div>
        <div className="flex items-center justify-center w-full mt-[40px] mb-[20px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px]">📞聯絡與通訊資料</span>
          <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
        </div>
        <div className="grid grid-cols-6 gap-[24px]">
          <LabeledInputV2
            label="電子郵件"
            value={formState.emp_id}
            onChange={(val) => updateField('emp_id', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledInputV2
            label="連絡電話1"
            value={formState.emp_id}
            onChange={(val) => updateField('emp_id', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledInputV2
            label="連絡電話2"
            value={formState.emp_id}
            onChange={(val) => updateField('emp_id', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledInputV2
            label="緊急連絡人"
            value={formState.emp_id}
            onChange={(val) => updateField('emp_id', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledSelectV2
            label="緊急連絡人關係"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.emergency_contact_relationship}
            onChange={(val) => updateField('emergency_contact_relationship', val)}
            options={selectOptionsMap.emergency_contact_relationship || []}
          />
          <LabeledInputV2
            label="緊急連絡人電話"
            value={formState.emp_id}
            onChange={(val) => updateField('emp_id', val)}
            placeholder="- -"
            required={true}
          />
        </div>

        <div className="grid grid-cols-6 mt-[20px] gap-[24px]">
          <LabeledSelectV2
            label="戶籍城市"
            required={true}
            placeholder="請選擇"
            value={formState.residence_county_pcode}
            onChange={(val) => updateField('residence_county_pcode', val)}
            options={selectOptionsMap.residence_county_pcode || []}
          />
          <div className="col-span-2">
            <LabeledInputV2
              label="戶籍地址"
              value={formState.emp_id}
              onChange={(val) => updateField('emp_id', val)}
              placeholder="- -"
              required={true}
            />
          </div>

          <LabeledSelectV2
            label="通訊城市"
            required={true}
            placeholder="請選擇"
            value={formState.mailing_county_pcode}
            onChange={(val) => updateField('mailing_county_pcode', val)}
            options={selectOptionsMap.mailing_county_pcode || []}
          />
          <div className="col-span-2">
            <LabeledInputV2
              label="通訊地址"
              value={formState.emp_id}
              onChange={(val) => updateField('emp_id', val)}
              placeholder="- -"
              required={true}
            />
          </div>
        </div>
        <div className="flex items-center justify-center w-full mt-[40px] mb-[20px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px]">💼職務與任用設定</span>
          <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
        </div>
        <div className="grid grid-cols-6 gap-[24px]">
          <LabeledSelectV2
            label="工作地點"
            required={true}
            placeholder="請選擇"
            value={formState.job_grade_id}
            onChange={(val) => updateField('job_grade_id', val)}
            options={selectOptionsMap.job_grade_id || []}
          />
          <LabeledSelectV2
            label="職稱"
            required={true}
            placeholder="請選擇"
            value={formState.job_grade_id}
            onChange={(val) => updateField('job_grade_id', val)}
            options={selectOptionsMap.job_grade_id || []}
          />
          <LabeledSelectV2
            label="部門"
            required={true}
            placeholder="請選擇"
            value={formState.department}
            onChange={(val) => updateField('department', val)}
            options={selectOptionsMap.department || []}
          />
          <LabeledInputV2
            label="分機"
            value={formState.emp_id}
            onChange={(val) => updateField('emp_id', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledDatePickerV2
            label="薪資帳別"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.birthday_date ? dayjs(formState.birthday_date) : null}
            onChange={(date, dateString) => updateField('birthday_date', dateString as string)}
          />
          <LabeledInputV2
            label="年資歷"
            value={formState.emp_id}
            onChange={(val) => updateField('emp_id', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledDatePickerV2
            label="到職日"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.birthday_date ? dayjs(formState.birthday_date) : null}
            onChange={(date, dateString) => updateField('birthday_date', dateString as string)}
          />
          <LabeledDatePickerV2
            label="離職日"
            required={true}
            placeholder="請選擇"
            className=""
            value={formState.birthday_date ? dayjs(formState.birthday_date) : null}
            onChange={(date, dateString) => updateField('birthday_date', dateString as string)}
          />
          <LabeledDatePickerV2
            label="資遣日"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.birthday_date ? dayjs(formState.birthday_date) : null}
            onChange={(date, dateString) => updateField('birthday_date', dateString as string)}
          />
          <LabeledDatePickerV2
            label="退休日"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.birthday_date ? dayjs(formState.birthday_date) : null}
            onChange={(date, dateString) => updateField('birthday_date', dateString as string)}
          />
          <LabeledInputV2
            label="勞退百分比"
            value={formState.emp_id}
            onChange={(val) => updateField('emp_id', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledInputV2
            label="員工本薪"
            value={formState.emp_id}
            onChange={(val) => updateField('emp_id', val)}
            placeholder="- -"
            required={true}
          />
        </div>
        <div className="flex items-center justify-center w-full mt-[40px] mb-[20px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px]">🆔️員工打卡與排班設定</span>
          <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
        </div>
        <div className="flex w-full gap-[24px]">
          <LabeledInputV2
            label="員工編號"
            value={formState.emp_id}
            onChange={(val) => updateField('emp_id', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledSelectV2
            label="卡號設定"
            required={true}
            placeholder="請選擇"
            value={formState.gender_pcode}
            onChange={(val) => updateField('gender_pcode', val)}
            options={selectOptionsMap.gender_pcode || []}
          />
          <LabeledSelectV2
            label="勤務"
            required={true}
            placeholder="請選擇"
            value={formState.gender_pcode}
            onChange={(val) => updateField('gender_pcode', val)}
            options={selectOptionsMap.gender_pcode || []}
          />
          <LabeledSelectV2
            label="班別"
            required={true}
            placeholder="請選擇"
            value={formState.gender_pcode}
            onChange={(val) => updateField('gender_pcode', val)}
            options={selectOptionsMap.gender_pcode || []}
          />
        </div>
        <div className="flex items-center justify-center w-full mt-[40px] mb-[20px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px]">📋勞保歷程記錄</span>
          <AddButton label="歷程記錄" onClick={handleAddLaborInsurance} className="h-[40px] mr-3" />
          <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
          <ExtendButton
            label={labor ? '收合' : '展開'}
            className="w-[80px] h-[40px] ml-3"
            onClick={() => setLabor((prev) => !prev)}
          />
        </div>
        <div className={`transition-all duration-300  ${labor ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {laborInsurance.map((history) => (
            <div key={history.id} className="grid grid-cols-4 gap-[24px] relative mb-[16px]">
              <LabeledInputV2
                label="勞保投保級距"
                value={history.laborLevel}
                onChange={(val) => updateLaborInsuranceField(history.id, 'laborLevel', val)}
                placeholder="- -"
                required
              />
              <LabeledDatePickerV2
                label="異動日期"
                required
                placeholder="請選擇"
                className="w-full"
                value={history.changeDate ? dayjs(history.changeDate) : null}
                onChange={(date, dateString) =>
                  updateLaborInsuranceField(history.id, 'changeDate', dateString as string)
                }
              />
              <LabeledInputV2
                label="異動原因"
                value={history.reason}
                onChange={(val) => updateLaborInsuranceField(history.id, 'reason', val)}
                placeholder="- -"
                required
              />
              <LabeledInputV2
                label="生效日"
                value={history.effectiveDate}
                onChange={(val) => updateLaborInsuranceField(history.id, 'effectiveDate', val)}
                placeholder="- -"
                required
              />
              <div className="absolute right-0 top-[-1.5px]">
                <ClearButton
                  label={<span className="text-[14px] text-[#EA1833] ">刪除</span>}
                  className="h-[24px]"
                  iconPosition="right"
                  onClick={() => handleRemoveLaborInsurance(history.id)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center w-full mt-[40px] mb-[20px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px]">📋健保歷程記錄</span>
          <AddButton label="歷程記錄" onClick={() => handleAddHealthInsurance()} className="h-[40px] mr-3" />
          <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
          <ExtendButton
            label={health ? '收合' : '展開'}
            className="w-[80px] h-[40px] ml-3"
            onClick={() => setHealth((prev) => !prev)}
          />
        </div>
        <div className={`transition-all duration-300  ${health ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {healthInsurance.map((history) => (
            <div key={history.id} className="grid grid-cols-4 gap-[24px] relative mb-[16px]">
              <LabeledInputV2
                label="健保投保級距"
                value={history.laborLevel}
                onChange={(val) => updateHealthInsuranceField(history.id, 'laborLevel', val)}
                placeholder="- -"
                required
              />
              <LabeledDatePickerV2
                label="異動日期"
                required
                placeholder="請選擇"
                className="w-full"
                value={history.changeDate ? dayjs(history.changeDate) : null}
                onChange={(date, dateString) =>
                  updateHealthInsuranceField(history.id, 'changeDate', dateString as string)
                }
              />
              <LabeledInputV2
                label="異動原因"
                value={history.reason}
                onChange={(val) => updateHealthInsuranceField(history.id, 'reason', val)}
                placeholder="- -"
                required
              />
              <LabeledInputV2
                label="生效日"
                value={history.effectiveDate}
                onChange={(val) => updateHealthInsuranceField(history.id, 'effectiveDate', val)}
                placeholder="- -"
                required
              />
              <div className="absolute right-0 top-[-1.5px]">
                <ClearButton
                  label={<span className="text-[14px] text-[#EA1833] ">刪除</span>}
                  className="h-[24px]"
                  iconPosition="right"
                  onClick={() => handleRemoveHealthInsurance(history.id)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center w-full mt-[40px] mb-[20px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px]">👨‍👩‍👧‍👦眷屬資料</span>
          <AddButton label="新增眷屬" onClick={() => handleAddDependent()} className="h-[40px] mr-3" />
          <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
        </div>
        {dependents.map((dep) => (
          <div key={dep.id} className="grid grid-cols-12 gap-[24px] relative mb-[16px]">
            <div className="flex col-span-3">
              <div className="flex flex-col justify-center items-center pr-[24px]">
                <Checkbox
                  checked={!!dep.isInsured}
                  onChange={(e) => updateDependentField(dep.id, 'isInsured', e.target.checked)}
                ></Checkbox>
                <span className="whitespace-nowrap">計入健保扶養</span>
              </div>
              <LabeledInputV2
                label="員工眷屬姓名"
                value={dep.name}
                onChange={(val) => updateDependentField(dep.id, 'name', val)}
                placeholder="- -"
                required
              />
            </div>
            <div className="col-span-3">
              <LabeledDatePickerV2
                label="員工眷屬生日"
                required={!!dep.isInsured}
                placeholder="請選擇"
                className="w-full"
                value={dep.birthday ? dayjs(dep.birthday) : null}
                onChange={(date, dateString) => updateDependentField(dep.id, 'birthday', dateString as string)}
              />
            </div>
            <div className="col-span-2">
              <LabeledInputV2
                label="眷屬身分證"
                value={dep.idNumber}
                onChange={(val) => updateDependentField(dep.id, 'idNumber', val)}
                placeholder="- -"
                required={!!dep.isInsured}
              />
            </div>
            <div className="col-span-2">
              <LabeledSelectV2
                label="員工眷屬關係"
                required
                placeholder="請選擇"
                value={dep.relation || ''}
                onChange={(val) => updateDependentField(dep.id, 'relation', val)}
                options={selectOptionsMap.emergency_contact_relationship || []}
              />
            </div>
            <div className="col-span-2">
              <LabeledSelectV2
                label="眷屬是否國外"
                required={!!dep.isInsured}
                placeholder="請選擇"
                value={dep.isForeign}
                onChange={(val) => updateDependentField(dep.id, 'isForeign', val)}
                options={selectOptionsMap.isForeign || []}
              />
            </div>
            <div className="absolute right-0 top-[-1.5px]">
              <ClearButton
                label={<span className="text-[14px] text-[#EA1833] ">刪除</span>}
                className="h-[24px]"
                iconPosition="right"
                onClick={() => handleRemove(dep.id)}
              />
            </div>
          </div>
        ))}

        <div className="flex items-center w-full mt-[40px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px]">📝其他</span>
          <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
        </div>

        <div className="mt-[20px]  flex justify-between">
          <div>
            <div className="mt-[20px]  flex">
              <p className="mr-[16px]">刪除註記</p>
              <Switch checked={isDeleted} onChange={setIsDeleted} />
            </div>
          </div>
          <div className="mr-6 text-[#909090]">
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
        </div>
      </div>
    </>
  );
}
