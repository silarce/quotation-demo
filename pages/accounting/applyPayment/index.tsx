import { useState, useEffect, useMemo } from 'react';

import classNames from 'classnames';

import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Table_paymentApplication from 'components/page/accounting/paymentApplication/table_paymentApplication';
import { SearchModal_applyPayment } from 'components/composition/searchModal/useSearchModal/useSearchModal_applyPayment';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import ThreePartBar from 'components/global/container/bar/threePartBar';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// api
import {
  TapplyPayment_Dto,
  TcreateApplyPayment_data_Dto,
  TupdateApplyPayment_data_Dto,
  TcreateApplyPayment_Dto,
  TupdateApplyPayment_Dto,
  TapplyPaymentDetail_Dto,
  apiPostAddApplyPayment,
  useGetApplyPayment,
  useGetApplyPaymentById,
  useGetApplyPaymentDetail,
} from 'js/api/api_netCore/api_accountant';

// ===================================================================================
export default function ApplyPayment() {
  const [disabled, setDisabled] = useState(true);
  const [apply_paymnet_id, setApply_paymnet_id] = useState<string>();

  // --------------------------------------------------------------------------
  const { res: data_applyPayment, reqPatch, reqDeleteDetail, isFetching } = useGetApplyPaymentById(apply_paymnet_id);

  console.log(data_applyPayment);

  // --------------------------------------------------------------------------

  const onSearchClick = () => {
    const { unmount } = DragableModal.create({
      children: (
        <SearchModal_applyPayment
          onRowClick={(data) => {
            setApply_paymnet_id(data.id);
            unmount();
          }}
        />
      ),
    });
  };

  // --------------------------------------------------------------------------

  return (
    <SubLayer bodyPreStyle="style01">
      <PageHeader02 tag="支出單" />
      <div>
        <ThreePartBar>
          <>
            <SquareBtn content="search" onClick={onSearchClick} />
            <SquareBtn content="export" />
          </>
          <>
            {!disabled && <SquareBtn content="cancel" onClick={() => setDisabled(true)} />}
            {disabled && (
              <>
                <SquareBtn content="edit" onClick={() => setDisabled(false)} />
                <SquareBtn content="save" theme="danger" />
              </>
            )}
          </>
        </ThreePartBar>
      </div>
    </SubLayer>
  );
}
