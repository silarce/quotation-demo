import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import moment from 'moment';

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

// ====================================================
import { TquotationContentDto, TcustomerDto } from 'js/api/dtoTypes';
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

// -----------------------------------------------------------------------

type TcontrolItem = {
  value: string;
  onChange?: (v: string) => void;
  onClick?: () => void;
  disabled?: boolean;
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

  isLost: {
    value: boolean;
    onChange?: (bool: boolean) => void;
    disabled?: boolean;
  };
};

export type { Tcontrol as Tcontrol_profile };

// =================================================================
export default function QuotationProfile({
  //
  disabled = false,
  control,
  editNotes,
}: {
  disabled: boolean;
  control: Tcontrol;
  editNotes?: string;
}) {
  // ----------------------------------------------------------------

  const [showModal, setShowModal] = useState(false);
  const openModal = () => (disabled ? '' : setShowModal(true));
  // ----------------------------------------------------------------

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

  const customerTypes = customer.value?.types.map((type) => customerTypesLookup[type.name]).join('/');
  const styleHaveState = customerTypes ? scss.haveState : '';

  // ----------------------------------------------------------------
  const customeSelConfirm = (v: TcustomerDto_TC[]) => {
    if (v.length === 0) {
      return;
    }

    customer.onChange?.(v[0]);
  };

  const clearClient = () => {
    if (disabled) {
      return;
    }

    customer.onClear?.();
  };

  // ----------------------------------------------------------------------
  return (
    <div className={scss.container}>
      <div className={scss.profile}>
        <div className={classNames(scss.topBox, 'truncate')}>
          <span className={classNames(scss.clientState, styleHaveState)}>
            客戶類別 : {customerTypes || '尚未選擇客戶'}
          </span>
          <span>報價單備註 :{editNotes}</span>
        </div>

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
          <div className={classNames(scss.clientName, disabled && scss.disabled)}>
            <div>
              <InputSel
                caption={'客戶名稱'}
                disabled={true}
                showBaseline="invisible"
                captionClassName={scss.input02}
                captionStyle={{ width: captionStyle.width }}
                wrapperStyle={{
                  width: customer.value ? undefined : '85px',
                  gap: wrapperStyle.gap,
                }}
                textareaProps={{
                  props: {
                    placeholder: undefined,
                    value: customer.value?.name ?? '',
                    className: 'overflow-hidden',
                    // style: { height: 30 },
                  },
                }}
              />
              {!customer.value && (
                <>
                  <MyButton_v2 px="px22" py="py4" className={scss.btnSelectCustomer} onClick={openModal}>
                    請選擇客戶
                  </MyButton_v2>
                  <MyButton_v2
                    px="px22"
                    py="py4"
                    className={scss.btnAddCustomer}
                    onClick={() => {
                      window.open('/domestic/customer/add?reDeirectorToEdit=true', '_blank');
                    }}
                  >
                    新增客戶
                  </MyButton_v2>
                </>
              )}
              {customer.value && !disabled && <IconRemove02 onClick={clearClient} />}
            </div>
          </div>

          {/* <div className={classNames(scss.clientName, disabled && scss.disabled)}>
            <div>
              <InputSel
                caption={'設計單位'}
                disabled={true}
                showBaseline="invisible"
                captionClassName={scss.input02}
                captionStyle={{ width: captionStyle.width }}
                // wrapperStyle={{ gap: wrapperStyle.gap }}
                wrapperStyle={{
                  width: customer.value ? undefined : '85px',
                  gap: wrapperStyle.gap,
                }}
                textareaProps={{
                  props: {
                    placeholder: undefined,
                    value: customer.value?.name ?? '',
                    className: 'overflow-hidden',
                    // style: { height: 30 },
                  },
                }}
              />
              {!customer.value && (
                <>
                  <MyButton_v2 px="px22" py="py4" className={scss.btnSelectCustomer} onClick={openModal}>
                    請選擇設計單位
                  </MyButton_v2>
                  <MyButton_v2
                    px="px22"
                    py="py4"
                    className={scss.btnAddCustomer}
                    onClick={() => {
                      window.open('/domestic/customer/add?reDeirectorToEdit=true', '_blank');
                    }}
                  >
                    新增設計單位
                  </MyButton_v2>
                </>
              )}
              {customer.value && !disabled && <IconRemove02 onClick={clearClient} />}
            </div>
          </div> */}

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
              disabled={trackProgress.disabled !== undefined ? trackProgress.disabled : disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  value: trackProgress.value,
                  onChange: (e) => {
                    trackProgress.onChange?.(e.target.value);
                  },
                  onClick: trackProgress.onClick,
                },
              }}
            />

            <InputSel
              caption="工地進度"
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={projectProgress.disabled !== undefined ? projectProgress.disabled : disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  value: projectProgress.value,
                  onChange: (e) => {
                    projectProgress.onChange?.(e.target.value);
                  },
                  onClick: projectProgress.onClick,
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
        <div>
          <InputSel
            // disabled={disabled}
            disabled={control.isLost.disabled ?? disabled}
            caption="失單"
            showBaseline="invisible"
            captionClassName={scss.caption}
            captionStyle={{ width: '72px' }}
            wrapperStyle={{ gap: wrapperStyle.gap }}
            checkBoxProps={{
              onChange: (arr) => {
                const isLost = arr.includes('isLost');
                control.isLost.onChange?.(isLost);
              },
              propsArr: [{ key: 'isLost', value: control.isLost.value }],
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

// region HOOK

type Tstate_profile = {
  validityPeriod: string;
  projectName: string;
  county: string;
  district: string;
  address: string;
  contactPerson: string;
  contactNumber: string;
  faxNumber: string;
  trackProgress: string;
  projectProgress: string;
  isLost: boolean;
};

const creEmptyProfile = (): Tstate_profile => ({
  validityPeriod: '',
  projectName: '',
  county: '',
  district: '',
  address: '',
  contactPerson: '',
  contactNumber: '',
  faxNumber: '',
  trackProgress: '',
  projectProgress: '',
  isLost: false,
});

const useProfile = ({
  quotationContent,
  disabled,
}: {
  quotationContent: TquotationContentDto | undefined;
  disabled?: boolean;
}) => {
  const [state_profile, setState_profile] = useState<Tstate_profile>(creEmptyProfile());
  const [state_customer, setState_customer] = useState<TcustomerDto | undefined | null>();

  const changeProfile = (key: keyof Omit<Tstate_profile, 'isLost'>, value: string | boolean) => {
    setState_profile((state) => {
      return {
        ...state,
        [key]: value,
      };
    });
  };

  const originContent = useMemo(() => quotationContent, [quotationContent]);

  const control_profile = useMemo(() => {
    const control_profile: Tcontrol = {
      quotationNumber: originContent?.quotationNumber ?? '',
      quotationDate: moment().format('YYYY-MM-DD'),
      customer: {
        value: state_customer,
        onChange: (customer) => {
          const customerPhoneNumber = customer.phone || '';
          const contact = customer.contacts?.[0];
          const name = contact?.name ?? '';
          const phone = contact?.phone || customerPhoneNumber || '';
          const fax = customer.fax || '';

          setState_customer(customer);
          changeProfile('contactPerson', `${name}`);
          changeProfile('contactNumber', phone);
          changeProfile('faxNumber', fax);
        },
        onClear: () => {
          setState_customer(null);
          changeProfile('contactPerson', '');
          changeProfile('contactNumber', '');
          changeProfile('faxNumber', '');
        },
      },

      isLost: {
        value: state_profile.isLost,
        onChange: (bool) => {
          setState_profile((state) => ({ ...state, isLost: bool }));
        },
      },

      itemList: {
        validityPeriod: {
          value: state_profile.validityPeriod,
          onChange: (v) => changeProfile('validityPeriod', v),
        },
        projectName: {
          value: state_profile.projectName,
          onChange: (v) => changeProfile('projectName', v),
        },
        county: {
          value: state_profile.county,
          onChange: (v) => {
            changeProfile('county', v);
            changeProfile('district', '');
          },
        },
        district: {
          value: state_profile.district,
          onChange: (v) => changeProfile('district', v),
        },
        address: {
          value: state_profile.address,
          onChange: (v) => changeProfile('address', v),
        },
        contactPerson: {
          value: state_profile.contactPerson,
          onChange: (v) => changeProfile('contactPerson', v),
        },
        contactNumber: {
          value: state_profile.contactNumber,
          onChange: (v) => changeProfile('contactNumber', v),
        },
        faxNumber: {
          value: state_profile.faxNumber,
          onChange: (v) => changeProfile('faxNumber', v),
        },
        trackProgress: {
          value: state_profile.trackProgress,

          onChange: (v) => {
            changeProfile('trackProgress', v);
          },

          // disabled: disabled,
        },
        projectProgress: {
          value: state_profile.projectProgress,

          onChange: (v) => {
            changeProfile('projectProgress', v);
          },

          // disabled: disabled,
        },
      },
    };

    return control_profile;
  }, [originContent?.quotationNumber, state_customer, state_profile]); // memo

  useEffect(() => {
    if (disabled) {
      setState_customer(originContent?.customer ?? null);

      setState_profile({
        validityPeriod: originContent?.validityPeriod ?? '',
        projectName: originContent?.projectName ?? '',
        county: originContent?.county ?? '',
        district: originContent?.district ?? '',
        address: originContent?.address ?? '',
        contactPerson: originContent?.contactPerson ?? '',
        contactNumber: originContent?.contactNumber ?? '',
        faxNumber: originContent?.faxNumber ?? '',
        trackProgress: originContent?.trackProgress ?? '',
        projectProgress: originContent?.projectProgress ?? '',
        isLost: originContent?.isLost ?? false,
      });
    }
  }, [originContent, disabled]);

  useEffect(() => {
    setState_customer(originContent?.customer ?? null);

    setState_profile({
      validityPeriod: originContent?.validityPeriod ?? '',
      projectName: originContent?.projectName ?? '',
      county: originContent?.county ?? '',
      district: originContent?.district ?? '',
      address: originContent?.address ?? '',
      contactPerson: originContent?.contactPerson ?? '',
      contactNumber: originContent?.contactNumber ?? '',
      faxNumber: originContent?.faxNumber ?? '',
      trackProgress: originContent?.trackProgress ?? '',
      projectProgress: originContent?.projectProgress ?? '',
      isLost: originContent?.isLost ?? false,
    });
  }, [originContent]);

  //
  return {
    control_profile,
    state_profile,
    state_customer,
  };

  //
};

export { useProfile };
export type { Tstate_profile };
