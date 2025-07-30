import { useState, useEffect, useReducer } from 'react';
import Decimal from 'decimal.js';

import Btn from 'components/global/gear/button/btn_fong';
import DataEntry, { TdataEntrycontainerProps, DataEntry_fong, Input } from 'components/global/gear/dataEntry';
import Table_antd, { TableProps } from 'components/global/myAntd/table';

import { modal_empty } from 'components/global/gear/modal/fongModal';
import Selector_quotation from 'components/page/accounting/accountsReceivableInquiry/selector_quotation';

import Icon_note from 'public/image/icon/fong/note.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';
import Icon_check from 'public/image/icon/fong/check.svg';
import Icon_cancel from 'public/image/icon/fong/cancel.svg';

import SalesDetails from 'components/page/accounting/salesOrder/salesDetails';

// ============================================================================

// MARK:START

export default function SalesOrder() {
  // ---------------------------------------------------------------------------
  const handle_importContract = () => {
    modal_empty({
      width: 'fit-content',
      content: <Selector_quotation />,
    });
  };

  // ---------------------------------------------------------------------------

  // MARK: RENDER
  return (
    <div>
      <div className="pageTop flex justify-between items-center">
        <div className="text-xl font-semibold">銷貨單</div>
        <div className="flex gap-3">
          <Btn theme="import" onClick={handle_importContract}>
            合約匯入
          </Btn>
          <Btn theme="trash">清空</Btn>
          <Btn theme="save">儲存</Btn>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-fong">
        <DataEntry_fong caption="合約編號" className="col-span-2" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="案場名稱" className="col-span-2" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="客戶編號" className="col-span-2" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="客戶名稱" className="col-span-2" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="統一編號" className="col-span-2" isMust={true}>
          <Input />
        </DataEntry_fong>
        <div />
        <div />
        <DataEntry_fong caption="銷售金額" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="稅金" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="已請款總額" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="銷售總額" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="已收金額" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="扣款折讓" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="稅別" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="應稅外加" isMust={true}>
          <Input />
        </DataEntry_fong>
      </div>

      <SalesDetails className={'mt-10'} />
    </div>
  );
}

// MARK: END
