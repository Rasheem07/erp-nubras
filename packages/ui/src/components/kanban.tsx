"use client"

import type * as React from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { cn } from "@nubras/utils"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { MoreHorizontal, Plus } from "lucide-react"
import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"

// Types
export interface KanbanItem {
  id: string
  content: React.ReactNode
  meta?: {
    [key: string]: any
  }
}

export interface KanbanColumn {
  id: string
  title: string
  items: KanbanItem[]
  color?: string
  limit?: number
}

export interface KanbanProps {
  columns: KanbanColumn[]
  onColumnAdd?: () => void
  onItemAdd?: (columnId: string) => void
  onDragEnd: (result: any) => void
  onItemClick?: (item: KanbanItem) => void
  className?: string
}

export function Kanban({ columns, onColumnAdd, onItemAdd, onDragEnd, onItemClick, className }: KanbanProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 p-4">
          {columns.map((column) => (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              onItemAdd={onItemAdd ? () => onItemAdd(column.id) : undefined}
              onItemClick={onItemClick}
            />
          ))}
          {onColumnAdd && (
            <div className="flex-shrink-0 w-80">
              <Button
                variant="outline"
                className="h-auto w-full border-dashed p-6 text-muted-foreground"
                onClick={onColumnAdd}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Column
              </Button>
            </div>
          )}
        </div>
      </DragDropContext>
    </div>
  )
}

interface KanbanColumnProps {
  column: KanbanColumn
  onItemAdd?: () => void
  onItemClick?: (item: KanbanItem) => void
}

function KanbanColumnComponent({ column, onItemAdd, onItemClick }: KanbanColumnProps) {
  return (
    <div className="flex-shrink-0 w-80">
      <Card className="h-full">
        <CardHeader className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
              {column.items.length > 0 && (
                <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                  {column.items.length}
                  {column.limit ? `/${column.limit}` : ""}
                </Badge>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Column</DropdownMenuItem>
                <DropdownMenuItem>Delete Column</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <Droppable droppableId={column.id}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 min-h-[200px]">
                {column.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="rounded-md border bg-card text-card-foreground shadow-sm"
                        onClick={onItemClick ? () => onItemClick(item) : undefined}
                        style={{
                          ...provided.draggableProps.style,
                          cursor: onItemClick ? "pointer" : "grab",
                        }}
                      >
                        <div className="p-3">{item.content}</div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {onItemAdd && (
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start p-2 text-muted-foreground"
                    onClick={onItemAdd}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                )}
              </div>
            )}
          </Droppable>
        </CardContent>
      </Card>
    </div>
  )
}
