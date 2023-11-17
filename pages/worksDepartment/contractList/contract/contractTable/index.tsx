import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  TupdateEngineeringContactDto,
  useGetEngineeringContact,
  apiPatchEngineeringContact,
  apiPostWorkSheet,
} from 'js/api/api_engineering';
import { TquotationProductDto, useGetContract_id_noItems } from 'js/api/api_quotation';
import { TaccountantDto } from 'js/api/api_accountant';
import { TaccountsReceivableDeductionDto } from 'js/api/dtoTypes';

// utils
import { convertDate_reduce1911, getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// css
import scss from './index.module.scss';

export default function ContracTable() {
  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };

  // -------------------------------------------------------------
  const { data: contract, update: update_contract } = useGetContract_id_noItems(contractId);
  const engineeringContactId = contract?.engineeringContactId;

  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  useEffect(() => {
    (async () => {
      if (contract) {
        return;
      }

      try {
        await update_contract();
      } catch (error) {
        myAlert.err({ title: '取得合約資料失敗' });
      }
    })();

    (async () => {
      try {
        await update_engineeringContact();
      } catch (error) {
        myAlert.err({ title: '取得工程聯絡單失敗', content: '請確認該合約是否已產生工程聯絡單' });
      }
    })();
  }, [contractId, engineeringContactId]);

  // -------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader
        //  panelList={panelList}
        contractNumber={engineeringContact?.contractNumber ?? ''}
      />

      <div></div>
    </SubLayer>
  );
}
