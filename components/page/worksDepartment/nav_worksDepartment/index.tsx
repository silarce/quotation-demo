import { createContext, useContext } from 'react';

import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import Link from 'next/link'; // LinkProps
import classNames from 'classnames';

import { AppContext } from 'pages/_app';
import { erpFeaturesLookup } from 'components/Layer/SideNav/pathList/type';

import scss from './index.module.scss';

import { TdocType } from 'js/api/dtoTypes';

// =======================================================================

type LinkProps = Parameters<typeof Link>[0];
type MyLinkProps = Omit<LinkProps, 'href'> & {
  href?: LinkProps['href'];
  routerName: string;
  extraQuery?: ParsedUrlQuery;
};

interface Tquery extends ParsedUrlQuery {
  contractId: string;
  version: string | undefined;
}

// =======================================================================

const documentType: TdocType = '保固書';

// =======================================================================

const Nav_worksDepartment = ({ contactThatSkipContract = false }: { contactThatSkipContract: boolean | undefined }) => {
  const { erpFeature } = useContext(AppContext);

  const isShowAccountReceivable = !!erpFeature?.find((item) => item.name === '應收帳款');

  const pass = erpFeature?.some((feature) => {
    return (
      feature.name === erpFeaturesLookup['worksDepartment'] ||
      feature.name === erpFeaturesLookup['accountsReceivable'] ||
      feature.name === erpFeaturesLookup['worksDepartment_worksheet'] ||
      feature.name === erpFeaturesLookup['worksDepartment_deliveryList'] ||
      feature.name === erpFeaturesLookup['worksDepartment_readonly']
    );
  });

  const domesticPass = erpFeature?.some((feature) => {
    return (
      feature.name === erpFeaturesLookup['domestic'] || feature.name === erpFeaturesLookup['worksDepartment_readonly']
    );
  });

  if (pass) {
    return (
      <div className={scss.nav}>
        {isShowAccountReceivable && !contactThatSkipContract && <MyLink routerName="contractTable">合約</MyLink>}
        {isShowAccountReceivable && !contactThatSkipContract && (
          <MyLink routerName="quotationVerifyForm">合約審核表</MyLink>
        )}
        <MyLink routerName="workContactDoc">工程聯絡單</MyLink>
        {!contactThatSkipContract && <MyLink routerName="workSheet">工作表</MyLink>}
        {!contactThatSkipContract && <MyLink routerName="outboundOrder">工程管理單</MyLink>}
        {isShowAccountReceivable && !contactThatSkipContract && (
          <MyLink routerName="accountReceivable">應收帳款明細</MyLink>
        )}
        <MyLink routerName="dispatchList">派工單列表</MyLink>
        <MyLink routerName="electronicSupplies">送電備品列表</MyLink>
        {!contactThatSkipContract && <MyLink routerName="meetingMinutes">會議記錄</MyLink>}
        <MyLink routerName="listOfDeliveryOrders">{'調(退)貨單列表'}</MyLink>
        {!contactThatSkipContract && <MyLink routerName="memorandum">備忘錄</MyLink>}
        {!contactThatSkipContract && (
          <MyLink routerName="certifiedDocument" extraQuery={{ documentType }}>
            保固書
          </MyLink>
        )}
      </div>
    );
  }

  if (domesticPass) {
    return (
      <div className={scss.nav}>
        <MyLink routerName="workContactDoc">工程聯絡單</MyLink>
        {!contactThatSkipContract && <MyLink routerName="outboundOrder">工程管理單</MyLink>}
      </div>
    );
  }

  return null;
};

// =======================================================================

const MyLink = ({ className, children, routerName, extraQuery, ...props }: MyLinkProps) => {
  const router = useRouter();
  // 只留這兩個property，其他都不要
  const { contractId, version } = router.query as Tquery;
  const query: Tquery = { contractId, version };

  const routeArr = router.route.split('/');
  const route_lv4 = routeArr[4];
  // 只留前三個
  const route = `/${routeArr[1]}/${routeArr[2]}/${routeArr[3]}/`;

  const isActive = route_lv4 === routerName;

  return (
    <Link
      className={classNames(scss.link, isActive && scss.active, className)}
      href={{
        pathname: route + routerName,
        query: { ...query, ...extraQuery },
      }}
      {...props}
    >
      {children}
    </Link>
  );
};

// =======================================================================

// =======================================================================
export default Nav_worksDepartment;
