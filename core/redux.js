export const setRole = (main, role) => {
    const action = { type: "ROLE", value: role }
    main.props.dispatch(action)
}

export const setUser = (main, displayName, connected) => {
    const action = { type: "DISPLAYNAME", value: { displayName, connected } }
    main.props.dispatch(action)
}

export const setNetwork = (main, network) => {
    const action = { type: "NET", value: network }
    main.props.dispatch(action)
}
