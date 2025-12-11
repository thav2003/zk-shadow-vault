import { useEffect, useRef } from "react";

const CircuitBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Circuit nodes
    const nodes: {
      x: number;
      y: number;
      connections: number[];
      pulse: number;
    }[] = [];
    const nodeCount = 30;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        connections: [],
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Create connections
    nodes.forEach((node, i) => {
      const distances = nodes
        .map((other, j) => ({
          index: j,
          dist: Math.hypot(other.x - node.x, other.y - node.y),
        }))
        .filter((d) => d.index !== i && d.dist < 250)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);

      node.connections = distances.map((d) => d.index);
    });

    // Data packets
    const packets: {
      fromNode: number;
      toNode: number;
      progress: number;
      speed: number;
    }[] = [];

    const createPacket = () => {
      const fromNode = Math.floor(Math.random() * nodes.length);
      const node = nodes[fromNode];
      if (node.connections.length > 0) {
        const toNode =
          node.connections[Math.floor(Math.random() * node.connections.length)];
        packets.push({
          fromNode,
          toNode,
          progress: 0,
          speed: 0.005 + Math.random() * 0.01,
        });
      }
    };

    // Initial packets
    for (let i = 0; i < 10; i++) {
      createPacket();
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.fillStyle = "rgba(12, 12, 20, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach((j) => {
          const other = nodes[j];
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = "rgba(0, 240, 255, 0.1)";
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        node.pulse += 0.02;
        const glow = Math.sin(node.pulse) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${glow})`;
        ctx.fill();

        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${glow * 0.3})`;
        ctx.fill();
      });

      // Draw and update packets
      packets.forEach((packet, i) => {
        packet.progress += packet.speed;

        if (packet.progress >= 1) {
          packet.fromNode = packet.toNode;
          const node = nodes[packet.fromNode];
          if (node.connections.length > 0) {
            packet.toNode =
              node.connections[
                Math.floor(Math.random() * node.connections.length)
              ];
            packet.progress = 0;
          }
        }

        const from = nodes[packet.fromNode];
        const to = nodes[packet.toNode];
        const x = from.x + (to.x - from.x) * packet.progress;
        const y = from.y + (to.y - from.y) * packet.progress;

        // Packet glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        gradient.addColorStop(0, "rgba(0, 240, 255, 0.8)");
        gradient.addColorStop(0.5, "rgba(255, 0, 170, 0.3)");
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#00F0FF";
        ctx.fill();
      });

      // Occasionally add new packets
      if (Math.random() < 0.02 && packets.length < 20) {
        createPacket();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default CircuitBackground;
