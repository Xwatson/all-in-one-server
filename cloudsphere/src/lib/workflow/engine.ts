import { prisma } from '../prisma'
import { Node, Edge, NodeType } from './types'
import { executeNode } from './nodes'

export class WorkflowEngine {
  private nodes: Node[]
  private edges: Edge[]
  private executionId: string
  private workflowId: string

  constructor(workflowId: string, nodes: Node[], edges: Edge[]) {
    this.workflowId = workflowId
    this.nodes = nodes
    this.edges = edges
  }

  private async initializeExecution() {
    const execution = await prisma.workflowExecution.create({
      data: {
        status: 'running',
        workflowId: this.workflowId,
      },
    })
    this.executionId = execution.id
  }

  private getNodeById(id: string): Node | undefined {
    return this.nodes.find(node => node.id === id)
  }

  private getNextNodes(nodeId: string): Node[] {
    const outgoingEdges = this.edges.filter(edge => edge.source === nodeId)
    return outgoingEdges
      .map(edge => this.getNodeById(edge.target))
      .filter((node): node is Node => node !== undefined)
  }

  private async executeNode(node: Node, previousResults: Record<string, any> = {}) {
    try {
      const result = await executeNode(node, previousResults)
      return result
    } catch (error) {
      throw new Error(`Error executing node ${node.id}: ${error}`)
    }
  }

  private async updateExecution(status: string, result?: any, error?: string) {
    await prisma.workflowExecution.update({
      where: { id: this.executionId },
      data: {
        status,
        result: result ? result : undefined,
        error: error ? error : undefined,
        endedAt: new Date(),
      },
    })
  }

  public async execute() {
    await this.initializeExecution()
    const results: Record<string, any> = {}

    try {
      // 找到起始节点
      const startNode = this.nodes.find(node => node.type === NodeType.START)
      if (!startNode) {
        throw new Error('No start node found')
      }

      // 从起始节点开始执行
      const queue = [startNode]
      const visited = new Set<string>()

      while (queue.length > 0) {
        const currentNode = queue.shift()!
        
        if (visited.has(currentNode.id)) {
          continue
        }

        // 执行当前节点
        results[currentNode.id] = await this.executeNode(currentNode, results)
        visited.add(currentNode.id)

        // 将下一个节点添加到队列
        const nextNodes = this.getNextNodes(currentNode.id)
        queue.push(...nextNodes)
      }

      await this.updateExecution('completed', results)
      return results
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      await this.updateExecution('failed', undefined, errorMessage)
      throw error
    }
  }
}
