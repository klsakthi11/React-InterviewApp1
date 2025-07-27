import { useState, useEffect, useRef } from 'react';

// Simple Chart Component
interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  width?: number;
  height?: number;
  title?: string;
}

export const Chart = ({
  data,
  type,
  width = 400,
  height = 300,
  title,
}: ChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    const maxValue = Math.max(...data.map(d => d.value));
    const colors = [
      '#3b82f6',
      '#ef4444',
      '#10b981',
      '#f59e0b',
      '#8b5cf6',
      '#06b6d4',
      '#84cc16',
      '#f97316',
      '#ec4899',
      '#6366f1',
    ];

    switch (type) {
      case 'bar':
        drawBarChart(ctx, data, maxValue, colors, width, height);
        break;
      case 'line':
        drawLineChart(ctx, data, maxValue, colors, width, height);
        break;
      case 'pie':
        drawPieChart(ctx, data, colors, width, height);
        break;
      case 'doughnut':
        drawDoughnutChart(ctx, data, colors, width, height);
        break;
    }
  }, [data, type, width, height]);

  const drawBarChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    maxValue: number,
    colors: string[],
    width: number,
    height: number
  ) => {
    const barWidth = (width - 100) / data.length;
    const barHeight = height - 80;
    const startX = 50;
    const startY = height - 40;

    // Draw bars
    data.forEach((item, index) => {
      const barHeightRatio = item.value / maxValue;
      const barHeightPx = barHeightRatio * barHeight;
      const x = startX + index * barWidth;
      const y = startY - barHeightPx;

      ctx.fillStyle = item.color || colors[index % colors.length];
      ctx.fillRect(x, y, barWidth - 10, barHeightPx);

      // Draw label
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + barWidth / 2 - 5, startY + 15);
    });

    // Draw value labels
    data.forEach((item, index) => {
      const barHeightRatio = item.value / maxValue;
      const barHeightPx = barHeightRatio * barHeight;
      const x = startX + index * barWidth;
      const y = startY - barHeightPx;

      ctx.fillStyle = '#374151';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), x + barWidth / 2 - 5, y - 5);
    });
  };

  const drawLineChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    maxValue: number,
    colors: string[],
    width: number,
    height: number
  ) => {
    const chartWidth = width - 80;
    const chartHeight = height - 80;
    const startX = 40;
    const startY = height - 40;

    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((item, index) => {
      const x = startX + (index / (data.length - 1)) * chartWidth;
      const y = startY - (item.value / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw point
      ctx.fillStyle = colors[0];
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.stroke();
  };

  const drawPieChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    colors: string[],
    width: number,
    height: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;

      ctx.fillStyle = item.color || colors[index % colors.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        currentAngle,
        currentAngle + sliceAngle
      );
      ctx.closePath();
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelRadius = radius + 20;
      const labelX = centerX + Math.cos(labelAngle) * labelRadius;
      const labelY = centerY + Math.sin(labelAngle) * labelRadius;

      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, labelX, labelY);

      currentAngle += sliceAngle;
    });
  };

  const drawDoughnutChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    colors: string[],
    width: number,
    height: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 3;
    const innerRadius = outerRadius * 0.6;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;

      ctx.fillStyle = item.color || colors[index % colors.length];
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        outerRadius,
        currentAngle,
        currentAngle + sliceAngle
      );
      ctx.arc(
        centerX,
        centerY,
        innerRadius,
        currentAngle + sliceAngle,
        currentAngle,
        true
      );
      ctx.closePath();
      ctx.fill();

      currentAngle += sliceAngle;
    });
  };

  return (
    <div
      style={{
        background: 'white',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {title && (
        <h3
          style={{
            margin: '0 0 1rem 0',
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            textAlign: 'center',
          }}
        >
          {title}
        </h3>
      )}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          margin: '0 auto',
        }}
      />
    </div>
  );
};

// Progress Ring Component
interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
  label,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
      </svg>
      {label && (
        <div
          style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: color,
        }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
};

// Heatmap Component
interface HeatmapData {
  date: string;
  value: number;
}

interface HeatmapProps {
  data: HeatmapData[];
  width?: number;
  height?: number;
  title?: string;
}

export const Heatmap = ({
  data,
  width = 800,
  height = 200,
  title,
}: HeatmapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Group data by week
    const weeks: { [key: string]: number[] } = {};
    data.forEach(item => {
      const date = new Date(item.date);
      const weekKey = `${date.getFullYear()}-W${Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)}`;
      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(item.value);
    });

    const maxValue = Math.max(...data.map(d => d.value));
    const cellSize = 20;
    const cellSpacing = 2;
    const startX = 100;
    const startY = 30;

    // Draw heatmap cells
    Object.entries(weeks).forEach(([week, values], weekIndex) => {
      const avgValue =
        values.reduce((sum, val) => sum + val, 0) / values.length;
      const intensity = avgValue / maxValue;

      const color = `rgba(59, 130, 246, ${intensity})`;
      const x = startX + weekIndex * (cellSize + cellSpacing);
      const y = startY;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, cellSize, cellSize);

      // Draw value
      ctx.fillStyle = intensity > 0.5 ? 'white' : '#374151';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        Math.round(avgValue).toString(),
        x + cellSize / 2,
        y + cellSize / 2 + 3
      );
    });

    // Draw week labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    Object.keys(weeks).forEach((week, index) => {
      const x = startX + index * (cellSize + cellSpacing) + cellSize / 2;
      ctx.fillText(week, x, startY + cellSize + 15);
    });
  }, [data, width, height]);

  return (
    <div
      style={{
        background: 'white',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {title && (
        <h3
          style={{
            margin: '0 0 1rem 0',
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h3>
      )}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          margin: '0 auto',
        }}
      />
    </div>
  );
};

// Sparkline Component
interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showPoints?: boolean;
}

export const Sparkline = ({
  data,
  width = 200,
  height = 50,
  color = '#3b82f6',
  showPoints = false,
}: SparklineProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    if (data.length < 2) return;

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    const stepX = width / (data.length - 1);
    const startY = height - 10;

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = index * stepX;
      const y = startY - ((value - minValue) / range) * (height - 20);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw points
      if (showPoints) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    ctx.stroke();
  }, [data, width, height, color, showPoints]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
      }}
    />
  );
};

// Data Visualization Dashboard
export const DataVisualizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('progress');

  const progressData: ChartData[] = [
    { label: 'Beginner', value: 85, color: '#10b981' },
    { label: 'Intermediate', value: 65, color: '#f59e0b' },
    { label: 'Advanced', value: 45, color: '#ef4444' },
    { label: 'Expert', value: 25, color: '#8b5cf6' },
  ];

  const timeData: ChartData[] = [
    { label: 'Mon', value: 120 },
    { label: 'Tue', value: 90 },
    { label: 'Wed', value: 150 },
    { label: 'Thu', value: 80 },
    { label: 'Fri', value: 200 },
    { label: 'Sat', value: 180 },
    { label: 'Sun', value: 100 },
  ];

  const heatmapData: HeatmapData[] = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    value: Math.floor(Math.random() * 100),
  }));

  const sparklineData = [10, 25, 15, 30, 20, 35, 25, 40, 30, 45];

  return (
    <div
      style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2
        style={{
          margin: '0 0 1.5rem 0',
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
        }}
      >
        📊 Data Visualization Dashboard
      </h2>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {[
          { id: 'progress', label: 'Progress' },
          { id: 'time', label: 'Time Tracking' },
          { id: 'activity', label: 'Activity' },
          { id: 'trends', label: 'Trends' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              background:
                activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab.id ? '600' : '500',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '400px' }}>
        {activeTab === 'progress' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <Chart data={progressData} type="bar" title="Progress by Level" />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <ProgressRing progress={75} label="Overall Progress" />
              <ProgressRing progress={60} label="This Week" color="#f59e0b" />
              <ProgressRing progress={85} label="Streak" color="#10b981" />
            </div>
          </div>
        )}

        {activeTab === 'time' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <Chart
              data={timeData}
              type="line"
              title="Daily Study Time (minutes)"
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Average Time
                </div>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                  }}
                >
                  132 min/day
                </div>
              </div>
              <Sparkline data={sparklineData} width={150} height={40} />
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <Heatmap data={heatmapData} title="30-Day Activity Heatmap" />
        )}

        {activeTab === 'trends' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <Chart
              data={progressData}
              type="doughnut"
              title="Skill Distribution"
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Most Studied
                </div>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                  }}
                >
                  React Hooks
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Weakest Area
                </div>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                  }}
                >
                  Advanced Patterns
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataVisualizationDashboard;
