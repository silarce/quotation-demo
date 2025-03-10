import SubLayer from "components/Layer/SubLayer/SubLayer";
import PageHeader02 from "components/PageHeader/PageHeader02/PageHeader02";
import scss from './poMapping.module.scss';
import { createRef, useContext, useEffect, useRef, useState } from "react";
import { setting } from '../wareHouseList/index';
import CellWithBar from "components/global/gear/cell/cellWithBar";
import { AppContext } from 'pages/_app';
//icon
import icon_add from 'public/image/icon/fc_add2.svg';
import icon_fc_check from 'public/image/icon/fc_check.svg';
import icon_cancel2 from 'public/image/icon/fc_cancel2.svg';
import icon_cancel3 from 'public/image/icon/fc_cancel3.svg';
import icon_edit from 'public/image/icon/fc_edit.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_eye from 'public/image/icon/eyeOpen.svg';
import icon_eye_gray from 'public/image/icon/eyeProhibit.svg';
import icon_cir_add from 'public/image/icon/addCircle.svg';
import icon_cir_remove from 'public/image/icon/removeCircle.svg';
import icon_arrow_right from 'public/image/icon/fc_arrow_right.svg';
import myAlert from "components/global/gear/modal/simpleModal/alertModals";

export default function PoMapping() {

    //#region ===========【登入者】
    const { userInfo } = useContext(AppContext);
    const { erpFeature } = useContext(AppContext);
    //#endregion
    //#region ===========【頁面參數】
    const [pagename, setPagename] = useState<string>("工單對應")
    const [statusarea, setStatusarea] = useState<boolean>(false)
    const [excelopen, setExcelopen] = useState<boolean>(true)
    const [printopen, setPrintopen] = useState<boolean>(false)
    const [reviewopen, setReviewopen] = useState<boolean>(false)
    const [transopen, setTransopen] = useState<boolean>(false)





    //#endregion
    //#region ===========【變數宣告】
    //資料列宣告
    const [ogldata, setOglData] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [data2, setData2] = useState<any[]>([]);


    //錯誤訊息處理
    const [error, setError] = useState<string | null>(null);



    //編輯狀態
    const [isEditing, setIsEditing] = useState(false);



    const [currentindex, setCurrentIndex] = useState<number>(0);

    const nameRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const productidRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const productnameRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const spec_formulaRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const noteRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const columnofspeconqpiRefs= useRef(data2.map(() => createRef<HTMLInputElement>()));
    
    //#endregion

    //#region ===========【頁面進入】

    useEffect(() => {
        Get();
    }, [])
    //#endregion

    //#region ===========【API】

    //以ID取單據
    const Get = async () => {
        try {
            // setIsLoading(true);
            const conditionModel = {
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetWorkSheetProductionOrderMapping?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responsedata = await response.json();

            setOglData(responsedata);
            // setData(
            //     responsedata.filter(
            //         (item: any, index: number, self: any[]) =>
            //             index === self.findIndex((t) => t.worksheet_number === item.worksheet_number)
            //     )
            // );
            setData(responsedata);



        } catch (error: any) {
            setError(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };
    //#endregion

    //#region ===========【頁面功能】
    // 組件清單編輯
    const [editlist, setEditlist] = useState<boolean>(false);
    const [editlistindex, setEditlistindex] = useState<number>(0);
    const [originaleditlistdata, setOriginaleditlistdata] = useState<any[]>([]);
    const quantityRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    // 組件編輯
    const handleEdit = async (index: any, item: any) => {
        if (editlist === true) {
            myAlert.warning({ title: '維護中，請先結束編輯狀態' })
            return;
        }
        handleRowClick(item.id);
        setOriginaleditlistdata(data);
        setEditlist(!editlist);
        setEditlistindex(index);
    };
    // 組件取消編輯
    const handleCancel = async (index: any) => {
        setEditlist(!editlist);
        setData(originaleditlistdata);
        setSelectedItemId('');
    };

    // 更新組件清單
    const handleUpdate = (index: number, item: any) => {
        myAlert.confirm({
            title: '確定更新嗎?',
            props: {
                onOk: () => {
                    //  UpdateSalary(item);
                }
            }
        });
    };

    //新增工作表對應編碼
    const handleAdd = () => {
        // 設定預設的資料結構
        const emptyDetail = {
            id: "",  // 可以換成新的 ID 或由其他方式生成
            worksheet_number: '',
            productid: '',
            enable: true,
            created_at: new Date().toISOString(),  // 當前時間
            created_by: userInfo?.employee?.id,  // 請根據需要修改
            updated_by: userInfo?.employee?.id,  // 請根據需要修改
            updated_at: new Date().toISOString(),  // 當前時間
            note: '',
            productname: ''
        };

        // 將空資料新增進陣列
        setData((prevData) => [...prevData, emptyDetail]);
    };





    const handleStringChange = (index: number, key: string, value: string) => {
        const updatedData = [...data];  // 使用淺拷貝
        updatedData[index] = { ...updatedData[index], [key]: value };  // 確保更改的只是副本
        setData(updatedData);  // 更新data2
    };



    //#endregion
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    // 點擊處理函數
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    return (
        <SubLayer isLoading_subLayer={false} className='overflow-hidden'>
            <PageHeader02 tag={`工單對應`} panelList={undefined}
                customeLeft={[

                ]}
                customeRight={[

                ]} />
            <div
                style={{
                    paddingTop: '0px',
                    paddingBottom: '0px'
                }}
            >
                <span
                    style={{
                        height: '50px',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        justifyContent: 'center', // 水平置中
                        alignItems: 'center',     // 垂直置中
                        fontSize: '18px'
                    }}
                >
                    {pagename}項目
                </span>
            </div>
            <div className={scss.head_body}>
                <div>
                    <div style={{ height: '500px', border: '1px solid #c1c1c1', overflow: 'auto' }}>
                        <div>

                            <div className={scss.thead1}>
                                <span></span>
                                <span>工作表代號</span>
                                <span>料號</span>
                                <span>品名</span>
                                <span>規格公式</span>
                                <span>規格來源(欄位)</span>
                                <span>備註</span>
                                <span></span>
                            </div>
                            {data && (
                                data.map((_item, index) => (
                                    <CellWithBar
                                        key={index}
                                        className={scss.panelHeader1}
                                    // onClick={() => {
                                    //     setData2(ogldata.filter((item) => item.worksheet_number === _item.worksheet_number));
                                    // }}
                                    >
                                        <div className={scss.row01}>
                                            <span>
                                                <button onClick={() => { handleEdit(index, _item) }}>
                                                    <img src={icon_edit.src} alt="cancel" style={{ display: `${(index === editlistindex && editlist === true) ? 'none' : ''}`, width: '30px', height: '20px' }} />
                                                </button>
                                                <button onClick={() => { handleUpdate(index, _item) }} style={{ display: `${(index === editlistindex && editlist === true) ? '' : 'none'}` }}>
                                                    <img src={icon_fc_check.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                                </button>
                                                <button onClick={() => { handleCancel(index) }} style={{ display: `${(index === editlistindex && editlist === true) ? '' : 'none'}` }}>
                                                    <img src={icon_cancel2.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                                </button>
                                            </span>
                                            <span>
                                                <input
                                                    ref={nameRefs.current[index]}
                                                    style={{ backgroundColor: 'transparent', borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none', width: '95%' }}
                                                    type="text"
                                                    value={_item.worksheet_number !== undefined ? _item.worksheet_number : ''}
                                                    readOnly={!(editlist && editlistindex === index)}

                                                    onChange={(e) => {
                                                        handleStringChange(index, "worksheet_number", e.target.value);
                                                        setCurrentIndex(index);
                                                    }}
                                                />
                                            </span>
                                            <span>
                                                <input
                                                    ref={productidRefs.current[index]}
                                                    style={{ backgroundColor: 'transparent', borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none', width: '95%' }}
                                                    type="text"
                                                    value={_item.productid !== undefined ? _item.productid : ''}
                                                    readOnly={!(editlist && editlistindex === index)}

                                                    onChange={(e) => {
                                                        handleStringChange(index, "productid", e.target.value);
                                                        setCurrentIndex(index);
                                                    }}
                                                />
                                            </span>
                                            <span>
                                                <input
                                                    ref={productnameRefs.current[index]}
                                                    style={{ backgroundColor: 'transparent', borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none', width: '95%' }}
                                                    type="text"
                                                    value={_item.productname !== undefined ? _item.productname : ''}
                                                    readOnly={!(editlist && editlistindex === index)}

                                                    onChange={(e) => {
                                                        handleStringChange(index, "productname", e.target.value);
                                                        setCurrentIndex(index);
                                                    }}
                                                />
                                            </span>
                                            <span>
                                                <input
                                                    ref={spec_formulaRefs.current[index]}
                                                    style={{ backgroundColor: 'transparent', borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none', width: '95%' }}
                                                    type="text"
                                                    value={_item.spec_formula !== undefined ? _item.spec_formula : ''}
                                                    readOnly={!(editlist && editlistindex === index)}

                                                    onChange={(e) => {
                                                        handleStringChange(index, "spec_formula", e.target.value);
                                                        setCurrentIndex(index);
                                                    }}
                                                />
                                            </span>
                                            {/*  */}
                                            <span>
                                                <input
                                                    ref={columnofspeconqpiRefs.current[index]}
                                                    style={{ backgroundColor: 'transparent', borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none', width: '95%' }}
                                                    type="text"
                                                    value={_item.columnofspeconqpi !== undefined ? _item.columnofspeconqpi : ''}
                                                    readOnly={!(editlist && editlistindex === index)}

                                                    onChange={(e) => {
                                                        handleStringChange(index, "columnofspeconqpi", e.target.value);
                                                        setCurrentIndex(index);
                                                    }}
                                                />
                                            </span>
                                            <span>
                                                <input
                                                    ref={noteRefs.current[index]}
                                                    style={{ backgroundColor: 'transparent', borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none', width: '95%' }}
                                                    type="text"
                                                    value={_item.note !== undefined ? _item.note : ''}
                                                    readOnly={!(editlist && editlistindex === index)}

                                                    onChange={(e) => {
                                                        handleStringChange(index, "note", e.target.value);
                                                        setCurrentIndex(index);
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    </CellWithBar>
                                ))
                            )}
                        </div>
                    </div>
                    <span style={{ paddingLeft: '22px', position: 'relative' }}>
                        {/* <button onClick={() => {
                            handleAdd();

                        }} style={{ fontSize: '18px' }}>
                            <img src={icon_add.src} alt="add" style={{ width: '25px', height: '25px' }} />
                            新增編碼
                        </button> */}
                    </span>
                </div>
                {/* <div style={{ height: '500px', border: '1px solid #c1c1c1', overflow: 'auto' }}>
                    <div className={scss.thead2}>
                        <span>

                        </span>
                        <span>料號</span>
                        <span>狀態</span>
                        <span>規格</span>
                        <span>公式</span>
                        <span>數量</span>
                        <span>公式</span>
                        <span>備註</span>
                    </div>
                    {data2 && (
                        data2.map((_item, index) => (
                            <CellWithBar
                                key={index}
                                className={scss.panelHeader2}
                                onClick={() => {
                                    alert(_item.id)
                                }}
                            >
                                <div className={scss.row01}>
                                    <span></span>
                                    <span>{_item.productid}</span>
                                    <span>{_item.productname}</span>
                                    <span>{_item.county}{_item.district}{_item.address}</span>
                                </div>
                            </CellWithBar>
                        ))
                    )}
                    <span style={{ paddingLeft: '22px', position: 'relative' }}>
                        <button onClick={() => {
                            alert("sdfsdf")
                        }} style={{ fontSize: '18px' }}>
                            <img src={icon_add.src} alt="add" style={{ width: '25px', height: '25px' }} />
                            新增物料
                        </button>
                    </span>
                </div> */}
            </div>
        </SubLayer >

    );
}