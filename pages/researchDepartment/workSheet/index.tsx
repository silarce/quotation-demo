import { useEffect } from 'react';

import WorksheetForm from "pages/worksDepartment/contractList/contract/workSheet/WorksheetForm";

import { useWorksheet } from 'components/page/worksDepartment/worksheet/productForm/useWorksheet';
import { useShallow } from 'zustand/react/shallow';


export default function Research() {

    const init = useWorksheet(
        useShallow((state) => (state.init))
    )

    useEffect(() => {
        init({
            worksheetId: 'foo',
            itemIdArr: [],
            contractProductItem: undefined,
            contractProductItemArr: [],
            qty: 1,
            originalAccessories: [],
        });
    }, []);

    return (
        <div className='overflow-auto h-full'>
            <WorksheetForm uploadButton={false} />
        </div>)
}