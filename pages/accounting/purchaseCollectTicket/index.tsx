import { useState, useEffect, useMemo, useRef, memo } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';

// antd
import { Spin } from 'antd';

// components
import Detail from 'components/page/accounting/purchaseCollectTicket/detail';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import ThreePartBar from 'components/global/container/bar/threePartBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import Row, { Cell } from 'components/global/gear/table/row';

// api
import { useDepartments } from 'js/api/api_department';
import {
  TpurchaseCollectTicket_Dto,
  TcreatePurchaseCollectTicket_Dto,
  TupdatePurchaseCollectTicket_Dto,
  TpurchaseCollectTicketDetail_Dto,
  TcreatePurchaseCollectTicketDetail_Dto,
  TupdatePurchaseCollectTicketDetail_Dto,
  apiPostAddPurchaseCollectTicket,
  useGetPurchaseCollectTicket,
  useGetPurchaseCollectTicketById,
  useGetPurchaseCollectTicketDetailByTicketId,
  useGetUnpaidProdreceiptByInvoiceNumber,
} from 'js/api/api_netCore/api_accountant';

// ===========================================================================

// MARK: START

export default function PurchaseCollectTicket() {
  const [disabled, setDisabled] = useState(true);

  // MARK: RENDER

  // ------------------------------------------------------------
  return (
    <SubLayer bodyPreStyle="style01">
      <PageHeader02 tag="進貨收票單" />
      <div>
        <BtnBar
          disabled={disabled}
          // onSearchClick={handleSearch}
          onCancelClick={() => setDisabled(true)}
          onEditClick={() => setDisabled(false)}
          // onAddClick={handleAdd}
          // onConfirmClick={handleConfirm}
        />
        <Spin spinning={false} delay={300}>
          <Profile disabled={disabled} />
          <div>
            <div>
              <span>明細資料</span>
              <SquareBtn label="查詢進貨單" sharp="mini" />
            </div>
            <div>
              {/* <Detail_thead /> */}
              {/* <Detail /> */}
            </div>
          </div>
        </Spin>
      </div>
    </SubLayer>
  );
}
// MARK: END

// ===============================================================================
// ===============================================================================
// ===============================================================================

// MARK: BtnBar
const BtnBar = ({
  disabled,
  onSearchClick,
  onCancelClick,
  onEditClick,
  onAddClick,
  onConfirmClick,
}: {
  disabled: boolean;
  onSearchClick?: () => void;
  onCancelClick?: () => void;
  onEditClick?: () => void;
  onAddClick?: () => void;
  onConfirmClick?: () => void;
}) => {
  return (
    <ThreePartBar>
      <>
        <SquareBtn content="search" onClick={onSearchClick} />
        <SquareBtn content="export" />
      </>
      <>
        {!disabled && (
          <>
            <SquareBtn className="invisible" />
            <SquareBtn content="cancel" onClick={onCancelClick} />
            <SquareBtn content="save" theme="danger" onClick={onConfirmClick} />
          </>
        )}
        {disabled && (
          <>
            <SquareBtn content="add" onClick={onAddClick} />
            <SquareBtn content="edit" onClick={onEditClick} />
          </>
        )}
      </>
      <>
        <SquareBtn content="delete" theme="danger" />
      </>
    </ThreePartBar>
  );
};

// MARK: Profile
const Profile = ({ disabled }: { disabled: boolean }) => {
  const { optionArr_name, update } = useDepartments();

  useEffect(() => {
    update();
  }, []);

  return (
    <div className="global_grid01">
      <InputSel
        caption={'收票單號'}
        showBaseline="invisible"
        inputProps={{
          props: {
            defaultValue: '',
            placeholder: '儲存後自動產生',
            readOnly: true,
          },
        }}
      />
      <InputSel
        caption={'部門'}
        showBaseline="auto"
        disabled={disabled}
        selectProps={{
          props: {
            placeholder: '請選擇支出部門',
            options: optionArr_name,
            // value: state_applyPayment.applicant_department
            //   ? {
            //       value: state_applyPayment.applicant_department,
            //       label: state_applyPayment.applicant_department,
            //     }
            //   : null,
            // onChange: (option) => {
            //   setState_applyPayment((prev) => ({ ...prev, applicant_department: option?.value }));
            // },
          },
        }}
      />
      <InputSel caption={'經辦人員'} showBaseline="invisible" node={''} />
      <div />
      {/*  */}
      <InputSel
        caption={'開票方式'}
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {},
        }}
      />

      <InputSel
        caption={'扣稅類別'}
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {},
        }}
      />
      <InputSel
        caption={'立帳方式'}
        showBaseline="invisible"
        inputProps={{
          props: {},
        }}
      />
      <div />
      {/*  */}

      <InputSel
        caption={'發票號碼'}
        showBaseline="invisible"
        inputProps={{
          props: {
            placeholder: '請選擇發票',
            readOnly: true,
          },
        }}
        suffix={
          <SquareBtn
            // content="search"
            label="選擇發票"
            sharp="mini"
            onClick={() => {
              // handleSearchInvoice();
            }}
          />
        }
      />
      <div />
      <div />
      <div />
      {/*  */}
      <InputSel
        caption={'摘要說明'}
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {},
        }}
      />
    </div>
  );
};

// ===============================================================================
