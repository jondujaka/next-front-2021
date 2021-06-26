import React, { useState, useCallback, useEffect } from "react";
import { useEmblaCarousel } from "embla-carousel/react";

const Carousel = ({ items, style }) => {
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
						<Button
							key={`slide-button-${i}`}
							toggleSlide={() => toggleSlide(i)}
							style={style}
							active={slideStatus === i}
						/>
					);
				})}
			</div>
		</div>
	);
};

const Button = ({ style, active, toggleSlide }) => {
	const [hover, setHover] = useState(false);

	return (
		<button
			onClick={() => toggleSlide()}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={
				style
					? {
							borderColor: style.color,
							background:
								hover || active ? style.color : "transparent"
					  }
					: {}
			}
			className={active ? `active` : ``}
		></button>
	);
};

export default Carousel;
