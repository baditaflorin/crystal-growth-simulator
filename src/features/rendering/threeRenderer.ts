import type { SimulationFrame } from '../simulation';

export interface CrystalRenderer {
  update(frame: SimulationFrame): void;
  resize(): void;
  dispose(): void;
}

export async function createCrystalRenderer(canvas: HTMLCanvasElement): Promise<CrystalRenderer> {
  const THREE = await import('three');

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x08111f, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const texture = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      field: { value: texture },
      vignette: { value: 0.42 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D field;
      uniform float vignette;
      varying vec2 vUv;
      void main() {
        vec3 color = texture2D(field, vUv).rgb;
        float radius = distance(vUv, vec2(0.5));
        float edge = smoothstep(0.82, 0.18, radius);
        float scan = 0.018 * sin(vUv.y * 900.0);
        gl_FragColor = vec4(color * mix(1.0 - vignette, 1.08, edge) + scan, 1.0);
      }
    `
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  }

  resize();

  return {
    update(frame) {
      texture.image = {
        data: frame.pixels,
        width: frame.width,
        height: frame.height
      };
      texture.needsUpdate = true;
      renderer.render(scene, camera);
    },
    resize,
    dispose() {
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    }
  };
}
