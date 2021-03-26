import * as React from 'react'
import { Switch as PaperSwitch } from 'react-native-paper'
import * as theme from '../core/theme'

const Switch = ({ onToggleSwitch, defaultValue = false }) => {
    const [isSwitchOn, setIsSwitchOn] = React.useState(defaultValue)

    React.useEffect(() => {
        onToggleSwitch(isSwitchOn)
    }, [])

    const onToggleSwitch1 = () => {
        setIsSwitchOn(!isSwitchOn)
        onToggleSwitch(!isSwitchOn)
    }

    return <PaperSwitch value={isSwitchOn} onValueChange={onToggleSwitch1} color={theme.colors.primary} />
}

export default Switch