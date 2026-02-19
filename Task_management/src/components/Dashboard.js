import './Dashboard.css';
import Chart from 'chart.js/auto';

export function Dashboard() {
  setTimeout(initCharts, 100);

  return `
    <div class="dashboard">
      <div class="title-section">
        <h1 class="dashboard-title">Executive Overview</h1>
        <p class="dashboard-subtitle">Real-time productivity insights and performance metrics.</p>
      </div>

      <!-- Stats Row -->
      <div class="stats-grid">
        <div class="stat-card indicator-purple">
          <div class="stat-header">
            <i data-lucide="layers" width="16"></i> Total Tasks
          </div>
          <div class="stat-value">64</div>
          <div class="stat-trend trend-up">
            <i data-lucide="trending-up" width="14"></i> +12% vs last week
          </div>
        </div>
        
        <div class="stat-card indicator-green">
          <div class="stat-header">
            <i data-lucide="check-circle" width="16"></i> Completion Rate
          </div>
          <div class="stat-value">87%</div>
          <div class="stat-trend trend-up">
            <i data-lucide="trending-up" width="14"></i> +5.2% efficiency
          </div>
        </div>

        <div class="stat-card indicator-orange">
          <div class="stat-header">
            <i data-lucide="clock" width="16"></i> Avg. Resolution
          </div>
          <div class="stat-value">2.4h</div>
          <div class="stat-trend trend-down">
            <i data-lucide="arrow-down" width="14"></i> -15m (faster)
          </div>
        </div>

        <div class="stat-card indicator-blue">
          <div class="stat-header">
            <i data-lucide="zap" width="16"></i> Productivity
          </div>
          <div class="stat-value">92</div>
          <div class="stat-trend trend-up">
            <i data-lucide="activity" width="14"></i> Peak Performance
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- Main Line Chart -->
        <div class="chart-card wide">
          <div class="chart-header">
            <h3 class="chart-title">Productivity Velocity</h3>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-dot" style="background: #8b5cf6"></div> Completed
              </div>
              <div class="legend-item">
                <div class="legend-dot" style="background: #3b82f6"></div> Assigned
              </div>
            </div>
          </div>
          <div class="chart-container" style="height: 350px;">
            <canvas id="velocityChart"></canvas>
          </div>
        </div>

        <!-- Weekly Bar Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Weekly Output</h3>
          </div>
          <div class="chart-container">
            <canvas id="weeklyChart"></canvas>
          </div>
        </div>

        <!-- Circular Progress -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Project Delta</h3>
          </div>
          <div class="circular-progress-container">
            <canvas id="projectChart"></canvas>
            <div class="circular-value">
              <div class="circular-number">76%</div>
              <div class="circular-label">Goal Met</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initCharts() {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)', borderDash: [5, 5] }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } } }
    }
  };

  // 1. Velocity Line Chart (Gradient Area)
  const ctxVelocity = document.getElementById('velocityChart');
  if (ctxVelocity) {
    const gradient = ctxVelocity.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

    new Chart(ctxVelocity, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Completed',
            data: [12, 19, 15, 25, 22, 14, 18],
            borderColor: '#8b5cf6',
            backgroundColor: gradient,
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6
          },
          {
            label: 'Assigned',
            data: [15, 22, 18, 28, 24, 16, 20],
            borderColor: '#3b82f6',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          }
        ]
      },
      options: {
        ...commonOptions,
        interaction: { mode: 'index', intersect: false }
      }
    });
  }

  // 2. Weekly Bar Chart
  const ctxWeekly = document.getElementById('weeklyChart');
  if (ctxWeekly) {
    const chart = new Chart(ctxWeekly, {
      type: 'bar',
      data: {
        labels: ['W1', 'W2', 'W3', 'W4'],
        datasets: [{
          label: 'Tasks',
          data: [45, 52, 49, 60],
          backgroundColor: '#10b981',
          borderRadius: 4,
          barThickness: 20
        }]
      },
      options: commonOptions
    });
  }

  // 3. Circular Progress (Doughnut)
  const ctxProject = document.getElementById('projectChart');
  if (ctxProject) {
    new Chart(ctxProject, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Remaining'],
        datasets: [{
          data: [76, 24],
          backgroundColor: ['#f59e0b', 'rgba(255, 255, 255, 0.05)'],
          borderWidth: 0,
          cutout: '85%',
          borderRadius: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } }
      }
    });
  }
}
