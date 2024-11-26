import { devPass, erpFeaturesLookup, TsidePathConfig, TsidePathList } from "../type";

export default function SidePathForeign(){
    

    return ((): TsidePathConfig => {
        const path = '/foreign';

        return {
            path,
            list: [
                {
                    label: '國外工程',
                    erpFeature: devPass,
                    list: [
                        {
                            label: '施工中',
                            path: path + '/unset',
                            erpFeature: devPass,
                        },
                        {
                            label: '施工中',
                            path: path + '/unset',
                            erpFeature: devPass,
                        },
                        {
                            label: '施工中',
                            path: path + '/unset',
                            erpFeature: devPass,
                        },
                        {
                            label: '施工中',
                            path: path + '/unset',
                            erpFeature: devPass,
                        },
                    ],
                },
                {
                    label: '施工中',
                    path: path + '/unset',
                    erpFeature: devPass,
                },
            ],
        };
    })()
}