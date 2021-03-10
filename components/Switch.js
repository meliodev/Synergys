import * as React from 'react'
import { Switch as PaperSwitch } from 'react-native-paper'
import * as theme from '../core/theme'

const Switch = ({ onToggleSwitch }) => {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false)

    const onToggleSwitch1 = () => {
        setIsSwitchOn(!isSwitchOn)
        onToggleSwitch(!isSwitchOn)
    }

    return <PaperSwitch value={isSwitchOn} onValueChange={onToggleSwitch1} color={theme.colors.primary} />
}

export default Switch