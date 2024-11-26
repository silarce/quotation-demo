import { devPass, TsidePathConfig } from "../type";

export default function SidePathResearch (){
    return ((): TsidePathConfig => {
        const path = '/research';

        return {
            path,
            list: [
                {
                    label: '工作表',
                    path: path + '/workSheet',
                    erpFeature: devPass,
                },
            ],
        };
    })()
}