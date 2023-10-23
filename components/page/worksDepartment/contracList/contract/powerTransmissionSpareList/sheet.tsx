import styled from '@emotion/styled';
import React, { Fragment } from 'react';

// css
import style from './powerTransmissionSpareList.module.scss';

// ==================================================================
type Tcontroll = {
  [key: string]:
    | {
        value: string;
        onChange: (qty: string, c2Key: string) => void;
      }
    | undefined;

  智慧型: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  面板式: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  埋入式: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  外露式: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  電子式: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  防爆式: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  鎖號: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  特殊鎖號: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  三點式一般: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  三點式遮煙: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  //
  '3HP馬達控制箱380v': {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  '2HP馬達控制箱380v': {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  '3HP馬達控制箱220v': {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  '2HP馬達控制箱220v': {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  彈射門控制箱: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  紅外線控制盤: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  //
  煙感器: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  中繼器: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  //
  門弓器: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  平推鎖: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  電磁扣: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  //
  遙控器加障感器: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  遙控器: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  障感器: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  大門用主機: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  //
  對照式: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  反射式: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  //
  防颱鎖固: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  防颱中柱: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
  //
  其他: {
    value: string;
    onChange: (qty: string, c2Key: string) => void;
  };
};

export type { Tcontroll };

// ==================================================================
export default function Sheet({
  editable,
  isAdd,
  controll,
}: {
  editable: boolean;
  isAdd?: boolean;
  controll: Tcontroll;
}) {
  return (
    <div className={style.sheet}>
      <div className={style.thead}>
        <div>
          <span>門型/數量</span>
        </div>
        <div>
          <span>品名</span>
        </div>
        <div>
          <span>種類</span>
        </div>
        <div>
          <span>數量</span>
        </div>
      </div>

      <Tbody>
        <C1>
          <span>門型</span>
        </C1>
        {c2IndexKeys.map((c2Key, index) => {
          const { label, rSpan } = c2Config[c2Key];

          const noBottomBorder = c2Key === '其他' ? true : false;

          return (
            <Fragment key={index}>
              <C2 rSpan={rSpan} noBottomBorder={noBottomBorder}>
                <span>{label}</span>
              </C2>

              {c3Config[c2Key].indexKeys.map((c3Key, c3Index) => {
                const { label, rSpan, cSpan, type, defaultValue } = c3Config[c2Key].config[c3Key];

                if (c2Key === '其他') {
                  const { value, onChange } = controll[c2Key] ?? {};

                  return (
                    <Fragment key={c3Index}>
                      <Cother {...{ rSpan, cSpan }}>
                        <textarea
                          placeholder="其他..."
                          disabled={!editable}
                          value={value ?? ''}
                          onChange={(e) => {
                            onChange(e.target.value, c2Key);
                          }}
                        />
                      </Cother>
                    </Fragment>
                  );
                }

                if (type === 'subCell') {
                  const { label, subKeys, subConfig } = c3Config[c2Key].config[c3Key];
                  const rSpan = subKeys!.length;

                  return (
                    <Fragment key={c3Index}>
                      <SubCell rSpan={6}>
                        <C2>
                          <span>{label}</span>
                        </C2>
                        <div>
                          {subKeys!.map((key, subIndex) => {
                            const { label } = subConfig![key];

                            return (
                              <C3 key={subIndex}>
                                <span>{label}</span>
                              </C3>
                            );
                          })}
                        </div>
                      </SubCell>
                      {subKeys!.map((key, subIndex) => {
                        const { value, onChange } = controll[key] ?? {};

                        return (
                          <C4 key={subIndex} editable={editable}>
                            <input
                              type="number"
                              // defaultValue={isAdd ? '' : defaultValue}
                              disabled={!editable}
                              value={value ?? ''}
                              onChange={(e) => {
                                onChange?.(e.target.value, c2Key);
                              }}
                            />
                          </C4>
                        );
                      })}
                    </Fragment>
                  );
                }

                const { value, onChange } = controll[c3Key] ?? {};

                return (
                  <Fragment key={c3Index}>
                    <C3>
                      <span>{label}</span>
                    </C3>
                    <C4 editable={editable}>
                      <input
                        type="number"
                        // defaultValue={isAdd ? '' : defaultValue}
                        disabled={!editable}
                        value={value ?? ''}
                        onChange={(e) => {
                          onChange?.(e.target.value, c2Key);
                        }}
                      />
                    </C4>
                  </Fragment>
                );
              })}
            </Fragment>
          );
        })}
      </Tbody>
    </div>
  );
}

// =======================================
// =======================================
// =======================================
// =======================================

const Tbody = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 7fr 1fr;
`;

const CellInit = styled.div<{
  rSpan?: number;
  cSpan?: number;
  noBottomBorder?: boolean;
}>`
  grid-row: span ${({ rSpan }) => rSpan || 1};
  grid-column: span ${({ cSpan }) => cSpan || 1};
  min-height: ${({ rSpan }) => (rSpan || 1) * 50}px;
  border: solid 1px ${style.colorBorder01};
  border-width: 0 1px 1px 0;
  display: grid;
  border-bottom: ${({ noBottomBorder }) => (noBottomBorder ? '0' : '')};
  > * {
    margin: auto;
    font-weight: 400;
    font-size: 16px;
  }
`;

const C1 = styled(CellInit)`
  grid-row: span 100;
  border-bottom: none;
  > * {
    margin-top: 20px;
  }
`;
const C2 = styled(CellInit)``;
const C3 = styled(CellInit)`
  > * {
    margin-left: 20px;
  }
`;
const C4 = styled(CellInit)<{ editable: boolean }>`
  display: grid;
  border-right: none;
  > input {
    width: 50px;
    margin: auto;
    border-bottom: solid 1px ${({ editable }) => (editable ? 'black' : 'transparent')};
    text-align: center;
    background-color: transparent;
  }
`;

const Cother = styled(CellInit)`
  border-right: none;
  border-bottom: none;
  > textarea {
    width: 100%;
    height: 100%;
    resize: none;
    padding: 10px;
  }
`;

const SubCell = styled(CellInit)`
  display: grid;
  grid-template-columns: 25% 75%;
  border: none;
  > * {
    width: 100%;
    height: 100%;
  }
`;

// ===========================================
// ===========================================
// ===========================================

type Tc2IndexKeys =
  | '鎖盒'
  | '鎖匙'
  | '押扣'
  | '控制箱盤'
  | '消防備品'
  | '板門配件'
  | '主機'
  | '紅外線'
  | '防颱配件'
  | '其他';

const c2IndexKeys: Tc2IndexKeys[] = [
  '鎖盒',
  '鎖匙',
  '押扣',
  '控制箱盤',
  '消防備品',
  '板門配件',
  '主機',
  '紅外線',
  '防颱配件',
  '其他',
];

const c3Config: {
  [key in Tc2IndexKeys]: {
    indexKeys: string[];
    config: {
      [key: string]: {
        label?: string;
        rSpan?: number;
        cSpan?: number;
        type?: 'textarea' | 'input' | 'subCell';
        subKeys?: string[];
        subConfig?: {
          [key: string]: {
            label: string;
          };
        };
        defaultValue?: string;
      };
    };
  };
} = {
  鎖盒: {
    indexKeys: ['智慧型', '面板式', '埋入式', '外露式', '電子式', '防爆式'],
    config: {
      智慧型: { label: '智慧型', defaultValue: '1' },
      面板式: { label: '面板式', defaultValue: '3' },
      埋入式: { label: '埋入式', defaultValue: '' },
      外露式: { label: '外露式', defaultValue: '2' },
      電子式: { label: '電子式', defaultValue: '1' },
      防爆式: { label: '防爆式', defaultValue: '1' },
    },
  },
  鎖匙: {
    indexKeys: ['鎖號', '特殊鎖號'],
    config: {
      鎖號: { label: '鎖號', defaultValue: '1' },
      特殊鎖號: { label: '特殊鎖號', defaultValue: '2' },
    },
  },
  押扣: {
    indexKeys: ['三點式一般', '三點式遮煙'],
    config: {
      三點式一般: { label: '三點式（一般）' },
      三點式遮煙: { label: '三點式（遮煙）' },
    },
  },
  控制箱盤: {
    indexKeys: ['a'],
    config: {
      a: {
        label: '捲門/水閘門',
        type: 'subCell',
        subKeys: [
          '3HP馬達控制箱380v',
          '2HP馬達控制箱380v',
          '3HP馬達控制箱220v',
          '2HP馬達控制箱220v',
          '彈射門控制箱',
          '紅外線控制盤',
        ],
        subConfig: {
          '3HP馬達控制箱380v': { label: '3HP 馬達控制箱（380V）' },
          '2HP馬達控制箱380v': { label: '2HP 馬達控制箱（380V）' },
          '3HP馬達控制箱220v': { label: '3HP 馬達控制箱（220V）' },
          '2HP馬達控制箱220v': { label: '2HP 馬達控制箱（220V）' },
          彈射門控制箱: { label: '彈射門控制箱' },
          紅外線控制盤: { label: '紅外線控制盤（含面板）' },
        },
      },
    },
  },
  消防備品: {
    indexKeys: ['煙感器', '中繼器'],
    config: {
      煙感器: { label: '煙感器' },
      中繼器: { label: '中繼器' },
    },
  },
  板門配件: {
    indexKeys: ['門弓器', '平推鎖', '電磁扣'],
    config: {
      門弓器: { label: '門弓器', defaultValue: '3' },
      平推鎖: { label: '平推鎖' },
      電磁扣: { label: '電磁扣', defaultValue: '5' },
    },
  },
  主機: {
    indexKeys: ['遙控器加障感器', '遙控器', '障感器', '大門用主機'],
    config: {
      遙控器加障感器: { label: '遙控器（1:2）+障感器' },
      遙控器: { label: '遙控器（1:2）' },
      障感器: { label: '障感器' },
      大門用主機: { label: '大門用主機' },
    },
  },
  紅外線: {
    indexKeys: ['對照式', '反射式'],
    config: {
      對照式: { label: '對照式' },
      反射式: { label: '反射式' },
    },
  },
  防颱配件: {
    indexKeys: ['防颱鎖固', '防颱中柱'],
    config: {
      防颱鎖固: { label: '防颱鎖固', defaultValue: '8' },
      防颱中柱: { label: '防颱中柱' },
    },
  },
  其他: {
    indexKeys: ['其他'],
    config: {
      其他: {
        rSpan: 3,
        cSpan: 2,
        type: 'textarea',
      },
    },
  },
};

const c2Config: {
  [key in Tc2IndexKeys]: {
    label: string;
    rSpan: number;
  };
} = {
  鎖盒: {
    label: '鎖盒',
    rSpan: c3Config['鎖盒'].indexKeys.length,
  },
  鎖匙: {
    label: '鎖匙',
    rSpan: c3Config['鎖匙'].indexKeys.length,
  },
  押扣: {
    label: '押扣',
    rSpan: c3Config['押扣'].indexKeys.length,
  },
  控制箱盤: {
    label: '控制箱/盤',
    rSpan: 6,
  },
  消防備品: {
    label: '消防備品',
    rSpan: c3Config['消防備品'].indexKeys.length,
  },
  板門配件: {
    label: '板門配件',
    rSpan: c3Config['板門配件'].indexKeys.length,
  },
  主機: {
    label: '主機',
    rSpan: c3Config['主機'].indexKeys.length,
  },
  紅外線: {
    label: '紅外線',
    rSpan: c3Config['紅外線'].indexKeys.length,
  },
  防颱配件: {
    label: '防颱配件',
    rSpan: c3Config['防颱配件'].indexKeys.length,
  },
  其他: {
    label: '其他',
    rSpan: 3,
  },
};

let c4Index: any[] = [];
Object.values(c3Config).forEach((item) => {
  c4Index = c4Index.concat(item.indexKeys);
});

// type Tfoo = {
//   [pk: string]:
//   {
//     indexKeys: string[]
//     data: {
//       [key: string]: string
//     }
//   }
// }
// const foo: Tfoo = {
//   one: {
//     indexKeys: ["a", "b"],
//     data: {
//       a: "",
//       b: "",
//     }
//   },
//   two: {
//     indexKeys: ["a", "b", "c"],
//     data: {
//       a: "",
//       b: "",
//       c: "",
//     }
//   },
// }
// foo.one.indexKeys.map((key, index) => {
//   const value = foo.one.data[key]
//   return value
// })
