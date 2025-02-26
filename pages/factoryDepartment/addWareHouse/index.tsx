import { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import router, { useRouter } from 'next/router';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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
import { TquotationStatus, TupdateOutsourcingDto } from 'js/api/dtoTypes';
import WareHouseList from '../wareHouseList';
import { AppContext } from 'pages/_app';

import scss from './addWareHouse.module.scss'
import TextareaModal from 'components/global/gear/modal/simpleModal/textareaModal';
import InputModal, { TinputModalProps } from 'components/global/gear/modal/simpleModal/inputModal_v2';
import { Input } from 'antd';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import InputSelBar, { TselInputPropsArr } from 'components/global/gear/inputAndSel/inputSelBar/inputSelBar';
import MyButton from 'components/global/gear/button/myButton';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { setting } from '../wareHouseList/index';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import { SelectBar } from 'js/utils/helpers/hook/useYearMonth';


const optionsCounty = optionsCreator_county();
optionsCounty.unshift({ value: '', label: '不拘' });

type Tquery = {
    wareHouseId: string | undefined;
};

export default function AddWareHouse({ userGrade }: { userGrade: number }) {
    const router = useRouter();
    const { warehouseName, reviewStatus } = router.query as { [key: string]: string };
    const status = router.query.status as TquotationStatus;

    const { userInfo } = useContext(AppContext);
    const userEmp = userInfo?.employee;
    let userId = userEmp?.id;

    if (userGrade >= 14) {
        userId = undefined;
    }
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { wareHouseId } = router.query as Tquery;
    const [inputModalConfig, setInputModalConfig] = useState<TinputModalProps>();
    const [disabled, setDisabled] = useState(!!wareHouseId);
    const [isLoading, setIsLoading] = useState(false);


    const [whname, setWhname] = useState<string | null>(null);
    const [position, setPosition] = useState<string | null>(null);
    const [created_at, setCreated_at] = useState<string | null>(null);
    const [create_by, setCreateBy] = useState<string | null>(null);
    const [update_at, setUpdate_at] = useState<string | null>(null);
    const [update_by, setUpdate_by] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [warehouseType, setWarehouseType] = useState<string>('');

    // 時間設定
    const [localTime, setLocalTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setLocalTime(now.toLocaleString());
            setCreateBy(userInfo?.employee?.chName.toString() as string);
        };

        // 初始化時間
        updateTime();

        // 每秒更新一次時間
        // const intervalId = setInterval(updateTime, 1000);

        // 清理 interval
        // return () => clearInterval(intervalId);
    }, []);

    const panelList: TpanelList = [
        {
            type: 'redButton',
            label: '新增',
            onClick: () => {
                console.log(whname + "/" + position + '/' + create_by);
                if (whname === '' || whname === undefined || whname === null &&
                    position === '' || position === undefined || position === null &&
                    create_by === '' || create_by === undefined || create_by === null
                ) {
                    myAlert.warning({ title: '請確實填寫倉庫資訊' });
                } else {
                    myAlert.confirm({
                        title: '確定新增?',
                        props: {
                            onOk: () => {
                                fetchData();
                            }
                        }
                    });
                }
            },
        },
        {
            type: 'myButton',
            label: `${!!wareHouseId ? '取消' : '返回'}`,
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/wareHouseList`,
                    query: {
                        type: 'WareHouse',
                    }
                });
            },
        },
    ];

    const createEmptyData = (): TupdateOutsourcingDto => ({
        name: '',
        contactNumber: '',
        principal: '',
        taxId: '',
        county: '',
        district: '',
        address: '',
        notes: '',
    });

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                whname: whname,
                position: position,
                create_by: userInfo?.employee?.id,
                created_at: localTime,
                url: url,
                type: selectedValue,
                note: textareaValue
            };
            console.log(created_at);

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            //erpAPI
            const response = await fetch(`${setting.apipath}/WareHouse/AddWareHouse?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // setData(data);
            if (response.ok) {
                myAlert.success({title:'新增成功'});
                router.push({
                    pathname: `/factoryDepartment/wareHouseList`,
                    query: {
                        type: 'WareHouse',
                    }
                });
            }

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

    }, []);

    function addWareHouse() {
        // 打取api
    }

    // const check: any()=>{
    //     const alert
    // }
    const [selectedValue, setSelectedValue] = useState('一般倉庫');
    const [inputValue, setInputValue] = useState('');
    const [textareaValue, setTextareaValue] = useState('');

    const propsArr: TselInputPropsArr = [
        // {
        //     type: 'input',
        //     placeholder: '輸入值',
        //     props: {
        //         value: inputValue,
        //         onChange: (e:any) => setInputValue(e.target.value),
        //     },
        //     style: {
        //         borderBottom: '1px solid #14256a',
        //     },
        // },
        {
            type: 'select',
            placeholder: '倉庫類型',
            props: {
                value: selectedValue,
                options: [
                    { value: '一般倉庫', label: '一般倉庫' },
                    { value: '立體倉庫', label: '立體倉庫' },
                ],
                onChange: (option: any) => setSelectedValue(option?.value),
            },
            style: {
                color: 'orange'
                // fontSize: '8px', // 設定字體大小
                // borderBottom: '1px solid #14256a',
                // fontWeight:'bolder'
                // color:'red'
            },
        },
        // {
        //     type: 'textarea',
        //     placeholder: '備註',
        //     props: {
        //         value: textareaValue,
        //         onChange: (e:any) => setTextareaValue(e.target.value),
        //     },
        //     style: {
        //         borderBottom: '1px solid #14256a',
        //     },
        // },
    ];

    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '新增倉庫'} panelList={panelList} />
            <div className={scss.main}>
                <div className={scss.left}>
                    <div className={scss.top}>
                        <InputSel
                            {...inputSelProps}
                            caption="倉庫名稱"
                            captionStyle={{ fontSize: '20px', fontWeight: '500' }}
                            disabled={disabled}
                            inputProps={{
                                props: {
                                    // value: data1.materialnumber,
                                    onChange: (e) => setWhname(e.target.value.trim())
                                },
                            }}
                        />
                        <InputSel
                            {...inputSelProps}
                            caption="倉庫位置"
                            captionStyle={{ fontSize: '20px', fontWeight: '500' }}
                            disabled={disabled}
                            inputProps={{
                                props: {
                                    // value: data1.whpname,
                                    onChange: (e) => setPosition(e.target.value.trim())
                                },
                            }}
                        />
                        {/* <InputSelBar
                            label="倉庫類型"
                            propsArr={propsArr}
                            // isMust={true}
                            width="100%"
                            gap="18px"
                            // padding="8px"
                            // hrColor="#ccc"
                            // showBaseline="always"
                            disabled={false}
                        /> */}
                        {/* <div>
                            <p>選擇的值：{selectedValue}</p>
                        </div> */}
                        {/* <SelectBar

                            selectPropsArr={[
                                {
                                    boxStyle: { color: 'red' },
                                    placeholder: '選擇倉庫類型',
                                    selectProps: {
                                        value: warehouseType, // 將 value 與選項匹配
                                        options,
                                        onChange: (selectedOption) => {
                                            setWarehouseType(selectedOption?.value || ''); // 將選中的值設置到 state
                                            console.log('選擇的值:', selectedOption?.value); // 可選，方便 debug
                                        },
                                    },
                                },
                            ]}
                        /> */}
                        <InputSel
                            caption="倉庫類型"
                            disabled={disabled}
                            selectProps={{
                                props: {
                                    menuPortalTarget: undefined,
                                    styles: {
                                        menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 3,
                                        }),
                                    },
                                    options: [
                                        { value: '一般倉庫', label: '一般倉庫' },
                                        { value: '立體倉庫', label: '立體倉庫' },
                                    ],
                                    onChange: (option: any) => setSelectedValue(option?.value),
                                    value: selectedValue
                                        ? {
                                            value: selectedValue,
                                            label: selectedValue,
                                        }
                                        : null,
                                },
                            }}
                        />
                        <InputSel
                            {...inputSelProps}
                            caption="建立人員"
                            captionStyle={{ fontSize: '20px', fontWeight: '500' }}
                            disabled={!disabled}
                            inputProps={{
                                props: {
                                    value: userInfo?.employee?.chName.toString(),
                                    // onChange: (e) => setCreateBy(e.target.value.trim())
                                },
                            }}
                        />
                        <InputSel
                            {...inputSelProps}
                            caption="建立時間"
                            captionStyle={{ fontSize: '20px', fontWeight: '500' }}
                            disabled={true}
                            inputProps={{
                                props: {
                                    value: localTime,
                                    onChange: (e) => setCreated_at(localTime ? localTime.trim() : '')
                                },
                            }}
                        />

                        <InputSel
                            {...inputSelProps}
                            caption="IP位址"
                            captionStyle={{ fontSize: '20px', fontWeight: '500' }}
                            disabled={disabled}
                            inputProps={{
                                props: {
                                    // value: data1.whpname,
                                    onChange: (e) => setUrl(e.target.value.trim())
                                },
                            }}
                        />
                        <InputSel
                            {...inputSelProps}
                            caption="備註"
                            captionStyle={{ fontSize: '20px', fontWeight: '500' }}
                            disabled={disabled}
                            inputProps={{
                                props: {
                                    // value: data1.whpname,
                                    onChange: (e) => setTextareaValue(e.target.value.trim())
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </SubLayer>
    );
};
