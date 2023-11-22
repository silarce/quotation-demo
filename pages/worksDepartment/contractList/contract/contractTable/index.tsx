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
  quantity: number;
  price: number;
};
type Tcontrol_left = {
  projectNumber: string;
  itemName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};
type Tcontrol_center = TcenterItem[];

type Tcontrol_right = {
  exchangedQuantity: number;
  exchangedPrice: number;
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

  const {
    control_list: control,
    control_arr,
    attachTimes,
  } = useMemo(() => {
    if (!contract) {
      return {};
    }

    type Tlist = {
      [key: string /* rootProductId */]: {
        left: /* 建立時 */ {
          projectNumber: string;
          itemName: string;
          size: string;
          quantity: number;
          unitPrice: number;
          totalPrice: number;
        };
        centerArr: /* 追加追減 減少或增加 */ { quantity: number; price: number }[];
        right: /*這個產品最後的狀態 */ {
          exchangedQuantity: number;
          exchangedPrice: number;
          notes: string;
        };
        //
      };
    };

    const subContractArr = _.sortBy(contract.subContracts, 'version');

    subContractArr.pop();
    subContractArr.pop();

    console.log(subContractArr);

    const attachTimes = subContractArr.length - 1; //  有多少次變更

    // const emptyCenterArr: TcenterItem[] = new Array(attachTimes).fill({
    //   quantity: 0,
    //   price: 0,
    // });
    const createEmptyCenterArr = (): TcenterItem[] => {
      return new Array(attachTimes).fill({
        quantity: 0,
        price: 0,
      });
    };

    const createdEmptyListItem = (): Tlist[string] => ({
      left: {
        projectNumber: '',
        itemName: '',
        size: '',
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
      },
      centerArr: createEmptyCenterArr(),
      right: {
        exchangedQuantity: 0,
        exchangedPrice: 0,
        notes: '',
      },
    });

    const list: Tlist = {};

    subContractArr.forEach((subContract, subContractIndex) => {
      const prodcutArr = subContract.content.products;

      const { quotationNumber } = subContract.content;

      prodcutArr.forEach((prod) => {
        const {
          rootProductId,
          //
          itemName,
          fullWidth,
          height,
          boxB,
          quantity,
          unitPrice,
          totalPrice,
        } = prod;

        const fullWidth_cm = new Decimal(fullWidth || 0).div(10).toString();
        const height_cm = new Decimal(height || 0).div(10).toString();
        const boxB_cm = new Decimal(boxB || 0).div(10).toString();

        // if (rootProductId === '3359a3d5-33c2-4dad-86f0-07298020fb50') {
        //   console.log(quantity);
        // }

        if (!list[rootProductId]) {
          list[rootProductId] = createdEmptyListItem();
          const newItem = list[rootProductId];
          newItem.left = {
            projectNumber: subContractIndex === 0 ? '' : quotationNumber,
            itemName: itemName,
            size: `${fullWidth_cm}*${height_cm}+${boxB_cm}`,
            quantity,
            unitPrice,
            totalPrice,
          };
          newItem.right = {
            exchangedQuantity: quantity,
            exchangedPrice: totalPrice,
            notes: '',
          };
        } else {
          const item = list[rootProductId];
          const centerArrReverse = item.centerArr.toReversed();

          // console.log(centerArrReverse);
          // console.log(centerArrReverse);

          // if (rootProductId === '3359a3d5-33c2-4dad-86f0-07298020fb50') {
          //   console.log(quantity);
          // }

          let centerQuantity = 0;
          let centerPrice = 0;

          centerArrReverse.forEach((centerItem, index) => {
            // console.log(centerItem);
            // console.log('----------------------------------------------');

            // 如果已經找到了
            if (centerQuantity !== 0 || centerPrice !== 0) {
              return;
            }

            // 如果是空的
            if (centerItem.price === 0 && centerItem.quantity === 0) {
              return;
            }

            if (rootProductId === '3359a3d5-33c2-4dad-86f0-07298020fb50') {
              // console.log('quantity', quantity);
              // console.log('totalPrice', totalPrice);
              // console.log('centerQuantity', centerQuantity);
              // console.log('centerPrice', centerPrice);
              // console.log('fooo', quantity - centerItem.quantity);
            }

            centerQuantity = quantity - centerItem.quantity;
            centerPrice = totalPrice - centerItem.price;

            //
          });

          // 如果到最後都沒有找到
          if (centerQuantity === 0 && centerPrice === 0) {
            centerQuantity = quantity - item.left.quantity;
            centerPrice = totalPrice - item.left.totalPrice;
          }

          item.centerArr[subContractIndex - 1] = {
            quantity: centerQuantity,
            price: centerPrice,
          };

          item.right = {
            exchangedQuantity: quantity,
            exchangedPrice: totalPrice,
            notes: '',
          };
        } // else

        //
        //
        //
      }); //  prodcutArr.forEach
    }); // subContractArr.forEach

    const control_arr = Object.values(list) ?? [];

    return { control_list: list, control_arr, attachTimes };
  }, [contract]);

  // console.log(control);

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
              <Left isThead={true} />
              {/* <Center isThead={true} dataArr={[undefined, undefined, undefined, undefined]} /> */}
              <Center isThead={true} dataArr={new Array(attachTimes).fill(undefined)} />
              <Right isThead={true} />
            </div>
            {control_arr?.map((item, index) => {
              const { left, centerArr, right } = item;

              return (
                <div className={scss.row} key={index}>
                  <Left data={left} />
                  <Center dataArr={centerArr} />
                  <Right data={right} />
                </div>
              );
            })}

            {/* row */}
            {/* <div className={scss.row}>
              <Left
                data={{
                  projectNumber: 'foooo',
                  itemName: 'foooo',
                  size: 'foooo',
                  quantity: 999,
                  unitPrice: 999,
                  totalPrice: 999,
                }}
              />
              <Center dataArr={[foooooooo, foooooooo, foooooooo, foooooooo]} />
              <Right
                data={{
                  exchangedQuantity: 999,
                  exchangedPrice: 999,
                  notes: 'foo',
                }}
              />
            </div> */}

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
  //
  isThead,
  data,
}: {
  isThead?: boolean;
  data?: Tcontrol_left;
}) => {
  const projectNumber = isThead ? '追加追減' : data?.projectNumber;
  const itemName = isThead ? '項目' : data?.itemName;
  const size = isThead ? '尺寸 (cm)' : data?.size;
  const quantity = isThead ? '數量' : data?.quantity;
  const unitPrice = isThead ? '合約單價' : data?.unitPrice;
  const totalPrice = isThead ? '合約金額' : data?.totalPrice;

  return (
    <>
      <div className={'w-[115px]'}>
        <span>{projectNumber}</span>
      </div>
      <div className={'w-[80px]'}>
        <span>{itemName}</span>
      </div>
      <div className={'w-[110px]'}>
        <span>{size}</span>
      </div>
      <div className={'w-[50px]'}>
        <span>{quantity}</span>
      </div>
      <div className={'w-[90px]'}>
        <span>{unitPrice}</span>
      </div>
      <div className={'w-[90px]'}>
        <span>{totalPrice}</span>
      </div>
    </>
  );
};

const Right = ({
  //
  isThead,
  data,
}: {
  isThead?: boolean;
  data?: Tcontrol_right;
}) => {
  const exchangedQuantity = isThead ? '變更後數量' : data?.exchangedQuantity;
  const exchangedPrice = isThead ? '變更後金額' : data?.exchangedPrice;
  const notes = isThead ? '備註' : data?.notes;

  return (
    <>
      <div className={classNames('w-[80px]', scss.rightCell)}>
        <span>{exchangedQuantity}</span>
      </div>
      <div className={classNames('w-[110px]', scss.rightCell)}>
        <span>{exchangedPrice}</span>
      </div>
      <div className={classNames('w-[86px]', scss.rightCell)}>
        <span>{notes}</span>
      </div>
    </>
  );
};

const Center = ({
  //
  isThead,
  dataArr,
}: {
  isThead?: boolean;
  dataArr: (TcenterItem | undefined)[];
}) => {
  return (
    <>
      {dataArr.map((data, index) => {
        const quantity = isThead ? `數量(變更${index + 1})` : data?.quantity;
        const price = isThead ? `金額(變更${index + 1})` : data?.price;

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
  quantity: 999,
  price: 999,
};

const barrrrrrr = {
  doneSubTotal: 'foo',
  tax: 'foo',
  periodTotal: 'foo',
};
