import { useState, useEffect, useMemo, useCallback } from 'react';

import { TcustomerDto } from 'js/api/dtoTypes';

import { SearchModal_customer } from 'components/composition/searchModal/useSearchModal/useSearchModal_customer';

// =====================================================================

interface Tstate_profile {
  name: string;
  customer: TcustomerDto | null;
  contactPerson: string;
  contactNumber: string;
  fax: string;
  county: string;
  district: string;
  address: string;

  quotationNumber: string;
  quotationPeriod: `${number}` | '';
  quotationDate: string;
  isLost: boolean;
}

type Tinstance_useProfile = ReturnType<typeof useProfile>;

// =====================================================================
const useProfile = (rawData: unknown | undefined) => {
  const defaultState = useDefault(rawData);

  const [state_profile, setState_Profile] = useState<Tstate_profile>(defaultState);

  const selectCustomer = () => {
    const { destroy } = SearchModal_customer.open2({
      limit: 1,
      onRowClick(customerDto) {
        const { contacts, fax } = customerDto;
        const contactPerson = contacts?.[0]?.name || '';

        setState_Profile((prev) => ({ ...prev, customer: customerDto, contactPerson, fax }));
        destroy();
      },
    });
  };

  const removeCustomer = () => {
    setState_Profile((prev) => ({ ...prev, customer: null }));
  };

  const editCounty = (county: string) => {
    setState_Profile((prev) => ({ ...prev, county, district: '' }));
  };

  const reset = () => {
    setState_Profile(defaultState);
  };

  useEffect(() => {
    reset();
  }, [defaultState]);

  return { reset, state_profile, setState_Profile, selectCustomer, removeCustomer, editCounty };
};

const useDefault = (rawData: unknown | undefined) => {
  return useCallback(() => {
    const emptyState: Tstate_profile = {
      name: '',
      customer: null,
      contactPerson: '',
      contactNumber: '',
      fax: '',
      county: '',
      district: '',
      address: '',

      quotationNumber: '',
      quotationPeriod: '',
      quotationDate: '',
      isLost: false,
    };

    if (!rawData) {
      return emptyState;
    }

    return emptyState;
  }, [rawData]);
};

// ===================================================================

export { useProfile };
export type { Tinstance_useProfile };
