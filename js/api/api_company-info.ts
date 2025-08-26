import { useState } from 'react';

import { axi } from './axiosCreator';

// type
import { TcompanyInfoDto, TupdateCompanyInfoDto } from './dtoTypes';

const domain = process.env.NEXT_PUBLIC_API_BASE_URL;

// =============================================
// 取得公司資訊
const apiCompanyInfo = () => {
  const api = '/company-info';

  return axi
    .get(api)
    .then(({ data }) => data as TcompanyInfoDto)
    .catch((err) => err);
};

export const useCompanyInfo = () => {
  const [data, setData] = useState<TcompanyInfoDto>();

  const update = async () => {
    const res = await apiCompanyInfo();

    if (res) {
      setData(res);

      return res;
    }
  };

  const { county = '', district = '', address = '' } = data || {};

  const wholeAddress = `${county}${district}${address}`;

  return { data, wholeAddress, setData, update } as const;
};

// =============================================
// 更新公司資訊

export const apiPatchCompanyInfo = (body: TupdateCompanyInfoDto) => {
  const api = '/company-info';

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject('公司資料更新失敗'));
};

// =============================================
// 上傳 LOGO
export const apiUploadCompanyLogo = (formData: FormData) => {
  const api = '/company-info/logo';
  const body = formData;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject('公司LOGO更新失敗'));
};

// 移除LOGO
export const apiDelCompanyLogo = () => {
  const api = '/company-info/logo';

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject('公司LOGO移除失敗'));
};

export type { TcompanyInfoDto, TupdateCompanyInfoDto };
export { domain };
