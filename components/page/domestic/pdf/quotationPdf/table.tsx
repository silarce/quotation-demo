import { useState } from 'react';

// css
import style from './quotationPdf.module.scss';

import { apiGetAssets } from 'js/api/api_product';

type TtableProdListItem = {
  category: string;
  size: string;
  doorType: string;
  material: string;
  thickness: string;
  surface: string;
  doorRail: string;
  horsepower: string;
  openType: string;
  qty: string;
  unitPrice: string;
  priceTotal: string;
  memo: string;
  //
  doorRailForExcel?: string;
};

type TtableProdList = TtableProdListItem[];

export type { TtableProdList, TtableProdListItem };
// =============================================================================

export default function Table({ productList }: { productList: TtableProdList }) {
  const [svgList, setSvgList] = useState<{ [key: string]: string | undefined | null }>({});

  const getSvg = async ({ fileName }: { fileName: string }) => {
    if (svgList[fileName] === null) {
      return;
    }

    if (svgList[fileName] === 'isLoading') {
      return;
    }

    if (!!svgList[fileName]) {
      return;
    }

    try {
      svgList[fileName] = 'isLoading';

      const svg = await apiGetAssets(fileName);

      if (svg) {
        setSvgList((list) => ({
          ...list,
          [fileName]: svg,
        }));
      }
    } catch (error) {
      setSvgList((list) => ({
        ...list,
        [fileName]: null,
      }));
    }
  };

  return (
    <div className={style.table}>
      {indexKeys.map((key, index) => {
        const { label, width } = config[key];
        const theStyle = { width };

        return (
          <div className={style.theadCell} key={index} style={theStyle}>
            <span>
              {label === '開閉方式' ? (
                <>
                  <span>開閉</span>
                  <span>方式</span>
                </>
              ) : (
                label
              )}
            </span>
          </div>
        );
      })}

      {productList.map((item, rIndex) => {
        const data = item;

        return indexKeys.map((key, cIndex) => {
          const value = data[key];
          const { width, align, suffix } = config[key];
          const theStyle = { width };
          const subClass = ' ' + style[align ?? ''];

          if (key === 'doorRail') {
            let svgString;
            let src;

            if (value) {
              // 來自本地的圖片
              if (value.startsWith('/_next')) {
                src = value;
              } else {
                // const arr = value.split('/');
                // const fileName = arr[arr.length - 1];

                // if (fileName) {
                //   getSvg({ fileName: fileName });
                // }

                // svgString = svgList[`${fileName}`] ?? '';

                getSvg({ fileName: value });

                svgString = svgList[`${value}`] ?? '';
              }
            }

            return (
              <div className={style.tbodyCell + subClass} key={cIndex} style={theStyle}>
                {/*  eslint-disable-next-line @next/next/no-img-element */}
                {src && <img src={src} alt="" />}
                {svgString !== undefined && <div dangerouslySetInnerHTML={{ __html: svgString }} />}
              </div>
            );
          }

          return (
            <div className={style.tbodyCell + subClass} key={cIndex} style={theStyle}>
              <span>
                {value}
                {value && suffix}
              </span>
            </div>
          );
        });
      })}
      {/* 補空的row */}
      {/* {(() => {
        const leftoverRow = 12 - fakeDataArr.length
        const leftoverArr = Array(leftoverRow).fill("")
        return leftoverArr.map((row, rIndex) => {
          return indexKeys.map((key, cIndex) => {
            const { width } = config[key]
            const theStyle = { width }
            return (
              <div className={style.tbodyCell} key={cIndex} style={theStyle}>
                <span>　</span>
              </div>
            )
          })
        })
      })()} */}
    </div>
  );
}

// =============================================================================

type TindexKeys =
  | 'category'
  | 'size'
  | 'doorType'
  | 'material'
  | 'thickness'
  | 'surface'
  | 'doorRail'
  | 'horsepower'
  | 'openType'
  | 'qty'
  | 'unitPrice'
  | 'priceTotal'
  | 'memo';

type Tconfig = {
  [key in TindexKeys]: {
    label: string;
    width: string;
    align?: 'center' | 'right';
    suffix?: string;
  };
};

const indexKeys: TindexKeys[] = [
  'category',
  'size',
  'doorType',
  'material',
  'thickness',
  'surface',
  'doorRail',
  'horsepower',
  'openType',
  'qty',
  'unitPrice',
  'priceTotal',
  'memo',
];

const config: Tconfig = {
  category: {
    label: '項目',
    width: '80px',
  },
  size: {
    label: '尺寸(單位:cm)',
    width: '180px',
  },
  doorType: {
    label: '門型',
    width: '94px',
  },
  material: {
    label: '材料',
    width: '104px',
    align: 'center',
  },
  thickness: {
    label: '厚度',
    width: '50px',
    align: 'center',
  },
  surface: {
    label: '表面',
    width: '50px',
    align: 'center',
  },
  doorRail: {
    label: '門軌',
    width: '50px',
    align: 'center',
  },
  horsepower: {
    label: '馬力',
    width: '75px',
    align: 'center',
  },
  openType: {
    label: '開閉方式',
    width: '75px',
    align: 'center',
  },
  qty: {
    label: '數量',
    width: '60px',
    align: 'center',
    suffix: '樘',
  },
  unitPrice: {
    label: '單價',
    width: '100%',
    align: 'right',
  },
  priceTotal: {
    label: '複價',
    width: '100%',
    align: 'right',
  },
  memo: {
    label: '備註',
    width: '80px',
    align: 'center',
  },
};

// =============================================================================
