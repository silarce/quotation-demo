





/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

這個元件 RootLoadingCover 應該只在 _app.tsx引入並使用
如果在其他位置被呼叫，
setRootLoading就會被第二個RootLoadingCover實體覆蓋，
而無法控制第一個RootLoadingCover實體

做這樣的東西是為了避免每次改變這個元件的狀態，
根元素下的所有元件就要運行一次

ps.
antd Modal的動畫無法部份去除，導致UX不佳
antd Spin必須要包住所有元素(也就是_app.tsx下的Component)
  改變Spin的狀態，底下所有的元件都會跑一次
sweetalert2會導致所有scrollBar都不見
用context把元素傳下來的話，每次呼叫setState也會使的所有元件運作一次
所以才用這個做法

ps2.
因為不想每次要用讀取中cover時都要引入元素，設置狀態所以才這樣做
這樣就只要引入setRootLoading就能使用了
而且不同的元件可以控制同一個RootLoadingCover

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/
import { Dispatch, SetStateAction, useState } from 'react';

import styled from '@emotion/styled';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const MyBackDrop = styled(Backdrop)`
z-index: 9999;
`
const MyCircularProgress = styled(CircularProgress)`
color:white;
`


let rootLoading: boolean
export let setRootLoading: Dispatch<SetStateAction<boolean>>

// 使用前先看置頂說明
// 使用前先看置頂說明
// 使用前先看置頂說明
export default function RootLoadingCover() {
  // 使用前先看置頂說明
  // 使用前先看置頂說明
  // 使用前先看置頂說明
  [rootLoading, setRootLoading] = useState(false)

  return (
    <MyBackDrop
      open={rootLoading}
    >
      <MyCircularProgress size={100} />
    </MyBackDrop >
  )
}







