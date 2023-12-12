import { useState, useMemo } from 'react';
import classNames from 'classnames';

// glogal gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import AddressBar, { TaddressProps } from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';

import CustomerSelector from 'components/global/gear/modal/customerSelector';

// icon
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

// config
import { customerTypesLookup } from 'js/api/api_customer';

// css
import scss from './quotationProfile.module.scss';

import { Toption } from 'js/utils/options/countryAndDistrict';

// ====================================================
import { TcustomerDto } from 'js/api/dtoTypes';
import { TcustomerDto_TC } from 'js/api/api_customer';
// ====================================================

const wrapperStyle = {
  padding: '21px 0px 4px 0px',
  gap: '24px',
};
const captionStyle = {
  width: '80px',
};

const inputSelProps: TinputSelProps = {
  wrapperStyle,
  captionStyle,
};

// ====================================================
// type TquotationProfile = {
//   id: string;
//   quotationNumber: string;
//   quotationDate: string; // 報價日期
//   validityPeriod: string; // 報價時效
//   projectName: string; // 工程名稱
//   county: string; // 縣市
//   district: string; // 區
//   address: string;
//   contactPerson: string; //  聯絡人
//   contactNumber: string; //  聯絡電話
//   faxNumber: string; // 傳真號碼
//   customer: TcustomerDto;
//   trackProgress: string;
//   projectProgress: string;
// };

// type TformBody = {
//   validityPeriod: string;
//   customerId?: string;
//   projectName: string;
//   county: string;
//   district: string;
//   address: string; // 剩餘地址
//   contactPerson: string;
//   contactNumber: string;
//   faxNumber: string;
//   trackProgress: string; // 追蹤狀態
//   projectProgress: string; // 工地進度
// };

// type TreturnBody = {
//   validityPeriod: string;
//   customer: TcustomerDto | undefined;
//   projectName: string;
//   county: string;
//   district: string;
//   contactPerson: string;
//   contactNumber: string;
//   faxNumber: string;
//   address?: string; // 剩餘地址

//   trackProgress?: string; // 追蹤狀態
//   projectProgress?: string; // 工地進度
// };

// -----------------------------------------------------------------------

type TcontrolItem = {
  value: string;
  onChange?: (v: string) => void;
};

type Tcontrol = {
  quotationNumber: string; // 報價編號
  quotationDate: string; // 報價日期
  // customer: TcustomerDto;
  customer: {
    value: TcustomerDto | undefined | null;
    onChange?: (v: TcustomerDto) => void;
    onClear?: () => void;
  };
  //
  itemList: {
    validityPeriod: TcontrolItem; // 報價時效
    projectName: TcontrolItem; // 工程名稱
    county: TcontrolItem; // 縣市
    district: TcontrolItem; // 區
    address: TcontrolItem;
    contactPerson: TcontrolItem; //  聯絡人
    contactNumber: TcontrolItem; //  聯絡電話
    faxNumber: TcontrolItem; // 傳真號碼
    trackProgress: TcontrolItem;
    projectProgress: TcontrolItem;
  };
};

export type {
  // TreturnBody,
  // TquotationProfile,
  Tcontrol as Tcontrol_profile,
};

// =================================================================
export default function QuotationProfile({
  // profile,
  disabled = false,
  // onProfileChange,
  control,
}: {
  // profile: TquotationProfile | undefined;
  disabled: boolean;
  // onProfileChange?: (v: Partial<TprofileReturnBody>) => void;
  // onProfileChange?: (v: Partial<TreturnBody>) => void;
  control: Tcontrol;
}) {
  // ----------------------------------------------------------------

  const [showModal, setShowModal] = useState(false);
  const openModal = () => (disabled ? '' : setShowModal(true));
  // ----------------------------------------------------------------
  // const { register, control, reset, watch, setValue } = useForm<TformBody>();
  // const watchState = useWatch({ control });

  // useEffect(() => {
  //   onProfileChange?.({ ...watchState, customer: data_customer });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [watchState]);

  // ----------------------------------------------------------------
  // 報價單資料
  // const {
  //   id,
  //   quotationNumber,
  //   quotationDate,
  //   validityPeriod,
  //   projectName,
  //   county,
  //   district,
  //   address,
  //   contactPerson,
  //   contactNumber,
  //   faxNumber,
  //   customer,
  //   trackProgress,
  //   projectProgress,
  // } = profile ?? {};

  const { quotationNumber, quotationDate, customer, itemList } = control;

  const {
    validityPeriod,
    projectName,
    county,
    district,
    address,
    contactPerson,
    contactNumber,
    faxNumber,
    trackProgress,
    projectProgress,
  } = itemList;

  // ----------------------------------------------------------------

  // 客戶資料
  // const { data: data_customer, setData: setCustomer, update: update_cunstomer } = useCustomersById(customer?.id);
  // 取消編輯時重置用的
  // const [customerOri, setCustomerOri] = useState<TcustomerDto_TC>();

  // 客戶名稱與與傳真號碼要從data_customer取得
  // 還有客戶types

  // ----------------------------------------------------------------

  // useEffect(() => {
  //   (async () => {
  //     const res = await update_cunstomer();

  //     if (res) {
  //       setValue('customerId', res.id);

  //       if (!customerOri && profile?.id) {
  //         setCustomerOri(res);
  //       }
  //     }
  //   })();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [id]);

  // ----------------------------------------------------------------

  // useEffect(() => {
  //   reset({
  //     validityPeriod,
  //     customerId: customer?.id,
  //     projectName,
  //     county,
  //     district,
  //     contactPerson,
  //     contactNumber,
  //     faxNumber,
  //     address,
  //     // api還沒上的資料
  //     trackProgress,
  //     projectProgress,
  //   });
  //   setCustomer(customerOri);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [profile, disabled]);

  // ----------------------------------------------------------------
  // 客戶資料
  const theClientData = [
    { key: 'contactPerson', label: '聯絡人', placeholder: '尚未選擇' },
    { key: 'contactNumber', label: '聯絡電話', placeholder: '尚未選擇' },
    { key: 'faxNumber', label: '傳真號碼', placeholder: '尚未選擇' },
  ] as const;

  // 工程地點

  const addressProps: TaddressProps = {
    county: {
      props: {
        isDisabled: disabled,
        value: county.value ? { value: county.value, label: county.value } : null,
        onChange: (option: Toption | null) => {
          county.onChange?.(option?.value ?? '');
          district.onChange?.('');
        },
      },
    },
    district: {
      props: {
        isDisabled: disabled,
        value: district.value ? { value: district.value, label: district.value } : null,
        onChange: (option: Toption | null) => {
          district.onChange?.(option?.value ?? '');
        },
      },
    },
    address: {
      props: {
        disabled,
        className: 'overflow-hidden',
        value: address.value,
        onChange: (e) => {
          address.onChange?.(e.target.value);
        },
      },
    },
  };

  // ----------------------------------------------------------------
  // const customerTypes = data_customer?.types.map((type) => type.name).join('/');
  const customerTypes = customer.value?.types.map((type) => customerTypesLookup[type.name]).join('/');
  const styleHaveState = customerTypes ? scss.haveState : '';

  // ----------------------------------------------------------------
  const customeSelConfirm = (v: TcustomerDto_TC[]) => {
    if (v.length === 0) {
      return;
    }

    customer.onChange?.(v[0]);

    // const contact = v[0].contacts[0];
    // const name = contact?.name ?? '';
    // const phone = contact?.phone ?? '';

    // const contactPerson = `${name}${phone}`;

    // setCustomer(v[0]);

    // setValue('customerId', v[0].id);
    // setValue('contactPerson', v[0].contacts[0]?.name ?? '');
    // setValue('contactPerson', contactPerson);
    // setValue('contactNumber', v[0].contacts[0]?.phone ?? '');
    // setValue('faxNumber', v[0].fax ?? '');

    // contactPerson.onChange(`${name}${phone}`);
    // contactNumber.onChange(phone);
    // faxNumber.onChange(v[0].fax ?? '');
  };

  const clearClient = () => {
    if (disabled) {
      return;
    }

    customer.onClear?.();

    // setCustomer(undefined);
    // setValue('customerId', undefined);

    // contactPerson.onChange('');

    // setValue('contactPerson', '');
    // setValue('contactNumber', '');
  };

  // ----------------------------------------------------------------------
  return (
    <div className={scss.container}>
      <div className={scss.profile}>
        <span className={classNames(scss.clientState, styleHaveState)}>
          客戶類別 : {customerTypes || '尚未選擇客戶'}
        </span>
        <InputSel
          caption="工程名稱"
          disabled={disabled}
          {...inputSelProps}
          textareaProps={{
            props: {
              value: projectName.value,
              onChange: (e) => {
                projectName.onChange?.(e.target.value);
              },
              className: 'overflow-hidden',
              // style: { height: '40px' },
            },
          }}
        />
        {/*  */}
        <div className={scss.form02}>
          <div className={`${scss.clientName} ${disabled ? scss.disabled : ''}`}>
            <div>
              <InputSel
                caption={'客戶名稱'}
                disabled={true}
                showBaseline="invisible"
                captionClassName={scss.input02}
                captionStyle={{ width: captionStyle.width }}
                wrapperStyle={{ gap: wrapperStyle.gap }}
                textareaProps={{
                  props: {
                    placeholder: undefined,
                    value: customer.value?.name ?? '',
                    className: 'overflow-hidden',
                    // style: { height: 30 },
                  },
                }}
              />
              {!customer.value && <button onClick={openModal}>請選擇客戶</button>}
              {customer.value && !disabled && <IconRemove02 onClick={clearClient} />}
            </div>
          </div>

          <div>
            {/* 聯絡人，連絡電話，傳真號碼 */}
            {theClientData.map((item, index) => {
              const { key, label, placeholder } = item;

              return (
                <InputSel
                  key={index}
                  caption={label}
                  captionClassName={scss.input02}
                  // disabled={true}
                  showBaseline="auto"
                  disabled={disabled}
                  {...inputSelProps}
                  inputProps={{
                    props: {
                      placeholder: placeholder,
                      value: itemList[key].value,
                      onChange: (e) => {
                        itemList[key].onChange?.(e.target.value);
                      },
                    },
                  }}
                />
              );
            })}
          </div>
          <div>
            <InputSel
              caption="追蹤狀態"
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  value: trackProgress.value,
                  onChange: (e) => {
                    trackProgress.onChange?.(e.target.value);
                  },
                },
              }}
            />

            <InputSel
              caption="工地進度"
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  value: projectProgress.value,
                  onChange: (e) => {
                    projectProgress.onChange?.(e.target.value);
                  },
                },
              }}
            />
          </div>
        </div>
        {/* form02 */}
        <AddressBar
          addressProps={addressProps}
          inputSelProps={{
            caption: '工程地點',
            disabled,
            captionClassName: scss.input02,
            showBaseline: 'auto',
            captionStyle,
            wrapperStyle: { padding: wrapperStyle.padding, gap: wrapperStyle.gap },
          }}
        />
      </div>

      <div className={scss.time}>
        <div>
          <InputSel
            disabled={true}
            caption="報價編號"
            showBaseline="invisible"
            captionClassName={scss.caption}
            wrapperStyle={{ gap: wrapperStyle.gap }}
            inputProps={{
              props: {
                value: quotationNumber ?? '',
                placeholder: '系統自動設定',
              },
            }}
          />
        </div>
        <div>
          <InputSel
            caption="報價時效"
            showBaseline="auto"
            disabled={disabled}
            suffix="天內"
            suffixClassName="text-[18px]"
            captionClassName={scss.caption}
            wrapperStyle={{ gap: wrapperStyle.gap }}
            inputProps={{
              props: {
                value: validityPeriod.value,
                onChange: (e) => {
                  validityPeriod.onChange?.(e.target.value);
                },
              },
            }}
          />
        </div>
        <div>
          <InputSel
            disabled={true}
            caption="報價日期"
            showBaseline="invisible"
            captionClassName={scss.caption}
            wrapperStyle={{ gap: wrapperStyle.gap }}
            inputProps={{
              props: {
                value: quotationDate ?? '',
                placeholder: '系統自動設定',
              },
            }}
          />
        </div>
      </div>

      {/* modal */}
      <CustomerSelector
        label="請選擇客戶"
        selLimit={1}
        showModal={showModal}
        onConfirm={customeSelConfirm}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}
