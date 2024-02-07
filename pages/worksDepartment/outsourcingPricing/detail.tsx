import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _, { set } from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList, TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// components
import Table01, { CellInput, CellSelect } from 'components/global/gear/table/table01';
import type { Trow, Tcell, Ttable, Tconfig_table } from 'components/global/gear/table/table01';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import AddressBar from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';

// icon
import { IconAddCircle } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './detail.module.scss';

// api
import { useGetOutsourcingPaymentDetail_id } from 'js/api/api_outsourcing';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// type
import type { TquotationProductItemDto } from 'js/api/dtoTypes';

// =======================================================================

type Tquery = {
  paymentDetailId: string | undefined;
};

type Tstate_otherWorkItem = {
  installItemId: string;
  installItemName: string;

  otherInstallation: string;
  otherQuantity: string;
  otherUnitPrice: string;
  otherSubTotalPrice: string;
};

type Tstate_installItem = {
  itemId: string;
  itemPrice: number;
};

// =======================================================================
export default function OutsourcingPricingDetail() {
  const router = useRouter();
  const { paymentDetailId } = router.query as Tquery;

  // ---------------------------------------------------------------------
  const [disabled, setDisabled] = useState(true);

  // ---------------------------------------------------------------------

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

  // ---------------------------------------------------------------------

  const [data02, setData02] = useState<TfakeData02[]>([]);

  // ---------------------------------------------------------------------

  useEffect(() => {
    update();
  }, [paymentDetailId]);

  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------

  const addData02 = () => {
    setData02((prev) => [...prev, create_emptyFakeData02()]);
  };

  // const deleteData02 = (index: number) => {
  //   setData02((prev) => prev.filter((_, i) => i !== index));
  // };

  const editData02 = ({
    //
    index,
    key,
    value,
  }: {
    index: number;
    key: keyof TfakeData02;
    value: string;
  }) => {
    setData02((prev) => {
      const new_data02 = _.cloneDeep(prev);

      if (key === 'qty' || key === 'unitPrice') {
        new_data02[index][key] = Number(value);
      } else {
        new_data02[index][key] = value;
      }

      return new_data02;
    });
  };

  // ---------------------------------------------------------------------

  useEffect(() => {
    if (disabled) {
      setData02(_.cloneDeep(fakeData02Arr));
    }
  }, [disabled]);

  // ---------------------------------------------------------------------

  const { control_table01, subTotal01 } = useTable01({ installItems });
  const { control_table02, subTotal02 } = useTable02({ installItems, disabled });
  const control_table_total = useTable_total({ subTotal01, subTotal02 });

  // ---------------------------------------------------------------------

  const panelList_disabled: TpanelList = [
    {
      type: 'redButton',
      label: '編輯',
      onClick: () => {
        setDisabled(false);
      },
    },
    {
      type: 'redButton',
      label: '刪除',
      onClick: () => {},
    },
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
      onClick: () => {},
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
          <IconAddCircle className="mb-2" onClick={addData02} />
          <Table01 {...control_table02} />
        </div>
        <Table01 className="mt-20" {...control_table_total} />
        {/*  */}
      </div>
    </SubLayer>
  );
}

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
    const newState_installItem: Tstate_installItem[] = installItems.map((item) => {
      return {
        itemId: item.id,
        itemPrice: item.itemPrice || 0,
      };
    });

    setState_installItem(newState_installItem);
  }, [installItems]);

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

      const dualPrice = new Decimal(itemPrice || 0).mul(1).toDecimalPlaces(0).toNumber();
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
  // dataArr,
  // editData02,
  installItems,
  disabled,
}: {
  // dataArr: TfakeData02[];
  // editData02: (props: { index: number; key: keyof TfakeData02; value: string }) => void;
  installItems: TquotationProductItemDto[];
  disabled?: boolean;
}) => {
  //

  const [state_otherWorkItem, setState_otherWorkItem] = useState<Tstate_otherWorkItem[]>([]);

  useEffect(() => {
    const arr: Tstate_otherWorkItem[] = [];

    installItems.forEach((item) => {
      const { deliveryStatus } = item;
      deliveryStatus?.forEach((ds) => {
        const otherWorkItems = ds.otherWorkItems || [];
        otherWorkItems.forEach((owi) => {
          arr.push({
            installItemId: item.id,
            installItemName: item.itemName,
            otherInstallation: owi.otherInstallation ?? '',
            otherQuantity: String(owi.otherQuantity || 0),
            otherUnitPrice: String(owi.otherUnitPrice || 0),
            otherSubTotalPrice: String(owi.otherSubTotalPrice || 0),
          });
        });
      });
    });

    setState_otherWorkItem(arr);
  }, [installItems]);

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
      const { otherInstallation, installItemName, otherQuantity, otherUnitPrice, otherSubTotalPrice } = item;

      const dualPrice = new Decimal(otherUnitPrice).mul(otherQuantity).toDecimalPlaces(0).toNumber();
      decimal_subTotal = decimal_subTotal.add(dualPrice);

      const cellArr: Tcell[] = [
        {
          children: (
            <CellInput
              disabled={disabled}
              style={{ width: config_useTable02.floorNumber.width }}
              inputProps={{
                value: installItemName,
                onChange: (e) => {
                  // editData02({ index, key: 'floorNumber', value: e.target.value });
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
                // value: workContent || undefined,
                placeholder: '工作內容...',
                options: fakeData02_options,
                // onChange: (str) => {
                //   editData02({ index, key: 'workContent', value: str });
                // },
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
                // value: qty,
                // onChange: (e) => {
                //   editData02({ index, key: 'qty', value: e.target.value });
                // },
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
                // value: unitPrice,
                // onChange: (e) => {
                //   editData02({ index, key: 'unitPrice', value: e.target.value });
                // },
                type: 'number',
              }}
            />
          ),
          ...config_useTable02.unitPrice,
        },
        {
          children: dualPrice,
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

  return { control_table02: control_table, subTotal02: subTotal };
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

const fakeData = [
  {
    floorNumber: 'F-001',
    width: 999,
    height: 999,
    volume: 10, // 才數
    qty: 999, // 樘數
    unitPrice: 999, // 單價
  },
  {
    floorNumber: 'F-002',
    width: 999,
    height: 999,
    volume: 20, // 才數
    qty: 999, // 樘數
    unitPrice: 999, // 單價
  },
  {
    floorNumber: 'F-003',
    width: 999,
    height: 999,
    volume: 30, // 才數
    qty: 999, // 樘數
    unitPrice: 999, // 單價
  },
] as const;

type TfakeData02 = {
  floorNumber: string;
  workContent: string;
  qty: number;
  unitPrice: number;
};

const fakeData02Arr = [
  {
    floorNumber: 'F-001',
    workContent: '打石',
    qty: 1,
    unitPrice: 999,
  },
  {
    floorNumber: 'F-001',
    workContent: '門楣',
    qty: 3,
    unitPrice: 999,
  },
];

const create_emptyFakeData02 = () => ({
  floorNumber: '',
  workContent: '',
  qty: 0,
  unitPrice: 0,
});

const fakeData02_options = [
  {
    label: '打石',
    value: '打石',
  },
  {
    label: '門楣',
    value: '門楣',
  },
  {
    label: '特殊門軌',
    value: '特殊門軌',
  },
  {
    label: '修改補貼',
    value: '修改補貼',
  },
  {
    label: '卸貨',
    value: '卸貨',
  },
  {
    label: '公工',
    value: '公工',
  },
  {
    label: '遠程',
    value: '遠程',
  },
  {
    label: '外宿',
    value: '外宿',
  },
  {
    label: '載貨',
    value: '載貨',
  },
  {
    label: '活動中柱',
    value: '活動中柱',
  },
  {
    label: '防颱支撐',
    value: '防颱支撐',
  },
  {
    label: '送電',
    value: '送電',
  },
  {
    label: '修繕',
    value: '修繕',
  },
];
