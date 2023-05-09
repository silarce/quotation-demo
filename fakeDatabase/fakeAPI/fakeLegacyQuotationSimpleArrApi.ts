
import { fakeLegacyQuotationDataList } from "fakeDatabase/domestic/_fakeLegacyQuotation"
import { TclientProfileList, fakeClientProfileList } from "fakeDatabase/client/_fakeClients"


class Class_fakeApi_legacyProjectSimple {

  get = (
    param?: {
      filter?: {
        county?: string,
        clientName?: string,
        constructionName?: string
      }
    }
  ) => {
    const filter = param?.filter
    const arr = Object.values(fakeLegacyQuotationDataList)
      .map((item, index) => {

        const clientData = fakeClientProfileList[item.clientId]

        if (filter?.county) {
          if (item.basicInfo.constructionCounty !== filter.county) return
        }
        if (filter?.clientName) {
          if (!clientData.name.includes(filter.clientName)) return
        }
        if (filter?.constructionName) {
          if (!item.basicInfo.constructionName.includes(filter.constructionName)) return
        }

        return {
          ...item,
          clientData
        }
      })
    const arr2 = arr.flatMap((item) => (item ? [item] : [])); // 清除undefined
    return arr2
  }
}


const fakeApi_legacyProjectSimple = new Class_fakeApi_legacyProjectSimple()


export { Class_fakeApi_legacyProjectSimple, fakeApi_legacyProjectSimple }


