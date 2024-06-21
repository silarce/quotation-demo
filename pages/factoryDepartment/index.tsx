import { useEffect } from 'react';

import type { NextPage } from 'next';
import router, { useRouter } from 'next/router';

// layer
import SubLayer from '../../components/Layer/SubLayer/SubLayer';

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




// import Home from './home'
const optionsCounty = optionsCreator_county();
optionsCounty.unshift({ value: '', label: '不拘' });


// const Bom = () => {
export default function FactoryDepartment() {
    // const router = useRouter();

    //   useEffect(() => {
    //     router.push('/home/dailyReport?isMine=true');
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //   }, []);

    const status = router.query.status as TquotationStatus;
    // const status = 'budget';

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
        {
            placeholder: '請輸入儲位名稱',
            defaultValue: router.query.projectName as string,
        },
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
                whpositionName,
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
                    pathname: `/domestic/quotationList/quotation`,
                    query: {
                        status,
                    },
                });
            },
        },
    ];


    return (
        // <>
        //     <div>
        //         asdf
        //     </div>
        // </>

        <SubLayer isLoading_subLayer={true}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '倉庫'} panelList={panelList} />
            <div>

            </div>
        </SubLayer>
    );
};

// export default Bom;
