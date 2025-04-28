import { useState } from 'react';

import { Image } from 'antd';
import DataEntry, { Input, Select } from 'components/global/gear/dataEntry';

import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

// component
import {
  Tprops_cell,
  Tprops_quotationRow_dndThead,
  //
  QuotationRow,
  Cell,
  QuotationRow_dndThead,
  QuotationRow_dnd,
  Table_dnd,
  Panel_iterativeProd_right_thead,
  Panel_iterativeProd_right,
  Panel_prod,
  Panel_iterativeProd,
  Panel_accessory,
} from 'components/page/domestic/quotation_v2/quotationRow';

import type { Tinstance_useProduct } from '../hook/useProduct';

import scss from './index.module.scss';

// ========================================================

type TstateKit = ReturnType<Tinstance_useProduct['createStateKit']>;

// ========================================================
export default function Table({
  disabled,
  instance_useProduct,
}: {
  disabled: boolean;
  instance_useProduct: Tinstance_useProduct;
}) {
  const { state_keyArr, createStateKit, addProd, state_allProd, createStateKit_allProd } = instance_useProduct;

  const stateKit_allProd = createStateKit_allProd();

  return (
    <div>
      <div className="flex gap-2 mb-1">
        <span className="text-main text-xl">主產品</span>
        <DataEntry
          className="w-[170px] gap-2"
          caption="總折數 : "
          captionWrapperProps={{ className: 'text-xl font-normal w-fit' }}
          childrenWrapperProps={{
            className: 'text-xl',
          }}
        >
          <Input
            type="number"
            min={0}
            step={0.001}
            value={state_allProd.discount_quotation}
            onChange={(e) => {
              if (e.target.validity.valid) {
                const value = e.target.value as `${number}` | '';
                stateKit_allProd.setDiscount_all(value);
              }
            }}
          />
        </DataEntry>
      </div>

      <div className={scss.table}>
        <QuotationRow_dndThead
          className={scss.thead}
          disabled={true}
          keyArr={keyArr}
          configDict={config}
          onDragEnd={() => {}}
          dragHandleInvisible={true}
          left={
            <>
              {keyArr_left.map((key) => {
                const { label, style } = config[key];

                return (
                  <Cell key={key} style={style}>
                    {label}
                  </Cell>
                );
              })}
            </>
          }
          right={
            <>
              {keyArr_right.map((key) => {
                const { label, style } = config[key];

                return (
                  <Cell key={key} style={style}>
                    {label}
                  </Cell>
                );
              })}
            </>
          }
          props_right={{
            style: { border: 'none' },
          }}
        />

        {state_keyArr.map((key, index) => {
          const stateKit = createStateKit(key);

          return (
            <QuotationRow_dnd
              className={scss.row}
              key={key}
              id={key}
              index={index}
              left={
                <>
                  {keyArr_left.map((key) => {
                    const { style, render } = config[key];
                    const node = render({ disabled, index, stateKit });

                    return (
                      <Cell key={key} style={style}>
                        {node}
                      </Cell>
                    );
                  })}
                </>
              }
              right={
                <>
                  {keyArr_right.map((key) => {
                    const { style, render } = config[key];
                    const node = render({ disabled, index, stateKit });

                    return (
                      <Cell key={key} style={style}>
                        {node}
                      </Cell>
                    );
                  })}
                </>
              }
              props_right={{
                style: { border: 'none', backgroundColor: 'inherit' },
              }}
            >
              {keyArr.map((key) => {
                const { style, render } = config[key];

                const node = render({ disabled, index, stateKit });

                return (
                  <Cell key={key} style={style}>
                    {node}
                  </Cell>
                );
              })}
            </QuotationRow_dnd>
          );
        })}
      </div>
      <div className="p-2 border border-t-0 border-border ">
        <SquareBtn sharp="mini" onClick={addProd}>
          新增
        </SquareBtn>
      </div>
    </div>
  );
}

// =====================================================================

type Tconfig = Tprops_quotationRow_dndThead['configDict'] &
  Record<
    string,
    {
      render: (props: {
        //
        disabled: boolean;
        index: number;
        stateKit: TstateKit;
      }) => React.ReactNode;
    }
  >;

const config = {
  indexNumber: {
    label: null,
    style: {
      width: 40,
    },
    render: ({ index }) => index + 1,
  },

  productid: {
    label: '品名',
    style: {
      width: 100,
    },
    render: ({ disabled, stateKit }) => {
      return (
        <DataEntry showBorder={!disabled}>
          <Input
            value={stateKit.getProductid()}
            onChange={(e) => {
              stateKit.setProductid(e.target.value);
            }}
          />
        </DataEntry>
      );
    },
  },
  spec: {
    label: '規格',
    style: {
      width: 100,
    },
    render: ({ disabled, stateKit }) => {
      return (
        <DataEntry showBorder={!disabled}>
          <Input
            readOnly={disabled}
            value={stateKit.getSpec()}
            onChange={(e) => {
              stateKit.setSpec(e.target.value);
            }}
          />
        </DataEntry>
      );
    },
  },
  material: {
    label: '材質',
    style: {
      width: 100,
    },
    render: ({ disabled, stateKit }) => {
      return (
        <DataEntry showBorder={!disabled}>
          <Select
            options={fakeOptions}
            value={stateKit.getMaterial()}
            onChange={(v) => {
              stateKit.setMaterial(v);
            }}
          />
        </DataEntry>
      );
    },
  },
  thickness: {
    label: '厚度',
    style: {
      width: 100,
    },
    render: ({ disabled, stateKit }) => {
      return (
        <DataEntry showBorder={!disabled}>
          <Input
            type="number"
            min={0}
            step={0.001}
            value={stateKit.getThickness()}
            onChange={(e) => {
              if (e.target.validity.valid) {
                const value = e.target.value as `${number}` | '';
                stateKit.setThickness(value);
              }
            }}
          />
        </DataEntry>
      );
    },
  },
  surface: {
    label: '表面',
    style: {
      width: 100,
    },
    render: ({ disabled, stateKit }) => {
      return (
        <DataEntry showBorder={!disabled}>
          <Input
            value={stateKit.getSurface()}
            onChange={(e) => {
              if (e.target.validity.valid) {
                const value = e.target.value as `${number}` | '';
                stateKit.setSurface(value);
              }
            }}
          />
        </DataEntry>
      );
    },
  },
  quantity: {
    label: '數量',
    style: {
      width: 100,
    },
    render: ({ disabled, stateKit }) => {
      return (
        <DataEntry showBorder={!disabled}>
          <Input
            type="number"
            min={0}
            step={0}
            value={stateKit.getQuantity()}
            onChange={(e) => {
              if (e.target.validity.valid) {
                const value = e.target.value as `${number}` | '';
                stateKit.setQuantity(value);
              }
            }}
          />
        </DataEntry>
      );
    },
  },

  price: {
    label: '牌價',
    style: {
      width: 100,
    },
    render: ({ disabled, stateKit }) => {
      return (
        <DataEntry showBorder={!disabled}>
          <Input
            type="number"
            min={0}
            step={0}
            value={stateKit.getPrice()}
            onChange={(e) => {
              if (e.target.validity.valid) {
                const value = e.target.value as `${number}` | '';
                stateKit.setPrice(value);
              }
            }}
          />
        </DataEntry>
      );
    },
  },
  dualPrice: {
    label: '牌價複價',
    style: {
      width: 100,
    },
    render: ({ disabled, stateKit }) => {
      const dualPrice: React.ReactNode = stateKit.getDualPrice();
      const node = disabled ? dualPrice.toLocaleString() : dualPrice;

      return node;
    },
  },
  unitPrice: {
    label: '單價',
    style: {
      width: 100,
    },
    render: ({ disabled, stateKit }) => {
      const unitPrice: React.ReactNode = stateKit.getUnitPrice();
      const node = disabled ? unitPrice.toLocaleString() : unitPrice;

      return node;
    },
  },
  totalPrice: {
    label: '複價',
    style: {
      width: 100,
    },
    render: ({ disabled, stateKit }) => {
      const totalPrice: React.ReactNode = stateKit.getTotalPrice();
      const node = disabled ? totalPrice.toLocaleString() : totalPrice;

      return node;
    },
  },
  note: {
    label: '備註',
    style: {
      width: 100,
    },
    render: ({ disabled, stateKit }) => {
      return (
        <DataEntry showBorder={!disabled}>
          <Input
            readOnly={disabled}
            value={stateKit.getNote()}
            onChange={(e) => {
              stateKit.setNote(e.target.value);
            }}
          />
        </DataEntry>
      );
    },
  },
  discount: {
    label: '折數',
    style: {
      width: 100,
    },
    render: ({ disabled, stateKit }) => {
      return (
        <DataEntry showBorder={!disabled}>
          <Input
            type="number"
            min={0}
            step={0.001}
            value={stateKit.getDiscount()}
            onChange={(e) => {
              if (e.target.validity.valid) {
                const value = e.target.value as `${number}` | '';
                stateKit.setDiscount(value);
              }
            }}
          />
        </DataEntry>
      );
    },
  },
  imgUrl: {
    label: '',
    style: {
      width: 100,
    },
    render: ({ stateKit }) => {
      const src = stateKit.getImgUrl();

      if (!src) {
        return null;
      }

      return <Image src={src} alt={src} className={scss.img} />;
    },
  },
} satisfies Tconfig;

type Tkey = keyof typeof config;

const keyArr: Tkey[] = [
  'spec',
  'material',
  'thickness',
  'surface',

  'discount',
  'quantity',
  'price',
  'dualPrice',
  'unitPrice',
  'totalPrice',

  'note',
];

const keyArr_left: Tkey[] = ['indexNumber', 'productid'];
const keyArr_right: Tkey[] = ['imgUrl'];

// =====================================================================

const fakeOptions = [
  { value: '喵', label: '喵' },
  { value: '汪', label: '汪' },
  { value: '咩', label: '咩' },
  { value: '啾', label: '啾' },
];
