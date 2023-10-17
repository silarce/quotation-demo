import classNames from 'classnames';

// antd
import { Checkbox } from 'antd';

// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import InputSelBar_address from 'components/global/gear/inputAndSel/inputSelBar_address/inputSelBar_address';

// icon
import { IconCheck01, IconCross01 } from 'public/image/icon/svgComponent/svgIcons';
import CircularProgress from '@mui/material/CircularProgress';

// option
import { Toption, optionsCreator_taxDeductionCategory } from 'js/utils/options/options';
const optionsTaxDeductionCategory = optionsCreator_taxDeductionCategory();

// css
import scss from '../customer.module.scss';

// type and config
import { customerTypesArr } from 'js/api/api_customer';
import { Class_customer } from 'hooks/customer/useCustomer';
import { TcustomerDto_TC, TpostCustomer } from 'js/api/api_customer';

export default function EditCustomerItem01({
  classCustomer,
  nameCheck,
}: {
  classCustomer: Class_customer;
  nameCheck: 'ok' | 'notOk' | 'loading';
}) {
  const { typeArr, addType, removeType } = classCustomer;

  // ======================================================
  const selectInputPropsAddress = {
    county: classCustomer.county,
    onChangeCounty: (option: Toption | null) => {
      if (!option) {
        return;
      }

      const value = option.value;
      classCustomer.county = value;
      classCustomer.district = '';
    },
    district: classCustomer.district,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) {
        return;
      }

      const value = option.value;
      classCustomer.district = value;
    },
    address: classCustomer.address,
    onChangeAddress: (value: string) => {
      classCustomer.address = value;
    },
    showDistrict: classCustomer.county === '國外' ? false : true,
  };

  const selectInputPropsInvoice = {
    county: classCustomer.invoiceCounty,
    onChangeCounty: (option: Toption | null) => {
      if (!option) {
        return;
      }

      const value = option.value;
      classCustomer.invoiceCounty = value;
      classCustomer.invoiceDistrict = '';
    },
    district: classCustomer.invoiceDistrict,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) {
        return;
      }

      const value = option.value;
      classCustomer.invoiceDistrict = value;
    },
    address: classCustomer.invoiceAddress,
    onChangeAddress: (value: string) => {
      classCustomer.invoiceAddress = value;
    },
    showDistrict: classCustomer.invoiceCounty === '國外' ? false : true,
  };

  // ======================================================
  return (
    <div className={scss.editCustomerItem01}>
      <p className={scss.subTitle}>員工個人資料</p>
      <div className={scss.form01}>
        {/* 上邊 */}
        <div>
          <div className={scss.customreName}>
            <InputSel
              className={scss.input02}
              label={'客戶全稱'}
              presetStyle="s01"
              captionWidth="100px"
              textareaProps={{
                value: classCustomer['name'],
                onChange: (v) => (classCustomer.name = v),
              }}
            />
            {nameCheck && (
              <span className={scss.checkTip}>
                {nameCheck === 'ok' ? (
                  <IconCheck01 className={scss.check} cursor="auto" />
                ) : nameCheck === 'notOk' ? (
                  <IconCross01 className={scss.cross} cursor="auto" />
                ) : (
                  <CircularProgress size={30} />
                )}
                {nameCheck === 'notOk' && (
                  <span className={scss.alertTip}>{classCustomer.name ? '此客戶全稱已被使用' : '請輸入客戶全稱'}</span>
                )}
              </span>
            )}
          </div>

          <InputSel
            className={scss.input02}
            label={'客戶簡稱'}
            presetStyle="s01"
            captionWidth="100px"
            inputProps={{
              value: classCustomer['nickname'],
              onChange: (v) => (classCustomer.nickname = v),
            }}
          />
        </div>
        {/* 左邊 */}
        <div>
          <InputSel
            className={scss.input02}
            label={'負責人'}
            presetStyle="s01"
            captionWidth="100px"
            inputProps={{
              value: classCustomer['principal'],
              onChange: (v) => (classCustomer.principal = v),
            }}
          />
          <InputSel
            className={scss.select02}
            label={'扣稅類別'}
            presetStyle="s01"
            captionWidth="100px"
            selectProps={{
              value: classCustomer['taxDeductionCategory'],
              options: optionsTaxDeductionCategory,
              onChange: (option: Toption | null) => {
                if (!option) {
                  return;
                }

                const { value } = option;
                classCustomer['taxDeductionCategory'] = value;
              },
            }}
          />
          <InputSel
            className={scss.input02}
            label={'統一編號'}
            presetStyle="s01"
            captionWidth="100px"
            inputProps={{
              value: classCustomer['taxId'],
              onChange: (v) => (classCustomer.taxId = v),
            }}
          />
        </div>
        {/* 垂直分隔線 */}
        <div className={scss.vr} />
        {/* 右邊 */}
        <div>
          {keyIndex01.map((key, index) => {
            const { label } = config01[key];
            const stateValue = classCustomer[key];

            const onChange = (value: string) => {
              classCustomer[key] = value;
            };

            return (
              <InputSel
                key={index}
                className={scss.input02}
                label={label}
                presetStyle="s01"
                captionWidth="100px"
                inputProps={{
                  value: stateValue,
                  onChange: onChange,
                }}
              />
            );
          })}
        </div>
        {/* 下面 */}
        <div>
          <InputSelBar_address
            className={scss.selectInput}
            label="公司地址"
            presetStyle="s01"
            captionWidth="100px"
            addressProps={selectInputPropsAddress}
            customContyOption={{
              optionArr: [{ value: '國外', label: '國外' }],
            }}
          />
          <InputSelBar_address
            className={scss.selectInput}
            label="發票地址"
            presetStyle="s01"
            captionWidth="100px"
            addressProps={selectInputPropsInvoice}
            customContyOption={{
              optionArr: [{ value: '國外', label: '國外' }],
            }}
          />
        </div>

        <div className={classNames(scss.rightSide)}>
          <div className={scss.checkboxGroup}>
            <div>
              <span>類別</span>
            </div>
            <div>
              {customerTypesArr.map((typeOption, index) => {
                const typeIndex = typeArr.findIndex((type) => type === typeOption.value);

                const onChange = (checked: boolean, v: TpostCustomer['types'][number]) => {
                  checked ? addType(v) : removeType(typeIndex);
                };

                return (
                  <Checkbox
                    key={index}
                    checked={typeIndex !== -1}
                    onChange={(e) => {
                      onChange(e.target.checked, typeOption.value);
                    }}
                  >
                    {typeOption.label}
                  </Checkbox>
                );
              })}
            </div>
          </div>
        </div>
      </div>{' '}
      {/* form01 */}
      {/* 右側 */}
    </div>
  );
}

// ==========================================================

type TkeyIndex01Key = keyof Pick<TcustomerDto_TC, 'phone' | 'fax'>;

const keyIndex01: TkeyIndex01Key[] = ['phone', 'fax'];

const config01: {
  [key in TkeyIndex01Key]: {
    label: string;
  };
} = {
  phone: {
    label: '公司電話',
  },
  fax: {
    label: '公司傳真',
  },
};
