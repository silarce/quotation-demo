import { useMemo, useEffect, useState } from 'react';
import classNames from 'classnames';

// global gear
import InputSel, { TinputSelProps, TinputSelBarProps_reduce, TselectProps, TtextareaProps } from '../inputSel';

// config
import { Toption, optionsCreator_county, districtOptionsSelector } from 'js/utils/options/countryAndDistrict';

import scss from './addressBar.module.scss';

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

type TaddressProps = {
  county: TselectProps<Toption>;
  district: TselectProps<Toption>;
  address: TtextareaProps;

  showDistrict?: boolean;
};

export type { TinputSelProps_noProps, TaddressProps };

// ==============================================================================
export default function AddressBar({
  inputSelProps,
  addressProps,
}: {
  inputSelProps?: TinputSelProps_noProps;
  addressProps: TaddressProps;
}) {
  // 內部控制，county.props.onChange為undefined時才會變化
  const [county_l, setCounty_l] = useState<Toption | null>(null);
  // 內部控制，district.props.onChange為undefined時才會變化
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
        wrapperClassName: classNames(scss.countyWrapper, county.wrapperClassName),
        props: {
          placeholder: '選擇縣市',
          options: countryOptions,
          // 如果county.props裡面有valeu或onChange,那麼這個value或onChange會被蓋掉
          value: county_l, // 被蓋掉就是由外層控制
          onChange: (e) => {
            setCounty_l(e); // 被蓋掉就是由外層控制
          },
          ...county.props,
        },
        // wrapperStyle: { width: '90px' },
      },
    },
    {
      type: 'select',
      itemProps: {
        ...district,
        wrapperClassName: classNames(scss.districtWrapper, district.wrapperClassName),
        props: {
          placeholder: '選擇地區',
          options: districtOptions,
          // 如果county.props裡面有valeu或onChange,那麼這個value或onChange會被蓋掉
          value: district_l, // 被蓋掉就是由外層控制
          onChange: (e) => {
            setDistrict_l(e); // 被蓋掉就是由外層控制
          },
          ...district.props,
        },
        // wrapperStyle: { width: '90px' },
      },
    },
    {
      type: 'textarea',
      itemProps: {
        ...address,
        wrapperClassName: classNames(scss.addressWrapper, address.wrapperClassName),
        props: {
          placeholder: '請輸入剩餘地址',
          ...address.props,
        },
        // wrapperStyle: { width: 'auto', flex: 'auto' },
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
