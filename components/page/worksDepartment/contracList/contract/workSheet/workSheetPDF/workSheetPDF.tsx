import React, { useRef, Fragment, useState, useEffect } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// component
import Miku_frontend_table01, { Tcontrol_table01 } from 'components/otherProject/miku-frontend/Table01';
import Table_specialDoor, { Tprops_table_specialDoor } from './table_specialDoor';
import Table_w1w3, { Tprops_table_w1w3 } from './table_w1w3';

// antd
import Modal from 'antd/lib/modal/Modal';
import { Checkbox, Divider } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
const CheckboxGroup = Checkbox.Group;

// gear
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

import scss from './workSheetPDF.module.scss';

// =====================================================================

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
  itemArr: Tcontrol_table01[];
  specialItemArr: Tprops_table_specialDoor[];
  w1w3ItemArr: Tprops_table_w1w3[];
};

type Tstate_showedSheet = {
  id: string;
  parentItemName: string;
  item: { id: string; childItemName: string; checked: boolean }[];
};

export type { Tcontrol as Tcontrol_workSheetPDF_01 };

// =====================================================================
export default function WorkSheetPDF({
  isShow,
  onCancel,
  control,
}: {
  isShow: boolean;
  onCancel: () => void;
  control: Tcontrol;
}) {
  // ---------------------------------------------------------------------

  const itemArr = control.itemArr;
  const specialItemArr = control.specialItemArr;
  const w1w3ItemArr = control.w1w3ItemArr;

  const chunkedList = _.chunk(itemArr, 3);
  const chunkedList_specialItem = _.chunk(specialItemArr, 2);
  const chunkedList_w1w3Item = _.chunk(w1w3ItemArr, 6);

  const pageCount = chunkedList.length + chunkedList_specialItem.length + chunkedList_w1w3Item.length;

  const page_specialItem = (indexNumber: number) => {
    return indexNumber + chunkedList.length;
  };

  const page_w1w3Item = (indexNumber: number) => {
    return indexNumber + chunkedList.length + chunkedList_specialItem.length;
  };

  // ---------------------------------------------------------------------

  const refPdf = useRef<(HTMLDivElement | null)[]>([]);

  const dlPdf = async () => {
    if (!isShow || !refPdf.current[0]) {
      return;
    }

    showRootLoading(true, '正在處理PDF');

    // const doc = new jsPDF('l', 'px', 'a4');
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'px',
      // format: 'a4',
      format: 'a3',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let isFirst = true;
    let item;

    for (item of refPdf.current) {
      if (!item) {
        continue;
      }

      const image = await html2canvas(
        item,
        {
          // scale: 5,
          scale: 3,
        }
        // ,{
        //   useCORS: true,
        //   allowTaint: true,
        // }
      ).then((canvas) => {
        const image = canvas.toDataURL('image/JPEG');

        return image;
      });

      if (!isFirst) {
        doc.addPage();
      }

      isFirst = false;
      // 留作參考
      // doc.addImage(image, "JPEG", 0, 0, 595, 842);
      // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);
      doc.addImage(image, 'png', 0, 0, pageWidth, pageHeight);
    }

    doc.save(`工作表${control.info.contractNumber}.pdf`);
    showRootLoading(false);
  };

  // ---------------------------------------------------------------------
  return (
    <Modal
      //
      visible={isShow}
      footer={null}
      closable={false}
      centered={true}
      destroyOnClose={true}
      width={'auto'}
      wrapClassName={scss.antdModalWrapper}
      onCancel={onCancel}
    >
      <div className={scss.panelBar}>
        <MyButton_v2 label="選擇" onClick={worksheetSelector} />
        <MyButton_v2 label="下載PDF" onClick={dlPdf} />
      </div>

      {chunkedList.map((itemArr, index) => {
        return (
          <div key={index}>
            {index !== 0 && <hr className=" border-black" />}

            <div
              //
              ref={(ele) => (refPdf.current[index] = ele)}
              className={scss.container}
              id="report"
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
        return (
          <div key={index}>
            {index !== 0 && <hr className=" border-black" />}

            <div
              //
              ref={(ele) => (refPdf.current[index] = ele)}
              className={scss.container}
              id="report"
            >
              <div>
                <Title page={page_specialItem(index + 1)} pageCount={pageCount} />
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
        return (
          <div key={index}>
            {index !== 0 && <hr className=" border-black" />}

            <div
              //
              ref={(ele) => (refPdf.current[index] = ele)}
              className={scss.container}
              id="report"
            >
              <div>
                <Title page={page_w1w3Item(index + 1)} pageCount={pageCount} />
                <Info {...control.info} />
                <Table_w1w3 key={index} itemArr={w1w3Item} />
              </div>
            </div>
          </div>
        );
      })}

      {/*  */}
    </Modal>
  );
}

// =====================================================================

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

const worksheetSelector = () => {
  return myAlert.clear({
    width: 1000,
    content: (
      <div className="p-5">
        <form
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            console.log(target.name);
            console.log(target.checked);
            console.log(target.value);
          }}
        >
          {/*  */}
          <div>
            <Checkbox
              name="all"
              // indeterminate={indeterminate}
            >
              <span className="text-xl text-main font-bold">ONE</span>
            </Checkbox>
          </div>
          <div>
            <CheckboxGroup
              options={
                // ['a', 'b', 'c']
                [
                  { value: 'a', label: 'A' },
                  { value: 'b', label: 'B' },
                  { value: 'c', label: 'C' },
                ]
              }
            />
          </div>
        </form>
        {/*  */}
        <form
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            console.log(target.name);
            console.log(target.checked);
          }}
        >
          {/*  */}
          <hr />
          <br />
          <div>
            <Checkbox
              name="all"
              // indeterminate={indeterminate}
            >
              <span className="text-xl text-main font-bold">TWO</span>
            </Checkbox>
          </div>
          <div>
            <CheckboxGroup options={['a', 'b', 'c']} />
          </div>
        </form>
        <hr />
        <br />
        <br />
        <SquareBtn sharp="long">確認</SquareBtn>
      </div>
    ),
  });
};

const useCheckedSheet = () => {
  const [stateArr, setStateArr] = useState<Tstate_showedSheet[]>([]);

  const createKit = (parentIndex: number) => {
    const indeterminate = stateArr[parentIndex].item.some((item) => item.checked);

    const checkAll = (checked: boolean) => {
      const newStateArr = [...stateArr];
      newStateArr[parentIndex].item.forEach((item) => {
        item.checked = checked;
      });
      setStateArr(newStateArr);
    };

    const checkItem = (index: number, checked: boolean) => {
      const newStateArr = [...stateArr];
      newStateArr[parentIndex].item[index].checked = checked;
      setStateArr(newStateArr);
    };

    return {
      indeterminate,
      checkAll,
      checkItem,
    };
  };

  useEffect(() => {
    setStateArr(fakeState);
  }, []);

  return {
    checkedSheetArr: stateArr,
    createKit,
  };
};

const fakeState: Tstate_showedSheet[] = [
  {
    id: 'foo',
    parentItemName: 'ONE',
    item: [
      { id: 'foo_1', childItemName: 'foo_1', checked: false },
      { id: 'foo_2', childItemName: 'foo_2', checked: false },
      { id: 'foo_3', childItemName: 'foo_3', checked: false },
    ],
  },
  {
    id: 'bar',
    parentItemName: 'TWO',
    item: [
      { id: 'bar_1', childItemName: 'bar_1', checked: false },
      { id: 'bar_2', childItemName: 'bar_2', checked: false },
      { id: 'bar_3', childItemName: 'bar_3', checked: false },
    ],
  },
];
