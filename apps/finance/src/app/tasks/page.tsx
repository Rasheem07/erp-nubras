"use client"

import { useState } from "react"
import { Kanban, type KanbanColumn, type KanbanItem } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, CheckCircle2, Clock, FileText } from "lucide-react"

// Initial data for the Kanban board
const initialColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    items: [
      {
        id: "task-1",
        content: (
          <div className="space-y-2">
            <div className="font-medium">Prepare monthly financial report</div>
            <div className="text-xs text-muted-foreground">Compile and analyze financial data for April</div>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> May 15
              </Badge>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        ),
      },
      {
        id: "task-2",
        content: (
          <div className="space-y-2">
            <div className="font-medium">Review vendor invoices</div>
            <div className="text-xs text-muted-foreground">Verify and approve pending vendor invoices</div>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> May 10
              </Badge>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    items: [
      {
        id: "task-3",
        content: (
          <div className="space-y-2">
            <div className="font-medium">Reconcile bank statements</div>
            <div className="text-xs text-muted-foreground">Match transactions with bank statements for April</div>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> 2 days left
              </Badge>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    items: [
      {
        id: "task-4",
        content: (
          <div className="space-y-2">
            <div className="font-medium">Tax filing preparation</div>
            <div className="text-xs text-muted-foreground">Prepare documents for quarterly tax filing</div>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex items-center gap-1">
                <FileText className="h-3 w-3" /> 5 attachments
              </Badge>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>TS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    items: [
      {
        id: "task-5",
        content: (
          <div className="space-y-2">
            <div className="font-medium">Update accounting policies</div>
            <div className="text-xs text-muted-foreground">Review and update company accounting policies</div>
            <div className="flex items-center justify-between">
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Completed
              </Badge>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>RJ</AvatarFallback>
              </Avatar>
            </div>
          </div>
        ),
      },
      {
        id: "task-6",
        content: (
          <div className="space-y-2">
            <div className="font-medium">Budget planning meeting</div>
            <div className="text-xs text-muted-foreground">
              Conduct Q2 budget planning meeting with department heads
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Completed
              </Badge>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        ),
      },
    ],
  },
]

export default function TasksPage() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const sourceColumnId = source.droppableId
    const destColumnId = destination.droppableId
    const sourceIndex = source.index
    const destIndex = destination.index

    // Create a new copy of the columns
    const newColumns = [...columns]

    // Find the source and destination columns
    const sourceColumn = newColumns.find((col) => col.id === sourceColumnId)
    const destColumn = newColumns.find((col) => col.id === destColumnId)

    if (!sourceColumn || !destColumn) return

    // Remove the item from the source column
    const [removed] = sourceColumn.items.splice(sourceIndex, 1)

    // Add the item to the destination column
    destColumn.items.splice(destIndex, 0, removed)

    // Update the state
    setColumns(newColumns)
  }

  const handleColumnAdd = () => {
    const newColumnId = `column-${columns.length + 1}`
    const newColumn: KanbanColumn = {
      id: newColumnId,
      title: `New Column`,
      items: [],
    }
    setColumns([...columns, newColumn])
  }

  const handleItemAdd = (columnId: string) => {
    const newColumns = [...columns]
    const columnIndex = newColumns.findIndex((col) => col.id === columnId)
    if (columnIndex === -1) return

    const newItemId = `task-${Date.now()}`
    const newItem: KanbanItem = {
      id: newItemId,
      content: (
        <div className="space-y-2">
          <div className="font-medium">New Task</div>
          <div className="text-xs text-muted-foreground">Click to edit this task</div>
        </div>
      ),
    }

    newColumns[columnIndex].items.push(newItem)
    setColumns(newColumns)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Finance Tasks</h2>
        <p className="text-muted-foreground">Manage and track financial tasks with this Kanban board</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Board</CardTitle>
          <CardDescription>Drag and drop tasks between columns to update their status</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Kanban
            columns={columns}
            onDragEnd={handleDragEnd}
            onColumnAdd={handleColumnAdd}
            onItemAdd={handleItemAdd}
            className="pb-4"
          />
        </CardContent>
      </Card>
    </div>
  )
}
