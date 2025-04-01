import { Moment } from 'moment';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import AddressBar from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';

// css
import scss from './profile.module.scss';

// ====================================================================

interface Tprofile {
  projectNumber: string;
  projectDate: Moment | null;
  projectName: string;
  county: string;
  district: string;
  address: string;
}

type TsetState = React.Dispatch<React.SetStateAction<Tprofile>>;

// ====================================================================
export default function Profile({
  isAllowEditProfile,
  outsourcingName,
  disabled,
  state,
  setState,
}: {
  isAllowEditProfile: boolean;
  outsourcingName: string;
  disabled: boolean;
  state: Tprofile;
  setState: TsetState;
}) {
  return (
    <div className={scss.profile}>
      <InputSel caption={'外包廠商'} showBaseline="invisible" node={outsourcingName} />
      <InputSel
        caption={'工程編號'}
        disabled={isAllowEditProfile ? disabled : true}
        showBaseline="auto"
        inputProps={{
          props: {
            placeholder: '',
            value: state.projectNumber,
            onChange: (e) => {
              setState((prev) => ({ ...prev, projectNumber: e.target.value }));
            },
          },
        }}
      />
      <InputSel
        caption={'工程日期'}
        disabled={isAllowEditProfile ? disabled : true}
        showBaseline="auto"
        datePickerProps={{
          props: {
            value: state.projectDate,
            onChange: (date) => {
              setState((prev) => ({ ...prev, projectDate: date }));
            },
          },
        }}
      />
      <InputSel caption={'安裝人員'} showBaseline="invisible" node={outsourcingName} />
      <InputSel
        caption={'工程名稱'}
        className="col-span-2"
        disabled={isAllowEditProfile ? disabled : true}
        showBaseline="auto"
        inputProps={{
          props: {
            placeholder: '',
            value: state.projectName,
            onChange: (e) => {
              setState((prev) => ({ ...prev, projectName: e.target.value }));
            },
          },
        }}
      />
      <AddressBar
        inputSelProps={{
          caption: '工程地址',
          className: 'col-span-2',
          disabled: isAllowEditProfile ? disabled : true,
          showBaseline: 'auto',
        }}
        addressProps={{
          county: {
            wrapperClassName: scss.select,
            props: {
              menuPortalTarget: undefined,
              placeholder: '',
              isDisabled: isAllowEditProfile ? disabled : true,
              value: { value: state.county, label: state.county },
              onChange: (option) => {
                const value = option?.value ?? '';

                setState((prev) => ({
                  ...prev,
                  county: value,
                  district: '',
                }));
              },
            },
          },
          district: {
            wrapperClassName: scss.select,
            props: {
              menuPortalTarget: undefined,
              placeholder: '',
              isDisabled: isAllowEditProfile ? disabled : true,
              value: { value: state.district, label: state.district },
              onChange: (option) => {
                const value = option?.value ?? '';

                setState((prev) => ({
                  ...prev,
                  district: value,
                }));
              },
            },
          },
          address: {
            props: {
              placeholder: '',
              readOnly: isAllowEditProfile ? disabled : true,
              value: state.address,
              onChange: (e) => {
                setState((prev) => ({ ...prev, address: e.target.value }));
              },
            },
          },
        }}
      />
    </div>
  );
}
