import { useEffect, useState } from "react"

import { Toption } from "./options"

export type { Toption }




export const optionsCreator_county: () => Toption[] =
  () => [
    { value: "基隆市", label: "基隆市" },
    { value: "新北市", label: "新北市" },
    { value: "臺北市", label: "臺北市" },
    { value: "桃園市", label: "桃園市" },
    { value: "新竹縣", label: "新竹縣" },
    { value: "新竹市", label: "新竹市" },
    { value: "苗栗縣", label: "苗栗縣" },
    { value: "臺中市", label: "臺中市" },
    { value: "彰化縣", label: "彰化縣" },
    { value: "南投縣", label: "南投縣" },
    { value: "雲林縣", label: "雲林縣" },
    { value: "嘉義縣", label: "嘉義縣" },
    { value: "嘉義市", label: "嘉義市" },
    { value: "臺南市", label: "臺南市" },
    { value: "高雄市", label: "高雄市" },
    { value: "屏東縣", label: "屏東縣" },
    { value: "宜蘭縣", label: "宜蘭縣" },
    { value: "花蓮縣", label: "花蓮縣" },
    { value: "臺東縣", label: "臺東縣" },
    { value: "澎湖縣", label: "澎湖縣" },
    { value: "金門縣", label: "金門縣" },
    { value: "連江縣", label: "連江縣" },
  ]

// 


// 基隆市
export const optionsCreator_districtC: () => Toption[] =
  () => [
    { value: "仁愛區", label: "仁愛區" },
    { value: "中正區", label: "中正區" },
    { value: "信義區", label: "信義區" },
    { value: "中山區", label: "中山區" },
    { value: "安樂區", label: "安樂區" },
    { value: "七堵區", label: "七堵區" },
    { value: "暖暖區", label: "暖暖區" },
  ]

// 新北市
export const optionsCreator_districtF: () => Toption[] =
  () => [
    { value: "板橋區", label: "板橋區" },
    { value: "中和區", label: "中和區" },
    { value: "新莊區", label: "新莊區" },
    { value: "土城區", label: "土城區" },
    { value: "汐止區", label: "汐止區" },
    { value: "鶯歌區", label: "鶯歌區" },
    { value: "淡水區", label: "淡水區" },
    { value: "五股區", label: "五股區" },
    { value: "林口區", label: "林口區" },
    { value: "深坑區", label: "深坑區" },
    { value: "坪林區", label: "坪林區" },
    { value: "石門區", label: "石門區" },
    { value: "萬里區", label: "萬里區" },
    { value: "雙溪區", label: "雙溪區" },
    { value: "烏來區", label: "烏來區" },
    { value: "三重區", label: "三重區" },
    { value: "永和區", label: "永和區" },
    { value: "新店區", label: "新店區" },
    { value: "蘆洲區", label: "蘆洲區" },
    { value: "樹林區", label: "樹林區" },
    { value: "三峽區", label: "三峽區" },
    { value: "瑞芳區", label: "瑞芳區" },
    { value: "泰山區", label: "泰山區" },
    { value: "八里區", label: "八里區" },
    { value: "石碇區", label: "石碇區" },
    { value: "三芝區", label: "三芝區" },
    { value: "金山區", label: "金山區" },
    { value: "平溪區", label: "平溪區" },
    { value: "貢寮區", label: "貢寮區" },
  ]

// 臺北市
export const optionsCreator_districtA: () => Toption[] =
  () => [
    { value: "中正區", label: "中正區" },
    { value: "萬華區", label: "萬華區" },
    { value: "大同區", label: "大同區" },
    { value: "中山區", label: "中山區" },
    { value: "松山區", label: "松山區" },
    { value: "大安區", label: "大安區" },
    { value: "信義區", label: "信義區" },
    { value: "內湖區", label: "內湖區" },
    { value: "南港區", label: "南港區" },
    { value: "士林區", label: "士林區" },
    { value: "北投區", label: "北投區" },
    { value: "文山區", label: "文山區" },
  ]

// 桃園市
export const optionsCreator_districtH: () => Toption[] =
  () => [
    { value: "中壢區", label: "中壢區" },
    { value: "平鎮區", label: "平鎮區" },
    { value: "龍潭區", label: "龍潭區" },
    { value: "楊梅區", label: "楊梅區" },
    { value: "新屋區", label: "新屋區" },
    { value: "觀音區", label: "觀音區" },
    { value: "桃園區", label: "桃園區" },
    { value: "龜山區", label: "龜山區" },
    { value: "八德區", label: "八德區" },
    { value: "大溪區", label: "大溪區" },
    { value: "復興區", label: "復興區" },
    { value: "大園區", label: "大園區" },
    { value: "蘆竹區", label: "蘆竹區" },
  ]

// 新竹縣
export const optionsCreator_districtJ: () => Toption[] =
  () => [
    { value: "竹北市", label: "竹北市" },
    { value: "湖口鄉", label: "湖口鄉" },
    { value: "新豐鄉", label: "新豐鄉" },
    { value: "新埔鎮", label: "新埔鎮" },
    { value: "關西鎮", label: "關西鎮" },
    { value: "芎林鄉", label: "芎林鄉" },
    { value: "寶山鄉", label: "寶山鄉" },
    { value: "竹東鎮", label: "竹東鎮" },
    { value: "五峰鄉", label: "五峰鄉" },
    { value: "橫山鄉", label: "橫山鄉" },
    { value: "尖石鄉", label: "尖石鄉" },
    { value: "北埔鄉", label: "北埔鄉" },
    { value: "峨眉鄉", label: "峨眉鄉" },
  ]

// 新竹市
export const optionsCreator_districtO: () => Toption[] =
  () => [
    { value: "東區", label: "東區" },
    { value: "北區", label: "北區" },
    { value: "香山區", label: "香山區" },
  ]

// 苗栗縣
export const optionsCreator_districtK: () => Toption[] =
  () => [
    { value: "苗栗市", label: "苗栗市" },
    { value: "苑裡鎮", label: "苑裡鎮" },
    { value: "通霄鎮", label: "通霄鎮" },
    { value: "竹南鎮", label: "竹南鎮" },
    { value: "頭份市", label: "頭份市" },
    { value: "後龍鎮", label: "後龍鎮" },
    { value: "卓蘭鎮", label: "卓蘭鎮" },
    { value: "大湖鄉", label: "大湖鄉" },
    { value: "公館鄉", label: "公館鄉" },
    { value: "銅鑼鄉", label: "銅鑼鄉" },
    { value: "南庄鄉", label: "南庄鄉" },
    { value: "頭屋鄉", label: "頭屋鄉" },
    { value: "三義鄉", label: "三義鄉" },
    { value: "西湖鄉", label: "西湖鄉" },
    { value: "造橋鄉", label: "造橋鄉" },
    { value: "三灣鄉", label: "三灣鄉" },
    { value: "獅潭鄉", label: "獅潭鄉" },
    { value: "泰安鄉", label: "泰安鄉" },
  ]

// 臺中市
export const optionsCreator_districtB: () => Toption[] =
  () => [
    { value: "中區", label: "中區" },
    { value: "東區", label: "東區" },
    { value: "西區", label: "西區" },
    { value: "南區", label: "南區" },
    { value: "北區", label: "北區" },
    { value: "西屯區", label: "西屯區" },
    { value: "南屯區", label: "南屯區" },
    { value: "北屯區", label: "北屯區" },
    { value: "豐原區", label: "豐原區" },
    { value: "大里區", label: "大里區" },
    { value: "太平區", label: "太平區" },
    { value: "清水區", label: "清水區" },
    { value: "沙鹿區", label: "沙鹿區" },
    { value: "大甲區", label: "大甲區" },
    { value: "東勢區", label: "東勢區" },
    { value: "梧棲區", label: "梧棲區" },
    { value: "烏日區", label: "烏日區" },
    { value: "神岡區", label: "神岡區" },
    { value: "大肚區", label: "大肚區" },
    { value: "大雅區", label: "大雅區" },
    { value: "后里區", label: "后里區" },
    { value: "霧峰區", label: "霧峰區" },
    { value: "潭子區", label: "潭子區" },
    { value: "龍井區", label: "龍井區" },
    { value: "外埔區", label: "外埔區" },
    { value: "和平區", label: "和平區" },
    { value: "石岡區", label: "石岡區" },
    { value: "大安區", label: "大安區" },
    { value: "新社區", label: "新社區" },
  ]

// 彰化縣
export const optionsCreator_districtN: () => Toption[] =
  () => [
    { value: "彰化市", label: "彰化市" },
    { value: "員林巿", label: "員林巿" },
    { value: "鹿港鎮", label: "鹿港鎮" },
    { value: "和美鎮", label: "和美鎮" },
    { value: "北斗鎮", label: "北斗鎮" },
    { value: "溪湖鎮", label: "溪湖鎮" },
    { value: "田中鎮", label: "田中鎮" },
    { value: "二林鎮", label: "二林鎮" },
    { value: "線西鄉", label: "線西鄉" },
    { value: "伸港鄉", label: "伸港鄉" },
    { value: "福興鄉", label: "福興鄉" },
    { value: "秀水鄉", label: "秀水鄉" },
    { value: "花壇鄉", label: "花壇鄉" },
    { value: "芬園鄉", label: "芬園鄉" },
    { value: "大村鄉", label: "大村鄉" },
    { value: "埔鹽鄉", label: "埔鹽鄉" },
    { value: "埔心鄉", label: "埔心鄉" },
    { value: "永靖鄉", label: "永靖鄉" },
    { value: "社頭鄉", label: "社頭鄉" },
    { value: "二水鄉", label: "二水鄉" },
    { value: "田尾鄉", label: "田尾鄉" },
    { value: "埤頭鄉", label: "埤頭鄉" },
    { value: "芳苑鄉", label: "芳苑鄉" },
    { value: "大城鄉", label: "大城鄉" },
    { value: "竹塘鄉", label: "竹塘鄉" },
    { value: "溪州鄉", label: "溪州鄉" },
  ]

// 南投縣
export const optionsCreator_districtM: () => Toption[] =
  () => [
    { value: "南投市", label: "南投市" },
    { value: "埔里鎮", label: "埔里鎮" },
    { value: "草屯鎮", label: "草屯鎮" },
    { value: "集集鎮", label: "集集鎮" },
    { value: "竹山鎮", label: "竹山鎮" },
    { value: "鹿谷鄉", label: "鹿谷鄉" },
    { value: "魚池鄉", label: "魚池鄉" },
    { value: "中寮鄉", label: "中寮鄉" },
    { value: "名間鄉", label: "名間鄉" },
    { value: "國姓鄉", label: "國姓鄉" },
    { value: "水里鄉", label: "水里鄉" },
    { value: "仁愛鄉", label: "仁愛鄉" },
    { value: "信義鄉", label: "信義鄉" },
  ]

// 雲林縣
export const optionsCreator_districtP: () => Toption[] =
  () => [
    { value: "麥寮鄉", label: "麥寮鄉" },
    { value: "崙背鄉", label: "崙背鄉" },
    { value: "二崙鄉", label: "二崙鄉" },
    { value: "西螺鎮", label: "西螺鎮" },
    { value: "莿桐鄉", label: "莿桐鄉" },
    { value: "林內鄉", label: "林內鄉" },
    { value: "臺西鄉", label: "臺西鄉" },
    { value: "東勢鄉", label: "東勢鄉" },
    { value: "褒忠鄉", label: "褒忠鄉" },
    { value: "元長鄉", label: "元長鄉" },
    { value: "土庫鎮", label: "土庫鎮" },
    { value: "大埤鄉", label: "大埤鄉" },
    { value: "虎尾鎮", label: "虎尾鎮" },
    { value: "斗六市", label: "斗六市" },
    { value: "斗南鎮", label: "斗南鎮" },
    { value: "古坑鄉", label: "古坑鄉" },
    { value: "四湖鄉", label: "四湖鄉" },
    { value: "口湖鄉", label: "口湖鄉" },
    { value: "水林鄉", label: "水林鄉" },
    { value: "北港鎮", label: "北港鎮" },
  ]

// 嘉義縣
export const optionsCreator_districtQ: () => Toption[] =
  () => [
    { value: "太保市", label: "太保市" },
    { value: "朴子市", label: "朴子市" },
    { value: "布袋鎮", label: "布袋鎮" },
    { value: "大林鎮", label: "大林鎮" },
    { value: "民雄鄉", label: "民雄鄉" },
    { value: "溪口鄉", label: "溪口鄉" },
    { value: "新港鄉", label: "新港鄉" },
    { value: "六腳鄉", label: "六腳鄉" },
    { value: "東石鄉", label: "東石鄉" },
    { value: "義竹鄉", label: "義竹鄉" },
    { value: "鹿草鄉", label: "鹿草鄉" },
    { value: "水上鄉", label: "水上鄉" },
    { value: "中埔鄉", label: "中埔鄉" },
    { value: "竹崎鄉", label: "竹崎鄉" },
    { value: "梅山鄉", label: "梅山鄉" },
    { value: "番路鄉", label: "番路鄉" },
    { value: "大埔鄉", label: "大埔鄉" },
    { value: "阿里山鄉", label: "阿里山鄉" },
  ]

// 嘉義市
export const optionsCreator_districI: () => Toption[] =
  () => [
    { value: "東區", label: "東區" },
    { value: "西區", label: "西區" },
  ]

// 臺南市
export const optionsCreator_districtD: () => Toption[] =
  () => [
    { value: "新營", label: "新營" },
    { value: "鹽水", label: "鹽水" },
    { value: "白河", label: "白河" },
    { value: "柳營", label: "柳營" },
    { value: "後壁", label: "後壁" },
    { value: "東山", label: "東山" },
    { value: "麻豆", label: "麻豆" },
    { value: "下營", label: "下營" },
    { value: "六甲", label: "六甲" },
    { value: "官田", label: "官田" },
    { value: "大內", label: "大內" },
    { value: "佳里", label: "佳里" },
    { value: "學甲", label: "學甲" },
    { value: "西港", label: "西港" },
    { value: "七股", label: "七股" },
    { value: "將軍", label: "將軍" },
    { value: "北門", label: "北門" },
    { value: "新化", label: "新化" },
    { value: "新市", label: "新市" },
    { value: "善化", label: "善化" },
    { value: "安定", label: "安定" },
    { value: "山上", label: "山上" },
    { value: "玉井", label: "玉井" },
    { value: "楠西", label: "楠西" },
    { value: "南化", label: "南化" },
    { value: "左鎮", label: "左鎮" },
    { value: "仁德", label: "仁德" },
    { value: "歸仁", label: "歸仁" },
    { value: "關廟", label: "關廟" },
    { value: "龍崎", label: "龍崎" },
    { value: "永康", label: "永康" },
    { value: "東區", label: "東區" },
    { value: "南區", label: "南區" },
    { value: "中西區", label: "中西區" },
    { value: "北區", label: "北區" },
    { value: "安南", label: "安南" },
    { value: "安平", label: "安平" },
  ]

// 高雄市
export const optionsCreator_districtE: () => Toption[] =
  () => [
    { value: "鹽埕區", label: "鹽埕區" },
    { value: "鼓山區", label: "鼓山區" },
    { value: "左營區", label: "左營區" },
    { value: "楠梓區", label: "楠梓區" },
    { value: "三民區", label: "三民區" },
    { value: "新興區", label: "新興區" },
    { value: "前金區", label: "前金區" },
    { value: "苓雅區", label: "苓雅區" },
    { value: "前鎮區", label: "前鎮區" },
    { value: "旗津區", label: "旗津區" },
    { value: "小港區", label: "小港區" },
    { value: "鳳山區", label: "鳳山區" },
    { value: "林園區", label: "林園區" },
    { value: "大寮區", label: "大寮區" },
    { value: "大樹區", label: "大樹區" },
    { value: "大社區", label: "大社區" },
    { value: "仁武區", label: "仁武區" },
    { value: "鳥松區", label: "鳥松區" },
    { value: "岡山區", label: "岡山區" },
    { value: "橋頭區", label: "橋頭區" },
    { value: "燕巢區", label: "燕巢區" },
    { value: "阿蓮區", label: "阿蓮區" },
    { value: "路竹區", label: "路竹區" },
    { value: "湖內區", label: "湖內區" },
    { value: "茄萣區", label: "茄萣區" },
    { value: "梓官區", label: "梓官區" },
    { value: "旗山區", label: "旗山區" },
    { value: "美濃區", label: "美濃區" },
    { value: "六龜區", label: "六龜區" },
    { value: "甲仙區", label: "甲仙區" },
    { value: "杉林區", label: "杉林區" },
    { value: "內門區", label: "內門區" },
    { value: "茂林區", label: "茂林區" },
    { value: "桃源區", label: "桃源區" },
    { value: "那瑪夏區", label: "那瑪夏區" },
    { value: "田寮區", label: "田寮區" },
    { value: "永安區", label: "永安區" },
    { value: "彌陀區", label: "彌陀區" },
  ]

// 屏東縣
export const optionsCreator_districtT: () => Toption[] =
  () => [
    { value: "屏東市", label: "屏東市" },
    { value: "潮州鎮", label: "潮州鎮" },
    { value: "東港鎮", label: "東港鎮" },
    { value: "恆春鎮", label: "恆春鎮" },
    { value: "萬丹鄉", label: "萬丹鄉" },
    { value: "長治鄉", label: "長治鄉" },
    { value: "麟洛鄉", label: "麟洛鄉" },
    { value: "九如鄉", label: "九如鄉" },
    { value: "里港鄉", label: "里港鄉" },
    { value: "鹽埔鄉", label: "鹽埔鄉" },
    { value: "高樹鄉", label: "高樹鄉" },
    { value: "萬巒鄉", label: "萬巒鄉" },
    { value: "內埔鄉", label: "內埔鄉" },
    { value: "竹田鄉", label: "竹田鄉" },
    { value: "新埤鄉", label: "新埤鄉" },
    { value: "枋寮鄉", label: "枋寮鄉" },
    { value: "新園鄉", label: "新園鄉" },
    { value: "崁頂鄉", label: "崁頂鄉" },
    { value: "林邊鄉", label: "林邊鄉" },
    { value: "南州鄉", label: "南州鄉" },
    { value: "佳冬鄉", label: "佳冬鄉" },
    { value: "琉球鄉", label: "琉球鄉" },
    { value: "車城鄉", label: "車城鄉" },
    { value: "滿州鄉", label: "滿州鄉" },
    { value: "枋山鄉", label: "枋山鄉" },
    { value: "三地門鄉", label: "三地門鄉" },
    { value: "霧臺鄉", label: "霧臺鄉" },
    { value: "瑪家鄉", label: "瑪家鄉" },
    { value: "泰武鄉", label: "泰武鄉" },
    { value: "來義鄉", label: "來義鄉" },
    { value: "春日鄉", label: "春日鄉" },
    { value: "獅子鄉", label: "獅子鄉" },
    { value: "牡丹鄉", label: "牡丹鄉" },
  ]

// 宜蘭縣
export const optionsCreator_districtG: () => Toption[] =
  () => [
    { value: "頭城鎮", label: "頭城鎮" },
    { value: "礁溪鄉", label: "礁溪鄉" },
    { value: "員山鄉", label: "員山鄉" },
    { value: "宜蘭市", label: "宜蘭市" },
    { value: "壯圍鄉", label: "壯圍鄉" },
    { value: "大同鄉", label: "大同鄉" },
    { value: "三星鄉", label: "三星鄉" },
    { value: "羅東鎮", label: "羅東鎮" },
    { value: "五結鄉", label: "五結鄉" },
    { value: "冬山鄉", label: "冬山鄉" },
    { value: "蘇澳鎮", label: "蘇澳鎮" },
    { value: "南澳鄉", label: "南澳鄉" },
  ]

// 花蓮縣
export const optionsCreator_districtU: () => Toption[] =
  () => [
    { value: "花蓮市", label: "花蓮市" },
    { value: "鳳林鎮", label: "鳳林鎮" },
    { value: "玉里鎮", label: "玉里鎮" },
    { value: "新城鄉", label: "新城鄉" },
    { value: "吉安鄉", label: "吉安鄉" },
    { value: "壽豐鄉", label: "壽豐鄉" },
    { value: "光復鄉", label: "光復鄉" },
    { value: "豐濱鄉", label: "豐濱鄉" },
    { value: "瑞穗鄉", label: "瑞穗鄉" },
    { value: "富里鄉", label: "富里鄉" },
    { value: "秀林鄉", label: "秀林鄉" },
    { value: "萬榮鄉", label: "萬榮鄉" },
    { value: "卓溪鄉", label: "卓溪鄉" },
  ]

// 臺東縣
export const optionsCreator_districtV: () => Toption[] =
  () => [
    { value: "臺東市", label: "臺東市" },
    { value: "成功鎮", label: "成功鎮" },
    { value: "關山鎮", label: "關山鎮" },
    { value: "長濱鄉", label: "長濱鄉" },
    { value: "海端鄉", label: "海端鄉" },
    { value: "池上鄉", label: "池上鄉" },
    { value: "東河鄉", label: "東河鄉" },
    { value: "鹿野鄉", label: "鹿野鄉" },
    { value: "延平鄉", label: "延平鄉" },
    { value: "卑南鄉", label: "卑南鄉" },
    { value: "金峰鄉", label: "金峰鄉" },
    { value: "太麻里鄉", label: "太麻里鄉" },
    { value: "大武鄉", label: "大武鄉" },
    { value: "達仁鄉", label: "達仁鄉" },
    { value: "綠島鄉", label: "綠島鄉" },
    { value: "蘭嶼鄉", label: "蘭嶼鄉" },
  ]

// 澎湖縣
export const optionsCreator_districtX: () => Toption[] =
  () => [
    { value: "馬公市", label: "馬公市" },
    { value: "湖西鄉", label: "湖西鄉" },
    { value: "白沙鄉", label: "白沙鄉" },
    { value: "西嶼鄉", label: "西嶼鄉" },
    { value: "望安鄉", label: "望安鄉" },
    { value: "七美鄉", label: "七美鄉" },
  ]

// 金門縣
export const optionsCreator_districtW: () => Toption[] =
  () => [
    { value: "金城鎮", label: "金城鎮" },
    { value: "金湖鎮", label: "金湖鎮" },
    { value: "金沙鎮", label: "金沙鎮" },
    { value: "金寧鄉", label: "金寧鄉" },
    { value: "烈嶼鄉", label: "烈嶼鄉" },
    { value: "烏坵鄉", label: "烏坵鄉" },
  ]

// 連江縣
export const optionsCreator_districtZ: () => Toption[] =
  () => [
    { value: "南竿鄉", label: "南竿鄉" },
    { value: "東引鄉", label: "東引鄉" },
  ]



export const districtOptionsSelector = (country: string) => {

  switch (country) {
    case "基隆市": return optionsCreator_districtC()
    case "新北市": return optionsCreator_districtF()
    case "臺北市": return optionsCreator_districtA()
    case "桃園市": return optionsCreator_districtH()
    case "新竹縣": return optionsCreator_districtJ()
    case "新竹市": return optionsCreator_districtO()
    case "苗栗縣": return optionsCreator_districtK()
    case "臺中市": return optionsCreator_districtB()
    case "彰化縣": return optionsCreator_districtN()
    case "南投縣": return optionsCreator_districtM()
    case "雲林縣": return optionsCreator_districtP()
    case "嘉義縣": return optionsCreator_districtQ()
    case "嘉義市": return optionsCreator_districI()
    case "臺南市": return optionsCreator_districtD()
    case "高雄市": return optionsCreator_districtE()
    case "屏東縣": return optionsCreator_districtT()
    case "宜蘭縣": return optionsCreator_districtG()
    case "花蓮縣": return optionsCreator_districtU()
    case "臺東縣": return optionsCreator_districtV()
    case "澎湖縣": return optionsCreator_districtX()
    case "金門縣": return optionsCreator_districtW()
    case "連江縣": return optionsCreator_districtZ()
    default:
      return [{ value: "", label: "" }];
  }
}


































