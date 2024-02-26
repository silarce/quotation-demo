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

  const {} = contract?.worksheet ?? {};

  const {
    contractNumber = '',
    projectName = '',
    projectContent = '',
    projectNumber = '',
  } = contract?.engineeringContact ?? {};
  // ------------------------------------------------------------------

  const doorsInfo: TdoorInfo = useMemo(() => {
    const list: TdoorInfo['list'] = {};

    const itemArr = contract?.worksheet?.contractProductItems ?? [];
    const qtyTotal = itemArr?.length ?? 0;

    itemArr.forEach((item) => {
      const { doorModelName } = item;

      if (!list[doorModelName]) {
        list[doorModelName] = {
          doorTypeName: doorModelName,
          qty: 0,
        };
      }

      list[doorModelName].qty = list[doorModelName].qty + 1;
    });

    return {
      qtyTotal,
      list: list,
    };
  }, []);

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
    const list = doorsInfo.list;

    const Content = (
      <ul>
        {Object.values(list).map((item, index) => {
          const { doorTypeName, qty } = item;

          return (
            <li key={index} className="flex gap-3">
              <span>{doorTypeName}</span>
              <span>{qty}樘</span>
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
                value: doorsInfo.qtyTotal,
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
