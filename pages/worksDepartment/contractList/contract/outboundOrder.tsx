// 出庫單
// 出庫單
// 出庫單
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';
import moment from 'moment';

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
import {
  TupdateEngineeringDeliveryList,
  useGetEngineeringContact,
  useGetEngineeringDeliveryList,
  apiPatchEngineeringDeliveryList,
} from 'js/api/api_engineering';

// utils
import { convertDate_reduce1911, convertDate_add1911 } from 'js/utils/helpers/date/convertDate';

// type
import { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { TquotationProductItemDto, TdeliveryStatusDto, TemployeeDto } from 'js/api/dtoTypes';

// =====================================================================

type Tdelevery = {
  itemName: string;
  itemArr: TquotationProductItemDto[];
};

type myDeleveryList = {
  [key: string]: Tdelevery;
};

type TdeliveryStatusWillUpdate = {
  [key in string]: {
    id: string;
    notes: string;
    // installerEmployeeId: string | null;
    installerEmployee?: TemployeeDto | null;
    installationDate: string | null;
    append: string | null;
    completeAppend: string | null;
  };
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

  const { deliveryList, update_deliveryList } = useGetEngineeringDeliveryList(engineeringDeliveryListId);

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

  const [deliveryStatusWillUpdate, setDeliveryStatusWillUpdate] = useState<TdeliveryStatusWillUpdate>({});

  const change_deliveryStatusWillUpdate = (
    statusOri: TdeliveryStatusDto | undefined | null,
    key: Exclude<keyof TdeliveryStatusWillUpdate[string], 'installerEmployee'>,
    v: string
  ) => {
    if (!statusOri) {
      return;
    }

    const deliveryStatusId = statusOri.id;
    let statusCopy = deliveryStatusWillUpdate[deliveryStatusId] ?? createDeliveryStatusWillUpdate(statusOri);
    statusCopy = { ...statusCopy };
    statusCopy[key] = v;

    setDeliveryStatusWillUpdate((state) => {
      return {
        ...state,
        [deliveryStatusId]: statusCopy,
      };
    });
  };

  const change_deliveryStatusWillUpdate_employee = (
    statusOri: TdeliveryStatusDto | undefined | null,
    key: 'installerEmployee',
    v: TemployeeDto | null
  ) => {
    if (!statusOri) {
      return;
    }

    const deliveryStatusId = statusOri.id;
    let statusCopy = deliveryStatusWillUpdate[deliveryStatusId] ?? createDeliveryStatusWillUpdate(statusOri);
    statusCopy = { ...statusCopy };
    statusCopy[key] = v;
    setDeliveryStatusWillUpdate((state) => {
      return {
        ...state,
        [deliveryStatusId]: statusCopy,
      };
    });
  };

  const change_deliveryStatusWillUpdate_date = (
    statusOri: TdeliveryStatusDto | undefined | null,
    key: 'installationDate',
    v: string | null
  ) => {
    if (!statusOri) {
      return;
    }

    const deliveryStatusId = statusOri.id;
    let statusCopy = deliveryStatusWillUpdate[deliveryStatusId] ?? createDeliveryStatusWillUpdate(statusOri);
    statusCopy = { ...statusCopy };
    statusCopy[key] = v;
    setDeliveryStatusWillUpdate((state) => {
      return {
        ...state,
        [deliveryStatusId]: statusCopy,
      };
    });
  };

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
          // cai: firstItem.volume,
          cai: '',
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
          // remark02: {
          //   value: '',
          //   hidden: true,
          // },
          // remark03: {
          //   value: '',
          //   hidden: true,
          // },
          // remark04: {
          //   value: '',
          //   hidden: true,
          // },
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
            // value: '',
            empolyee: null,
            hidden: true,
          },
          installDate: {
            value: '',
            hidden: true,
          },
        },
      };

      let totalCai_total = new Decimal(0);

      const rowArr: Tgroup['rowArr'] = delevery.itemArr.map((item) => {
        totalCai_total = totalCai_total.add(item.volume || '0');

        const {
          //
          id: deliveryStatusId,
          createdAt,
          notes,
          installerEmployeeId,
          installerEmployee,
          installationDate,
          append,
          completeAppend,
        } = item.deliveryStatus ?? {};

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
              value: deliveryStatusWillUpdate[deliveryStatusId ?? '']?.notes ?? notes ?? '',
              onChange: (str) => {
                change_deliveryStatusWillUpdate(item?.deliveryStatus, 'notes', str);
              },
            },
            // remark02: {
            //   value: 'test',
            //   onChange: () => {},
            // },
            // remark03: {
            //   value: 'test',
            //   onChange: () => {},
            // },
            // remark04: {
            //   value: 'test',
            //   onChange: () => {},
            // },
            orderCreatedDate: {
              value: createdAt ? moment(convertDate_reduce1911(createdAt)).format('yy-MM-DD') : '',
              forbidden: true,
            },
            installDate: {
              value: deliveryStatusWillUpdate[deliveryStatusId ?? '']?.installationDate ?? installationDate ?? '',
              onChange_date: (date) => {
                change_deliveryStatusWillUpdate_date(item?.deliveryStatus, 'installationDate', date);
              },
            },
            appended: {
              value: deliveryStatusWillUpdate[deliveryStatusId ?? '']?.append ?? append ?? '',
              onChange: (str) => {
                change_deliveryStatusWillUpdate(item?.deliveryStatus, 'append', str);
              },
            },
            finishAppended: {
              value: deliveryStatusWillUpdate[deliveryStatusId ?? '']?.completeAppend ?? completeAppend ?? '',
              onChange: (str) => {
                change_deliveryStatusWillUpdate(item?.deliveryStatus, 'completeAppend', str);
              },
            },
            installer: {
              // value: '', // 設定value的話就會蓋過employee.chName或employee.enName
              empolyee:
                deliveryStatusWillUpdate[deliveryStatusId ?? '']?.installerEmployee ?? installerEmployee ?? null,
              onChange_employee: (emp) => {
                change_deliveryStatusWillUpdate_employee(item?.deliveryStatus, 'installerEmployee', emp);
              },
            },
          },
        };
      });

      firstRow.staticData.totalCai = totalCai_total.toString();
      rowArr.unshift(firstRow);

      return {
        itemName: delevery.itemName,
        rowArr,
      };
    }) ?? [];

  // --------------------------------------------------------------------------

  // const reqUpdate = async () => {

  //   const body:TupdateEngineeringDeliveryList

  //   try {
  //     const res = await apiPatchEngineeringDeliveryList();
  //   } catch (error) {}
  // };

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

const createDeliveryStatusWillUpdate = (deliveryStatus: TdeliveryStatusDto): TdeliveryStatusWillUpdate[string] => {
  return {
    id: deliveryStatus.id,
    notes: deliveryStatus.notes ?? '',
    installerEmployee: deliveryStatus.installerEmployee ?? null,
    installationDate: deliveryStatus.installationDate,
    append: deliveryStatus.append,
    completeAppend: deliveryStatus.completeAppend,
  };
};
