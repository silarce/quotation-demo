import { useState, useEffect, useMemo } from 'react';

import { notification } from 'antd';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi2 } from '../_axiosCreator';
import { AxiosError } from 'axios';

import type {
  //
  TreviewFlow,
  TgetReviewById,
  TaddReview,
} from './_schemas';

const subRoot = 'Review';

// ==============================================================================

// Review/GetFlow

// 基本上不會使用這個
// const apiGetFlow = (username: string) => {
//   const api = `${subRoot}/GetFlow`;
//   const params = {
//     username,
//   };

//   return axi2
//     .get<TreviewFlow[] | ''>(api, { params })
//     .then(({ data }) => data)
//     .catch((err: AxiosError) => {
//       return Promise.reject(err);
//     });
// };

// GetReviewFlow
const apiGetReviewFlow = (user_id: string) => {
  const api = `${subRoot}/GetReviewFlow`;
  const params = {
    user_id,
  };

  return axi2
    .get<TreviewFlow[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      return Promise.reject(err);
    });
};

const apiGetReviewById = (document_uuid: string) => {
  const api = `${subRoot}/GetReviewById`;
  const params = {
    document_uuid,
  };

  return axi2
    .get<TgetReviewById[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      return Promise.reject(err);
    });
};

const apiAddReview = (body: TaddReview) => {
  const api = `${subRoot}/AddReview`;

  return (
    axi2
      // 回應id
      .post<string>(api, body)
      .then(() => {
        myAlert.success({ title: '送審完成' });
      })
      .catch((err) => {
        myAlert.err({ title: '新增審核失敗', content: err.message });

        return Promise.reject(err);
      })
  );
};

// 抽單
const apiGetReviewBack = (document_uuid: string) => {
  const api = '/Review/GetReviewBack';

  const body = {
    document_uuid,
  };

  return axi2
    .post(api, body)
    .then(() => {
      myAlert.success({ title: '抽單完成' });
    })
    .catch((err) => {
      myAlert.err({ title: '抽單失敗', content: err.message });
    });
};

// /Review/GetReviewHistory
const apiGetReviewHistory = (id: string) => {
  const api = '/Review/GetReviewHistory';

  const params = {
    id,
  };

  return axi2
    .get<unknown>(api, { params })
    .then(() => {})
    .catch((err) => {
      return Promise.reject(err);
    });
};

// ==============================================================================

// MARK:useGetFlow
const useGetFlow = (
  // username: string | undefined,
  user_id: string | undefined,
  {
    filter,
    autoUpdate = true,
  }: {
    filter?: {
      name?: string | undefined;
    };
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [raw, setRaw] = useState<TreviewFlow[]>();

  const update = async () => {
    if (!user_id) {
      setRaw(undefined);

      return;
    }

    setIsFetching(true);
    await apiGetReviewFlow(user_id)
      .then((res) => {
        res = res || [];

        if (filter?.name) {
          res = res.filter((item) => item.name === filter.name);
        }

        setRaw(res);
      })
      .catch((err) => {
        setRaw(undefined);
        notification.open({
          message: '取得審核流程失敗',
          description: err.message,
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const raw_filtered = useMemo(() => {
    if (!filter) {
      return raw;
    }

    const filtered = raw?.filter((item) => {
      let pass = true;

      filter?.name && !item.name.includes(filter.name) && (pass = false);

      return pass;
    });

    return filtered;
  }, [raw, ...Object.values(filter ?? {})]);

  useEffect(() => {
    autoUpdate && update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  return {
    raw,
    raw_filtered,
    setRaw,
    update,
    isFetching,
  };
};

// MARK:useGetReviewById
const useGetReviewById = (
  document_uuid: string | undefined,
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);
  const [raw, setRaw] = useState<TgetReviewById[]>();

  const update = async () => {
    if (!document_uuid) {
      setRaw(undefined);

      return;
    }

    setIsFetching(true);
    await apiGetReviewById(document_uuid)
      .then((res) => {
        setRaw(res);
      })
      .catch((err) => {
        setRaw(undefined);
        notification.open({
          message: '取得審核流程失敗',
          description: err.message,
        });
      })
      .finally(() => {
        setIsFetching(false);
        setIsFirstLoaded(true);
      });
  };

  useEffect(() => {
    autoUpdate && update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document_uuid]);

  return {
    raw,
    setRaw,
    update,
    isFetching,
    isFirstLoaded,
  };
};

// MARK:useGetReviewHistory
const useGetReviewHistory = (
  id: string | undefined,
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [raw, setRaw] = useState<unknown>();

  const update = async () => {
    if (!id) {
      return;
    }

    setIsFetching(true);
    await apiGetReviewHistory(id)
      .then((res) => {
        setRaw(res);
      })
      .catch((err) => {
        setRaw(undefined);
        notification.open({
          message: '取得審核流程失敗',
          description: err.message,
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    autoUpdate && update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    raw,
    setRaw,
    update,
    isFetching,
  };
};

// ==============================================================================

export {
  //
  useGetFlow,
  useGetReviewById,
  apiAddReview,
  apiGetReviewBack,
  useGetReviewHistory,
};
export type { TreviewFlow, TgetReviewById, TaddReview };
