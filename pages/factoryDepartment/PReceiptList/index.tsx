import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import _, { filter } from 'lodash';

import scss from './PReceiptList.module.scss';
import Thead01 from '../ui/table/thead01';
import Tbody01 from '../ui/table/tbody01';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { setting } from '../wareHouseList/index';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { AppContext } from 'pages/_app';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import { parseJSON } from 'date-fns';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import icon_edit from 'public/image/icon/edit.svg?url';
import icon_save from 'public/image/icon/fc_save.svg?url';
import icon_cancel from 'public/image/icon/fc_cancel.svg?url';
import icon_delete from 'public/image/icon/fc_delete.svg?url';
import icon_autoadd from 'public/image/icon/fc_autoadd.svg?url';
import { Collapse_old } from 'components/global/myAntd/collapse';
import icon_fc_arrow_down from 'public/image/icon/fc_arrow_down.svg?url';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import icon_search from 'public/image/icon/fc_search.svg?url';
import icon_collapse_right from 'public/image/icon/fc_collapse_right.svg?url';
import icon_collapse_left from 'public/image/icon/fc_collapse_left.svg?url';
import icon_detail from 'public/image/icon/fc_detail.svg?url';
import icon_fc_arrow_down_gray from 'public/image/icon/fc_arrow_down_gray.svg?url';
import icon_close from 'public/image/icon/fc_close.svg?url';
import MyDatePicker from 'components/global/gear/inputAndSel_v2/cog/myDatePicker';
import icon_disable from 'public/image/icon/fc_disable.svg?url';
import icon_print from 'public/image/icon/fc_printer.svg?url';
import { color } from 'html2canvas/dist/types/css/types/color';
import { orange } from '@mui/material/colors';
import icon_remove from 'public/image/icon/fc_remove.svg?url';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import icon_fc_arrow_up from 'public/image/icon/fc_arrow_up.svg?url';
import icon_task_open from 'public/image/icon/fc_task_open.svg?url';
import icon_task_open_gray from 'public/image/icon/fc_task_open_gray.svg?url';
import icon_task_close from 'public/image/icon/fc_task_close.svg?url';
import icon_task_approved from 'public/image/icon/fc_approved.svg?url';
import icon_task_rejected from 'public/image/icon/fc_rejected.svg?url';
import icon_fc_add2 from 'public/image/icon/fc_add2.svg?url';
import icon_sent_review from 'public/image/icon/fc_sent_review.svg?url';
import icon_sent_review_gray from 'public/image/icon/fc_sent_review_gray.svg?url';
import icon_add2_gray from 'public/image/icon/fc_add2_gray.svg?url';
import icon_arrow_right from 'public/image/icon/fc_arrow_right.svg?url';
import icon_flow from 'public/image/icon/fc_flow.svg?url';
import icon_review from 'public/image/icon/review.svg?url';
import icon_flow_gray from 'public/image/icon/fc_flow_gray.svg?url';
import icon_sent_review_stop from 'public/image/icon/fc_sent_review_stop.svg?url';
import icon_add2 from 'public/image/icon/fc_add2.svg?url';
import icon_fc_quotereq from 'public/image/icon/fc_quotereq.svg?url';
import icon_export from 'public/image/icon/fc_export.svg?url';
import icon_edit_gray from 'public/image/icon/fc_edit_gray.svg?url';
import icon_arrow_right2 from 'public/image/icon/longArrow.svg?url';
import icon_search2 from 'public/image/icon/search.svg?url';
import icon_clear from 'public/image/icon/fc_clear.svg?url';

export default function PReceiptList() {
  const [pagename, setPagename] = useState<string>('進貨');
  const [reviewopen, setReviewopen] = useState<boolean>(false);

  //#region ===========【路由參數】
  const router = useRouter();
  const {} = router.query;
  //#endregion

  //#region ===========【登入者】
  const { userInfo } = useContext(AppContext);
  const { erpFeature } = useContext(AppContext);
  //#endregion

  //#region ===========【變數宣告】
  //載入動畫
  const [isLoading, setIsLoading] = useState(false);

  //資料列宣告
  const [data, setData] = useState<any[]>([]);
  const [data1, setData1] = useState<any[]>([]);
  const [data1restore, setData1Restore] = useState<any[]>([]);
  const [data2, setData2] = useState<any[]>([]);
  const [data2restore, setData2Restore] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchdata, setSearchdata] = useState<any[]>([]);

  //搜尋
  const [keyword1, setKeyword1] = useState<string>('');
  const [keyword2, setKeyword2] = useState<string>('');
  const [keyword3, setKeyword3] = useState<string>('');
  const [keyword4, setKeyword4] = useState<string>('');
  // 預設截止日期為今天，起始日期為今天往前推30天
  const defaultEndDate = dayjs();
  const defaultStartDate = dayjs().subtract(30, 'days');

  // 使用 Moment 類型作為狀態
  const [keywordstartdate, setKeywordstartdate] = useState<Dayjs | null>(defaultStartDate);
  const [keywordenddate, setKeywordenddate] = useState<Dayjs | null>(defaultEndDate);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  //#endregion

  //#region ===========【上方功能列】
  const panelList: TpanelList = [
    {
      type: 'addButton',
      label: `新增${pagename}單`,
      onClick: () => {
        router.push({
          pathname: `/factoryDepartment/addProdReceiptList`,
          query: {},
        });
      },
    },
  ];
  //#endregion

  //#region ===========【頁面進入】
  useEffect(() => {
    Get();
  }, []);

  //#endregion

  //#region ===========【API】

  //取單據
  const Get = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {
        type: '進貨中',
        username: userInfo?.employee?.id.toString(),
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/WareHouse/NewGetProdReceiptWithReviews?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setData(data);
      setData1Restore(data);
      setSearchdata(data);
      console.log(data);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error: any) {
      // console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //以ID取單據
  const GetDetailById = async (id: any) => {
    try {
      // setIsLoading(true);
      const conditionModel = {
        prodreceiptuuid: id as string | undefined,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
      const response = await fetch(`${setting.apipath}/WareHouse/NewGetProdReceiptDetailById?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responsedata = await response.json();
      // setData1(data);
      console.log(data);

      return responsedata;

      console.log();
    } catch (error: any) {
      setError(error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  //#endregion

  //#region ===========【審核】
  const [review_flow, setReview_flow] = useState<string>('');
  const [reviewbar, setReviewbar] = useState<boolean>(false);
  const [reviewdata, setReviewdata] = useState<any[]>([]);
  const [reviewflowdata, setReviewflowdata] = useState<any[]>([]);
  const [reviewflowdata2, setReviewflowdata2] = useState<any[]>([]);
  const [documenttitle, setDocumenttitle] = useState<string>('');
  const [reviewhistroydata, setReviewhistorydata] = useState<any[]>([]);

  //取全部的自訂流程
  const GetReviewFlow = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {
        user_id: userInfo?.employee?.id.toString(),
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'ReviewService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/Review/GetReviewFlow?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const text = await response.text();

      if (!text) {
        // console.log('No data returned');
        setReviewdata([]);

        return;
      }

      const data = JSON.parse(text);
      setReviewdata(data);
    } catch (error: any) {
      console.log(error);
      // setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //取單據的審核流程
  const GetReviewById = async (document_uuid: any) => {
    try {
      setReviewflowdata([]);
      setReviewflowdata2([]);

      const conditionModel = {
        document_uuid: document_uuid,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'ReviewService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/Review/GetReviewById?${queryParams}`);

      // 檢查響應狀態
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      // 檢查響應內容是否為空
      const text = await response.text();

      if (text.trim() === '') {
        return;
      }

      // 解析 JSON
      const data = JSON.parse(text);

      console.log(data);

      // 檢查資料是否存在且有效
      if (data && data.length > 0) {
        setReviewflowdata(data);
      } else {
        console.log('No valid data');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  //#endregion

  //#region  ===========【單據功能區】
  const [details, setDetails] = useState<Record<number, any[]>>({});

  const handlePanelClick = async (id: number) => {
    const detailData = await GetDetailById(id);
    console.log(detailData);
    setDetails((prevDetails) => ({
      ...prevDetails,
      [id]: detailData,
    }));
  };

  //#endregion

  //#region ===========【單據篩選】
  const filterData = () => {
    const startDate = keywordstartdate;
    const endDate = keywordenddate;
    const id = keyword2.trim();
    const status = keyword3.trim();
    const supplier = keyword4.trim();

    // 檢查是否所有條件都為空
    if ((!startDate || !startDate.isValid()) && (!endDate || !endDate.isValid()) && !id && !status && !supplier) {
      setSearchdata(data);

      return;
    }

    // 過濾資料
    let filteredData = data.filter((item) => {
      const createAt = dayjs(item.create_at);
      const isDateInRange =
        !startDate || !startDate.isValid() || !endDate || !endDate.isValid()
          ? true
          : createAt.isBetween(startDate, endDate, 'days', '[]');

      return isDateInRange;
    });

    // 模糊查詢請購單號
    if (id) {
      filteredData = filteredData.filter((item) => item.prodreceiptid.toString().includes(id));
    }

    // 模糊查詢單據狀態
    if (status) {
      filteredData = filteredData.filter((item) => item.status.toString().includes(status));
    }

    if (supplier) {
      filteredData = filteredData.filter((item) => item.suppliername.toString().includes(supplier));
    }

    setSearchdata(filteredData);
  };

  // 監聽條件變更
  useEffect(() => {
    filterData();
  }, [keywordstartdate, keywordenddate, keyword2, keyword3, keyword4]);
  //#endregion

  return (
    <SubLayer isLoading_subLayer={false}>
      <PageHeader02
        tag={pagename + '單列表'}
        customeLeft={[
          <div
            key="0"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between', // 調整間距，或使用 space-around、space-evenly
              // gap: '5px', // 元素之間的間距
              flexWrap: 'wrap', // 如果空間不足，讓元素換行
              paddingLeft: '10px',
            }}
          >
            {/* 第一個選項 */}
            <div style={{ borderRight: '1px solid rgb(168, 168, 168)' }}>
              <select
                value={keyword3 || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setKeyword3(e.target.value);
                  e.target.blur(); // 讓 select 失去焦點
                }}
                disabled={false} // 根據需求設置是否禁用
                style={{
                  fontSize: '18px',
                  borderBottom: '1px solid #14256a',
                  color: '#14256a',
                  width: '100px',
                  marginTop: '-1px', // 調整負值以微調向上位置
                }}
              >
                <option value="">全部</option> {/* 預設選項 */}
                <option value="進貨中">進貨中</option>
                {/* <option value="審核中">審核中</option>
                                <option value="已核准">已核准</option> */}
                <option value="已結案">已結案</option>
              </select>
            </div>

            {/* 第二個選項 */}
            <div>
              <InputSel
                caption="起始日期"
                disabled={false}
                captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px', paddingLeft: '5px' }}
                datePickerProps={{
                  props: {
                    style: { paddingRight: '5px' },
                    value: keywordstartdate || null,
                    onChange: (e: Dayjs | null) => {
                      setKeywordstartdate(e);
                    },
                  },
                }}
              />
            </div>

            {/* 第三個選項 */}
            <div style={{ borderRight: '1px solid rgb(168, 168, 168)' }}>
              <InputSel
                caption="截止日期"
                disabled={false}
                captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                datePickerProps={{
                  props: {
                    style: { paddingRight: '5px' },
                    value: keywordenddate || null,
                    onChange: (e: Dayjs | null) => {
                      setKeywordenddate(e);
                    },
                  },
                }}
              />
            </div>

            {/* 第四個選項 */}
            <div style={{ borderRight: '1px solid rgb(168, 168, 168)' }}>
              <InputSel
                // caption="單號"
                disabled={false}
                captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                inputProps={{
                  props: {
                    placeholder: '請輸入單號',
                    style: { width: '250px', paddingLeft: '5px' },
                    value: keyword2,
                    onChange: (e) => {
                      setKeyword2(e.target.value);
                    },
                  },
                }}
              />
            </div>
            <div>
              <InputSel
                // caption="單號"
                disabled={false}
                captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                inputProps={{
                  props: {
                    placeholder: '請輸入廠商名稱',
                    style: { width: '300px', paddingLeft: '5px' },
                    value: keyword4,
                    onChange: (e) => {
                      setKeyword4(e.target.value);
                    },
                  },
                }}
              />
            </div>
          </div>,
        ]}
        customeRight={[]}
        panelList={panelList}
      />
      <div>
        <Thead01 type={'PReceipt'} />
        <div>
          {searchdata &&
            searchdata.map((_item: any, index: number) => (
              <CellWithBar key={index} className={scss.panelHeader15}>
                <Collapse_old
                  defaultActiveKey={[]}
                  className={scss.customCollapse}
                  onChange={(key) => {
                    if (key.includes('1')) {
                      handlePanelClick(_item.prodreceiptuuid);
                    }
                  }}
                  items={[
                    {
                      key: '1',
                      style: { backgroundColor: 'transparent', border: '0' },
                      showArrow: false,
                      label: (
                        <>
                          <div
                            key={index}
                            className={`${scss.row01} 
                                                ${_item.prodreceiptuuid === selectedItemId ? scss.selectedRow : ''}`}
                          >
                            <span>{index + 1}</span>
                            <span style={{ fontSize: '18px' }}>{_item.prodreceiptid}</span>
                            <span style={{ color: '#ea1833' }}>{_item.status}</span>
                            <span>{getTaiwanDateStr(_item.create_at)}</span>
                            <span>{getTaiwanDateStr(_item.need_date)}</span>
                            <span>{_item.create_by}</span>
                            <span>{_item.suppliername}</span>
                            <span>
                              <IconDetail
                                onClick={() => {
                                  router.push({
                                    pathname: `/factoryDepartment/PReceiptDetail`,
                                    query: {
                                      item: JSON.stringify(_item),
                                    },
                                  });
                                }}
                              />
                            </span>
                          </div>
                          {reviewopen && (
                            <>
                              <div
                                key={index}
                                className={`${scss.row02}`}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '20px',
                                  padding: '10px 20px',
                                  cursor: 'pointer',
                                }} // 水平排列
                              >
                                {_item.stages.length === 0 ? (
                                  <div style={{ fontSize: '16px', color: 'gray' }}>未送審</div>
                                ) : (
                                  _item.stages.map((item: any, index: number) => {
                                    // 判斷圈圈顏色
                                    let circleColor = 'gray'; // 預設為灰色
                                    let textColor = 'gray'; // 預設文字顏色為灰色

                                    if (item.review_order === 1 || item.review_status === '核准') {
                                      circleColor = 'green';
                                      textColor = 'black'; // 綠色的時候文字變為黑色

                                      // 如果是核准且存在下一關，設定下一關為簽核中
                                      if (
                                        index < _item.stages.length - 1 && // 確保不是最後一關
                                        _item.stages[index + 1].review_status === '' // 下一關的狀態是空
                                      ) {
                                        _item.stages[index + 1].review_status = '簽核中';
                                      }
                                    } else if (
                                      item.review_status === '簽核中' &&
                                      index > 0 &&
                                      _item.stages[index - 1].review_order + 1 === item.review_order
                                    ) {
                                      circleColor = 'red';
                                      textColor = 'black'; // 紅色的時候文字變為黑色
                                    }

                                    return (
                                      <div
                                        key={index}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '10px',
                                        }}
                                      >
                                        {/* 灰色框框 */}
                                        <div
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '15px',
                                            padding: '5px 10px',
                                            gap: '10px',
                                          }}
                                        >
                                          {/* 左邊的圈圈 */}
                                          <div
                                            style={{
                                              width: '10px',
                                              height: '10px',
                                              borderRadius: '50%',
                                              backgroundColor: circleColor,
                                            }}
                                          ></div>
                                          {/* 名稱 */}
                                          <span style={{ color: textColor }}>
                                            {item.review_status}&nbsp;
                                            {item.review_person_name}
                                          </span>
                                        </div>

                                        {/* 右邊的箭頭，最後一筆不顯示 */}
                                        {index < _item.stages.length - 1 && (
                                          <div style={{ fontSize: '20px', color: 'black' }}>
                                            <svg
                                              width="32"
                                              height="11"
                                              viewBox="0 0 32 11"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <line
                                                x1="0.5"
                                                y1="5.5"
                                                x2="30.5"
                                                y2="5.5"
                                                stroke="#404040"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                              ></line>
                                              <path
                                                d="M27 2L31 5.5L27 9"
                                                stroke="#404040"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                              ></path>
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </>
                          )}
                        </>
                      ),
                      children: (
                        <div>
                          <table className={scss.detailTable}>
                            <thead>
                              <tr>
                                <th style={{ width: '50px' }}>序</th>
                                <th style={{ width: '100px' }}>料號</th>
                                <th style={{ width: '300px' }}>名稱</th>
                                <th style={{ width: '400px' }}>規格</th>
                                <th style={{ width: '150px' }}>數量</th>
                                <th style={{ width: '150px' }}>已入庫</th>
                                <th style={{ width: '80px' }}>單位</th>
                                <th style={{ width: '150px' }}>單價</th>
                                <th>金額</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {details[_item.prodreceiptuuid]?.map((detail: any, detailIndex: number) => (
                                <tr key={detailIndex}>
                                  <td style={{ width: '50px' }}>{detailIndex + 1}</td>
                                  <td style={{ width: '100px' }}>{detail.productid}</td>
                                  <td style={{ width: '300px' }}>{detail.name}</td>
                                  <td style={{ width: '400px' }}>{detail.spec}</td>
                                  <td style={{ width: '150px' }}>{detail.quantity?.toLocaleString()}</td>
                                  <td style={{ width: '150px', color: '#ea1833' }}>
                                    {detail.alreadyinquantity?.toLocaleString()}
                                  </td>
                                  <td style={{ width: '80px' }}>{detail.unit}</td>
                                  <td style={{ width: '150px' }}>{detail.unitprice?.toLocaleString()}</td>
                                  <td>{detail.totalprice?.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ),
                    },
                  ]}
                />
              </CellWithBar>
            ))}
        </div>
      </div>
    </SubLayer>
  );
}
