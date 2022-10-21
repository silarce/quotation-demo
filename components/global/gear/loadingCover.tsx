import styled from '@emotion/styled';


import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const MyBackDrop = styled(Backdrop)`
z-index: 9999;
`
const MyCircularProgress = styled(CircularProgress)`
color:white;
`

export default function LoadingCover({ open, onClick, size = 100 }:
  {
    open: boolean
    onClick?: () => void
    size?: number | string
  }) {


  return (
    <MyBackDrop
      open={open}
      onClick={onClick}
    >
      <MyCircularProgress size={size} />
    </MyBackDrop >
  )
}



