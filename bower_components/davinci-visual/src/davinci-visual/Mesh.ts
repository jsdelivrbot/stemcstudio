/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="../../vendor/davinci-blade/dist/davinci-blade.d.ts"/>
module visual {
    /**
     * Visual provides the common behavior for all Mesh (Geometry, Material) objects.
     */
    export class Mesh<G extends THREE.Geometry, M extends THREE.Material> extends THREE.Mesh
    {
      public geometry: G;
      public material: M;
      constructor(geometry: G, material: M)
      {
        this.geometry = geometry;
        this.material = material;
        super(geometry, this.material);
      }
      get pos(): blade.Euclidean3 {
        var position = this.position;
        return new blade.Euclidean3(0, position.x, position.y, position.z, 0, 0, 0, 0);
      }
      set pos(vector: blade.Euclidean3) {
        this.position.set(vector.x, vector.y, vector.z);
      }
      get attitude(): blade.Euclidean3 {
        var q = this.quaternion;
        return new blade.Euclidean3(q.w, 0, 0, 0, -q.z, -q.x, -q.y, 0);
      }
      set attitude(rotor: blade.Euclidean3) {
        this.quaternion.set(-rotor.yz, -rotor.zx, -rotor.xy, rotor.w);
      }
    }
}
