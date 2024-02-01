import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';

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

// =======================================================================

// =======================================================================
export default function OutsourcingPricingDetail() {
  const router = useRouter();

  // ---------------------------------------------------------------------
  const [disabled, setDisabled] = useState(true);

  // ---------------------------------------------------------------------

  const [data02, setData02] = useState<TfakeData02[]>([]);

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

  const { control_table01, subTotal01 } = useTable01();
  const { control_table02, subTotal02 } = useTable02({ dataArr: data02, editData02, disabled });
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
    <SubLayer>
      <PageHeader02 tag="外包計價單明細" panelList={panelList} />
      <div className={scss.main}>
        {/*  */}
        <div className={scss.profile}>
          <InputSel
            //
            caption={'外包廠商'}
            disabled={disabled}
            showBaseline="auto"
            inputProps={{}}
          />
          <InputSel
            //
            caption={'工程編號'}
            disabled={disabled}
            showBaseline="auto"
            inputProps={{}}
          />
          <InputSel
            //
            caption={'工程日期'}
            disabled={disabled}
            showBaseline="auto"
            inputProps={{}}
          />
          <InputSel
            //
            caption={'安裝人員'}
            disabled={disabled}
            showBaseline="auto"
            inputProps={{}}
          />
          <InputSel
            //
            caption={'工程名稱'}
            className="col-span-2"
            disabled={disabled}
            showBaseline="auto"
            inputProps={{}}
          />
          <AddressBar
            inputSelProps={{
              className: 'col-span-2',
              disabled: disabled,
              showBaseline: 'auto',
            }}
            addressProps={{
              county: {},
              district: {},
              address: {},
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

const useTable01 = () => {
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

    const rowArr: Ttable['tbody']['rowArr'] = fakeData.map((item, index) => {
      const { floorNumber, width, height, volume, qty, unitPrice } = item;

      const dualPrice = new Decimal(unitPrice).mul(qty).toDecimalPlaces(0).toNumber();
      decimal_subTotal = decimal_subTotal.add(dualPrice);

      const cellArr: Tcell[] = [
        {
          children: floorNumber,
          ...config_useTable01.floorNumber,
        },
        {
          children: width,
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
          children: qty,
          ...config_useTable01.qty,
        },
        {
          children: (
            <CellInput
              style={{ width: config_useTable01.unitPrice.width }}
              inputProps={{
                defaultValue: unitPrice,
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
  }, []); // useMemo

  return { control_table01: control_table, subTotal01: subTotal };
};

// ===========================================================================

const useTable02 = ({
  //
  dataArr,
  editData02,
  disabled,
}: {
  dataArr: TfakeData02[];
  editData02: (props: { index: number; key: keyof TfakeData02; value: string }) => void;
  disabled?: boolean;
}) => {
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

    const rowArr: Ttable['tbody']['rowArr'] = dataArr.map((item, index) => {
      const { floorNumber, workContent, qty, unitPrice } = item;

      const dualPrice = new Decimal(unitPrice).mul(qty).toDecimalPlaces(0).toNumber();
      decimal_subTotal = decimal_subTotal.add(dualPrice);

      const cellArr: Tcell[] = [
        {
          children: (
            <CellInput
              disabled={disabled}
              style={{ width: config_useTable02.floorNumber.width }}
              inputProps={{
                value: floorNumber,
                onChange: (e) => {
                  editData02({ index, key: 'floorNumber', value: e.target.value });
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
                value: workContent || undefined,
                placeholder: '工作內容...',
                options: fakeData02_options,
                onChange: (str) => {
                  editData02({ index, key: 'workContent', value: str });
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
                value: qty,
                onChange: (e) => {
                  editData02({ index, key: 'qty', value: e.target.value });
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
                value: unitPrice,
                onChange: (e) => {
                  editData02({ index, key: 'unitPrice', value: e.target.value });
                },
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
  }, [dataArr, disabled]); // useMemo

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
