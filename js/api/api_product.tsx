import { useState, useEffect, useMemo } from 'react';
import { axi } from './axiosCreator';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// type
import type {
  TdoorModel,
  // TdoorMaterialDto,
  TdoorModelInfoDto,
  // TdoorGeneralSpecsMotorBoxPropertyDto,
  // TdoorGeneralSpecsMotorBoxDto,
  // TdoorGeneralSpecsMotorDto,
  TdoorGeneralSpecsDto,
  // TdoorSlatDto,
  // TdoorBottomBarDto,
  // TdoorGuideRailDto,
  // TdoorSidePlateDto,
  // TdoorRollerDto,
  // TdoorMotorDto,
  // TdoorMotorAccessoriesDto,
  // TdoorHeadBoxDto,
  TdoorComponentListDto,
  TgenerateDoorProductBomDto_ComponentInfo,
  TgenerateDoorProductBomDto_DoorSpec,
  TgenerateDoorProductBomDto,
  TdoorBomDto_Component,
  TdoorProductBomDto,
  TdoorAccessoryDto,
} from './dtoTypes';

import { Toption } from 'js/utils/options/options';

// const apiGetAssets = (path: string) => {
//   return `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/${path}`;
// };

export type {
  TdoorModelInfoDto,
  TpcgsPrams,
  TdoorGeneralSpecsDto,
  TpacParams,
  TdoorComponentListDto,
  TpcdsPrams,
  TgenerateDoorProductBomDto_ComponentInfo,
  TgenerateDoorProductBomDto_DoorSpec,
  TgenerateDoorProductBomDto,
  TdoorBomDto_Component,
  TdoorProductBomDto,
  TdoorAccessoryDto,
  TgetBoxDParams,
  Thp,
  TgetBoxDParams_strict,
};
// =======================================================================
// 未來若路徑太多種，乾脆設string就好了
export type TassetPath = `${'http'}${string}` | `${'door-track' | 'head-box'}/${string}`;

export const createAssetUrl = (catalogue: 'door-track' | 'head-box', assetName: string) => {
  const domain = axi.defaults.baseURL;

  return `${domain}/products/assets/${catalogue}/${assetName}` as TassetPath;
};

export const apiGetAsset = async (path: TassetPath) => {
  const api = path.startsWith('http') ? path : `/products/assets/${path}`;

  return axi
    .get(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 因為html2canvas或其他類似功能的套件，在以url取得圖片時(例如 <img src="http://...">)
// 請求不會帶cookie而被401，所以需要另外取得圖片再送進PDF模板中
// 所以建立useGetAssetDict來取得圖片或其他asset
export function useGetAssetDict<ASSET = unknown>(
  pathDict: Record<string, TassetPath> = {},
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  } = {}
) {
  const [state_pathDict, setState_pathDict] = useState(pathDict);
  // diff的value並不會用到，只用到key
  const [state_diff, setState_diff] = useState<Record<string, string>>(pathDict);

  const [assetDict, setAssetDict] = useState<Record<string, ASSET>>({});

  const updatePath = (pathDict: Record<string, TassetPath>) => {
    const diff: Record<string, string> = {};

    Object.entries(pathDict).forEach(([key, path]) => {
      if (state_pathDict[key] !== path) {
        diff[key] = key;
        setState_pathDict((prev) => ({ ...prev, [key]: path }));
      }
    });

    setState_diff((prev) => ({ ...prev, ...diff }));
  };

  const update = async () => {
    const copy = { ...assetDict };

    for (const key in state_pathDict) {
      if (!state_diff[key]) {
        continue;
      }

      const path = state_pathDict[key];

      const asset = await apiGetAsset(path).catch(() => null);

      copy[key] = asset;
    }

    setAssetDict(copy);
    setState_diff({});
  };

  useEffect(() => {
    autoUpdate && update();
  }, [state_pathDict]);

  return { assetDict, updatePath, update };
}

// =======================================================================

export const apiGetAssets = async (path: string) => {
  const api = `/products/assets/door-track/${path}`;

  return axi
    .get(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiGetProdDoorModels = async () => {
  const api = '/products/door/models';

  return axi
    .get<TdoorModelInfoDto[]>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useApiGetProdDoorModels = () => {
  const [res, setRes] = useState<TdoorModelInfoDto[]>();

  const update = async () => {
    try {
      const newRes = await apiGetProdDoorModels();

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得門型列表失敗', content: err.message });

      return err;
    }
  };

  const doorModelList = useMemo(() => {
    if (!res) {
      return undefined;
    }

    const list: { [key: string]: TdoorModelInfoDto } = {};

    res.forEach((item) => {
      list[item.name] = item;
    });

    return list;
  }, [res]);

  const checkIsSpecialDoor = (doorModelName: string) => {
    if (!doorModelList) {
      myAlert.err({ title: '門型列表尚未取得' });

      return undefined;
    }

    if (doorModelName === 'W2') {
      return true;
    }

    const doorModel = doorModelList[doorModelName];

    if (!doorModel) {
      return true;
    }

    return false;
  };

  const options_doorModel: Toption[] = useMemo(() => {
    if (!res) {
      return [];
    }

    return res.map((item) => ({ label: item.name, value: item.name }));
  }, [res]);

  return {
    res,
    update,
    doorModelList,
    checkIsSpecialDoor,
    options_doorModel,
  };
};

// =======================================================================

type Thp = '1/4' | '1/3' | '1/2' | '3/4' | '1' | '1 1/2' | '2' | '3' | '5';

type TpcgsPrams = {
  modelName: TdoorModelInfoDto['name'];
  height: number;
  isAntiTyphoon: boolean;
} & (
  | {
      fullWidth: number;
      WG?: undefined;
      hp?: Thp; // 不送hp的話會用預設馬達的資料計算相關數值
    }
  | {
      fullWidth?: undefined;
      WG: number;
      hp?: Thp;
    }
);

export const apiGetProdCalcGeneralSpec = async (params: TpcgsPrams) => {
  const api = '/products/door/calc-general-spec';

  return axi
    .get<TdoorGeneralSpecsDto>(api, { params })
    .then((res) => {
      const { data } = res;

      const report = { res, params };

      if (
        !Number.isInteger(data.slatLength) ||
        !Number.isInteger(data.guideRailLength) ||
        !Number.isInteger(data.headBoxLength) ||
        !Number.isInteger(data.bearingHousingTotalLength) ||
        !Number.isInteger(data.bearingHousingSize)
      ) {
        const onBtnClick = async () => {
          try {
            const objJson = JSON.stringify(report);

            await navigator.clipboard.writeText(objJson);
          } catch (error) {
            myAlert.err({ title: '複製錯誤資訊失敗' });
          }
        };

        myAlert.err({
          title: '後端回應非預期的值',
          props: {
            okText: '關閉',
            maskClosable: false,
            content: <Foo onBtnClick={onBtnClick} />,
            closable: true,
          },
        });
      }

      return data;
    })
    .catch((err) => Promise.reject(err));
};

type TpcdsPrams = {
  modelName: TdoorModelInfoDto['name'];
  height: number;
  B: number;
};

export const apiGetProdCalcDetailSpec = async (params: TpcdsPrams, signal?: AbortSignal) => {
  const api = '/products/door/calc-detail-spec';

  return axi
    .get<{ slatCount: number }>(api, { params, signal })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// =======================================================================

type TpacParams = {
  modelName: TdoorModelInfoDto['name'];
  weight: number;
  isAntiTyphoon: boolean;
  rollerDiameter: number;
};

export const apiGetProdAvailableComponents = async (params: TpacParams) => {
  const api = '/products/door/available-components';

  return axi
    .get<TdoorComponentListDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// =======================================================================

export const apiPostProdGenerateDoorProductBom = (body: TgenerateDoorProductBomDto) => {
  const api = '/products/door/generate-door-product-bom';

  return axi
    .post<TdoorProductBomDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiGetProdAccessories = (params: { modelName: string }) => {
  // API 停用：依門型回傳寫死選配資料
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { lookup_doorAccessoryByModel } = require('config/product/lookup') as typeof import('config/product/lookup');
  const data = lookup_doorAccessoryByModel[params.modelName] ?? [];

  return Promise.resolve<TdoorAccessoryDto[]>(data);
};

export const useGetProdAccessories = (modelName: string) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TdoorAccessoryDto[]>();

  const update = async () => {
    try {
      setIsFetching(true);
      const res = await apiGetProdAccessories({ modelName });
      setRes(res);
    } catch (error) {
      setRes(undefined);
      myAlert.err({ title: '取得選配列表失敗' });
    } finally {
      setIsFetching(false);
    }
  };

  return {
    isFetching,
    data: res,
    update,
  };
};

type TgetBoxDParams = {
  modelName: string;
  rollerDiameter: number;
  sidePlateSizeB: number;
  hp: string;
  motorVendor: string; // 必須要送，但似乎任意字串都行
};

type TgetBoxDParams_strict = TgetBoxDParams & {
  modelName: TdoorModel;
};

export const apiGetboxD = (params: TgetBoxDParams) => {
  const api = '/products/door/calc-side-plate-size-d';

  return axi
    .get<{ sidePlateSizeD: number }>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// ========================================================================

import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import axios from 'axios';

const Foo = ({ onBtnClick }: { onBtnClick?: () => void }) => {
  return (
    <div>
      <p className="whitespace-pre-wrap text-left">
        {`
請依以下步驟操作
1. 點擊"複製錯誤訊息"按鈕
2. 回到電腦桌面，右鍵新增文字文件
3. 右鍵貼上並儲存
4. 請關閉這個提示，然後將整個畫面截圖
5. 將截圖與文字文件一起傳給開發人員
        `}
      </p>
      <p>感謝您的配合</p>
      <br />
      <MyButton_v2 onClick={onBtnClick} label="複製錯誤訊息" />
      <br />
      <br />
    </div>
  );
};
