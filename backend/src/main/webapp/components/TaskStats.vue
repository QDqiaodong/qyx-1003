<template>
  <div class="stats-premium-grid">
    <div class="stat-widget glass">
      <div class="widget-icon primary">📊</div>
      <div class="widget-data">
        <span class="widget-label">任务总量</span>
        <span class="widget-value">{{ tasks.length }}</span>
      </div>
      <div class="widget-trend">
        <span>全量追踪</span>
      </div>
    </div>

    <div class="stat-widget glass">
      <div class="widget-icon success">✅</div>
      <div class="widget-data">
        <span class="widget-label">已达成</span>
        <span class="widget-value">{{ completedCount }}</span>
      </div>
      <div class="widget-trend success-text">
        <span>{{ completionRate }}% 完成率</span>
      </div>
    </div>

    <div class="stat-widget glass">
      <div class="widget-icon warning">⏳</div>
      <div class="widget-data">
        <span class="widget-label">推进中</span>
        <span class="widget-value">{{ tasks.length - completedCount }}</span>
      </div>
      <div class="widget-trend warning-text">
        <span>正则处理</span>
      </div>
    </div>

    <div class="stat-widget glass">
      <div class="widget-icon danger">🚨</div>
      <div class="widget-data">
        <span class="widget-label">紧急/逾期</span>
        <span class="widget-value">{{ nearExpiryCount }}</span>
      </div>
      <div class="widget-trend danger-text">
        <span>优先级关注</span>
      </div>
    </div>

    <div class="user-summary-card glass" v-if="currentUser">
      <div class="summary-header">
        <div class="user-avatar-premium">
          {{ currentUser.username[0].toUpperCase() }}
        </div>
        <div class="summary-title">
          <h3>效率洞察</h3>
          <p>您已执行了 {{ myCreated + myAssigned }} 个相关事项</p>
        </div>
      </div>
      
      <div class="summary-body">
        <div class="logic-progress">
          <div class="progress-labels">
            <span>当前完成进度</span>
            <span class="pct">{{ completionRate }}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-thumb" :style="{ width: completionRate + '%' }"></div>
          </div>
        </div>
        
        <div class="summary-chips">
          <div class="chip">
            <span class="c-label">我发起的</span>
            <span class="c-val">{{ myCreated }}</span>
          </div>
          <div class="chip">
            <span class="c-label">指派给我</span>
            <span class="c-val">{{ myAssigned }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { computed } = Vue;

export default {
  props: ['tasks', 'currentUser'],
  setup(props) {
    const completedCount = computed(() => props.tasks.filter(t => t.completed).length);
    const nearExpiryCount = computed(() => props.tasks.filter(t => !t.completed && (utils.isNearExpiry(t.dueDate) || utils.isExpired(t.dueDate))).length);
    
    const myCreated = computed(() => props.tasks.filter(t => t.userId === props.currentUser?.id).length);
    const myAssigned = computed(() => props.tasks.filter(t => t.assigneeId === props.currentUser?.id).length);
    
    const completionRate = computed(() => {
        const myTasks = props.tasks.filter(t => t.userId === props.currentUser?.id || t.assigneeId === props.currentUser?.id);
        if (myTasks.length === 0) return 0;
        const done = myTasks.filter(t => t.completed).length;
        return Math.round((done / myTasks.length) * 100);
    });

    return { completedCount, nearExpiryCount, myCreated, myAssigned, completionRate };
  }
}
</script>
