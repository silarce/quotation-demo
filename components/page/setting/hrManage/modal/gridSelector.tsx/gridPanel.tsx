import { useState, useEffect } from 'react';

// antd
import { Modal } from 'antd';

// global gear
import TwoBtnFooter from 'components/global/gear/modal/footer/twoBtnFooter';
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// css
import scss from './gridPanel.module.scss';

export default function GridPanel({
  visible,
  title,
  dataArr,
  onCancel,
  onConfirm,
  note,
}: {
  visible: boolean;
  title: string;
  dataArr: string[];
  onCancel: () => void;
  onConfirm: (indexArr: number[]) => void;
  note?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number[]>([]);

  useEffect(() => {
    if (!visible) {
      setActiveIndex([]);
    }
  }, [visible]);

  const onClick = (index: number) => {
    const theIndex = activeIndex.indexOf(index);

    if (theIndex !== -1) {
      activeIndex.splice(theIndex, 1);
    } else {
      activeIndex.push(index);
    }

    setActiveIndex([...activeIndex]);
  };

  const theOnConfirm = () => {
    onConfirm(activeIndex);
  };

  // -----------------------------------------------------------------------------
  return (
    <Modal
      className={scss.container}
      open={visible}
      closable={false}
      centered={true}
      width={620}
      // destroyOnHidden={true}
      onCancel={onCancel}
      footer={<TwoBtnFooter {...{ onConfirm: theOnConfirm, onCancel }} />}
    >
      <div className={scss.title}>
        <span>{title}</span>
        <span className={scss.note}>{note}</span>
      </div>

      <div className={scss.listContainer}>
        {dataArr?.map((string, index, arr) => {
          const isActive = activeIndex.includes(index);
          // 判定是否為最後一行的元素，然後加上className
          let noBorder = '';

          if (arr.length > 8 && arr.length - (index + 1) <= 3) {
            const remainder = arr.length % 4 || 4;

            if (arr.length - (index + 1) < remainder) {
              noBorder = scss.noBorder;
            }
          }

          return (
            <CellWithBar key={index} isActive={isActive} className={scss.item}>
              <div onClick={() => onClick(index)}>
                <span className={noBorder}>{string}</span>
              </div>
            </CellWithBar>
          );
        })}
      </div>
    </Modal>
  );
}
