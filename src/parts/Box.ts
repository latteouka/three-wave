import * as THREE from "three";
import vertex from "../glsl/box.vert";
import fragment from "../glsl/box.frag";
import { MyObject3D } from "../webgl/myObject3D";
import { Update } from "../libs/update";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TexLoader } from "../webgl/texLoader";

export class Box extends MyObject3D {
  mesh: THREE.InstancedMesh;
  material: THREE.ShaderMaterial;
  material2: THREE.MeshNormalMaterial;
  geo1 = new THREE.BufferGeometry();
  gltf = new GLTFLoader();
  dummy = new THREE.Object3D();

  constructor() {
    super();

    this.material2 = new THREE.MeshNormalMaterial();
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        u_time: { value: Update.instance.elapsed },
        u_matcap: {
          // value: TexLoader.instance.get("/img/sec3.png"),
          value: TexLoader.instance.get("/img/matcap3.png"),
          // value: TexLoader.instance.get("/img/sec3.png"),
        },
        u_scan: {
          value: TexLoader.instance.get("/img/scan2.jpeg"),
        },
      },
    });

    this.addObject();
  }

  async addObject() {
    const { scene } = (await this.gltf.loadAsync("/ob1.glb")) as any;
    this.geo1 = scene.children[0].geometry as THREE.BufferGeometry;

    const rows = 25;
    const count = rows * rows;

    this.mesh = new THREE.InstancedMesh(this.geo1, this.material, count);
    this.add(this.mesh);

    const random = new Float32Array(count);
    const number = new Float32Array(count);
    let index = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < rows; j++) {
        random[index] = Math.random();
        number[index] = index;
        this.dummy.position.set(i - rows / 2, -10, j - rows / 2);
        this.dummy.updateMatrix();
        this.mesh.setMatrixAt(index, this.dummy.matrix);
        index++;
      }
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.geometry.setAttribute(
      "a_random",
      new THREE.InstancedBufferAttribute(random, 1)
    );
    this.mesh.geometry.setAttribute(
      "a_number",
      new THREE.InstancedBufferAttribute(number, 1)
    );
  }

  protected _update(): void {
    super._update();
    this.material.uniforms.u_time.value = Update.instance.elapsed;
    this.rotation.y = Update.instance.elapsed / 50;
  }

  protected _resize(): void {
    super._resize();
  }
}
