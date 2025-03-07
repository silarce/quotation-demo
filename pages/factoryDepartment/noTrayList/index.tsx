import { createRef, useEffect, useRef, useState } from 'react';
import scss from './noTrayList.module.scss';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { setting } from '../wareHouseList/index';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import icon_fc_check from 'public/image/icon/fc_check.svg';
import icon_cancel2 from 'public/image/icon/fc_cancel2.svg';
import icon_cancel3 from 'public/image/icon/fc_cancel3.svg';
import icon_edit from 'public/image/icon/fc_edit.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';

export default function noTrayList() {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any[]>([]); // 物料data
    const [error, setError] = useState<string | null>(null);

    //頁面進入
    useEffect(() => {
        Get();
    }, [])


    const Get = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${setting.apipath}/WareHouse/GetWareHouse`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };




    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };
    // 組件清單編輯
    const [editlist, setEditlist] = useState<boolean>(false);
    const [editlistindex, setEditlistindex] = useState<number>(0);
    const [originaleditlistdata, setOriginaleditlistdata] = useState<any[]>([]);
    const quantityRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    // 組件編輯
    const handleEdit = async (index: any, item: any) => {
        if (editlist === true) {
            myAlert.warning({ title: '倉庫維護中，請先結束編輯狀態' })
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
                    // UpdateWareHouse(item);

                }
            }
        });
    };

    const handleDelete = async (index: any, item: any) => {
        myAlert.confirm({
            title: '確定刪除嗎?',
            props: {
                onOk: () => {
                    // DeleteWareHouseById(item);
                }
            }
        });

    }



    return (

        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={`倉庫編號`} panelList={undefined} />
            <div className={scss.thead1}>
                <span></span>
                <span>序</span>
                <span>料號</span>
                <span>名稱</span>
                <span>規格</span>
                <span>數量</span>
                <span>單位</span>
                <span>批號</span>
                <span></span>
            </div>
            <div>
                {/* {error && <p>Error: {error}</p>} */}
                {data && (
                    data.map((_item: any, index: number) => (
                        <CellWithBar key={index} className={scss.panelHeader}>
                            <div
                                key={index}
                                className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                            // onClick={() => getTrayByWareHouse(_item, traycalled, traycalledname, traytransfer, url, whnamecalled,)}
                            >
                                <span>
                                    <button onClick={() => {
                                        // handleDelete(index, _item);
                                    }}
                                        style={{ display: `${(index === editlistindex && editlist === true) ? 'none' : ''}` }}>
                                        <img src={icon_delete.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                    <button onClick={() => { handleEdit(index, _item) }}
                                        style={{ display: `${(index === editlistindex && editlist === true) ? 'none' : ''}` }}>
                                        <img src={icon_edit.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                    <button onClick={() => { handleUpdate(index, _item) }} style={{ display: `${(index === editlistindex && editlist === true) ? '' : 'none'}` }}>
                                        <img src={icon_fc_check.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                    <button onClick={() => { handleCancel(index) }} style={{ display: `${(index === editlistindex && editlist === true) ? '' : 'none'}` }}>
                                        <img src={icon_cancel2.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                </span>
                                <span>{index+1}</span>
                                <span>{_item.productid}</span>
                                <span>{_item.name}</span>
                                <span>{_item.spec}</span>
                                <span>{_item.quantity}</span>
                                <span>{_item.unit}</span>
                                <span>{_item.batchnumber}</span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </CellWithBar>
                    ))
                )}
            </div>






        </SubLayer>

    );
}
