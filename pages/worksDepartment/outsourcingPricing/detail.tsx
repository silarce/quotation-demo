// 外包計價的api接完了，但是`/outsourcing-payment-detail/${id}`沒有作用
// paymentDetail.installItems.itemPrice仍是null，
// paymentDetail.installItems.deliveryStatus.otherWorkItems仍是null，
// paymentDetail.installItems.deliveryStatus.otherWorkItemTotal仍是null，
// paymentDetail.outsourcingTotal仍是0

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// components
import Table01, { CellInput, CellSelect } from 'components/global/gear/table/table01';
import type { Tcell, Ttable, Tconfig_table } from 'components/global/gear/table/table01';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import AddressBar from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';

// icon
import { IconAddCircle } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './detail.module.scss';

// api
import {
  TcreateOutsourcingPaymentDetailItemDto,
  TupdateOutsourcingPaymentDetailDto,
  useGetOutsourcingPaymentDetail_id,
  apiPatchOutsourcingPaymentDetail,
} from 'js/api/api_outsourcing';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import { optionsCreator_otherWorkItems } from 'js/utils/options/options';

// type
import type { TquotationProductItemDto, TengineeringDeliveryStatusDto } from 'js/api/dtoTypes';
import { Toption } from 'js/utils/options/options';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// =======================================================================

type Tquery = {
  paymentDetailId: string | undefined;
};

type Tstate_otherWorkItem = {
  installItemId: string | undefined;
  // installItemName: string;

  otherInstallation: string;
  otherQuantity: string;
  otherUnitPrice: string;
  otherSubTotalPrice: string;
  quotationItemStatusId: string | null | undefined;
  // quotationItemStatusId: string;
};

type Tstate_installItem = {
  itemId: string;
  itemPrice: number;
  firstDeliveryStatusId: string;
};

// =======================================================================

// MARK: START

export default function OutsourcingPricingDetail() {
  const router = useRouter();
  const { paymentDetailId } = router.query as Tquery;

  // ---------------------------------------------------------------------
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // ---------------------------------------------------------------------

  const {
    data: paymentDetail,
    update,
    isLoading_outsourcingPaymentDetail,
  } = useGetOutsourcingPaymentDetail_id(paymentDetailId);

  const {
    //
    engineeringContact,
    outsourcingPayment,
    outsourcingTotal,
    installItems = [],
  } = paymentDetail ?? {};

  const { outsourcing, date } = outsourcingPayment ?? {};
  const twDateStr = date ? getTaiwanDateStr(date) : '';
  const outsourcingId = outsourcing?.id;

  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------

  const {
    //
    control_table01,
    subTotal01,
    state_installItem,
  } = useTable01({ installItems, disabled });
  const {
    //
    control_table02,
    subTotal02,
    addState_otherWorkItem,
    state_otherWorkItem,
  } = useTable02({
    installItems,
    disabled,
    outsourcingId,
  });
  const control_table_total = useTable_total({ subTotal01, subTotal02 });

  // ---------------------------------------------------------------------
  // region REQUEST

  const reqPatchOutsourcingPaymentDetail = async () => {
    if (!paymentDetailId || !engineeringContact?.id) {
      return;
    }

    let isOtherWorkItemError = false;

    // const installItemList: { [key: string]: TcreateOutsourcingPaymentDetailItemDto } = {};
    const installItemList: {
      [key: string]: TcreateOutsourcingPaymentDetailItemDto & { firstDeliveryStatusId: string };
    } = {};

    state_installItem.forEach((item) => {
      const { itemId, itemPrice, firstDeliveryStatusId } = item;
      installItemList[item.itemId] = {
        itemId,
        itemPrice,
        otherWorkItems: [],
        otherWorkItemTotal: 0,
        firstDeliveryStatusId,
      };
    });

    state_otherWorkItem.forEach((item) => {
      const { installItemId, otherInstallation, otherQuantity, otherUnitPrice } = item;

      if (!installItemId) {
        isOtherWorkItemError = true;

        return;
      }

      const installItem = installItemList[installItemId];

      if (installItem) {
        const otherSubTotalPrice = Number(otherQuantity) * Number(otherUnitPrice);
        installItem.otherWorkItemTotal = installItem.otherWorkItemTotal! + otherSubTotalPrice;
        installItem.otherWorkItems!.push({
          otherInstallation,
          otherQuantity: Number(otherQuantity),
          otherUnitPrice: Number(otherUnitPrice),
          otherSubTotalPrice: otherSubTotalPrice,
          // quotationItemStatusId: null,
          quotationItemStatusId: installItem.firstDeliveryStatusId,
        });
      }
    });

    if (isOtherWorkItemError) {
      myAlert.info({
        title: '特殊工作項目錯誤',
        content: '樓層編號不得為空白',
      });

      return;
    }

    const installItems = Object.values(installItemList).map((item) => {
      const { firstDeliveryStatusId, ...installItems } = item;

      return installItems;
    });

    const body: TupdateOutsourcingPaymentDetailDto = {
      engineeringContactId: engineeringContact.id,
      installItems: installItems,
      outsourcingTotal: new Decimal(subTotal01).add(subTotal02).toNumber(),
    };

    try {
      setIsLoading(true);
      await apiPatchOutsourcingPaymentDetail(paymentDetailId, body);
      await update();
      setDisabled(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------

  // region PROPS

  const panelList_disabled: TpanelList = [
    {
      type: 'redButton',
      label: '編輯',
      onClick: () => {
        setDisabled(false);
      },
    },
    // {
    //   type: 'redButton',
    //   label: '刪除',
    //   onClick: () => {},
    // },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.back();
      },
    },
  ];

  const panelList_enabled: TpanelList = [
    {
      type: 'redButton',
      label: '確認',
      onClick: reqPatchOutsourcingPaymentDetail,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
      },
    },
  ];

  const panelList = disabled ? panelList_disabled : panelList_enabled;

  // ---------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    update();
  }, [paymentDetailId]);

  // endregion useEffect

  // ---------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer isLoading_subLayer={isLoading_outsourcingPaymentDetail}>
      <PageHeader02 tag="外包計價單明細" panelList={panelList} />
      <div className={scss.main}>
        {/*  */}
        <div className={scss.profile}>
          <InputSel
            //
            caption={'外包廠商'}
            disabled={disabled}
            showBaseline="auto"
            inputProps={{
              props: {
                value: outsourcing?.name ?? '',
                placeholder: '',
              },
            }}
          />
          <InputSel
            //
            caption={'工程編號'}
            disabled={disabled}
            showBaseline="auto"
            inputProps={{
              props: {
                value: engineeringContact?.projectNumber ?? '',
                placeholder: '',
              },
            }}
          />
          <InputSel
            //
            caption={'工程日期'}
            disabled={disabled}
            showBaseline="auto"
            inputProps={{
              props: {
                value: twDateStr ?? '',
                placeholder: '',
              },
            }}
          />
          <InputSel
            //
            caption={'安裝人員'}
            disabled={disabled}
            showBaseline="auto"
            inputProps={{
              props: {
                value: outsourcing?.name ?? '',
                placeholder: '',
              },
            }}
          />
          <InputSel
            //
            caption={'工程名稱'}
            className="col-span-2"
            disabled={disabled}
            showBaseline="auto"
            inputProps={{
              props: {
                value: engineeringContact?.projectName,
                placeholder: '',
              },
            }}
          />
          <AddressBar
            inputSelProps={{
              className: 'col-span-2',
              disabled: disabled,
              showBaseline: 'auto',
            }}
            addressProps={{
              county: {
                easyValue: engineeringContact?.county ?? '',
                props: {
                  isDisabled: true,
                  value: { value: '', label: engineeringContact?.county ?? '' },
                  placeholder: '',
                },
              },
              district: {
                props: {
                  isDisabled: true,
                  value: { value: '', label: engineeringContact?.district ?? '' },
                  placeholder: '',
                },
              },
              address: {
                props: {
                  readOnly: true,
                  value: engineeringContact?.address ?? '',
                  placeholder: '',
                },
              },
            }}
          />
        </div>
        {/*  */}
        <Table01 className="mt-20" {...control_table01} />
        <div className="mt-20">
          <IconAddCircle
            className={classNames('mb-2', disabled && 'invisible')}
            onClick={() => {
              !disabled && addState_otherWorkItem();
            }}
          />
          <Table01 {...control_table02} />
        </div>
        <Table01 className="mt-20" {...control_table_total} />
        {/*  */}
      </div>
    </SubLayer>
  );
}

// MARK:END

// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================

const useTable01 = ({
  //
  installItems,
  disabled,
}: {
  installItems: TquotationProductItemDto[];
  disabled?: boolean;
}) => {
  const [state_installItem, setState_installItem] = useState<Tstate_installItem[]>([]);

  useEffect(() => {
    if (!disabled) {
      return;
    }

    const newState_installItem: Tstate_installItem[] = installItems.map((item) => {
      return {
        itemId: item.id,
        itemPrice: item.itemPrice || 0,
        firstDeliveryStatusId: item.deliveryStatus[0].id,
      };
    });

    setState_installItem(newState_installItem);
  }, [installItems, disabled]);

  //
  const { control_table, subTotal } = useMemo(() => {
    const thead: Ttable['thead'] = {
      cellArr: [
        {
          children: config_useTable01.floorNumber.label,
          ...config_useTable01.floorNumber,
        },
        {
          children: config_useTable01.width.label,
          ...config_useTable01.width,
        },
        {
          children: config_useTable01.height.label,
          ...config_useTable01.height,
        },
        {
          children: config_useTable01.volume.label,
          ...config_useTable01.volume,
        },
        {
          children: config_useTable01.qty.label,
          ...config_useTable01.qty,
        },
        {
          children: config_useTable01.unitPrice.label,
          ...config_useTable01.unitPrice,
        },
        {
          children: config_useTable01.dualPrice.label,
          ...config_useTable01.dualPrice,
        },
      ],
    };
    //

    let decimal_subTotal = new Decimal(0);

    const rowArr: Ttable['tbody']['rowArr'] = state_installItem.map((_, index) => {
      const item = installItems[index];
      const { itemName, fullWidth, height, volume } = item;

      const itemPrice = state_installItem[index].itemPrice;

      // const dualPrice = new Decimal(itemPrice || 0).mul(qty).toDecimalPlaces(0).toNumber();
      // 才數*才數單價*樘數
      const dualPrice = new Decimal(volume || 0)
        .mul(itemPrice ?? 0)
        .mul(1)
        .toDecimalPlaces(0)
        .toNumber();

      // const dualPrice = new Decimal(itemPrice || 0)
      //   .mul(volume ?? 0)
      //   .mul(1)
      //   .toDecimalPlaces(0)
      //   .toNumber();

      decimal_subTotal = decimal_subTotal.add(dualPrice);

      const cellArr: Tcell[] = [
        {
          children: itemName,
          ...config_useTable01.floorNumber,
        },
        {
          children: fullWidth,
          ...config_useTable01.width,
        },
        {
          children: height,
          ...config_useTable01.height,
        },
        {
          children: volume,
          ...config_useTable01.volume,
        },
        {
          children: 1,
          ...config_useTable01.qty,
        },
        {
          children: (
            <CellInput
              style={{ width: config_useTable01.unitPrice.width }}
              disabled={disabled}
              inputProps={{
                type: 'number',
                value: state_installItem[index].itemPrice ?? '',
                readOnly: disabled,
                onChange: (e) => {
                  setState_installItem((prev) => {
                    const copy = [...prev];
                    copy[index].itemPrice = Number(e.target.value);

                    return copy;
                  });
                },
              }}
            />
          ),
          ...config_useTable01.unitPrice,
        },
        {
          children: dualPrice,
          ...config_useTable01.dualPrice,
        },
      ];

      return {
        cellArr,
      };
    });

    rowArr.push({
      cellArr: [
        {
          children: '合計',
          ...confit_public.left,
        },
        {
          children: decimal_subTotal.toNumber().toLocaleString(),
          ...confit_public.right,
        },
      ],
    });

    const tbody = {
      rowArr,
    };

    const control_table = {
      thead,
      tbody,
    };

    return {
      control_table,
      subTotal: decimal_subTotal.toNumber(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state_installItem, disabled]); // useMemo

  return { control_table01: control_table, subTotal01: subTotal, state_installItem };
};

// ===========================================================================

const useTable02 = ({
  //
  installItems,
  disabled,
  outsourcingId,
}: {
  installItems: TquotationProductItemDto[];
  disabled?: boolean;
  outsourcingId: string | undefined;
}) => {
  //

  const [itemNameOptionArr, setItemNameOptionArr] = useState<Toption[]>([]);

  const [state_otherWorkItem, setState_otherWorkItem] = useState<Tstate_otherWorkItem[]>([]);

  const editState_otherWorkItem = (index: number, key: keyof Tstate_otherWorkItem, value: string) => {
    setState_otherWorkItem((prev) => {
      const copy = [...prev];
      const item = copy[index];
      item[key] = value;

      if (key === 'otherQuantity' || key === 'otherUnitPrice') {
        const otherSubTotalPrice = new Decimal(item.otherQuantity || 0)
          .mul(item.otherUnitPrice || 0)
          .toDecimalPlaces(0)
          .toString();
        copy[index].otherSubTotalPrice = otherSubTotalPrice;
      }

      return copy;
    });
  };

  const addState_otherWorkItem = () => {
    setState_otherWorkItem((prev) => [
      ...prev,
      {
        installItemId: undefined,
        installItemName: '',
        otherInstallation: '',
        otherQuantity: '0',
        otherUnitPrice: '0',
        otherSubTotalPrice: '0',
        quotationItemStatusId: '',
      },
    ]);
  };

  useEffect(() => {
    if (!disabled) {
      return;
    }

    const arr: Tstate_otherWorkItem[] = [];
    const otherWorkItemsOptionArr: Toption[] = [];

    installItems.forEach((item) => {
      const { deliveryStatus, id, itemName } = item;

      let deliveryStatusArr = (deliveryStatus ?? []).filter((item) => {
        return item.installerOutsourcingId === outsourcingId;
      });

      // 以createdAt排序，確保順序保持一致
      deliveryStatusArr = _.sortBy(deliveryStatusArr, 'createdAt');

      const firstDeliveryStatus = deliveryStatusArr[0] as TengineeringDeliveryStatusDto | undefined;
      const quotationItemStatusId = firstDeliveryStatus?.id;

      if (quotationItemStatusId) {
        otherWorkItemsOptionArr.push({
          label: itemName,
          value: id,
          quotationItemStatusId,
        });
      }

      // const otherWorkItems = firstDeliveryStatus?.otherWorkItems || [];
      // otherWorkItems.forEach((owi) => {
      //   arr.push({
      //     installItemId: item.id,
      //     // installItemName: item.itemName,
      //     otherInstallation: owi.otherInstallation ?? '',
      //     otherQuantity: String(owi.otherQuantity || 0),
      //     otherUnitPrice: String(owi.otherUnitPrice || 0),
      //     otherSubTotalPrice: String(owi.otherSubTotalPrice || 0),
      //     quotationItemStatusId: owi.quotationItemStatusId,
      //   });
      // });
      const otherWorkItems = firstDeliveryStatus?.otherWorkItems;

      if (otherWorkItems) {
        arr.push({
          installItemId: item.id,
          // installItemName: item.itemName,
          otherInstallation: otherWorkItems.otherInstallation ?? '',
          otherQuantity: String(otherWorkItems.otherQuantity || 0),
          otherUnitPrice: String(otherWorkItems.otherUnitPrice || 0),
          otherSubTotalPrice: String(otherWorkItems.otherSubTotalPrice || 0),
          quotationItemStatusId: otherWorkItems.quotationItemStatusId,
        });
      }

      // otherWorkItems.forEach((owi) => {
      //   arr.push({
      //     installItemId: item.id,
      //     // installItemName: item.itemName,
      //     otherInstallation: owi.otherInstallation ?? '',
      //     otherQuantity: String(owi.otherQuantity || 0),
      //     otherUnitPrice: String(owi.otherUnitPrice || 0),
      //     otherSubTotalPrice: String(owi.otherSubTotalPrice || 0),
      //     quotationItemStatusId: owi.quotationItemStatusId,
      //   });
      // });

      // deliveryStatusArr?.forEach((ds) => {
      //   const otherWorkItems = ds.otherWorkItems || [];
      //   otherWorkItems.forEach((owi) => {
      //     arr.push({
      //       installItemId: item.id,
      //       // installItemName: item.itemName,
      //       otherInstallation: owi.otherInstallation ?? '',
      //       otherQuantity: String(owi.otherQuantity || 0),
      //       otherUnitPrice: String(owi.otherUnitPrice || 0),
      //       otherSubTotalPrice: String(owi.otherSubTotalPrice || 0),
      //       quotationItemStatusId: owi.quotationItemStatusId,
      //     });
      //   });
      // });

      //
    });

    setState_otherWorkItem(arr);
    setItemNameOptionArr(otherWorkItemsOptionArr);
  }, [installItems, disabled, outsourcingId]);

  //
  const { control_table, subTotal } = useMemo(() => {
    const thead: Ttable['thead'] = {
      cellArr: [
        {
          children: config_useTable02.floorNumber.label,
          ...config_useTable02.floorNumber,
        },
        {
          children: config_useTable02.workContent.label,
          ...config_useTable02.workContent,
        },
        {
          children: config_useTable02.qty.label,
          ...config_useTable02.qty,
        },
        {
          children: config_useTable02.unitPrice.label,
          ...config_useTable02.unitPrice,
        },
        {
          children: config_useTable02.dualPrice.label,
          ...config_useTable02.dualPrice,
        },
      ],
    };

    let decimal_subTotal = new Decimal(0);

    const rowArr: Ttable['tbody']['rowArr'] = state_otherWorkItem.map((item, index) => {
      const {
        //
        installItemId,
        // installItemName,
        otherInstallation,
        otherQuantity,
        otherUnitPrice,
        otherSubTotalPrice,
      } = item;

      decimal_subTotal = decimal_subTotal.add(otherSubTotalPrice);

      const cellArr: Tcell[] = [
        {
          children: (
            <CellSelect
              //
              disabled={disabled}
              style={{ width: config_useTable02.floorNumber.width }}
              selectProps={{
                value: installItemId,
                placeholder: '',
                options: itemNameOptionArr,
                onChange: (_, option) => {
                  const theOption = option as Toption;
                  editState_otherWorkItem(index, 'installItemId', theOption.value);
                  editState_otherWorkItem(
                    index,
                    'quotationItemStatusId',
                    (theOption.quotationItemStatusId as string | undefined) ?? ''
                  );
                  // editState_otherWorkItem(index, 'installItemName', theOption.label);
                },
              }}
            />
          ),
          ...config_useTable02.floorNumber,
        },
        {
          children: (
            <CellSelect
              disabled={disabled}
              style={{ width: config_useTable02.workContent.width }}
              selectProps={{
                value: otherInstallation,
                placeholder: '工作內容...',
                options: optionsCreator_otherWorkItems(),
                onChange: (str) => {
                  editState_otherWorkItem(index, 'otherInstallation', str);
                },
              }}
            />
          ),
          ...config_useTable02.workContent,
        },
        {
          children: (
            <CellInput
              disabled={disabled}
              style={{ width: config_useTable02.qty.width }}
              inputProps={{
                value: otherQuantity,
                onChange: (e) => {
                  editState_otherWorkItem(index, 'otherQuantity', e.target.value);
                },
                type: 'number',
              }}
            />
          ),
          ...config_useTable02.qty,
        },
        {
          children: (
            <CellInput
              disabled={disabled}
              style={{ width: config_useTable02.unitPrice.width }}
              inputProps={{
                value: otherUnitPrice,
                onChange: (e) => {
                  editState_otherWorkItem(index, 'otherUnitPrice', e.target.value);
                },
                type: 'number',
              }}
            />
          ),
          ...config_useTable02.unitPrice,
        },
        {
          children: otherSubTotalPrice,
          ...config_useTable02.dualPrice,
        },
      ];

      return {
        cellArr,
      };
    });

    rowArr.push({
      cellArr: [
        {
          children: '合計',
          ...confit_public.left,
        },
        {
          children: decimal_subTotal.toNumber().toLocaleString(),
          ...confit_public.right,
        },
      ],
    });

    const tbody = {
      rowArr,
    };

    const control_table = {
      thead,
      tbody,
    };

    return {
      control_table,
      subTotal: decimal_subTotal.toNumber(),
    };
  }, [state_otherWorkItem, disabled]); // useMemo

  return {
    //
    control_table02: control_table,
    subTotal02: subTotal,
    addState_otherWorkItem,
    state_otherWorkItem,
  };
};

const useTable_total = ({ subTotal01, subTotal02 }: { subTotal01: number; subTotal02: number }) => {
  const control_table: Ttable = useMemo(() => {
    const total = new Decimal(subTotal01).add(subTotal02).toNumber();

    const thead: Ttable['thead'] = {
      cellArr: [
        {
          children: '總計',
          flex: 'auto',
          width: '100%',
        },
      ],
    };

    const rowArr: Ttable['tbody']['rowArr'] = [
      {
        cellArr: [
          {
            children: '總計',
            ...confit_public.left,
          },
          {
            children: total.toLocaleString(),
            ...confit_public.right,
          },
        ],
      },
    ];

    const tbody = {
      rowArr,
    };

    return {
      thead,
      tbody,
    };
  }, [subTotal01, subTotal02]);

  return control_table;
};

// ===========================================================================

type Tconfig = {
  [key: string]: Tconfig_table;
};

const confit_public: Tconfig = {
  left: {
    flex: 'auto',
    justifyContent: 'flex-end',
  },
  right: {
    width: 150,
    justifyContent: 'center',
  },
};

const config_useTable01: Tconfig = {
  floorNumber: {
    label: '樓層編號',
    // width:230
    flex: 'auto',
    justifyContent: 'center',
  },
  width: {
    label: '寬',
    width: 150,
    justifyContent: 'center',
  },
  height: {
    label: '高',
    width: 150,
    justifyContent: 'center',
  },
  volume: {
    label: '才數',
    width: 150,
    justifyContent: 'center',
  },
  qty: {
    label: '樘數',
    width: 150,
    justifyContent: 'center',
  },
  unitPrice: {
    label: '價格/才',
    width: 150,
    justifyContent: 'center',
  },
  dualPrice: {
    label: '小計',
    width: 150,
    justifyContent: 'center',
  },
};

const config_useTable02: Tconfig = {
  floorNumber: {
    label: '樓層編號',
    width: 230,
    justifyContent: 'center',
  },
  workContent: {
    label: '工作內容',
    flex: 'auto',
    width: '418px',
    justifyContent: 'center',
  },
  qty: {
    label: '數量',
    width: 150,
    justifyContent: 'center',
  },
  unitPrice: {
    label: '單價',
    width: 150,
    justifyContent: 'center',
  },
  dualPrice: {
    label: '小計',
    width: 150,
    justifyContent: 'center',
  },
};

// ===========================================================================
