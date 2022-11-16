



import style from "./loadingCover.module.scss"

import CircularProgress from '@mui/material/CircularProgress';


// LoadingCover01的父元素必須要有position:relative才有用
// LoadingCover01的父元素必須要有position:relative才有用
// LoadingCover01的父元素必須要有position:relative才有用
export default function LoadingCover01({ isLoading, size, className = "" }
  : {
    isLoading: boolean
    size?: number
    className?: string
  }) {


  const styleLoading = isLoading ? style.Loading : ""

  className = `${className} ${style.loadingCover01} ${styleLoading}`

  return (
    <div className={className}>
      <CircularProgress className={style.icon}
        size={size ?? 100} />
    </div>
  )

}