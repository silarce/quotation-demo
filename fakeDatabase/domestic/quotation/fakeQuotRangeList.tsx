

interface Trange {
  content: string
}
type TrangeList = Trange[]

const rangeOptions: Trange[] = [
  { content: "電動捲門及大門使用三久捲門電動機及本公司規格配件。" },
  { content: "鐵件按裝前塗防銹漆壹次不包含外部油漆。" },
  { content: "電源及全部電氣配管配線不在估價之内(由電氣工程施工)。" },
  { content: "如預先理設螺絲時提供交由土木工程負責設。" },
  { content: "水泥補修及與捲門無關之工作或鐵件皆不在承作範圍之内。" },
  { content: "大門軌道下之RC基礎不在本工程範圍內。" },
  { content: "施工期間之電力及搭架料由買方(或業主)供應。" },
  { content: "負責捲門及大門之按裝及電力公司正式接電後之接線整。" },
  { content: "捲門上部以上木料(或天花板)裝修時皆不附門箱。" },
  { content: "不銹鋼捲門材料為SUS-304規格。" },
  { content: "價格隨材料行情可能有變動。超過有效日期限請來電查詢。" },
  { content: "報價範圍一報價範圍一報價範圍一報價範圍一" },
  { content: "報價範圍二報價範圍二報價範圍二報價範圍二報價範圍二" },
]

const fakeQuotRangeList: TrangeList = [
  { content: "電動捲門及大門使用三久捲門電動機及本公司規格配件。" },
  { content: "鐵件按裝前塗防銹漆壹次不包含外部油漆。" },
  { content: "電源及全部電氣配管配線不在估價之内(由電氣工程施工)。" },
  { content: "如預先理設螺絲時提供交由土木工程負責設。" },
  { content: "水泥補修及與捲門無關之工作或鐵件皆不在承作範圍之内。" },
  { content: "大門軌道下之RC基礎不在本工程範圍內。" },
  { content: "施工期間之電力及搭架料由買方(或業主)供應。" },
  { content: "負責捲門及大門之按裝及電力公司正式接電後之接線整。" },
  { content: "捲門上部以上木料(或天花板)裝修時皆不附門箱。" },
  { content: "不銹鋼捲門材料為SUS-304規格。" },
  { content: "價格隨材料行情可能有變動。超過有效日期限請來電查詢。" },
]

export type {
  Trange,
  TrangeList
}
export {
  rangeOptions,
  fakeQuotRangeList
}










