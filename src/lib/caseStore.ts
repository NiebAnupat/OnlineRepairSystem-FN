import Case, {LastCase} from "@/models/Case";
import {create} from "zustand";
import withQuery from "with-query";
import {useUserStore} from "@/lib/userStore";

interface CaseStore {
    cases: Case[] | null;
    lastCase: LastCase | null;
    filterCases: Case[] | null;
    pendingCases: Case[] | null;
    isLoaded: boolean;
    setCases: (cases: Case[]) => void;
    setLastCase: (lastCase: LastCase) => void;
    setFilterCases: (filterCases: Case[]) => void;
    setPendingCases: (pendingCases: Case[]) => void;
    setLoaded: (isLoaded: boolean) => void;
}


export const useCaseStore = create<CaseStore>((set) => ({
    cases: [],
    lastCase: null,
    filterCases: [],
    pendingCases: [],
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
    setPendingCases: (newPendingCases: Case[]) => {
        set({pendingCases: newPendingCases});
    },
    setLoaded: (isLoaded: boolean) => {
        set({isLoaded});
    }
}));

const baseURL = "http://localhost:4000/";
const fetchCases = async (): Promise<Case[] | null> => {
    try {
        const user_id = await useUserStore.getState().user?.user_id;
        if (!user_id) {
            return null;
        }
        const user_role = await useUserStore.getState().user?.user_role;
        let res: Response;
        switch (user_role) {
            case "employee":
                res = await fetch(withQuery(`${baseURL}cases/by`, {user: user_id,getImages: true}));
                break;
            case 'worker':
                res = await fetch(withQuery(`${baseURL}cases/by`, {tec: user_id}));
                break;
            case 'admin':
                res = await fetch(`${baseURL}cases`);
                break;
            default:
                res = await fetch(`${baseURL}cases`);
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
    const user_role = await useUserStore.getState().user?.user_role;
    switch (user_role) {
        case "employee": {
            const lastCase = cases?.[cases.length - 1];
            useCaseStore.setState({cases, filterCases: cases, lastCase});
            break;
        }
        case 'worker': {
            const pendingCases = await fetch(withQuery(`${baseURL}cases/by`, { status: '1'})).then(res => res.json());
            useCaseStore.setState({cases,filterCases:pendingCases, pendingCases});
            break;
        }
    }
    useCaseStore.setState({isLoaded: true});
}
