
import React, { useState, useEffect } from "react"
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import Dialog from 'react-native-dialog'
import firebase from '@react-native-firebase/app'
import _ from 'lodash'
import { faCheckCircle, faCheck, faTimes, faClock } from '@fortawesome/pro-light-svg-icons'
import { withNavigation } from 'react-navigation'

import FormSection from './FormSection'
import ModalOptions from './ModalOptions'
import Button from './Button'
import CustomIcon from './CustomIcon'
import Loading from './Loading'

import { getCurrentStep, getCurrentAction } from '../core/process'
import * as theme from "../core/theme"
import { constants } from "../core/constants"

const db = firebase.firestore()

const ProcessAction = ({ process, processMain, ProjectId, navigation, ...props }) => {

    var currentAction = getCurrentAction(process)
    const { currentPhaseId, currentStepId } = getCurrentStep(process)

    if (currentAction) {
        var { title, status, screenName, screenParams, type, verificationType, choices, responsable } = currentAction

        if (verificationType === 'multiple-choices') {
            var elements = choices.map((choice) => {
                const element = _.cloneDeep(choice)
                if (element.iconId === 'confirm') element.icon = faCheck
                else if (element.iconId === 'cancel') element.icon = faTimes
                else if (element.iconId === 'postpone') element.icon = faClock
                return element
            })
        }
    }

    const [showDialog, setShowDialog] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [dialogInputLabel, setDialogInputLabel] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [nextStep, setNextStep] = useState('')
    const [nextPhase, setNextPhase] = useState('')
    const [loading, setLoading] = useState(false)

    const CommentDialog = ({ title, inputLabel }) => {
        const [comment, setComment] = useState('')

        if (loading)
            return (
                <Dialog.Container visible={showDialog}>
                    <Dialog.Title style={[theme.customFontMSsemibold.header, { marginBottom: 5 }]}>Traitement en cours...</Dialog.Title>
                    <ActivityIndicator color={theme.colors.primary} size='small' />
                </Dialog.Container>
            )

        else return (
            <Dialog.Container visible={showDialog}>
                <Dialog.Title style={[theme.customFontMSsemibold.header, { marginBottom: 5 }]}>{dialogTitle}</Dialog.Title>
                <Dialog.Input
                    label={dialogInputLabel}
                    returnKeyType="done"
                    value={comment}
                    onChangeText={comment => setComment(comment)}
                    autoFocus={showDialog} />

                <Dialog.Button label="Annuler" onPress={() => setShowDialog(false)} style={{ color: theme.colors.error }} />
                <Dialog.Button label="Valider" onPress={() => onSubmitComment(comment)} style={{ color: theme.colors.primary }} />
            </Dialog.Container>
        )
    }

    const configNextStepOrPhase = (nextStep, nextPhase) => {
        //Set next step or phase
        if (nextStep) {
            setNextStep(nextStep)
            setNextPhase('')
        }

        else if (nextPhase) {
            setNextPhase(nextPhase)
            setNextStep('')
        }
    }

    const onSelectChoice = async (choice) => {
        const { nextStep, nextPhase, commentRequired, onSelectType, screenName, screenParams } = choice

        if (onSelectType === 'navigation') {
            navigation.navigate(screenName, screenParams)
        }

        else if (onSelectType === 'transition') {
            configNextStepOrPhase(nextStep, nextPhase)
            if (commentRequired) {
                const dialogTitle = choice.iconId === 'postpone' ? "Motif du repport" : "Motif de l'annulation"
                const dialogInputLabel = choice.iconId === 'postpone' ? "Expliquez brièvemment la raison du report." : "Expliquez brièvemment la raison de l'annulation."
                setDialogTitle(dialogTitle)
                setDialogInputLabel(dialogInputLabel)
                setShowDialog(true)
            }
            else await validateAction(null, nextStep, nextPhase)
        }

        setShowModal(false)
    }

    const onSubmitComment = async (comment) => {
        if (!comment) return //show error message
        setLoading(true)
        await validateAction(comment, nextStep, nextPhase)
        setLoading(false)
        setShowDialog(false)
    }

    const validateAction = async (comment, nextStep, nextPhase) => {

        process[currentPhaseId].steps[currentStepId].actions.forEach((action) => {
            if (action.id === currentAction.id) {
                //Update comment
                if (comment)
                    action.comment = comment

                //Update action status
                action.status = "done"
            }
        })

        //Set nextStep or nextPhase
        if (nextStep) {
            process[currentPhaseId].steps[currentStepId].nextStep = nextStep
        }

        else if (nextPhase) {
            process[currentPhaseId].steps[currentStepId].nextPhase = nextPhase
        }

        await db.collection('Projects').doc(ProjectId).update({ process }).then(() => console.log('Process updated !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'))
        await processMain()
    }

    const onPress = () => {

        if (responsable && responsable.id !== firebase.auth().currentUser.uid) {
            Alert.alert('Opération non autorisée', "Seul un directeur commercial peut faire cette action.")
            return
        }

        if (type === 'auto') {
            navigation.navigate(screenName, screenParams)
        }

        else if (type === 'manual') {
            if (verificationType === 'comment') {
                const dialogTitle = "Commentaire"
                const dialogInputLabel = "Veuillez renseigner des informations utiles sur le projet (exp: Informations sur l'habitation)"
                setDialogTitle(dialogTitle)
                setDialogInputLabel(dialogInputLabel)
                setShowDialog(true)
            }

            else if (verificationType === 'multiple-choices') {
                setShowModal(true)
            }
        }
    }

    const renderForm = () => {

        if (!currentAction) return <Loading />

        if (type === 'auto')
            return (
                <TouchableOpacity onPress={onPress} style={[styles.actionContainer, styles.actionContainerAuto]}>
                    <Text style={[theme.customFontMSregular]}>{title}</Text>
                    <CustomIcon icon={faCheckCircle} color={status === 'pending' ? theme.colors.gray_dark : theme.colors.primary} />
                </TouchableOpacity>
            )

        else if (type === 'manual') {
            if (verificationType === 'multiple-choices') {
                return (
                    <TouchableOpacity onPress={onPress} style={[styles.actionContainer, styles.actionContainerMultiChoice]}>
                        <Text style={[theme.customFontMSregular]}>{title}</Text>
                        <CustomIcon icon={faCheckCircle} color={status === 'pending' ? theme.colors.gray_dark : theme.colors.primary} />

                        <ModalOptions
                            title={title}
                            columns={choices.length}
                            isVisible={showModal}
                            toggleModal={() => setShowModal(!showModal)}
                            handleCancel={() => console.log('cancel')}
                            handleConfirm={() => console.log('confirm')}
                            elements={elements}
                            autoValidation={true}

                            handleSelectElement={(element, index) => {
                                onSelectChoice(element)
                            }}
                        />
                        <CommentDialog />
                    </TouchableOpacity>
                )
            }

            else if (verificationType === 'comment') {
                return (
                    <TouchableOpacity onPress={onPress} style={[styles.actionContainer, styles.actionContainerComment]}>
                        <Text style={[theme.customFontMSregular]}>{title}</Text>
                        <CustomIcon icon={faCheckCircle} color={status === 'pending' ? theme.colors.gray_dark : theme.colors.primary} />
                        <CommentDialog />
                    </TouchableOpacity>
                )
            }
        }
    }

    return renderForm()
}

const styles = StyleSheet.create({
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    actionContainerAuto: {

    },
    actionContainerMultiChoice: {

    },
    actionContainerComment: {

    }
})

export default withNavigation(ProcessAction)






/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}> */
/* {choices.map((choice) => {
        return (
            <Button
                mode="outlined"
                onPress={() => onSelectChoice(choice)}
                style={{ width: '31%' }}
                labelStyle={theme.customFontMSregular.small}>
                {choice.label}
            </Button>
        )
    })} */
/* </View> */