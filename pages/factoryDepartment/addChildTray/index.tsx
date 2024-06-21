import SubLayer from 'components/Layer/SubLayer/SubLayer';
import scss from './addChildTray.module.scss';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import router, { useRouter } from 'next/router';
import { TquotationStatus } from 'js/api/dtoTypes';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { useEffect, useState } from 'react';

type Tquery = {
    wareHouseId: string | undefined;
};

export interface WHPositionModel {
    id?: string;
    whpname?: string;
    whid?: string;
    volume?: number;
    spec?: string;
    trayid?: string;
    length?: number;
    width?: number;
    childlength?: number;
    childwidth?: number;
    materialnumber?: string;
    batchnumber?: string;
    unit?: string;
    quantity?: number;
    whname?: string;
    trayname?: string;
    havechild?: boolean;
}

export default function AddChildTray() {
    const router = useRouter();
    const { whid, whname, data111 } = router.query;
    // 備分原本model
    const [data, setData] = useState<WHPositionModel>([]);
    const [data1, setData1] = useState<WHPositionModel>([]);
    const [data11, setData11] = useState<any[]>([]);
    const parsedData11 = JSON.parse(data111 as string); // 將 JSON 字符串轉為對象
    // const [data12, setData12] = useState<any[]>(data111); // 將 data111 賦值給 data12
    const [error, setError] = useState<string | null>(null); // 將 error 的類型更改為 string | null
    const [traylayout, setTrayLayOut] = useState<any[]>([]);

    const [length, setLength] = useState<number | null>(0);
    const [width, setWidth] = useState<number | null>(0);

    const status = router.query.status as TquotationStatus;
    const { wareHouseId } = router.query as Tquery;
    const [disabled, setDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    ;

    const AddLayOut = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                whid: whid as string | undefined,
                trayname: "",
                id: "",
                traylayout: traylayout
            };
            console.log("checkmodel: ", conditionModel.traylayout);
            console.log(parsedData11);
            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'test',
                FilterConditions: JSON.stringify(conditionModel),
            };

            console.log("checkinput: ", inputModel);

            const response = await fetch('https://localhost:44383/WareHouse/AddTray', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();
            console.log("checkresponse: ", responseData);

            setData11(responseData);
        } catch (error: any) {
            console.error("Error in AddLayOut: ", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };



    // 點選呼叫托盤後功能紐
    const panelList: TpanelList = [
        {
            type: 'redButton',
            label: '新增',
            onClick: () => {
                // 可以在這裡添加其他新增邏輯
            }
        },
        {
            type: 'myButton',
            label: '返回',
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/trayList`,
                    query: {
                        type: 'WareHouse',
                        whid: whid,
                        whname: whname
                    }
                });
            },
        },
    ];

    const updateTrayLayout = (currentLength: number, currentWidth: number) => {
        const newLayout: WHPositionModel[] = [];
        const lengthValue = length ?? 0; // 確保 length 不為 null
        const widthValue = width ?? 0;   // 確保 width 不為 null

        for (let l = 0; l < currentLength; l++) {
            for (let w = 0; w < currentWidth; w++) {
                const dataModel: WHPositionModel = {
                    id: "",
                    whpname: "",
                    whid: whid?.toString(),
                    volume: 0,
                    spec: "",
                    trayid: "",
                    length: lengthValue,
                    width: widthValue,
                    childlength: l + 1,
                    childwidth: (l + 1 === 1) ? (w + 2) : (w + 1),
                    materialnumber: '',
                    batchnumber: '',
                    unit: '',
                    quantity: 0,
                    whname: whname?.toString(),
                    trayname: '',
                    havechild: false
                };
                newLayout.push(dataModel);
            }
        }
        setTrayLayOut(newLayout);
    };



    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'length' | 'width') => {
        if (type === 'length') {
            if (e.key === 'ArrowUp') {
                setLength(prev => {
                    const newLength = prev !== null ? prev + 1 : 1;
                    updateTrayLayout(newLength, width !== null ? width : 0);
                    return newLength;
                });
            } else if (e.key === 'ArrowDown') {
                setLength(prev => {
                    const newLength = prev !== null && prev > 0 ? prev - 1 : 0;
                    updateTrayLayout(newLength, width !== null ? width : 0);
                    return newLength;
                });
            }
        } else if (type === 'width') {
            if (e.key === 'ArrowUp') {
                setWidth(prev => {
                    const newWidth = prev !== null ? prev + 1 : 1;
                    updateTrayLayout(length !== null ? length : 0, newWidth);
                    return newWidth;
                });
            } else if (e.key === 'ArrowDown') {
                setWidth(prev => {
                    const newWidth = prev !== null && prev > 0 ? prev - 1 : 0;
                    updateTrayLayout(length !== null ? length : 0, newWidth);
                    return newWidth;
                });
            }
        }
    };



    useEffect(() => {
        AddLayOut();
    }, [traylayout]);


    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '新增托盤'} panelList={panelList} />
            <div className={scss.main}>
                <div className={scss.left}>
                    <div className={scss.top}>
                        <div className="input-wrapper">
                            <InputSel
                                {...inputSelProps}
                                caption="寬"
                                disabled={false}
                                inputProps={{
                                    props: {
                                        value: width ?? 0,
                                        // onChange: (e) => handleWidthLengthChange(e, "width"),
                                        onKeyDown: (e) => handleKeyDown(e, "width")
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="長"
                                disabled={false}
                                inputProps={{
                                    props: {
                                        value: length ?? 0,
                                        // onChange: (e) => handleWidthLengthChange(e, "length"),
                                        onKeyDown: (e) => handleKeyDown(e, "length")
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.content}>
                        {/* 這裡可以顯示 taylayout 的內容 */}
                        {/* {traylayout.map((item, index) => (
                            <div key={index}>
                                {`Length: ${item.length}, Width: ${item.width}`}
                            </div>
                        ))} */}
                        {data11.map((Data) => (
                            <table className={scss.traytable} style={{ border: 'solid 1px black' }}>
                                <tbody>
                                    <tr className={scss.tr}>
                                        {Data.widthdata.map((item: any) => (
                                            <td className={scss.td} style={{ backgroundColor: item.color, color: item.color === '#ea1833' ? '#FFFFFF' : 'black' }}>
                                                {item.childtraylayoutmodel && item.childtraylayoutmodel.map((childitem: any) => (
                                                    <table className={scss.childtraytable} key={item.childlengthid}>
                                                        <tbody>
                                                            <tr className={scss.childtraytabletr}>
                                                                {childitem.childwidthdata.map((childDataItem: any) => (
                                                                    <td className={scss.childtraytabletd} key={childDataItem.id} style={{ backgroundColor: childDataItem.color, height: item.childtraylayoutmodel.length > 1 ? 85 / item.childtraylayoutmodel.length : '89px' }}>
                                                                        <button className={scss.childtraytabletdButton}
                                                                            // onClick={() => handlechangewhposition(childDataItem.id, childDataItem.whid, childDataItem.trayname, childDataItem.whname)}
                                                                            style={{ backgroundColor: childDataItem.color, height: item.childtraylayoutmodel.length > 1 ? 85 / item.childtraylayoutmodel.length : '89px' }}
                                                                        >
                                                                            {childDataItem.width}<br />
                                                                        </button>
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                ))}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        ))}
                    </div>
                </div>
            </div>
        </SubLayer>
    );
}
