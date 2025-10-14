import { createContext } from "react";

export const NavigationContext = createContext({
    fragmentNavLinksTop: <></>,
    selectedPage: "",
    setSelectedPage: () => { },
    getPage: () => { },
    showFullDivLoading: false,
    setShowFullDivLoading: () => { },
});