

import { Tproject, fakeProjectData } from "fakeDatabase/domestic/_fakeProject"
import { TclientProfile, fakeClienData } from "fakeDatabase/client/_fakeClients"




type TprojectSimpleGet = Tproject & {
  [key: string]: {
    clientData: TclientProfile
  }
}

class Class_fakeApi_projectSimple {

  get = () => {
    return Object.values(fakeProjectData).
      map((item) => {
        return {
          ...item,
          clientData: fakeClienData[item.clientId]
        }
      })
  }

}


const fakeApi_projectSimple = new Class_fakeApi_projectSimple()




export { Class_fakeApi_projectSimple, fakeApi_projectSimple }









