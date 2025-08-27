import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';
import Input from 'components/global/myCom/Input/Input';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import Icon_list from 'public/image/icon/fong/procurement.svg';
import deleteIcon from 'public/image/icon/trash.svg?url';
import { Table } from 'antd';
import { useRouter } from 'next/router';
import DeleteModal from 'components/global/myCom/myModal/deleteModal';

import Btn from 'components/global/gear/button/btn_fong';

//api
import { getCompanyList, deleteCompany } from 'components/page/organization/company/api';

//scss
import scss from './company.module.scss';
import tableScss from 'components/global/myCom/myTable/table.module.scss';

interface DetailItem {
  key: string;
  comId: string;
  comCode: string;
  comChName: string;
  comEnName: string;
  isEnable: boolean;
}

export default function Companydata() {
  const [input, setInput] = useState('');
  const [checkedCompanies, setCheckedCompanies] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string>('');

  const router = useRouter();

  //儲存公司資料
  const [companyList, setCompanyList] = useState<DetailItem[]>([]);

  const fetchCompanyList = async () => {
    try {
      const fe_search = `${input}`.trim();
      const res = await getCompanyList({ keyword: '', pageIndex: 1, pageSize: 10 });

      if (res.return_code !== 0) {
        console.log('取得公司資料失敗');
      }

      // 將 API 資料轉成你目前的欄位格式（DetailItem）
      const formattedData: DetailItem[] = res.data.map((item: any) => ({
        key: item.com_id,
        comCode: item.comCode,
        comChName: item.comChName,
        comEnName: item.comEnName,
        isEnable: item.isEnable,
      }));

      setCompanyList(formattedData);
    } catch (err) {
      console.error('取得公司資料失敗', err);
    }
  };

  // 單筆刪除
  const handleDelete = async (com_id: string) => {
    try {
      await deleteCompany(com_id);
      // 更新畫面
      fetchCompanyList();
    } catch (err) {
      console.error('刪除失敗:', err);
    }
  };

  // 多筆刪除
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        companyList.filter((c) => checkedCompanies.includes(c.comId)).map((item) => deleteCompany(item.key)) // key 是 com_id
      );

      setCheckedCompanies([]);
      fetchCompanyList();
    } catch (err) {
      console.error('批次刪除失敗:', err);
    }
  };

  useEffect(() => {
    fetchCompanyList(); // 頁面一進來就載入
  }, []);

  //控制勾選
  const handleCheck = (comId: string) => {
    setCheckedCompanies((prev) => (prev.includes(comId) ? prev.filter((code) => code !== comId) : [...prev, comId]));
  };

  //控制全選與反選
  const handleSelectAll = () => {
    const allCodes = companyList.map((item) => item.comCode);

    if (checkedCompanies.length === allCodes.length) {
      setCheckedCompanies([]);
    } else {
      setCheckedCompanies(allCodes);
    }
  };

  const mapPageHeaderTop: MapPageHeader = {
    title: [
      {
        name: 'companyData1',
      },
    ],
  };

  const columns: ColumnsType<DetailItem> = [
    {
      title: (
        <div className="flex gap-5 justify-center cursor-pointer">
          <label className={scss.checkboxWrapperTable}>
            <input
              type="checkbox"
              checked={companyList.length > 0 && checkedCompanies.length === companyList.length}
              onChange={handleSelectAll}
              ref={(input) => {
                if (input) {
                  input.indeterminate = checkedCompanies.length > 0 && checkedCompanies.length < companyList.length;
                }
              }}
            />
            <span className={scss.customCheckmarkTable}></span>
          </label>
        </div>
      ),
      dataIndex: 'check_box',
      key: 'check_box',
      align: 'left',
      width: '5.1%',
      render: (_, record) => (
        <label className={scss.checkboxWrapperTable}>
          <input
            type="checkbox"
            checked={checkedCompanies.includes(record.comCode)}
            onChange={() => handleCheck(record.comCode)}
          />
          <span className={scss.customCheckmarkTable}></span>
        </label>
      ),
    },
    {
      title: '公司代碼',
      dataIndex: 'comCode',
      key: 'comCode',
      align: 'left',
      width: '6.38%',
    },
    {
      title: '公司名稱',
      dataIndex: 'comChName',
      key: 'comChName',
      align: 'left',
      width: '25.51%',
    },
    {
      title: '公司英文名稱',
      dataIndex: 'comEnName',
      key: 'comEnName',
      align: 'left',
      width: '25.51%',
      // render: (_, record) => <div className="">{record.description}</div>,
    },
    {
      title: '',
      dataIndex: '',
      key: '',
      align: 'left',
      width: '27.29%',
      // render: (_, record) => <div className="">{record.description}</div>,
    },
    {
      title: '啟用狀態',
      dataIndex: 'isEnable',
      key: 'isEnable',
      align: 'center',
      width: '5.1%',
      render: (_, { isEnable }) => {
        const statusText = isEnable ? '啟用' : '停用';

        const styles: Record<string, React.CSSProperties> = {
          啟用: {
            backgroundColor: '#D1FAE5',
            color: '#10B981',
            padding: '2px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            display: 'inline-block',
            fontWeight: 'bold',
          },
          停用: {
            backgroundColor: '#E5E7EB',
            color: '#6B7280',
            padding: '2px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            display: 'inline-block',
            fontWeight: 'bold',
          },
        };

        return <span style={styles[statusText]}>{statusText}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: '5.1%',
      render: (_, record) => (
        <div className="flex justify-center gap-5">
          <Icon_list
            onClick={() => router.push(`/setting/organization/company/addCompany?com_id=${record.key}`)}
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
          />
          <Image
            src={deleteIcon}
            alt="delete"
            onClick={() => {
              setPendingDeleteId(record.key); // 暫存 com_id
              setIsDeleteModalOpen(true);
            }}
            style={{ cursor: 'pointer' }}
            width={16}
            height={16}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader {...mapPageHeaderTop} />
      <div className="border-[1px] border-[#616161] rounded-lg py-8 mt-7">
        <div className="px-6  pb-6 flex justify-between">
          <div className="flex gap-4 h-[40px]">
            <Input
              label=""
              value={input}
              onChange={setInput}
              placeholder="請輸入公司代號 / 公司名稱"
              width="196px"
              marginLeft="0px"
              className="flex-1"
            />
            <Btn theme="query" onClick={fetchCompanyList} className="flex-1">
              搜尋資料
            </Btn>
          </div>
          <div className="flex gap-6 h-[40px]">
            {/* {checkedCompanies.length > 0 && <ClearButton label="全部刪除" onClick={handleBulkDelete} />} */}
            {checkedCompanies.length > 0 && (
              <Btn theme="trash" onClick={handleBulkDelete}>
                刪除
              </Btn>
            )}
            <Btn theme="add" onClick={() => router.push('/organization/company/addCompany')}>
              新增公司
            </Btn>
          </div>
        </div>
        <div className="px-6">
          <Table
            rowKey="comId"
            className={tableScss.customTable}
            columns={columns}
            dataSource={companyList}
            bordered
            style={{ minWidth: '50%' }}
          />
        </div>
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          handleDelete(pendingDeleteId);
        }}
      />
    </>
  );
}
