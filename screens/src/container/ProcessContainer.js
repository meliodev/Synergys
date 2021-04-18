/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import _ from 'lodash'
import { withNavigation } from 'react-navigation'
import PhaseComponent from '../components/PhaseComponent';
import StepComponent from '../components/StepComponent';
import ProcessAction from '../../../components/ProcessAction';
//import processModel from '../processModel.json';

class ProcessContainer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      currentPage: 0,
    }
  }

  render() {

    const { phaseLabels, phaseStatuses, stepsData } = this.props
    let { canUpdate } = this.props
    const { currentPage } = this.state

    return (
      <View style={{ flex: 1 }}>
        {phaseLabels.length > 0 && (
          <PhaseComponent
            labels={phaseLabels}
            status={phaseStatuses}
            currentPage={currentPage}
            setCurrentPage={(currentPage) => this.setState({ currentPage })}
          />
        )
        }

        <View style={{ flex: 1 }}>
          <ScrollView >
            {stepsData.length > 0 && stepsData[currentPage].map((item, index) => {

              const isLastPhase = currentPage === stepsData.length - 1
              const isLastStep = index === stepsData[currentPage].length - 1
              const isLastStepOfLastPhase = isLastPhase && isLastStep
              const canUpdateStep = canUpdate && isLastStepOfLastPhase

              return (
                <View key={index.toString()}>
                  <StepComponent
                    title={item.title}
                    progress={item.progress}
                    instructions={item.instructions}
                  />
                  {item.actions.map((action, index) => {
                    const isFirstAction = index === 0
                    const isPreviousActionDone = index > 0 && item.actions[index - 1].status === 'done' 
                    const isActionPending = action.status === 'pending'
                    const canUpdateAction = canUpdateStep && (isFirstAction || isPreviousActionDone) && isActionPending
                    return this.props.renderAction(canUpdateAction, action)
                  })
                  }
                </View>
              )
            })
            }
          </ScrollView>
        </View>
      </View >
    )
  }
}

export default withNavigation(ProcessContainer)
