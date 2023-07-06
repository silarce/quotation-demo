import { axi } from './_axiosCreator';

// type
import { TUserPasswordDto } from './dtoTypes';

export const apiPatchUserResetPassword = (id: string) => {
  const api = `/users/${id}/reset_password`;

  return axi
    .patch(api)
    .then(({ data }) => data as TUserPasswordDto)
    .catch((err) => Promise.reject(err));
};
