import React, { useState, useCallback, useEffect } from "react";
import { useEmblaCarousel } from "embla-carousel/react";

const Carousel = ({ items }) => {
	const [emblaRef, emblaApi] = useEmblaCarousel();

	const [slideStatus, setSlideStatus] = useState(0);

	const toggleSlide = useCallback(
		index => {
			emblaApi && emblaApi.scrollTo(index);
		},
		[emblaApi]
	);

	useEffect(() => {
		if (emblaApi) {
			// Embla API is ready
		}
	}, [emblaApi]);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;

		setSlideStatus(emblaApi.selectedScrollSnap());
	}, [emblaApi, setSlideStatus]);

	useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on("select", onSelect);
	}, [emblaApi, onSelect]);

	return (
		<div className="carousel-container">
			<div className="embla" ref={emblaRef}>
				<div className="embla__container">
					{items.map((item, i) => {
						return (
							<div key={`carousel-${i}`} className="embla__slide">
								<img srcSet={item.srcSet} />
							</div>
						);
					})}
				</div>
			</div>
			<div className="carousel-nav">
				{items.map((item, i) => {
					return (
						<button
							key={`slide-button-${i}`}
							onClick={() => toggleSlide(i)}
							className={slideStatus === i ? `active` : ``}
						></button>
					);
				})}
			</div>
		</div>
	);
};

export default Carousel;
