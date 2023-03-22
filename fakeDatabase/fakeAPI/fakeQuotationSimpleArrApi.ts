
import { TquotationList, fakeQuotationDataList } from "fakeDatabase/domestic/_fakeQuotation"
import { TclientProfileList, fakeClientProfileList } from "fakeDatabase/client/_fakeClients"


class Class_fakeApi_projectSimple {

  get = (
    param?: {
      filter?: {
        county?: string,
      }
    }
  ) => {
    const filter = param?.filter
    const arr = Object.values(fakeQuotationDataList)
      .map((item, index) => {

        if (filter?.county) {
          if (item.basicInfo.constructionCounty !== filter.county) return
        }
        return {
          ...item,
          clientData: fakeClientProfileList[item.clientId]
        }
      })
    const arr2 = arr.flatMap((item) => (item ? [item] : [])); // 清除undefined
    return arr2
  }
}


const fakeApi_projectSimple = new Class_fakeApi_projectSimple()


export { Class_fakeApi_projectSimple, fakeApi_projectSimple }


