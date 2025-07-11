const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Switch } from 'antd';

import Cookies from 'js-cookie';
const token = Cookies.get('token');

//scss
import scss from './addCompany.module.scss';

//api
import {
  createCompany,
  getCompanyDetail,
  updateCompany,
  uploadCompanyLogo,
} from 'components/page/organization/company/addCompany/api';

//components
import SaveButton from 'components/global/myCom/button/SaveButton';
import AddButton from 'components/global/myCom/button/AddButton';
import ClearButton from 'components/global/myCom/button/clearButton';
import LabeledInput from 'components/global/myCom/Input/Input';
import { LogoUploader } from 'components/global/myCom/uploader/Uploader';
import LeaveModal from 'components/global/myCom/myModal/leaveModal';
import BackButton from 'components/global/myCom/button/BackButton';

export default function AddCompany() {
  const mapPageHeaderTop: MapPageHeader = {
    title: [
      {
        name: 'companyBasicInformation',
        className: 'bg-[#F5F5F5] !border-b-[1px] border-b-[#14256A] shadow-[inset_0_1px_4px_rgba(0,0,0,0.25)]',
      },
    ],
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  //上傳公司Logo
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | undefined>(undefined);

  //儲存新增公司資料
  const [formState, setFormState] = useState({
    com_ch_name: '',
    com_en_name: '',
    com_ch_short_name: '',
    com_en_short_name: '',
    com_code: '',
    fax_code: '',
    ch_address: '',
    en_address: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    fax: '',
    county: '',
    district: '',
    logo_file_id: '',
  });
  const [isEnable, setIsEnable] = useState(true);

  const updateField = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const payload = {
      ...formState,
      is_enable: isEnable,
    };

    try {
      let res;
      let finalComId = com_id as string;

      if (com_id) {
        // 編輯
        res = await updateCompany(finalComId, payload);
      } else {
        // 新增
        res = await createCompany(payload);
        finalComId = res.data.com_id; // 取得新 com_id
      }

      if (res.return_code === 0) {
        alert('✅ 資料儲存成功');

        if (logoFile && finalComId) {
          const uploadRes = await uploadCompanyLogo(finalComId, logoFile);

          if (uploadRes.return_code !== 0) {
            alert('⚠️ 公司資料已儲存，但 Logo 上傳失敗');
          }
        }

        router.push('/setting/organization/company');
      } else {
        alert(`❌ 儲存失敗：${res.message}`);
      }
    } catch (err) {
      console.error('API 發生錯誤:', err);
      alert('❌ 發生錯誤，請稍後再試');
    }
  };

  const router = useRouter();
  const { com_id } = router.query;

  const fetchDetail = async () => {
    try {
      const res = await getCompanyDetail(com_id as string);
      const data = res.data;

      setFormState({
        com_ch_name: data.com_ch_name,
        com_en_name: data.com_en_name,
        com_ch_short_name: data.com_ch_short_name,
        com_en_short_name: data.com_en_short_name,
        com_code: data.com_code,
        fax_code: data.fax_code,
        ch_address: data.ch_address,
        en_address: data.en_address,
        contact_person: data.contact_person,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        fax: data.fax,
        county: data.county,
        district: data.district,
        logo_file_id: data.logo_file_id ?? '',
      });
      setIsEnable(data.is_enable);

      if (data.logo_file_id) {
        try {
          const res = await fetch(`${BASE_URL}/api/sys/file/download/${data.logo_file_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error('圖片下載失敗');
          }

          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          setPreviewLogoUrl(blobUrl);
        } catch (err) {
          console.error('載入公司 Logo 失敗', err);
        }
      }
    } catch (err) {
      console.error('載入公司資料失敗', err);
    }
  };

  // 抓資料後設定預覽圖
  useEffect(() => {
    if (!com_id) {
      return;
    }

    fetchDetail();
  }, [com_id]);

  return (
    <>
      <div className="flex justify-between">
        <PageHeader {...mapPageHeaderTop} />
        <div className="flex items-center  gap-4">
          <ClearButton label="刪除" className="h-[40px] " onClick={() => console.log('Delete')} />
          <BackButton
            label="返回"
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="w-[80px] h-[40px]"
          />
          <AddButton label="新增公司" onClick={handleSave} className="h-[40px] " />

          <SaveButton label="儲存" onClick={handleSave} className="h-[40px] w-[95px]" />
          <LeaveModal isOpen={isModalOpen} onConfirm={() => router.back()} onCancel={() => setIsModalOpen(false)} />
        </div>
      </div>
      <div className="flex items-center justify-center w-full mt-[22.5px]">
        <span className="font-semibold mr-2 whitespace-nowrap">🏢公司基本資料</span>
        <div className="h-px bg-black flex-1 rounded-[10px]" />
      </div>
      <div className="flex w-full flex-col mt-3">
        <div className="flex w-full gap-[37px]">
          <LabeledInput
            label="中文名稱"
            value={formState.com_ch_name}
            onChange={(val) => updateField('com_ch_name', val)}
            placeholder="請輸入公司名稱"
            labelWidth="w-[10%]"
          />
          <LabeledInput
            label="英文名稱"
            value={formState.com_en_name}
            onChange={(val) => updateField('com_en_name', val)}
            placeholder="請輸入公司英文名稱"
            labelWidth="w-[10%]"
          />
        </div>

        <div className="flex w-full mt-[20px] gap-[37px]">
          <LabeledInput
            label="中文簡稱"
            value={formState.com_ch_short_name}
            onChange={(val) => updateField('com_ch_short_name', val)}
            placeholder="請輸入公司中文簡稱"
            labelWidth="w-[23%]"
            marginLeft="16px"
          />
          <LabeledInput
            label="英文簡稱"
            value={formState.com_en_short_name}
            onChange={(val) => updateField('com_en_short_name', val)}
            placeholder="請輸入公司英文簡稱"
            labelWidth="w-[23%]"
            marginLeft="16px"
          />
          <LabeledInput
            label="自訂代碼"
            value={formState.com_code}
            onChange={(val) => updateField('com_code', val)}
            placeholder="請輸入自訂代碼"
            labelWidth="w-[23%]"
            marginLeft="16px"
          />
          <LabeledInput
            label="統一編號"
            value={formState.fax_code}
            onChange={(val) => updateField('fax_code', val)}
            placeholder="請輸入統一編號"
            labelWidth="w-[23%]"
            marginLeft="16px"
          />
        </div>

        <div className="flex w-full mt-[20px] gap-[37px]">
          <LabeledInput
            label="所在城市"
            value={formState.county}
            onChange={(val) => updateField('county', val)}
            placeholder="請輸入城市"
            labelWidth="w-[23%]"
            marginLeft="16px"
          />
          <LabeledInput
            label="所在地區"
            value={formState.district}
            onChange={(val) => updateField('district', val)}
            placeholder="請輸入地區"
            labelWidth="w-[23%]"
            marginLeft="16px"
          />
          <LabeledInput
            label="公司電話"
            value={formState.contact_phone}
            onChange={(val) => updateField('contact_phone', val)}
            placeholder="請輸入電話"
            labelWidth="w-[23%]"
            marginLeft="16px"
          />
          <LabeledInput
            label="傳真號碼"
            value={formState.fax}
            onChange={(val) => updateField('fax', val)}
            placeholder="請輸入傳真"
            labelWidth="w-[23%]"
            marginLeft="16px"
          />
        </div>

        <div className="flex w-full mt-[20px]">
          <LabeledInput
            label="中文地址"
            value={formState.ch_address}
            onChange={(val) => updateField('ch_address', val)}
            placeholder="戶籍地址 (含路名、巷弄、號、樓層等)"
            labelWidth="w-[4.7%]"
          />
        </div>

        <div className="flex w-full mt-[20px]">
          <LabeledInput
            label="英文地址"
            value={formState.en_address}
            onChange={(val) => updateField('en_address', val)}
            placeholder="戶籍地址 (含路名、巷弄、號、樓層等)"
            labelWidth="w-[4.7%]"
          />
        </div>

        <div className="flex w-full mt-[20px] gap-[37px]">
          <LabeledInput
            label="聯絡人"
            value={formState.contact_person}
            onChange={(val) => updateField('contact_person', val)}
            placeholder="請輸入聯絡人"
            labelWidth="w-[10%]"
          />
          <LabeledInput
            label="公司信箱"
            value={formState.contact_email}
            onChange={(val) => updateField('contact_email', val)}
            placeholder="請輸入公司信箱"
            labelWidth="w-[10%]"
          />
        </div>

        <div className="flex items-center w-full mt-[20px]">
          <span className="font-semibold mr-2 whitespace-nowrap">📝其他</span>
          <div className="h-px bg-black flex-1 rounded-[10px]" />
        </div>

        <div className="mt-[12px] ml-[12px] flex justify-between">
          <div>
            <LogoUploader defaultPreviewUrl={previewLogoUrl} onFileChange={(file) => setLogoFile(file)} />
            <div className="mt-[20px] ml-3 flex">
              <p className="mr-[16px]">啟用狀態</p>
              <Switch checked={isEnable} onChange={setIsEnable} />
            </div>
          </div>
          <div className="mr-6 text-[#909090]">
            <div className="flex gap-4 ">
              <p>建立者:王大名</p>
              <p>建立日期:2024/04/30</p>
            </div>
            <div className="flex gap-4 mt-[8px]">
              <p>更新者:黃鐘可</p>
              <p>更新日期:2024/04/30</p>
            </div>
            <div className="flex gap-4 mt-[8px]">
              <p>刪除者:王小明</p>
              <p>刪除日期:2024/04/30</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
