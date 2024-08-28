// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

import { useTranslation } from 'react-i18next';

import type { TbankDto } from 'js/api/dtoTypes';

// =================================================================================

// MARK: START

export default function BankManagement(): React.ReactElement {
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02 tag="銀行管理" />

      <div>
        <div>fooo</div>
        <div>fooo</div>
        <div>fooo</div>
      </div>
    </SubLayer>
  );
}
// MARK: END

// =================================================================================
// =================================================================================
// =================================================================================
// =================================================================================
// =================================================================================

const fakeApi = () => {};
