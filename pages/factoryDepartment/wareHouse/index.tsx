import { useContext, useEffect } from 'react';

import type { NextPage } from 'next';
import router, { useRouter } from 'next/router';

// layer
import SubLayer from '../../../components/Layer/SubLayer/SubLayer';


// api
import { Tparams, useGetQuotation_infinite, useGetQuotation_detail_infinite } from 'js/api/api_quotation';

// global gear
import PageHeader02, { TpanelList, Tlink, Toption } from 'components/PageHeader/PageHeader02/PageHeader02';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';
import ContractSelector from 'components/global/gear/modal/contractSelector';

// import styles from '../styles/index.module.scss';

// option lookup
import { optionsCreator_county } from 'js/utils/options/countryAndDistrict';
import { quotationStatusLookup } from 'config/lookupTable';

// context
import { TquotationStatus } from 'js/api/dtoTypes';
import WareHouseList from '../wareHouseList';
import { AppContext } from 'pages/_app';



// import Home from './home'
const optionsCounty = optionsCreator_county();
optionsCounty.unshift({ value: '', label: '不拘' });


// const Bom = () => {
export default function WareHouse({ userGrade }: { userGrade: number }) {
    const router = useRouter();
    const { warehouseName, reviewStatus } = router.query as { [key: string]: string };
    const status = router.query.status as TquotationStatus;

    const { userInfo } = useContext(AppContext);
    const userEmp = userInfo?.employee;
    let userId = userEmp?.id;

    if (userGrade >= 14) {
        userId = undefined;
    }


    // const params: Tparams = {
    //     // sort: 'updatedAt',
    //     sort: 'latestContent.quotationDate',
    //     order: 'DESC',
    //     populate: [
    //       // 'contents.agentEmployee',
    //       // 'contents.reviewSalesEmployee',
    //       // 'contents.reviewWorkDirectorEmployee',
    //       // 'contents.reviewSupervisorEmployee',
    //       // 'contents.reviewManagerEmployee',

    //       // 'contents',

    //       'quotationList',
    //       'attachedToContract',

    //       'latestContent.agentEmployee',
    //       'latestContent.reviewSalesEmployee',
    //       'latestContent.reviewWorkDirectorEmployee',
    //       'latestContent.reviewSupervisorEmployee',
    //       'latestContent.reviewCashierEmployee',
    //       'latestContent.reviewManagerEmployee',

    //       'latestContent.customer',
    //     ],
    //     filter: {
    //       'latestContent.status': {
    //         // $eq: status,
    //         $in: [status, status === 'Pending' ? 'TempPending' : undefined],
    //       },
    //       'latestContent.county': {
    //         $contains: county || undefined,
    //       },
    //       'latestContent.customer.name': {
    //         $contains: ware || undefined,
    //       },
    //       'latestContent.projectName': {
    //         $contains: projectName || undefined,
    //       },
    //       'latestContent.isLost': { $eq: false },
    //       // ...reviewStatusFilter,
    //       ...filter,
    //     },
    //   };



    // const {
    //     //
    //     dataArr: quoatationArr,
    //     viewRef_bottom,
    //     isLoadingPage1,
    //     // isLoading,
    //     reset,
    //   } = useGetQuotation_detail_infinite({ customParams: params });

    //   useEffect(() => {
    //     reset();
    //   }, [router.query]);



    const searchTargetList = [
        // {
        //     options: optionsCounty,
        //     placeholder: '選擇地區',
        //     width: '80px',
        //     defaultValue: router.query.county as string,
        // },
        {
            placeholder: '請輸入倉庫名稱',
            defaultValue: router.query.clientName as string,
        },
        // {
        //     placeholder: '請輸入儲位名稱',
        //     defaultValue: router.query.projectName as string,
        // },
    ];


    const doSearch = (valueArr: (string | Toption | null)[]) => {
        // const doorType = (valueArr[0] as Toption).value;
        // const county = (valueArr[0] as Toption).value;
        // const customerName = valueArr[1] as string;
        // const projectName = valueArr[2] as string;
        const warehouseName = valueArr[1] as string;
        const whpositionName = valueArr[2] as string;

        router.push({
            href: '',
            query: {
                ...router.query,
                // doorType,
                // county,
                warehouseName,
                // whpositionName,
            },
        });
    };

    const searchGroup = {
        searchTargetList,
        doSearch,
    };


    const panelList: TpanelList = [
        { searchGroup },
        // status === 'Contracting' ? attatchBtn : null,
        {
            type: 'addButton',
            label: '新增倉庫',
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/addWareHouse`,
                    query: {
                        status,
                    },
                });
            },
        },
    ];


    return (
        <SubLayer isLoading_subLayer={false}>
        {/* <> */}
            <PageHeader02 tag={quotationStatusLookup[status] ?? '倉庫'} panelList={panelList} />
            <div>
                {/* 倉庫清單列表 */}
                {/* <WareHouseList/> */}
            </div>
        {/* </> */}
        </SubLayer>
    );
};

// export default Bom;
