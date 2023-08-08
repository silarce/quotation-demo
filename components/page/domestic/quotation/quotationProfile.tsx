import { useState } from 'react';
import { format } from 'date-fns';

// components
import ClientSelector from './modal/clientSelector';
// glogal gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import AddressBar, { TaddressProps } from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';
// import InputSelBar_address from 'components/global/gear/inputAndSel/inputSelBar_address/inputSelBar_address';

// icon
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './quotationProfile.module.scss';

import { Class_basicInfo } from 'hooks/quotation/useQuotation';
import { Toption } from 'js/utils/options/countryAndDistrict';
import { Class_client } from 'fakeDatabase/fakeAPI/fakeClientApi';

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
export default function QuotationProfile({
  classBasicInfo,
  fakeClientList,
  disabled = false,
}: {
  classBasicInfo: Class_basicInfo;
  fakeClientList: ReturnType<Class_client['get']>;
  disabled: boolean;
}) {
  // ==============================================

  // 報價單資料
  const { basicInfo, clientProfile } = classBasicInfo.all;
  const {
    quotationId,
    tempQuotationAging,
    date,
    constructionName,
    constructionCounty,
    constructionDistrict,
    constructionAddress,
    trackingStatus,
    siteProgress,
  } = basicInfo;

  const { name: clientName, fax, clientState, contact } = clientProfile ?? {};

  const { setBasicInfoString } = classBasicInfo;

  // ----------------------------------
  const builtDate = format(new Date(date), 'yyy年MM月dd日');
  // ----------------------------------
  // ==============================================

  // ==============================================
  // 客戶資料
  const theClientData = [
    { label: '聯絡人', placeholder: '尚未選擇', value: contact?.[0].name },
    { label: '聯絡電話', placeholder: '尚未選擇', value: contact?.[0].phone },
    { label: '傳真號碼', placeholder: '尚未選擇', value: fax },
  ];

  // ==============================================
  const clearClient = () => {
    if (disabled) {
      return;
    }

    classBasicInfo.clientProfile = undefined;
  };

  // ==============================================
  const styleHaveState = clientState ? scss.haveState : '';
  // ==============================================
  // 工程地點
  const addressProps: TaddressProps = {
    county: {
      props: {
        // value: { value: constructionCounty, label: constructionCounty },
        value: constructionCounty ? { value: constructionCounty, label: constructionCounty } : null,
        onChange: (option: Toption | null) => {
          if (!option) {
            return;
          }

          setBasicInfoString('constructionCounty', option.value);
          setBasicInfoString('constructionDistrict', '');
        },
      },
    },
    district: {
      props: {
        value: constructionDistrict ? { value: constructionDistrict, label: constructionDistrict } : null,
        onChange: (option: Toption | null) => {
          if (!option) {
            return;
          }

          setBasicInfoString('constructionDistrict', option.value);
        },
      },
    },
    address: {
      props: {
        value: constructionAddress,
        onChange: (e) => {
          setBasicInfoString('constructionAddress', e.target.value);
        },
      },
    },
  };

  // ==============================================
  // modal
  const [showModal, setShowModal] = useState(false);
  const openModal = () => (disabled ? '' : setShowModal(true));

  const onConfirmClient = (client: ReturnType<Class_client['get']>[0]) => {
    classBasicInfo.clientProfile = client;
  };

  // ==============================================

  return (
    <div className={scss.container}>
      <div className={scss.profile}>
        <span className={`${scss.clientState}  ${styleHaveState}`}>狀態 : {clientState || '尚未選擇客戶'}</span>
        <InputSel
          caption="工程名稱"
          disabled={disabled}
          {...inputSelProps}
          textareaProps={{
            props: {
              value: constructionName,
              onChange: (e) => {
                setBasicInfoString('constructionName', e.target.value);
              },
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
                    value: clientName ?? '',
                  },
                }}
              />
              {!clientName && <button onClick={openModal}>請選擇客戶</button>}
              {clientName && !disabled && <IconRemove02 onClick={clearClient} />}
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
                  value: trackingStatus,
                  onChange: (e) => {
                    setBasicInfoString('trackingStatus', e.target.value);
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
                  value: siteProgress,
                  onChange: (e) => {
                    setBasicInfoString('siteProgress', e.target.value);
                  },
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
                value: quotationId,
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
                value: tempQuotationAging,
                onChange: (e) => {
                  setBasicInfoString('tempQuotationAging', e.target.value);
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
                placeholder: '無日期',
                value: builtDate,
              },
            }}
          />
        </div>
      </div>

      {/* modal */}
      <ClientSelector {...{ showModal, setShowModal }} fakeClientList={fakeClientList} onConfirm={onConfirmClient} />
    </div>
  );
}

// ===================================================
