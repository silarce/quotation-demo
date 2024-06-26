import SubLayer from 'components/Layer/SubLayer/SubLayer';
import scss from './pickingListDetail.module.scss';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import router from 'next/router';
import Thead01 from 'pages/factoryDepartment/ui/table/thead01';
import Tbody01 from 'pages/factoryDepartment/ui/table/tbody01';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { WrappedTextarea, inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { quotationStatusLookup } from 'config/lookupTable';
import { TquotationStatus } from 'js/api/dtoTypes';

export default function PickingListDetail() {

    const status = router.query.status as TquotationStatus;

    const doSearch = (valueArr: (string | Toption | null)[]) => {
        const keywordWhpname = valueArr[0] as string;
        const keywordMaterialnumber = valueArr[1] as string;
        const keywordSpec = valueArr[2] as string;
    };


    const searchTargetList = [
        {
            placeholder: '領料單號',
        },
        {
            placeholder: '領料日期',
        },
        {
            placeholder: '領料人員',
        },
    ];

    const searchGroup = {
        searchTargetList,
        doSearch,
    };


    const panelList: TpanelList = [
        { searchGroup },
        {
            type: 'addButton',
            label: '新增領料單',
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/addTray`,
                    query: {
                        type: 'Tray',
                    },
                });
            },
        },
    ];

    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '領料單'} panelList={panelList} />
            <div className={scss.main}>
                <div className={scss.left}>
                    {/* <div className={scss.top}> */}
                    <div>
                        {/* <Thead01 type={'PickingList'} />
                        <Tbody01 type={'PickingList'} data={data} error={error} traycalled={traycalled} traycalledname={traycalledname} traytransfer={traytransfer} url={undefined} whnamecalled={whnamecalled} /> */}
                        {/* </div> */}
                    </div>
                </div>
                <div className={scss.right}>
                    <br />
                    {/* <MyButton_v2 px='px22' py='py4' theme='danger' className={scss.addBtn} label="領料" onClick={() => { gotoPick() }} />
                    <MyButton_v2 disabled={true} px='px22' py='py4' theme='transparent' className={scss.addBtn} label="已領料" onClick={() => { alert("領料托盤") }} /> */}
                    <div className={scss.childmain}>
                        <div>
                            {/* <input type="texts" style={{border:'1px solid gray'}}/> */}
                            <InputSel
                                {...inputSelProps}
                                caption="領料單號:"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: "2024062500002",
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="領料日期:"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: "113-06-25 ",
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="領料人員:"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: "賴彥廷3",
                                    },
                                }}
                            />

                        </div>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="工單單號:"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: "2024062500002",
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="派工日期:"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: "2024/06/25",
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="主件項目:"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: "無",
                                    },
                                }}
                            />

                        </div>
                    </div>
                    <div>
                        <WrappedTextarea
                            disabled={false}
                            inputSelProps={{ caption: '說明:' }}
                            textareaProps={{
                                props: {
                                    name: 'description',
                                    maxRows: 3,
                                    value: "",
                                    onChange: (e) => {

                                    },
                                },
                            }}
                        />
                        <WrappedTextarea
                            disabled={false}
                            inputSelProps={{ caption: '備註:' }}
                            textareaProps={{
                                props: {
                                    name: 'description',
                                    maxRows: 3,
                                    value: "",
                                    onChange: (e) => {

                                    },
                                },
                            }}
                        />
                    </div>
                    <br />
                    {/* <Thead01 type={'PickingDetailList'} />
                    <Tbody01 type={'PickingDetailList'} data={data1} error={error} traycalled={traycalled} traycalledname={traycalledname} traytransfer={traytransfer} url={undefined} whnamecalled={whnamecalled} /> */}
                </div>
            </div>
        </SubLayer>
    )
}