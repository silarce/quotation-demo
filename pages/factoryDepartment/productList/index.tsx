import { useState, MouseEvent, createContext, useEffect, Key, useContext } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import scss from './productList.module.scss';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { TquotationStatus } from 'js/api/dtoTypes';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { AppContext } from 'pages/_app';





type Tquery = {
    wareHouseId: string | undefined;
};



export default function ProductList() {


    return (

        <>
            <div>welcome to productlist!! comming soon</div>
        </>

    )

}