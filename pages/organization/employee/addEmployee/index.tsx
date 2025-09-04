import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Switch } from 'antd';
import dayjs from 'dayjs';
import { useFormReducer } from 'components/page/organization/employee/addEmployee/formReducer';
import { v4 as uuidv4 } from 'uuid';
//scss
import scss from './employeeData.module.scss';

//api
import { getAllEmployeeSelectOptions, createEmployee } from 'components/page/organization/employee/api';

//components
import AddButton from 'components/global/myCom/button/AddButton';
import ClearButton from 'components/global/myCom/button/clearButton';
import LabeledInputV2 from 'components/global/myCom/Input/InputV2';
import LeaveModal from 'components/global/myCom/myModal/leaveModal';
import ExtendButton from 'components/global/myCom/button/ExtendButton';
import LabeledSelectV2 from 'components/global/myCom/select/mySelectV2';
import LabeledDatePickerV2 from 'components/global/myCom/date/myDateV2';
import Btn from 'components/global/gear/button/btn_fong';

//Icon
import Icon_IDcard from 'public/image/icon/fong/id-card.svg';
import Icon_phone from 'public/image/icon/fong/phone.svg';
import Icon_mana from 'public/image/icon/fong/user-management.svg';
import Icon_time from 'public/image/icon/fong/user-time.svg';
import Icon_security from 'public/image/icon/fong/security.svg';
import Icon_security2 from 'public/image/icon/fong/security2.svg';
import Icon_house from 'public/image/icon/fong/pepicons-pop_house.svg';
import Icon_folder from 'public/image/icon/fong/folder.svg';

import { Checkbox } from 'components/global/gear/dataEntry';
import { CreateEmployeePayload } from 'components/page/organization/employee/type';

type OptionType = { label: string; value: string };
type ApiItem = { value: string; label: string };
type ApiGroup = {
  targetElement: string;
  moduleCode: string;
  paramCode: string;
  totalCount?: number;
  items: ApiItem[];
};

type SelectOptionsMap = Record<string, OptionType[]>;

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
  const [isDeleted, setIsDeleted] = useState(false);
  const [labor, setLabor] = useState(false);
  const [health, setHealth] = useState(false);
  console.log('formState: ', formState);

  const updateField = useCallback(
    <K extends keyof CreateEmployeePayload>(field: K, value: CreateEmployeePayload[K]) => {
      dispatch({ type: 'SET_FIELD', field, value });
    },
    [dispatch]
  );

  const router = useRouter();

  const [selectOptionsMap, setSelectOptionsMap] = useState<Record<string, OptionType[]>>({});

  const toOptionsMap = (resp: { data?: ApiGroup[] }): SelectOptionsMap => {
    const groups: ApiGroup[] = Array.isArray(resp?.data) ? resp.data! : [];

    return groups.reduce<SelectOptionsMap>((acc, g) => {
      const opts: OptionType[] = [
        { label: '請選擇', value: '' },
        ...(g.items ?? []).map((it: ApiItem) => ({
          label: it.label,
          value: String(it.value),
        })),
      ];
      acc[g.targetElement] = opts;

      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        const data = await getAllEmployeeSelectOptions({
          countyCode: formState.residenceCountyPcode ?? '',
          departmentId: formState.department ?? '',
        });
        setSelectOptionsMap(toOptionsMap(data));
      } catch (err) {
        console.error('Failed to load select options:', err);
      }
    };

    fetchSelectOptions();
  }, [formState.department, formState.residenceCountyPcode]);

  //新增員工
  const handleSave = async () => {
    try {
      const payload: CreateEmployeePayload = formState;
      const res = await createEmployee(payload);
      console.log('新增成功:', res);
    } catch (error) {
      console.error('新增失敗:', error);
    }
  };

  //新增眷屬
  const handleAddDependent = () => {
    updateField('dependents', [
      ...formState.dependents,
      {
        empRelativeId: uuidv4(),
        empRelativeName: '',
        empRelativeBirthday: '',
        empRelativeDomesticPcode: '',
        empRelativeRelationPcode: '',
        empRelativeIdNo: '',
        is_nhi: false,
      },
    ]);
  };

  //新增勞保歷程
  const handleAddLaborInsurance = () => {
    updateField('insuranceItems', [
      ...formState.insuranceItems,
      {
        insuranceId: uuidv4(),
        insuranceTypePcode: 'labor',
        createdAt: '',
        effectiveDate: '',
        levelAmount: '',
        reason: '',
      },
    ]);
  };

  //新增健保歷程

  const handleAddHealthInsurance = () => {
    updateField('insuranceItems', [
      ...formState.insuranceItems,
      {
        insuranceId: uuidv4(),
        insuranceTypePcode: 'health',
        createdAt: '',
        effectiveDate: '',
        levelAmount: '',
        reason: '',
      },
    ]);
  };

  useEffect(() => {
    if (!formState.empEnName) {
      updateField('empEnName', 'John Doe');
    }

    if (!formState.residenceDistrictPcode) {
      updateField('residenceDistrictPcode', '1000');
    }

    if (!formState.mailingDistrictPcode) {
      updateField('mailingDistrictPcode', '1000');
    }
  }, [formState.empEnName, formState.residenceDistrictPcode, formState.mailingDistrictPcode, updateField]);

  return (
    <>
      <div className="flex justify-between">
        <PageHeader {...mapPageHeaderTop} />
        <div className="flex items-center  gap-4">
          <Btn
            onClick={() => {
              router.push(`/organization/employee`);
            }}
          >
            返回
          </Btn>
          <Btn theme="trash" onClick={() => console.log('Clear!')}>
            刪除
          </Btn>
          <Btn theme="save" onClick={() => handleSave()}>
            儲存
          </Btn>
          <LeaveModal isOpen={isModalOpen} onConfirm={() => router.back()} onCancel={() => setIsModalOpen(false)} />
        </div>
      </div>
      {/* MARK:人員基本資料  */}
      <div className="flex items-center justify-center w-full mb-[20px] mt-[40px]">
        <span className="font-semibold mr-2 whitespace-nowrap text-[16px] flex items-center gap-2">
          <Icon_IDcard style={{ width: '24px', height: '24px' }} />
          人員基本資料
        </span>
        <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
      </div>
      <div className="flex w-full flex-col mt-3">
        <div className="grid grid-cols-6 gap-[24px]">
          <LabeledInputV2
            label="員工姓名"
            value={formState.empChName}
            onChange={(val) => updateField('empChName', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledSelectV2
            label="性別"
            required
            placeholder="請選擇"
            className="w-full"
            value={formState.genderPcode ?? ''}
            onChange={(val) => updateField('genderPcode', val)}
            options={selectOptionsMap.genderPcode || []}
          />
          <LabeledInputV2
            label="身分證字號"
            value={formState.idNo}
            onChange={(val) => updateField('idNo', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledDatePickerV2
            label="出生日期"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.birthdayDate ? dayjs(formState.birthdayDate) : null}
            onChange={(date, dateString) => updateField('birthdayDate', dateString as string)}
          />
          <LabeledSelectV2
            label="婚姻"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.maritalPcode}
            onChange={(val) => updateField('maritalPcode', val)}
            options={selectOptionsMap.maritalPcode || []}
          />
          <LabeledSelectV2
            label="學歷"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.educationPcode}
            onChange={(val) => updateField('educationPcode', val)}
            options={selectOptionsMap.educationPcode || []}
          />
          <LabeledSelectV2
            label="兵役別"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.militaryServiceTypePcode}
            onChange={(val) => updateField('militaryServiceTypePcode', val)}
            options={selectOptionsMap.militaryServiceTypePcode || []}
          />
          <LabeledSelectV2
            label="國籍"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.nationalityPcode}
            onChange={(val) => updateField('nationalityPcode', val)}
            options={selectOptionsMap.nationalityPcode || []}
          />
        </div>
        {/* MARK:聯絡與通訊資料  */}
        <div className="flex items-center justify-center w-full mt-[40px] mb-[20px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px] flex gap-2">
            <Icon_phone style={{ width: '24px', height: '24px' }} />
            聯絡與通訊資料
          </span>
          <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
        </div>
        <div className="grid grid-cols-6 gap-[24px]">
          <LabeledInputV2
            label="電子郵件"
            value={formState.email}
            onChange={(val) => updateField('email', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledInputV2
            label="連絡電話1"
            value={formState.phone1}
            onChange={(val) => updateField('phone1', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledInputV2
            label="連絡電話2"
            value={formState.phone2}
            onChange={(val) => updateField('phone2', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledInputV2
            label="緊急連絡人"
            value={formState.emergencyContactName}
            onChange={(val) => updateField('emergencyContactName', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledSelectV2
            label="緊急連絡人關係"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.emergencyContactRelationshipPcode}
            onChange={(val) => updateField('emergencyContactRelationshipPcode', val)}
            options={selectOptionsMap.emergencyContactRelationshipPcode || []}
          />
          <LabeledInputV2
            label="緊急連絡人電話"
            value={formState.emergencyContactPhone}
            onChange={(val) => updateField('emergencyContactPhone', val)}
            placeholder="- -"
            required={true}
          />
        </div>

        <div className="grid grid-cols-6 mt-[20px] gap-[24px]">
          <LabeledSelectV2
            label="戶籍城市"
            required={true}
            placeholder="請選擇"
            value={formState.residenceCountyPcode}
            onChange={(val) => updateField('residenceCountyPcode', val)}
            options={selectOptionsMap.CountyPcode || []}
          />
          <div className="col-span-2">
            <LabeledInputV2
              label="戶籍地址"
              value={formState.residenceAddress}
              onChange={(val) => updateField('residenceAddress', val)}
              placeholder="- -"
              required={true}
            />
          </div>

          <LabeledSelectV2
            label="通訊城市"
            required={true}
            placeholder="請選擇"
            value={formState.mailingCountyPcode}
            onChange={(val) => updateField('mailingCountyPcode', val)}
            options={selectOptionsMap.CountyPcode || []}
          />
          <div className="col-span-2">
            <LabeledInputV2
              label="通訊地址"
              value={formState.mailingAddress}
              onChange={(val) => updateField('mailingAddress', val)}
              placeholder="- -"
              required={true}
            />
          </div>
        </div>
        {/* MARK:職務與任用設定  */}
        <div className="flex items-center justify-center w-full mt-[40px] mb-[20px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px] flex gap-2">
            <Icon_mana style={{ width: '24px', height: '24px' }} />
            職務與任用設定
          </span>
          <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
        </div>
        <div className="grid grid-cols-6 gap-[24px]">
          <LabeledSelectV2
            label="工作地點"
            required={true}
            placeholder="請選擇"
            value={formState.employeeEmployment.workLocationPcode}
            onChange={(val) =>
              updateField('employeeEmployment', {
                ...formState.employeeEmployment,
                workLocationPcode: val,
              })
            }
            options={selectOptionsMap.workLocationPcode || []}
          />
          <LabeledSelectV2
            label="部門"
            required={true}
            placeholder="請選擇"
            value={formState.department}
            onChange={(val) => updateField('department', val)}
            options={selectOptionsMap.departmentId || []}
          />
          <LabeledSelectV2
            label="職稱"
            required={true}
            placeholder="請選擇"
            value={formState.jobGradeId}
            onChange={(val) => updateField('jobGradeId', val)}
            options={selectOptionsMap.jobId || []}
          />
          <LabeledInputV2
            label="分機"
            value={formState.employeeEmployment.extensionNo}
            onChange={(val) =>
              updateField('employeeEmployment', {
                ...formState.employeeEmployment,
                extensionNo: val,
              })
            }
            placeholder="- -"
          />
          <LabeledSelectV2
            label="薪資帳別"
            required={true}
            placeholder="請選擇"
            value={formState.employeeEmployment.salaryAccountPcode}
            onChange={(val) =>
              updateField('employeeEmployment', {
                ...formState.employeeEmployment,
                salaryAccountPcode: val,
              })
            }
            options={selectOptionsMap.salaryAccountPcode || []}
          />
          <LabeledInputV2
            label="年資歷"
            value={formState.seniority}
            onChange={(val) => updateField('seniority', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledDatePickerV2
            label="到職日"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.startDate ? dayjs(formState.startDate) : null}
            onChange={(date, dateString) => updateField('startDate', dateString as string)}
          />
          <LabeledDatePickerV2
            label="離職日"
            required={true}
            placeholder="請選擇"
            className=""
            value={formState.leaveDate ? dayjs(formState.leaveDate) : null}
            onChange={(date, dateString) => updateField('leaveDate', dateString as string)}
          />
          <LabeledDatePickerV2
            label="資遣日"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.severanceDate ? dayjs(formState.severanceDate) : null}
            onChange={(date, dateString) => updateField('severanceDate', dateString as string)}
          />
          <LabeledDatePickerV2
            label="退休日"
            required={true}
            placeholder="請選擇"
            className="w-[100%]"
            value={formState.retireDate ? dayjs(formState.retireDate) : null}
            onChange={(date, dateString) => updateField('retireDate', dateString as string)}
          />
          <LabeledInputV2
            label="勞退百分比"
            value={formState.employeeEmployment.laborRetirePercentage}
            onChange={(val) =>
              updateField('employeeEmployment', {
                ...formState.employeeEmployment,
                laborRetirePercentage: val,
              })
            }
            placeholder="- -"
            required={true}
          />
          <LabeledInputV2
            label="員工本薪"
            value={formState.employeeEmployment.salaryPlainText}
            onChange={(val) =>
              updateField('employeeEmployment', {
                ...formState.employeeEmployment,
                salaryPlainText: val,
              })
            }
            placeholder="- -"
            required={true}
            isPassword
          />
        </div>
        {/* MARK:員工打卡與排班設定  */}
        <div className="flex items-center justify-center w-full mt-[40px] mb-[20px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px] flex gap-2">
            <Icon_time style={{ width: '24px', height: '24px' }} />
            員工打卡與排班設定
          </span>
          <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
        </div>
        <div className="flex w-full gap-[24px]">
          <LabeledInputV2
            label="員工編號"
            value={formState.empCode}
            onChange={(val) => updateField('empCode', val)}
            placeholder="- -"
            required={true}
          />
          <LabeledInputV2
            label="卡號設定"
            value={formState.employeeEmployment.userAddr}
            onChange={(val) =>
              updateField('employeeEmployment', {
                ...formState.employeeEmployment,
                userAddr: val,
              })
            }
            placeholder="- -"
            required={true}
          />
          <LabeledSelectV2
            label="勤務"
            required={true}
            placeholder="請選擇"
            value={formState.employeeEmployment.workTypePcode}
            onChange={(val) =>
              updateField('employeeEmployment', {
                ...formState.employeeEmployment,
                workTypePcode: val,
              })
            }
            options={selectOptionsMap.workTypePcode || []}
          />
          <LabeledSelectV2
            label="班別"
            required={true}
            placeholder="請選擇"
            value={formState.employeeEmployment.shiftId}
            onChange={(val) =>
              updateField('employeeEmployment', {
                ...formState.employeeEmployment,
                shiftId: val,
              })
            }
            options={selectOptionsMap.shiftId || []}
          />
        </div>
        {/* MARK:勞保歷程記錄  */}
        <div className="flex items-center justify-center w-full mt-[40px] mb-[20px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px] flex gap-2">
            <Icon_security style={{ width: '24px', height: '24px' }} />
            勞保歷程記錄
          </span>
          <AddButton label="歷程記錄" onClick={handleAddLaborInsurance} className="h-[40px] mr-3" />
          <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
          <ExtendButton
            label={labor ? '收合' : '展開'}
            className="w-[80px] h-[40px] ml-3"
            onClick={() => setLabor((prev) => !prev)}
          />
        </div>
        <div className={`transition-all duration-300  ${labor ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {formState.insuranceItems
            .filter((item) => item.insuranceTypePcode === 'labor')
            .map((history) => (
              <div key={history.insuranceId} className="grid grid-cols-4 gap-[24px] relative mb-[16px]">
                <LabeledInputV2
                  label="勞保投保級距"
                  value={history.levelAmount}
                  onChange={(val) => {
                    const updated = formState.insuranceItems.map((item) =>
                      item.insuranceId === history.insuranceId ? { ...item, levelAmount: val } : item
                    );
                    updateField('insuranceItems', updated);
                  }}
                  placeholder="- -"
                  required
                />
                <LabeledDatePickerV2
                  label="異動日期"
                  required
                  placeholder="請選擇"
                  className="w-full"
                  value={history.createdAt ? dayjs(history.createdAt) : null}
                  onChange={(date, dateString) => {
                    const updated = formState.insuranceItems.map((item) =>
                      item.insuranceId === history.insuranceId ? { ...item, createdAt: dateString as string } : item
                    );
                    updateField('insuranceItems', updated);
                  }}
                />

                <LabeledInputV2
                  label="異動原因"
                  value={history.reason}
                  onChange={(val) => {
                    const updated = formState.insuranceItems.map((item) =>
                      item.insuranceId === history.insuranceId ? { ...item, reason: val } : item
                    );
                    updateField('insuranceItems', updated);
                  }}
                  placeholder="- -"
                  required
                />

                <LabeledInputV2
                  label="生效日"
                  value={history.effectiveDate}
                  onChange={(val) => {
                    const updated = formState.insuranceItems.map((item) =>
                      item.insuranceId === history.insuranceId ? { ...item, effectiveDate: val } : item
                    );
                    updateField('insuranceItems', updated);
                  }}
                  placeholder="- -"
                  required
                />

                <div className="absolute right-0 top-[-1.5px]">
                  <ClearButton
                    label={<span className="text-[14px] text-[#EA1833] ">刪除</span>}
                    className="h-[24px]"
                    iconPosition="right"
                    onClick={() => {
                      const updated = formState.insuranceItems.filter(
                        (item) => !(item.insuranceId === history.insuranceId && item.insuranceTypePcode === 'labor')
                      );
                      updateField('insuranceItems', updated);
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
        {/* MARK:健保歷程記錄  */}
        <div className="flex items-center justify-center w-full mt-[40px] mb-[20px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px] flex gap-2">
            <Icon_security2 style={{ width: '24px', height: '24px' }} />
            健保歷程記錄
          </span>
          <AddButton
            label="歷程記錄"
            onClick={() => {
              handleAddHealthInsurance();
            }}
            className="h-[40px] mr-3"
          />
          <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
          <ExtendButton
            label={health ? '收合' : '展開'}
            className="w-[80px] h-[40px] ml-3"
            onClick={() => setHealth((prev) => !prev)}
          />
        </div>
        <div className={`transition-all duration-300  ${health ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {formState.insuranceItems
            .filter((item) => item.insuranceTypePcode === 'health')
            .map((history) => (
              <div key={history.insuranceId} className="grid grid-cols-4 gap-[24px] relative mb-[16px]">
                <LabeledInputV2
                  label="健保投保級距"
                  value={history.levelAmount}
                  onChange={(val) => {
                    const updated = formState.insuranceItems.map((item) =>
                      item.insuranceId === history.insuranceId ? { ...item, levelAmount: val } : item
                    );
                    updateField('insuranceItems', updated);
                  }}
                  placeholder="- -"
                  required
                />

                <LabeledDatePickerV2
                  label="異動日期"
                  required
                  placeholder="請選擇"
                  className="w-full"
                  value={history.createdAt ? dayjs(history.createdAt) : null}
                  onChange={(date, dateString) => {
                    const updated = formState.insuranceItems.map((item) =>
                      item.insuranceId === history.insuranceId ? { ...item, createdAt: dateString as string } : item
                    );
                    updateField('insuranceItems', updated);
                  }}
                />

                <LabeledInputV2
                  label="異動原因"
                  value={history.reason}
                  onChange={(val) => {
                    const updated = formState.insuranceItems.map((item) =>
                      item.insuranceId === history.insuranceId ? { ...item, reason: val } : item
                    );
                    updateField('insuranceItems', updated);
                  }}
                  placeholder="- -"
                  required
                />

                <LabeledInputV2
                  label="生效日"
                  value={history.effectiveDate}
                  onChange={(val) => {
                    const updated = formState.insuranceItems.map((item) =>
                      item.insuranceId === history.insuranceId ? { ...item, effectiveDate: val } : item
                    );
                    updateField('insuranceItems', updated);
                  }}
                  placeholder="- -"
                  required
                />

                <div className="absolute right-0 top-[-1.5px]">
                  <ClearButton
                    label={<span className="text-[14px] text-[#EA1833] ">刪除</span>}
                    className="h-[24px]"
                    iconPosition="right"
                    onClick={() => {
                      const updated = formState.insuranceItems.filter(
                        (item) => !(item.insuranceId === history.insuranceId && item.insuranceTypePcode === 'health')
                      );
                      updateField('insuranceItems', updated);
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
        {/* MARK:眷屬資料  */}
        <div className="flex items-center justify-center w-full mt-[40px] mb-[20px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px] flex gap-2">
            <Icon_house style={{ width: '24px', height: '24px' }} />
            眷屬資料
          </span>
          <AddButton label="新增眷屬" onClick={() => handleAddDependent()} className="h-[40px] mr-3" />
          <div className="h-px bg-[#E0E0E0] flex-1 rounded-[10px]" />
        </div>
        {formState.dependents.map((dep) => (
          <div key={dep.empRelativeId} className="grid grid-cols-12 gap-[24px] relative mb-[16px]">
            <div className="flex col-span-3">
              <div className="flex flex-col justify-center items-center pr-[24px]">
                <Checkbox
                  checked={!!dep.is_nhi}
                  onChange={(e) => {
                    const updated = formState.dependents.map((item) =>
                      item.empRelativeId === dep.empRelativeId ? { ...item, is_nhi: e.target.checked } : item
                    );
                    updateField('dependents', updated);
                  }}
                />
                <span className="whitespace-nowrap">計入健保扶養</span>
              </div>
              <LabeledInputV2
                label="員工眷屬姓名"
                value={dep.empRelativeName}
                onChange={(val) => {
                  const updated = formState.dependents.map((item) =>
                    item.empRelativeId === dep.empRelativeId ? { ...item, empRelativeName: val } : item
                  );
                  updateField('dependents', updated);
                }}
                placeholder="- -"
                required
              />
            </div>
            <div className="col-span-3">
              <LabeledDatePickerV2
                label="員工眷屬生日"
                required={!!dep.empRelativeBirthday}
                placeholder="請選擇"
                className="w-full"
                value={dep.empRelativeBirthday ? dayjs(dep.empRelativeBirthday) : null}
                onChange={(date, dateString) => {
                  const updated = formState.dependents.map((item) =>
                    item.empRelativeId === dep.empRelativeId
                      ? { ...item, empRelativeBirthday: dateString as string }
                      : item
                  );
                  updateField('dependents', updated);
                }}
              />
            </div>
            <div className="col-span-2">
              <LabeledInputV2
                label="眷屬身分證"
                value={dep.empRelativeIdNo}
                onChange={(val) => {
                  const updated = formState.dependents.map((item) =>
                    item.empRelativeId === dep.empRelativeId ? { ...item, empRelativeIdNo: val } : item
                  );
                  updateField('dependents', updated);
                }}
                placeholder="- -"
                required={!!dep.is_nhi}
              />
            </div>
            <div className="col-span-2">
              <LabeledSelectV2
                label="員工眷屬關係"
                required
                placeholder="請選擇"
                value={dep.empRelativeRelationPcode || ''}
                onChange={(val) => {
                  const updated = formState.dependents.map((item) =>
                    item.empRelativeId === dep.empRelativeId ? { ...item, empRelativeRelationPcode: val } : item
                  );
                  updateField('dependents', updated);
                }}
                options={selectOptionsMap.emergencyContactRelationshipPcode || []}
              />
            </div>
            <div className="col-span-2">
              <LabeledSelectV2
                label="眷屬是否國外"
                required={!!dep.is_nhi}
                placeholder="請選擇"
                value={dep.empRelativeDomesticPcode}
                onChange={(val) => {
                  const updated = formState.dependents.map((item) =>
                    item.empRelativeId === dep.empRelativeId ? { ...item, empRelativeDomesticPcode: val } : item
                  );
                  updateField('dependents', updated);
                }}
                options={selectOptionsMap.domesticPcode || []}
              />
            </div>
            <div className="absolute right-0 top-[-1.5px]">
              <ClearButton
                label={<span className="text-[14px] text-[#EA1833] ">刪除</span>}
                className="h-[24px]"
                iconPosition="right"
                onClick={() => {
                  const updated = formState.dependents.filter((item) => item.empRelativeId !== dep.empRelativeId);
                  updateField('dependents', updated);
                }}
              />
            </div>
          </div>
        ))}
        {/* MARK:其他  */}
        <div className="flex items-center w-full mt-[40px]">
          <span className="font-semibold mr-2 whitespace-nowrap text-[16px] flex gap-2">
            <Icon_folder style={{ width: '24px', height: '24px' }} />
            其他
          </span>
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
