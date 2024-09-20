import { useEffect } from 'react';

import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
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

const Filter = ({ onConfirm }: { onConfirm: (props: { [key: string]: string }) => void }) => {
  return (
    <div className={scss.filter}>
      <form className={scss.inputPanel}>
        <InputSel caption="T01" inputProps={{}} />
        <InputSel caption="T02" inputProps={{}} />
        <InputSel caption="T03" inputProps={{}} />
      </form>

      <div className={scss.btnBar}>
        <SquareBtn label="清除條件" sharp="long" />
        <SquareBtn label="搜尋" sharp="long" />
      </div>
    </div>
  );
};

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
