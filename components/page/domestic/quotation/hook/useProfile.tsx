import {
  useState, useEffect,
  ChangeEvent
} from "react";

import { format } from 'date-fns'

// type

import { Tquotation, TquotProfile } from "fakeDatabase/domestic/quotation/fakeQuotationList"




// export default function useProfile(quotationData?: Tquotation) {
export default function useProfile({ quotationData, newQuotationId }:
  {
    quotationData?: Tquotation
    newQuotationId?: string
  }) {

  let profileOri: TquotProfile;

  if (quotationData) profileOri = quotationData.profile
  else profileOri = emptyProfile

  // const profileOri = quotationData ? quotationData.profile : emptyProfile
  const [profile, setProfile] = useState<TquotProfile>(JSON.parse(JSON.stringify(profileOri)))

  const onChangeCreator = (key: keyof TquotProfile) => {
    // return (e: ChangeEvent<HTMLInputElement>) => {
    return (value:string) => {
      // 避免使用者斷行
      value = value.replace(/[\n\r\t]/g, "")
      setProfile(profile => {
        profile[key] = value
        return { ...profile }
      })
    }
  }
  const setCreator = (key: keyof TquotProfile) => {
    return (value: string) => {
      setProfile(profile => {
        profile[key] = value
        return { ...profile }
      })
    }
  }

  const onChangeProjectName = onChangeCreator("projectName")
  const onChangeTrackState = onChangeCreator("trackState")
  const onChangeSchedule = onChangeCreator("schedule")
  const onChangeProjectAddress = onChangeCreator("projectAddress")

  const setClientState = setCreator("clientState")
  const setQuotationId = setCreator("quotationId")
  const setClientId = setCreator("clientId")
  const setClientName = setCreator("clientName")
  const setContactPerson = setCreator("contactPerson")
  const setContactPhone = setCreator("contactPhone")
  const setFax = setCreator("fax")


  // 來自父層useRouter的newQuotationId一開始是undefined
  // 所以要這樣處裡
  useEffect(() => {
    if (!quotationData)
      setQuotationId(newQuotationId || "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newQuotationId])


  return {
    profile, setProfile,
    onChangeProjectName, onChangeTrackState,
    onChangeSchedule, onChangeProjectAddress,
    setClientState, setQuotationId,
    setClientId, setClientName,
    setContactPerson, setContactPhone,
    setFax,
  }
}

type TuseProfile = ReturnType<typeof useProfile>

// ===============================================
const buildToday = () => {
  const today = new Date()
  today.setFullYear(today.getFullYear() - 1911)
  return format(today, "yyy-MM-dd")
}

const emptyProfile: TquotProfile = {
  quotationId: "",
  clientId: "",
  clientName: "",
  contactPerson: "",
  contactPhone: "",
  fax: "",
  clientState: "",
  ageing: "10",
  builtDate: buildToday(),
  projectName: "",
  trackState: "",
  schedule: "",
  projectAddress: "",
}

export type { TuseProfile }




