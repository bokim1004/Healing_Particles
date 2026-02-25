import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 2200;

const VERTEX_SHADER = `
    attribute vec3 color;
    varying vec3 vColor;
    void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = (9.0 * (90.0 / -mv.z));
        gl_Position = projectionMatrix * mv;
    }
`;

const FRAGMENT_SHADER = `
    varying vec3 vColor;
    void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        if (d > 1.0) discard;
        
        float alpha = 1.0 - smoothstep(0.0, 1.0, d);
        alpha *= 0.75;
        
        float glow = 1.0 - d * 0.7;
        vec3 warmColor = vColor * (1.0 + glow * 0.4);
        
        gl_FragColor = vec4(warmColor, alpha);
    }
`;

function createParticles(emotionData) {
    const posArr = new Float32Array(PARTICLE_COUNT * 3);
    const colArr = new Float32Array(PARTICLE_COUNT * 3);
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const r = 4.5 + Math.random() * 5.5;
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = (Math.random() - 0.5) * 6;

        posArr[i * 3] = x;
        posArr[i * 3 + 1] = y;
        posArr[i * 3 + 2] = z;

        const initialColor = emotionData.initial[Math.floor(Math.random() * emotionData.initial.length)];
        const healedColor = emotionData.healed[Math.floor(Math.random() * emotionData.healed.length)];

        particles.push({
            x, y, z,
            speed: 0.15 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2,
            prevX: x,
            prevY: y,
            prevZ: z,
            initialColor: [...initialColor],
            healedColor: [...healedColor],
        });

        colArr[i * 3] = initialColor[0];
        colArr[i * 3 + 1] = initialColor[1];
        colArr[i * 3 + 2] = initialColor[2];
    }

    return { posArr, colArr, particles };
}

function createGatherTargets(particles) {
    const golden = (1 + Math.sqrt(5)) / 2;
    return particles.map((_, i) => {
        const th = 2 * Math.PI * i / golden;
        const ph = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
        const tr = 0.5 + Math.random() * 1.5;
        return {
            x: tr * Math.sin(ph) * Math.cos(th),
            y: tr * Math.sin(ph) * Math.sin(th),
            z: tr * Math.cos(ph),
        };
    });
}

export function useParticleScene(containerRef, phase, emotionData, stateRef) {
    const sceneRef = useRef(null);

    useEffect(() => {
        if (phase === "input" || !emotionData) return;

        const container = containerRef.current;
        if (!container) return;

        // --- Scene ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.background = new THREE.Color(0x000000);

        const camera = new THREE.PerspectiveCamera(
            55,
            container.clientWidth / container.clientHeight,
            0.1,
            100
        );
        camera.position.z = 11;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // --- Particles ---
        const { posArr, colArr, particles } = createParticles(emotionData);
        const targets = createGatherTargets(particles);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colArr, 3));

        // --- Trail Lines ---
        const trailGeo = new THREE.BufferGeometry();
        const trailPos = new Float32Array(PARTICLE_COUNT * 2 * 3);
        const trailCol = new Float32Array(PARTICLE_COUNT * 2 * 3);
        trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
        trailGeo.setAttribute("color", new THREE.BufferAttribute(trailCol, 3));

        const trailMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending,
        });

        const trails = new THREE.LineSegments(trailGeo, trailMat);
        scene.add(trails);

        // --- Shader Material ---
        const mat = new THREE.ShaderMaterial({
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const points = new THREE.Points(geometry, mat);
        scene.add(points);

        // --- Animation Loop ---
        let animId;
        const clock = new THREE.Clock();

        function animate() {
            animId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime() * 0.8;
            const pos = geometry.attributes.position.array;
            const col = geometry.attributes.color.array;
            const tPos = trailGeo.attributes.position.array;
            const tCol = trailGeo.attributes.color.array;

            const st = stateRef.current;

            // Gathering progress
            st.progress += (st.target - st.progress) * 0.02;
            const p = st.progress;
            const s = p * p * (3 - 2 * p);

            // Color healing progress (only in breathing phase)
            if (phase === "breathing") {
                st.colorProgress += 0.003;
                if (st.colorProgress > 1) st.colorProgress = 1;
            }

            // Release phase - fade out (negative emotions)
            let releaseFade = 1.0;
            if (phase === "release") {
                st.colorProgress += 0.008;
                releaseFade = 1.0 - Math.min(st.colorProgress, 1.0);
            }

            // Amplify phase - glow brighter (positive emotions)
            let amplifyGlow = 1.0;
            if (phase === "amplify") {
                st.colorProgress += 0.005;
                if (st.colorProgress > 1) st.colorProgress = 1;
                amplifyGlow = 1.0 + st.colorProgress * 0.5;
            }

            points.rotation.y = t * 0.05;
            trails.rotation.y = t * 0.05;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const pd = particles[i];
                const tgt = targets[i];

                const fx = Math.sin(t * pd.speed + pd.phase) * 1.5;
                const fy = Math.cos(t * pd.speed * 0.8 + pd.phase) * 1.5;
                const fz = Math.sin(t * pd.speed * 1.2 + pd.phase) * 1.5;

                const sx = pd.x + fx;
                const sy = pd.y + fy;
                const sz = pd.z + fz;

                const wave = Math.sin(t * 0.6 + i * 0.02) * 0.4;
                const pulse = Math.sin(t * 0.8 + pd.phase) * 0.3;
                const gx = tgt.x * (1.0 + pulse * 0.15) + fx * 0.1 + wave * Math.cos(pd.phase);
                const gy = tgt.y * (1.0 + pulse * 0.15) + fy * 0.1 + wave * Math.sin(pd.phase);
                const gz = tgt.z * (1.0 + pulse * 0.15) + fz * 0.1 + wave * 0.5;

                let px, py, pz;

                if (phase === "release") {
                    const expandFactor = 1.0 + st.colorProgress * 3.0;
                    px = gx * expandFactor;
                    py = gy * expandFactor;
                    pz = gz * expandFactor;
                } else if (phase === "amplify") {
                    const ampPulse = Math.sin(t * 1.2) * 0.15;
                    px = gx * (1.0 + ampPulse);
                    py = gy * (1.0 + ampPulse);
                    pz = gz * (1.0 + ampPulse);
                } else if (phase === "peace") {
                    const peacePulse = Math.sin(t * 0.5 + pd.phase) * 0.1;
                    px = gx * (1.0 + peacePulse);
                    py = gy * (1.0 + peacePulse);
                    pz = gz * (1.0 + peacePulse);
                } else {
                    px = sx + (gx - sx) * s;
                    py = sy + (gy - sy) * s;
                    pz = sz + (gz - sz) * s;
                }

                pos[i * 3] = px;
                pos[i * 3 + 1] = py;
                pos[i * 3 + 2] = pz;

                // Color transition
                const cp = st.colorProgress;
                col[i * 3] = pd.initialColor[0] + (pd.healedColor[0] - pd.initialColor[0]) * cp;
                col[i * 3 + 1] = pd.initialColor[1] + (pd.healedColor[1] - pd.initialColor[1]) * cp;
                col[i * 3 + 2] = pd.initialColor[2] + (pd.healedColor[2] - pd.initialColor[2]) * cp;

                // Apply fade in release phase
                col[i * 3] *= releaseFade;
                col[i * 3 + 1] *= releaseFade;
                col[i * 3 + 2] *= releaseFade;

                // Apply glow in amplify phase
                col[i * 3] *= amplifyGlow;
                col[i * 3 + 1] *= amplifyGlow;
                col[i * 3 + 2] *= amplifyGlow;

                tPos[i * 6] = px;
                tPos[i * 6 + 1] = py;
                tPos[i * 6 + 2] = pz;
                tPos[i * 6 + 3] = pd.prevX;
                tPos[i * 6 + 4] = pd.prevY;
                tPos[i * 6 + 5] = pd.prevZ;

                tCol[i * 6] = col[i * 3];
                tCol[i * 6 + 1] = col[i * 3 + 1];
                tCol[i * 6 + 2] = col[i * 3 + 2];
                tCol[i * 6 + 3] = 0;
                tCol[i * 6 + 4] = 0;
                tCol[i * 6 + 5] = 0;

                pd.prevX += (px - pd.prevX) * 0.3;
                pd.prevY += (py - pd.prevY) * 0.3;
                pd.prevZ += (pz - pd.prevZ) * 0.3;
            }

            geometry.attributes.position.needsUpdate = true;
            geometry.attributes.color.needsUpdate = true;
            trailGeo.attributes.position.needsUpdate = true;
            trailGeo.attributes.color.needsUpdate = true;

            renderer.render(scene, camera);
        }

        animate();

        const onResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", onResize);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [phase, emotionData]);

    return sceneRef;
}
