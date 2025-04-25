import { devPass, TsidePathConfig } from "../type";

export default function SidePathResearch (){
    return ((): TsidePathConfig => {
        const path = '/researchDepartment';

        return {
            path,
            list: [
                
                {
                    label: '工作表',
                    path: path + '/workSheet',
                    erpFeature: devPass,
                },
                {
                    label: '物料維護',
                    path: path + '/productListForResearch',
                    erpFeature: devPass,
                },
                {
                    label: 'BOM維護',
                    path: path + '/bomListForResearch',
                    erpFeature: devPass,
                },
                {
                    label: '請購列表',
                    path: path + '/PRequisitionListForResearch',
                    erpFeature: devPass,
                },
            ],
        };
    })()
}