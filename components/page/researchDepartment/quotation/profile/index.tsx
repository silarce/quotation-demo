import { useMemo } from 'react';
import classNames from 'classnames';

// glogal gear
import DataEntry, {
  TdataEntrycontainerProps,
  TinputProps,
  TtextareaProps,
  //
  DataEntryContainer,
  Checkbox,
} from 'components/global/gear/dataEntry';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
// config
// css
import scss from './index.module.scss';

// icon
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

import { optionsCreator_county, districtOptionsSelector } from 'js/utils/options/countryAndDistrict';

import { Tinstance_useProfile } from 'components/page/researchDepartment/quotation/hook/useProfile';

// ===========================================================================

const options_county = optionsCreator_county();

// ===========================================================================

// MARK:START
export default function QuotationProfile({
  disable = false,
  return_useProfile,
}: {
  disable?: boolean;
  return_useProfile: Tinstance_useProfile;
}) {
  const { state_profile, setState_Profile, selectCustomer, removeCustomer, editCounty } = return_useProfile;

  const options_district = useMemo(() => {
    return districtOptionsSelector(state_profile.county);
  }, [state_profile.county]);

  // ---------------------------------------------------------------------------
  // MARK: RENDER
  return (
    <div className={scss.profile}>
      <div className={scss.left}>
        <Container caption="名稱" showBorder={!disable}>
          <Input
            value={state_profile.name}
            onChange={(e) => setState_Profile({ ...state_profile, name: e.target.value })}
          />
        </Container>
        <Container caption="客戶名稱" showBorder={false}>
          <div className={scss.customer}>
            {state_profile.customer && <IconRemove02 className={scss.remove} onClick={removeCustomer} />}
            {!state_profile.customer && (
              <SquareBtn sharp="mini" onClick={selectCustomer}>
                選擇客戶
              </SquareBtn>
            )}

            <span className={scss.customerName}>{state_profile.customer?.name}</span>
          </div>
        </Container>
        <Container caption="聯絡人" className="w-[300px]" showBorder={!disable}>
          <Input
            value={state_profile.contactPerson}
            onChange={(e) => setState_Profile({ ...state_profile, contactPerson: e.target.value })}
          />
        </Container>
        <Container caption="聯絡電話" className="w-[300px]" showBorder={!disable}>
          <Input
            value={state_profile.contactNumber}
            onChange={(e) => setState_Profile({ ...state_profile, contactNumber: e.target.value })}
          />
        </Container>
        <Container caption="傳真號碼" className="w-[300px]" showBorder={!disable}>
          <Input
            value={state_profile.fax}
            onChange={(e) => setState_Profile({ ...state_profile, fax: e.target.value })}
          />
        </Container>
        <Container caption="地址" showBorder={!disable}>
          <div className={scss.addressContainer}>
            <Select
              options={options_county}
              value={state_profile.county}
              onChange={(v) => {
                editCounty(v ?? '');
              }}
            />
            <Select
              options={options_district}
              value={state_profile.district}
              onChange={(v) => setState_Profile({ ...state_profile, district: v ?? '' })}
            />
            <Textarea
              value={state_profile.address}
              onChange={(e) => setState_Profile({ ...state_profile, address: e.target.value })}
            />
          </div>
        </Container>
      </div>
      {/*  */}
      {/*  */}
      <div className={scss.right}>
        <Container caption="報價編號" showBorder={false}>
          {state_profile.quotationNumber || <span className="text-border">新增後自動建立</span>}
        </Container>
        <Container caption="報價時效" suffix="天內" showBorder={!disable}>
          <Input
            onWheel={(e) => {
              e.currentTarget.blur();
            }}
            type="number"
            min={0}
            step={0}
            value={state_profile.quotationPeriod}
            onChange={(e) => {
              if (e.currentTarget.validity.valid) {
                const value = (e.target.value as `${number}`) || '';
                setState_Profile({ ...state_profile, quotationPeriod: value });
              }
            }}
          />
        </Container>
        <Container caption="報價日期" showBorder={false}>
          {state_profile.quotationDate || <span className="text-border">新增後自動建立</span>}
        </Container>
        <Container caption="失單" showBorder={false}>
          <Checkbox
            checked={state_profile.isLost}
            onChange={(e) => {
              const checked = e.target.checked;

              if (checked) {
                myAlert.confirm({
                  title: '確定設為失單?',
                  props: {
                    onOk() {
                      setState_Profile({ ...state_profile, isLost: checked });
                    },
                  },
                });
              } else {
                setState_Profile({ ...state_profile, isLost: checked });
              }
            }}
          />
        </Container>
      </div>
    </div>
  );
}

// MARK: END

// ===========================================================================
const Container = ({
  className,
  captionClassName,
  childrenWrapperProps,
  suffixWrapperProps,
  ...props
}: TdataEntrycontainerProps) => {
  return (
    <DataEntryContainer
      {...props}
      className={classNames(scss.container, className)}
      captionClassName={classNames(scss.caption, captionClassName)}
      childrenWrapperProps={{
        ...childrenWrapperProps,
        className: classNames(scss.childrenWrapper, childrenWrapperProps?.className),
      }}
      suffixWrapperProps={{
        ...suffixWrapperProps,
        className: classNames(scss.suffisWrapper, suffixWrapperProps?.className),
      }}
    />
  );
};

const Input = ({ className, ...props }: TinputProps) => {
  return <DataEntry.Input {...props} className={classNames(scss.input, className)} />;
};

const Select: typeof DataEntry.Select = ({ className, ...props }) => {
  return <DataEntry.Select {...props} className={classNames(scss.select, className)} />;
};

Select.displayName = 'Select';

const Textarea = ({ className, ...props }: TtextareaProps) => {
  return <DataEntry.Textarea_autoHeight {...props} className={classNames('resize-none', scss.textarea, className)} />;
};
