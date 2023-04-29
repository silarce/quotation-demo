import { Carousel } from 'antd';
import Image from 'next/image';

// icon
import iconArrowRight from "public/image/icon/arrow_right.svg"
import iconRmove from "public/image/icon/remove03.svg"


// css
import scss from "./tagCarousel.module.scss"

type Ttag = { name: string, date: string }

export default function TagCarousel(
  { tagArr, removeTag }:
    {
      tagArr: Ttag[]
      removeTag: (index: number) => void
    }
) {


  return (
    <div className={scss.container}>

      <Carousel
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
          const { name, date } = tag
          return (
            <div key={index}>
              <div className={scss.cell}>
                <span>
                  <span>{name}</span> <span>{date}</span>
                </span>
                <Image src={iconRmove} alt="remove" className={scss.removeBtn}
                  onClick={() => removeTag(index)}
                />
              </div>
            </div>
          )
        })}
      </Carousel>
    </div>
  )
}










