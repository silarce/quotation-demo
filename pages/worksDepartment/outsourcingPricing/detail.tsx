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
import moment, { Moment } from 'moment';
import { nanoid } from 'nanoid';

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
  ToutsourcingPaymentDetailDto,
  TcreateOutsourcingPaymentDetailItemDto,
  TupdateOutsourcingPaymentDetailDto,
  TcreateOutsourcingPaymentDetailDto,
  TitemDetail,
  TsingleItemDetail,
  useGetOutsourcingPaymentDetail_id,
  apiPatchOutsourcingPaymentDetail,
  apiPostOutsourcingPaymentDetail,
  useGetOutsourcing_id,
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
  outsourcingId: string | undefined;
  isNew: string | undefined;
};

type Tstate_profile = {
  // outsourcingName: string;
  projectNumber: string;
  projectDate: Moment | null;
  // installer: string;
  projectName: string;
  county: string;
  district: string;
  address: string;
};

// 上面的
type Tstate_installItem = {
  key: string;

  id?: string;
  deliveryStatusId?: string;

  floorNumber: string; //樓層編號
  width: `${number}` | ''; //寬
  height: `${number}` | ''; //高
  talent: `${number}` | ''; //才數
  quantity: `${number}` | ''; //樘數
  unitPrice: `${number}` | ''; //一才價格

  totalPrice: number;
};

type Tstate_installItemDict = Record<string, Tstate_installItem>;

// 下面的
type Tstate_otherWorkItem = {
  installItemKey: string;

  floorNumber: string; //樓層編號
  content: string; //內容
  quantity: `${number}` | ''; //數量
  unitPrice: `${number}` | ''; //單價

  totalPrice: number; //小計
};

type Tstate_otherWorkItemArr = Tstate_otherWorkItem[];

type Tstate_outsourcingTotal = number;

type Tstate_otherWorkItem_old = {
  installItemId: string | undefined;
  // installItemName: string;

  otherInstallation: string;
  otherQuantity: string;
  otherUnitPrice: string;
  otherSubTotalPrice: string;
  quotationItemStatusId: string | null | undefined;
  // quotationItemStatusId: string;
};

type Tstate_installItem_old = {
  itemId: string;
  itemPrice: number;
  firstDeliveryStatusId: string;
};

// type Tstate = {
//   outsourcingName: string;
//   projectNumber: string | null;
//   projectDate: Moment | null;
//   projectName: string | null;
//   installer: string | null;
//   county: string;
//   district: string;
//   address: string;
//   otherWorkItems: Tstate_otherWorkItem[];
//   installItems: Tstate_installItem[];
// };

// =======================================================================

// MARK: START

export default function OutsourcingPricingDetail() {
  const router = useRouter();
  const query = router.query as Tquery;
  const isNew = query.isNew === 'true';
  const paymentDetailId = isNew ? undefined : query.paymentDetailId;

  // console.log(paymentDetailId);

  // ---------------------------------------------------------------------
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // ---------------------------------------------------------------------

  const { data: outsourcing_forNew, update: update_outsourcing } = useGetOutsourcing_id(
    isNew ? query.outsourcingId : undefined
  );

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
    installItems,
  } = paymentDetail ?? {};

  const {
    // outsourcing=outsourcing_forNew,
    date,
  } = outsourcingPayment ?? {};
  const twDateStr = date ? getTaiwanDateStr(date) : '';

  const outsourcing = isNew ? outsourcing_forNew : outsourcingPayment?.outsourcing;
  const outsourcingId = outsourcing?.id;

  // ---------------------------------------------------------------------

  const {
    state_profile,
    state_installItemDict,
    state_otherWorkItemArr,
    state_outsourcingTotal,

    options_installItem,

    setState_profile,

    createEditState_installItem,
    createEditState_otherWorkItem,
    addInstallItem,
    addOtherWorkItem,
    deleteInstallItem,
    deleteOtherWorkItem,
  } = useDetail({
    paymentDetail,
    disabled,
  });

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

  useEffect(() => {
    update_outsourcing();
  }, [isNew, query.outsourcingId]);

  // endregion useEffect

  // ---------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer isLoading_subLayer={isLoading_outsourcingPaymentDetail}>
      <PageHeader02 tag="外包計價單明細" panelList={panelList} />
      <div className={scss.main}>
        {/*  */}
        <div className={scss.profile}>
          <InputSel caption={'外包廠商'} showBaseline="invisible" node={outsourcing?.name} />
          <InputSel
            caption={'工程編號'}
            disabled={isNew ? disabled : true}
            showBaseline="auto"
            inputProps={{
              props: {
                placeholder: '',
                value: state_profile.projectNumber,
                onChange: (e) => {
                  setState_profile((prev) => ({ ...prev, projectNumber: e.target.value }));
                },
              },
            }}
          />
          <InputSel
            caption={'工程日期'}
            disabled={isNew ? disabled : true}
            showBaseline="auto"
            datePickerProps={{
              props: {
                value: state_profile.projectDate,
                onChange: (date) => {
                  setState_profile((prev) => ({ ...prev, projectDate: date }));
                },
              },
            }}
          />
          <InputSel caption={'安裝人員'} showBaseline="invisible" node={outsourcing?.name} />
          <InputSel
            caption={'工程名稱'}
            className="col-span-2"
            disabled={isNew ? disabled : true}
            showBaseline="auto"
            inputProps={{
              props: {
                placeholder: '',
                value: state_profile.projectName,
                onChange: (e) => {
                  setState_profile((prev) => ({ ...prev, projectName: e.target.value }));
                },
              },
            }}
          />
          <AddressBar
            inputSelProps={{
              caption: '工程地址',
              className: 'col-span-2',
              disabled: isNew ? disabled : true,
              showBaseline: 'auto',
            }}
            addressProps={{
              county: {
                wrapperClassName: scss.select,
                props: {
                  menuPortalTarget: undefined,
                  placeholder: '',
                  isDisabled: isNew ? disabled : true,
                  value: { value: state_profile.county, label: state_profile.county },
                  onChange: (option) => {
                    const value = option?.value ?? '';

                    setState_profile((prev) => ({
                      ...prev,
                      county: value,
                      district: '',
                    }));
                  },
                },
              },
              district: {
                wrapperClassName: scss.select,
                props: {
                  menuPortalTarget: undefined,
                  placeholder: '',
                  isDisabled: isNew ? disabled : true,
                  value: { value: state_profile.district, label: state_profile.district },
                  onChange: (option) => {
                    const value = option?.value ?? '';

                    setState_profile((prev) => ({
                      ...prev,
                      district: value,
                    }));
                  },
                },
              },
              address: {
                props: {
                  placeholder: '',
                  readOnly: isNew ? disabled : true,
                  value: state_profile.address,
                  onChange: (e) => {
                    setState_profile((prev) => ({ ...prev, address: e.target.value }));
                  },
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

// MARK: useDetail
const useDetail = ({
  paymentDetail,
  disabled,
}: {
  paymentDetail: ToutsourcingPaymentDetailDto | undefined;
  disabled: boolean;
}) => {
  const defaultState = useDetail_default({ paymentDetail });

  const [state_profile, setState_profile] = useState<Tstate_profile>(defaultState.defaultState_profile);
  const [state_installItemDict, setState_installItemDict] = useState<Tstate_installItemDict>(
    defaultState.defaultState_installItemDict
  );
  const [state_otherWorkItemArr, setState_otherWorkItemArr] = useState<Tstate_otherWorkItemArr>(
    defaultState.defaultState_otherWorkItemArr
  );
  const [state_outsourcingTotal, setState_outsourcingTotal] = useState<Tstate_outsourcingTotal>(
    defaultState.defaultState_outsourcingTotal
  );

  // ------------------------------------------------------------------------
  const options_installItem = useMemo(() => {
    const options: Toption[] = Object.entries(state_installItemDict).map(([key, item]) => {
      return {
        value: key,
        label: item.floorNumber,
        floorNumber: item.floorNumber,
      };
    });

    return options;
  }, [state_installItemDict]);

  // ------------------------------------------------------------------------

  const calcOutsourcingTotal = () => {
    let total_d = new Decimal(0);
    Object.values(state_installItemDict).forEach((item) => {
      total_d = total_d.add(item.totalPrice);
    });

    state_otherWorkItemArr.forEach((item) => {
      total_d = total_d.add(item.totalPrice);
    });

    return total_d.toNumber();
  };

  const addInstallItem = () => {
    const key = nanoid();
    setState_installItemDict((prev) => {
      const copy = { ...prev };
      copy[key] = emptyState_installItem(key);

      return copy;
    });
    calcOutsourcingTotal();
  };

  const addOtherWorkItem = (state_installItem: Tstate_installItem) => {
    setState_otherWorkItemArr((prev) => {
      return [
        ...prev,
        emptyState_otherWorkItem({
          installItemKey: state_installItem.key,
          floorNumber: state_installItem.floorNumber,
        }),
      ];
    });
    calcOutsourcingTotal();
  };

  const deleteInstallItem = (key: string) => {
    setState_installItemDict((prev) => {
      const copy = { ...prev };
      delete copy[key];

      return copy;
    });

    setState_otherWorkItemArr((prev) => {
      return prev.filter((item) => item.installItemKey !== key);
    });
    calcOutsourcingTotal();
  };

  const deleteOtherWorkItem = (index: number) => {
    setState_otherWorkItemArr((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);

      return copy;
    });
    calcOutsourcingTotal();
  };

  const createEditState_installItem = (key: string) => {
    return (setState: React.SetStateAction<Tstate_installItem>) => {
      setState_installItemDict((prev) => {
        const copy = { ...prev };
        const targetItem = copy[key];

        if (typeof setState === 'function') {
          copy[key] = setState(targetItem);
        } else {
          copy[key] = setState;
        }

        return copy;
      });
    };
  };

  const createEditState_otherWorkItem = (index: number) => {
    return (setState: React.SetStateAction<Tstate_otherWorkItem>) => {
      setState_otherWorkItemArr((prev) => {
        const copy = [...prev];
        const targetItem = copy[index];

        if (typeof setState === 'function') {
          copy[index] = setState(targetItem);
        } else {
          copy[index] = setState;
        }

        return copy;
      });
    };
  };

  // ------------------------------------------------------------------------
  useEffect(() => {
    setState_profile(defaultState.defaultState_profile);
    setState_installItemDict(defaultState.defaultState_installItemDict);
    setState_otherWorkItemArr(defaultState.defaultState_otherWorkItemArr);
    setState_outsourcingTotal(defaultState.defaultState_outsourcingTotal);
  }, [defaultState, disabled]);

  //

  return {
    state_profile,
    state_installItemDict,
    state_otherWorkItemArr,
    state_outsourcingTotal,

    options_installItem,

    setState_profile,

    createEditState_installItem,
    createEditState_otherWorkItem,
    addInstallItem,
    addOtherWorkItem,
    deleteInstallItem,
    deleteOtherWorkItem,
  };
  //
};

// MARK:useDetail_default
const useDetail_default = ({ paymentDetail }: { paymentDetail: ToutsourcingPaymentDetailDto | undefined }) => {
  const defaultState = useMemo(() => {
    if (!paymentDetail) {
      return {
        defaultState_profile: emptyState_profile(),
        defaultState_installItemDict: {},
        defaultState_otherWorkItemArr: [],
        defaultState_outsourcingTotal: 0,
      };
    }

    const { engineeringContact, outsourcingPayment, installItems, itemDetail } = paymentDetail ?? {};

    let {
      //
      projectNumber,
      projectName,
      projectCounty,
      projectDistrict,
      projectAddress,
      projectDate,
    } = paymentDetail ?? {};

    // let outsourcingName = '無property';
    // let installer = '無property';

    if (engineeringContact) {
      projectNumber = engineeringContact.projectNumber;
      projectName = engineeringContact?.projectName ?? '';
      projectCounty = engineeringContact.county;
      projectDistrict = engineeringContact.district;
      projectAddress = engineeringContact.address;
      projectDate = outsourcingPayment?.date || null;
      // outsourcingName = outsourcingPayment?.outsourcing?.name ?? '';
      // installer = outsourcingPayment?.outsourcing?.name ?? '';
    }

    const defaultState_profile: Tstate_profile = {
      // outsourcingName,
      projectNumber: projectNumber ?? '',
      projectDate: projectDate ? moment(projectDate) : null,
      // installer,
      projectName: projectName ?? '',
      county: projectCounty ?? '',
      district: projectDistrict ?? '',
      address: projectAddress ?? '',
    };

    const defaultState_installItemDict: Tstate_installItemDict = {};
    const defaultState_otherWorkItemArr: Tstate_otherWorkItemArr = [];

    if (engineeringContact) {
      (installItems ?? []).forEach((item) => {
        const {
          id,
          itemName,
          itemPrice,

          fullWidth,
          height,
          volume,

          deliveryStatus,
        } = item;

        const firstDeliveryStatus = deliveryStatus[0];

        const otherWorkItemArr = (() => {
          const { otherWorkItems } = firstDeliveryStatus;

          if (!otherWorkItems) {
            return [];
          } else if (Array.isArray(otherWorkItems)) {
            return otherWorkItems;
          } else {
            return [otherWorkItems];
          }
        })();

        const key = id;

        const state_installItem: Tstate_installItem = {
          key,
          id: id,
          deliveryStatusId: firstDeliveryStatus.id,
          floorNumber: itemName, // 沒有放錯，itemName要放進floorNumber
          width: `${fullWidth}`,
          height: `${height}`,
          talent: `${volume || 0}` as `${number}`,
          quantity: '1', // 不知道為什麼是'1'
          unitPrice: `${itemPrice || 0}`,
          totalPrice: -1,
        };
        state_installItem.totalPrice = new Decimal(state_installItem.talent)
          .mul(state_installItem.quantity)
          .mul(state_installItem.unitPrice)
          .toNumber();

        otherWorkItemArr.forEach((item) => {
          const { otherQuantity, otherUnitPrice } = item;
          const totalPrice = new Decimal(otherQuantity || 0).mul(otherUnitPrice || 0).toNumber();

          const state_otherWorkItem: Tstate_otherWorkItem = {
            installItemKey: key,

            floorNumber: state_installItem.floorNumber,
            content: item.otherInstallation || '',
            quantity: `${item.otherQuantity || 0}`,
            unitPrice: `${item.otherUnitPrice}`,

            totalPrice,
          };

          defaultState_otherWorkItemArr.push(state_otherWorkItem);
        });

        defaultState_installItemDict[key] = state_installItem;
      });
    } else {
      (itemDetail ?? []).forEach((item) => {
        const key = nanoid();

        const { talent, quantity, unitPrice, singleItemDetail } = item;
        const totalPrice = new Decimal(talent).mul(quantity).mul(unitPrice).toNumber();
        const state_installItem: Tstate_installItem = {
          key,
          floorNumber: item.floorNumber,
          width: `${item.width}`,
          height: `${item.height}`,
          talent: `${talent}`,
          quantity: `${quantity}`,
          unitPrice: `${unitPrice}`,
          totalPrice,
        };

        defaultState_installItemDict[key] = state_installItem;

        singleItemDetail.forEach((item) => {
          const { floorNumber, content, quantity, unitPrice } = item;

          const totalPrice = new Decimal(quantity).mul(unitPrice).toNumber();

          const state_otherWorkItem: Tstate_otherWorkItem = {
            installItemKey: key,
            floorNumber: floorNumber,
            content,
            quantity: `${quantity}`,
            unitPrice: `${unitPrice}`,
            totalPrice,
          };

          defaultState_otherWorkItemArr.push(state_otherWorkItem);
        });
      });
    }

    //
    const defaultState_outsourcingTotal: Tstate_outsourcingTotal = paymentDetail.outsourcingTotal;

    //
    return {
      defaultState_profile,
      defaultState_installItemDict,
      defaultState_otherWorkItemArr,
      defaultState_outsourcingTotal,
    };
  }, [paymentDetail]);

  return defaultState;
};

// MARK:useTable01
const useTable01 = ({
  //
  installItems,
  disabled,
}: {
  installItems: TquotationProductItemDto[] | undefined;
  disabled?: boolean;
}) => {
  const thInstallItems = useMemo(() => {
    return installItems ?? [];
  }, [installItems]);

  const [state_installItem, setState_installItem] = useState<Tstate_installItem_old[]>([]);

  useEffect(() => {
    if (!disabled) {
      return;
    }

    const newState_installItem: Tstate_installItem_old[] = thInstallItems.map((item) => {
      return {
        itemId: item.id,
        itemPrice: item.itemPrice || 0,
        firstDeliveryStatusId: item.deliveryStatus[0].id,
      };
    });

    setState_installItem(newState_installItem);
  }, [thInstallItems, disabled]);

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
      const item = thInstallItems[index];
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

// MARK:useTable02
const useTable02 = ({
  //
  installItems,
  disabled,
  outsourcingId,
}: {
  installItems: TquotationProductItemDto[] | undefined;
  disabled?: boolean;
  outsourcingId: string | undefined;
}) => {
  //

  const [itemNameOptionArr, setItemNameOptionArr] = useState<Toption[]>([]);

  const [state_otherWorkItem, setState_otherWorkItem] = useState<Tstate_otherWorkItem_old[]>([]);

  const editState_otherWorkItem = (index: number, key: keyof Tstate_otherWorkItem_old, value: string) => {
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

    const arr: Tstate_otherWorkItem_old[] = [];
    const otherWorkItemsOptionArr: Toption[] = [];

    installItems?.forEach((item) => {
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

      // const otherWorkItems = firstDeliveryStatus?.otherWorkItems;
      const otherWorkItemArr = (() => {
        if (!firstDeliveryStatus?.otherWorkItems) {
          return [];
        } else if (Array.isArray(firstDeliveryStatus.otherWorkItems)) {
          return firstDeliveryStatus.otherWorkItems;
        } else {
          return [firstDeliveryStatus.otherWorkItems];
        }
      })();

      otherWorkItemArr.forEach((item) => {
        arr.push({
          installItemId: id,
          // installItemName: item.itemName,
          otherInstallation: item.otherInstallation ?? '',
          otherQuantity: String(item.otherQuantity || 0),
          otherUnitPrice: String(item.otherUnitPrice || 0),
          otherSubTotalPrice: String(item.otherSubTotalPrice || 0),
          quotationItemStatusId: item.quotationItemStatusId,
        });
      });

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

const emptyState_profile = () => {
  const state_profile: Tstate_profile = {
    // outsourcingName: '',
    projectNumber: '',
    projectDate: null,
    // installer: '',
    projectName: '',
    county: '',
    district: '',
    address: '',
  };

  return state_profile;
};

const emptyState_installItem = (key: string) => {
  const state_installItem: Tstate_installItem = {
    key,
    floorNumber: '',
    width: '',
    height: '',
    talent: '',
    quantity: '',
    unitPrice: '',
    totalPrice: 0,
  };

  return state_installItem;
};

const emptyState_otherWorkItem = ({ installItemKey, floorNumber }: { installItemKey: string; floorNumber: string }) => {
  const state_otherWorkItem: Tstate_otherWorkItem = {
    installItemKey,
    floorNumber,
    content: '',
    quantity: '',
    unitPrice: '',
    totalPrice: 0,
  };

  return state_otherWorkItem;
};
