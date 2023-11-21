import { useState, useEffect, useMemo, Fragment } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { useGetEngineeringContact } from 'js/api/api_engineering';
import { TquotationProductDto, useGetContract_id_noItems } from 'js/api/api_quotation';

// css
import scss from './index.module.scss';

// ========================================================================

type TcenterItem = {
  quantity: string;
  price: string;
};
type Tcontrol_left = {
  projectNumber: string;
  itemName: string;
  size: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
};
type Tcontrol_center = TcenterItem[];
type Tcontrol_right = {
  exchangedQuantity: string;
  exchangedPrice: string;
  notes: string;
};

type Tcontrol_leftTotal = {
  contractSubTotal: string;
  tax: string;
  contractTotal: string;
};
type TcenterTotalItem = {
  doneSubTotal: string;
  tax: string;
  periodTotal: string;
};
type TcenterTotal = TcenterTotalItem[];
type TrightTotal = {
  cumulativeTotal: string;
  tax: string;
  doneTotal: string;
};

// ========================================================================
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

  const foo = useMemo(() => {
    if (!contract) {
      return {};
    }

    const subContractArr = _.sortBy(contract.subContracts, 'version');
    console.log(subContractArr);

    /**
     *  subContractArr.length-1 === 有多少次變更
     *
     */

    return {};
  }, [contract]);

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

            {/* row */}
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

            <div className={classNames(scss.row, scss.totalRow)}>
              <Left_total
                data={{
                  contractSubTotal: 'foo',
                  tax: 'foo',
                  contractTotal: 'foo',
                }}
              />
              <Center_total dataArr={[barrrrrrr, barrrrrrr, barrrrrrr, barrrrrrr]} />
              <Right_total02
                data={{
                  cumulativeTotal: 'foo',
                  tax: 'foo',
                  doneTotal: 'foo',
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

// ========================================================================
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
  data?: Tcontrol_left;
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
  data?: Tcontrol_right;
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

const Center = ({ dataArr }: { dataArr: (TcenterItem | undefined)[] }) => {
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

const Left_total = ({ data }: { data: Tcontrol_leftTotal }) => {
  return (
    <>
      <div className={'w-[115px]'}></div>
      <div className={'w-[80px]'}></div>
      <div className={'w-[110px]'}></div>
      <div className={'w-[50px]'}></div>
      <div className={classNames('w-[90px]', scss.totalGrid, scss.labelGrid)}>
        <span>合約合計</span>
        <span>營業稅5%</span>
        <span>合約總計</span>
      </div>
      <div className={classNames('w-[90px]', scss.totalGrid)}>
        <span>{data.contractSubTotal}</span>
        <span>{data.tax}</span>
        <span>{data.contractTotal}</span>
      </div>
    </>
  );
};

const Center_total = ({ dataArr }: { dataArr: TcenterTotal }) => {
  return (
    <>
      {dataArr.map((data, index) => {
        return (
          <Fragment key={index}>
            <div className={classNames('w-[92px] justify-center', scss.totalGrid, scss.labelGrid)}>
              <span>實作合計</span>
              <span>營業稅5%</span>
              <span>本期合計</span>
            </div>
            <div className={classNames('w-[120px] justify-center', scss.totalGrid)}>
              <span>{data.doneSubTotal}</span>
              <span>{data.tax}</span>
              <span>{data.periodTotal}</span>
            </div>
          </Fragment>
        );
      })}
    </>
  );
};

const Right_total02 = ({ data }: { data: TrightTotal }) => {
  return (
    <>
      <div className={classNames('w-[80px] justify-center', scss.totalGrid, scss.labelGrid)}>
        <span>累計合計</span>
        <span>營業稅5%</span>
        <span>實作總計</span>
      </div>
      <div className={classNames('w-[110px] justify-center', scss.totalGrid)}>
        <span>{data.cumulativeTotal}</span>
        <span>{data.tax}</span>
        <span>{data.doneTotal}</span>
      </div>
      <div className={classNames('w-[86px]', scss.rightCell)}></div>
    </>
  );
};

// ========================================================================

const foooooooo = {
  quantity: 'foo',
  price: 'foo',
};

const barrrrrrr = {
  doneSubTotal: 'foo',
  tax: 'foo',
  periodTotal: 'foo',
};
