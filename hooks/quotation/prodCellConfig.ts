import { optionsCreator_doorModel, optionsCreator_quoteType } from 'js/utils/options/productOptions';

import type { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';

const prodCellConfig: TcellConfig = {
  discount: {
    label: '折數',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
        },
      },
    },
  },
  itemName: {
    label: '項目',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      inputProps: {
        props: {},
      },
    },
  },
  quoteType: {
    label: '報價別',
    inputSelProps: {
      wrapperStyle: { width: '105px' },
      selectProps: {
        props: {
          options: optionsCreator_quoteType(),
        },
      },
    },
  },
  doorType: {
    label: '門型',
    inputSelProps: {
      wrapperStyle: { width: '120px' },
      selectProps: {
        props: {
          // options由api取得
        },
      },
    },
  },
  length: {
    label: 'L(m)', // 全寬
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
          className: 'text-center',
        },
      },
    },
  },
  width: {
    label: 'W(m)', // WG
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
          className: 'text-center',
        },
      },
    },
  },
  height: {
    label: 'h(m)',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
          className: 'text-center',
        },
      },
    },
  },
  // 後端說B(m)是boxB
  // boxB: {
  //   label: 'B(m)',
  //   theadItemClassName: 'text-center',
  //   inputSelProps: {
  //     wrapperStyle: { width: '60px' },
  //     inputProps: {
  //       props: {
  //         type: 'number',
  //         className: 'text-center',
  //       },
  //     },
  //   },
  // },
  boxB: {
    label: 'B(m)',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {},
      },
    },
  },
  boxD: {
    label: 'D(m)',
    inputSelProps: {
      wrapperStyle: { width: '80px' },
      selectProps: {
        props: {},
      },
    },
  },
  thickness: {
    label: '門片厚度',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '80px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
          type: 'number',
          className: 'text-center',
        },
      },
    },
  },
  area: {
    label: '面積',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
          type: 'number',
        },
      },
    },
  },
  volume: {
    label: '才數',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
          type: 'number',
        },
      },
    },
  },
  material: {
    label: '材料',
    inputSelProps: {
      wrapperStyle: { width: '150px' },
      selectProps: {
        props: {
          // options由api取得
        },
      },
    },
  },
  surface: {
    label: '表面',
    inputSelProps: {
      wrapperStyle: { width: '80px' },
      selectProps: {
        props: {
          // options 寫在class裡面
        },
      },
    },
  },
  doorTrack: {
    label: '門軌',
    inputSelProps: {
      wrapperStyle: { width: '130px' },
      selectProps: {
        withIcon: true,
        creOptionWithIconProps: {
          showLabel: false,
          imgProps: {
            style: { height: '80px' },
          },
        },
        creSingleValueWithIconProps: {
          showLabel: false,
          imgProps: {
            style: { height: '80px' },
          },
        },
        props: {
          // options由api取得
        },
      },
    },
  },
  horsepower: {
    label: '馬力',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          // options由api取得
        },
      },
    },
  },
  quantity: {
    label: '數量',
    inputSelProps: {
      wrapperStyle: { width: '55px' },
      inputProps: {
        props: { type: 'number' },
      },
    },
  },
  price: {
    label: '牌價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '120px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  dualPrice: {
    label: '牌價複價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '120px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  unitPrice: {
    label: '單價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '120px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  totalPrice: {
    label: '複價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '140px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  typhoonProtection: {
    label: '防颱',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      showBaseline: 'invisible',
      checkBoxProps: {
        propsArr: [{ key: 'typhoonProtection' }],
      },
    },
  },
  bounceDoor: {
    label: '彈射門',
    theadItemClassName: 'text-center',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '60px' },
      checkBoxProps: {
        propsArr: [{ key: 'bounceDoor' }],
      },
    },
  },
  notes: {
    label: '備註',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      inputProps: {
        props: {},
      },
    },
  },
  //
  //
  //
  motor: {
    label: '馬達廠商',
    // isOptionValue: true,
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          // options由api取得
        },
      },
    },
  },
  voltage: {
    label: '電壓',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          // options由api取得
        },
      },
    },
  },
  phase: {
    label: '相數',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          // options由api取得
        },
      },
    },
  },
  motorSupport: {
    label: '馬達支撐架',
    theadItemClassName: 'text-center',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '100px' },
      checkBoxProps: {
        propsArr: [{ key: 'motorSupport' }],
      },
    },
  },
  bottomBar: {
    label: '底座類型',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            { value: 'none', label: '無' },
            { value: '鋁障感型', label: '鋁障感型' },
            { value: '止水型', label: '止水型' },
          ],
        },
      },
    },
  },
  motorLockBox: {
    label: '馬達鎖盒',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            { value: '外露', label: '外露' },
            { value: '防盜', label: '防盜' },
          ],
        },
      },
    },
  },
  doorTrackThick: {
    label: '門軌厚度',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          // options由api取得
        },
      },
    },
  },
  rollerSpec: {
    label: '捲軸規格',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            { value: '無凸', label: '無凸' },
            { value: '雙凸', label: '雙凸' },
          ],
        },
      },
    },
  },
  doorTrackSilencerStrip: {
    label: '門軌消音條',
    theadItemClassName: 'text-center',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '100px' },
      checkBoxProps: {
        propsArr: [{ key: 'doorTrackSilencerStrip' }],
      },
    },
  },
  onePieceRollUpBox: {
    label: '一體式捲箱',
    theadItemClassName: 'text-center',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '100px' },
      checkBoxProps: {
        propsArr: [{ key: 'onePieceRollUpBox' }],
      },
    },
  },
  rollUpBoxThick: {
    label: '捲箱厚度',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          // options由api取得
        },
      },
    },
  },
  close: {
    label: '開閉方式',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            { value: '電動', label: '電動' },
            { value: '手動', label: '手動' },
          ],
        },
      },
    },
  },
  bottomBarAngleIron: {
    label: '底座角鐵',
    inputSelProps: {
      wrapperStyle: { width: '150px' },
      selectProps: {
        props: {
          options: [
            { value: '鍍鋅 50*50*4T', label: '鍍鋅 50*50*4T' },
            { value: '高耐鍍鋅鋼板 50*50*3T', label: '高耐鍍鋅鋼板 50*50*3T' },
            { value: '不鏽鋼#304 50*50*3T', label: '不鏽鋼#304 50*50*3T' },
            { value: '不鏽鋼#316 50*50*3T', label: '不鏽鋼#316 50*50*3T' },
          ],
        },
      },
    },
  },
  bottomBarPlate: {
    label: '底座板',
    inputSelProps: {
      wrapperStyle: { width: '150px' },
      selectProps: {
        props: {
          options: [
            { value: '鍍鋅 1.5T', label: '鍍鋅 1.5T' },
            { value: '高耐鍍鋅鋼板 1.5T', label: '高耐鍍鋅鋼板 1.5T' },
            { value: '不鏽鋼#304 1.5T', label: '不鏽鋼#304 1.5T' },
            { value: '不鏽鋼#316 1.5T', label: '不鏽鋼#316 1.5T' },
          ],
        },
      },
    },
  },
}; // prodCellConfig close

export { prodCellConfig };
