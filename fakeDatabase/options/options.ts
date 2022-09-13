
interface Toption {
  value: string
  label: string
}


export const optionsCreator_doorType: () => Toption[] =
  () => [
    { value: "SJ-30287", label: "SJ-30287" },
    { value: "SJ-302", label: "SJ-302" },
    { value: "門型一", label: "門型一" },
    { value: "門型二", label: "門型二" },
    { value: "門型三", label: "門型三" },
  ]








export type { Toption }