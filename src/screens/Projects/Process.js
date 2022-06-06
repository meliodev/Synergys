import React, { Component } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import _ from 'lodash'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { faArrowAltRight } from "@fortawesome/pro-solid-svg-icons"
import { connect } from 'react-redux'

import { Appbar, ProcessAction, Loading, EmptyList, CustomIcon } from '../../components'
import { db } from '../../firebase'
import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { blockRoleUpdateOnPhase } from '../../core/privileges';


class Process extends Component {
    constructor(props) {
        super(props)

        this.initialState = {}
        this.ProjectId = this.props.navigation.getParam('ProjectId', null)
        this.title = 'Suivi du projet'

        this.state = {
            loading: true,
            uploading: false,
            docNotFound: false,
            //Specific privileges (poseur & commercial)
            isBlockedUpdates: false,
        }
    }

    async componentDidMount() {
        const properties = ["project", "client", "id"]
        const test = {
            project: { client: { id: "123" } }
        }

        const nestedVal = properties.reduce((a, prop) => a[prop], test)
        console.log(nestedVal)

        const project = await this.fetchProject()
        const process = await this.fetchProcess()
        const isBlockedUpdates = this.configUserAccess(project.step)
        const data = { project, process, isBlockedUpdates }
        this.setStateFields(data)
        this.initialState = _.cloneDeep(this.state)
        this.setState({ loading: false })
    }

    componentWillUnmount() {
        if (this.processListener)
            this.processListener()
    }

    configUserAccess(step) {
        const currentRole = this.props.role.id
        const isBlockedUpdates = blockRoleUpdateOnPhase(currentRole, step)
        return isBlockedUpdates
    }

    async fetchProject() {
        if (!this.ProjectId) return null
        const query = db.collection("Projects").doc(this.ProjectId)
        return new Promise((resolve, reject) => {
            this.processListener = query.onSnapshot(async (doc) => {
                let project = doc.data()
                project.id = doc.id
                project = _.pick(project, ['id', 'name', 'client', 'step', 'comContact', 'techContact', 'intervenant', 'address', 'workTypes'])
                resolve(project)
            })
        })
    }

    async fetchProcess() {
        if (!this.ProjectId) return null
        const query = db.collection("Projects").doc(this.ProjectId).collection("Process").doc(this.ProjectId)
        return new Promise((resolve, reject) => {
            this.processListener = query.onSnapshot(async (doc) => {
                if (!doc.exists) resolve(null)
                const process = doc.data()
                resolve(process)
            })
        })
    }

    setStateFields(data) {
        if (!data.project) this.setState({ docNotFound: true })
        else this.setState(data)
    }

    //FIELDS:
    renderProcessAction(canWrite) {
        const { project, process } = this.state
        const { client, step } = project
        return (
            <ProcessAction
                project={project}
                process={process}
                clientId={client.id}
                step={step}
                canUpdate={canWrite}
                isAllProcess={false}
                role={this.props.role}
            />
        )
    }

    renderStandardView(canWrite) {
        const { project, process } = this.state
        const showProcessAction = project && process
        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? 'padding' : null}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                <View style={styles.dataContainer} keyboardShouldPersistTaps="never">
                    {showProcessAction ?
                        this.renderProcessAction(canWrite)
                        :
                        this.processNotFound()
                    }
                    {this.viewMore()}
                </View>
            </KeyboardAvoidingView>

        )
    }

    processNotFound() {
        return (
            <Text style={[theme.customFontMSregular.body, { paddingVertical: theme.padding * 3, paddingHorizontal: theme.padding, textAlign: "center", }]}>Le process n'a pas pu être chargé. Veuillez réessayer...</Text>
        )
    }

    viewMore() {
        return (
            <View style={styles.viewMoreContainer}>
                <Text
                    onPress={() => {
                        this.props.navigation.navigate("CreateProject", { ProjectId: this.ProjectId })
                    }}
                    style={[theme.customFontMSbold.header, { color: theme.colors.primary, marginRight: 8 }]}
                >
                    Voir plus
                </Text>
                <CustomIcon icon={faArrowAltRight} color={theme.colors.primary} size={16} />
            </View>
        )
    }

    renderContent(loading) {
        const { docNotFound, isBlockedUpdates } = this.state
        const { isConnected } = this.props.network
        const { canUpdate } = this.props.permissions.projects
        const canWrite = (canUpdate && !isBlockedUpdates)

        if (docNotFound) {
            return (
                <EmptyList
                    icon={faTimes}
                    header='Projet introuvable'
                    description="Le projet est introuvable dans la base de données. Il se peut qu'il ait été supprimé."
                    offLine={!isConnected}
                />
            )
        }
        else if (loading) {
            return <Loading />
        }
        else return (
            this.renderStandardView(canWrite)
        )
    }

    render() {
        const { loading } = this.state
        return (
            <View style={styles.container}>
                <Appbar
                    back
                    title
                    titleText={this.title}
                    loading={loading}
                />
                {this.renderContent(loading)}
            </View >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network,
        //processModels: state.process.processModels,
        currentUser: state.currentUser
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(Process)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    dataContainer: {
        flex: 1
    },
    viewMoreContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
})

