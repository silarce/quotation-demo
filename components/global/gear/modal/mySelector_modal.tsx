import { useState } from 'react';
import classNames from 'classnames';

// global gear
import ModalListSelectorWithSearch from 'components/global/gear/modal/modalListSelectorWithSearch';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';

// css
import scss from './mySelector_modal.module.scss';

// ===================================================================
type Tdata_ex = {
  [key: string]: string | number | undefined | null;
};

type Tconfig<Key> = {
  key: Key;
  label?: string; // 其實現在不需要
  className?: string;
};

// config範例
// const selectorConfigArr = [
//   { key: 'idNumber', label: '代號', className: 'w-[68px]' },
//   { key: 'name', label: '名稱', className: 'w-auto flex-auto' },
//   { key: 'unit', label: '單位', className: 'w-[40px]' },
//   { key: 'listPrice', label: '牌價', className: 'w-[84px]' },
//   { key: 'price', label: '單價', className: 'w-[84px]' },
// ] as const;

// ===================================================================
export default function MySelector_modal<Tdata extends Tdata_ex>({
  showModal,
  onConfirm,
  onCancel,
  label,
  tip,
  selLimit,
  //
  dataArr,
  configArr,
  modalWidth = '800',
}: {
  showModal: boolean;
  onConfirm: (v: Tdata[]) => void;
  onCancel: () => void;
  label?: string;
  tip?: React.ReactNode;
  selLimit?: 1;
  //
  dataArr: readonly Tdata[];
  configArr: readonly Tconfig<keyof Tdata>[];
  modalWidth: '800' | '1000' | '1200';
}) {
  // const { rwd1023 } = useContext(AppContext);

  // 被選的資料
  const [selData, setSelData] = useState<Tdata[]>([]);

  // const [searchValue, setSearchValue] = useState<string>();

  // ==================================================

  const onClick = (newData: Tdata) => {
    const newArr = [...selData];

    if (selLimit === 1) {
      newArr[0] = newData;
      setSelData(newArr);

      return;
    }

    const theIndex = newArr.findIndex((emp) => emp === newData);

    if (theIndex > -1) {
      newArr.splice(theIndex, 1);
    } else {
      newArr.push(newData);
    }

    setSelData(newArr);
  };

  const theOnConfirm = () => {
    if (!selData) {
      return ModalInfo('請選擇');
    }

    onConfirm(selData);
    theOnCancel();
  };

  const theOnCancel = () => {
    onCancel();
    setSelData([]);
  };

  // const onSearch = (v: string) => {
  //   setSearchValue(v);
  // };

  // ==================================================

  return (
    <ModalListSelectorWithSearch
      label={label ?? ''}
      visible={showModal}
      onConfirm={theOnConfirm}
      onCancel={theOnCancel}
      onSearch={() => {}}
      width={modalWidthLookup[modalWidth]}
      className={classNames(scss.container, scss[`w-${modalWidth}`])}
      tip={tip}
      noSearch={true}
    >
      <div className={scss.listContainer}>
        {dataArr.map((item, index) => {
          const isActive = selData.some((selData) => selData === item);

          return (
            <CellWithBar key={index} isActive={isActive}>
              <div className={scss.row} onClick={() => onClick(item)}>
                {configArr.map((config, index) => {
                  const { key, className } = config;
                  const value = item[key];

                  return (
                    <span key={index} className={classNames(className)}>
                      {value}
                    </span>
                  );
                })}
              </div>
            </CellWithBar>
          );
        })}
      </div>
    </ModalListSelectorWithSearch>
  );
}
// =====================================================================

const modalWidthLookup = {
  '800': '800px',
  '1000': '1000px',
  '1200': '1200px',
} as const;
