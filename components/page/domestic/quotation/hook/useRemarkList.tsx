import { useState, ChangeEvent } from 'react';

// global gear
import { ModalInfo02 } from 'components/global/gear/modal/simpleModal/alertModals';

// type
import { Tquotation, Tremark } from 'fakeDatabase/domestic/quotation/fakeQuotationList';

import _ from 'lodash';

export default function useRemarkList(quotationData?: Tquotation) {
  let remarkListOri;

  if (quotationData) {
    remarkListOri = quotationData.remarkList;
  } else {
    remarkListOri = fakeEmptyRemark;
  }

  const [remarkList, setRemarkList] = useState<Tremark[]>(_.cloneDeep(remarkListOri));

  const onChangeRemarkCreator = (index: number) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setRemarkList((remarkList) => {
        remarkList[index].content = value;

        return [...remarkList];
      });
    };
  };

  const addRemarks = (selRemark: Tremark[]) => {
    if (!selRemark[0]) {
      return ModalInfo02({ title: '請選擇備註' });
    }

    const newRemarkList = remarkList.concat([..._.cloneDeep(selRemark)]);
    setRemarkList([...newRemarkList]);
  };

  const deleteRemark = (index: number) => {
    remarkList.splice(index, 1);
    setRemarkList([...remarkList]);
  };

  return {
    remarkList,
    setRemarkList,
    addRemarks,
    onChangeRemarkCreator,
    deleteRemark,
  };
}

type TuseRemarkList = ReturnType<typeof useRemarkList>;

export type { TuseRemarkList };

// ==================================================
const fakeEmptyRemark: Tremark[] = [];
