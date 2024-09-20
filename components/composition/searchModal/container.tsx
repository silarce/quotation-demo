import { useState, useMemo, useEffect, useRef } from 'react';
import moment, { Moment } from 'moment';

import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import Row, { Cell } from 'components/global/gear/table/row';

import { useGetCustomers_infinite_2, TcustomerDto } from 'js/api/api_customer';

import scss from './searchModal.module.scss';

export default function Container() {
  return (
    <div className={scss.container}>
      <div>
        <span>查找條件 : </span>
      </div>
      <div>
        <span>筆數 : 共{'999'}筆</span>
      </div>
      <div className={scss.left}>
        <Filter
          config={config_filter}
          onConfirm={(props) => {
            console.log(props);
          }}
        />
      </div>
      <div className={scss.right}>
        <Table_customer />
      </div>
    </div>
  );
}

// ===============================================================

// 因為inputSel的select無法從外部控制清除value(設置ref就可以，但是這個元件沒有做相關處理)，
// 所以改用狀態管理這樣的方案

const Filter = ({
  //
  onConfirm,
  config,
}: {
  onConfirm: (props: { [key: string]: string }) => void;
  config: Tconfig_filter; // 必須是不會一直變動參考的物件
}) => {
  // -----------------------------------------------------------------------

  const [state, setState] = useState<Tstate>({});

  useEffect(() => {
    const state: Tstate = {};
    config.forEach((item) => {
      state[item.key] = '';
    });
  }, [config]);

  // -----------------------------------------------------------------------
  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    setState((state) => {
      const newState = { ...state };
      config.forEach((item) => {
        newState[item.key] = '';
      });

      return newState;
    });

    // const form = e.currentTarget.closest('form');

    // if (form) {
    //   const formElements = form.elements as HTMLFormControlsCollection;

    //   for (const element of Array.from(formElements)) {
    //     const inputElement = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    //     if (inputElement.name) {
    //       inputElement.value = '';
    //     }
    //   }

    //   // const singleValueElements = form.querySelectorAll('[class*="singleValue"]');
    //   // singleValueElements.forEach((element) => {
    //   //   element.innerHTML = '';
    //   // });
    // }
  };

  return (
    <form
      className={scss.filter}
      onSubmit={(e) => {
        e.preventDefault();

        // const formElements = e.currentTarget.elements as HTMLFormControlsCollection;
        // const values: { [key: string]: string } = {};

        // for (const element of Array.from(formElements)) {
        //   const inputElement = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

        //   if (inputElement.name) {
        //     values[inputElement.name] = inputElement.value;
        //   }
        // }

        // onConfirm(values); // 調用 onConfirm 回調函數，傳遞表單數據
      }}
    >
      <div className={scss.inputPanel}>
        {config.map((item, index) => {
          const inputSelProps = createInputSel({
            config: item,
            state,
            setState,
          });

          return <InputSel key={index} {...inputSelProps} />;
        })}
      </div>

      <div className={scss.btnBar}>
        <SquareBtn label="清除條件" sharp="long" type="button" onClick={handleClear} />
        <SquareBtn label="搜尋" sharp="long" type="submit" onClick={() => onConfirm(state)} />
      </div>
    </form>
  );
};

const createInputSel = ({
  config,
  state,
  setState,
}: {
  config: Tconfig_filter[number];
  state: Tstate;
  setState: React.Dispatch<React.SetStateAction<Tstate>>;
}) => {
  const { caption, key, type, selectOptions } = config;

  const inputSelProps: TinputSelProps = {
    caption,
  };

  switch (type) {
    case 'input':
      inputSelProps.inputProps = {
        props: {
          name: key,
          value: state[key],
          onChange: (e) => {
            setState((prev) => {
              return {
                ...prev,
                [key]: e.target.value,
              };
            });
          },
        },
      };
      break;

    case 'select':
      inputSelProps.selectProps = {
        props: {
          isClearable: true,
          name: key,
          placeholder: '請選擇',
          options: selectOptions,
          value: selectOptions?.find((item) => item.value === state[key]) || null,
          onChange: (option) => {
            setState((prev) => {
              return {
                ...prev,
                [key]: option?.value || '',
              };
            });
          },
        },
      };
      break;

    case 'date':
      inputSelProps.datePickerProps = {
        props: {
          name: key,
          value: state[key] ? moment(state[key]) : null,
          onChange: (date) => {
            const isoStr = date?.toISOString() || '';

            setState((prev) => {
              return {
                ...prev,
                [key]: isoStr,
              };
            });
          },
        },
      };

    default:
      break;
  }

  return inputSelProps;
};

type Tstate = {
  [key: string]: string;
};

type Tconfig_filter = {
  caption: string;
  key: string;
  type: 'input' | 'select' | 'date';
  selectOptions?: { value: string; label: string }[];
}[];

const config_filter: Tconfig_filter = [
  {
    caption: 'T01',
    key: 'T01',
    type: 'input',
  },
  {
    caption: 'T02',
    key: 'T02',
    type: 'input',
  },
  {
    caption: 'T03',
    key: 'T03',
    type: 'input',
  },
  {
    caption: 'T04',
    key: 'T04',
    type: 'select',
    selectOptions: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
    ],
  },
  {
    caption: 'T05',
    key: 'T05',
    type: 'date',
  },
];

// ===============================================================

const Table_customer = () => {
  const { dataArr, viewRef_bottom, isLoadingPage1, reset } = useGetCustomers_infinite_2();

  useEffect(() => {
    reset();
  }, []);

  return (
    <Table
      dataArr={dataArr}
      viewRef={viewRef_bottom}
      keyArr={keyArr}
      config={config}
      onDoubleClick={(dto) => {
        console.log(dto);
      }}
    />
  );
};

function Table<Dto extends Tdto>({
  dataArr,
  viewRef,
  //
  keyArr,
  config,
  //
  onDoubleClick,
}: {
  dataArr: Dto[];
  viewRef: (node?: Element | null) => void;
  //
  keyArr: (keyof Tconfig<Dto>)[];
  config: Tconfig<Dto>;
  //
  onDoubleClick: (dto: Dto) => void;
}) {
  return (
    <div className={scss.table}>
      {/*  */}
      <Row thead={true}>
        {keyArr.map((key) => {
          const { label, style } = config[key];

          return (
            <Cell key={key} style={style}>
              {label}
            </Cell>
          );
        })}
      </Row>
      {/*  */}
      {dataArr.map((data, index) => {
        const { id } = data;

        const ref = index === dataArr.length - 5 ? viewRef : undefined;

        return (
          <Row key={id} ref={ref} onDoubleClick={() => onDoubleClick(data)}>
            {keyArr.map((key) => {
              let value = data[key] as string | number | null | undefined | React.ReactNode;
              const { style, reducer } = config[key];

              reducer && (value = reducer(data));

              return (
                <Cell key={key} style={style}>
                  {value}
                </Cell>
              );
            })}
          </Row>
        );
      })}
      {/*  */}
    </div>
  );
}

type Tdto = {
  [key: string]: any;
  id: string;
};

type Tconfig<Dto = Tdto> = {
  [key in string]: {
    label: string;
    style: React.CSSProperties;
    reducer?: (data: Dto) => React.ReactNode;
  };
};

type Tkey = keyof Tconfig<TcustomerDto>;

const config: Tconfig<TcustomerDto> = {
  name: {
    label: '名稱',
    style: {
      width: '300px',
    },
  },
  nickname: {
    label: '暱稱',
    style: {
      width: '200px',
    },
  },
};

const keyArr: Tkey[] = ['name', 'nickname'];
