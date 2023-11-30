import {
  optionsCreator_doorModel,
  optionsCreator_quoteType,
  optionsCreator_bottomBar,
  optionsCreator_motorLockBox,
  optionsCreator_rollerSpec,
  optionsCreator_closingType,
  optionsCreator_bottomBarAngleIron,
  optionsCreator_bottomBarPlate,
} from 'js/utils/options/productOptions';

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
      wrapperStyle: { width: '300px' },
      selectProps: {
        props: {
          // options由api取得
        },
      },
    },
  },
  fullWidth: {
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
  WG: {
    label: 'WG(m)', // WG
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      // showBaseline: 'invisible',
      inputProps: {
        props: {
          type: 'number',
          className: 'text-center',
          // disabled: true,
          placeholder: '',
        },
      },
    },
  },
  W: {
    label: 'W(m)', // WG
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      // showBaseline: 'invisible',
      inputProps: {
        props: {
          type: 'number',
          className: 'text-center',
          // disabled: true,
          placeholder: '',
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
  boxB: {
    label: 'B(m)',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      selectProps: {
        props: {
          placeholder: '',
        },
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
      wrapperStyle: { width: '100px' },
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
      wrapperStyle: { width: '70px' },
      selectProps: {
        withIcon: true,
        creOptionWithIconProps: {
          showLabel: false,
          imgProps: {
            style: { height: '40px' },
          },
        },
        creSingleValueWithIconProps: {
          showLabel: false,
          imgProps: {
            style: { height: '40px' },
          },
        },
        props: {
          // options由api取得
          placeholder: '',
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
      // showBaseline: 'invisible',
      wrapperStyle: { width: '120px' },
      inputProps: {
        props: {
          // disabled: true,
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
      wrapperStyle: { width: '70px' },
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
          options: optionsCreator_bottomBar(),
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
          options: optionsCreator_motorLockBox(),
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
  guildRailG: {
    label: 'G',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
          type: 'number',
          className: 'text-center',
          placeholder: '',
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
          options: optionsCreator_rollerSpec(),
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
          // classProduct.ts 的emptyProdOri有用到options
          options: optionsCreator_closingType(),
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
          // !如果options有變動，要去確認classProduct.ts的set material有沒有不對
          // options: optionsCreator_bottomBarAngleIron(),
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
          // !如果options有變動，要去確認classProduct.ts的set material有沒有不對
          // options: optionsCreator_bottomBarPlate(),
        },
      },
    },
  },
}; // prodCellConfig close

const getInstallationFee = ({
  //
  doorModel,
  m2, // 面積
}: {
  doorModel: string;
  m2: number;
}) => {
  if (doorModel === 'SJ-302') {
    return 1800;
  }

  if (doorModel === 'SJ-303A' || doorModel === 'SJ-303AS') {
    if (m2 < 10) {
      // return 5400;
      return 3600;
    } else {
      return 3600;
    }
  }

  return 0;
};

export { prodCellConfig, getInstallationFee };
