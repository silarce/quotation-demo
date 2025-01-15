import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';

// glogal gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import AddressBar, { TaddressProps } from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

// import CustomerSelector from 'components/global/gear/modal/customerSelector';

// icon
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

// config
import { customerTypesLookup } from 'js/api/api_customer';

// css
import scss from './QuotationProfile.module.scss';

import { Toption } from 'js/utils/options/countryAndDistrict';
import { optionsCreator_quotationType } from 'js/utils/options/options';

// icon
import { IconEdit } from 'public/image/icon/svgComponent/svgIcons';

// ====================================================
import { TquotationContentDto, TcustomerDto } from 'js/api/dtoTypes';
import { TcustomerDto_TC } from 'js/api/api_customer';

// import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import { SearchModal_customer } from 'components/composition/searchModal/useSearchModal/useSearchModal_customer';

// =======================================================================

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
    onEditClick?: null | (() => void);
  };
  // 工地進度
  projectProgress: {
    value: string;
    onChange: (v: string) => void;
    onEditClick?: null | (() => void);
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
  };

  customer: {
    value: TcustomerDto | null;
    onChange: (v: TcustomerDto | null) => void;
  };

  designUnit: {
    value: TcustomerDto | null;
    onChange: (v: TcustomerDto | null) => void;
  };
}

interface Tprops_profile {
  form: Tprops_form;
  disabled: boolean;
  quotationNumber: string | undefined;
  quotationDate?: string;
  editNotes?: string;
  additionRight?: React.ReactNode;
}

export type { Tprops_profile };

// =======================================================================

// MARK: START

export default function QuotationProfile({
  //
  form,
  disabled,
  quotationNumber,
  quotationDate,
  editNotes,
  additionRight,
}: Tprops_profile) {
  const {
    projectName,
    validityPeriod,
    county,
    district,
    address,
    contactPerson,
    contactNumber,
    faxNumber,
    trackProgress,
    projectProgress,
    designatedBrand,
    siteManager,
    siteManagerNumber,
    type,
    isLost,
    customer,
    designUnit,
  } = form;

  const customerTypes = customer.value?.types.map((type) => customerTypesLookup[type.name]).join('/');

  // ---------------------------------------------------------------------------------

  // region

  const handleSearchCustomer = () => {
    const { destroy } = myAlert.clear({
      content: (
        <SearchModal_customer
          onRowClick={(v) => {
            customer.onChange(v);
            destroy();
          }}
        />
      ),
    });
  };

  const handleSearchDesignUnit = () => {
    const { destroy } = myAlert.clear({
      content: (
        <SearchModal_customer
          onRowClick={(v) => {
            designUnit.onChange(v);
            destroy();
          }}
        />
      ),
    });
  };

  // ---------------------------------------------------------------------------------

  // region PROPS

  const addressProps: TaddressProps = {
    county: {
      props: {
        menuPortalTarget: undefined,
        isDisabled: disabled,
        value: county.value ? { value: county.value, label: county.value } : null,
        onChange: (option: Toption | null) => {
          county.onChange?.(option?.value ?? '');
        },
      },
    },
    district: {
      props: {
        menuPortalTarget: undefined,
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

  // ---------------------------------------------------------------------------------
  // MARK: RENDER
  return (
    <div className={scss.container}>
      {/*  */}
      <div className={scss.left}>
        <div className={classNames(scss.topBox, 'truncate')}>
          <span className={classNames(scss.clientState, customerTypes && scss.haveState)}>
            客戶類別 : {customerTypes || '尚未選擇客戶'}
          </span>
          {/* FIXME */}
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
              // className: 'overflow-hidden',
            },
          }}
        />
        <div className={scss.formLeft}>
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
                    // className: 'overflow-hidden',
                  },
                }}
              />
              {!customer.value && !disabled && (
                <>
                  <MyButton_v2 px="px22" py="py4" onClick={handleSearchCustomer}>
                    請選擇客戶
                  </MyButton_v2>
                  <MyButton_v2
                    px="px22"
                    py="py4"
                    onClick={() => {
                      window.open('/domestic/customer/add?reDeirectorToEdit=true', '_blank');
                    }}
                  >
                    新增客戶
                  </MyButton_v2>
                </>
              )}
              {customer.value && !disabled && (
                <IconRemove02
                  onClick={() => {
                    customer.onChange(null);
                  }}
                />
              )}
            </div>
          </div>
          {/*  */}
          <div className={classNames(scss.clientName, disabled && scss.disabled)}>
            <div>
              <InputSel
                caption={'設計單位'}
                disabled={true}
                showBaseline="invisible"
                captionClassName={scss.input02}
                captionStyle={{ width: captionStyle.width }}
                wrapperStyle={{
                  width: designUnit.value ? undefined : '85px',
                  gap: wrapperStyle.gap,
                }}
                textareaProps={{
                  props: {
                    placeholder: undefined,
                    value: designUnit.value?.name ?? '',
                    className: 'overflow-hidden',
                  },
                }}
              />
              {!designUnit.value && !disabled && (
                <>
                  <MyButton_v2
                    //
                    px="px22"
                    py="py4"
                    className={scss.btnSelectCustomer}
                    onClick={handleSearchDesignUnit}
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
              {designUnit.value && !disabled && <IconRemove02 onClick={() => designUnit.onChange(null)} />}
            </div>
          </div>
          {/*  */}
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
                  value: contactPerson.value,
                  onChange: (e) => {
                    contactPerson.onChange?.(e.target.value);
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
                  value: contactNumber.value,
                  onChange: (e) => {
                    contactNumber.onChange?.(e.target.value);
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
                  value: faxNumber.value,
                  onChange: (e) => {
                    faxNumber.onChange?.(e.target.value);
                  },
                },
              }}
            />
          </div>

          <div>
            <InputSel
              caption={'工地主任'}
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...inputSelProps}
              inputProps={{
                props: {
                  value: siteManager.value,
                  onChange: (e) => {
                    siteManager.onChange?.(e.target.value);
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
                  value: siteManagerNumber.value,
                  onChange: (e) => {
                    siteManagerNumber.onChange?.(e.target.value);
                  },
                },
              }}
            />
          </div>

          {/* formLeft close */}
        </div>
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
          caption={
            <span className="text-main">
              追蹤狀態
              {trackProgress.onEditClick && (
                <IconEdit className="inline-block align-bottom ml-1" onClick={trackProgress.onEditClick} />
              )}
            </span>
          }
          captionClassName={scss.input02}
          showBaseline="auto"
          // disabled={trackProgress.disabled !== undefined ? trackProgress.disabled : disabled}
          disabled={disabled}
          {...inputSelProps}
          textareaProps={{
            allowNewLineByUser: true,
            props: {
              placeholder: '請輸入追蹤狀態',
              value: trackProgress.value,
              onChange: (e) => {
                trackProgress.onChange?.(e.target.value);
              },
            },
          }}
        />

        <InputSel
          caption={
            <span className="text-main">
              工地進度
              {projectProgress.onEditClick && (
                <IconEdit className="inline-block align-bottom ml-1" onClick={projectProgress.onEditClick} />
              )}
            </span>
          }
          captionClassName={scss.input02}
          showBaseline="auto"
          // disabled={projectProgress.disabled !== undefined ? projectProgress.disabled : disabled}
          disabled={disabled}
          {...inputSelProps}
          textareaProps={{
            allowNewLineByUser: true,
            props: {
              placeholder: '請輸入工地進度',
              value: projectProgress.value,
              onChange: (e) => {
                projectProgress.onChange?.(e.target.value);
              },
              // onClick: projectProgress.onClick,
            },
          }}
        />

        <InputSel
          caption="指定廠牌"
          captionClassName={scss.input02}
          showBaseline="auto"
          // disabled={projectProgress.disabled !== undefined ? projectProgress.disabled : disabled}
          disabled={disabled}
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

      {/* MARK: right */}

      <div className={scss.right}>
        {additionRight}
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
            caption={'類型'}
            captionClassName={scss.caption}
            captionStyle={{ width: '72px' }}
            wrapperStyle={{ gap: wrapperStyle.gap }}
            showBaseline="auto"
            disabled={disabled}
            selectProps={{
              props: {
                menuPortalTarget: undefined,
                options: optionsCreator_quotationType(),
                value: { value: type.value, label: type.value },
                onChange: (option) => {
                  type.onChange?.(option?.value ?? '');
                },
              },
            }}
          />
        </div>
        <div>
          <InputSel
            disabled={disabled}
            // disabled={control.isLost.disabled ?? disabled}
            caption="失單"
            showBaseline="invisible"
            captionClassName={scss.caption}
            captionStyle={{ width: '72px' }}
            wrapperStyle={{ gap: wrapperStyle.gap }}
            checkBoxProps={{
              propsArr: [{ key: 'isLost', value: !!isLost?.value }],
              onChange: (arr) => {
                const v_isLost = arr.includes('isLost');
                isLost?.onChange?.(v_isLost);
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

// MARK: END
