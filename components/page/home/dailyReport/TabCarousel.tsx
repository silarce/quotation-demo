import { useRef, useEffect } from 'react';
import classNames from 'classnames';
import Image from 'next/image';

import Slider, { CustomArrowProps, ResponsiveObject } from 'react-slick';

// icon
import iconArrowRight from 'public/image/icon/arrow_right.svg';
import iconRmove from 'public/image/icon/remove03.svg';

// css
import scss from './tabCarousel.module.scss';

// type
import { Ttab } from 'pages/home/dailyReport';

export default function TabCarousel({
  tabArr,
  editReport,
  removeTab,
  activeId,
}: {
  tabArr: Ttab[];
  editReport: (reportId: string, prevReportDate: string) => void;
  removeTab: (index: number, tabReportId: string) => void;
  activeId: string;
}) {
  const sliderRef = useRef<Slider>(null);

  const onAddSlide = (activeId: string) => {
    if (!sliderRef.current) {
      return;
    }

    const activeIndex = tabArr.findIndex((tab) => {
      return tab.reportId === activeId;
    });
    sliderRef.current.slickGoTo(activeIndex);
  };

  useEffect(() => {
    onAddSlide(activeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  return (
    <div className={scss.container}>
      <Slider
        ref={sliderRef}
        className={scss.antdCarousel}
        infinite={false}
        dots={false}
        // variableWidth={true}
        slidesToShow={2}
        slidesToScroll={2}
        arrows={true}
        prevArrow={<PrevArrow />}
        nextArrow={<NextArrow />}
      >
        {tabArr.map((tab, index) => {
          const { name, date, reportId, employeeId, prevDate: prevReportDate } = tab;

          return (
            <div key={index} onClick={() => editReport(reportId, prevReportDate)}>
              <div className={classNames(scss.cell, { [scss.isActive]: activeId === reportId })}>
                <span>{`${name} ${date}`}</span>
                <Image
                  src={iconRmove}
                  alt="remove"
                  className={scss.removeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(index, reportId);
                  }}
                />
                <hr />
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

// ====================================================================

const PrevArrow = (
  props: CustomArrowProps
  // props02: ResponsiveObject
) => {
  const { className, onClick } = props;

  return <Image src={iconArrowRight} alt="next" className={classNames(className)} onClick={onClick} />;
};

const NextArrow = (
  props: CustomArrowProps
  // props02: ResponsiveObject
) => {
  const { className, onClick } = props;

  return <Image src={iconArrowRight} alt="next" className={classNames(className)} onClick={onClick} />;
};
