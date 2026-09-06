import "./index.css";
import { Composition, Folder } from "remotion";
import { MyComposition } from "./Composition";
import { NeuralNetwork } from "./NeuralNetwork";
import { LLMTraining } from "./LLMTraining";
import { TOTAL_FRAMES } from "./LLMTraining/config";
import { ReActLoop } from "./ReActLoop";
import { TOTAL_FRAMES as REACT_TOTAL_FRAMES } from "./ReActLoop/config";
import { LLMParameterGrowth } from "./LLMParameterGrowth";
import { TOTAL_FRAMES as PARAM_TOTAL_FRAMES } from "./LLMParameterGrowth/config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
      <Folder name="Video-Series">
        <Composition
          id="NeuralNetwork"
          component={NeuralNetwork}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="LLMTraining"
          component={LLMTraining}
          durationInFrames={TOTAL_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ReActLoop"
          component={ReActLoop}
          durationInFrames={REACT_TOTAL_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="LLMParameterGrowth"
          component={LLMParameterGrowth}
          durationInFrames={PARAM_TOTAL_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
