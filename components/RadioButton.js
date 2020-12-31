import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton as MyRadioButton } from 'react-native-paper';
import { constants } from '../core/constants';
import * as theme from '../core/theme';

const RadioButton = ({ checked, onPress1, onPress2, ...props }) => {
    // const [checked, setChecked] = React.useState('first');

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.title}>Particulier</Text>
                <MyRadioButton
                    value="Particulier"
                    status={checked === 'first' ? 'checked' : 'unchecked'}
                    onPress={onPress1}
                    color={theme.colors.primary} />
            </View>

            <View style={[styles.row, { justifyContent: 'flex-end' }]}>
                <Text style={styles.title}>Professionnel</Text>
                <MyRadioButton
                    value="Professionnel"
                    status={checked === 'second' ? 'checked' : 'unchecked'}
                    onPress={onPress2}
                    color={theme.colors.primary} />
            </View>

        </View >
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    row: {
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        marginRight: constants.ScreenWidth * 0.05
    }
});


export default RadioButton;