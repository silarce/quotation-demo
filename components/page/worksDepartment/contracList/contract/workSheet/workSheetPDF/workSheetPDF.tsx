import React, { useRef, Fragment, useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// component
import Miku_frontend_table01, { Tcontrol_table01 } from 'components/otherProject/miku-frontend/Table01';
import Table_specialDoor, { Tprops_table_specialDoor } from './table_specialDoor';
import Table_w1w3, { Tprops_table_w1w3 } from './table_w1w3';

// antd
import Modal from 'antd/lib/modal/Modal';
import { Checkbox, Divider } from 'antd';

const CheckboxGroup = Checkbox.Group;
import ClearModal from 'components/global/myAntd/modal';

// gear
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './workSheetPDF.module.scss';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// =====================================================================

type Textends = {
  id: string;
  parentId: string;
  parentItemName: string;
};

type Tcontrol = {
  info: {
    contractNumber: string;
    projectName: string;
    projectAddress: string;
    customerName: string;
    contactPerson: string;
    // 開單日期
    billingDate: string;
    // 出貨日期
    shippingDate: string;
  };
  itemArr: (Tcontrol_table01 & Textends)[];
  specialItemArr: (Tprops_table_specialDoor & Textends)[];
  w1w3ItemArr: (Tprops_table_w1w3 & Textends)[];
};

type Tstate_showedSheet = {
  parentId: string;
  parentItemName: string;
  itemArr: { id: string; childItemName: string; checked: boolean }[];
};

export type { Tcontrol as Tcontrol_workSheetPDF_01 };

// =====================================================================

// MARK:START

export default function WorkSheetPDF({
  isShow,
  onCancel,
  control,
}: {
  isShow: boolean;
  onCancel: () => void;
  control: Tcontrol;
}) {
  const { itemArr, specialItemArr, w1w3ItemArr } = control;

  // ---------------------------------------------------------------------
  const refPdf = useRef<(HTMLDivElement | null)[]>([]);

  const [showSelector, setShowSelector] = useState(false);

  const { checkedSheetArr, createKit } = useCheckedSheet({
    itemArr: control.itemArr,
    specialItemArr: control.specialItemArr,
    w1w3ItemArr: control.w1w3ItemArr,
  });

  // ---------------------------------------------------------------------
  const { chunkedList, chunkedList_specialItem, chunkedList_w1w3Item } = useMemo(() => {
    const checkedItemArr = checkedSheetArr
      .flatMap((item) => item.itemArr)
      .filter((item) => item.checked)
      .map((item) => item.id);

    const chunkedList = _.chunk(
      itemArr.filter((item) => checkedItemArr.includes(item.id)),
      3
    );
    const chunkedList_specialItem = _.chunk(
      specialItemArr.filter((item) => checkedItemArr.includes(item.id)),
      2
    );
    const chunkedList_w1w3Item = _.chunk(
      w1w3ItemArr.filter((item) => checkedItemArr.includes(item.id)),
      6
    );

    return {
      chunkedList,
      chunkedList_specialItem,
      chunkedList_w1w3Item,
    };
  }, [checkedSheetArr, itemArr, specialItemArr, w1w3ItemArr]);

  const pageCount = chunkedList.length + chunkedList_specialItem.length + chunkedList_w1w3Item.length;

  const page_specialItem = (indexNumber: number) => {
    return indexNumber + chunkedList.length;
  };

  const page_w1w3Item = (indexNumber: number) => {
    return indexNumber + chunkedList.length + chunkedList_specialItem.length;
  };

  // ---------------------------------------------------------------------

  refPdf.current = [];

  // ---------------------------------------------------------------------

  // MARK:RENDER

  return (
    <Modal
      visible={isShow}
      footer={null}
      closable={false}
      centered={true}
      destroyOnClose={true}
      width={'auto'}
      wrapClassName={scss.antdModalWrapper}
      onCancel={onCancel}
    >
      <div className={scss.body}>
        <div className={scss.panelBar}>
          <MyButton_v2
            label="選擇工作表"
            onClick={() => {
              setShowSelector(true);
            }}
          />
          <MyButton_v2
            label="下載PDF"
            onClick={() => {
              // dlPdf();
              console.log(refPdf.current);
              dlPdf({
                eleArr: refPdf.current,
                pdfName: control.info.contractNumber,
              });
            }}
          />
        </div>

        {chunkedList.map((itemArr, index) => {
          return (
            <div key={index}>
              {index !== 0 && <hr className=" border-black" />}

              <div
                ref={(ele) => {
                  refPdf.current[index] = ele;
                }}
                className={scss.container}
              >
                <div>
                  <Title page={index + 1} pageCount={pageCount} />
                  <Info {...control.info} />

                  <div className={scss.itemGrid}>
                    {itemArr.map((control_item, index) => {
                      return (
                        <Fragment key={index}>
                          <Miku_frontend_table01 control={control_item} />
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/*  */}
        {chunkedList_specialItem.map((specialItemArr, index) => {
          const page = page_specialItem(index + 1);

          return (
            <div key={index}>
              {index !== 0 && <hr className=" border-black" />}

              <div
                ref={(ele) => {
                  refPdf.current[page - 1] = ele;
                }}
                className={scss.container}
              >
                <div>
                  <Title page={page} pageCount={pageCount} />
                  <Info {...control.info} />

                  {specialItemArr.map((specialItem, index) => {
                    return <Table_specialDoor key={index} {...specialItem} />;
                  })}
                </div>
              </div>
            </div>
          );
        })}
        {chunkedList_w1w3Item.map((w1w3Item, index) => {
          const page = page_w1w3Item(index + 1);

          return (
            <div key={index}>
              {index !== 0 && <hr className=" border-black" />}

              <div
                ref={(ele) => {
                  refPdf.current[page - 1] = ele;
                }}
                className={scss.container}
              >
                <div>
                  <Title page={page} pageCount={pageCount} />
                  <Info {...control.info} />
                  <Table_w1w3 key={index} itemArr={w1w3Item} />
                </div>
              </div>
            </div>
          );
        })}
        <ClearModal visible={showSelector} width={1000} zIndex={1001} onCancel={() => setShowSelector(false)}>
          <div className="p-5">
            {checkedSheetArr.map(({ parentId, parentItemName, itemArr: item }, index) => {
              const { indeterminate, isAllChecked, checkAll, renewItem, options } = createKit(index);

              const value = item.filter((item) => item.checked).map((item) => item.id);

              return (
                <Fragment key={parentId}>
                  <div>
                    <div>
                      <Checkbox
                        indeterminate={indeterminate}
                        checked={isAllChecked}
                        onChange={(e) => {
                          checkAll(e.target.checked);
                        }}
                      >
                        <span className="text-xl text-main font-bold">{parentItemName}</span>
                      </Checkbox>
                    </div>
                    <div>
                      <CheckboxGroup
                        value={value}
                        options={options()}
                        onChange={(arr) => {
                          const valueArr = arr as string[];
                          renewItem(valueArr);
                        }}
                      />
                    </div>
                  </div>
                  <Divider />
                </Fragment>
              );
            })}
          </div>
        </ClearModal>

        {/*  */}
      </div>
    </Modal>
  );
}

// MARK:END

// =====================================================================
// =====================================================================
// =====================================================================

// region COMPONENT

const Title = ({ page, pageCount }: { page: React.ReactNode; pageCount: React.ReactNode }) => {
  return (
    <div className="text-2xl text-center pt-5 mb-1 relative">
      <span>工作表</span>
      <span className="absolute right-0">
        {page} / {pageCount} 頁
      </span>
    </div>
  );
};

const Info = ({
  contractNumber,
  customerName,
  billingDate,
  projectName,
  contactPerson,
  shippingDate,
  projectAddress,
}: {
  contractNumber: React.ReactNode;
  customerName: React.ReactNode;
  billingDate: React.ReactNode;
  projectName: React.ReactNode;
  contactPerson: React.ReactNode;
  shippingDate: React.ReactNode;
  projectAddress: React.ReactNode;
}) => {
  return (
    <table className={classNames('w-full mb-1', scss.infoTable)}>
      <tbody>
        <tr>
          <td>合約編號: {contractNumber}</td>
          <td>客戶名稱: {customerName}</td>
          <td>開單日期: {billingDate}</td>
        </tr>
        <tr>
          <td>工程名稱: {projectName}</td>
          <td>聯絡人: {contactPerson}</td>
          <td>出貨日期: {shippingDate}</td>
        </tr>
        <tr>
          <td colSpan={3}>{`工程地點: ${projectAddress}`}</td>
        </tr>
      </tbody>
    </table>
  );
};

// MARK:useCheckedSheet
const useCheckedSheet = ({
  itemArr,
  specialItemArr,
  w1w3ItemArr,
}: {
  itemArr: Tcontrol['itemArr'];
  specialItemArr: Tcontrol['specialItemArr'];
  w1w3ItemArr: Tcontrol['w1w3ItemArr'];
}) => {
  const [stateArr, setStateArr] = useState<Tstate_showedSheet[]>([]);

  const createKit = (parentIndex: number) => {
    const isAllChecked = stateArr[parentIndex].itemArr.every((item) => item.checked);
    const indeterminate = isAllChecked ? false : stateArr[parentIndex].itemArr.some((item) => item.checked);

    const checkAll = (checked: boolean) => {
      const newStateArr = [...stateArr];
      newStateArr[parentIndex].itemArr.forEach((item) => {
        item.checked = checked;
      });
      setStateArr(newStateArr);
    };

    const checkItem = (index: number, checked: boolean) => {
      const newStateArr = [...stateArr];
      newStateArr[parentIndex].itemArr[index].checked = checked;
      setStateArr(newStateArr);
    };

    const renewItem = (idArr: string[]) => {
      const newStateArr = [...stateArr];
      const state = newStateArr[parentIndex];
      const itemArr = state.itemArr.map((item) => {
        return {
          ...item,
          checked: idArr.includes(item.id),
        };
      });
      state.itemArr = itemArr;

      setStateArr(newStateArr);
    };

    const options = () => {
      return stateArr[parentIndex].itemArr.map((item) => ({
        value: item.id,
        label: item.childItemName,
      }));
    };

    return {
      indeterminate,
      isAllChecked,
      checkAll,
      checkItem,
      options,
      renewItem,
    };
  };

  useEffect(() => {
    const dict: Record<string, Tstate_showedSheet> = {};

    [...itemArr, ...specialItemArr, ...w1w3ItemArr].forEach((item) => {
      const { id, parentId, parentItemName, itemName } = item;

      if (!dict[parentId]) {
        dict[parentId] = {
          parentId,
          parentItemName,
          itemArr: [],
        };
      }

      dict[parentId].itemArr.push({
        id,
        childItemName: itemName,
        checked: true,
      });
    });

    setStateArr(Object.values(dict));
  }, [itemArr, specialItemArr, w1w3ItemArr]);

  return {
    checkedSheetArr: stateArr,
    createKit,
  };
};

// =====================================================================

// MARK:dlPdf
const dlPdf = async ({ eleArr: eleArr, pdfName }: { eleArr: (HTMLDivElement | null)[]; pdfName?: string }) => {
  if (eleArr.includes(null)) {
    myAlert.err({ title: 'PDF生成失敗' });
    console.error('eleArr', eleArr);

    return;
  }

  showRootLoading(true, '正在處理PDF');

  const doc = new jsPDF({
    orientation: 'l',
    unit: 'px',
    format: 'a3',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let isFirst = true;
  let item;

  for (item of eleArr) {
    if (!item) {
      continue;
    }

    const image = await html2canvas(item, {
      scale: 3,
    }).then((canvas) => {
      const image = canvas.toDataURL('image/JPEG');

      return image;
    });

    if (!isFirst) {
      doc.addPage();
    }

    isFirst = false;

    doc.addImage(image, 'png', 0, 0, pageWidth, pageHeight);
  }

  doc.save(`工作表${pdfName}.pdf`);
  showRootLoading(false);
};
