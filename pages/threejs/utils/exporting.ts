import { Object3D } from "three";
//@ts-ignore
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";

export default function exportToGLTF(scene: Object3D) {
  const gltfExporter = new GLTFExporter();
  gltfExporter.parse(
    scene,
    function (result: any) {
      console.log("PARSED");

      const output = JSON.stringify(result, null, 2);
      saveString(output, "scene.gltf");
    },
    function (error: any) {
      console.log("An error happened during parsing", error);
    }
  );
}

function save(blob: Blob, filename: string) {
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function saveString(text: string, filename: string) {
  save(new Blob([text], { type: "text/plain" }), filename);
}
function saveArrayBuffer(buffer: any, filename: string) {
  save(new Blob([buffer], { type: "application/octet-stream" }), filename);
}
