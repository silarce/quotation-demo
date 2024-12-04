import { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

// gear
import ModalListSelectorWithSearch from 'components/global/gear/modal/modalListSelectorWithSearch';
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import scss from './licensePlateSelector.module.scss';

// other
import { AppContext } from 'pages/_app';

/**車牌選擇器 */
export default function LicensePlateSelector({
  visible,
  onConfirm,
  onCancel,
}: // label,
// tip,
{
  visible: boolean;
  onConfirm: (v: string | undefined) => void;
  onCancel: () => void;
  label?: string;
  tip?: string;
}) {
  const { rwd1023 } = useContext(AppContext);

  const [sel, setSel] = useState<string>();

  useEffect(() => {
    if (!visible) {
      setSel(undefined);
    }
  }, [visible]);

  const onClick = (v: string) => {
    // const copyArr = [...sel]
    // const theIndex = sel.findIndex((theMeal) => theMeal === v)
    // if (theIndex > -1) copyArr.splice(theIndex, 1)
    // else copyArr.push(v)
    setSel(v);
  };

  const onSearch = (v: string) => {};

  return (
    <ModalListSelectorWithSearch
      className={scss.antdModal}
      label={'選擇車牌'}
      visible={visible}
      onConfirm={() => onConfirm(sel)}
      onCancel={onCancel}
      onSearch={onSearch}
      width={rwd1023 ? '80vw' : '500px'}
      noSearch={true}
      // tip={tip}
    >
      <div className={scss.body}>
        {licensePlateArrOption.map((data, index) => {
          const { value, label } = data;

          const isActive = sel === value;

          return (
            <CellWithBar key={index} className={scss.row} isActive={isActive} onClick={() => onClick(data.value)}>
              <span>{label}</span>
            </CellWithBar>
          );
        })}
      </div>
    </ModalListSelectorWithSearch>
  );
}

const licensePlateArrOption = [
  { value: 'BRC-3939', label: 'BRC-3939' },
  { value: 'BRW-3939', label: 'BRW-3939' },
  { value: 'ABX-3939', label: 'ABX-3939' },
  { value: 'AYP-3939', label: 'AYP-3939' },
  { value: 'AYM-3939', label: 'AYM-3939' },
  { value: 'AKL-3939', label: 'AKL-3939' },
  { value: 'AVY-3939', label: 'AVY-3939' },
  { value: 'AKC-3939', label: 'AKC-3939' },
  { value: 'BJJ-3939', label: 'BJJ-3939' },
  { value: '3208-J9', label: '3208-J9' },
  { value: 'BGF-0950', label: 'BGF-0950' },
  { value: 'ACQ-3939', label: 'ACQ-3939' },
] as const;
