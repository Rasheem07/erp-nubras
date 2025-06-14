"use client"

import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  icon?: React.ReactNode
  meta?: {
    [key: string]: any
  }
}

interface TreeViewProps {
  data: TreeNode[]
  onNodeSelect?: (node: TreeNode) => void
  defaultExpanded?: boolean
  className?: string
}

export function TreeView({ data, onNodeSelect, defaultExpanded = false, className }: TreeViewProps) {
  return (
    <div className={cn("text-sm", className)}>
      <ul className="space-y-1">
        {data.map((node) => (
          <TreeNode key={node.id} node={node} onNodeSelect={onNodeSelect} defaultExpanded={defaultExpanded} level={0} />
        ))}
      </ul>
    </div>
  )
}

interface TreeNodeProps {
  node: TreeNode
  onNodeSelect?: (node: TreeNode) => void
  defaultExpanded: boolean
  level: number
}

function TreeNode({ node, onNodeSelect, defaultExpanded, level }: TreeNodeProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const hasChildren = node.children && node.children.length > 0

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  const handleSelect = () => {
    onNodeSelect?.(node)
  }

  return (
    <li className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted",
          level > 0 && "ml-4",
          onNodeSelect && "cursor-pointer",
        )}
        onClick={handleSelect}
      >
        {hasChildren ? (
          <button
            type="button"
            className="h-4 w-4 shrink-0 text-muted-foreground"
            onClick={handleToggle}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <span className="h-4 w-4 shrink-0" />
        )}
        {node.icon && <span className="shrink-0">{node.icon}</span>}
        <span className="truncate">{node.name}</span>
      </div>
      {hasChildren && expanded && (
        <ul className="mt-1">
          {node.children!.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              onNodeSelect={onNodeSelect}
              defaultExpanded={defaultExpanded}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
