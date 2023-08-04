import { useMemo, useEffect, useState } from 'react';

// global gear
import InputSel, { TinputSelProps, TinputSelBarProps_reduce, TselectProps, TtextareaProps } from '../inputSel';

// config
import { Toption, optionsCreator_county, districtOptionsSelector } from 'js/utils/options/countryAndDistrict';

type TinputSelProps_noProps = Omit<
  TinputSelProps,
  | 'inputProps'
  | 'selectProps'
  | 'textareaProps'
  | 'datePickerProps'
  | 'timePickerProps'
  | 'timePickerProps_mui'
  | 'checkBoxProps'
  | 'inputSelBarProps'
>;

export type TaddressProps = {
  county: TselectProps<Toption>;
  district: TselectProps<Toption>;
  address: TtextareaProps;

  showDistrict?: boolean;
};

export default function AddressBar({
  inputSelProps,
  addressProps,
}: {
  inputSelProps?: TinputSelProps_noProps;
  addressProps: TaddressProps;
}) {
  const [county_l, setCounty_l] = useState<Toption | null>(null);
  const [district_l, setDistrict_l] = useState<Toption | null>(null);

  // -------------------------------------------------------------
  const { county, district, address } = addressProps;
  let showDistrict = addressProps.showDistrict;

  if (showDistrict === undefined) {
    showDistrict = true;
  }

  // 地址
  // 城市
  const countryOptions = optionsCreator_county();

  // 地區
  const districtOptions = useMemo(() => {
    let countyName;

    if (county.props?.value && 'value' in county.props?.value) {
      countyName = county.props?.value.value;
    }

    if (countyName === undefined) {
      countyName = county_l?.value;
    }

    const options = districtOptionsSelector(countyName || '');

    return options;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [county.props?.value, county_l]);

  useEffect(() => {
    if (district?.props?.onChange) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      district.props.onChange(null); // 第二個參數應該用不到
    } else {
      setDistrict_l(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [county.props?.value, county_l]);

  // ------------------------------------------------------------------

  const selectInputList: TinputSelBarProps_reduce['propsArr'] = [
    {
      type: 'select',
      itemProps: {
        ...county,
        props: {
          options: countryOptions,
          // 如果county.props裡面有valeu或onChange,那麼這個value或onChange會被蓋掉
          value: county_l,
          onChange: (e) => {
            setCounty_l(e);
          },
          ...county.props,
        },
      },
    },
    {
      type: 'select',
      itemProps: {
        ...district,
        props: {
          // 如果county.props裡面有valeu或onChange,那麼這個value或onChange會被蓋掉
          value: district_l,
          onChange: (e) => {
            setDistrict_l(e);
          },
          options: districtOptions,
          ...district.props,
        },
      },
    },
    {
      type: 'textarea',
      itemProps: {
        ...address,
      },
    },
  ];

  if (showDistrict === false) {
    selectInputList.splice(1, 1);
  }

  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  return (
    <InputSel
      inputSelBarProps={{
        propsArr: selectInputList,
      }}
      {...inputSelProps}
    />
  );
}
