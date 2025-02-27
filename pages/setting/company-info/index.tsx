import { ChangeEvent, useState, useEffect } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// global gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { setRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import InputSelBar_address from 'components/global/gear/inputAndSel/inputSelBar_address/inputSelBar_address';

// api
import {
  useCompanyInfo,
  TcompanyInfoDto,
  apiPatchCompanyInfo,
  apiUploadCompanyLogo,
  apiDelCompanyLogo,
  domain,
} from 'js/api/api_company-info';

// icon
import imgLogo2 from 'public/image/logo/LOGO_2.svg';

// css
import scss from './company-info.module.scss';

// fakeData type
import { Toption } from 'js/utils/options/countryAndDistrict';

export default function CompanyInfo() {
  // ===================================================
  // 公司資料
  const { data: companyInfo, setData: setCompanyInfo, update: updateCompanyInfo } = useCompanyInfo();
  const [infoBackup, setInfoBackup] = useState<TcompanyInfoDto>();

  // 更新資料
  const update = async () => {
    const res = await updateCompanyInfo();

    if (res) {
      setInfoBackup(_.cloneDeep(res));
    }
  };

  useEffect(() => {
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===================================================
  // 圖片檔案
  const [imageFile, setImageFile] = useState<File>();
  // 預覽圖片
  const [imgSrc, setImgSrc] = useState<string | null | undefined>('');

  useEffect(() => {
    const logoFileId = companyInfo?.logoFileId;

    if (!logoFileId) {
      return;
    }

    setImgSrc(`${domain}/file/download/${logoFileId}`);
  }, [companyInfo?.logoFileId]);

  // ===================================================
  const [editable, setEditable] = useState(false);
  // ===================================================
  // 地址
  const { county, district, address, logoFileId: logoLink } = companyInfo ?? {};

  // 選擇城市後清除地區
  const clearDistrict = () => {
    companyInfo!.district = '';
    setCompanyInfo({ ...companyInfo! });
  };

  const searchInputProps = {
    county,
    onChangeCounty: (option: Toption | null) => {
      if (!option) {
        return;
      }

      if (companyInfo?.county === option.value) {
        return;
      }

      companyInfo!.county = option.value;
      clearDistrict();
      setCompanyInfo({ ...companyInfo! });
    },
    district,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) {
        return;
      }

      if (companyInfo?.district === option.value) {
        return;
      }

      companyInfo!.district = option.value;
      setCompanyInfo({ ...companyInfo! });
    },
    address,
    onChangeAddress: (value: string) => {
      companyInfo!.address = value;
      setCompanyInfo({ ...companyInfo! });
    },
  };

  // ===================================================
  // 選擇圖片
  const selectImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    if (!e.target.files[0]) {
      return;
    }

    const file = e.target.files[0];
    setImageFile(file);
    // 預覽圖片
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target) {
        return;
      }

      setImgSrc(e.target.result as string);
    };
  };

  // 清除
  const resetLogo = () => {
    const logoFileId = companyInfo?.logoFileId;
    setImgSrc(`${domain}/file/download/${logoFileId}`);
    setImageFile(undefined);
  };

  const clearLogo = () => {
    setTimeout(() => {
      setImgSrc(undefined);
      setImageFile(undefined);
    }, 0);
  };

  // ------------------------------------------------------------------------
  // pageHeader
  const panalList01: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        setEditable(true);
      },
    },
  ];
  const panalList02: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: async () => {
        const body = {
          name: companyInfo?.name || '',
          phone: companyInfo?.phone || '',
          email: companyInfo?.email || '',
          county: companyInfo?.county || '',
          district: companyInfo?.district || '',
          address: companyInfo?.address || '',
          fax: companyInfo?.fax || '',
          taxId: companyInfo?.taxId || '',
        };
        setRootLoading(true);

        try {
          await apiPatchCompanyInfo(body);

          if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            await apiUploadCompanyLogo(formData);
          }

          if (!imgSrc) {
            apiDelCompanyLogo();
          }

          await update();
          myAlert.success({ title: '上傳成功' });
        } catch (err) {
          await update();
          myAlert.err({ title: err as string });
        } finally {
          setRootLoading(false);
          setEditable(false);
        }
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setEditable(false);
        setCompanyInfo(_.cloneDeep(infoBackup));
        resetLogo();
      },
    },
  ];

  // ------------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader02 tag="公司資料" panelList={editable ? panalList02 : panalList01} />
      <div className={scss.body}>
        {/* logo */}
        <div className={classNames(scss.logoBox)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={classNames(scss.logo)} src={imgSrc || imgLogo2.src} alt="logo" />
          {/* <Image className={classNames(scss.logo)}
            src={imgSrc || imgLogo2} alt="logo" width={300} height={300}
            priority={true}
          /> */}
          {editable && (
            <div className={classNames(scss.panel)}>
              <span>{'(上限10MB)'}</span>
              <label
                className={classNames(scss.btn, { [scss.red]: !!imgSrc })}
                htmlFor="uploadLogo"
                onClick={imgSrc ? clearLogo : undefined}
              >
                <span>{imgSrc ? '刪除logo' : '上傳公司logo'}</span>
                {!imgSrc && <input id="uploadLogo" type="file" onChange={selectImg} />}
              </label>
            </div>
          )}
        </div>
        {/* info */}
        <div className={scss.formContainer}>
          {dataIndex.map((key, index) => {
            const { label } = config[key];
            const stateValue = companyInfo?.[key] || '';

            const onChange = (value: string) => {
              companyInfo![key] = value;
              setCompanyInfo({ ...companyInfo! });
            };

            // editable
            let styleInput02 = `${scss.input02}`;

            if (editable) {
              styleInput02 = `${styleInput02} ${scss.editable}`;
            }

            return (
              <InputSel
                key={index}
                className={scss.inputSel}
                label={label}
                captionWidth="80px"
                gap="50px"
                padding="20px 0 14px 0"
                hrColor={(!editable && scss.colorBorder01) || undefined}
                disabled={!editable}
                inputProps={{
                  value: stateValue,
                  onChange: onChange,
                }}
              />
            );
          })}

          <InputSelBar_address
            className={`${scss.selectInput} ${(editable && scss.editable) ?? undefined}`}
            addressProps={searchInputProps}
            label="公司地址"
            captionWidth="80px"
            gap="50px"
            padding="20px 0 14px 0"
            disabled={!editable}
            hrColor={(!editable && scss.colorBorder01) || undefined}
          />
        </div>
      </div>
    </SubLayer>
  );
}
// ========================================================

type TapiCompanyInfoKey = keyof TcompanyInfoDto;
type TconfigKeys = Extract<TapiCompanyInfoKey, 'name' | 'phone' | 'fax' | 'email' | 'taxId'>;

type Tconfig = {
  [key in TconfigKeys]: {
    key: string;
    label: string;
  };
};

const config: Tconfig = {
  name: {
    key: 'name',
    label: '公司名稱',
  },
  phone: {
    key: 'phone',
    label: '公司電話',
  },
  fax: {
    key: 'fax',
    label: '公司傳真',
  },
  email: {
    key: 'email',
    label: '公司信箱',
  },
  taxId: {
    key: 'taxId',
    label: '公司統編',
  },
};

const dataIndex: (keyof Tconfig)[] = ['name', 'phone', 'fax', 'email', 'taxId'];
