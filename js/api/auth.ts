import { axi } from "./_axiosCreator";




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
        return data
      })
      .catch((err) => err)
  }

// 登出
export const apiLogout = () => {
  const api = "/auth/logout"
  return axi.get(api)
    .then(({ data }) => data)
    .catch(err => err)
}


