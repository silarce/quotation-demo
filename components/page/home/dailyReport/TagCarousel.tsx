import classNames from "classnames";


import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



import Image from 'next/image';


// icon
import iconArrowRight from "public/image/icon/arrow_right.svg"
import iconRmove from "public/image/icon/remove03.svg"


// css
import scss from "./tagCarousel.module.scss"

// type
import { Ttag } from "pages/home/dailyReport";



export default function TagCarousel(
  { tagArr, editReport, removeTag }:
    {
      tagArr: Ttag[]
      editReport: (reportId: string) => void
      removeTag: (index: number) => void
    }
) {


  return (
    <div className={scss.container}>

      <Slider
        className={scss.antdCarousel}
        arrows={true}
        dots={false}
        // slidesToShow={3}
        variableWidth={true}
        slidesToScroll={3}
        infinite={false}

        /**如果直接給img，這個UI會把客製化img的className蓋過去*/
        prevArrow={<Image src={iconArrowRight} alt="next" />}
        nextArrow={<Image src={iconArrowRight} alt="next" />}
      >

        {tagArr.map((tag, index) => {
          const { name, date, reportId, employeeId } = tag
          return (
            <div key={index} onClick={() => editReport(reportId)}>
              <div className={classNames(scss.cell, { [scss.isActive]: index === 0 })} >
                <span>
                  {`${name} ${date}`}
                </span>
                <Image src={iconRmove} alt="remove" className={scss.removeBtn}
                  onClick={(e) => { e.stopPropagation(); removeTag(index) }}
                />
                <hr />
              </div>
            </div>
          )
        })}
      </Slider >
    </div >
  )
}



