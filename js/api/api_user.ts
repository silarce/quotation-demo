import { axi } from "./_axiosCreator";

// type
import { TuserDto } from "./dtoTypes";





export const apiPatchUserResetPassword = (id: number) => {
  const api = `/users/${id}/reset_password`
  return axi.patch(api)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}













