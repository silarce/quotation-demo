import { useMemo, useEffect } from 'react';
import _ from 'lodash';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { TuserDto, useApiAuthMe, apiAuthMe, apiGetLoginInfoBySessionId, persistTokens } from 'js/api/api_auth';
import { useApiErpFeaturesMe, TerpFeatureDto, apiErpFeaturesMe } from 'js/api/api_erpFeature';

interface Tglobal_userInfo {
  userInfo: TuserDto | undefined | null;
  userErpFeature: TerpFeatureDto[] | undefined | null;

  setUserInfo: (userInfo: TuserDto | undefined | null) => void;
  setErpFeature: (erpFeature: TerpFeatureDto[] | undefined | null) => void;
}

const instance_immer = immer<Tglobal_userInfo>((set) => {
  const setUserInfo: Tglobal_userInfo['setUserInfo'] = (userInfo) => {
    set((state) => {
      state.userInfo = userInfo;
    });
  };

  const setErpFeature: Tglobal_userInfo['setErpFeature'] = (erpFeature) => {
    set((state) => {
      state.userErpFeature = erpFeature;
    });
  };

  return {
    userInfo: undefined,
    userErpFeature: undefined,
    setUserInfo,
    setErpFeature,
  };
});

const useStore = create<Tglobal_userInfo>()(instance_immer);

// const useGlobal_userInfo = () => {
//   const { userInfo, userErpFeature, setUserInfo, setErpFeature } = useStore();

//   const { isAdmin, userGrade } = useMemo(() => {
//     const isAdmin = userInfo?.account === 'admin3';

//     let userGrade = 0;

//     if (userInfo && !userInfo.employee) {
//       userGrade = 16; // 代表admin // 實際上grade只到15
//     } else if (userInfo && userInfo.employee?.jobs.length) {
//       userGrade = _.sortBy(userInfo?.employee?.jobs, 'grade')?.reverse()[0]?.grade;
//     }

//     return {
//       isAdmin,
//       userGrade,
//     };
//   }, [userInfo]);

//   return {
//     userInfo,
//     userErpFeature,
//     setUserInfo,
//     setErpFeature,
//     //
//     isAdmin,
//     userGrade,
//   };
// };

const useGlobal_userInfo = () => {
  const { userInfo, userErpFeature, setUserInfo, setErpFeature } = useStore();

  const update = ({
    noAlert = true,
  }: {
    noAlert?: boolean;
  } = {}) => {
    return Promise.all([apiAuthMe(), apiErpFeaturesMe()])
      .then(([userInfo, userErpFeature]) => {
        setUserInfo(userInfo);
        setErpFeature(userErpFeature);

        return { userInfo, userErpFeature };
      })
      .then(async ({ userInfo, userErpFeature }) => {
        const sessionId = userInfo?.latestSessionId;

        if (!sessionId) {
          throw new Error('沒有拿到 sessionId');
        }

        // 以 sid 換取 JWT
        const auth = await apiGetLoginInfoBySessionId(sessionId);

        if (auth) {
          persistTokens(auth);
        } else {
          throw new Error('以 sessionId 取得 JWT 失敗');
        }

        return { userInfo, userErpFeature };
      })
      .catch((err) => {
        if (!noAlert) {
          myAlert.err({
            title: '取得使用者資料失敗',
          });
        }

        setUserInfo(null);
        setErpFeature(null);

        return null;
      });
  };

  const clear = () => {
    setUserInfo(undefined);
    setErpFeature(undefined);
  };

  const { isAdmin, userGrade } = useMemo(() => {
    const isAdmin = userInfo?.account === 'admin3' || userInfo?.account === 'admin';

    let userGrade = 0;

    if (isAdmin) {
      userGrade = 16; // 代表admin // 實際上grade只到15
    } else if (userInfo && userInfo.employee?.jobs.length) {
      userGrade = _.sortBy(userInfo.employee.jobs, 'grade').reverse()[0].grade;
    }

    return {
      isAdmin,
      userGrade,
    };
  }, [userInfo]);

  // useEffect(() => {
  //   update();
  // }, []);

  return {
    userInfo,
    userErpFeature,
    isAdmin,
    userGrade,
    update,
    clear,
  };
};

export { useGlobal_userInfo };
