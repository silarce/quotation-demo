import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList, TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

export default function OutsourcingPricingDetail() {
  return (
    <SubLayer>
      <PageHeader02 tag="外包計價單明細" />
      <div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </SubLayer>
  );
}
