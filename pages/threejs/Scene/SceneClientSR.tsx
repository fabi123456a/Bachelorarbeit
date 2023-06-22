import dynamic from "next/dynamic";

const Scene1 = dynamic(() => import("./Scene"), { ssr: false });

export default function MyPage(props: {
  controlsRef: React.RefObject<any>;
  models: TypeObjectProps[];
  currentObjectProps: TypeObjectProps;
  perspektive: string;
  setCurrentObjectProps: (props: TypeObjectProps) => void;
  sceneRef: any;
  wallVisibility: boolean;
  testMode: boolean;
  htmlSettings: boolean;
}) {
  return props.models ? (
    <div>
      {/* Andere Inhalte */}
      {/* ... */}

      {/* Clientseitig gerenderte Scene-Komponente */}
      <Scene1
        controlsRef={props.controlsRef}
        currentObjectProps={props.currentObjectProps}
        htmlSettings={props.htmlSettings}
        models={props.models}
        perspektive={props.perspektive}
        sceneRef={props.sceneRef}
        setCurrentObjectProps={props.setCurrentObjectProps}
        testMode={props.testMode}
        wallVisibility={props.wallVisibility}
      />
    </div>
  ) : null;
}
