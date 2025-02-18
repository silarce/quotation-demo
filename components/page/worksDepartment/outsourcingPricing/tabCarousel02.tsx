import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import classNames from 'classnames';

import Slider, { CustomArrowProps, Settings as TreactSlickProps } from 'react-slick';

// css
import scss from './tabCarousel02.module.scss';

// ======================================================================

type Ttab = {
  label: string;
  // isActive?: boolean;
  // 通常會使用ref_slider.current.slickGoTo(index)
  onClick?: (props: { ref_slider: React.MutableRefObject<Slider> }) => void;
  className?: string;
  className_tabContent?: string;
  viewRef?: (node?: Element | null | undefined) => void;
  isActive?: boolean;
};

type Tcontrol = {
  activeIndex?: number | undefined;
  activeClassName?: string;
  tabArr: Ttab[];
};

type TimperativeHandle = {
  slideToIndex: (index: number) => void;
};

// ======================================================================
function TabCarousel02_pre(
  {
    className,
    control,
    theme = 'default',
    props,
  }: {
    className?: string;
    control: Tcontrol;
    theme?: 'default' | 'dashed';
    props?: TreactSlickProps;
  },
  ref: React.ForwardedRef<TimperativeHandle>
) {
  const [isSliding, setIsSliding] = useState(false);

  // -------------------------------------------------------------------------
  const sliderRef = useRef<Slider>(null!);
  const { tabArr, activeIndex } = control;

  // -------------------------------------------------------------------------

  useImperativeHandle(ref, () => ({
    slideToIndex: (index) => {
      sliderRef.current.slickGoTo(index);
    },
  }));

  // -------------------------------------------------------------------------

  return (
    <Slider
      className={classNames('m-auto', scss.slider, scss[`theme_${theme}`], className)}
      ref={sliderRef}
      infinite={false}
      dots={false}
      arrows={true}
      // touchMove={false}
      // draggable={true}
      // slidesToShow={6}
      // slidesToScroll={6}
      slidesToScroll={3}
      variableWidth={true}
      focusOnSelect={true}
      prevArrow={
        <PrevArrow
        // isFirstInView={inView_first}
        />
      }
      nextArrow={
        <NextArrow
        // isLastInView={inView_last}
        />
      }
      onSwipe={(e) => {
        setIsSliding(true);
      }}
      afterChange={(e) => {
        setIsSliding(false);
      }}
      {...props}
    >
      {tabArr.map((tab, index) => {
        const { label, onClick, className, className_tabContent, viewRef } = tab;

        const isActive = tab.isActive !== undefined ? tab.isActive : activeIndex === index;

        const theClick = () => {
          !isSliding && onClick && onClick({ ref_slider: sliderRef });
        };

        return (
          <div key={index} className={classNames(scss.tab, className)}>
            <div ref={viewRef} className={classNames(isActive && scss.active, className_tabContent)} onClick={theClick}>
              <span>{label}</span>
            </div>
          </div>
        );
      })}
    </Slider>
  );
}

// ======================================================================

const PrevArrow = (
  //
  props: CustomArrowProps & {
    //  isFirstInView?: boolean
  }
) => {
  const {
    className,
    style,
    onClick,
    currentSlide,
    slideCount,
    // isFirstInView
  } = props;

  const isScrollToFirst = (currentSlide ?? 0) === 0;

  return (
    <Svg_arrowLeft
      onClick={onClick}
      className={classNames(
        scss.arrow,
        // isFirstInView && scss.fad,
        isScrollToFirst && scss.fad,
        className
      )}
      style={style}
    />
  );
};

const NextArrow = (
  props: CustomArrowProps & {
    //  isLastInView?: boolean
  }
) => {
  const {
    className,
    style,
    onClick,
    currentSlide,
    slideCount,
    // isLastInView
  } = props;

  const isScrollToLast = (currentSlide ?? 0) + 1 === slideCount;

  return (
    <Svg_arrowRight
      onClick={onClick}
      className={classNames(
        scss.arrow,
        // isLastInView && scss.fad,
        isScrollToLast && scss.fad,
        className
      )}
      style={style}
    />
  );
};

const Svg_arrowLeft = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path
        d="M26.5189 6.19888V3.09307C26.5189 2.82388 26.2095 2.67522 26.0006 2.83995L7.88805 16.9868C7.73416 17.1065 7.60964 17.2597 7.52398 17.4349C7.43833 17.61 7.3938 17.8024 7.3938 17.9973C7.3938 18.1923 7.43833 18.3846 7.52398 18.5598C7.60964 18.7349 7.73416 18.8881 7.88805 19.0078L26.0006 33.1547C26.2135 33.3194 26.5189 33.1708 26.5189 32.9016V29.7958C26.5189 29.5989 26.4264 29.41 26.2738 29.2895L11.8095 17.9993L26.2738 6.70513C26.4264 6.58459 26.5189 6.39575 26.5189 6.19888Z"
        fill="#14256A"
      />
    </svg>
  );
};

const Svg_arrowRight = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path
        d="M28.1933 16.9884L10.0808 2.84157C10.0335 2.80431 9.9766 2.78115 9.9167 2.77476C9.85681 2.76837 9.79632 2.779 9.7422 2.80543C9.68807 2.83186 9.6425 2.87303 9.61071 2.92419C9.57893 2.97536 9.56222 3.03446 9.5625 3.09469V6.2005C9.5625 6.39737 9.65491 6.58621 9.80759 6.70674L24.2719 18.0009L9.80759 29.2951C9.6509 29.4157 9.5625 29.6045 9.5625 29.8014V32.9072C9.5625 33.1764 9.87188 33.325 10.0808 33.1603L28.1933 19.0134C28.3473 18.8934 28.4718 18.7398 28.5574 18.5643C28.6431 18.3889 28.6876 18.1962 28.6876 18.0009C28.6876 17.8057 28.6431 17.613 28.5574 17.4376C28.4718 17.2621 28.3473 17.1085 28.1933 16.9884Z"
        fill="#14256A"
      />
    </svg>
  );
};

const TabCarousel02 = forwardRef(TabCarousel02_pre);

export default TabCarousel02;
export type { Tcontrol as Tcontrol_tabCarousel, TimperativeHandle };
