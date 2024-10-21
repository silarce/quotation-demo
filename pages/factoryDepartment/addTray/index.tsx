import SubLayer from 'components/Layer/SubLayer/SubLayer';
import scss from './addTray.module.scss';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { useRouter } from 'next/router';
import { TquotationStatus } from 'js/api/dtoTypes';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useContext, useEffect, useState } from 'react';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { setting } from '../wareHouseList/index';
import { userInfo } from 'os';
import { AppContext } from 'pages/_app';

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
    canedit?: boolean;
}

export interface TrayModel {
    trayname?: string;
    whid?: string;
    traycode?: string;
    length?: number;
    width?: number;
    whname?: string;
}


export default function AddTray() {
    const { userInfo } = useContext(AppContext);
    // 備分原本model
    const [data, setData] = useState<WHPositionModel>([]);
    const [data1, setData1] = useState<WHPositionModel>([]);
    const [data11, setData11] = useState<any[]>([]);
    const [data11child, setData11child] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null); // 將 error 的類型更改為 string | null
    const [traylayout, setTrayLayOut] = useState<any[]>([]);
    const [traychildlayout, setTrayChildLayOut] = useState<any[]>([]);
    const [totaltraychildlayout, setTotalTrayChildLayOut] = useState<any[]>([]);
    const [trayname, setTrayName] = useState<string | null>(null);
    const [data12, setData12] = useState<any[]>([]);

    const [length, setLength] = useState<number | null>(1);
    const [width, setWidth] = useState<number | null>(1);
    const [childlength, setChildLength] = useState<number | null>(1);
    const [childwidth, setChildWidth] = useState<number | null>(1);
    const [childparentlength, setChildParentLength] = useState<number | null>(0);
    const [childparentwidth, setChildParentWidth] = useState<number | null>(0);
    const [childwhposition, setChildWHPosition] = useState<string | null>(null);
    const [childwhpositionVisible, setChildWHPositionVisible] = useState<string>('none');
    const [lastchildparentlength, setLastChildParentLength] = useState<number | null>(0);
    const [lastchildparentwidth, setLastChildParentWidth] = useState<number | null>(0);


    const [preTrayLayout, setPreTrayLayout] = useState<any[]>([]);


    const router = useRouter();
    const { type, whid, whname, id } = router.query;
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
                trayname: trayname as string | undefined,
                id: id as string | undefined,
                traylayout: traylayout
            };
            // console.log("checkmodel: ", conditionModel.traylayout);

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'test',
                FilterConditions: JSON.stringify(conditionModel),
            };

            // console.log("checkinput: ", inputModel);

            const response = await fetch(`${setting.apipath}/WareHouse/SetTray`, {
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
            // console.log("checkresponse: ", responseData);

            setData11(responseData);
        } catch (error: any) {
            console.error("Error in AddLayOut: ", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const AddChildLayOut = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                whid: whid as string | undefined,
                trayname: trayname as string | undefined,
                id: id as string | undefined,
                traylayout: traychildlayout
                // traylayout: traylayout
            };
            // console.log("checkmodel: ", conditionModel.traylayout);

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'test',
                FilterConditions: JSON.stringify(conditionModel),
            };

            // console.log("checkinput: ", inputModel);

            const response = await fetch(`${setting.apipath}/WareHouse/SetTray`, {
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
            // console.log("checkresponse: ", responseData);

            setData11child(responseData);
            // setData11(responseData);
        } catch (error: any) {
            console.error("Error in AddLayOut: ", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const TotalLayOut = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                whid: whid as string | undefined,
                trayname: trayname as string | undefined,
                id: id as string | undefined,
                ischild: true as boolean | undefined,
                traylayout: traylayout,
                traychildlayout: traychildlayout
            };
            // console.log("checkmodel: ", conditionModel.traylayout);

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'test',
                FilterConditions: JSON.stringify(conditionModel),
            };

            // console.log("checkinput: ", inputModel);

            const response = await fetch(`${setting.apipath}/WareHouse/SetTray`, {
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
            // console.log("checkresponse: ", responseData);

            // setData11child(responseData);
            setData11(responseData);
            // setPreTrayLayout(responseData);
        } catch (error: any) {
            console.error("Error in AddLayOut: ", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const AddTray = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                trayModel: {
                    trayname: trayname as string | undefined,
                    whid: whid as string | undefined,
                    traycode: trayname as string | undefined,
                    length: length as number | undefined,
                    width: width as number | undefined,
                    whname: whname as string | undefined,
                    create_by: userInfo?.username
                },
                traylayout: traylayout,
            };

            // console.log("checkmodel: ", conditionModel.traylayout);

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'test',
                FilterConditions: JSON.stringify(conditionModel),
            };

            // console.log("checkinput: ", inputModel);

            const response = await fetch(`${setting.apipath}/WareHouse/AddTray`, {
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
            if (response.ok) {
                myAlert.success({ title: '新增成功' });
                router.push({
                    pathname: `/factoryDepartment/trayList`,
                    query: {
                        type: 'WareHouse',
                        whid: whid,
                        whname: whname
                    }
                });

            }
            // console.log("checkresponse: ", responseData);

            // setData11child(responseData);
            // setData11(responseData);
            // setPreTrayLayout(responseData);
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
                // alert("新增托盤")
                if (trayname != "" && trayname != null && trayname != undefined) {
                    AddTray();
                } else {
                    myAlert.err({
                        title: "請輸入托盤名稱",
                    })

                }
            }
        },
        {
            type: 'myButton',
            label: '返回',
            onClick: () => {
                router.back();
            },
        },
    ];

    const updateTrayLayout = (currentLength: number, currentWidth: number) => {
        const newLayout: WHPositionModel[] = [];
        for (let l = 0; l < currentLength; l++) {
            for (let w = 0; w < currentWidth; w++) {
                const dataModel: WHPositionModel = {
                    id: "",
                    whpname: "",
                    whid: whid?.toString(),
                    volume: 0,
                    spec: "",
                    trayid: "",
                    length: l + 1,
                    width: w + 1,
                    childlength: 1,
                    childwidth: 1,
                    materialnumber: '',
                    batchnumber: '',
                    unit: '',
                    quantity: 0,
                    whname: whname?.toString(),
                    trayname: trayname?.toString(),
                    canedit: true
                };
                newLayout.push(dataModel);
            }
        }
        setTrayLayOut(newLayout);
    };

    const updateTrayChildLayout = (currentLength: number, currentWidth: number) => {
        const newLayout: WHPositionModel[] = [];
        const lengthValue = childparentlength ?? 0; // 確保 length 不為 null
        const widthValue = childparentwidth ?? 0;   // 確保 width 不為 null



        if (lengthValue === lastchildparentlength && widthValue === lastchildparentwidth) {
            for (let l = 0; l < currentLength; l++) {
                if (l + 1 === 1) {
                    for (let w = 0; w < currentWidth - 1; w++) {
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
                            canedit: true
                        };
                        newLayout.push(dataModel);
                    }
                } else {
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
                            childwidth: w + 1,
                            materialnumber: '',
                            batchnumber: '',
                            unit: '',
                            quantity: 0,
                            whname: whname?.toString(),
                            trayname: trayname?.toString(),
                            canedit: true
                        };
                        newLayout.push(dataModel);
                    }
                }
            }
            setTrayChildLayOut(newLayout);
        } else {

            for (let l = 0; l < currentLength; l++) {
                if (l + 1 === 1) {
                    for (let w = 0; w < currentWidth - 1; w++) {
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
                            canedit: true
                        };
                        newLayout.push(dataModel);
                    }
                } else {
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
                            childwidth: w + 1,
                            materialnumber: '',
                            batchnumber: '',
                            unit: '',
                            quantity: 0,
                            whname: whname?.toString(),
                            trayname: trayname?.toString(),
                            canedit: true
                        };
                        newLayout.push(dataModel);
                    }
                }
            }
            setTrayChildLayOut(newLayout);
        }

        // setTotalTrayChildLayOut([...traylayout, ...traychildlayout]);

        // setPreTrayLayout([...traylayout, ...traychildlayout]);
        // setTrayLayOut(preTrayLayout)
        // console.log(traychildlayout);
        // TotalLayOut();
    };

    const confirmupdateTrayChildLayout = (currentLength: number, currentWidth: number) => {
        const newLayout: WHPositionModel[] = [];
        const lengthValue = childparentlength ?? 0; // 確保 length 不為 null
        const widthValue = childparentwidth ?? 0;   // 確保 width 不為 null

        for (let l = 0; l < currentLength; l++) {
            if (l + 1 === 1) {
                for (let w = 0; w < currentWidth - 1; w++) {
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
                        canedit: true
                    };
                    newLayout.push(dataModel);
                }
            } else {
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
                        childwidth: w + 1,
                        materialnumber: '',
                        batchnumber: '',
                        unit: '',
                        quantity: 0,
                        whname: whname?.toString(),
                        trayname: trayname?.toString(),
                        canedit: true
                    };
                    newLayout.push(dataModel);
                }
            }
        }
        setTrayChildLayOut(newLayout);
        // setTrayLayOut(newLayout);
        // setTrayLayOut(prevLayout => [...prevLayout, ...newLayout]);
        console.log(traylayout);
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

    const handlechildKeyDown2 = (e: any) => {
        if (e.key === 'ArrowUp') {
            setChildWidth(prev => {
                const newWidth = prev !== null ? prev + 1 : 1;
                handleAdd(e.target.value);
                return newWidth;
            });
        } else if (e.key === 'ArrowDown') {
            setChildWidth(prev => {
                const newWidth = prev !== null && prev > 0 ? prev - 1 : 0;
                handleRemove()
                return newWidth;
            });
        }

    }

    const handleAdd = (value: any) => {
        const newchildwidth = parseInt(value) + 1; // 新的 childwidth
        console.log(data12[0]?.matchedItem.length); // 使用 optional chaining

        // 取得 data12 的第一筆資料
        const firstItem = data12[0];

        // 建立新資料模型
        const newDataItem = {
            id: null, // 可以根據需要設置 ID
            whpname: "",
            whid: firstItem.matchedItem.whid,
            volume: 0,
            spec: "",
            trayid: null,
            length: firstItem.matchedItem.length, // 使用相同的 length
            width: firstItem.matchedItem.width, // 使用相同的 width
            childlength: firstItem.matchedItem.childlength, // 繼續使用相同的 childlength
            childwidth: newchildwidth, // 使用新的 childwidth
            materialnumber: '',
            batchnumber: '',
            unit: '',
            quantity: 0,
            whname: firstItem.matchedItem.whname,
            trayname: firstItem.matchedItem.trayname,
            color: "#FFFFFF", // 預設顏色，可以根據需要改變
        };

        // 將新的資料加入到 data12 的索引 0 的 childtraylayoutmodel
        setData12(prevData12 => {
            const updatedData = [...prevData12];

            // 確保 childtraylayoutmodel 存在
            if (!updatedData[0].matchedItem.childtraylayoutmodel) {
                updatedData[0].matchedItem.childtraylayoutmodel = [];
            }

            // 將新的 childwidthdata 加入到 childtraylayoutmodel 中
            updatedData[0].matchedItem.childtraylayoutmodel[0].childwidthdata.push(newDataItem);

            return updatedData; // 返回更新後的資料
        });

        console.log(newDataItem);
        console.log(data12); // 輸出更新後的 data12

        console.log(data11);
    };


    const handleRemove = () => {
        setData12(prevData12 => {
            // 確保 data12 有資料可移除
            if (prevData12.length > 0) {
                // 找到 childwidth 最大的索引
                const maxChildWidthIndex = prevData12[0].matchedItem.childtraylayoutmodel[0].childwidthdata.reduce((maxIndex: string | number, currentItem: { childwidth: number; }, index: any, array: { [x: string]: { childwidth: number; }; }) => {
                    return currentItem.childwidth > array[maxIndex].childwidth ? index : maxIndex;
                }, 0);
    
                // 移除 childwidth 最大的項目
                const updatedChildWidthData = prevData12[0].matchedItem.childtraylayoutmodel[0].childwidthdata.filter((_: any, index: any) => index !== maxChildWidthIndex);
    
                // 返回更新後的資料
                return [{
                    ...prevData12[0],
                    matchedItem: {
                        ...prevData12[0].matchedItem,
                        childtraylayoutmodel: [{
                            ...prevData12[0].matchedItem.childtraylayoutmodel[0],
                            childwidthdata: updatedChildWidthData
                        }]
                    }
                }];
            }
            return prevData12; // 如果沒有資料可以移除，返回原資料
        });
    };
    




    // 如果您希望在 data12 更新後執行某些操作，可以使用 useEffect 來監聽 data12 的變化
    useEffect(() => {
        console.log('data12 updated:', data12);
    }, [data12]);



    const handlechildKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'length' | 'width') => {
        if (type === 'length') {
            if (e.key === 'ArrowUp') {
                setChildLength(prev => {
                    const newLength = prev !== null ? prev + 1 : 1;
                    updateTrayChildLayout(newLength, childwidth !== null ? childwidth : 0);
                    AddLayOut();  // 在這裡執行相關的更新函數
                    return newLength;
                });
            } else if (e.key === 'ArrowDown') {
                setChildLength(prev => {
                    const newLength = prev !== null && prev > 0 ? prev - 1 : 0;
                    updateTrayChildLayout(newLength, childwidth !== null ? childwidth : 0);
                    AddLayOut();  // 在這裡執行相關的更新函數
                    return newLength;
                });
            }
        } else if (type === 'width') {
            if (e.key === 'ArrowUp') {
                setChildWidth(prev => {
                    const newWidth = prev !== null ? prev + 1 : 1;
                    updateTrayChildLayout(childlength !== null ? childlength : 0, newWidth);
                    AddLayOut();  // 在這裡執行相關的更新函數
                    return newWidth;
                });
            } else if (e.key === 'ArrowDown') {
                setChildWidth(prev => {
                    const newWidth = prev !== null && prev > 0 ? prev - 1 : 0;
                    updateTrayChildLayout(childlength !== null ? childlength : 0, newWidth);
                    AddLayOut();  // 在這裡執行相關的更新函數
                    return newWidth;
                });
            }
        }
    };

    useEffect(() => {
        AddLayOut();
        AddChildLayOut();
        TotalLayOut();
    }, [traylayout, traychildlayout]);

    useEffect(() => {
        // 這段程式碼將在 data11 發生變化時執行
        console.log("data11 目前的值：", data11);
        // 在這裡可以做任何想要在 data11 變化時執行的處理

        // 如果需要在 data11 變化後執行特定函數，可以在這裡呼叫它們
        // 例如：layoutChildLengthAndWidth(whid, whname, data11);

    }, [data11, traychildlayout]);

    const goToAddChildTray = (whid: any, whname: any, length: any, width: any) => {
        router.push({
            pathname: `/factoryDepartment/addChildTray`,
            query: {
                whid: whid,
                whname: whname,
                length: length,
                width: width
            },
        });
    };

    // const getLaychildOutBywhpositin = async (length: any, width: any, childlength: any, childwidth: any) => {
    const getLaychildOutBywhpositin = async (length: any, width: any) => {
        const typedData11 = data11 as { widthdata: any[] }[];

        const resultArray: any[] = [];

        typedData11.forEach(item => {
            const matchingItems = item.widthdata.filter((x: any) => x.length === length && x.width === width);

            matchingItems.forEach((matchedItem: any) => {
                resultArray.push({
                    matchedItem
                    // length: matchedItem.length,
                    // width: matchedItem.width,
                    // childlength: matchedItem.childlength,
                    // childwidth: matchedItem.childwidth
                });
            });
        });
        // setChildWidth(resultArray[0].childtraylayoutmodel.childwidth);
        console.log(resultArray);
        setChildWidth(resultArray[0].matchedItem.childtraylayoutmodel[0].childwidthdata[0].childwidth);

        // 將結果存入 state
        setData12(resultArray);
        
    };






    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '倉庫編號：' + whname + '｜新增托盤'} panelList={panelList} />
            <div className={scss.main}>
                <div className={scss.left}>
                    <div className={scss.top}>
                        <div className="input-wrapper">
                            <InputSel
                                {...inputSelProps}
                                caption="托盤名稱"
                                disabled={false}
                                inputProps={{
                                    props: {
                                        // value: width ?? 0,
                                        onChange: (e) => setTrayName(e.target.value)
                                    },
                                }}
                            />
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
                                                                            // onClick={() => layoutChildLengthAndWidth(whid, whname, childDataItem.length, childDataItem.width, data11)}
                                                                            onClick={() => {
                                                                                // alert(childDataItem.length + "-" + childDataItem.width);
                                                                                // setChildWHPosition(childDataItem.length + "-" + childDataItem.width);
                                                                                setChildWHPosition(childDataItem.length + "-" + childDataItem.width + "-" + childDataItem.childlength + "-" + childDataItem.childwidth);
                                                                                setChildWHPositionVisible('');
                                                                                setChildParentLength(childDataItem.length);
                                                                                setChildParentWidth(childDataItem.width);
                                                                                setLastChildParentLength(childparentlength);
                                                                                setLastChildParentWidth(childparentwidth);
                                                                                // setChildLength(1);
                                                                                // setChildWidth(1);
                                                                                // getLaychildOutBywhpositin(childDataItem.length, childDataItem.width, childDataItem.childlength, childDataItem.childwidth);
                                                                                getLaychildOutBywhpositin(childDataItem.length, childDataItem.width);

                                                                                // goToAddChildTray(childDataItem.whid, childDataItem.whname, childDataItem.length, childDataItem.width);
                                                                                // console.log("check" + JSON.stringify(data11);
                                                                            }}
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
                <div className={scss.left}>
                    <div className={scss.top}>
                        <InputSel
                            {...inputSelProps}
                            caption="儲位編號"
                            disabled={false}
                            inputProps={{
                                props: {
                                    value: childwhposition ?? " ",
                                },
                            }}
                        />
                        <InputSel
                            {...inputSelProps}
                            caption="寬"
                            disabled={false}
                            inputProps={{
                                props: {
                                    value: childwidth ?? 0,
                                    // onChange: (e) => handleWidthLengthChange(e, "width"),
                                    onKeyDown: (e) => handlechildKeyDown2(e)
                                },
                            }}
                        />
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <input type='text' value='' />
                        {/* 渲染一個 table 類似於 data11 的顯示方式 */}
                        {data12.map((dataItem, index) => (
                            <table className={scss.traytable} style={{ border: 'solid 1px black' }} key={index}>
                                <tbody>
                                    <tr className={scss.tr}>
                                        <td className={scss.td} style={{ backgroundColor: dataItem.matchedItem.color || 'lightgrey' }}>

                                            {dataItem.matchedItem.childtraylayoutmodel.map((childLayout: any, layoutIndex: any) => (
                                                <div key={layoutIndex}>
                                                    <table className={scss.childtraytable}>
                                                        <tbody>
                                                            <tr className={scss.childtraytabletr}>
                                                                {childLayout.childwidthdata.map((childDataItem: any, childIndex: any) => (
                                                                    <td
                                                                        className={scss.childtraytabletd}
                                                                        key={childDataItem.id || childIndex} // 使用 id 或索引作為 key
                                                                        style={{ backgroundColor: childDataItem.color || '#FFFFFF', height: '50px' }}
                                                                    >
                                                                        <button
                                                                            className={scss.childtraytabletdButton}
                                                                            onClick={() => {
                                                                                alert(`Child Length: ${childDataItem.length}, Child Width: ${childDataItem.width}`);
                                                                            }}
                                                                        >
                                                                            {childDataItem.width}
                                                                        </button>
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        ))}

                    </div>
                </div>
            </div>
            {/* <div className={scss.childmain} style={{ display: childwhpositionVisible }}>
                <div className={scss.left}>
                </div>
                <div className={scss.right}>
                    <div className={scss.childmain}>
                        <div className={scss.left}>
                            <div className={scss.top}>
                                <div className="input-wrapper">
                                    <InputSel
                                        {...inputSelProps}
                                        caption="儲位編號"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: childwhposition ?? " ",
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption="寬"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: childwidth ?? 0,
                                                // onChange: (e) => handleWidthLengthChange(e, "width"),
                                                onKeyDown: (e) => handlechildKeyDown(e, "width")
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption="長"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: childlength ?? 0,
                                                // onChange: (e) => handleWidthLengthChange(e, "length"),
                                                onKeyDown: (e) => handlechildKeyDown(e, "length")
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={scss.right}>
                            <div className={scss.content}>
                                {data11child.map((Data) => (
                                    <table style={{ border: 'solid 1px black' }}>
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
                                                                                    onClick={() => {
                                                                                        setChildWHPosition(childDataItem.length + "-" + childDataItem.width + "-" + childDataItem.childlength + "-" + childDataItem.childwidth);
                                                                                        setChildParentLength(childDataItem.length);
                                                                                        setChildParentWidth(childDataItem.width);
                                                                                        // setChildParentLength(childDataItem.length);
                                                                                        // setChildParentWidth(childDataItem.width);
                                                                                    }}
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
                </div>
            </div> */}
        </SubLayer>
    );
}
