import { useState } from 'react';

import { axi } from './_axiosCreator';

import _ from 'lodash';

import { TfileDto } from './dtoTypes';

const apiGetFileDownload_id = (id: string) => {
  const api = `/file/download/${id}`;

  return axi
    .get(api)
    .then(({ data }) => data as string)
    .catch((err) => Promise.reject(err));
};

const createFileUrl = (fileId: string) => {
  const baseUrl = axi.defaults.baseURL;
  const api = `${baseUrl}/file/download/${fileId}`;

  return api;
};

export { apiGetFileDownload_id, createFileUrl };
