import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// antd
import { Popover } from 'antd';

// component

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// api
import { useGetContract_id } from 'js/api/api_quotation';
import { useGetEngineeringContact, useGetElectronicSupplies } from 'js/api/api_engineering';

import { Icon_info } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './electronicSupplies.module.scss';

// utils
import { workSheetReducer, TquotationProductItemDto } from 'js/utils/worksheet/reducer';

// ------------------------------------------------------------------

type Tquery = {
  contractId: string;
};

type TdoorInfo = {
  qtyTotal: number;
  list: {
    [key: string]: {
      doorTypeName: string;
      qty: number;
    };
  };
};

type TproductItemList = {
  [key: string]: {
    productItem: TquotationProductItemDto;
    qty: number;
  };
};

// ------------------------------------------------------------------

// engineeringContact

export default function ElectronicSupplies() {
  const router = useRouter();
  const { contractId } = router.query as Tquery;

  // ------------------------------------------------------------------

  const { data: contract, update } = useGetContract_id(contractId, {
    customPopulate: ['engineeringContact', 'worksheet.contractProductItems'],
  });
  // const engineeringContactId = contract?.engineeringContactId ?? '';

  const worksheet = contract?.worksheet;

  const {
    contractNumber = '',
    projectName = '',
    projectContent = '',
    projectNumber = '',
  } = contract?.engineeringContact ?? {};
  // ------------------------------------------------------------------

  // const doorsInfo: TdoorInfo = useMemo(() => {
  //   const list: TdoorInfo['list'] = {};

  //   const itemArr = contract?.worksheet?.contractProductItems ?? [];
  //   const qtyTotal = itemArr?.length ?? 0;

  //   itemArr.forEach((item) => {
  //     const { doorModelName } = item;

  //     if (!list[doorModelName]) {
  //       list[doorModelName] = {
  //         doorTypeName: doorModelName,
  //         qty: 0,
  //       };
  //     }

  //     list[doorModelName].qty = list[doorModelName].qty + 1;
  //   });

  //   return {
  //     qtyTotal,
  //     list: list,
  //   };
  // }, []);

  const { itemTokenList, itemIdArrList, itemList, doorQtySubTotal, doorQtyTotal } = useMemo(() => {
    if (!worksheet?.contractProductItems) {
      return {};
    }

    const itemList: TproductItemList = {};
    const doorQtySubTotal: { [key: string]: number } = {};
    let doorQtyTotal = 0;

    const { itemTokenList, itemIdArrList } = workSheetReducer({ worksheet });

    Object.keys(itemIdArrList).forEach((idKey, index) => {
      const list = itemTokenList[idKey];

      for (const [key, value] of Object.entries(list)) {
        if (key === 'originalItem') {
          continue;
        }

        const qty = itemIdArrList[idKey][key].length;

        const doorType = value.doorModelName;

        if (!doorQtySubTotal[doorType]) {
          doorQtySubTotal[doorType] = qty;
        } else {
          doorQtySubTotal[doorType] += qty;
        }

        doorQtyTotal += qty;

        itemList[key] = {
          productItem: value,
          qty,
        };
      }
    });

    return {
      itemTokenList,
      itemIdArrList,
      itemList,
      doorQtySubTotal,
      doorQtyTotal,
    };
  }, [worksheet]);

  // ------------------------------------------------------------------

  useEffect(() => {
    update();
  }, []);

  // ------------------------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'addButton',
      label: '建立料單',
      onClick: () =>
        router.push({
          pathname: `${router.pathname}/edit`,
          query: { ...router.query },
        }),
    },
  ];

  // ------------------------------------------------------------------

  const Info = () => {
    const Content = (
      <ul>
        {Object.keys(doorQtySubTotal ?? {}).map((key, index) => {
          return (
            <li key={index} className="flex gap-3">
              <span>{key}</span>
              <span>{doorQtySubTotal![key]}樘</span>
            </li>
          );
        })}
      </ul>
    );

    return (
      <Popover content={Content} trigger={'hover'} placement="right">
        <div>
          <Icon_info />
        </div>
      </Popover>
    );
  };

  // ------------------------------------------------------------------

  return (
    <SubLayer>
      <PageHeader panelList={panelList} contractNumber={contract?.contractNumber ?? '---'} />
      <div className={scss.container}>
        <div className={scss.info}>
          <InputSel
            caption="工程編號"
            showBaseline="invisible"
            captionStyle={{ width: '80px' }}
            wrapperStyle={{ gap: '25px' }}
            inputProps={{
              props: {
                value: projectNumber,
                readOnly: true,
              },
            }}
          />
          <InputSel
            caption="工程名稱"
            showBaseline="invisible"
            captionStyle={{ width: '80px' }}
            wrapperStyle={{ gap: '25px' }}
            inputProps={{
              props: {
                value: projectName,
                readOnly: true,
              },
            }}
          />
          <InputSel
            caption="門型數量"
            showBaseline="invisible"
            captionStyle={{ width: '80px' }}
            wrapperStyle={{ gap: '25px' }}
            inputProps={{
              props: {
                value: doorQtyTotal,
                readOnly: true,
              },
            }}
            suffix={<Info />}
          />
          <InputSel
            caption="領料狀態"
            showBaseline="invisible"
            captionStyle={{ width: '80px' }}
            wrapperStyle={{ gap: '25px' }}
            inputProps={{
              props: {
                value: '領料尚未完成',
                readOnly: true,
                className: classNames(scss.supplyStatus, false && scss.isDone),
              },
            }}
          />
        </div>
        <div className={scss.list}></div>
      </div>
    </SubLayer>
  );
}

// =============================================================
