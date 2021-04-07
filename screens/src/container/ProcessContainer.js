/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import PhaseComponent from '../components/PhaseComponent';
import StepComponent from '../components/StepComponent';
import ActionComponent from '../components/ActionComponent';
import processModel from '../processModel.json';

export default function ProcessContainer() {
  const [currentPage, setCurrentPage] = useState(0);
  const [phaseLabel, setPhaseLabel] = useState([]);
  const [phaseStatus, setPhaseStatus] = useState([]);
  const [stepsData, setStepsData] = useState([]);

  useEffect(() => {
    let phaseLabel = [];
    let phaseStatus = [];
    let steps = [];
   
    for (let k in processModel) {
      const processData = processModel[k];
      phaseLabel.push(processData.title);
      phaseStatus.push(processData.status);
      let phaseStep = [];
      for (let k1 in processData.steps) {
        let step = processData.steps[k1];
        let actions = [];
        let actionsDoneCount = 0
        for (let k2 in step.actions) {
          actions.push(step.actions[k2]);
          if (step.actions[k2].status === 'done')
            actionsDoneCount += 1
        }
        step.progress = actionsDoneCount / actions.length * 100;
        step.actions = actions;
        phaseStep.push(step);
      }
      steps.push(phaseStep);
    }

    setPhaseLabel(phaseLabel);
    setPhaseStatus(phaseStatus);
    setStepsData(steps);

  }, [processModel]);

  return (
    <View>
      {phaseLabel.length > 0 && (
        <PhaseComponent
          labels={phaseLabel}
          status={phaseStatus}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
      {stepsData.length > 0 && stepsData[currentPage].map((item, index) => {
        return (
          <View key={index.toString()}>
            <StepComponent
              title={item.title}
              progress={item.progress}
              instructions={item.instructions}
            />
            {item.actions.map((action, index) => {
              return (
                <ActionComponent
                  key={action.title}
                  title={action.title}
                  status={action.status}
                  instructions={action.instructions}
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
}
