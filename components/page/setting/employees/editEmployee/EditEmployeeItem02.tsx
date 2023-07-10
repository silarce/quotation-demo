// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';

// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

// type
import { Class_employee } from 'hooks/department-job-Employee/useEmployee';
// css
import scss from '../editEmployee.module.scss';

// ============================================================

type TdepartmentJobOptionGroup = {
  departmentOptionArr: {
    value: string;
    label: string;
  }[];
  jobOptionArrList: {
    [key: string]: {
      value: string;
      label: string;
      grade: string;
    }[];
  };
};

// ============================================================
export default function EditEmployeeItem02({
  classEmployee,
  departmentJobOptionGroup,
}: {
  classEmployee: Class_employee;
  departmentJobOptionGroup: TdepartmentJobOptionGroup;
}) {
  const { classJobGroupArr, addJobGroup, removeJobGroup } = classEmployee;

  return (
    <div className={scss.editEmployeeItem02}>
      <p className={scss.subTitle}>公司資訊</p>
      <div className={scss.form02}>
        <div className={scss.jobsArr}>
          {classJobGroupArr.map((group, index, arr) => {
            const { department, job } = group;

            const departmentValue = department
              ? {
                  value: department.id,
                  label: department.name,
                }
              : null;
            const jobValue = job
              ? {
                  value: job.id,
                  label: job.name,
                }
              : null;

            const departmentOptionArr = departmentJobOptionGroup.departmentOptionArr;

            const jobOptionArr = department ? departmentJobOptionGroup.jobOptionArrList[department.id] : [];

            return (
              <div key={index} className={scss.selBox}>
                <InputSel
                  className={scss.inputSel}
                  label="部門"
                  presetStyle="s01"
                  selectProps={{
                    value: departmentValue,
                    options: departmentOptionArr,
                    onChange: (option) => {
                      if (!option) {
                        group.department = null;
                      } else {
                        group.department = {
                          id: option.value,
                          name: option.label,
                        };
                      }
                    },
                  }}
                />
                <InputSel
                  className={scss.inputSel}
                  key={index}
                  label="職稱"
                  presetStyle="s01"
                  selectProps={{
                    value: jobValue,
                    options: jobOptionArr,
                    onChange: (option) => {
                      if (!option) {
                        group.job = null;
                      } else {
                        group.job = {
                          id: option.value,
                          name: option.label,
                          grade: option.grade ?? '',
                        };
                      }
                    },
                  }}
                />
                <InputSel
                  className={scss.inputSel}
                  label="職等"
                  presetStyle="s01"
                  disabled={true}
                  inputProps={{
                    value: job?.grade ?? '',
                    onChange: () => {},
                  }}
                />
                <div className={scss.btnBox}>
                  {index === arr.length - 1 && <IconAddCircle onClick={addJobGroup} />}
                  {arr.length !== 1 && <IconRemoveCircle onClick={() => removeJobGroup(index)} />}
                </div>
              </div>
            );
          })}
        </div>

        <div className={scss.bottomContainer}>
          <div>
            <InputSel
              className={scss.inputSel}
              label="年資"
              captionWidth="60px"
              presetStyle="s01"
              inputProps={{
                value: classEmployee.seniority,
                onChange: (value: string) => {
                  // classEmployee.seniority = value
                },
              }}
              disabled
            />
          </div>
          <div>
            {keyIndex02.map((key, index) => {
              const stateValue = classEmployee[key];
              const { label } = config02[key];

              const onChange02 = (moment: moment.Moment | null) => {
                classEmployee[key] = moment?.toISOString() ?? '';
              };

              const isMust = key === 'startDate' ? true : false;

              return (
                <InputSel
                  className={scss.inputSel}
                  key={index}
                  label={label}
                  captionWidth="60px"
                  presetStyle="s01"
                  datePickerProps={{
                    value: stateValue,
                    onChange02: onChange02,
                  }}
                  isMust={isMust}
                  mustTipClassName={scss.mustTip}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} // EditEmployeeItem02

// ============================================================

type TkeyIndex02Keys = 'startDate' | 'leaveDate' | 'retireDate' | 'severanceDate';

const keyIndex02: TkeyIndex02Keys[] = ['startDate', 'leaveDate', 'retireDate', 'severanceDate'];

const config02: {
  [key in TkeyIndex02Keys]: {
    label: string;
  };
} = {
  startDate: {
    label: '到職日',
  },
  leaveDate: {
    label: '離職日',
  },
  retireDate: {
    label: '退休日',
  },
  severanceDate: {
    label: '資遣日',
  },
};

// ===============================================================
