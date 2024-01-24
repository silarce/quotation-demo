import Link, { LinkProps } from 'next/link';
import classNames from 'classnames';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import scss from './index.module.scss';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import { DEFAULT_MAX_VERSION } from 'tls';

export default function OutsourcingVendorManagement() {
  // ----------------------------------------------------------------

  const rowArr: Tcontrol['rowArr'] = fakeData.map((data) => {
    const { id, name, phoneNumber, receiptDate } = data;
    const dateStr = getTaiwanDateStr(receiptDate, { withUnit: true }) ?? '';

    const href = {
      pathname: '/worksDepartment/outsourcingVendorManagement/edit',
      query: { vendorId: id },
    };

    return {
      name,
      phoneNumber,
      receiptDate: dateStr,
      linkProps: { href },
    };
  });

  const control = { rowArr };

  // ----------------------------------------------------------------

  const searchTargetList: TsearchGroup['searchTargetList'] = [
    {
      placeholder: '搜尋合約編號',
      defaultValue: '',
    },
  ];

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch: (valueArr) => {
      console.log(valueArr);
    },
  };

  const panelList01: TpanelList = [
    { searchGroup },
    {
      type: 'myButton',
      label: '新增',
      onClick: () => {},
    },
  ];

  return (
    <SubLayer>
      <PageHeader02 tag="外包廠商管理" panelList={panelList01} />

      <div className={scss.main}>
        <Table control={control} />
      </div>
    </SubLayer>
  );
}

// ===================================================================

type TcontrolItem = {
  name: string;
  phoneNumber: string;
  receiptDate: string;
  linkProps: LinkProps;
};

type Tcontrol = {
  rowArr: TcontrolItem[];
};

// CellWithBar

const Table = ({ control }: { control: Tcontrol }) => {
  const { rowArr } = control;

  return (
    <div className={classNames(scss.table)}>
      <div className={scss.block} />

      <div className={classNames(scss.row, scss.thead)}>
        <div className={scss.cell}>
          <span>廠商名稱</span>
        </div>
        <div className={scss.cell}>
          <span>連絡電話</span>
        </div>
        <div className={scss.cell}>
          <span>收款日期</span>
        </div>
      </div>
      <div className={classNames(scss.tbody)}>
        {rowArr.map((item, index) => {
          const { name, phoneNumber, receiptDate, linkProps } = item;

          return (
            <CellWithBar key={index}>
              <Link {...linkProps}>
                <div className={scss.row}>
                  <div className={scss.cell}>
                    <span>{name}</span>
                  </div>
                  <div className={scss.cell}>
                    <span>{phoneNumber}</span>
                  </div>
                  <div className={scss.cell}>
                    <span>{receiptDate}</span>
                  </div>
                </div>
              </Link>
            </CellWithBar>
          );
        })}
      </div>
    </div>
  );
};

const fakeData = [
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
  {
    id: 'fooo',
    name: 'fooo',
    phoneNumber: 'fooo',
    receiptDate: new Date().toISOString(),
  },
];
