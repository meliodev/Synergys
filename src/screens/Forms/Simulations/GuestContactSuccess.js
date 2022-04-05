
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native'
import { Paragraph, Title } from 'react-native-paper';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons';

import { Appbar, CustomIcon } from "../../../components"

import { constants } from '../../../core/constants'
import * as theme from '../../../core/theme'


class GuestContactSuccess extends Component {

    render() {
        return (
            <View style={styles.mainContainer}>
                <Appbar
                    appBarColor={"#003250"}
                    iconsColor={theme.colors.white}
                    back
                    title
                    titleText="Message envoyé !"
                />
                <View style={{ padding: theme.padding }}>

                    <View style={{ marginTop: theme.padding, alignItems: "center" }}>
                        <Title style={{ textAlign: "center", marginBottom: theme.padding, color: "green", fontWeight: 'bold' }}>
                            Votre dossier d'aide a été délivré avec succès!
                        </Title>
                        <Paragraph style={{ textAlign: "center", marginTop: 16 }}>
                            Un conseiller vous contactera bientôt pour vous communiquer la démarche à suivre. Merci de patienter.
                        </Paragraph>
                        <CustomIcon
                            icon={faCheckCircle}
                            color={theme.colors.primary}
                            size={constants.ScreenWidth * 0.42}
                            style={{ alignSelf: "center", marginTop: constants.ScreenHeight * 0.12 }}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

})

export default GuestContactSuccess
