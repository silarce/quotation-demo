import {
  useState, useEffect,
  ChangeEvent
} from "react";

import { format } from 'date-fns'

// type
import type { Tquotation, Tprofile } from "meta/fakeData/fakeQuotation";





// export default function useProfile(quotationData?: Tquotation) {
export default function useProfile({ quotationData, newQuotationId }:
  {
    quotationData?: Tquotation
    newQuotationId?: string | string[] | undefined
  }) {

  let profileOri: Tprofile;

  if (quotationData) profileOri = quotationData.profile
  else profileOri = emptyProfile

  // const profileOri = quotationData ? quotationData.profile : emptyProfile
  const [profile, setProfile] = useState<Tprofile>(JSON.parse(JSON.stringify(profileOri)))

  const onChangeCreator = (key: keyof Tprofile) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setProfile(profile => {
        profile[key] = value
        return { ...profile }
      })
    }
  }
  const setCreator = (key: keyof Tprofile) => {
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
    if (!quotationData && typeof newQuotationId === "string")
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

const emptyProfile: Tprofile = {
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




