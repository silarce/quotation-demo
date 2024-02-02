import { useEffect } from 'react';

import { useRouter } from 'next/router';
import Link, { LinkProps } from 'next/link';
import classNames from 'classnames';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import scss from './index.module.scss';

// api
import { useGetOutsourcing } from 'js/api/api_outsourcing';

// --------------------------------------------------------------

type Tquery = {
  keyword: string | undefined;
};

// --------------------------------------------------------------
export default function OutsourcingVendorManagement() {
  const router = useRouter();
  const { keyword } = router.query as Tquery;

  // --------------------------------------------------------------

  const filter = {
    $or: [{ name: { $contains: keyword } }, { contactNumber: { $contains: keyword } }, { taxId: { $eq: keyword } }],
  };

  const {
    //
    dataArr,
    viewRef_bottom,
    isLoadingPage1,
    reset,
  } = useGetOutsourcing({ customParams: { filter } });

  // --------------------------------------------------------------

  useEffect(() => {
    reset();
  }, [keyword]);

  // --------------------------------------------------------------
  const rowArr: Tcontrol['rowArr'] = dataArr.map((data) => {
    const { id, name, contactNumber, taxId } = data;

    const href = {
      pathname: '/worksDepartment/outsourcingVendorManagement/edit',
      query: { outsourcingId: id },
    };

    return {
      name,
      phoneNumber: contactNumber,
      taxNumber: taxId,
      linkProps: { href },
    };
  });

  const control = { rowArr };

  // ----------------------------------------------------------------

  const searchTargetList: TsearchGroup['searchTargetList'] = [
    {
      placeholder: '關鍵字',
      defaultValue: keyword,
    },
  ];

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch: ([_keyword]) => {
      const keyword = (_keyword || undefined) as string | undefined;

      router.push({
        query: { keyword },
      });
    },
  };

  const panelList01: TpanelList = [
    { searchGroup },
    {
      type: 'myButton',
      label: '新增',
      onClick: () => {
        router.push('/worksDepartment/outsourcingVendorManagement/edit');
      },
    },
  ];

  return (
    <SubLayer isLoading_subLayer={isLoadingPage1}>
      <PageHeader02 tag="外包廠商管理" panelList={panelList01} />

      <div className={scss.main}>
        <Table control={control} viewRef_bottom={viewRef_bottom} />
      </div>
    </SubLayer>
  );
}

// ===================================================================

type TcontrolItem = {
  name: string;
  phoneNumber: string;
  taxNumber: string;
  linkProps: LinkProps;
};

type Tcontrol = {
  rowArr: TcontrolItem[];
};

const Table = ({
  viewRef_bottom,
  control,
}: {
  viewRef_bottom: (node?: Element | null | undefined) => void;
  control: Tcontrol;
}) => {
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
          <span>統一編號</span>
        </div>
      </div>
      <div className={classNames(scss.tbody)}>
        {rowArr.map((item, index) => {
          const { name, phoneNumber, taxNumber, linkProps } = item;

          const ref = index === rowArr.length - 5 ? viewRef_bottom : undefined;

          return (
            <CellWithBar key={index}>
              <Link {...linkProps} ref={ref}>
                <div className={scss.row}>
                  <div className={scss.cell}>
                    <span>{name}</span>
                  </div>
                  <div className={scss.cell}>
                    <span>{phoneNumber}</span>
                  </div>
                  <div className={scss.cell}>
                    <span>{taxNumber}</span>
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
