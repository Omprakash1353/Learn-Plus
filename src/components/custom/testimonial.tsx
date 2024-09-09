"use client";

import { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import React, {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState,
} from "react";

import { testimonials } from "@/constants/testimonial";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { StarRating } from "./start-rating";

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined,
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      onInit(emblaApi);
      onSelect();
    });
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

export const EmblaTestimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: true, delay: 3000 }),
  ]);
  const [isPlaying, setIsPlaying] = useState(true);
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play;
    playOrStop();
  }, [emblaApi]);

  useEffect(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    setIsPlaying(autoplay.isPlaying());
    emblaApi
      .on("autoplay:play", () => setIsPlaying(true))
      .on("autoplay:stop", () => setIsPlaying(false))
      .on("reInit", () => setIsPlaying(autoplay.isPlaying()));
  }, [emblaApi]);

  useEffect(() => {
    if (!isPlaying) {
      toggleAutoplay();
    }
  }, [isPlaying, toggleAutoplay]);

  return (
    <div className="embla">
      <div className="embla__viewport rounded-md border" ref={emblaRef}>
        <div className="embla__container rounded-md">
          {testimonials.map((e, i) => (
            <div className="embla__slide" key={i}>
              <div className="flex h-auto w-full flex-col items-center justify-center gap-4 rounded-md pt-4">
                <Avatar className="h-20 w-20 border-[4px] border-blue-700">
                  <AvatarImage src={e.avatar} />
                  <AvatarFallback>{e.fallback}</AvatarFallback>
                </Avatar>
                <div className="text-center text-sm">
                  <div className="font-semibold">{e.name}</div>
                  <div className="font-medium text-gray-700 dark:text-gray-400">
                    Location | University
                  </div>
                </div>
                <p className="text-center font-light">{e.review}</p>{" "}
                <div className="text-start text-sm">
                  <StarRating readonly rating={e.stars} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="embla__controls">
        <div className="flex">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`embla__dot ${
                index === selectedIndex
                  ? "bg-blue-700"
                  : "bg-gray-700 dark:bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

type PropType = ComponentPropsWithRef<"div">;

export const DotButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <div className="m-1 rounded-full bg-white p-2" {...restProps}>
      {children}
    </div>
  );
};

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};
