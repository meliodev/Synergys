/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation'
import PhaseComponent from '../components/PhaseComponent';
import StepComponent from '../components/StepComponent';
import ProcessAction from '../../../components/ProcessAction';
//import processModel from '../processModel.json';

class ProcessContainer extends Component {

  constructor(props) {
    super(props)

    this.processModel = this.props.navigation.getParam('process', '')
    this.project = this.props.navigation.getParam('project', '')
    this.clientId = this.props.navigation.getParam('clientId', '')
    this.step = this.props.navigation.getParam('step', '')
    this.canUpdate = this.props.navigation.getParam('canUpdate', '')
    this.role = this.props.navigation.getParam('role', '')

    this.state = {
      currentPage: 0,
      phaseLabels: [],
      phaseStatuses: [],
      stepsData: []
    }
  }

  componentDidMount() {
    let phaseLabels = []
    let phaseStatuses = []
    let steps = []

    this.sortPhases()

    for (let phaseId in this.processModel) {
      const processData = this.processModel[phaseId]
      phaseLabels.push(processData.title)

      let phaseSteps = []
      let phaseStatus = 'done'
      for (let stepId in processData.steps) {
        let step = processData.steps[stepId]

        let actionsDoneCount = 0
        for (let action of step.actions) {
          if (action.status === 'done')
            actionsDoneCount += 1
        }
        step.actions.sort((a, b) => (a.actionOrder > b.actionOrder) ? 1 : -1)

        //Step & Phase progress
        step.progress = actionsDoneCount / step.actions.length * 100
        if (step.progress < 100)
          phaseStatus = 'pending'

        phaseSteps.push(step)
      }

      phaseStatuses.push(phaseStatus)
      phaseSteps.sort((a, b) => (a.stepOrder > b.stepOrder) ? 1 : -1)
      steps.push(phaseSteps)
    }

    this.setState({ phaseLabels, phaseStatuses, stepsData: steps })
  }

  sortPhases() {
    const procesTemp = Object.entries(this.processModel).sort(([keyA, valueA], [keyB, valueB]) => {
      return (valueA.phaseOrder > valueB.phaseOrder ? 1 : -1)
    })
    this.processModel = Object.fromEntries(procesTemp)
  }

  render() {

    const { currentPage, phaseLabels, phaseStatuses, stepsData } = this.state

    return (
      <View>
        {phaseLabels.length > 0 && (
          <PhaseComponent
            labels={phaseLabels}
            status={phaseStatuses}
            currentPage={currentPage}
            setCurrentPage={(currentPage) => this.setState({ currentPage })}
          />
        )
        }

        <ScrollView>
          {stepsData.length > 0 && stepsData[currentPage].map((item, index) => {

            const isLastPhase = currentPage === stepsData.length-1
            const isLastStep = index === stepsData[currentPage].length-1
            const isLastStepOfLastPhase = isLastPhase && isLastStep

            return (
              <View key={index.toString()}>
                <StepComponent
                  title={item.title}
                  progress={item.progress}
                  instructions={item.instructions}
                />
                {item.actions.map((action, index) => {
                  return (
                    // <ActionComponent
                    //   key={action.title}
                    //   title={action.title}
                    //   status={action.status}
                    //   instructions={action.instructions}
                    // />
                    <ProcessAction
                      initialProcess={this.processModel}
                      action={action}
                      project={this.project}
                      clientId={this.clientId}
                      step={this.step}
                      canUpdate={this.canUpdate && isLastStepOfLastPhase}
                      isActionOnly={true}
                      role={this.role}
                    />
                  )
                })}
              </View>
            )
          })
          }
        </ScrollView>

      </View >
    )
  }
}

export default withNavigation(ProcessContainer)
