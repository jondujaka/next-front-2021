import React, {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState
} from "react";

const defaultState = {
	setCart: () => {},
	cart: undefined
};

const AppContext = createContext(defaultState);

const AppProvider = ({ children }) => {
	const [cart, setCart] = useState(defaultState.cart);

	return (
		<AppContext.Provider value={{ cart, setCart }}>
			{children}
		</AppContext.Provider>
	);
};

const useAppState = () => useContext(AppContext);

export { AppProvider, useAppState };
