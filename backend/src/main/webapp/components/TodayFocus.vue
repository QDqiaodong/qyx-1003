<template>
  <div class="today-focus-section">
    <div class="focus-header">
      <div class="focus-title-block">
        <span class="focus-icon">🔥</span>
        <div>
          <h2>今日焦点</h2>
          <p class="focus-subtitle">优先处理最紧急的事项</p>
        </div>
      </div>
      <div class="focus-summary">
        <span class="summary-badge" :class="{ 'badge-danger': overdueTasks.length > 0 }">
          {{ totalPending }} 项待处理
        </span>
      </div>
    </div>

    <div class="focus-groups">
      <div class="focus-group glass" :class="{ 'group-danger': overdueTasks.length > 0 }">
        <div class="group-header">
          <div class="group-title">
            <span class="group-icon danger-icon">⏰</span>
            <h3>已逾期</h3>
            <span class="group-count danger-count">{{ overdueTasks.length }}</span>
          </div>
        </div>
        <div class="group-tasks">
          <transition-group name="fade">
            <div 
              v-for="task in overdueTasks" 
              :key="'overdue-' + task.id" 
              :class="['focus-task-item', { 'is-completed': task.completed }]"
            >
              <label class="mini-checkbox">
                <input type="checkbox" :checked="task.completed" @change="toggleTask(task)">
                <span class="mini-check-box"></span>
              </label>
              <div class="task-info">
                <span class="task-text">{{ task.text }}</span>
                <div class="task-mini-meta">
                  <span :class="['priority-mini-tag', `mini-${task.priority}`]">
                    {{ priorityLabel(task.priority) }}
                  </span>
                  <span class="due-text danger-text">{{ formatTime(task.dueDate) }}</span>
                </div>
              </div>
            </div>
          </transition-group>
          <div v-if="overdueTasks.length === 0" class="empty-group">
            <span class="empty-icon">✅</span>
            <span>暂无逾期任务</span>
          </div>
        </div>
      </div>

      <div class="focus-group glass" :class="{ 'group-warning': dueTodayTasks.length > 0 }">
        <div class="group-header">
          <div class="group-title">
            <span class="group-icon warning-icon">📅</span>
            <h3>今日到期</h3>
            <span class="group-count warning-count">{{ dueTodayTasks.length }}</span>
          </div>
        </div>
        <div class="group-tasks">
          <transition-group name="fade">
            <div 
              v-for="task in dueTodayTasks" 
              :key="'today-' + task.id" 
              :class="['focus-task-item', { 'is-completed': task.completed }]"
            >
              <label class="mini-checkbox">
                <input type="checkbox" :checked="task.completed" @change="toggleTask(task)">
                <span class="mini-check-box"></span>
              </label>
              <div class="task-info">
                <span class="task-text">{{ task.text }}</span>
                <div class="task-mini-meta">
                  <span :class="['priority-mini-tag', `mini-${task.priority}`]">
                    {{ priorityLabel(task.priority) }}
                  </span>
                  <span class="due-text warning-text">{{ formatTime(task.dueDate) }}</span>
                </div>
              </div>
            </div>
          </transition-group>
          <div v-if="dueTodayTasks.length === 0" class="empty-group">
            <span class="empty-icon">🎯</span>
            <span>今日无截止任务</span>
          </div>
        </div>
      </div>

      <div class="focus-group glass">
        <div class="group-header">
          <div class="group-title">
            <span class="group-icon primary-icon">✍️</span>
            <h3>由我创建</h3>
            <span class="group-count">{{ createdByMeTasks.length }}</span>
          </div>
        </div>
        <div class="group-tasks">
          <transition-group name="fade">
            <div 
              v-for="task in createdByMeTasks" 
              :key="'created-' + task.id" 
              :class="['focus-task-item', { 'is-completed': task.completed }]"
            >
              <label class="mini-checkbox">
                <input type="checkbox" :checked="task.completed" @change="toggleTask(task)">
                <span class="mini-check-box"></span>
              </label>
              <div class="task-info">
                <span class="task-text">{{ task.text }}</span>
                <div class="task-mini-meta">
                  <span :class="['priority-mini-tag', `mini-${task.priority}`]">
                    {{ priorityLabel(task.priority) }}
                  </span>
                  <span class="assignee-text">指派: {{ task.assigneeName || '未指派' }}</span>
                </div>
              </div>
            </div>
          </transition-group>
          <div v-if="createdByMeTasks.length === 0" class="empty-group">
            <span class="empty-icon">📝</span>
            <span>暂无我创建的任务</span>
          </div>
        </div>
      </div>

      <div class="focus-group glass">
        <div class="group-header">
          <div class="group-title">
            <span class="group-icon success-icon">👤</span>
            <h3>指派给我</h3>
            <span class="group-count">{{ assignedToMeTasks.length }}</span>
          </div>
        </div>
        <div class="group-tasks">
          <transition-group name="fade">
            <div 
              v-for="task in assignedToMeTasks" 
              :key="'assigned-' + task.id" 
              :class="['focus-task-item', { 'is-completed': task.completed }]"
            >
              <label class="mini-checkbox">
                <input type="checkbox" :checked="task.completed" @change="toggleTask(task)">
                <span class="mini-check-box"></span>
              </label>
              <div class="task-info">
                <span class="task-text">{{ task.text }}</span>
                <div class="task-mini-meta">
                  <span :class="['priority-mini-tag', `mini-${task.priority}`]">
                    {{ priorityLabel(task.priority) }}
                  </span>
                  <span class="creator-text">创建者: {{ task.username }}</span>
                </div>
              </div>
            </div>
          </transition-group>
          <div v-if="assignedToMeTasks.length === 0" class="empty-group">
            <span class="empty-icon">🎐</span>
            <span>暂无指派给我的任务</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { computed, inject } = Vue;

export default {
  props: ['tasks', 'currentUser'],
  emits: ['update'],
  setup(props, { emit }) {
    const showToast = inject('showToast');

    const myRelatedTasks = computed(() => {
      if (!props.currentUser) return [];
      return props.tasks.filter(t => 
        t.userId === props.currentUser.id || t.assigneeId === props.currentUser.id
      );
    });

    const overdueTasks = computed(() => {
      return myRelatedTasks.value
        .filter(t => !t.completed && utils.isOverdue(t.dueDate))
        .sort((a, b) => {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        });
    });

    const dueTodayTasks = computed(() => {
      return myRelatedTasks.value
        .filter(t => !t.completed && utils.isDueToday(t.dueDate))
        .sort((a, b) => {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        });
    });

    const createdByMeTasks = computed(() => {
      if (!props.currentUser) return [];
      return myRelatedTasks.value
        .filter(t => !t.completed && t.userId === props.currentUser.id && !utils.isDueToday(t.dueDate) && !utils.isOverdue(t.dueDate))
        .sort((a, b) => {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        });
    });

    const assignedToMeTasks = computed(() => {
      if (!props.currentUser) return [];
      return myRelatedTasks.value
        .filter(t => !t.completed && t.assigneeId === props.currentUser.id && !utils.isDueToday(t.dueDate) && !utils.isOverdue(t.dueDate))
        .sort((a, b) => {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        });
    });

    const totalPending = computed(() => {
      return overdueTasks.value.length + dueTodayTasks.value.length 
        + createdByMeTasks.value.length + assignedToMeTasks.value.length;
    });

    const formatTime = (ts) => utils.formatDate(ts);
    
    const priorityLabel = (priority) => {
      const labels = { high: '紧急', medium: '普通', low: '次要' };
      return labels[priority] || priority;
    };

    const toggleTask = async (task) => {
      try {
        await axios.put(`/api/tasks/${task.id}`, {
          ...task,
          completed: !task.completed
        });
        emit('update');
        if (!task.completed) {
          showToast('任务已完成 🎉', 'success');
        }
      } catch (e) {
        showToast('状态更新失败', 'danger');
      }
    };

    return {
      overdueTasks,
      dueTodayTasks,
      createdByMeTasks,
      assignedToMeTasks,
      totalPending,
      formatTime,
      priorityLabel,
      toggleTask
    };
  }
}
</script>
