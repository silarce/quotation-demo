import { useState, useEffect, useMemo, Fragment } from 'react';
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

      <div className={scss.main}>
        <div className={scss.tableContainer}>
          <div className={scss.tablewrapper}>
            <div className={scss.top}>
              {/*  */}
              <div>
                <span>本期請款金額：{'63,160'}</span>
              </div>
            </div>
            {/*  */}
            <div className={classNames(scss.row, scss.thead)}>
              <Left />
              <Center dataArr={[undefined, undefined, undefined, undefined]} />
              <Right />
            </div>
            <div className={scss.row}>
              <Left
                data={{
                  projectNumber: 'foooo',
                  itemName: 'foooo',
                  size: 'foooo',
                  quantity: 'foooo',
                  unitPrice: 'foooo',
                  totalPrice: 'foooo',
                }}
              />
              <Center dataArr={[foooooooo, foooooooo, foooooooo, foooooooo]} />
              <Right
                data={{
                  exchangedQuantity: 'foo',
                  exchangedPrice: 'foo',
                  notes: 'foo',
                }}
              />
            </div>

            {/*  */}
          </div>
        </div>
      </div>
    </SubLayer>
  );
}

const Left = ({
  data = {
    projectNumber: '追加追減',
    itemName: '項目',
    size: '尺寸 (cm)',
    quantity: '數量',
    unitPrice: '合約單價',
    totalPrice: '合約金額',
  },
}: {
  data?: {
    projectNumber?: string;
    itemName?: string;
    size?: string;
    quantity?: string;
    unitPrice?: string;
    totalPrice?: string;
  };
}) => {
  return (
    <>
      <div className={'w-[115px]'}>
        <span>{data.projectNumber}</span>
      </div>
      <div className={'w-[80px]'}>
        <span>{data.itemName}</span>
      </div>
      <div className={'w-[110px]'}>
        <span>{data.size}</span>
      </div>
      <div className={'w-[50px]'}>
        <span>{data.quantity}</span>
      </div>
      <div className={'w-[90px]'}>
        <span>{data.unitPrice}</span>
      </div>
      <div className={'w-[90px]'}>
        <span>{data.totalPrice}</span>
      </div>
    </>
  );
};

const Right = ({
  data = {
    exchangedQuantity: '變更後數量',
    exchangedPrice: '變更後金額',
    notes: '備註',
  },
}: {
  data?: {
    exchangedQuantity: string;
    exchangedPrice: string;
    notes: string;
  };
}) => {
  return (
    <>
      <div className={classNames('w-[80px]', scss.rightCell)}>
        <span>{data.exchangedQuantity}</span>
      </div>
      <div className={classNames('w-[110px]', scss.rightCell)}>
        <span>{data.exchangedPrice}</span>
      </div>
      <div className={classNames('w-[86px]', scss.rightCell)}>
        <span>{data.notes}</span>
      </div>
    </>
  );
};

const Center = ({
  dataArr,
}: {
  dataArr: (
    | {
        quantity: string;
        price: string;
      }
    | undefined
  )[];
}) => {
  return (
    <>
      {dataArr.map((data, index) => {
        const quantity = data?.quantity ?? `數量(變更${index + 1})`;
        const price = data?.price ?? `金額(變更${index + 1})`;

        const isOdd = index % 2 === 0;

        return (
          <Fragment key={index}>
            <div className={classNames('w-[92px]', scss.centerCell, isOdd && scss.odd)}>
              <span>{quantity}</span>
            </div>
            <div className={classNames('w-[120px]', scss.centerCell, isOdd && scss.odd)}>
              <span>{price}</span>
            </div>
          </Fragment>
        );
      })}
    </>
  );
};

// ========================================================================

const foooooooo = {
  quantity: 'foo',
  price: 'foo',
};
