/**
 * Three.js — showcase section only (hero uses void-radial.png image)
 */
(function () {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  function initHeroScene() {
    return null;
  }

  function initShowcaseScene() {
    const canvas = document.getElementById("showcaseCanvas");
    if (!canvas || typeof THREE === "undefined") return;

    const container = canvas.parentElement;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1, 0.3, 128, 16),
      new THREE.MeshStandardMaterial({
        color: 0x581c87,
        emissive: 0x7c3aed,
        emissiveIntensity: 0.4,
        metalness: 0.8,
        roughness: 0.2,
      })
    );
    scene.add(knot);

    const light = new THREE.PointLight(0xc084fc, 3, 20);
    light.position.set(3, 3, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x1a0a2e, 0.5));

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      knot.rotation.x = t * 0.3;
      knot.rotation.y = t * 0.2;
      renderer.render(scene, camera);
    }

    animate();

    function onResize() {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    }

    window.addEventListener("resize", onResize);
  }

  window.VoidScenes = {
    initHero: initHeroScene,
    initShowcase: initShowcaseScene,
  };
})();
