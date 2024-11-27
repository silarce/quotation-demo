import { NextRouter } from 'next/router';

export type ErpFeaturesValues = (typeof erpFeaturesLookup)[keyof typeof erpFeaturesLookup];

export type TsidePathConfig = {
    //antd Collapse用的，設定預設被選中的面板，大部分時候用不到
    defaultCollapse?: string;
    path: string;
    list: {
        label: string;
        path?: string;
        query?: {
            [key: string]: string;
        };
        erpFeature: ErpFeaturesValues[] | 'allPass';
        otherPermissions?: {
            grade?: number;
        };
        activeChecker?: (props: { router: NextRouter }) => boolean;
        list?: {
            label: string;
            path: string;
            query?: {
                [key: string]: string;
            };
            /**空陣列會全部禁止 */
            erpFeature: ErpFeaturesValues[] | 'allPass';
            otherPermissions?: {
                grade?: number;
            };
            // 例外，只要符合其中一個就通過
            exception?: {
                idNumber?: string[];
            };
            activeChecker?: (props: { router: NextRouter }) => boolean;
        }[];
    }[];
};

export type Thref = {
    pathname: string;
    query?: {
        [key: string]: string;
    };
};

export type TtopPathListConfig = {
    icon: string;
    label: string;
    subLabel?: string;
    path: string;

    // href: {
    //   pathname: string;
    //   query?: {
    //     [key: string]: string;
    //   };
    // };
    href: Thref;
    // 在Nav.tsx會依序檢查hrefList的key與erpFeature，決定點進去的連結
    hrefList?: {
        [key: string]: Thref;
    };
    //
    erpFeature: ErpFeaturesValues[] | 'allPass';
};

export interface TsidePathList {
    [key: string]: TsidePathConfig;
}

export const erpFeaturesLookup = {
    BasicDataCreation: '基本資料建立',
    HRAuthoritySetup: '人事權限建立',
    legacyContractIntegration: '舊合約',
    domestic: '營業部國內工程',
    statisticsTable: '統計表',
    worksDepartment: '工務部',
    accountsReceivable: '應收帳款',
    accountingDepartment: '會計部',
    worksDepartment_worksheet: '工務部-工作表編輯',
    worksDepartment_deliveryList: '工務部-出庫單編輯',
    incomeBill: '收入傳票',
    fac: '廠務部',
} as const;

export const devPass: TtopPathListConfig['erpFeature'] = 'allPass';

// key:value逆轉版本的erpFeaturesLookup
export const swappedErpFeaturesLookup: { [key: string]: string } = {};