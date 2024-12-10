import cron from 'node-cron'
import { prisma } from '../prisma'
import { WorkflowEngine } from './engine'

class WorkflowScheduler {
  private tasks: Map<string, cron.ScheduledTask>

  constructor() {
    this.tasks = new Map()
  }

  async initialize() {
    // 获取所有激活的工作流
    const activeWorkflows = await prisma.workflow.findMany({
      where: {
        isActive: true,
        schedule: {
          not: null,
        },
      },
    })

    // 为每个工作流创建定时任务
    for (const workflow of activeWorkflows) {
      if (workflow.schedule) {
        this.scheduleWorkflow(workflow.id, workflow.schedule)
      }
    }
  }

  scheduleWorkflow(workflowId: string, schedule: string) {
    // 如果已存在任务，先停止它
    if (this.tasks.has(workflowId)) {
      this.stopWorkflow(workflowId)
    }

    // 创建新的定时任务
    const task = cron.schedule(schedule, async () => {
      try {
        const workflow = await prisma.workflow.findUnique({
          where: { id: workflowId },
        })

        if (!workflow || !workflow.isActive) {
          this.stopWorkflow(workflowId)
          return
        }

        const nodes = JSON.parse(workflow.nodes.toString())
        const edges = JSON.parse(workflow.edges.toString())

        const engine = new WorkflowEngine(workflowId, nodes, edges)
        await engine.execute()
      } catch (error) {
        console.error(`Error executing scheduled workflow ${workflowId}:`, error)
      }
    })

    this.tasks.set(workflowId, task)
  }

  stopWorkflow(workflowId: string) {
    const task = this.tasks.get(workflowId)
    if (task) {
      task.stop()
      this.tasks.delete(workflowId)
    }
  }

  async updateWorkflow(workflowId: string) {
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    })

    if (!workflow) {
      this.stopWorkflow(workflowId)
      return
    }

    if (workflow.isActive && workflow.schedule) {
      this.scheduleWorkflow(workflowId, workflow.schedule)
    } else {
      this.stopWorkflow(workflowId)
    }
  }
}

// 创建单例实例
export const workflowScheduler = new WorkflowScheduler()
