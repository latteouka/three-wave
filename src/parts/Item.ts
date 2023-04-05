import * as THREE from "three";
import vertex from "../glsl/item.vert";
import fragment from "../glsl/item.frag";
import { MyObject3D } from "../webgl/myObject3D";
import { Update } from "../libs/update";
import { Func } from "../core/func";

export class Item extends MyObject3D {
  private _mesh: THREE.Mesh;
  constructor() {
    super();

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        u_time: { value: Update.instance.elapsed },
      },
    });

    this._mesh = new THREE.Mesh(geometry, material);
    this._mesh.scale.set(Func.instance.sw(), Func.instance.sh(), 1);
    this.add(this._mesh);
  }

  protected _update(): void {
    super._update();
  }

  protected _resize(): void {
    super._resize();
    this._mesh.scale.set(Func.instance.sw(), Func.instance.sh(), 1);
  }
}
