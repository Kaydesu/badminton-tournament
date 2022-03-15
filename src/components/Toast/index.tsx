import React, { createContext, Dispatch, FC, useReducer } from 'react'
import Toast from './Toast';

export type ToastState = {
    messages: string[];
    type: 'error' | 'success' | 'info',
    visible: boolean;
}

type SetVisible = {
    type: 'SET_VISIBLE';
    payload: boolean;
}

type SetMessages = {
    type: 'SET_MESSAGES';
    payload: {
        type: 'error' | 'success' | 'info';
        messages: string[];
    };
}

type Action = SetVisible | SetMessages;

const initialState: ToastState = {
    messages: [],
    type: 'info',
    visible: false,
}

const reducer = (state: ToastState, action: Action) => {
    action.payload;
    switch (action.type) {
        case 'SET_MESSAGES':
            return {
                ...state,
                type: action.payload.type,
                messages: action.payload.messages,
            }
        case 'SET_VISIBLE':
            return {
                ...state,
                visible: action.payload,
            }
        default:
            return state;
    }
}

const StateContext = createContext<ToastState | undefined>(undefined);
const DispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

const ToastProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <Toast/>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}


export const useToastState = () => {
    const context = React.useContext(StateContext);
    if (context === undefined) {
        throw new Error('useToastState must be used within a ToastProvider');
    }
    return context;
}

const useToastDispatch = () => {
    const context = React.useContext(DispatchContext);
    if (context === undefined) {
        throw new Error('useChatDispatch must be used within a ChatProvider');
    }
    return context;
}

const setToastVisible = (dispatch: Dispatch<SetVisible>, visible: boolean) => {
    dispatch({
        type: 'SET_VISIBLE',
        payload: visible,
    })
}
const setToastContent = (dispatch: Dispatch<SetMessages>, messages: string[], type: 'error' | 'success' | 'info') => {
    dispatch({
        type: 'SET_MESSAGES',
        payload: {
            messages,
            type
        }
    })
}


interface ToastActionCreators {
    setToastVisible: (visible: boolean) => void;
    setToastContent: (messages: string[], type: 'error' | 'info' | 'success') => void;
}

export const useToastAction = (): ToastActionCreators => {
    const dispatch = useToastDispatch();

    return {
        setToastVisible: setToastVisible.bind(window, dispatch),
        setToastContent: setToastContent.bind(window, dispatch),
    };
};

export default ToastProvider