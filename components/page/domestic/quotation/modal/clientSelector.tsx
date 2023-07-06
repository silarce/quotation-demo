import { Dispatch, SetStateAction, useState, useMemo } from 'react';

// global gear
import ModalListSelectorWithSearch from 'components/global/gear/modal/modalListSelectorWithSearch';
import CellWrapper from 'components/global/gear/cell/cellWithBar';
import { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';

// css
import style from './clientSelector.module.scss';

// fakeData
// import {
//   TclientProfile,
//   fakeClientProfileList,
// } from "fakeDatabase/client/fakeClientList"
// fakeData/type
import { TuseProfile } from '../hook/useProfile';
import { Class_client } from 'fakeDatabase/fakeAPI/fakeClientApi';

type TclientProfileList = ReturnType<Class_client['get']>;

export default function ClientSelector({
  showModal,
  setShowModal,
  fakeClientList,
  onConfirm,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  fakeClientList: TclientProfileList;
  onConfirm: (v: TclientProfileList[0]) => void;
}) {
  const clientListArr = useMemo(() => {
    // 現在使用假資料，到時候要接api取資料
    // return fakeClientList
    return Object.values(fakeClientList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==================================================
  // 被選的資料
  const [selClient, setSelClient] = useState<TclientProfileList[0]>();
  // 搜尋過濾
  const [searchValue, setSearchValue] = useState('');

  // ==================================================
  const onClick = (item: TclientProfileList[0]) => {
    setSelClient(item);
  };

  const theOnConfirm = () => {
    if (!selClient) {
      return ModalInfo('請選擇公司');
    }

    onConfirm(selClient);
    onCancel();
  };

  const onCancel = () => {
    setShowModal(false);
    setSearchValue('');
    setSelClient(undefined);
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
  };
  // ==================================================

  return (
    <ModalListSelectorWithSearch
      {...{
        label: '請選擇公司',
        visible: showModal,
        setVisible: setShowModal,
        onConfirm: theOnConfirm,
        onCancel,
        onSearch,
      }}
    >
      <ul className={style.container}>
        {clientListArr.map((item, index) => {
          const { clientId } = item;
          const isActive = clientId === selClient?.clientId ? true : false;
          const { name } = item;
          // ------
          const searchReg = new RegExp(searchValue);

          if (!searchReg.test(name)) {
            return null;
          }

          // ------
          return (
            <CellWrapper key={index} isActive={isActive} element="li">
              <div className={style.item} onClick={() => onClick(item)}>
                {name}
              </div>
            </CellWrapper>
          );
        })}
      </ul>
    </ModalListSelectorWithSearch>
  );
}
