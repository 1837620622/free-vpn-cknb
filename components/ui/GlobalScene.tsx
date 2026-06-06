/**
 * 全站 3D 背景层：只做氛围，不承载信息，避免遮挡布局。
 */
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function GlobalScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.3, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const green = new THREE.Color('#76B900');
    const blue = new THREE.Color('#60A5FA');
    const cyan = new THREE.Color('#22D3EE');
    const graphite = new THREE.Color('#111827');

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.15, 2),
      new THREE.MeshBasicMaterial({ color: green, wireframe: true, transparent: true, opacity: 0.46 })
    );
    core.position.set(2.3, 0.55, -1.2);
    group.add(core);

    const ringGroup = new THREE.Group();
    ringGroup.position.copy(core.position);
    group.add(ringGroup);

    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(
          new THREE.EllipseCurve(0, 0, 2.35 + i * 0.45, 0.88 + i * 0.18, 0, Math.PI * 2, false, 0).getPoints(180)
        ),
        new THREE.LineBasicMaterial({
          color: [green, blue, cyan, green][i],
          transparent: true,
          opacity: 0.24 - i * 0.025,
        })
      );
      ring.rotation.x = Math.PI / 2.7;
      ring.rotation.y = i * 0.55;
      ringGroup.add(ring);
    }

    const count = 260;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 5.2;
      const theta = Math.random() * Math.PI * 2;
      const z = THREE.MathUtils.randFloatSpread(4.2);
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(3.2);
      positions[i * 3 + 2] = Math.sin(theta) * radius + z;
      const c = i % 6 === 0 ? green : i % 6 === 1 ? blue : graphite;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.48 })
    );
    group.add(particles);

    const resize = () => {
      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    resize();

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!reducedMotion) {
        const t = performance.now() * 0.001;
        core.rotation.x = t * 0.26;
        core.rotation.y = t * 0.34;
        ringGroup.rotation.y = t * 0.09;
        particles.rotation.y = -t * 0.025;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      mount.removeChild(renderer.domElement);
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      particlesGeometry.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="global-scene" aria-hidden />;
}
