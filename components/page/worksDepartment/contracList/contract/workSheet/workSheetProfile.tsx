import classNames from 'classnames';

import InputSel from 'components/global/gear/inputAndSel/inputSel';

import scss from './workSheetProfile.module.scss';

type TcontolItem = {
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
};

type Tcontrol = {
  projectName: TcontolItem; // 工程名稱 // 由合約資料而來
  projectContent: TcontolItem; // 工程內容
  /**工地電話 */
  projectNumber: TcontolItem;
  projectFaxNumber: TcontolItem;
  /**工程負責人 */
  projectPerson: TcontolItem;
  /**工程負責人聯絡電話 */
  projectPersonNumber: TcontolItem;
  /**工程地點 */
  allAddress: TcontolItem;
  //
  /**工程編號 */
  engineeringNumber: TcontolItem;
  /**承包商 */
  contractor: TcontolItem;
  /**負責人 */
  principal: TcontolItem;
  /**公司電話 */
  contactNumber: TcontolItem;
  faxNumber: TcontolItem;
};

export type { Tcontrol as Tcontrol_profile };

export default function WorkSheetProfile({ disabled, control }: { control: Tcontrol; disabled: boolean }) {
  console.log('WorkSheetProfile');

  return (
    <div className={scss.profile}>
      <div className={scss.left}>
        <div className={scss.top}>
          <InputSel
            className={scss.inputSel}
            label="工程名稱"
            captionColor="main"
            disabled={disabled || control.projectName.disabled}
            showBaseline="auto"
            inputProps={{
              value: control.projectName.value,
              onChange: (v) => {
                control.projectName.onChange?.(v);
              },
            }}
          />

          <InputSel
            className={scss.inputSel}
            label="工程內容"
            captionColor="main"
            disabled={disabled || control.projectContent.disabled}
            showBaseline="auto"
            inputProps={{
              value: control.projectContent.value,
              onChange: (v) => {
                control.projectContent.onChange?.(v);
              },
            }}
          />
        </div>

        <hr />
        <div className={scss.bottom}>
          {configArr_left.map((item) => {
            const { key, label, className } = item;

            return (
              <InputSel
                key={key}
                className={classNames(scss.inputSel, className)}
                label={label}
                captionColor="main"
                disabled={disabled || control[key].disabled}
                showBaseline="auto"
                inputProps={{
                  value: control[key].value,
                  onChange: (v) => {
                    control[key].onChange?.(v);
                  },
                }}
              />
            );
          })}
        </div>
      </div>

      <div className={scss.right}>
        {configArr_right.map((item) => {
          const { key, label, className } = item;

          return (
            <InputSel
              key={key}
              className={classNames(scss.inputSel, className)}
              label={label}
              captionWidth="80px"
              captionColor="main"
              disabled={disabled || control[key].disabled}
              showBaseline="auto"
              inputProps={{
                value: control[key].value,
                onChange: (v) => {
                  control[key].onChange?.(v);
                },
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ==============================================================

type TconfitItem = {
  key: keyof Tcontrol;
  label: string;
  className: string | undefined;
};

const configArr_left: TconfitItem[] = [
  {
    key: 'projectNumber',
    label: '工地電話',
    className: undefined,
  },
  {
    key: 'projectPerson',
    label: '工程負責人',
    className: undefined,
  },
  {
    key: 'projectFaxNumber',
    label: '工地傳真',
    className: undefined,
  },
  {
    key: 'projectPersonNumber',
    label: '負責人電話',
    className: undefined,
  },
  {
    key: 'allAddress',
    label: '工程地點',
    className: 'col-span-2',
  },
];

const configArr_right: TconfitItem[] = [
  { key: 'engineeringNumber', label: '工程編號', className: undefined },
  { key: 'contractor', label: '承包商', className: undefined },
  { key: 'principal', label: '負責人', className: undefined },
  { key: 'contactNumber', label: '公司電話', className: undefined },
  { key: 'faxNumber', label: '公司傳真', className: undefined },
];
