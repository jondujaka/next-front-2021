import React from "react";

const MapPin = ({ color = "#000", hoverColor = "#fcfcfc" }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="28"
			viewBox="0 0 100 125"
		>
			<g>
				<path
					fill={color}
					d="M49.898 11C35.48 11 23.795 22.688 23.795 37.105c0 4.137.986 8.035 2.699 11.51L49.898 83 73.3 48.615a25.935 25.935 0 002.7-11.51C76 22.688 64.314 11 49.898 11m.324 39.535v.08c-.11-.004-.215-.035-.325-.043-.108.008-.213.039-.322.043v-.08c-6.025-.484-10.782-5.459-10.782-11.609 0-6.152 4.757-11.127 10.782-11.611v-.08c.109.004.214.035.322.043.11-.008.215-.039.325-.043v.08c6.026.484 10.783 5.459 10.783 11.611 0 6.15-4.757 11.125-10.783 11.609"
				/>
			</g>
		</svg>
	);
};

export default MapPin;
