import React, { useState, useReducer, useEffect, useContext, useMemo, memo } from 'react';

import { TquotationDto, TquotationContentDto } from 'js/api/api_quotation';

import { Tstate_profile } from 'components/page/domestic/quotation_v2/type_quotation';

import { Tprops_profile } from '../QuotationProfile';

import { TcustomerDto } from 'js/api/dtoTypes';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// ==========================================================================

type Traw_profile = Pick<
  TquotationContentDto,
  | 'projectName'
  | 'validityPeriod'
  | 'county'
  | 'district'
  | 'address'
  | 'contactPerson'
  | 'contactNumber'
  | 'faxNumber'
  | 'trackProgress'
  | 'projectProgress'
  | 'designatedBrand'
  | 'siteManager'
  | 'siteManagerNumber'
  | 'type'
  | 'isLost'
  | 'customer'
  | 'designUnit'
>;

const useProfile = ({ disabled, profile }: { disabled: boolean; profile: Traw_profile | undefined }) => {
  const defaultState = useDefaultState(profile);

  const [state, setState] = useState<Tstate_profile>(defaultState);

  const restoreState = (backupState: Tstate_profile) => {
    setState(backupState);
  };

  useEffect(() => {
    setState(defaultState);
  }, [defaultState, disabled]);

  return {
    state_profile: state,
    setState_profile: setState,
    restoreState,
  };
}; // useQuotation

const useDefaultState = (raw_profile: Traw_profile | undefined) => {
  const defaultState = useMemo(() => {
    const {
      projectName = '',
      validityPeriod = '',
      county = '',
      district = '',
      address = '',
      contactPerson = '',
      contactNumber = '',
      faxNumber = '',
      trackProgress = '',
      projectProgress = '',
      designatedBrand = '',
      siteManager = '',
      siteManagerNumber = '',
      type = '',
      isLost = false,
      customer = null,
      designUnit = null,
    } = raw_profile || {};

    const defaultState: Tstate_profile = {
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
      designatedBrand: designatedBrand || '',
      siteManager: siteManager || '',
      siteManagerNumber: siteManagerNumber || '',
      type: type || '',
      isLost,
      customer,
      designUnit,
    };

    return defaultState;
  }, [raw_profile]);

  return defaultState;
};

// ===========================================================================

const createProps_profileForm = ({
  state_profile,
  setState_profile,
  reqPatchTrackProgressOrProjectProgress,
  allowEditClick,
}: {
  state_profile: Tstate_profile;
  setState_profile: React.Dispatch<React.SetStateAction<Tstate_profile>>;
  allowEditClick: boolean | undefined;
  //
  reqPatchTrackProgressOrProjectProgress: (props: {
    trackProgress?: string | null;
    projectProgress?: string | null;
  }) => Promise<
    | {
        trackProgress: string | null;
        projectProgress: string | null;
      }
    | undefined
    | null
  >;
  //
}) => {
  const props_form: Tprops_profile['form'] = {
    projectName: {
      value: state_profile.projectName,
      onChange: (v: string) => {
        setState_profile((prev) => ({ ...prev, projectName: v }));
      },
    },
    // 報價時效
    validityPeriod: {
      value: state_profile.validityPeriod,
      onChange: (v: string) => {
        setState_profile((prev) => ({ ...prev, validityPeriod: v }));
      },
    },
    // 縣市
    county: {
      value: state_profile.county,
      onChange: (v: string) => {
        setState_profile((prev) => ({ ...prev, county: v, district: '', address: '' }));
      },
    },
    // 行政區
    district: {
      value: state_profile.district,
      onChange: (v: string) => setState_profile((prev) => ({ ...prev, district: v, address: '' })),
    },
    // 剩餘地址
    address: {
      value: state_profile.address,
      onChange: (v: string) => setState_profile((prev) => ({ ...prev, address: v })),
    },
    // 聯絡人
    contactPerson: {
      value: state_profile.contactPerson,
      onChange: (v: string) => setState_profile((prev) => ({ ...prev, contactPerson: v })),
    },
    // 聯絡人電話
    contactNumber: {
      value: state_profile.contactNumber,
      onChange: (v: string) => setState_profile((prev) => ({ ...prev, contactNumber: v })),
    },
    // 傳真
    faxNumber: {
      value: state_profile.faxNumber,
      onChange: (v: string) => setState_profile((prev) => ({ ...prev, faxNumber: v })),
    },
    // 追蹤狀態
    trackProgress: {
      value: state_profile.trackProgress,
      onChange: (v: string) => setState_profile((prev) => ({ ...prev, trackProgress: v })),
      onEditClick: !allowEditClick
        ? null
        : async () => {
            const { destroy } = myAlert.input({
              title: '更新追蹤狀態',
              props_input: {
                isTextArea: true,
              },
              width: 1000,
              onConfirm: async (v) => {
                const res = await reqPatchTrackProgressOrProjectProgress({ trackProgress: v });

                if (res) {
                  setState_profile((prev) => ({ ...prev, trackProgress: res.trackProgress || '' }));
                }

                destroy();
              },
            });
          },
    },
    // 工地進度
    projectProgress: {
      value: state_profile.projectProgress,
      onChange: (v: string) => setState_profile((prev) => ({ ...prev, projectProgress: v })),
      onEditClick: !allowEditClick
        ? null
        : async () => {
            const { destroy } = myAlert.input({
              title: '更新工地進度',
              props_input: {
                isTextArea: true,
              },
              width: 1000,
              onConfirm: async (v) => {
                const res = await reqPatchTrackProgressOrProjectProgress({ projectProgress: v });

                if (res) {
                  setState_profile((prev) => ({ ...prev, projectProgress: res.projectProgress || '' }));
                }

                destroy();
              },
            });
          },
    },
    // 指定廠牌
    designatedBrand: {
      value: state_profile.designatedBrand,
      onChange: (v: string) => setState_profile((prev) => ({ ...prev, designatedBrand: v })),
    },
    // 工地主任
    siteManager: {
      value: state_profile.siteManager,
      onChange: (v: string) => setState_profile((prev) => ({ ...prev, siteManager: v })),
    },
    // 工地主任電話
    siteManagerNumber: {
      value: state_profile.siteManagerNumber,
      onChange: (v: string) => setState_profile((prev) => ({ ...prev, siteManagerNumber: v })),
    },
    // 類型
    type: {
      value: state_profile.type,
      onChange: (v: string) => setState_profile((prev) => ({ ...prev, type: v })),
    },
    // 失單
    isLost: {
      value: state_profile.isLost,
      onChange: (v: boolean) => setState_profile((prev) => ({ ...prev, isLost: v })),
    },

    customer: {
      value: state_profile.customer,
      onChange: (customer: TcustomerDto | undefined | null = null) => {
        setState_profile((prev) => {
          const copy = { ...prev };

          const customerPhoneNumber = customer?.phone || '';
          const contact = customer?.contacts?.[0];
          const name = contact?.name ?? '';
          const phone = contact?.phone || customerPhoneNumber || '';
          const fax = customer?.fax || '';

          return {
            ...copy,
            customer,
            contactPerson: name,
            contactNumber: phone,
            faxNumber: fax,
          };
        });
      },
    },

    designUnit: {
      value: state_profile.designUnit,
      onChange: (v: TcustomerDto | undefined | null = null) => setState_profile((prev) => ({ ...prev, designUnit: v })),
    },
  };

  return props_form;
};

// ===========================================================================
export { useProfile, createProps_profileForm };

export type { Traw_profile, Tstate_profile };
