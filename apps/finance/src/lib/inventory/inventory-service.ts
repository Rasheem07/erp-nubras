// This is a mock service for inventory management
// In a real application, this would connect to a database

export interface InventoryItem {
  id: string
  name: string
  sku: string
  description?: string
  category: string
  subcategory?: string
  unitOfMeasure: string
  currentStock: number
  minimumStock: number
  reorderPoint: number
  costPrice: number
  vatRate: number
  supplier: string
  location: string
  barcode?: string
  isActive: boolean
  isHalalCertified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Supplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  taxId?: string
  paymentTerms: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Location {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface StockMovement {
  id: string
  itemId: string
  type: "receipt" | "issue" | "adjustment" | "transfer"
  quantity: number
  fromLocation?: string
  toLocation?: string
  reference?: string
  notes?: string
  createdBy: string
  createdAt: Date
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  supplierId: string
  status: "draft" | "pending" | "approved" | "received" | "cancelled"
  orderDate: Date
  expectedDeliveryDate?: Date
  items: PurchaseOrderItem[]
  subtotal: number
  vatAmount: number
  total: number
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseOrderItem {
  id: string
  poId: string
  itemId: string
  quantity: number
  unitPrice: number
  vatRate: number
  total: number
}

export interface MaterialAllocation {
  id: string
  allocationNumber: string
  projectName: string
  orderNumber?: string
  allocationDate: string
  requiredByDate: string
  department: string
  status: string
  items: MaterialAllocationItem[]
  notes?: string
  createdBy: string
  createdAt: Date
}

export interface MaterialAllocationItem {
  id: string
  allocationId: string
  itemId: string
  itemName: string
  quantity: number
  unitOfMeasure: string
  notes?: string
}

export interface WasteTracking {
  id: string
  trackingNumber: string
  projectName: string
  date: string
  department: string
  wasteType: string
  quantity: number
  unitOfMeasure: string
  disposalMethod: string
  notes?: string
  createdBy: string
  createdAt: Date
}

// For backward compatibility
export type WasteRecord = WasteTracking

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: "sup-001",
    name: "Al Fahim Textiles",
    contactPerson: "Ahmed Al Fahim",
    email: "ahmed@alfahimtextiles.ae",
    phone: "+971 50 123 4567",
    address: "Dubai Textile Souk, Shop #123, Dubai, UAE",
    taxId: "AE123456789",
    paymentTerms: "Net 30",
    isActive: true,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "sup-002",
    name: "Emirates Fabrics",
    contactPerson: "Fatima Al Mansouri",
    email: "fatima@emiratesfabrics.ae",
    phone: "+971 55 987 6543",
    address: "Sharjah Industrial Area, Warehouse #45, Sharjah, UAE",
    taxId: "AE987654321",
    paymentTerms: "Net 45",
    isActive: true,
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "sup-003",
    name: "Abu Dhabi Threads",
    contactPerson: "Mohammed Al Hashimi",
    email: "mohammed@adthreads.ae",
    phone: "+971 52 456 7890",
    address: "Mussafah Industrial Area, Abu Dhabi, UAE",
    taxId: "AE456789123",
    paymentTerms: "Net 15",
    isActive: true,
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-03-05"),
  },
]

const mockLocations: Location[] = [
  {
    id: "loc-001",
    name: "Main Warehouse",
    description: "Primary storage facility for all materials",
    isActive: true,
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-01-10"),
  },
  {
    id: "loc-002",
    name: "Production Floor",
    description: "Materials actively in use for production",
    isActive: true,
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-01-10"),
  },
  {
    id: "loc-003",
    name: "Retail Store",
    description: "Finished products ready for sale",
    isActive: true,
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-01-10"),
  },
]

const mockInventoryItems: InventoryItem[] = [
  {
    id: "item-001",
    name: "Premium Cotton Fabric",
    sku: "FAB-COT-001",
    description: "High-quality Egyptian cotton fabric, white",
    category: "Fabric",
    subcategory: "Cotton",
    unitOfMeasure: "Meter",
    currentStock: 250,
    minimumStock: 50,
    reorderPoint: 100,
    costPrice: 25,
    vatRate: 5,
    supplier: "sup-001",
    location: "loc-001",
    barcode: "1234567890123",
    isActive: true,
    isHalalCertified: true,
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-01-20"),
  },
  {
    id: "item-002",
    name: "Silk Fabric",
    sku: "FAB-SLK-001",
    description: "Luxurious silk fabric, black",
    category: "Fabric",
    subcategory: "Silk",
    unitOfMeasure: "Meter",
    currentStock: 100,
    minimumStock: 20,
    reorderPoint: 40,
    costPrice: 50,
    vatRate: 5,
    supplier: "sup-002",
    location: "loc-001",
    barcode: "2345678901234",
    isActive: true,
    isHalalCertified: true,
    createdAt: new Date("2023-01-25"),
    updatedAt: new Date("2023-01-25"),
  },
  {
    id: "item-003",
    name: "Gold Thread",
    sku: "THR-GLD-001",
    description: "Metallic gold embroidery thread",
    category: "Thread",
    subcategory: "Metallic",
    unitOfMeasure: "Spool",
    currentStock: 50,
    minimumStock: 10,
    reorderPoint: 20,
    costPrice: 15,
    vatRate: 5,
    supplier: "sup-003",
    location: "loc-001",
    barcode: "3456789012345",
    isActive: true,
    isHalalCertified: true,
    createdAt: new Date("2023-02-05"),
    updatedAt: new Date("2023-02-05"),
  },
]

const mockStockMovements: StockMovement[] = [
  {
    id: "mov-001",
    itemId: "item-001",
    type: "receipt",
    quantity: 100,
    toLocation: "loc-001",
    reference: "PO-001",
    notes: "Initial stock receipt",
    createdBy: "user-001",
    createdAt: new Date("2023-01-20"),
  },
  {
    id: "mov-002",
    itemId: "item-001",
    type: "transfer",
    quantity: 20,
    fromLocation: "loc-001",
    toLocation: "loc-002",
    reference: "PROD-001",
    notes: "Transfer to production",
    createdBy: "user-001",
    createdAt: new Date("2023-01-25"),
  },
  {
    id: "mov-003",
    itemId: "item-002",
    type: "receipt",
    quantity: 50,
    toLocation: "loc-001",
    reference: "PO-002",
    notes: "Initial stock receipt",
    createdBy: "user-001",
    createdAt: new Date("2023-01-26"),
  },
]

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po-001",
    poNumber: "PO-2023-001",
    supplierId: "sup-001",
    status: "received",
    orderDate: new Date("2023-01-15"),
    expectedDeliveryDate: new Date("2023-01-20"),
    items: [
      {
        id: "poi-001",
        poId: "po-001",
        itemId: "item-001",
        quantity: 100,
        unitPrice: 25,
        vatRate: 5,
        total: 2625, // 100 * 25 * 1.05
      },
    ],
    subtotal: 2500, // 100 * 25
    vatAmount: 125, // 2500 * 0.05
    total: 2625, // 2500 + 125
    notes: "Initial order of cotton fabric",
    createdBy: "user-001",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "po-002",
    poNumber: "PO-2023-002",
    supplierId: "sup-002",
    status: "received",
    orderDate: new Date("2023-01-22"),
    expectedDeliveryDate: new Date("2023-01-27"),
    items: [
      {
        id: "poi-002",
        poId: "po-002",
        itemId: "item-002",
        quantity: 50,
        unitPrice: 50,
        vatRate: 5,
        total: 2625, // 50 * 50 * 1.05
      },
    ],
    subtotal: 2500, // 50 * 50
    vatAmount: 125, // 2500 * 0.05
    total: 2625, // 2500 + 125
    notes: "Initial order of silk fabric",
    createdBy: "user-001",
    createdAt: new Date("2023-01-22"),
    updatedAt: new Date("2023-01-22"),
  },
]

const mockMaterialAllocations: MaterialAllocation[] = [
  {
    id: "alloc-001",
    allocationNumber: "MA-2023-001",
    projectName: "Royal Wedding Dress",
    orderNumber: "ORD-2023-045",
    allocationDate: "2023-03-10",
    requiredByDate: "2023-03-20",
    department: "Production",
    status: "Allocated",
    items: [
      {
        id: "mai-001",
        allocationId: "alloc-001",
        itemId: "item-001",
        itemName: "Premium Cotton Fabric",
        quantity: 15,
        unitOfMeasure: "Meter",
        notes: "For main body of dress",
      },
      {
        id: "mai-002",
        allocationId: "alloc-001",
        itemId: "item-003",
        itemName: "Gold Thread",
        quantity: 5,
        unitOfMeasure: "Spool",
        notes: "For embroidery details",
      },
    ],
    notes: "Priority allocation for royal wedding",
    createdBy: "user-001",
    createdAt: new Date("2023-03-10"),
  },
  {
    id: "alloc-002",
    allocationNumber: "MA-2023-002",
    projectName: "Luxury Kandura Collection",
    orderNumber: "ORD-2023-052",
    allocationDate: "2023-03-15",
    requiredByDate: "2023-03-30",
    department: "Production",
    status: "Pending",
    items: [
      {
        id: "mai-003",
        allocationId: "alloc-002",
        itemId: "item-002",
        itemName: "Silk Fabric",
        quantity: 30,
        unitOfMeasure: "Meter",
        notes: "For premium kanduras",
      },
    ],
    notes: "Seasonal collection",
    createdBy: "user-001",
    createdAt: new Date("2023-03-15"),
  },
  {
    id: "alloc-003",
    allocationNumber: "MA-2023-003",
    projectName: "Traditional Abaya Set",
    orderNumber: "ORD-2023-060",
    allocationDate: "2023-03-20",
    requiredByDate: "2023-04-05",
    department: "Production",
    status: "Completed",
    items: [
      {
        id: "mai-004",
        allocationId: "alloc-003",
        itemId: "item-001",
        itemName: "Premium Cotton Fabric",
        quantity: 25,
        unitOfMeasure: "Meter",
        notes: "For abaya base",
      },
      {
        id: "mai-005",
        allocationId: "alloc-003",
        itemId: "item-003",
        itemName: "Gold Thread",
        quantity: 3,
        unitOfMeasure: "Spool",
        notes: "For sleeve details",
      },
    ],
    notes: "Completed ahead of schedule",
    createdBy: "user-001",
    createdAt: new Date("2023-03-20"),
  },
  {
    id: "alloc-004",
    allocationNumber: "MA-2023-004",
    projectName: "Corporate Uniform Order",
    orderNumber: "ORD-2023-075",
    allocationDate: "2023-04-01",
    requiredByDate: "2023-04-20",
    department: "Bulk Production",
    status: "Pending",
    items: [
      {
        id: "mai-006",
        allocationId: "alloc-004",
        itemId: "item-001",
        itemName: "Premium Cotton Fabric",
        quantity: 100,
        unitOfMeasure: "Meter",
        notes: "For 50 uniforms",
      },
    ],
    notes: "Large corporate order",
    createdBy: "user-001",
    createdAt: new Date("2023-04-01"),
  },
  {
    id: "alloc-005",
    allocationNumber: "MA-2023-005",
    projectName: "Designer Showcase Pieces",
    orderNumber: "ORD-2023-076",
    allocationDate: "2023-04-05",
    requiredByDate: "2023-05-01",
    department: "Design",
    status: "Allocated",
    items: [
      {
        id: "mai-007",
        allocationId: "alloc-005",
        itemId: "item-002",
        itemName: "Silk Fabric",
        quantity: 10,
        unitOfMeasure: "Meter",
        notes: "For prototype designs",
      },
      {
        id: "mai-008",
        allocationId: "alloc-005",
        itemId: "item-003",
        itemName: "Gold Thread",
        quantity: 2,
        unitOfMeasure: "Spool",
        notes: "For accent details",
      },
    ],
    notes: "For upcoming fashion show",
    createdBy: "user-001",
    createdAt: new Date("2023-04-05"),
  },
]

const mockWasteTrackings: WasteTracking[] = [
  {
    id: "waste-001",
    trackingNumber: "WT-2023-001",
    projectName: "Royal Wedding Dress",
    date: "2023-03-15",
    department: "Production",
    wasteType: "Fabric Scraps",
    quantity: 2.5,
    unitOfMeasure: "Kg",
    disposalMethod: "Recycling",
    notes: "Cotton scraps from cutting",
    createdBy: "user-001",
    createdAt: new Date("2023-03-15"),
  },
  {
    id: "waste-002",
    trackingNumber: "WT-2023-002",
    projectName: "Luxury Kandura Collection",
    date: "2023-03-20",
    department: "Production",
    wasteType: "Thread Waste",
    quantity: 0.5,
    unitOfMeasure: "Kg",
    disposalMethod: "Disposal",
    notes: "Unusable thread ends",
    createdBy: "user-001",
    createdAt: new Date("2023-03-20"),
  },
  {
    id: "waste-003",
    trackingNumber: "WT-2023-003",
    projectName: "Traditional Abaya Set",
    date: "2023-03-25",
    department: "Production",
    wasteType: "Fabric Scraps",
    quantity: 1.8,
    unitOfMeasure: "Kg",
    disposalMethod: "Recycling",
    notes: "Black fabric scraps",
    createdBy: "user-001",
    createdAt: new Date("2023-03-25"),
  },
]

// Service implementation
class InventoryService {
  // Suppliers
  getSuppliers(): Supplier[] {
    return [...mockSuppliers]
  }

  getSupplierById(id: string): Supplier | undefined {
    return mockSuppliers.find((supplier) => supplier.id === id)
  }

  createSupplier(supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">): Supplier {
    const newSupplier: Supplier = {
      ...supplier,
      id: `sup-${mockSuppliers.length + 1}`.padStart(6, "0"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockSuppliers.push(newSupplier)
    return newSupplier
  }

  updateSupplier(id: string, updates: Partial<Supplier>): Supplier {
    const index = mockSuppliers.findIndex((supplier) => supplier.id === id)
    if (index === -1) {
      throw new Error(`Supplier with ID ${id} not found`)
    }

    const updatedSupplier = {
      ...mockSuppliers[index],
      ...updates,
      updatedAt: new Date(),
    }
    mockSuppliers[index] = updatedSupplier
    return updatedSupplier
  }

  // Locations
  getLocations(): Location[] {
    return [...mockLocations]
  }

  getLocationById(id: string): Location | undefined {
    return mockLocations.find((location) => location.id === id)
  }

  createLocation(location: Omit<Location, "id" | "createdAt" | "updatedAt">): Location {
    const newLocation: Location = {
      ...location,
      id: `loc-${mockLocations.length + 1}`.padStart(6, "0"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockLocations.push(newLocation)
    return newLocation
  }

  updateLocation(id: string, updates: Partial<Location>): Location {
    const index = mockLocations.findIndex((location) => location.id === id)
    if (index === -1) {
      throw new Error(`Location with ID ${id} not found`)
    }

    const updatedLocation = {
      ...mockLocations[index],
      ...updates,
      updatedAt: new Date(),
    }
    mockLocations[index] = updatedLocation
    return updatedLocation
  }

  // Inventory Items
  getInventoryItems(): InventoryItem[] {
    return [...mockInventoryItems]
  }

  getInventoryItemById(id: string): InventoryItem | undefined {
    return mockInventoryItems.find((item) => item.id === id)
  }

  createInventoryItem(item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">): InventoryItem {
    const newItem: InventoryItem = {
      ...item,
      id: `item-${mockInventoryItems.length + 1}`.padStart(6, "0"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockInventoryItems.push(newItem)
    return newItem
  }

  updateInventoryItem(id: string, updates: Partial<InventoryItem>): InventoryItem {
    const index = mockInventoryItems.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error(`Inventory item with ID ${id} not found`)
    }

    const updatedItem = {
      ...mockInventoryItems[index],
      ...updates,
      updatedAt: new Date(),
    }
    mockInventoryItems[index] = updatedItem
    return updatedItem
  }

  // Stock Movements
  getStockMovements(): StockMovement[] {
    return [...mockStockMovements]
  }

  getStockMovementsByItemId(itemId: string): StockMovement[] {
    return mockStockMovements.filter((movement) => movement.itemId === itemId)
  }

  createStockMovement(movement: Omit<StockMovement, "id" | "createdAt">): StockMovement {
    const newMovement: StockMovement = {
      ...movement,
      id: `mov-${mockStockMovements.length + 1}`.padStart(6, "0"),
      createdAt: new Date(),
    }
    mockStockMovements.push(newMovement)

    // Update item stock
    const itemIndex = mockInventoryItems.findIndex((item) => item.id === movement.itemId)
    if (itemIndex !== -1) {
      const item = mockInventoryItems[itemIndex]
      let stockChange = 0

      switch (movement.type) {
        case "receipt":
          stockChange = movement.quantity
          break
        case "issue":
          stockChange = -movement.quantity
          break
        case "adjustment":
          stockChange = movement.quantity // Can be positive or negative
          break
        case "transfer":
          // No net change for transfers
          break
      }

      mockInventoryItems[itemIndex] = {
        ...item,
        currentStock: item.currentStock + stockChange,
        updatedAt: new Date(),
      }
    }

    return newMovement
  }

  // Purchase Orders
  getPurchaseOrders(): PurchaseOrder[] {
    return [...mockPurchaseOrders]
  }

  getPurchaseOrderById(id: string): PurchaseOrder | undefined {
    return mockPurchaseOrders.find((po) => po.id === id)
  }

  createPurchaseOrder(po: Omit<PurchaseOrder, "id" | "createdAt" | "updatedAt">): PurchaseOrder {
    const newPO: PurchaseOrder = {
      ...po,
      id: `po-${mockPurchaseOrders.length + 1}`.padStart(6, "0"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockPurchaseOrders.push(newPO)
    return newPO
  }

  updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>): PurchaseOrder {
    const index = mockPurchaseOrders.findIndex((po) => po.id === id)
    if (index === -1) {
      throw new Error(`Purchase order with ID ${id} not found`)
    }

    const updatedPO = {
      ...mockPurchaseOrders[index],
      ...updates,
      updatedAt: new Date(),
    }
    mockPurchaseOrders[index] = updatedPO
    return updatedPO
  }

  // Receive items from a purchase order
  receivePurchaseOrder(poId: string, receivedItems: { itemId: string; quantity: number }[]): void {
    const po = this.getPurchaseOrderById(poId)
    if (!po) {
      throw new Error(`Purchase order with ID ${poId} not found`)
    }

    // Create stock movements for each received item
    for (const item of receivedItems) {
      this.createStockMovement({
        itemId: item.itemId,
        type: "receipt",
        quantity: item.quantity,
        toLocation: "loc-001", // Default to main warehouse
        reference: po.poNumber,
        notes: `Received from PO ${po.poNumber}`,
        createdBy: "user-001", // Should come from auth context in real app
      })
    }

    // Update PO status
    this.updatePurchaseOrder(poId, { status: "received" })
  }

  // Material Allocations
  getMaterialAllocations(): MaterialAllocation[] {
    return [...mockMaterialAllocations]
  }

  getMaterialAllocationById(id: string): MaterialAllocation | undefined {
    return mockMaterialAllocations.find((allocation) => allocation.id === id)
  }

  createMaterialAllocation(allocation: Omit<MaterialAllocation, "id" | "createdAt">): MaterialAllocation {
    const newAllocation: MaterialAllocation = {
      ...allocation,
      id: `alloc-${mockMaterialAllocations.length + 1}`.padStart(6, "0"),
      createdAt: new Date(),
    }
    mockMaterialAllocations.push(newAllocation)
    return newAllocation
  }

  updateMaterialAllocation(id: string, updates: Partial<MaterialAllocation>): MaterialAllocation {
    const index = mockMaterialAllocations.findIndex((allocation) => allocation.id === id)
    if (index === -1) {
      throw new Error(`Material allocation with ID ${id} not found`)
    }

    const updatedAllocation = {
      ...mockMaterialAllocations[index],
      ...updates,
    }
    mockMaterialAllocations[index] = updatedAllocation
    return updatedAllocation
  }

  // Waste Tracking
  getWasteTrackings(): WasteTracking[] {
    return [...mockWasteTrackings]
  }

  getWasteTrackingById(id: string): WasteTracking | undefined {
    return mockWasteTrackings.find((tracking) => tracking.id === id)
  }

  getWasteRecords(): WasteTracking[] {
    return this.getWasteTrackings()
  }

  createWasteTracking(tracking: Omit<WasteTracking, "id" | "createdAt">): WasteTracking {
    const newTracking: WasteTracking = {
      ...tracking,
      id: `waste-${mockWasteTrackings.length + 1}`.padStart(6, "0"),
      createdAt: new Date(),
    }
    mockWasteTrackings.push(newTracking)
    return newTracking
  }

  // Analytics methods
  getLowStockItems(): InventoryItem[] {
    return mockInventoryItems.filter((item) => item.currentStock <= item.reorderPoint)
  }

  getDeadStockItems(): InventoryItem[] {
    // For demo purposes, just return some items as "dead stock"
    return mockInventoryItems.filter((_, index) => index % 3 === 0)
  }

  getTotalStockValue(): number {
    return mockInventoryItems.reduce((total, item) => total + item.currentStock * item.costPrice, 0)
  }

  getTopItemsByValue(limit = 5): { item: InventoryItem; value: number }[] {
    const itemsWithValue = mockInventoryItems.map((item) => ({
      item,
      value: item.currentStock * item.costPrice,
    }))

    return itemsWithValue.sort((a, b) => b.value - a.value).slice(0, limit)
  }

  getStockAgingSummary(): { ageRange: string; count: number; value: number }[] {
    // Mock data for stock aging
    return [
      { ageRange: "0-30 days", count: 15, value: 5000 },
      { ageRange: "31-90 days", count: 10, value: 3500 },
      { ageRange: "91-180 days", count: 5, value: 1500 },
      { ageRange: "181-365 days", count: 3, value: 800 },
      { ageRange: "Over 365 days", count: 2, value: 500 },
    ]
  }

  generateAutoPurchaseOrders(userId: string): void {
    // Mock implementation - in a real app, this would create POs for low stock items
    console.log(`Generating purchase orders for user ${userId}`)
  }

  // Utility methods
  formatCurrency(amount: number | undefined | null): string {
    if (amount === undefined || amount === null) {
      return "AED 0.00"
    }
    return `AED ${amount.toLocaleString("en-AE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  calculateVAT(amount: number, vatRate = 5): number {
    return amount * (vatRate / 100)
  }
}

export const inventoryService = new InventoryService()
