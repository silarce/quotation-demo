// 出庫單
// 出庫單
// 出庫單
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import OrderTable from 'components/page/worksDepartment/contracList/contract/outboundOrder/orderTable';

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

          <OrderTable disabled={disabled} control={[]} />

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
