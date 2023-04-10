import { axi } from "./_axiosCreator";

// type
import { TuserDto } from "./dtoTypes";


// 登入
export const apiLogin =
  (
    body: {
      "account": string
      "password": string
    }
  ) => {
    const api = "/auth/login"
    return axi.post(api, body)
      .then(({ data }) => {
        return data as TuserDto
      })
      .catch(err => Promise.reject(err))
  }

// 登出
export const apiLogout = () => {
  const api = "/auth/logout"
  return axi.get(api)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

// 取得使用者資料
export const apiAuthMe = () => {
  const api = "/auth/me"
  return axi.get(api)
    .then(({ data }) => data as TuserDto)
    .catch(err => Promise.reject(err))
}

/**  變更密碼 */
export const apiAuthPassword = (
  body: {
    oldPassword: string
    newPassword: string
  }
) => {
  const api = "/auth/password"

  return axi.patch(api, body)
    .then(({ data }) => data as TuserDto)
    .catch(err => Promise.reject(err))
}


