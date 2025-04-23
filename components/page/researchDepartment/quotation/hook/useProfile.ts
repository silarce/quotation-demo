import { useState, useEffect, useMemo } from 'react';

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

// =====================================================================
const useProfile = () => {
  const defaultState = useDefault(undefined);

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

  useEffect(() => {
    setState_Profile(defaultState);
  }, [defaultState]);

  return { state_profile, setState_Profile, selectCustomer, removeCustomer, editCounty };
};

const useDefault = (data: unknown | undefined) => {
  const defaultState: Tstate_profile = useMemo(() => {
    if (!data) {
      return { ...emptyState } as typeof emptyState;
    }

    return { ...emptyState } as typeof emptyState;
  }, [data]);

  return defaultState;
};

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
// ===================================================================

type Treturn_useProfile = ReturnType<typeof useProfile>;

export { useProfile };
export type { Treturn_useProfile };
