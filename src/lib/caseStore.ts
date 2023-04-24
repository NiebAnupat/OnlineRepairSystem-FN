import Case, {LastCase} from "@/models/Case";
import {create} from "zustand";
import withQuery from "with-query";
import {useUserStore} from "@/lib/userStore";

interface CaseStore {
    cases: Case[] | null;
    lastCase: LastCase | null;
    filterCases: Case[] | null;
    isLoaded: boolean;
    setCases: (cases: Case[]) => void;
    setLastCase: (lastCase: LastCase) => void;
    setFilterCases: (filterCases: Case[]) => void;
    setLoaded: (isLoaded: boolean) => void;
}


export const useCaseStore = create<CaseStore>((set) => ({
    cases: [],
    lastCase: null,
    filterCases: [],
    isLoaded: false,
    setCases: (newCases: Case[]) => {
        set({cases: newCases});
    },
    setLastCase: (newLastCase: LastCase) => {
        set({lastCase: newLastCase});
    },
    setFilterCases: (newFilterCases: Case[]) => {
        set({filterCases: newFilterCases});
    },
    setLoaded : (isLoaded: boolean) => {
        set({isLoaded});
    }
}));

const fetchCases = async (): Promise<Case[] | null> => {
    const baseURL = "http://localhost:4000/";
    try {
        const user_id = await useUserStore.getState().user?.user_id;
        if (!user_id) {
            return null;
        }
        const user_role = await useUserStore.getState().user?.user_role;
        let res : Response;
        switch (user_role) {
            case "user":  res = await fetch(withQuery(`${baseURL}cases/by`, {user: user_id})); break;
            case 'worker': res = await fetch(withQuery(`${baseURL}cases/by`, {tec: user_id})); break;
            case 'admin': res = await fetch(`${baseURL}cases`); break;
            default: res = await fetch(`${baseURL}cases`);
        }

        const cases = await res.json();
        return Promise.resolve(cases);
    } catch (e) {
        return Promise.resolve(null);
    }
};

export const initialCases = async () => {
    useCaseStore.setState({isLoaded: false});
    const cases = await fetchCases();
    const lastCase = cases?.[cases.length - 1];
    useCaseStore.setState({cases, filterCases: cases, lastCase});
    useCaseStore.setState({isLoaded: true});
}
