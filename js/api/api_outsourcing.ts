import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi } from './_axiosCreator';
import { AxiosError } from 'axios';

import { createUseInfinite } from './createUseInfinite';

import type {
  Tparams,
  TpageMetaDto,
  TpageResponse,
  ToutsourcingDto,
  ToutsourcingPaymentDto,
  TdeductionDto,
  ToutsourcingPaymentDetailDto,
  TcreateOutsourcingDto,
  TupdateOutsourcingDto,
  TupdateOutsourcingPaymentDto,
  TupdateOutsourcingPaymentDetailDto,
  TcreateOutsourcingPaymentDetailItemDto,
  TfileDto,
} from './dtoTypes';

export type {
  Tparams,
  TpageMetaDto,
  TpageResponse,
  ToutsourcingDto,
  ToutsourcingPaymentDto,
  TdeductionDto,
  ToutsourcingPaymentDetailDto,
  TcreateOutsourcingDto,
  TupdateOutsourcingDto,
  TupdateOutsourcingPaymentDto,
  TupdateOutsourcingPaymentDetailDto,
  TcreateOutsourcingPaymentDetailItemDto,
};

// /outsourcing
type TgetOutsourcing = TpageResponse<ToutsourcingDto>;

export const apiGetOutsourcing = async (params?: Tparams) => {
  const api = '/outsourcing';

  return axi
    .get<TgetOutsourcing>(api, { params })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const useGetOutsourcing = createUseInfinite<TgetOutsourcing>({
  apiClient: apiGetOutsourcing,
  errTitle: '取得外包廠商失敗',
});

export const apiGetOutsourcing_id = async (id: string) => {
  const api = `/outsourcing/${id}`;

  return axi
    .get<ToutsourcingDto>(api)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const useGetOutsourcing_id = (id?: string) => {
  const [res, setRes] = useState<ToutsourcingDto>();
  const [isLoading, setIsLoading] = useState(false);

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiGetOutsourcing_id(id);
      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({
        title: '取得外包廠商失敗',
        content: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: res,
    update,
    isLoading_outsourcing: isLoading,
  };
};

export const apiPostOutsourcing = async (
  body: TcreateOutsourcingDto,
  { callAlert = true }: { callAlert?: boolean } = {}
) => {
  const api = '/outsourcing';

  return axi
    .post(api, body)
    .then((res) => res.data)
    .catch((error) => {
      const err = error as AxiosError;

      callAlert &&
        myAlert.err({
          title: '新增外包廠商失敗',
          content: err.message,
        });

      return Promise.reject(err);
    });
};

export const apiPatchOutsourcing = async (
  id: string,
  body: TcreateOutsourcingDto,
  { callAlert = true }: { callAlert?: boolean } = {}
) => {
  const api = `/outsourcing/${id}`;

  return axi
    .patch(api, body)
    .then((res) => res.data)
    .catch((error) => {
      const err = error as AxiosError;

      callAlert &&
        myAlert.err({
          title: '更新外包廠商失敗',
          content: err.message,
        });

      return Promise.reject(err);
    });
};

//

export const apiGetOutsourcingPayment = async (params?: Tparams) => {
  const api = '/outsourcing-payment';

  params = {
    populate: ['outsourcing'],
    ...params,
  };

  return axi
    .get<TpageResponse<ToutsourcingPaymentDto>>(api, { params })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const useGetOutsourcingPayment = createUseInfinite<TpageResponse<ToutsourcingPaymentDto>>({
  apiClient: apiGetOutsourcingPayment,
  errTitle: '取得外包計價列表失敗',
});

export const apiGetOutsourcingPayment_id = async (id: string, params?: Tparams) => {
  const api = `/outsourcing-payment/${id}`;

  return axi
    .get<ToutsourcingPaymentDto>(api, { params })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const apiGetOutsourcingPaymentAttachments = async (id: string) => {
  const api = `/outsourcing-payment/${id}/attachments`;

  return axi
    .get<TfileDto[]>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetOutsourcingPayment_id = (id?: string, customerParams?: Tparams) => {
  const [res, setRes] = useState<ToutsourcingPaymentDto>();
  const [isLoading, setIsLoading] = useState(false);

  const params = {
    populate: ['outsourcing'],
    ...customerParams,
  };

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiGetOutsourcingPayment_id(id, params);
      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({
        title: '取得外包計價失敗',
        content: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: res,
    update,
    isLoading_outsourcingPayment: isLoading,
  };
};

export const apiGetOutsourcingPaymentDetail = async (id: string, params?: Tparams) => {
  const api = `/outsourcing-payment/${id}/detail`;

  return axi
    .get<TpageResponse<ToutsourcingPaymentDetailDto>>(api, { params })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const useGetOutsourcingPaymentDetail = (id?: string, params?: Tparams) => {
  const [res, setRes] = useState<TpageResponse<ToutsourcingPaymentDetailDto>>();
  const [isLoading, setIsLoading] = useState(false);

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiGetOutsourcingPaymentDetail(id, params);
      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({
        title: '取得外包計價明細失敗',
        content: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: res?.data,
    meta: res?.meta,
    update,
    isLoading_outsourcingPaymentDetail: isLoading,
  };
};

// 以 id 更新 OutsourcingPayment 外包計價單
export const apiPatchOutsourcingPayment = async (
  id: string,
  body: TupdateOutsourcingPaymentDto,
  { callAlert = true }: { callAlert?: boolean } = {}
) => {
  const api = `/outsourcing-payment/${id}`;

  return axi
    .patch(api, body)
    .then((res) => res.data)
    .catch((error) => {
      const err = error as AxiosError;

      callAlert &&
        myAlert.err({
          title: '更新外包計價單失敗',
          content: err.message,
        });

      return Promise.reject(err);
    });
};

export const useGetOutsourcingPayment_id_kit = (
  //
  id?: string,
  {
    customerParams,
    autoUpdate = true,
  }: {
    customerParams?: Tparams;
    autoUpdate?: boolean;
  } = {}
) => {
  const [res, setRes] = useState<ToutsourcingPaymentDto | null>();
  const [attachments, setAttachments] = useState<TfileDto[] | null>();

  const [isLoading, setIsLoading] = useState(false);

  const params = {
    populate: ['outsourcing'],
    ...customerParams,
  };

  const update = async () => {
    if (!id) {
      return;
    }

    await apiGetOutsourcingPayment_id(id, params)
      .then(async (outsourcingPayment) => {
        setRes(outsourcingPayment);
        const attachments = await apiGetOutsourcingPaymentAttachments(id);
        setAttachments(attachments);

        return {
          outsourcingPayment,
          attachments,
        };
      })
      .catch((err) => {
        setRes(null);
        setAttachments(null);

        myAlert.err({
          title: '取得外包計價失敗',
        });
        console.error(err);
      });
  };

  const patch = () => {};

  return {
    data: res,
    attachments,
    update,
    isLoading_outsourcingPayment: isLoading,
  };
};

// 送審
export const apiPatchOutsourcingPaymentSubmit = async (id: string) => {
  const api = `/outsourcing-payment/${id}/submit`;

  return axi
    .patch(api)
    .then((res) => res.data)
    .catch((error) => {
      const err = error as AxiosError;

      myAlert.err({
        title: '送審外包計價單失敗',
        content: err.message,
      });

      return Promise.reject(err);
    });
};

// 審核
export const apiPatchOutsourcingPaymentReview = async (id: string, body: { reviewResult: boolean }) => {
  const api = `/outsourcing-payment/${id}/review`;

  return axi
    .patch(api, body)
    .then((res) => res.data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({
        title: '審核外包計價單失敗',
        content: err.message,
      });

      return Promise.reject(err);
    });
};

// 取得外包計價單明細
export const apiGetOutsourcingPaymentDetail_id = async (id: string) => {
  const api = `/outsourcing-payment-detail/${id}`;

  const params = {
    populate: [
      //
      'engineeringContact',
      'installItems.deliveryStatus',
      'outsourcingPayment.outsourcing',
    ],
  };

  return axi
    .get<ToutsourcingPaymentDetailDto>(api, { params })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const useGetOutsourcingPaymentDetail_id = (id: string | undefined) => {
  const [res, setRes] = useState<ToutsourcingPaymentDetailDto>();
  const [isLoading, setIsLoading] = useState(false);

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiGetOutsourcingPaymentDetail_id(id);
      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({
        title: '取得外包計價明細失敗',
        content: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: res,
    update,
    isLoading_outsourcingPaymentDetail: isLoading,
  };
};

// 以 id 更新 OutsourcingPayment 外包計價單明細
export const apiPatchOutsourcingPaymentDetail = async (
  id: string,
  body: TupdateOutsourcingPaymentDetailDto,
  { callAlert = true }: { callAlert?: boolean } = {}
) => {
  const api = `/outsourcing-payment-detail/${id}`;

  return axi
    .patch(api, body)
    .then((res) => res.data)
    .catch((error) => {
      const err = error as AxiosError;

      callAlert &&
        myAlert.err({
          title: '更新外包計價明細失敗',
          content: err.message,
        });

      return Promise.reject(err);
    });
};
