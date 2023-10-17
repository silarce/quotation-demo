// glogal gear
import Status from 'components/global/gear/other/status';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import AddressBar, {
  TaddressProps,
  TinputSelProps_noProps,
} from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';

// css
import style from './workContactDoc.module.scss';

type TcontrollItem = {
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
};

type Tcontroll = {
  /**請款狀態 */
  paymentStatus: TcontrollItem;
  projectName: TcontrollItem;
  /**工程內容 */
  projectContent: TcontrollItem;

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
  } = controll;

  return (
    <div className={style.profile}>
      <div className={style.leftBlock}>
        <Status text={`請款狀態:${paymentStatus.value}`} />
        <div className={style.leftUpBlock}>
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
        </div>

        <hr />

        <div className={style.leftDownBlock}>
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
      </div>

      <div className={style.rightBlock}>
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
  captionClassName: style.inputCaption,
  captionColor: 'main' as const,
  showBaseline: 'auto' as const,
};
const inputStyle02 = {
  captionWidth: '90px',
  gap: '24px',
  captionClassName: style.inputCaption,
  captionColor: 'main' as const,
  showBaseline: 'auto' as const,
};
