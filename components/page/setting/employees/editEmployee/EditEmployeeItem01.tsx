import { Dayjs } from 'dayjs';

// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import InputSelBar_address from 'components/global/gear/inputAndSel/inputSelBar_address/inputSelBar_address';

// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

// option
import { Toption, optionsCreator_gender, optionsCreator_marital } from 'js/utils/options/options';
const [optionsGender, optionMarital] = [optionsCreator_gender(), optionsCreator_marital()];

// type
import { Class_employee } from 'hooks/department-job-Employee/useEmployee';

// css
import scss from '../editEmployee.module.scss';

export default function EditEmployeeItem01({ classEmployee }: { classEmployee: Class_employee }) {
  // 地址參數
  const selectInputPropsResidence = {
    county: classEmployee.residenceCounty,
    onChangeCounty: (option: Toption | null) => {
      if (!option) {
        return;
      }

      const value = option.value;
      classEmployee.residenceCounty = value;
      classEmployee.residenceDistrict = '';
    },
    district: classEmployee.residenceDistrict,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) {
        return;
      }

      const value = option.value;
      classEmployee.residenceDistrict = value;
    },
    address: classEmployee.residenceAddress,
    onChangeAddress: (value: string) => {
      classEmployee.residenceAddress = value;
    },
  };
  // 地址參數
  const selectInputPropsMailing = {
    county: classEmployee.mailingCounty,
    onChangeCounty: (option: Toption | null) => {
      if (!option) {
        return;
      }

      const value = option.value;
      classEmployee.mailingCounty = value;
      classEmployee.mailingDistrict = '';
    },
    district: classEmployee.mailingDistrict,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) {
        return;
      }

      const value = option.value;
      classEmployee.mailingDistrict = value;
    },
    address: classEmployee.mailingAddress,
    onChangeAddress: (value: string) => {
      classEmployee.mailingAddress = value;
    },
  };

  // ======================================================
  return (
    <div className={scss.editEmployeeItem01}>
      <p className={scss.subTitle}>員工個人資料</p>
      <div className={scss.form01}>
        {/* 左邊 */}
        <div>
          {keyIndex01.map((key, index) => {
            const { label } = config01[key];
            const stateValue = classEmployee[key];

            const onChange = (value: string) => {
              classEmployee[key] = value;
            };

            return (
              <InputSel
                key={index}
                className={scss.inputSel}
                label={label}
                captionWidth="140px"
                presetStyle="s01"
                inputProps={{
                  value: stateValue,
                  onChange: onChange,
                }}
              />
            );
          })}
        </div>
        {/* 垂直分隔線 */}
        <div className={scss.vr} />
        {/* 右邊 */}
        <div>
          {/*  */}
          <InputSel
            className={scss.inputSel}
            label={'生日'}
            width={'260px'}
            presetStyle="s01"
            captionWidth={'60px'}
            datePickerProps={{
              value: classEmployee.birthday,
              onChange02: (dayjs) => {
                classEmployee.birthday = dayjs?.toISOString() ?? '';
              },
            }}
          />

          {/*  */}
          {keyIndex02.map((key, index) => {
            const { label, options, width, labelWidth } = config02[key];
            const stateValue = classEmployee[key];

            if (options) {
              const onChange = (option: Toption | null) => {
                if (!option) {
                  return;
                }

                const { value } = option;
                classEmployee[key] = value;
              };

              return (
                <InputSel
                  key={index}
                  className={scss.inputSel}
                  label={label}
                  presetStyle="s01"
                  width={width}
                  captionWidth={labelWidth}
                  selectProps={{
                    value: stateValue,
                    options: options,
                    onChange: onChange,
                  }}
                />
              );
            }

            const onChange = (value: string) => {
              classEmployee[key] = value;
            };

            return (
              <InputSel
                key={index}
                className={scss.inputSel}
                label={label}
                captionWidth={labelWidth}
                presetStyle="s01"
                inputProps={{
                  value: stateValue,
                  onChange: onChange,
                }}
              />
            );
          })}
        </div>
        {/* 下面 */}
        <div>
          <div>
            {classEmployee.qualifications.map((qualifications, index, arr) => {
              const qualificationsName = qualifications.name;
              const onChange = (v: string) => classEmployee.setQualifications(index, v);
              const add = () => classEmployee.addQualifications();
              const remove = () => classEmployee.removeQualifications(index);
              const showAdd = index !== 2 && arr.length === index + 1;

              return (
                <div key={index} className="flex items-center gap-5">
                  <InputSel
                    className={scss.inputSel}
                    label={`個人資歷 ${index + 1}`}
                    captionWidth={'100px'}
                    presetStyle="s01"
                    inputProps={{
                      value: qualificationsName,
                      onChange: onChange,
                    }}
                  />
                  <div className="grid grid-cols-2 gap-5">
                    <IconRemoveCircle onClick={remove} />
                    {showAdd && <IconAddCircle onClick={add} />}
                  </div>
                </div>
              );
            })}
          </div>

          <InputSelBar_address
            className={scss.inputSel}
            label="戶籍地址"
            captionWidth="100px"
            padding="17px 4px 14px 4px"
            gap="40px"
            addressProps={selectInputPropsResidence}
          />
          <InputSelBar_address
            className={scss.inputSel}
            label="通訊地址"
            captionWidth="100px"
            padding="17px 4px 14px 4px"
            gap="40px"
            addressProps={selectInputPropsMailing}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
type TkeyIndex01Key = keyof Pick<
  Class_employee,
  | 'chName'
  | 'enName'
  // "identity" |
  | 'phone1'
  | 'phone2'
  | 'emergencyContactRelationship'
  | 'emergencyContactPhone'
>;

const keyIndex01: TkeyIndex01Key[] = [
  'chName',
  'enName',
  // "identity",
  'phone1',
  'phone2',
  'emergencyContactRelationship',
  'emergencyContactPhone',
];

const config01: {
  [key in TkeyIndex01Key]: {
    label: string;
  };
} = {
  chName: {
    label: '中文姓名',
  },
  enName: {
    label: '英文姓名',
  },
  // identity: {
  //   label: "身分證字號"
  // },
  phone1: {
    label: '聯絡電話1',
  },
  phone2: {
    label: '聯絡電話2',
  },
  emergencyContactRelationship: {
    label: '緊急聯絡人關係',
  },
  emergencyContactPhone: {
    label: '緊急聯絡人電話',
  },
};
// -------------------------
type TkeyIndex02Key = keyof Pick<
  Class_employee,
  'gender' | 'marital' | 'education' | 'expertise' | 'militaryServiceType'
>;

const keyIndex02: TkeyIndex02Key[] = ['gender', 'marital', 'militaryServiceType', 'education', 'expertise'];

const config02Width = '60px';

const config02: {
  [key in TkeyIndex02Key]: {
    label: string;
    width?: string;
    labelWidth?: string;
    options?: Toption[];
  };
} = {
  gender: {
    label: '性別',
    width: '260px',
    options: optionsGender,
    labelWidth: config02Width,
  },
  marital: {
    label: '婚姻',
    width: '260px',
    options: optionMarital,
    labelWidth: config02Width,
  },
  education: {
    label: '學歷',
    labelWidth: config02Width,
  },
  expertise: {
    label: '專長',
    labelWidth: config02Width,
  },
  militaryServiceType: {
    label: '兵役別',
    labelWidth: config02Width,
  },
};
