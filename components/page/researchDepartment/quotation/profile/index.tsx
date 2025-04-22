import classNames from 'classnames';

// glogal gear
import DataEntry, {
  TdataEntrycontainerProps,
  TinputProps,
  TselectProps,
  //
  DataEntryContainer,
  // Select,
  // DatePicker,
  Checkbox,
} from 'components/global/gear/dataEntry';
import AddressBar, { TaddressProps } from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

// config
import { customerTypesLookup } from 'js/api/api_customer';

import { SearchModal_customer } from 'components/composition/searchModal/useSearchModal/useSearchModal_customer';

// css
import scss from './index.module.scss';

// icon
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

import { optionsCreator_county, districtOptionsSelector } from 'js/utils/options/countryAndDistrict';

// ===========================================================================

const options_county = optionsCreator_county();
const options_district = districtOptionsSelector('臺中市');

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

const Select = ({ className, ...props }: TselectProps) => {
  return <DataEntry.Select {...props} className={classNames(scss.select, className)} />;
};

// ===========================================================================

// MARK:START
export default function QuotationProfile() {
  //
  const handle_customerSelector = () => {
    const { destroy } = SearchModal_customer.open2({
      onRowClick(dto) {
        destroy();
      },
    });
  };
  //

  // ---------------------------------------------------------------------------
  // MARK: RENDER
  return (
    <div className={scss.profile}>
      <div className={scss.left}>
        <Container caption="名稱">
          <Input />
        </Container>
        <Container caption="客戶名稱" showBorder={false}>
          <div className={scss.customer}>
            <IconRemove02 className={scss.remove} />
            <SquareBtn sharp="mini" onClick={handle_customerSelector}>
              選擇客戶
            </SquareBtn>
            <span className={scss.customerName}>阿貓阿狗汪汪喵喵無限公司</span>
          </div>
        </Container>
        <Container caption="聯絡人" className="w-[300px]">
          <Input />
        </Container>
        <Container caption="聯絡電話" className="w-[300px]">
          <Input />
        </Container>
        <Container caption="傳真號碼" className="w-[300px]">
          <Input />
        </Container>
        <Container caption="地址" htmlFor="">
          <div className={scss.address}>
            <Select options={options_county} />
            <Select options={options_district} />
            <Input />
          </div>
        </Container>
      </div>
      {/*  */}
      {/*  */}
      <div className={scss.right}>
        <Container caption="報價編號" showBorder={false}>
          123456789
        </Container>
        <Container caption="報價編號" suffix="天內" showBorder={false}>
          999
        </Container>
        <Container caption="報價日期" showBorder={false}>
          999
        </Container>
        <Container caption="失單" showBorder={false}>
          <Checkbox />
        </Container>
      </div>
    </div>
  );
}

// MARK: END
