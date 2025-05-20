import { useState, useEffect, useMemo, Fragment } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
// import PageHeader from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import Nav_worksDepartment from 'components/page/worksDepartment/nav_worksDepartment';

// api
import { useGetEngineeringContact } from 'js/api/api_engineering';
import { useGetContract_id } from 'js/api/api_quotation';

// type
import { TerpFeatureDto } from 'js/api/dtoTypes';

// css
import scss from './index.module.scss';

import { usePanel_returnWorksDepartmentContractList } from 'components/page/worksDepartment/hook/usePanel_returnWorksDepartmentContractList';

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
export default function ContracTable({
  isAdmin,
  userErpFeature,
}: {
  isAdmin: boolean;
  userErpFeature: TerpFeatureDto[] | undefined;
}) {
  const havePermissionToSee = useMemo(() => {
    if (isAdmin) {
      return true;
    }

    const isHave = userErpFeature?.some((item) => {
      return item.name === '應收帳款';
    });

    return !!isHave;
  }, [userErpFeature]);

  // -------------------------------------------------------------
  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------------------------------------------

  const {
    data: contract,
    update: update_contract,
    contactThatSkipContract,
  } = useGetContract_id(contractId, {
    customPopulate: ['subContracts.content.products.rootProdductId'],
  });
  const engineeringContactId = contract?.engineeringContactId;

  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  useEffect(() => {
    if (!havePermissionToSee) {
      return;
    }

    (async () => {
      setIsLoading(true);

      if (!contract) {
        await update_contract();
      }

      await update_engineeringContact();
      setIsLoading(false);
    })();
  }, [contractId, engineeringContactId]);

  // -------------------------------------------------------------

  const {
    //
    control_list,
    control_arr,
    attachTimes,
    control_leftTotal,
    control_rightTotal,
    control_centerTotal,
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
          remainQty: number;
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

    const attachTimes = subContractArr.length - 1; //  有多少次變更

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
        remainQty: 0,
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
      // const prodcutArr = subContract.content.products;
      const prodcutArr = _.sortBy(subContract.content.products, 'createdAt').reverse();

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
            remainQty: quantity,
          };
          newItem.right = {
            exchangedQuantity: quantity,
            exchangedPrice: totalPrice,
            notes: '',
          };

          if (subContractIndex !== 0) {
            newItem.left.totalPrice = 0;
            newItem.left.quantity = 0;

            newItem.centerArr[subContractIndex - 1] = {
              quantity: quantity,
              price: totalPrice,
            };
          }
        } else {
          const item = list[rootProductId];

          // npm run check時會報型別錯誤
          // const centerArrReverse = _.cloneDeep(item.centerArr).toReversed();
          const centerArrReverse = _.cloneDeep(item.centerArr).reverse();

          let centerQuantity = 0;
          let centerPrice = 0;

          centerArrReverse.forEach((centerItem, index) => {
            // 如果已經找到了
            if (centerQuantity !== 0 || centerPrice !== 0) {
              return;
            }

            // 如果是空的
            if (centerItem.price === 0 && centerItem.quantity === 0) {
              return;
            }

            // 差值
            centerQuantity = quantity - item.left.remainQty;
            // product裡的數量是最後剩下的數量
            item.left.remainQty = quantity;
            centerPrice = centerQuantity * unitPrice;
          });

          // 如果到最後都沒有找到
          if (centerQuantity === 0 && centerPrice === 0) {
            centerQuantity = quantity - item.left.remainQty;
            item.left.remainQty = quantity;

            centerPrice = centerQuantity * unitPrice;
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
      }); //  prodcutArr.forEach
    }); // subContractArr.forEach

    //
    //----------

    let leftSubTotal = 0;
    const centerTotalArr: number[] = new Array(attachTimes).fill(0);
    let rightTotal = 0;

    Object.values(list).forEach((item) => {
      const { left, centerArr, right } = item;

      leftSubTotal = leftSubTotal + left.totalPrice;
      rightTotal = rightTotal + right.exchangedPrice;

      centerArr.forEach((centerItem, index) => {
        centerTotalArr[index] = centerTotalArr[index] + centerItem.price;
      });
    });

    const leftTax = new Decimal(leftSubTotal).mul(0.05).toFixed(2);
    const control_leftTotal: Tcontrol_leftTotal = {
      contractSubTotal: leftSubTotal.toLocaleString(),
      tax: Number(leftTax).toLocaleString(),
      contractTotal: Number(new Decimal(leftSubTotal).add(leftTax).toFixed(2)).toLocaleString(),
    };

    const rightTax = new Decimal(rightTotal).mul(0.05).toFixed(2);
    const control_rightTotal: TrightTotal = {
      cumulativeTotal: rightTotal.toLocaleString(),
      tax: Number(rightTax).toLocaleString(),
      doneTotal: Number(new Decimal(rightTotal).add(rightTax).toFixed(2)).toLocaleString(),
    };

    const control_centerTotal: TcenterTotal = centerTotalArr.map((centerTotal) => {
      const tax = new Decimal(centerTotal).mul(0.05).toFixed(2);

      return {
        doneSubTotal: centerTotal.toLocaleString(),
        tax: Number(tax).toLocaleString(),
        periodTotal: Number(new Decimal(centerTotal).add(tax).toFixed(2)).toLocaleString(),
      };
    });

    //----------

    const control_arr = Object.values(list) ?? [];

    return {
      control_list: list,
      control_arr,
      attachTimes,

      control_leftTotal,
      control_rightTotal,
      control_centerTotal,
    };
  }, [contract]);

  // -------------------------------------------------------------
  return (
    <SubLayer isLoading_subLayer={isLoading}>
      {/* <PageHeader
        //  panelList={panelList}
        contractNumber={engineeringContact?.contractNumber ?? ''}
        contactThatSkipContract={contactThatSkipContract}
      /> */}

      <div>
        <PageHeader02
          tag={`合約編號 ${engineeringContact?.contractNumber ?? ''}`}
          panelList={usePanel_returnWorksDepartmentContractList()}
        />
        <Nav_worksDepartment contactThatSkipContract={contactThatSkipContract} />
      </div>

      <div className={scss.main}>
        <div className={scss.tableContainer}>
          <div className={scss.tablewrapper}>
            {/* <div className={scss.top}>
              <div>
                <span>本期請款金額：{'foooo'}</span>
              </div>
            </div> */}
            {/*  */}
            <div className={scss.table}>
              <div className={classNames(scss.row, scss.thead)}>
                <Left isThead={true} />
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

              <div className={classNames(scss.row, scss.totalRow)}>
                <Left_total data={control_leftTotal} />
                <Center_total dataArr={control_centerTotal} />
                <Right_total02 data={control_rightTotal} />
              </div>
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
  const unitPrice = isThead ? '合約單價' : data?.unitPrice.toLocaleString();
  const totalPrice = isThead ? '合約金額' : data?.totalPrice.toLocaleString();

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
  const exchangedPrice = isThead ? '變更後金額' : data?.exchangedPrice.toLocaleString();
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
        const price = isThead ? `金額(變更${index + 1})` : data?.price.toLocaleString();

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

const Left_total = ({ data }: { data: Tcontrol_leftTotal | undefined }) => {
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
        <span>{data?.contractSubTotal}</span>
        <span>{data?.tax}</span>
        <span>{data?.contractTotal}</span>
      </div>
    </>
  );
};

const Center_total = ({ dataArr }: { dataArr: TcenterTotal | undefined }) => {
  return (
    <>
      {dataArr?.map((data, index) => {
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

const Right_total02 = ({ data }: { data: TrightTotal | undefined }) => {
  return (
    <>
      <div className={classNames('w-[80px] justify-center', scss.totalGrid, scss.labelGrid)}>
        <span>累計合計</span>
        <span>營業稅5%</span>
        <span>實作總計</span>
      </div>
      <div className={classNames('w-[110px] justify-center', scss.totalGrid)}>
        <span>{data?.cumulativeTotal}</span>
        <span>{data?.tax}</span>
        <span>{data?.doneTotal}</span>
      </div>
      <div className={classNames('w-[86px]', scss.rightCell)}></div>
    </>
  );
};
