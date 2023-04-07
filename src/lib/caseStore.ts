import Case, {LastCase} from "@/models/Case";
import {create} from "zustand";
import withQuery from "with-query";
import {useUserStore} from "@/lib/userStore";

interface CaseStore {
    cases: Case[] | null;
    lastCase: LastCase | null;
    setCases: (cases: Case[]) => void;
    setLastCase: (lastCase: LastCase) => void;
}

const fetchCases = async (): Promise<Case[] | null> => {
    const baseURL = "http://localhost:4000/";
    try {
        const user_id = await useUserStore.getState().user?.user_id;
        if (!user_id) {
            return null;
        }
        const res = await fetch(withQuery(`${baseURL}cases/by`, {user: user_id}));
        const cases = await res.json();
        return Promise.resolve(cases);
    } catch (e) {
        console.log(e);
        return Promise.resolve(null);
    }
};

export const useCaseStore = create<CaseStore>((set) => ({
    cases: [],
    lastCase: null,
    setCases: (newCases: Case[]) => {
        set({cases: newCases});
    },
    setLastCase: (newLastCase: LastCase) => {
        set({lastCase: newLastCase});
    },
}));

export const initialCases = async () => {
    const cases = await fetchCases();
    const lastCase = cases?.[cases.length - 1];
    useCaseStore.setState({cases, lastCase});
}
