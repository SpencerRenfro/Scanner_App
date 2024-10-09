import { createContext, useReducer } from 'react';

const initialState = [
    {
        title: "Categories",
        categories: [],
        selectedCategory: "",
        categoryFilter: "",
    },
    {
        title: "Inventory Items",
    },
    {
        title: "STATISTICS",
    },
    {
        title: "LOGS",
    }
];
const ACTIONS = {
    SET_CATEGORIES: "SET_CATEGORIES",
    SET_SELECTED_CATEGORY: "SET_SELECTED_CATEGORY",
    SET_CATEGORY_FILTER: "SET_CATEGORY_FILTER",
};

export const CategoryContext = createContext({});

export const CategoryProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case ACTIONS.SET_CATEGORIES:
                return { ...state, categories: action.payload };
            case ACTIONS.SET_SELECTED_CATEGORY:
                return { ...state, selectedCategory: action.payload };
            case ACTIONS.SET_CATEGORY_FILTER:
                return { ...state, categoryFilter: action.payload };
            default:
                return state;
        }
    }, initialState);
    return (
        <CategoryContext.Provider value={{ state, dispatch }}>
            {children}
        </CategoryContext.Provider>
    );
};