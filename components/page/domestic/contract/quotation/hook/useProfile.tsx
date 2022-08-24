import {
  useState,
  Dispatch, SetStateAction
} from "react";

import { format } from 'date-fns'




interface Tquotataion {
  quotationId: string

  clientId: string

  clientName: string
  contactPerson: string
  contactPhone: string
  fax: string

  clientState: string
  ageing: string //時效
  builtDate: string//報價日期
  projectName: string
  trackState: string//追蹤狀態
  schedule: string//工地進度
  projectAddress: string
}

interface TsetQuotation {
  setQuotationId: Dispatch<SetStateAction<string>>
  setClientId: Dispatch<SetStateAction<string>>

  setClientName: Dispatch<SetStateAction<string>>
  setContactPerson: Dispatch<SetStateAction<string>>
  setContactPhone: Dispatch<SetStateAction<string>>
  setFax: Dispatch<SetStateAction<string>>


  setClientState: Dispatch<SetStateAction<string>>
  setAgeing: Dispatch<SetStateAction<string>>
  setBuiltDate: Dispatch<SetStateAction<string>>
  setProjectName: Dispatch<SetStateAction<string>>
  setTrackState: Dispatch<SetStateAction<string>>
  setSchedule: Dispatch<SetStateAction<string>>
  setProjectAddress: Dispatch<SetStateAction<string>>
}



const emptyQuotation: Tquotataion = {
  quotationId: "",
  clientId: "",
  clientName: "",
  contactPerson: "",
  contactPhone: "",
  fax: "",
  clientState: "",
  ageing: "10",
  builtDate: format(new Date(), "yyyy-MM-dd"),
  projectName: "",
  trackState: "",
  schedule: "",
  projectAddress: "",
}




export default function useProfile(quotationData?: Tquotataion) {


  if (!quotationData) quotationData = emptyQuotation


  const [quotationId, setQuotationId]
    = useState(emptyQuotation.quotationId)
  const [clientId, setClientId]
    = useState(emptyQuotation.clientId)

  const [clientName, setClientName]
    = useState(emptyQuotation.clientName)
  const [contactPerson, setContactPerson]
    = useState(emptyQuotation.contactPerson)
  const [contactPhone, setContactPhone]
    = useState(emptyQuotation.contactPhone)
  const [fax, setFax]

    = useState(emptyQuotation.fax)
  const [clientState, setClientState]
    = useState(emptyQuotation.clientState)
  const [ageing, setAgeing]
    = useState(emptyQuotation.ageing) //時效
  const [builtDate, setBuiltDate]
    = useState(emptyQuotation.builtDate) //報價日期
  const [projectName, setProjectName]
    = useState(emptyQuotation.projectName)
  const [trackState, setTrackState]
    = useState(emptyQuotation.trackState) //追蹤狀態
  const [schedule, setSchedule]
    = useState(emptyQuotation.schedule) //工地進度
  const [projectAddress, setProjectAddress]
    = useState(emptyQuotation.projectAddress) //工地進度


  const quotation = {
    quotationId,
    clientId,
    clientName,
    contactPerson,
    contactPhone,
    fax,
    clientState,
    ageing,
    builtDate,
    projectName,
    trackState,
    schedule,
    projectAddress,
  }

  const setQuotation = {
    setQuotationId,
    setClientId,
    setClientName,
    setContactPerson,
    setContactPhone,
    setFax,
    setClientState,
    setAgeing,
    setBuiltDate,
    setProjectName,
    setTrackState,
    setSchedule,
    setProjectAddress,
  }


  return {
    quotation,
    setQuotation
  }
}

type TuseQuotation = {
  quotation: Tquotataion
  setQuotation: TsetQuotation
}

export type { TuseQuotation, Tquotataion, TsetQuotation }




