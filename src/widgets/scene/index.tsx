/* eslint-disable react/no-unknown-property */
import { useRef, useState, useEffect } from "react";

import {
  Text,
  useGLTF,
  Sparkles,
  // OrbitControls,
  // PrimitiveProps,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  Glitch,
  GodRays,
  EffectComposer,
} from "@react-three/postprocessing";
import { useUnit } from "effector-react";
import gsap from "gsap";
import * as THREE from "three";

import { $words } from "./model";

const TRANSITION_DURATION = 1.0; // seconds
const WORD_SIZE = 2; // увеличиваем размер слов
const WORD_SPACING = 50; // расстояние между словами

// Компонент для настройки фона и обработки контекста
const SceneSetup = () => {
  const { scene, gl } = useThree();
  const particleSystemRef = useRef<null | THREE.Points>(null);

  useEffect(() => {
    // Create a dynamic gradient background
    const gradientTexture = new THREE.CanvasTexture(
      (() => {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");
        if (!ctx) return canvas;

        const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
        gradient.addColorStop(0, "#1a1a1a");
        gradient.addColorStop(0.5, "#2a2a2a");
        gradient.addColorStop(1, "#1a1a1a");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1024, 1024);
        return canvas;
      })(),
    );
    scene.background = gradientTexture;

    // Add ambient particles
    const particles = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      colors[i * 3] = Math.random() * 0.5 + 0.5;
      colors[i * 3 + 1] = Math.random() * 0.5 + 0.5;
      colors[i * 3 + 2] = Math.random() * 0.5 + 0.5;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    particleSystemRef.current = particleSystem;
    scene.add(particleSystem);

    return () => {
      scene.remove(particleSystem);
    };
  }, [scene, gl]);

  useFrame(() => {
    if (particleSystemRef.current) {
      particleSystemRef.current.rotation.y += 0.001;
    }
  });

  return null;
};

const Burger = () => {
  const { scene } = useGLTF("/assets/burger.glb");
  const ref = useRef<THREE.Object3D>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
    }
  });
  return (
    <primitive
      ref={ref}
      object={scene}
      scale={[5, 5, 5]}
      position={[0, 4.2, 0]}
    />
  );
};

type WordProps = {
  text: string;
  isActive: boolean;
  position: THREE.Vector3;
};

const getWordPosition = (index: number) => {
  // Размещаем слова последовательно по горизонтали
  return new THREE.Vector3(index * WORD_SPACING, 0, 0);
};

const Word = ({ text, position }: WordProps) => {
  const ref = useRef<THREE.Object3D>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <Text
        ref={ref}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        letterSpacing={0}
        position={position}
        fontSize={WORD_SIZE}
        material-transparent={true}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        font="/assets/fonts/RubikMonoOne-Regular.ttf"
      >
        {text}
      </Text>
      {hovered && (
        <Sparkles
          size={3}
          count={20}
          scale={0.5}
          speed={0.2}
          color="#39FF14"
          position={position}
        />
      )}
    </>
  );
};

// Компонент для управления камерой
const CameraController = () => {
  const { camera } = useThree();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Обработчик движения мыши
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Нормализуем координаты мыши от -1 до 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Обновление позиции камеры в зависимости от положения мыши
  useFrame(() => {
    // Плавное смещение камеры
    const targetX = mousePosition.x * 0.5; // Максимальное смещение по X
    const targetY = mousePosition.y * 0.5; // Максимальное смещение по Y

    // Плавная интерполяция текущей позиции к целевой
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;

    // Камера всегда смотрит на центр сцены
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const CustomCursor = () => {
  const cursorRef = useRef<THREE.Mesh>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (cursorRef.current) {
      cursorRef.current.position.x +=
        (mousePosition.x * 3 - cursorRef.current.position.x) * 0.1;
      cursorRef.current.position.y +=
        (mousePosition.y * 3 - cursorRef.current.position.y) * 0.1;
    }
  });

  return (
    <mesh ref={cursorRef} renderOrder={1}>
      <circleGeometry args={[0.05, 32]} />
      <meshBasicMaterial color="#39FF14" depthTest={false} />
    </mesh>
  );
};

export const AppScene = () => {
  const words = useUnit($words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const burgerRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Mesh>(null!);

  const handleScroll = (deltaY: number) => {
    if (isTransitioning) return;

    const direction = deltaY > 0 ? 1 : -1;
    const nextIndex = (currentIndex + direction + words.length) % words.length;

    setIsTransitioning(true);

    if (groupRef.current && burgerRef.current) {
      // Анимация перемещения слов по горизонтали
      gsap.to(groupRef.current.position, {
        x: -nextIndex * WORD_SPACING,
        duration: TRANSITION_DURATION,
        ease: "power2.inOut",
        onComplete: () => {
          setIsTransitioning(false);
          setCurrentIndex(nextIndex);
        },
      });

      // Вращение бургера
      gsap.to(burgerRef.current.rotation, {
        y: burgerRef.current.rotation.y + (direction * Math.PI) / 2,
        duration: TRANSITION_DURATION,
        ease: "power2.inOut",
      });
    }
  };

  useEffect(() => {
    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      handleScroll(e.deltaY);
    };

    window.addEventListener("wheel", handleWheelEvent, { passive: false });
    return () => window.removeEventListener("wheel", handleWheelEvent);
  }, [currentIndex, isTransitioning]);

  return (
    <>
      {/* <style>
        {`
          body {
            cursor: none;
          }
        `}
      </style> */}
      <Canvas>
        <PerspectiveCamera fov={50} makeDefault position={[0, 0, 10]} />
        <CameraController />
        {/* <CustomCursor /> */}

        <group>
          <SceneSetup />
          <ambientLight intensity={0.8} />
          <pointLight intensity={1} position={[10, 10, 10]} />
          <mesh ref={sunRef} visible={false} position={[10, 10, 10]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial color="white" />
          </mesh>
          <group ref={burgerRef}>
            <Burger />
          </group>
          <group ref={groupRef}>
            {words.map((word, index) => {
              const position = getWordPosition(index);
              return (
                <Word
                  key={index}
                  text={word}
                  position={position}
                  isActive={index === currentIndex}
                />
              );
            })}
          </group>
        </group>

        <EffectComposer>
          <Bloom
            height={200}
            intensity={0.5}
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
          />
          <Glitch
            delay={new THREE.Vector2(1.5, 3.5)}
            duration={new THREE.Vector2(0.2, 0.5)}
            strength={new THREE.Vector2(0.1, 0.2)}
          />
        </EffectComposer>
      </Canvas>
    </>
  );
};
