import { useMemo } from 'react';
import _ from 'lodash';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// api
import {
  TuserDto,
  //  apiLogout, useApiAuthMe, apiLogin
} from 'js/api/api_auth';
import {
  // useApiErpFeaturesMe,
  TerpFeatureDto,
} from 'js/api/api_erpFeature';

interface Tglobal_userInfo {
  userInfo: TuserDto | undefined;
  userErpFeature: TerpFeatureDto[] | undefined;

  setUserInfo: (userInfo: TuserDto | undefined) => void;
  setErpFeature: (erpFeature: TerpFeatureDto[] | undefined) => void;
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

const useGlobal_userInfo = () => {
  const { userInfo, userErpFeature, setUserInfo, setErpFeature } = useStore();

  const { isAdmin, userGrade } = useMemo(() => {
    const isAdmin = userInfo?.account === 'admin3';

    let userGrade = 0;

    if (userInfo && !userInfo.employee) {
      userGrade = 16; // 代表admin // 實際上grade只到15
    } else if (userInfo && userInfo.employee?.jobs.length) {
      userGrade = _.sortBy(userInfo?.employee?.jobs, 'grade')?.reverse()[0]?.grade;
    }

    return {
      isAdmin,
      userGrade,
    };
  }, [userInfo]);

  return {
    userInfo,
    userErpFeature,
    setUserInfo,
    setErpFeature,
    //
    isAdmin,
    userGrade,
  };
};

export { useGlobal_userInfo };
