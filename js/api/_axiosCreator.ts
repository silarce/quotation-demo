import axios from "axios"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"


const axi = axios.create({
  baseURL: "https://sanjeou-erp-be.caprover.credot-web.com/",
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
    const ignore401 = ["/auth/login"]

    if (err.response) {
      switch (err.response.status) {
        case 401:
          if (ignore401.includes(url)) break
          myAlert.err({
            title: "401錯誤、沒有權限",
            content: "請重新登入"
          })
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
















