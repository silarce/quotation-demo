import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import classNames from 'classnames';

// glogal gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import AddressBar, { TaddressProps } from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';

import CustomerSelector from 'components/global/gear/modal/customerSelector';

// icon
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './quotationProfile.module.scss';

import { Toption } from 'js/utils/options/countryAndDistrict';

// ====================================================
import { TcustomerDto } from 'js/api/dtoTypes';
import { useCustomersById, TcustomerDto_TC } from 'js/api/api_customer';
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
type TquotationProfile = {
  id: string;
  quotationNumber: string;
  quotationDate: string; // 報價日期
  validityPeriod: string; // 報價時效
  projectName: string; // 工程名稱
  county: string; // 縣市
  district: string; // 區
  contactPerson: string; //  聯絡人
  contactNumber: string; //  聯絡電話
  customer: TcustomerDto;
};

type TformBody = {
  validityPeriod: string;
  customerId?: string;
  projectName: string;
  county: string;
  district: string;
  contactPerson: string;
  contactNumber: string;
  // api還沒上的資料
  address?: string; // 剩餘地址
  trackingStatus?: string; // 追蹤狀態
  siteProgress?: string; // 工地進度
};

type TprofileReturnBody = Omit<TformBody, 'address' | 'trackingStatus' | 'siteProgress'>;
export type { TprofileReturnBody };

// =================================================================
export default function QuotationProfile({
  profile,
  disabled = false,
  onProfileChange,
}: {
  profile: TquotationProfile | undefined;
  disabled: boolean;
  onProfileChange?: (v: TprofileReturnBody) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => (disabled ? '' : setShowModal(true));
  // ----------------------------------------------------------------
  const { register, control, reset, watch, setValue } = useForm<TformBody>();

  useEffect(() => {
    // console.log(watch());
    onProfileChange?.(watch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch()]);

  // ----------------------------------------------------------------
  // 報價單資料
  const {
    id,
    quotationNumber,
    quotationDate,
    validityPeriod,
    projectName,
    county,
    district,
    contactPerson,
    contactNumber,
    customer,
  } = profile ?? {};
  // ----------------------------------------------------------------

  // 客戶資料
  const { data: data_customer, setData: setCustomer, update: update_cunstomer } = useCustomersById(customer?.id);
  // 取消編輯時重置用的
  const [customerOri, setCustomerOri] = useState<TcustomerDto_TC>();

  // 客戶名稱與與傳真號碼要從data_customer取得

  // ----------------------------------------------------------------

  useEffect(() => {
    (async () => {
      const res = await update_cunstomer();

      if (res) {
        setValue('customerId', res.id);

        if (!customerOri && profile?.id) {
          setCustomerOri(res);
        }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ----------------------------------------------------------------

  useEffect(() => {
    reset({
      validityPeriod,
      customerId: customer?.id,
      projectName,
      county,
      district,
      contactPerson,
      contactNumber,
      // api還沒上的資料
      address: '',
      trackingStatus: '',
      siteProgress: '',
    });
    setCustomer(customerOri);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, disabled]);

  // ----------------------------------------------------------------
  // 客戶資料
  const theClientData = [
    { label: '聯絡人', placeholder: '尚未選擇', value: watch('contactPerson') },
    { label: '聯絡電話', placeholder: '尚未選擇', value: watch('contactNumber') },
    { label: '傳真號碼', placeholder: '尚未選擇', value: data_customer?.fax },
  ];

  // 工程地點
  const addressProps: TaddressProps = {
    county: {
      props: {
        value: county ? { value: county, label: county } : null,
        onChange: (option: Toption | null) => {
          if (!option) {
            return;
          }

          setValue('county', option.value);
          setValue('district', '');
        },
      },
    },
    district: {
      props: {
        value: district ? { value: district, label: district } : null,
        onChange: (option: Toption | null) => {
          if (!option) {
            return;
          }

          setValue('district', option.value);
        },
      },
    },
    address: {
      props: {
        ...register('address'),
      },
    },
  };

  // ----------------------------------------------------------------
  const customerTypes = data_customer?.types.map((type) => type.name).join('/');
  const styleHaveState = customerTypes ? scss.haveState : '';

  // ----------------------------------------------------------------
  const customeSelConfirm = (v: TcustomerDto_TC[]) => {
    if (v.length === 0) {
      return;
    }

    setCustomer(v[0]);
    setValue('customerId', v[0].id);
    setValue('contactPerson', v[0].contacts[0].name);
    setValue('contactNumber', v[0].contacts[0].phone);
  };

  const clearClient = () => {
    if (disabled) {
      return;
    }

    setCustomer(undefined);
    setValue('customerId', undefined);
    setValue('contactPerson', '');
    setValue('contactNumber', '');
  };

  // ----------------------------------------------------------------------
  return (
    <div className={scss.container}>
      <div className={scss.profile}>
        <span className={classNames(scss.clientState, styleHaveState)}>狀態 : {customerTypes || '尚未選擇客戶'}</span>
        <InputSel
          caption="工程名稱"
          disabled={disabled}
          {...inputSelProps}
          textareaProps={{
            props: {
              ...register('projectName'),
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
                    value: data_customer?.name ?? '',
                  },
                }}
              />
              {!data_customer && <button onClick={openModal}>請選擇客戶</button>}
              {data_customer && !disabled && <IconRemove02 onClick={clearClient} />}
            </div>
          </div>

          <div>
            {/* 客戶名稱，聯絡人，連絡電話，傳真號碼 */}
            {theClientData.map((item, index) => {
              const { label, value, placeholder } = item;

              return (
                <InputSel
                  key={index}
                  caption={label}
                  captionClassName={scss.input02}
                  disabled={true}
                  showBaseline="invisible"
                  {...inputSelProps}
                  inputProps={{
                    props: {
                      placeholder: placeholder,
                      value: value ?? '',
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
                  ...register('trackingStatus'),
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
                  ...register('siteProgress'),
                },
              }}
            />
          </div>
        </div>{' '}
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
                ...register('validityPeriod'),
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
                placeholder: '無日期',
                value: quotationDate ?? '',
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

// ===================================================
