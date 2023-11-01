// 出庫單
// 出庫單
// 出庫單
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import OrderTable, {
  Tcontrol_orderTable,
  Tgroup,
} from 'components/page/worksDepartment/contracList/contract/outboundOrder/orderTable';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// css
import style from './contract.module.scss';

// api
import { TquotationProductDto, useGetContract_id_noItems } from 'js/api/api_quotation';
import { useGetEngineeringContact, useApiGetEngineeringDeliveryList } from 'js/api/api_engineering';
import { TquotationProductItemDto } from 'js/api/dtoTypes';

// type
import { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// =====================================================================

type Tdelevery = {
  itemName: string;
  itemArr: TquotationProductItemDto[];
};

type myDeleveryList = {
  [key: string]: Tdelevery;
};

// =====================================================================
export default function OutboundOrder() {
  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // --------------------------------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id_noItems(contractId);
  // const engineeringContactId = contract?.engineeringContactId;
  const { engineeringContactId, engineeringDeliveryListId } = contract ?? {};
  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  const { deliveryList, update_deliveryList } = useApiGetEngineeringDeliveryList(engineeringDeliveryListId);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await update_contract();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '取得合約失敗', content: err.message });
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await update_engineeringContact();
        await update_deliveryList();
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  // --------------------------------------------------------------------------

  const { myDeleveryList } = useMemo(() => {
    if (!deliveryList?.contract.worksheet?.contractProductItems) {
      return {};
    }

    const contractProductItems = deliveryList.contract.worksheet.contractProductItems;

    const myDeleveryList: myDeleveryList = {};

    contractProductItems.forEach((item) => {
      const { productId, adjustedItem, adjustedItemId } = item;

      let theItem: typeof item;
      let theId: string;

      if (adjustedItem && adjustedItemId) {
        theItem = adjustedItem;
        theId = adjustedItemId;
      } else {
        theItem = item;
        theId = productId;
      }

      if (!myDeleveryList?.[theId]) {
        myDeleveryList[theId] = {
          itemName: theItem.itemName,
          itemArr: [],
        };
      }

      myDeleveryList[theId].itemArr.push(theItem);
    });

    return {
      myDeleveryList,
    };
  }, [deliveryList]);

  // --------------------------------------------------------------------------

  const control_orderTable: Tcontrol_orderTable =
    Object.values(myDeleveryList ?? {}).map((delevery) => {
      // 取哪一個item都無所謂，如果程式沒有寫錯，每個item都是一樣的
      const firstItem = delevery.itemArr[0];

      const firstRow: Tgroup['rowArr'][0] = {
        staticData: {
          project: delevery.itemName,
          L: String(firstItem.fullWidth),
          W: String(firstItem.WG),
          B: String(firstItem.boxB),
          qty: String(delevery.itemArr.length),
          implementQty: '???',
          cai: firstItem.volume,
          totalCai: '0',
          doorType: firstItem.doorModelName,
          material: firstItem.materialName,
          horsepower: firstItem.horsepower,
          surface: firstItem.materialSurface,
        },
        deliveryStatus: {
          remark01: {
            value: '',
            hidden: true,
          },
          remark02: {
            value: '',
            hidden: true,
          },
          remark03: {
            value: '',
            hidden: true,
          },
          remark04: {
            value: '',
            hidden: true,
          },
          appended: {
            value: '',
            hidden: true,
          },
          orderCreatedDate: {
            value: '',
            hidden: true,
          },
          finishAppended: {
            value: '',
            hidden: true,
          },
          installer: {
            value: '',
            hidden: true,
          },
          installDate: {
            value: '',
            hidden: true,
          },
        },
      };

      let totalCai_total = 0;

      const rowArr: Tgroup['rowArr'] = delevery.itemArr.map((item) => {
        totalCai_total += Number(item.volume);

        return {
          staticData: {
            project: delevery.itemName,
            L: String(item.fullWidth),
            W: String(item.WG),
            B: String(item.boxB),
            qty: '1',
            implementQty: '???',
            cai: item.volume,
            totalCai: '',
            doorType: item.doorModelName,
            material: item.materialName,
            horsepower: item.horsepower,
            surface: item.materialSurface,
          },
          deliveryStatus: {
            remark01: {
              value: 'test',
              onChange: () => {},
            },
            remark02: {
              value: 'test',
              onChange: () => {},
            },
            remark03: {
              value: 'test',
              onChange: () => {},
            },
            remark04: {
              value: 'test',
              onChange: () => {},
            },
            appended: {
              value: 'test',
              onChange: () => {},
            },
            orderCreatedDate: {
              value: 'test',
              onChange: () => {},
            },
            finishAppended: {
              value: 'test',
              onChange: () => {},
            },
            installer: {
              value: 'test',
              onChange: () => {},
            },
            installDate: {
              value: 'test',
              onChange: () => {},
            },
          },
        };
      });

      firstRow.staticData.totalCai = String(totalCai_total);
      rowArr.unshift(firstRow);

      return {
        itemName: delevery.itemName,
        rowArr,
      };
    }) ?? [];

  // --------------------------------------------------------------------------

  const panelList01: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        setDisabled(false);
      },
    },
  ];
  const panelList02: TpanelList = [
    {
      type: 'redButton',
      label: '儲存',
      onClick: () => {
        alert('儲存');
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
      },
    },
  ];

  return (
    <SubLayer>
      <PageHeader
        panelList={disabled ? panelList01 : panelList02}
        contractNumber={engineeringContact?.contractNumber ?? ''}
      />

      <div>
        <div className={style.outboundOrder}>
          <div className={style.title}>
            <div>
              <span>工程編號</span>
              <span>{engineeringContact?.projectNumber}</span>
            </div>
            <div>
              <span>工程名稱</span>
              <span>{engineeringContact?.projectName}</span>
            </div>
          </div>

          <OrderTable disabled={disabled} control={control_orderTable} />

          <div className={style.remark}>
            <div className={style.title}>
              <div>
                <span>備註</span>
              </div>
            </div>

            <div className={style.textarea}>
              <textarea name="" id="" placeholder="請輸入備註"></textarea>
            </div>
          </div>
        </div>
      </div>
    </SubLayer>
  );
}
