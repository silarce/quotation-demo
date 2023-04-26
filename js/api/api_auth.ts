import { useState } from "react";
import { axi } from "./_axiosCreator";
import _ from "lodash"

// type
import {
  TuserDto, TuserDto_login,
} from "./dtoTypes";


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
        return data as TuserDto_login
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
  // 如果是admin帳號，不會有employee
  return axi.get(api)
    .then(({ data }) => data as TuserDto)
    .catch(err => Promise.reject(err))
}

export const useApiAuthMe = () => {
  const [userInfo, setUserInfo] = useState<TuserDto>()
  const updateUserInfo = async () => {
    const res = await apiAuthMe()
    if (res) {
      if (res.employee) {
        res.employee.jobs =
          _.sortBy(res.employee.jobs, (job) => ["grade", "department.createdAt"])
      }
      setUserInfo(res)
    }
    return res
  }
  return { userInfo, setUserInfo, updateUserInfo }
}

// 取得使用者權限
export const apiAuthPermissions = () => {
  const api = "/auth/permissions"
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


