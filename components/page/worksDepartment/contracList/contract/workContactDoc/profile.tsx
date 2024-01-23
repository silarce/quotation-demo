import { Fragment } from 'react';
import classNames from 'classnames';

// antd
import { Badge, Checkbox } from 'antd';

// glogal gear
import Status from 'components/global/gear/other/status';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import AddressBar, {
  TaddressProps,
  TinputSelProps_noProps,
} from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';

// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './workContactDoc.module.scss';

type TcontrollItem = {
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
};

type TcontactItem = {
  contactPerson: TcontrollItem;
  contactPhone: TcontrollItem;
  onDelClick: () => void;
};

type TprojectPatternStatus = {
  label: string;
  haveData: boolean; // Badge status
  shouldHaveData: boolean; // checkBoxValue
  onCheck: (bool: boolean) => void;
  // onLabelClick: () => void;
};

type Tcontroll = {
  /**請款狀態 */
  paymentStatus: TcontrollItem;
  projectName: TcontrollItem;
  /**工程內容 */
  projectContent: TcontrollItem;
  // 工程圖表資料
  projectPattern: {
    // isOk: boolean;
    // onClick: () => void;
    disabled?: boolean;
    onCaptionClick: () => void;
    statusArr: TprojectPatternStatus[];
  };

  addressBarProps: {
    inputSelProps?: TinputSelProps_noProps;
    addressProps: TaddressProps;
  };

  /**工程負責人 */
  projectPerson: TcontrollItem;
  /**工程負責人聯絡電話 */
  projectPersonNumber: TcontrollItem;
  projectFaxNumber: TcontrollItem;
  /**工地電話 */
  projectNumber: TcontrollItem;
  /**工程編號 */
  engineeringNumber: TcontrollItem;
  /**承包商 */
  contractor: TcontrollItem;
  /**負責人 */
  principal: TcontrollItem;
  /**公司電話 */
  contactNumber: TcontrollItem;
  faxNumber: TcontrollItem;
  //
  contactPersons: {
    onAddClick: () => void;
    arr: TcontactItem[];
  };
};

export type { Tcontroll };

// ==================================================
export default function Profile({ disabled, controll }: { disabled?: boolean; controll: Tcontroll }) {
  const {
    paymentStatus,
    projectName,
    projectContent,
    // county,
    // district,
    // address,
    addressBarProps,
    projectPerson,
    projectPersonNumber,
    projectFaxNumber,
    projectNumber,
    engineeringNumber,
    contractor,
    principal,
    contactNumber,
    faxNumber,
    contactPersons,
  } = controll;

  return (
    <div className={scss.profile}>
      <div className={scss.leftBlock}>
        <Status text={`請款狀態:${paymentStatus.value}`} />
        <div className={scss.leftUpBlock}>
          <InputSel
            disabled={projectName.disabled || disabled}
            label="工程名稱"
            inputProps={{ ...projectName }}
            {...inputStyle01}
          />
          <InputSel
            disabled={projectContent.disabled || disabled}
            label="工程內容"
            inputProps={{ ...projectContent }}
            {...inputStyle01}
          />
          <div className={classNames(scss.projectPatternBtnBox)}>
            <div className={scss.inputSelBox} onClick={controll.projectPattern.onCaptionClick}>
              <InputSel
                className={scss.inputSel}
                disabled={projectContent.disabled || disabled}
                label="工程圖表資料"
                // inputProps={{ ...projectContent }}
                {...inputStyle01}
                captionWidth={'110px'}
              />
            </div>

            <div className={scss.statusBar}>
              {controll.projectPattern.statusArr.map((item, index) => {
                const { haveData, shouldHaveData, onCheck } = item;
                let label = item.label;
                label = shouldHaveData ? label : `此案無${label}`;
                const status = haveData ? 'success' : 'error';

                return (
                  <div key={index}>
                    <Checkbox
                      checked={shouldHaveData}
                      onChange={(e) => {
                        onCheck(e.target.checked);
                      }}
                      disabled={disabled || controll.projectPattern.disabled}
                    />
                    <span>
                      <Badge status={status} text={label} dot={true} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <hr />

        <div className={scss.leftDownBlock}>
          <InputSel
            disabled={projectNumber.disabled || disabled}
            label="工程電話"
            inputProps={{ ...projectNumber }}
            {...inputStyle01}
          />
          <InputSel
            disabled={projectPerson.disabled || disabled}
            label="工程負責人"
            inputProps={{ ...projectPerson }}
            {...inputStyle02}
          />
          <InputSel
            disabled={projectFaxNumber.disabled || disabled}
            label="工程傳真"
            inputProps={{ ...projectFaxNumber }}
            {...inputStyle01}
          />
          <InputSel
            disabled={projectPersonNumber.disabled || disabled}
            label="負責人電話"
            inputProps={{ ...projectPersonNumber }}
            {...inputStyle02}
          />
          <AddressBar addressProps={addressBarProps.addressProps} inputSelProps={addressBarProps.inputSelProps} />
        </div>

        <div className={scss.leftBelowBlock}>
          <div className={classNames(scss.caption, disabled && contactPersons.arr.length === 0 && scss.hidden)}>
            <span>聯絡人</span>
            <IconAddCircle onClick={contactPersons.onAddClick} className={classNames(disabled && scss.hidden)} />
          </div>
          <div className={scss.grid}>
            {contactPersons.arr.map((item, index) => {
              const { contactPerson, contactPhone } = item;

              const indexStr = String(index + 1).padStart(2, '0');

              return (
                <Fragment key={index}>
                  <InputSel
                    disabled={contactPerson.disabled || disabled}
                    label={`聯絡人${indexStr}`}
                    placeholder="聯絡人"
                    inputProps={{ ...contactPerson }}
                    {...inputStyle01}
                  />
                  <div className={scss.wrapper}>
                    <InputSel
                      disabled={contactPhone.disabled || disabled}
                      label={`聯絡人${indexStr}電話`}
                      placeholder="聯絡人電話"
                      inputProps={{ ...contactPhone }}
                      {...inputStyle02}
                    />
                    <IconRemoveCircle
                      onClick={item.onDelClick}
                      className={classNames((contactPhone.disabled || disabled) && scss.hidden)}
                    />
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className={scss.rightBlock}>
        <InputSel
          disabled={engineeringNumber.disabled || disabled}
          label="工程編號"
          inputProps={{ ...engineeringNumber }}
          {...inputStyle01}
        />
        <InputSel
          disabled={contractor.disabled || disabled}
          label="承包商"
          inputProps={{ ...contractor }}
          {...inputStyle01}
        />
        <InputSel
          disabled={principal.disabled || disabled}
          label="負責人"
          inputProps={{ ...principal }}
          {...inputStyle01}
        />
        <InputSel
          disabled={contactNumber.disabled || disabled}
          label="公司電話"
          inputProps={{ ...contactNumber }}
          {...inputStyle01}
        />
        <InputSel
          disabled={faxNumber.disabled || disabled}
          label="公司傳真"
          inputProps={{ ...faxNumber }}
          {...inputStyle01}
        />
      </div>
    </div>
  );
}

// =============================================================
// =============================================================
// =============================================================
const inputStyle01 = {
  captionWidth: '80px',
  gap: '24px',
  captionClassName: scss.inputCaption,
  captionColor: 'main' as const,
  showBaseline: 'auto' as const,
};
const inputStyle02 = {
  captionWidth: '110px',
  gap: '24px',
  captionClassName: scss.inputCaption,
  captionColor: 'main' as const,
  showBaseline: 'auto' as const,
};
