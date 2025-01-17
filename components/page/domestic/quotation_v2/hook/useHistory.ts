import { useMemo } from 'react';
import moment from 'moment';
import _ from 'lodash';

import type { TquotationDto } from 'js/api/dtoTypes';

import { quotationStatusLookup } from 'config/lookupTable';

const useHistory = ({ quotationData }: { quotationData: TquotationDto | undefined | null }) => {
  return useMemo(() => {
    let contentArr = quotationData?.contents ?? [];

    if (contentArr) {
      contentArr = _.sortBy(contentArr, (item) => item.createdAt);
    }

    return contentArr.map((item, index, arr) => {
      const { status, quotationDate, createdAt } = item;
      const preStatus = arr[index - 1]?.status;

      return {
        state_from: quotationStatusLookup[preStatus] ?? '建立',
        state_to: quotationStatusLookup[status] ?? '',
        isoString: moment(createdAt).toISOString(),
      };
    });
  }, [quotationData]);
};

export { useHistory };
