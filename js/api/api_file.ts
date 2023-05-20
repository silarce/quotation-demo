import { useState } from "react";

import { axi } from "./_axiosCreator";

import _ from "lodash"


import { TfileDto } from "./dtoTypes"







export const apiGetFileDownload_id = (id: string) => {
  const api = `/file/download/${id}`
  return axi.get(api)
    .then(({ data }) => data as string)
    .catch(err => Promise.reject(err))
}




