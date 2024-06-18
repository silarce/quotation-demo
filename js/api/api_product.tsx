import { useState, useEffect, useMemo } from 'react';
import { axi } from './_axiosCreator';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// type
import type {
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

// const apiGetAssets = (path: string) => {
//   return `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/${path}`;
// };

export type {
  TdoorModelInfoDto,
  TpcgsPrams,
  TdoorGeneralSpecsDto,
  TpacParams,
  TdoorComponentListDto,
  TgenerateDoorProductBomDto_ComponentInfo,
  TgenerateDoorProductBomDto_DoorSpec,
  TgenerateDoorProductBomDto,
  TdoorBomDto_Component,
  TdoorProductBomDto,
  TdoorAccessoryDto,
  TgetBoxDParams,
  Thp,
};
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

  return {
    res,
    update,
    doorModelList,
    checkIsSpecialDoor,
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
      hp: Thp;
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

export const apiGetProdCalcDetailSpec = async (params: TpcdsPrams) => {
  const api = '/products/door/calc-detail-spec';

  return axi
    .get<{ slatCount: number }>(api, { params })
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
  const api = '/products/door/accessories';

  return axi
    .get<TdoorAccessoryDto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

type TgetBoxDParams = {
  modelName: string;
  rollerDiameter: number;
  sidePlateSizeB: number;
  hp: string;
  motorVendor: string;
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
