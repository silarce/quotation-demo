import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';

// glogal gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import AddressBar, { TaddressProps } from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import CustomerSelector from 'components/global/gear/modal/customerSelector';

// icon
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

// config
import { customerTypesLookup } from 'js/api/api_customer';

// css
import scss from './quotationProfile.module.scss';

import { Toption } from 'js/utils/options/countryAndDistrict';
import { optionsCreator_quotationType } from 'js/utils/options/options';

// ====================================================
import { TquotationContentDto, TcustomerDto } from 'js/api/dtoTypes';
import { TcustomerDto_TC } from 'js/api/api_customer';

// =======================================================================

const wrapperStyle = {
  padding: '21px 0px 4px 0px',
  gap: '24px',
};
const captionStyle = {
  width: '120px',
};

const inputSelProps: TinputSelProps = {
  wrapperStyle,
  captionStyle,
};

// =======================================================================

interface Tprops_form {
  // 工程名稱
  projectName: {
    value: string;
    onChange: (v: string) => void;
  };
  // 報價時效
  validityPeriod: {
    value: string;
    onChange: (v: string) => void;
  };
  // 縣市
  county: {
    value: string;
    onChange: (v: string) => void;
  };
  // 行政區
  district: {
    value: string;
    onChange: (v: string) => void;
  };
  // 剩餘地址
  address: {
    value: string;
    onChange: (v: string) => void;
  };
  // 聯絡人
  contactPerson: {
    value: string;
    onChange: (v: string) => void;
  };
  // 聯絡人電話
  contactNumber: {
    value: string;
    onChange: (v: string) => void;
  };
  // 傳真
  faxNumber: {
    value: string;
    onChange: (v: string) => void;
  };
  // 追蹤狀態
  trackProgress: {
    value: string;
    onChange: (v: string) => void;
  };
  // 工地進度
  projectProgress: {
    value: string;
    onChange: (v: string) => void;
  };
  // 指定廠牌
  designatedBrand: {
    value: string;
    onChange: (v: string) => void;
  };
  // 工地主任
  siteManager: {
    value: string;
    onChange: (v: string) => void;
  };
  // 工地主任電話
  siteManagerNumber: {
    value: string;
    onChange: (v: string) => void;
  };
  // 類型
  type: {
    value: string;
    onChange: (v: string) => void;
  };
  // 失單
  isLost?: {
    value: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
  };

  customer: {
    customer: TcustomerDto | null | undefined;
    onChange: (v: TcustomerDto | undefined) => void;
  };

  designUnit: {
    designUnit: TcustomerDto | null | undefined;
    onChange: (v: TcustomerDto | undefined) => void;
  };
}

interface Tprops {
  form: Tprops_form;
  disabled: boolean;
  editNotes?: string;
  quotationDate?: string;
  quotationNumber: string | undefined;
}

// =======================================================================

// MARK: START

export default function QuotationProfile() {
  // MARK: RENDER
  return <div></div>;
}

// MARK: END
