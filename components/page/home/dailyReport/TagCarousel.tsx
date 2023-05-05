import { useRef, useEffect } from "react";
import classNames from "classnames";
import Image from 'next/image';

import Slider, { CustomArrowProps, ResponsiveObject } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// icon
import iconArrowRight from "public/image/icon/arrow_right.svg"
import iconRmove from "public/image/icon/remove03.svg"

// css
import scss from "./tagCarousel.module.scss"

// type
import { Ttag } from "pages/home/dailyReport";

export default function TagCarousel(
  { tagArr, editReport, removeTag, activeId }:
    {
      tagArr: Ttag[]
      editReport: (reportId: string) => void
      removeTag: (index: number, tagReportId: string) => void
      activeId: string
    }
) {

  const sliderRef = useRef<Slider>(null);

  const onAddSlide = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  useEffect(() => {
    onAddSlide(tagArr.length-1)
  }, [tagArr.length])


  return (
    <div className={scss.container}>

      <Slider
        ref={sliderRef}
        className={scss.antdCarousel}
        infinite={false}
        dots={false}

        // variableWidth={true}
        slidesToShow={3}
        slidesToScroll={3}

        arrows={true}
        prevArrow={<PrevArrow />}
        nextArrow={<NextArrow />}
      >

        {tagArr.map((tag, index) => {
          const { name, date, reportId, employeeId } = tag

          return (
            <div key={index} onClick={() => editReport(reportId)}>
              <div className={classNames(scss.cell, { [scss.isActive]: activeId === reportId })} >
                <span>
                  {`${name} ${date}`}
                </span>
                <Image src={iconRmove} alt="remove" className={scss.removeBtn}
                  onClick={(e) => { e.stopPropagation(); removeTag(index, reportId) }}
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

// ====================================================================



const PrevArrow = (
  props: CustomArrowProps,
  // props02: ResponsiveObject
) => {
  const { className, onClick } = props
  return (
    <Image src={iconArrowRight} alt="next"
      className={classNames(className)}
      onClick={onClick}
    />
  )
}

const NextArrow = (
  props: CustomArrowProps,
  // props02: ResponsiveObject
) => {
  const { className, onClick } = props
  return (
    <Image src={iconArrowRight} alt="next"
      className={classNames(className)}
      onClick={onClick}
    />
  )
}


