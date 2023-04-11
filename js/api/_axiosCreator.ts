import axios from "axios"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"

const axi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
})



axi.interceptors.request.use(
  (config) => {
    // req攔截器
    return config
  },
  (err) => {
    // req錯誤攔截器
    return Promise.reject(err)
  }
)


axi.interceptors.response.use(
  (res) => {
    // res攔截器
    return res
  },
  (err) => {

    const url = err.config.url
    const ignore401 = ["/auth/login", "/auth/me"]

    if (err.response) {
      switch (err.response.status) {
        case 401:
          if (ignore401.includes(url)) break
          myAlert.warning(
            {
              title: "系統提醒", content: "您已在其他地方登入",
              props: {
                onOk: () => { window.location.reload() },
                onCancel: () => { window.location.reload() }
              }
            }
          )
          console.log("401，沒有權限")
          break
        case 404:
          console.log("404錯誤")
          break
        case 500:
          console.log("500錯誤")
          break
        default:
          console.log(err.message)
      }
    }
    if (!window.navigator.onLine) {
      alert("網路出了問題，請檢查網路後重新整理網頁");
      Promise.reject(err);
    }
    return Promise.reject(err)
  }
)




export { axi }
















