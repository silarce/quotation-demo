import { useState } from 'react';

// glogal gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import InputSelBar_address from 'components/global/gear/inputAndSel/inputSelBar_address/inputSelBar_address';
import CustomerSelector from 'components/global/gear/modal/customerSelector';

// icon
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from '../quotationProfile.module.scss';

import { Class_basicInfo, Class_legacyContract } from 'hooks/quotation/legacy/useLegacyContract';
import { Toption } from 'js/utils/options/countryAndDistrict';

// type
import { TcustomerDto, TpageMetaDto } from 'js/api/dtoTypes';

// config
import { customerTypesLookup } from 'config/lookupTable';

// ====================================================
const inputStyle = {
  captionWidth: '80px',
  gap: '24px',
  padding: '21px 0px 4px 0px',
  labelWidth: '80px',
};

// ====================================================
export default function QuotationProfile({
  classLegacyContract,
  classBasicInfo,
  disabled = false,
  isAppend,
  isAppending,
}: {
  classLegacyContract: Class_legacyContract;
  classBasicInfo: Class_basicInfo;
  disabled: boolean;
  isAppend?: boolean;
  isAppending?: boolean;
}) {
  // =============================================
  const { customer } = classLegacyContract;

  const {
    contractNumber,
    quoteValidity,
    quoteDate,
    projectName,
    customerName,
    contactPerson,
    contactNumber,
    faxNumber,
    trackingStatus,
    projectProgress,
    projectCity,
    projectDistrict,
    projectAddress,
  } = classBasicInfo;

  const customerTypes = customer?.types?.map((type) => customerTypesLookup[type.name])?.join('/') ?? '無類別';

  // ==============================================
  // 客戶資料
  const theClientData = [
    { key: 'contactPerson', label: '聯絡人', placeholder: undefined, value: contactPerson },
    { key: 'contactNumber', label: '聯絡電話', placeholder: undefined, value: contactNumber },
    { key: 'faxNumber', label: '傳真號碼', placeholder: undefined, value: faxNumber },
  ] as const;

  // ==============================================
  const clearClient = () => {
    if (disabled) {
      return;
    }

    classBasicInfo.customerName = '';
    classBasicInfo.contactPerson = '';
    classBasicInfo.contactNumber = '';
    classBasicInfo.faxNumber = '';
  };

  // ==============================================
  const styleHaveState = customerName ? scss.haveState : '';
  // ==============================================
  // 工程地點
  const selectInputList = {
    county: projectCity,
    onChangeCounty: (option: Toption | null) => {
      if (!option) {
        return;
      }

      classBasicInfo.projectCity = option.value;
      classBasicInfo.projectDistrict = '';
    },
    district: projectDistrict,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) {
        return;
      }

      classBasicInfo.projectDistrict = option.value;
    },
    address: projectAddress,
    onChangeAddress: (value: string) => (classBasicInfo.projectAddress = value),
  };

  // ==============================================
  // modal
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    if (disabled) {
      return;
    }

    setShowModal(true);
  };

  const onConfirmClient = (customerArr: TcustomerDto[]) => {
    const customer = customerArr[0];

    const contact = customer.contacts;
    const contactPerson = contact?.[0]?.name ?? '';
    const contactNumber = contact?.[0]?.phone ?? '';
    const theContactPerson = `${contactPerson}${contactNumber}`;

    classLegacyContract.customer = customer;
    classBasicInfo.customerName = customer.name;
    classBasicInfo.contactPerson = theContactPerson;
    classBasicInfo.contactNumber = contactNumber;
    classBasicInfo.faxNumber = customer.fax;
  };

  // ==============================================
  let isContractNumberDisabled = disabled;

  if (isAppend) {
    if (isAppending) {
      isContractNumberDisabled = false;
    } else {
      isContractNumberDisabled = true;
    }
  }

  // ==============================================

  return (
    <div className={scss.container}>
      <div className={scss.profile}>
        <span className={`${scss.clientState}  ${styleHaveState}`}>類別 : {customerTypes || '尚未選擇客戶'}</span>
        <InputSel
          isMust={true}
          isMustPreStyle="minimal"
          label="工程名稱"
          disabled={disabled}
          {...{ ...inputStyle }}
          inputProps={{
            value: projectName,
            onChange: (v) => {
              classBasicInfo.projectName = v;
            },
          }}
        />
        {/*  */}
        <div className={scss.form02}>
          <div className={`${scss.clientName} ${disabled ? scss.disabled : ''}`}>
            <div>
              <InputSel
                isMust={true}
                isMustPreStyle="minimal"
                label={'客戶名稱'}
                placeholder={''}
                disabled={true}
                showBaseline="invisible"
                captionClassName={scss.input02}
                captionWidth={inputStyle.captionWidth}
                gap={inputStyle.gap}
                textareaProps={{
                  value: customerName ?? '',
                  onChange: () => {},
                  props: {
                    className: 'overflow-hidden',
                  },
                }}
              />
              {!customerName && <button onClick={openModal}>請選擇客戶</button>}
              {customerName && !disabled && <IconRemove02 onClick={clearClient} />}
            </div>
          </div>

          <div>
            {/* 客戶名稱，聯絡人，連絡電話，傳真號碼 */}
            {theClientData.map((item, index) => {
              const { key, label, value, placeholder } = item;

              return (
                <InputSel
                  key={index}
                  label={label}
                  placeholder={placeholder}
                  captionClassName={scss.input02}
                  // disabled={true}
                  disabled={disabled}
                  showBaseline="auto"
                  {...{ ...inputStyle }}
                  inputProps={{
                    value: value ?? '',
                    // onChange: () => {},
                    onChange: (v) => {
                      classBasicInfo[key] = v;
                    },
                  }}
                />
              );
            })}
          </div>
          <div>
            <InputSel
              label="追蹤狀態"
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...{ ...inputStyle }}
              inputProps={{
                value: trackingStatus ?? '',
                onChange: (v) => {
                  classBasicInfo.trackingStatus = v;
                },
              }}
            />

            <InputSel
              label="工地進度"
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...{ ...inputStyle }}
              inputProps={{
                value: projectProgress ?? '',
                onChange: (v) => {
                  classBasicInfo.projectProgress = v;
                },
              }}
            />
          </div>
        </div>{' '}
        {/* form02 */}
        <InputSelBar_address
          // isMust={true}
          label="工程地點"
          captionClassName={scss.input02}
          showBaseline="auto"
          {...{ ...inputStyle }}
          addressProps={selectInputList}
          disabled={disabled}
          isMust={true}
        />
      </div>

      <div className={scss.time_legacy}>
        <InputSel
          isMust={true}
          isMustPreStyle="minimal"
          label="合約編號"
          showBaseline="auto"
          // disabled={isAppend || disabled}
          // disabled={ isAppend ? false : disabled}
          disabled={isContractNumberDisabled}
          inputProps={{
            value: contractNumber,
            onChange: (v) => {
              classBasicInfo.contractNumber = v;
            },
          }}
        />
        {/* <InputSel
          label="舊合約時效"
          showBaseline="invisible"
          disabled={disabled}
          inputProps={{
            value: quoteValidity ?? "",
            onChange: (v) => { classBasicInfo.quoteValidity = v }
          }} /> */}
        {/* <InputSel
          label="合約日期"
          showBaseline="auto"
          disabled={disabled}
          isMust={true}
          datePickerProps={{
            value: (quoteDate as string) ?? '',
            onChange02(moment, dateString) {
              classBasicInfo.quoteDate = moment?.toISOString();
            },
          }}
        /> */}
      </div>

      {/* modal */}
      <CustomerSelector
        showModal={showModal}
        onConfirm={onConfirmClient}
        onCancel={() => setShowModal(false)}
        label="請選擇客戶"
        selLimit={1}
      />
    </div>
  );
}

// ===================================================
