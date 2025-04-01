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
import Profile from 'components/page/worksDepartment/outsourcingPricing/detail/profile';
import InstallItem from 'components/page/worksDepartment/outsourcingPricing/detail/installItem';
import OtherWorkItem from 'components/page/worksDepartment/outsourcingPricing/detail/otherWorkItem';
import DetailTotal from 'components/page/worksDepartment/outsourcingPricing/detail/detailTotal';

// icon
import { IconAddCircle } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './detail.module.scss';

// api
import {
  ToutsourcingPaymentDetailDto,
  TupdateOutsourcingPaymentDetailDto,
  TcreateOutsourcingPaymentDetailDto,
  TitemDetail,
  TsingleItemDetail,
  useGetOutsourcingPaymentDetail_id,
  apiPostOutsourcingPaymentDetail,
  useGetOutsourcing_id,
  apiPatchOutsourcingPaymentDetail_updateRetainage,
} from 'js/api/api_outsourcing';

// utils
import { calcProductVolume } from 'js/utils/product/calc';

// type
import { Toption } from 'js/utils/options/options';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// =======================================================================

type Tquery = {
  paymentDetailId: string | undefined;
  outsourcingId: string | undefined;
  paymentId: string | undefined;
  isNew: string | undefined;
};

type Tstate_profile = {
  projectNumber: string;
  projectDate: Moment | null;
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

  totalPrice: number; // 這是虛值，後端沒有這個property
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

type TsetState_installItem = (
  setStateActopm: React.SetStateAction<Tstate_installItem>,
  option?: {
    calcTotalPrice?: boolean;
  }
) => void;
type TcreateSetState_installItem = (key: string) => TsetState_installItem;

type TsetState_otherWorkItem = (
  setStateActopm: React.SetStateAction<Tstate_otherWorkItem>,
  option?: {
    calcTotalPrice?: boolean;
  }
) => void;
type TcreateSetState_otherWorkItem = (index: number) => TsetState_otherWorkItem;

type Tapi_useDetail = ReturnType<typeof useDetail>;

// =======================================================================

// MARK: START

export default function OutsourcingPricingDetail() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { paymentId } = query;
  const isNew = query.isNew === 'true';
  const paymentDetailId = isNew ? undefined : query.paymentDetailId;

  // ---------------------------------------------------------------------
  const [disabled, setDisabled] = useState(!isNew);
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
    engineeringContactId,
    engineeringContact,
    outsourcingPayment,
    // installItems,
    // itemDetail,
  } = paymentDetail ?? {};

  const outsourcing = isNew ? outsourcing_forNew : outsourcingPayment?.outsourcing;
  const outsourcingId = outsourcing?.id;
  const isPaymentCleared = outsourcingPayment?.isPaymentCleared;

  const isFromUserCreat = !!engineeringContactId;
  const isAllowEditProfile = isNew || isFromUserCreat;

  // ---------------------------------------------------------------------

  const api_useDetail = useDetail({
    paymentDetail,
    disabled,
    outsourcingId,
  });

  const {
    state_installItemDict,
    state_outsourcingTotal,
    addInstallItem,
    addOtherWorkItem,
    checkOtherWorkItemArr,
    groupOtherWorkItem,
    resetState,
  } = api_useDetail;

  const { state_profile, setState_profile, resetProfile } = useProfile({ paymentDetail });

  // ---------------------------------------------------------------------
  // region REQUEST

  const handle_reqPatchOutsourcingPaymentDetail = async () => {
    if (!paymentDetailId) {
      return;
    }

    if (!checkOtherWorkItemArr()) {
      myAlert.warning({
        title: '特殊工作項目錯誤',
        content: '樓層編號不得為空白',
      });

      return;
    }

    setIsLoading(true);

    try {
      await reqPatchOutsourcingPaymentDetail({
        paymentDetailId,
        otherWorkItemGroup: groupOtherWorkItem(),
        // isFromUserCreat,
        engineeringContactId: engineeringContact?.id,

        state_installItemDict,
        state_outsourcingTotal,
      });
      await update();
      setDisabled(true);
    } catch (error) {}

    setIsLoading(false);
  };

  const handle_reqPost = async () => {
    if (!paymentId) {
      myAlert.warning({
        title: '外包計價單錯誤',
        content: '沒有paymentId',
      });

      return;
    }

    if (!checkOtherWorkItemArr()) {
      myAlert.warning({
        title: '特殊工作項目錯誤',
        content: '樓層編號不得為空白',
      });

      return;
    }

    try {
      const res = await reqPost({
        otherWorkItemGroup: groupOtherWorkItem(),
        state_installItemDict,
        state_outsourcingTotal,
        state_profile,
        paymentId,
      });

      router.replace({
        query: {
          paymentDetailId: res.id,
        },
      });
      setDisabled(true);
    } catch (err) {}
  };

  // ---------------------------------------------------------------------

  // region PROPS

  const panelList_disabled: TpanelList = [
    !isPaymentCleared
      ? {
          type: 'redButton',
          label: '編輯',
          onClick: () => {
            setDisabled(false);
          },
        }
      : null,
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
      onClick: isNew ? handle_reqPost : handle_reqPatchOutsourcingPaymentDetail,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        isNew ? router.back() : setDisabled(true);
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

  useEffect(() => {
    resetProfile();
    resetState();
  }, [disabled]);

  // endregion useEffect

  // ---------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer isLoading_subLayer={isLoading || isLoading_outsourcingPaymentDetail}>
      <PageHeader02 tag="外包計價單明細" panelList={panelList} />
      <div className={scss.main}>
        {/*  */}

        <Profile
          isAllowEditProfile={isAllowEditProfile}
          outsourcingName={outsourcing?.name ?? ''}
          disabled={disabled}
          state={state_profile}
          setState={setState_profile}
        />
        {/*  */}

        <div className="mt-10">
          <IconAddCircle
            className={classNames('mb-2', (disabled || !isAllowEditProfile) && 'invisible')}
            onClick={() => {
              !disabled && addInstallItem();
            }}
          />
          <InstallItem className={'w-[1100px]'} api_useDetail={api_useDetail} disabled={disabled} />
        </div>
        <br />
        <div>
          <IconAddCircle
            className={classNames('mb-2', disabled && 'invisible')}
            onClick={() => {
              !disabled && addOtherWorkItem();
            }}
          />
          <OtherWorkItem className={'w-[1100px]'} api_useDetail={api_useDetail} disabled={disabled} />
        </div>
        <br />
        <DetailTotal detailTotal={state_outsourcingTotal.toLocaleString()} />

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
  outsourcingId,
}: {
  paymentDetail: ToutsourcingPaymentDetailDto | undefined;
  disabled: boolean;
  outsourcingId: string | undefined;
}) => {
  const defaultState = useDetail_default({ paymentDetail, outsourcingId });

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
    let options: Toption[] = Object.entries(state_installItemDict).map(([key, item]) => {
      return {
        value: key,
        label: item.floorNumber,
        floorNumber: item.floorNumber,
      };
    });
    options = options.filter((item) => !!item.label);

    return options;
  }, [state_installItemDict]);

  const total_installItem = useMemo(() => {
    let total_d = new Decimal(0);
    Object.values(state_installItemDict).forEach((item) => {
      total_d = total_d.add(item.totalPrice);
    });

    return total_d.toNumber();
  }, [state_installItemDict]);

  const total_otherWorkItem = useMemo(() => {
    let total_d = new Decimal(0);
    state_otherWorkItemArr.forEach((item) => {
      total_d = total_d.add(item.totalPrice);
    });

    return total_d.toNumber();
  }, [state_otherWorkItemArr]);

  // ------------------------------------------------------------------------

  const addInstallItem = () => {
    const key = nanoid();
    setState_installItemDict((prev) => {
      const copy = { ...prev };
      copy[key] = emptyState_installItem(key);

      return copy;
    });
  };

  const addOtherWorkItem = () => {
    setState_otherWorkItemArr((prev) => {
      return [...prev, emptyState_otherWorkItem()];
    });
  };

  const deleteInstallItem = (key: string) => {
    setState_installItemDict((prev) => {
      const copy = { ...prev };
      delete copy[key];

      return copy;
    });

    setState_otherWorkItemArr((prev) => {
      let copy = [...prev];
      copy = copy.map((item) => {
        if (item.installItemKey === key) {
          item.installItemKey = '';
        }

        return item;
      });

      return copy;
    });
  };

  const deleteOtherWorkItem = (index: number) => {
    setState_otherWorkItemArr((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);

      return copy;
    });
  };

  const createEditState_installItem: TcreateSetState_installItem = (key: string) => {
    const setState_installItem: TsetState_installItem = (setStateAction, { calcTotalPrice: _calcTotalPrice } = {}) => {
      setState_installItemDict((prev) => {
        const copy = { ...prev };
        const targetItem = copy[key];

        if (typeof setStateAction === 'function') {
          copy[key] = setStateAction(targetItem);
        } else {
          copy[key] = setStateAction;
        }

        if (_calcTotalPrice) {
          copy[key].totalPrice = calcTotalPrice({
            talent: copy[key].talent || 0,
            quantity: copy[key].quantity || 0,
            unitPrice: copy[key].unitPrice || 0,
          });
        }

        return copy;
      });
    };

    return setState_installItem;
  };

  const createEditState_otherWorkItem: TcreateSetState_otherWorkItem = (index: number) => {
    const setState_otherWorkItem: TsetState_otherWorkItem = (
      //
      setStateAction: React.SetStateAction<Tstate_otherWorkItem>,
      { calcTotalPrice: _calcTotalPrice } = {}
    ) => {
      setState_otherWorkItemArr((prev) => {
        const copy = [...prev];
        const targetItem = copy[index];

        if (typeof setStateAction === 'function') {
          copy[index] = setStateAction(targetItem);
        } else {
          copy[index] = setStateAction;
        }

        if (_calcTotalPrice) {
          copy[index].totalPrice = calcTotalPrice({
            quantity: copy[index].quantity || 0,
            unitPrice: copy[index].unitPrice || 0,
          });
        }

        return copy;
      });
    };

    return setState_otherWorkItem;
  };

  const checkOtherWorkItemArr = () => {
    return state_otherWorkItemArr.every((item) => !!item.installItemKey);
  };

  const groupOtherWorkItem = () => {
    return _.groupBy(state_otherWorkItemArr, 'installItemKey');
  };

  const checkInstallItemId = () => {
    return Object.values(state_installItemDict).every((item) => !!item.id);
  };

  const resetState = () => {
    setState_installItemDict(defaultState.defaultState_installItemDict);
    setState_otherWorkItemArr(defaultState.defaultState_otherWorkItemArr);
    setState_outsourcingTotal(defaultState.defaultState_outsourcingTotal);
  };

  // ------------------------------------------------------------------------

  useEffect(resetState, [defaultState]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const total = new Decimal(total_installItem).add(total_otherWorkItem).toNumber();
    setState_outsourcingTotal(total);
  }, [total_installItem, total_otherWorkItem]);

  // ------------------------------------------------------------------------

  return {
    state_installItemDict,
    state_otherWorkItemArr,
    state_outsourcingTotal,

    options_installItem,
    total_installItem,
    total_otherWorkItem,

    createEditState_installItem,
    createEditState_otherWorkItem,
    addInstallItem,
    addOtherWorkItem,
    deleteInstallItem,
    deleteOtherWorkItem,

    checkOtherWorkItemArr,
    groupOtherWorkItem,
    checkInstallItemId,
    //
    resetState,
  };
  //
};

// MARK:useDetail_default
const useDetail_default = ({
  paymentDetail,
  outsourcingId,
}: {
  paymentDetail: ToutsourcingPaymentDetailDto | undefined;
  outsourcingId: string | undefined;
}) => {
  const defaultState = useMemo(() => {
    if (!paymentDetail || !outsourcingId) {
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

    if (engineeringContact) {
      projectNumber = engineeringContact.projectNumber;
      projectName = engineeringContact?.projectName ?? '';
      projectCounty = engineeringContact.county;
      projectDistrict = engineeringContact.district;
      projectAddress = engineeringContact.address;
      projectDate = outsourcingPayment?.date || null;
    }

    const defaultState_profile: Tstate_profile = {
      projectNumber: projectNumber ?? '',
      projectDate: projectDate ? moment(projectDate) : null,
      projectName: projectName ?? '',
      county: projectCounty ?? '',
      district: projectDistrict ?? '',
      address: projectAddress ?? '',
    };

    const defaultState_installItemDict: Tstate_installItemDict = {};
    const defaultState_otherWorkItemArr: Tstate_otherWorkItemArr = [];

    if (
      // engineeringContact
      !itemDetail
    ) {
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

        let theDeliveryStatus = deliveryStatus.filter((item) => {
          return item.installerOutsourcingId === outsourcingId;
        });
        theDeliveryStatus = _.sortBy(theDeliveryStatus, 'createdAt');

        const firstDeliveryStatus = theDeliveryStatus[0];

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

        state_installItem.totalPrice = calcTotalPrice({
          talent: state_installItem.talent || 0,
          quantity: state_installItem.quantity || 0,
          unitPrice: state_installItem.unitPrice || 0,
        });

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

// MARK:useProfile
const useProfile = ({ paymentDetail }: { paymentDetail: ToutsourcingPaymentDetailDto | undefined }) => {
  const defaultState_profile = useDefault_profile({ paymentDetail });

  const [state_profile, setState_profile] = useState<Tstate_profile>(defaultState_profile);

  const resetProfile = () => {
    setState_profile(defaultState_profile);
  };

  useEffect(() => {
    setState_profile(defaultState_profile);
  }, [defaultState_profile]);

  return {
    state_profile,
    setState_profile,
    resetProfile,
  };
};

// MARK:useDefault_profile
const useDefault_profile = ({ paymentDetail }: { paymentDetail: ToutsourcingPaymentDetailDto | undefined }) => {
  return useMemo(() => {
    if (!paymentDetail) {
      return emptyState_profile();
    }

    const { engineeringContact, outsourcingPayment } = paymentDetail ?? {};

    let {
      //
      projectNumber,
      projectName,
      projectCounty,
      projectDistrict,
      projectAddress,
      projectDate,
    } = paymentDetail ?? {};

    // 原本一定是先有工程聯絡單才有paymentDetail
    // 但某天說要不經過工程聯絡單直接產生paymentDetail
    // 所以才會在上面取值後下面再判斷代入

    if (engineeringContact) {
      projectNumber = engineeringContact.projectNumber;
      projectName = engineeringContact?.projectName ?? '';
      projectCounty = engineeringContact.county;
      projectDistrict = engineeringContact.district;
      projectAddress = engineeringContact.address;
      projectDate = outsourcingPayment?.date || null;
    }

    const defaultState_profile: Tstate_profile = {
      projectNumber: projectNumber ?? '',
      projectDate: projectDate ? moment(projectDate) : null,
      projectName: projectName ?? '',
      county: projectCounty ?? '',
      district: projectDistrict ?? '',
      address: projectAddress ?? '',
    };

    return defaultState_profile;
  }, [paymentDetail]);
};

// ==========================================================================
// ==========================================================================
// ==========================================================================

// MARK: API
const reqPatchOutsourcingPaymentDetail = async ({
  paymentDetailId,
  otherWorkItemGroup,
  engineeringContactId = null,
  state_installItemDict,
  state_outsourcingTotal,
}: {
  paymentDetailId: string;
  otherWorkItemGroup: _.Dictionary<Tstate_otherWorkItem[]>;
  engineeringContactId: string | undefined | null;
  state_installItemDict: Tstate_installItemDict;
  state_outsourcingTotal: number;
}) => {
  const itemDetailArr: TitemDetail[] = Object.values(state_installItemDict).map((state_installItem) => {
    const { key, unitPrice } = state_installItem;

    const singleItemDetail: TsingleItemDetail[] = otherWorkItemGroup[key]?.map((state_otherWorkItem) => {
      const { content, quantity, unitPrice } = state_otherWorkItem;

      const singleItemDetail: TsingleItemDetail = {
        floorNumber: state_otherWorkItem.floorNumber,
        content,
        quantity: Number(quantity || 0),
        unitPrice: Number(unitPrice || 0),
      };

      return singleItemDetail;
    });

    const itemDetail: TitemDetail = {
      floorNumber: state_installItem.floorNumber,
      width: Number(state_installItem.width || 0),
      height: Number(state_installItem.height || 0),
      talent: Number(state_installItem.talent || 0),
      quantity: Number(state_installItem.quantity || 0),
      unitPrice: Number(unitPrice || 0),
      singleItemDetail: singleItemDetail,
    };

    return itemDetail;
  });
  const body: TupdateOutsourcingPaymentDetailDto = {
    engineeringContactId: engineeringContactId,
    installItems: null,
    outsourcingTotal: state_outsourcingTotal,
    itemDetail: itemDetailArr,
  };

  return apiPatchOutsourcingPaymentDetail_updateRetainage(paymentDetailId, body);
};

const reqPost = async ({
  otherWorkItemGroup,
  state_installItemDict,
  state_outsourcingTotal,
  state_profile,
  paymentId,
}: {
  otherWorkItemGroup: _.Dictionary<Tstate_otherWorkItem[]>;
  state_installItemDict: Tstate_installItemDict;
  state_outsourcingTotal: number;
  state_profile: Tstate_profile;
  paymentId: string;
}) => {
  const itemDetailArr: TitemDetail[] = Object.values(state_installItemDict).map((state_installItem) => {
    const { key, floorNumber, width, height, talent, quantity, unitPrice } = state_installItem;

    const singleItemDetailArr = Object.values(otherWorkItemGroup[key]).map((state_otherWorkItem) => {
      const { floorNumber, content, quantity, unitPrice } = state_otherWorkItem;

      const singleItemDetail: TsingleItemDetail = {
        floorNumber,
        content,
        quantity: Number(quantity || 0),
        unitPrice: Number(unitPrice || 0),
      };

      return singleItemDetail;
    });

    const itemDetail: TitemDetail = {
      floorNumber,
      width: Number(width || 0),
      height: Number(height || 0),
      talent: Number(talent || 0),
      quantity: Number(quantity || 0),
      unitPrice: Number(unitPrice || 0),
      singleItemDetail: singleItemDetailArr,
    };

    return itemDetail;

    //
  });

  const body: TcreateOutsourcingPaymentDetailDto = {
    engineeringContactId: null,

    projectNumber: state_profile.projectNumber,
    projectName: state_profile.projectName,
    projectCounty: state_profile.county,
    projectDistrict: state_profile.district,
    projectAddress: state_profile.address,
    projectDate: state_profile.projectDate?.toISOString() || null,
    installItems: [],
    outsourcingTotal: state_outsourcingTotal,
    itemDetail: itemDetailArr,
  };

  return apiPostOutsourcingPaymentDetail(paymentId, body);
};

// ==========================================================================

const emptyState_profile = () => {
  const state_profile: Tstate_profile = {
    projectNumber: '',
    projectDate: null,
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

const emptyState_otherWorkItem = () => {
  const state_otherWorkItem: Tstate_otherWorkItem = {
    installItemKey: '',
    floorNumber: '',
    content: '',
    quantity: '',
    unitPrice: '',
    totalPrice: 0,
  };

  return state_otherWorkItem;
};

const calcTotalPrice = ({
  talent = 1,
  quantity,
  unitPrice,
}: {
  talent?: `${number}` | number | '';
  quantity: `${number}` | number | '';
  unitPrice: `${number}` | number | '';
}) => {
  return new Decimal(talent || 0)
    .mul(quantity || 0)
    .mul(unitPrice || 0)
    .toDecimalPlaces(0)
    .toNumber();
};

const calcTalent = ({ width, height }: { width: `${number}` | number | ''; height: `${number}` | number | '' }) => {
  const area = new Decimal(width || 0).mul(height || 0).toNumber();

  return calcProductVolume(area);
};

// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================

export type {
  Tstate_installItem,
  Tstate_installItemDict,
  Tstate_otherWorkItem,
  Tstate_otherWorkItemArr,
  Tstate_outsourcingTotal,
  TsetState_installItem,
  TcreateSetState_otherWorkItem,
  Tapi_useDetail,
  TsetState_otherWorkItem,
};

export { calcTotalPrice, calcTalent };
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================

// 暫時先留著，免得哪天說要改回來 20250401
// 應該半年(20251001)後就可以刪了
// const reqPatchOutsourcingPaymentDetail_old = async ({
//   paymentDetailId,
//   otherWorkItemGroup,
//   isFromUserCreat,
//   engineeringContactId,
//   state_installItemDict,
//   state_outsourcingTotal,
// }: {
//   paymentDetailId: string;
//   otherWorkItemGroup: _.Dictionary<Tstate_otherWorkItem[]>;
//   isFromUserCreat: boolean;
//   engineeringContactId: string | undefined;
//   state_installItemDict: Tstate_installItemDict;
//   state_outsourcingTotal: number;
// }) => {
//   let body: TupdateOutsourcingPaymentDetailDto;

//   if (!isFromUserCreat) {
//     if (!engineeringContactId) {
//       myAlert.err({ title: '更新外包計價單錯誤', content: '沒有engineeringContact.id' });

//       return;
//     }

//     const installItems: TcreateOutsourcingPaymentDetailItemDto[] = Object.values(state_installItemDict).map(
//       (state_installItem) => {
//         const { key, id, deliveryStatusId, unitPrice, totalPrice } = state_installItem;

//         if (!id) {
//           console.error(state_installItem);

//           throw new Error('reqPatchOutsourcingPaymentDetail: 沒有installItem.id');
//         }

//         const otherWorkItems: ToutsourcingPaymentDetailItemDto[] = otherWorkItemGroup[key]?.map(
//           (state_otherWorkItem) => {
//             const { content, quantity, unitPrice, totalPrice } = state_otherWorkItem;
//             const otherWorkItem: ToutsourcingPaymentDetailItemDto = {
//               otherInstallation: content,
//               otherQuantity: Number(quantity || 0),
//               otherUnitPrice: Number(unitPrice || 0),
//               otherSubTotalPrice: totalPrice,
//               quotationItemStatusId: deliveryStatusId,
//             };

//             return otherWorkItem;
//           }
//         );

//         const installItem: TcreateOutsourcingPaymentDetailItemDto = {
//           itemId: id,
//           itemPrice: Number(unitPrice || 0),
//           otherWorkItems: otherWorkItems,
//           otherWorkItemTotal: totalPrice,
//         };

//         return installItem;
//       }
//     );

//     body = {
//       engineeringContactId: engineeringContactId,
//       installItems: installItems,
//       outsourcingTotal: state_outsourcingTotal,
//     };
//   } else {
//     const itemDetailArr: TitemDetail[] = Object.values(state_installItemDict).map((state_installItem) => {
//       const { key, unitPrice } = state_installItem;

//       const singleItemDetail: TsingleItemDetail[] = otherWorkItemGroup[key]?.map((state_otherWorkItem) => {
//         const { content, quantity, unitPrice } = state_otherWorkItem;

//         const singleItemDetail: TsingleItemDetail = {
//           floorNumber: state_otherWorkItem.floorNumber,
//           content,
//           quantity: Number(quantity || 0),
//           unitPrice: Number(unitPrice || 0),
//         };

//         return singleItemDetail;
//       });

//       const itemDetail: TitemDetail = {
//         floorNumber: state_installItem.floorNumber,
//         width: Number(state_installItem.width || 0),
//         height: Number(state_installItem.height || 0),
//         talent: Number(state_installItem.talent || 0),
//         quantity: Number(state_installItem.quantity || 0),
//         unitPrice: Number(unitPrice || 0),
//         singleItemDetail: singleItemDetail,
//       };

//       return itemDetail;
//     });
//     body = {
//       engineeringContactId: null,
//       installItems: null,
//       outsourcingTotal: state_outsourcingTotal,
//       itemDetail: itemDetailArr,
//     };
//   }

//   return apiPatchOutsourcingPaymentDetail_updateRetainage(paymentDetailId, body);
// };
