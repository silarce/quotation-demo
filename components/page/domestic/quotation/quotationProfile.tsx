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

// ====================================================
import { TquotationContentDto, TcustomerDto } from 'js/api/dtoTypes';
import { TcustomerDto_TC } from 'js/api/api_customer';
// ====================================================

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

// -----------------------------------------------------------------------

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

  designatedBrand: string;
  siteManager: string;
  siteManagerNumber: string;
  requiredDoorType: string;
  requiredDoorQuantity: string;
  estimatedDiscount: string;
  scheduledProcurementOrBidDate: Moment | null;
  type: string;
};

type TcontrolItem = {
  value: string;
  onChange?: (v: string) => void;
  onClick?: () => void;
  disabled?: boolean;
};

type TcontrolItem_date = {
  value: Moment | null;
  onChange?: (m: Moment | null) => void;
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
  designUnit: {
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
    //

    designatedBrand: TcontrolItem;
    siteManager: TcontrolItem;
    siteManagerNumber: TcontrolItem;
    requiredDoorType: TcontrolItem;
    requiredDoorQuantity: TcontrolItem;
    estimatedDiscount: TcontrolItem;
    scheduledProcurementOrBidDate: TcontrolItem_date;
    type: TcontrolItem;
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

  const [showModal_designUnit, setShowModal_designUnit] = useState(false);
  const openModal_designUnit = () => (disabled ? '' : setShowModal_designUnit(true));

  // ----------------------------------------------------------------

  const { quotationNumber, quotationDate, customer, designUnit, itemList } = control;

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

    designatedBrand,
  } = itemList;

  // ----------------------------------------------------------------

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

  //
  const designUnitSelConfirm = (v: TcustomerDto_TC[]) => {
    designUnit.onChange?.(v[0]);
  };

  const cleardesignUnit = () => {
    if (disabled) {
      return;
    }

    designUnit.onClear?.();
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

          <div className={classNames(scss.clientName, disabled && scss.disabled)}>
            <div>
              <InputSel
                caption={'設計單位'}
                disabled={true}
                showBaseline="invisible"
                captionClassName={scss.input02}
                captionStyle={{ width: captionStyle.width }}
                // wrapperStyle={{ gap: wrapperStyle.gap }}
                wrapperStyle={{
                  width: designUnit.value ? undefined : '85px',
                  gap: wrapperStyle.gap,
                }}
                textareaProps={{
                  props: {
                    placeholder: undefined,
                    value: designUnit.value?.name ?? '',
                    className: 'overflow-hidden',
                    // style: { height: 30 },
                  },
                }}
              />
              {!designUnit.value && (
                <>
                  <MyButton_v2
                    //
                    px="px22"
                    py="py4"
                    className={scss.btnSelectCustomer}
                    onClick={openModal_designUnit}
                  >
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
              {designUnit.value && !disabled && <IconRemove02 onClick={cleardesignUnit} />}
            </div>
          </div>

          <div>
            <InputSel
              caption={'聯絡人'}
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  placeholder: '尚未選擇',
                  value: itemList['contactPerson'].value,
                  onChange: (e) => {
                    itemList['contactPerson'].onChange?.(e.target.value);
                  },
                },
              }}
            />

            <InputSel
              caption={'聯絡電話'}
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  placeholder: '尚未選擇',
                  value: itemList['contactNumber'].value,
                  onChange: (e) => {
                    itemList['contactNumber'].onChange?.(e.target.value);
                  },
                },
              }}
            />

            <InputSel
              caption={'傳真號碼'}
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  placeholder: '尚未選擇',
                  value: itemList['faxNumber'].value,
                  onChange: (e) => {
                    itemList['faxNumber'].onChange?.(e.target.value);
                  },
                },
              }}
            />

            <InputSel
              caption={'工地主任'}
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  value: itemList.siteManager.value,
                  onChange: (e) => {
                    itemList.siteManager.onChange?.(e.target.value);
                  },
                },
              }}
            />
            <InputSel
              caption={'工地主任電話'}
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  value: itemList.siteManagerNumber.value,
                  onChange: (e) => {
                    itemList.siteManagerNumber.onChange?.(e.target.value);
                  },
                },
              }}
            />
          </div>
          <div>
            <InputSel
              caption={'需求門型'}
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  value: itemList.requiredDoorType.value,
                  onChange: (e) => {
                    itemList.requiredDoorType.onChange?.(e.target.value);
                  },
                },
              }}
            />
            <InputSel
              caption={'需求門型數量'}
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  type: 'number',
                  value: itemList.requiredDoorQuantity.value,
                  onChange: (e) => {
                    itemList.requiredDoorQuantity.onChange?.(e.target.value);
                  },
                },
              }}
            />
            <InputSel
              caption={'預估折數'}
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  type: 'number',
                  value: itemList.estimatedDiscount.value,
                  onChange: (e) => {
                    itemList.estimatedDiscount.onChange?.(e.target.value);
                  },
                },
              }}
            />
            <InputSel
              caption={'類型'}
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  value: itemList.type.value,
                  onChange: (e) => {
                    itemList.type.onChange?.(e.target.value);
                  },
                },
              }}
            />
            <InputSel
              caption={'預定採購日/投標日'}
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...inputSelProps}
              captionStyle={{
                ...inputSelProps.captionStyle,
                width: '160px',
              }}
              datePickerProps={{
                props: {
                  value: itemList.scheduledProcurementOrBidDate.value,
                  onChange: (date_m) => {
                    itemList.scheduledProcurementOrBidDate.onChange?.(date_m);
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

        <InputSel
          caption="追蹤狀態"
          captionClassName={scss.input02}
          showBaseline="auto"
          disabled={trackProgress.disabled !== undefined ? trackProgress.disabled : disabled}
          {...inputSelProps}
          textareaProps={{
            allowNewLineByUser: true,
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
          textareaProps={{
            allowNewLineByUser: true,
            props: {
              value: projectProgress.value,
              onChange: (e) => {
                projectProgress.onChange?.(e.target.value);
              },
              onClick: projectProgress.onClick,
            },
          }}
        />

        <InputSel
          caption="指定廠牌"
          captionClassName={scss.input02}
          showBaseline="auto"
          disabled={projectProgress.disabled !== undefined ? projectProgress.disabled : disabled}
          {...inputSelProps}
          textareaProps={{
            allowNewLineByUser: true,
            props: {
              value: designatedBrand.value,
              onChange: (e) => {
                designatedBrand.onChange?.(e.target.value);
              },
            },
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

      <CustomerSelector
        label="請選擇設計單位"
        selLimit={1}
        showModal={showModal_designUnit}
        onConfirm={designUnitSelConfirm}
        onCancel={() => setShowModal_designUnit(false)}
      />
    </div>
  );
}

// region HOOK

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

  designatedBrand: '',
  siteManager: '',
  siteManagerNumber: '',
  requiredDoorType: '',
  requiredDoorQuantity: '',
  estimatedDiscount: '',
  scheduledProcurementOrBidDate: null,
  type: '',
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
  const [state_designUnit, setState_designUnit] = useState<TcustomerDto | undefined | null>();

  const changeProfile = (
    key: keyof Omit<Tstate_profile, 'isLost' | 'scheduledProcurementOrBidDate'>,
    value: string | boolean
  ) => {
    setState_profile((state) => {
      return {
        ...state,
        [key]: value,
      };
    });
  };

  const originContent = useMemo(() => quotationContent, [quotationContent]);

  const control_profile = useMemo(() => {
    const quotationDate = quotationContent?.quotationDate
      ? moment(quotationContent.quotationDate).format('YYYY-MM-DD')
      : '';

    const control_profile: Tcontrol = {
      quotationNumber: originContent?.quotationNumber ?? '',
      quotationDate: quotationDate,
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
      designUnit: {
        value: state_designUnit,
        onChange: (customer) => setState_designUnit(customer),
        onClear: () => setState_designUnit(null),
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

        designatedBrand: {
          value: state_profile.designatedBrand,
          onChange: (v) => {
            changeProfile('designatedBrand', v);
          },
        },
        siteManager: {
          value: state_profile.siteManager,
          onChange: (v) => {
            changeProfile('siteManager', v);
          },
        },
        siteManagerNumber: {
          value: state_profile.siteManagerNumber,
          onChange: (v) => {
            changeProfile('siteManagerNumber', v);
          },
        },
        requiredDoorType: {
          value: state_profile.requiredDoorType,
          onChange: (v) => {
            changeProfile('requiredDoorType', v);
          },
        },
        requiredDoorQuantity: {
          value: state_profile.requiredDoorQuantity,
          onChange: (v) => {
            changeProfile('requiredDoorQuantity', v);
          },
        },
        estimatedDiscount: {
          value: state_profile.estimatedDiscount,
          onChange: (v) => {
            changeProfile('estimatedDiscount', v);
          },
        },
        type: {
          value: state_profile.type,
          onChange: (v) => {
            changeProfile('type', v);
          },
        },
        scheduledProcurementOrBidDate: {
          value: state_profile.scheduledProcurementOrBidDate,
          onChange: (v) => {
            setState_profile((state) => ({ ...state, scheduledProcurementOrBidDate: v }));
          },
        },
      },
    };

    return control_profile;
  }, [originContent?.quotationNumber, state_customer, state_designUnit, state_profile]); // memo

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

        designatedBrand: originContent?.designatedBrand ?? '',
        siteManager: originContent?.siteManager ?? '',
        siteManagerNumber: originContent?.siteManagerNumber ?? '',
        requiredDoorType: originContent?.requiredDoorType ?? '',
        requiredDoorQuantity: String(originContent?.requiredDoorQuantity ?? ''),
        estimatedDiscount: originContent?.estimatedDiscount ?? '',
        scheduledProcurementOrBidDate: originContent?.scheduledProcurementOrBidDate
          ? moment(originContent?.scheduledProcurementOrBidDate)
          : null,
        type: originContent?.type ?? '',
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

      designatedBrand: originContent?.designatedBrand ?? '',
      siteManager: originContent?.siteManager ?? '',
      siteManagerNumber: originContent?.siteManagerNumber ?? '',
      requiredDoorType: originContent?.requiredDoorType ?? '',
      requiredDoorQuantity: String(originContent?.requiredDoorQuantity ?? ''),
      estimatedDiscount: originContent?.estimatedDiscount ?? '',
      scheduledProcurementOrBidDate: originContent?.scheduledProcurementOrBidDate
        ? moment(originContent?.scheduledProcurementOrBidDate)
        : null,
      type: originContent?.type ?? '',
    });
  }, [originContent]);

  //
  return {
    control_profile,
    state_profile,
    state_customer,
    state_designUnit,
  };

  //
};

export { useProfile };
export type { Tstate_profile };
