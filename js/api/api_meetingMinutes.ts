import { useState, useEffect } from 'react';

import { axi } from './_axiosCreator';
import { AxiosError } from 'axios';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import type {
  Tparams,
  TpageMetaDto,
  TpageResponse,
  TfileDto,
  TmeetingMinutesDto,
  Tpopulate_meetingMinutesDto,
  TcreateMeetingMinutesDto,
  TupdateMeetingMinutesDto,
} from './dtoTypes';

export type { Tparams, TpageMetaDto, TpageResponse, TfileDto, TmeetingMinutesDto, TcreateMeetingMinutesDto };

type TgetMeetingMinutes<Tpopulate extends Tpopulate_meetingMinutesDto = object> = TpageResponse<
  TmeetingMinutesDto<Tpopulate>
>;

export async function apiGetMeetingMinutes<Tpopulate extends Tpopulate_meetingMinutesDto = object>(params?: Tparams) {
  const api = '/meeting-minutes';

  return axi
    .get<TgetMeetingMinutes<Tpopulate>>(api, { params })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}

export function useGetMeetingMinutes<Tpopulate extends Tpopulate_meetingMinutesDto = object>(
  params?: Tparams,
  { showAlert = true }: { showAlert?: boolean } = {}
) {
  const [res, setRes] = useState<TgetMeetingMinutes<Tpopulate>>();
  const [isLoading, setIsLoading] = useState(false);

  const update = async () => {
    try {
      setIsLoading(true);
      const res = await apiGetMeetingMinutes<Tpopulate>(params);
      setRes(res);
    } catch (error) {
      const err = error as AxiosError;

      if (showAlert) {
        myAlert.err({ title: '取得會議紀錄列表失敗', content: err.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: res?.data,
    meta: res?.meta,
    isLoading,
    update,
  };
}

export const apiPostMeetingMinutes = async (
  body: TcreateMeetingMinutesDto,
  { showAlert = true }: { showAlert?: boolean } = {}
) => {
  const api = `/meeting-minutes`;

  return axi
    .post<TmeetingMinutesDto>(api, body)
    .then((res) => res.data)
    .catch((err) => {
      const error = err as AxiosError;

      if (showAlert) {
        myAlert.err({ title: '新增會議紀錄失敗', content: error.message });
      }

      return Promise.reject(err);
    });
};

export const apiPatchMeetingMinutes = async (
  id: string,
  body: TupdateMeetingMinutesDto,
  { showAlert = true }: { showAlert?: boolean } = {}
) => {
  const api = `/meeting-minutes/${id}`;

  return axi
    .patch<TmeetingMinutesDto>(api, body)
    .then((res) => res.data)
    .catch((err) => {
      const error = err as AxiosError;

      if (showAlert) {
        myAlert.err({ title: '更新會議紀錄失敗', content: error.message });
      }

      return Promise.reject(err);
    });
};

export const apiGetMeetingMinutes_id_attachments = async (id: string) => {
  const api = `/meeting-minutes/${id}/attachments`;

  return axi
    .get<TfileDto[]>(api)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const apiPostMeetingMinutes_id_attachments = async (id: string, formData: FormData) => {
  const api = `/meeting-minutes/${id}/attachments`;

  return axi
    .post<TfileDto>(api, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const apiDeleteMeetingMinutes_id_attachments = async (id: string, fileId: string) => {
  const api = `/meeting-minutes/${id}/attachments/${fileId}`;

  return axi
    .delete(api)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};
