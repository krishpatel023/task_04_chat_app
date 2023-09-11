import React from "react";

const GlobalContext = React.createContext({
    messages : [],
    setMessages : () => {},

    open : false,
    setOpen: () => {},
    createChatBox:false,
    setCreateChatBox: () => {},

    user: 0,
    setUser: () => {},
    currentChat : 0,
    setCurrentChat: () => {},
    typing:0,
    setTyping: () => {},
    unread: 0,
    setUnread: () => {},
    chatSettings: 0,
    setChatSettings: () => {},
    msgTotal:0,
    setMsgTotal: () => {},
    loading: 0,
    setLoading: () => {},
    deleteMsg: 0,
    setDeleteMsg: () => {},
    isPollOpen: 0,
    setIsPollOpen: () => {}
})

export default GlobalContext