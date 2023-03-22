
import { fakeClientProfileList } from "fakeDatabase/client/_fakeClients"


class Class_client {

  get = () => {
    return fakeClientProfileList
  }

}




const fakeApi_client = new Class_client()













export {
  Class_client,
  fakeApi_client
}























