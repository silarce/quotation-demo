import { useState, MouseEvent } from 'react';

// component
import PanelHeader from './customerList/panelHeader';
import PanelBody from './customerList/panelBody';

// antd
import { Collapse } from 'antd';

// golbal gear
import TwoButtonModal from 'components/global/gear/modal/simpleModal/twoButtonModal';
import { ModalSuccess, ModalErr } from 'components/global/gear/modal/simpleModal/alertModals';
import { setRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// css
import style from './customer.module.scss';

// api type
import { TcustomerDto_TC, apiDeleteCustomers_id } from 'js/api/api_customer';

export default function CustomerList({
  customersList,
  toUpdate,
  isLoading,
}: {
  customersList: TcustomerDto_TC[];
  toUpdate: () => void;
  isLoading: boolean;
}) {
  // ========================================================
  // 點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState('-1');

  const changeActive = (panelIndex: string | string[]) => {
    if (typeof panelIndex !== 'string') {
      return;
    }

    const activeIndex = panelIndex;
    setActiveIndex(activeIndex);
  };
  // ========================================================

  const [selInfo, setSelInfo] = useState({
    id: '',
    customerNumber: '',
    name: '',
  });

  const closeDelPanel = () => {
    setSelInfo({
      id: '',
      customerNumber: '',
      name: '',
    });
  };

  const openDelPanel = (e: MouseEvent, data: TcustomerDto_TC) => {
    e.stopPropagation();

    if (isLoading) {
      return;
    }

    const { id, customerNumber, name } = data;
    setSelInfo({ id, customerNumber, name });
  };

  const deleteEmployee = async () => {
    if (!selInfo.id) {
      return;
    }

    try {
      setRootLoading(true);
      await apiDeleteCustomers_id(selInfo.id);
      await toUpdate();
      ModalSuccess({ title: '刪除完成' });
    } catch {
      await toUpdate();
      ModalErr({ title: '刪除失敗' });
    } finally {
      setRootLoading(false);
      closeDelPanel();
    }
  };

  // ========================================================
  return (
    <div className={style.customerList}>
      <Collapse
        className={style.panel}
        expandIcon={() => null}
        accordion={true}
        onChange={changeActive}
        items={customersList.map((data, index) => {
          const isActive = activeIndex === `${index}`;

          return {
            key: `${index}`,
            label: <PanelHeader customersData={data} isActive={isActive} openDelPanel={openDelPanel} />,
            children: <PanelBody customersData={data} />,
          };
        })}
      />

      <TwoButtonModal
        {...{
          open: !!selInfo.id,
          text: `請確定要刪除「${selInfo.customerNumber}」「${selInfo.name}」?`,
          onConfirm: deleteEmployee,
          onCancel: closeDelPanel,
        }}
      />
    </div>
  );
}
