/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import _ from 'lodash'
import { withNavigation } from 'react-navigation'
import PhaseComponent from '../components/PhaseComponent';
import StepComponent from '../components/StepComponent';
import ProcessAction from '../../../components/ProcessAction';
import { constants } from '../../../core/constants';
import * as theme from '../../../core/theme';
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

    console.log("Phaselabels", phaseLabels)

    return (
      <View style={{ flex: 1 }}>
        {phaseLabels.length > 0 &&
          <PhaseComponent
            labels={phaseLabels}
            status={phaseStatuses}
            currentPage={currentPage}
            setCurrentPage={(currentPage) => this.setState({ currentPage })}
          />
        }

        <View style={{ flex: 1, marginTop: theme.padding }}>
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
                    children={
                      <View style={{ marginLeft: constants.ScreenWidth * 0.035, paddingBottom: 15, borderLeftWidth: index !== stepsData[currentPage].length - 1 ? 2 : 0, borderLeftColor: theme.colors.gray_light }}>
                        {item.actions.map((action, index) => {
                          const actionStyle = { mainColor: theme.colors.gray_dark, textFont: theme.customFontMSregular.caption, marginVertical: 50 }
                          const isFirstAction = index === 0
                          const isPreviousActionDone = index > 0 && item.actions[index - 1].status === 'done'
                          const isActionPending = action.status === 'pending'
                          const canUpdateAction = canUpdateStep && (isFirstAction || isPreviousActionDone) && isActionPending
                          return this.props.renderAction(false, action, actionStyle, { marginVertical: theme.padding / 2 })
                        })
                        }
                      </View>
                    }
                  />
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
