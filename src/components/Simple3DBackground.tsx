import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Theme } from '../types';

interface Simple3DBackgroundProps {
  theme?: Theme;
}

export function Simple3DBackground({ theme = 'dark' }: Simple3DBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Depth Fog
    const scene = new THREE.Scene();
    const fogColor = theme === 'dark' ? 0x080706 : 0xfaf7f2;
    scene.fog = new THREE.FogExp2(fogColor, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 30);
    camera.position.set(0, 0.5, 6.0);

    // 3. Ultra-Smooth, Low-Power WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
      precision: 'mediump',
    });
    // Keep pixel ratio at 1.0 to eliminate high-res GPU heating and stutter
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 4. Balanced Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(theme === 'dark' ? 0x2a2218 : 0xede4d3, 2.2);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xffdf99, 2.8);
    goldKeyLight.position.set(3, 4, 3);
    scene.add(goldKeyLight);

    const warmFillLight = new THREE.DirectionalLight(0xb87333, 1.4);
    warmFillLight.position.set(-3, -1, 2);
    scene.add(warmFillLight);

    // -----------------------------------------------------------
    // 3D SERVICE CLOCHE & PLATTER (Low polygon, fast hardware rendering)
    // -----------------------------------------------------------
    const clocheGroup = new THREE.Group();
    const isMobile = width < 768;
    clocheGroup.position.set(isMobile ? 0 : 1.5, -0.2, 0);
    scene.add(clocheGroup);

    // Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3ce72,
      metalness: 0.88,
      roughness: 0.28,
    });

    const platinumMaterial = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0x221f1c : 0x7a6e5e,
      metalness: 0.8,
      roughness: 0.35,
    });

    // 1. Serving Platter Rim
    const platterRimGeo = new THREE.TorusGeometry(1.6, 0.05, 10, 32);
    const platterRim = new THREE.Mesh(platterRimGeo, goldMaterial);
    platterRim.rotation.x = Math.PI / 2;
    platterRim.position.y = -0.5;
    clocheGroup.add(platterRim);

    // 2. Serving Platter Base
    const platterBaseGeo = new THREE.CylinderGeometry(1.58, 1.5, 0.08, 32);
    const platterBase = new THREE.Mesh(platterBaseGeo, platinumMaterial);
    platterBase.position.y = -0.52;
    clocheGroup.add(platterBase);

    // 3. Cloche Dome (Hemisphere)
    const domeGeo = new THREE.SphereGeometry(
      1.25,
      24,
      16,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.5
    );
    const dome = new THREE.Mesh(domeGeo, goldMaterial);
    dome.position.y = -0.48;
    clocheGroup.add(dome);

    // 4. Cloche Dome Lip Rim
    const domeRimGeo = new THREE.TorusGeometry(1.26, 0.035, 8, 28);
    const domeRim = new THREE.Mesh(domeRimGeo, goldMaterial);
    domeRim.rotation.x = Math.PI / 2;
    domeRim.position.y = -0.48;
    clocheGroup.add(domeRim);

    // 5. Cloche Handle / Finial Ring
    const handleRingGeo = new THREE.TorusGeometry(0.18, 0.03, 8, 20);
    const handleRing = new THREE.Mesh(handleRingGeo, goldMaterial);
    handleRing.position.y = 0.96;
    clocheGroup.add(handleRing);

    // 6. Finial Base
    const finialBaseGeo = new THREE.CylinderGeometry(0.14, 0.08, 0.16, 12);
    const finialBase = new THREE.Mesh(finialBaseGeo, platinumMaterial);
    finialBase.position.y = 0.82;
    clocheGroup.add(finialBase);

    // 7. Subtle Michelin Orbit Ring
    const orbitRingGeo = new THREE.TorusGeometry(2.3, 0.015, 6, 36);
    const orbitRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: theme === 'dark' ? 0.35 : 0.5,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMaterial);
    orbitRing.rotation.x = 1.1;
    orbitRing.rotation.y = 0.3;
    clocheGroup.add(orbitRing);

    // 8. 3 Michelin Star Points
    const starGeo = new THREE.TetrahedronGeometry(0.08, 0);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffe699 });
    for (let i = 0; i < 3; i++) {
      const star = new THREE.Mesh(starGeo, starMaterial);
      const angle = (i * Math.PI * 2) / 3;
      star.position.set(Math.cos(angle) * 2.3, Math.sin(angle) * 0.4, Math.sin(angle) * 2.3);
      clocheGroup.add(star);
    }

    // Direct passive mouse listener on window: 0 React re-renders!
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // -----------------------------------------------------------
    // Animation Loop with Smart Idle Optimization
    // -----------------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isVisible = true;
    let isScrolledPast = false;

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Pause rendering if user scrolls far down (past 1.6 screen heights) to free up 100% GPU
    const checkScrollPosition = () => {
      isScrolledPast = window.scrollY > window.innerHeight * 1.6;
    };
    window.addEventListener('scroll', checkScrollPosition, { passive: true });

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip render if tab hidden or scrolled out of view
      if (!isVisible || isScrolledPast) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse easing without triggering React renders
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Gentle floating levitation
      clocheGroup.position.y = -0.2 + Math.sin(elapsedTime * 0.8) * 0.08;

      // Smooth interactive perspective tilt
      clocheGroup.rotation.y = elapsedTime * 0.15 + mouseRef.current.x * 0.35;
      clocheGroup.rotation.x = mouseRef.current.y * 0.22;

      // Rotate orbit ring
      orbitRing.rotation.z = elapsedTime * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      clocheGroup.position.x = width < 768 ? 0 : 1.5;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [theme]);

  return <div ref={containerRef} className="w-full h-full pointer-events-none" />;
}
