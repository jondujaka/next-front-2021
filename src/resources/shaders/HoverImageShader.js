var HoverImageShader = {
	vertexShader: `
		varying vec3 vUv; 

		void main() {
		vUv = position; 

		vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
		gl_Position = projectionMatrix * modelViewPosition; 
		}
	`,
	fragmentShader: `
		uniform vec3 colorA; 
		uniform vec3 colorB; 
		varying vec3 vUv;

		void main() {
			gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
		}
	`,
	uniforms: {
		texture: {
			type: "t",
			value: ""
		},
		imageAspectRatio: {
			type: "f",
			value: 1.0
		},
		aspectRatio: {
			type: "f",
			value: 1.0
		},
		opacity: {
			type: "f",
			value: 1.0
		},
		hover: {
			type: "f",
			value: 0.0
		}
	}
};

export { HoverImageShader };
