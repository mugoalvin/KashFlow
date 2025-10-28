import React, { createContext, ReactNode, useContext, useState } from "react";

const AnimationsContext = createContext({
	enabled: true,
	setEnabled: (v: boolean) => { }
});

export const AnimationsProvider = ({ children }: { children: ReactNode }) => {
	const [enabled, setEnabled] = useState(true);
	return (
		<AnimationsContext.Provider value={{ enabled, setEnabled }}>
			{children}
		</AnimationsContext.Provider>
	);
};

export const useAnimations = () => useContext(AnimationsContext);