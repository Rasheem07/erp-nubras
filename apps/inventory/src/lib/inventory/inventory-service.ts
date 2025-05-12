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
  lastRestockDate: Date
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
  // Added missing properties
  isPreferred: boolean
  category: string
  website?: string
  city: string
  postalCode?: string
  country: string
  currency: string
  notes?: string
  preferredItems?: string[] // Array of item IDs that this supplier is preferred for
}

export interface Location {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  // Added missing properties
  type: string
  address?: string
  city: string
  postalCode?: string
  country: string
  contactPerson?: string
  contactPhone?: string
  isDefault: boolean
  parentLocationId?: string
}

export interface StockMovement {
  id: string
  itemId: string
  inventoryItemId?: string // Added for compatibility
  type: "receipt" | "issue" | "adjustment" | "transfer" | "Purchase" | "Sale"
  quantity: number
  fromLocation?: string
  toLocation?: string
  referenceId?: string
  referenceType?: string // Added missing property
  notes?: string
  createdBy: string
  createdAt: Date
}

// Updated PurchaseOrder status to include all needed statuses
export enum PurchaseOrderStatus {
  DRAFT = "draft",
  PENDING = "pending",
  APPROVED = "approved",
  SENT = "sent",
  PARTIALLY_RECEIVED = "partial",
  RECEIVED = "received",
  CANCELLED = "cancelled",
}
// Updated PurchaseOrder interface to include all needed properties
export interface PurchaseOrder {
  id: string
  poNumber: string
  supplierId: string
  supplierName: string
  status: PurchaseOrderStatus
  orderDate: Date
  expectedDeliveryDate?: Date
  items: PurchaseOrderItem[]
  subtotal: number
  vatAmount: number
  vatRate: number
  total: number
  totalAmount?: number
  paymentTerms: string
  shippingMethod: string
  currency: string
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  sendToSupplier?: boolean
}

// Updated PurchaseOrderItem interface to include all needed properties
export interface PurchaseOrderItem {
  id: string
  poId?: string
  inventoryItemId?: string
  itemId: string
  itemName: string
  sku: string
  quantity: number
  receivedQuantity?: number
  unitPrice: number
  unitOfMeasure: string
  vatRate: number
  total: number
  totalPrice?: number // Added for compatibility
  notes?: string
}

// Updated Material Allocation interface to include all needed properties
export interface MaterialAllocation {
  id: string
  allocationNumber?: string
  itemId: string
  inventoryItemId?: string
  itemName?: string
  projectId?: string
  projectName: string
  orderId?: string
  orderReference?: string
  orderNumber?: string
  quantity: number
  status: string
  allocatedBy: string
  allocatedAt: Date
  department?: string
  dueDate?: Date
  requiredByDate?: Date
  notes?: string
  items?: MaterialAllocationItem[]
}

// Material Allocation Item interface for items within allocation
export interface MaterialAllocationItem {
  id: string
  allocationId: string
  itemId: string
  itemName: string
  quantity: number
  unitOfMeasure: string
  notes?: string
}

// Enhanced WasteTracking interface with all required properties
export interface WasteTracking {
  id: string
  itemId: string
  inventoryItemId?: string // Added for compatibility
  itemName?: string // Added missing property
  quantity: number
  wastePercentage: number
  reason: string
  projectId?: string // Added missing property
  projectName?: string
  suggestedReuse?: string
  recordedAt: Date
  recordDate?: Date // Added for compatibility
  trackingNumber?: string
  date?: string
  department?: string
  wasteType?: string
  unitOfMeasure?: string
  disposalMethod?: string
  disposalNotes?: string // Added missing property
  notes?: string
  createdBy?: string
  recordedBy?: string // Added missing property
  createdAt?: Date
  orderNumber?: string // Added missing property
  preventiveMeasures?: string // Added missing property
  totalCost?: number // Added missing property
  costImpact?: string // Added missing property
  items?: any[] // Added missing property
  isRecyclable?: boolean // Added missing property
  rootCause?: string // Added missing property
  productionDelay?: string // Added missing property
  environmentalImpact?: string // Added missing property
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
    // Added properties
    isPreferred: true,
    category: "Fabric",
    website: "https://alfahimtextiles.ae",
    city: "Dubai",
    postalCode: "12345",
    country: "UAE",
    currency: "AED",
    notes: "Premium fabric supplier with excellent quality",
    preferredItems: ["item-001"],
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
    // Added properties
    isPreferred: false,
    category: "Fabric",
    website: "https://emiratesfabrics.ae",
    city: "Sharjah",
    postalCode: "54321",
    country: "UAE",
    currency: "AED",
    notes: "Good for bulk orders",
    preferredItems: ["item-002"],
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
    // Added properties
    isPreferred: false,
    category: "Thread",
    website: "https://adthreads.ae",
    city: "Abu Dhabi",
    postalCode: "98765",
    country: "UAE",
    currency: "AED",
    notes: "Specialized in high-quality threads",
    preferredItems: ["item-003"],
  },
]

// Updated mock locations with all required properties
const mockLocations: Location[] = [
  {
    id: "loc-001",
    name: "Main Warehouse",
    description: "Primary storage facility for all materials",
    isActive: true,
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-01-10"),
    // Added properties
    type: "Warehouse",
    address: "Industrial Area 1, Building 5",
    city: "Dubai",
    postalCode: "12345",
    country: "UAE",
    contactPerson: "Ali Mohammed",
    contactPhone: "+971 50 111 2222",
    isDefault: true,
    parentLocationId: undefined,
  },
  {
    id: "loc-002",
    name: "Production Floor",
    description: "Materials actively in use for production",
    isActive: true,
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-01-10"),
    // Added properties
    type: "Production",
    address: "Industrial Area 1, Building 5, Floor 2",
    city: "Dubai",
    postalCode: "12345",
    country: "UAE",
    contactPerson: "Fatima Ahmed",
    contactPhone: "+971 50 333 4444",
    isDefault: false,
    parentLocationId: "loc-001",
  },
  {
    id: "loc-003",
    name: "Retail Store",
    description: "Finished products ready for sale",
    isActive: true,
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-01-10"),
    // Added properties
    type: "Store",
    address: "Dubai Mall, Shop #123",
    city: "Dubai",
    postalCode: "54321",
    country: "UAE",
    contactPerson: "Mohammed Al Qasim",
    contactPhone: "+971 50 555 6666",
    isDefault: false,
    parentLocationId: undefined,
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
    lastRestockDate: new Date("2023-01-20"),
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
    lastRestockDate: new Date("2023-01-25"),
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
    lastRestockDate: new Date("2023-02-05"),
  },
]

// Updated mock stock movements with referenceType
const mockStockMovements: StockMovement[] = [
  {
    id: "mov-001",
    itemId: "item-001",
    type: "receipt",
    quantity: 100,
    toLocation: "loc-001",
    referenceId: "PO-001",
    referenceType: "PurchaseOrder",
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
    referenceId: "PROD-001",
    referenceType: "Production",
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
    referenceId: "PO-002",
    referenceType: "PurchaseOrder",
    notes: "Initial stock receipt",
    createdBy: "user-001",
    createdAt: new Date("2023-01-26"),
  },
]

// Updated mock purchase orders with the new properties and status values
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po-001",
    poNumber: "PO-2023-001",
    supplierId: "sup-001",
    supplierName: "Al Fahim Textiles",
    status: PurchaseOrderStatus.RECEIVED,
    orderDate: new Date("2023-01-15"),
    expectedDeliveryDate: new Date("2023-01-20"),
    items: [
      {
        id: "poi-001",
        poId: "po-001",
        itemId: "item-001",
        itemName: "Premium Cotton Fabric",
        sku: "FAB-COT-001",
        quantity: 100,
        receivedQuantity: 100,
        unitPrice: 25,
        unitOfMeasure: "Meter",
        vatRate: 5,
        total: 2625, // 100 * 25 * 1.05
      },
    ],
    subtotal: 2500, // 100 * 25
    vatAmount: 125, // 2500 * 0.05
    vatRate: 5,
    total: 2625, // 2500 + 125
    totalAmount: 2625,
    paymentTerms: "Net 30",
    shippingMethod: "Standard",
    currency: "AED",
    notes: "Initial order of cotton fabric",
    createdBy: "user-001",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "po-002",
    poNumber: "PO-2023-002",
    supplierId: "sup-002",
    supplierName: "Emirates Fabrics",
    status: PurchaseOrderStatus.RECEIVED,
    orderDate: new Date("2023-01-22"),
    expectedDeliveryDate: new Date("2023-01-27"),
    items: [
      {
        id: "poi-002",
        poId: "po-002",
        itemId: "item-002",
        itemName: "Silk Fabric",
        sku: "FAB-SLK-001",
        quantity: 50,
        receivedQuantity: 50,
        unitPrice: 50,
        unitOfMeasure: "Meter",
        vatRate: 5,
        total: 2625, // 50 * 50 * 1.05
      },
    ],
    subtotal: 2500, // 50 * 50
    vatAmount: 125, // 2500 * 0.05
    vatRate: 5,
    total: 2625, // 2500 + 125
    totalAmount: 2625,
    paymentTerms: "Net 45",
    shippingMethod: "Express",
    currency: "AED",
    notes: "Initial order of silk fabric",
    createdBy: "user-001",
    createdAt: new Date("2023-01-22"),
    updatedAt: new Date("2023-01-22"),
  },
]

// Mock material allocations with the updated structure
const mockMaterialAllocations: MaterialAllocation[] = [
  {
    id: "ma-001",
    allocationNumber: "ALLOC-2023-001",
    itemId: "item-001",
    itemName: "Premium Cotton Fabric",
    projectId: "PROJ-001",
    projectName: "Royal Wedding Dress",
    orderId: "ORD-001",
    orderReference: "ORD-2023-001",
    orderNumber: "ORDER-001",
    quantity: 15,
    status: "Reserved",
    allocatedBy: "John Doe",
    allocatedAt: new Date("2023-03-15"),
    department: "Production",
    dueDate: new Date("2023-04-15"),
    requiredByDate: new Date("2023-04-10"),
    notes: "Handle with care, premium material for royal customer",
  },
  {
    id: "ma-002",
    allocationNumber: "ALLOC-2023-002",
    itemId: "item-002",
    itemName: "Silk Fabric",
    projectId: "PROJ-002",
    projectName: "Luxury Kandura Collection",
    orderId: "ORD-002",
    orderReference: "ORD-2023-002",
    orderNumber: "ORDER-002",
    quantity: 30,
    status: "Issued",
    allocatedBy: "Jane Smith",
    allocatedAt: new Date("2023-03-18"),
    department: "Design",
    dueDate: new Date("2023-04-20"),
    requiredByDate: new Date("2023-04-15"),
    notes: "Special silk for luxury collection",
  },
  {
    id: "ma-003",
    allocationNumber: "ALLOC-2023-003",
    itemId: "item-003",
    itemName: "Gold Thread",
    projectId: "PROJ-001",
    projectName: "Royal Wedding Dress",
    orderId: "ORD-001",
    orderReference: "ORD-2023-001",
    orderNumber: "ORDER-001",
    quantity: 5,
    status: "Reserved",
    allocatedBy: "John Doe",
    allocatedAt: new Date("2023-03-15"),
    department: "Production",
    dueDate: new Date("2023-04-15"),
    requiredByDate: new Date("2023-04-10"),
    notes: "Gold thread for embroidery details",
  },
  {
    id: "ma-004",
    allocationNumber: "ALLOC-2023-004",
    itemId: "item-001",
    itemName: "Premium Cotton Fabric",
    projectId: "PROJ-003",
    projectName: "Traditional Abaya Set",
    orderId: "ORD-003",
    orderReference: "ORD-2023-003",
    orderNumber: "ORDER-003",
    quantity: 25,
    status: "Completed",
    allocatedBy: "Ahmed Hassan",
    allocatedAt: new Date("2023-03-20"),
    department: "Production",
    dueDate: new Date("2023-04-10"),
    requiredByDate: new Date("2023-04-05"),
    notes: "Standard cotton for traditional abayas",
  },
  {
    id: "ma-005",
    allocationNumber: "ALLOC-2023-005",
    itemId: "item-003",
    itemName: "Gold Thread",
    projectId: "PROJ-003",
    projectName: "Traditional Abaya Set",
    orderId: "ORD-003",
    orderReference: "ORD-2023-003",
    orderNumber: "ORDER-003",
    quantity: 3,
    status: "Completed",
    allocatedBy: "Ahmed Hassan",
    allocatedAt: new Date("2023-03-20"),
    department: "Production",
    dueDate: new Date("2023-04-10"),
    requiredByDate: new Date("2023-04-05"),
    notes: "Gold thread for abaya embellishment",
  },
]

// Updated mock waste records with all required properties
const mockWasteRecords: WasteRecord[] = [
  {
    id: "wr-001",
    itemId: "item-001",
    itemName: "Premium Cotton Fabric",
    quantity: 2.5,
    wastePercentage: 5,
    reason: "Cutting waste",
    projectId: "PROJ-001",
    projectName: "Royal Wedding Dress",
    suggestedReuse: "Small accessories",
    recordedAt: new Date("2023-03-18"),
    trackingNumber: "WASTE-2023-001",
    department: "Production",
    wasteType: "Fabric",
    unitOfMeasure: "Meter",
    disposalMethod: "Recycling",
    disposalNotes: "Sent to recycling facility",
    notes: "Normal cutting waste within acceptable limits",
    recordedBy: "John Doe",
    createdAt: new Date("2023-03-18"),
    orderNumber: "ORDER-001",
    preventiveMeasures: "Optimize cutting patterns",
    totalCost: 62.5, // 2.5 * 25
    costImpact: "Low",
    isRecyclable: true,
    rootCause: "Standard cutting process",
    productionDelay: "None",
    environmentalImpact: "Low",
  },
  {
    id: "wr-002",
    itemId: "item-002",
    itemName: "Silk Fabric",
    quantity: 1.8,
    wastePercentage: 6,
    reason: "Defective material",
    projectId: "PROJ-002",
    projectName: "Luxury Kandura Collection",
    suggestedReuse: "Training samples",
    recordedAt: new Date("2023-03-22"),
    trackingNumber: "WASTE-2023-002",
    department: "Quality Control",
    wasteType: "Fabric",
    unitOfMeasure: "Meter",
    disposalMethod: "Donation",
    disposalNotes: "Donated to design school",
    notes: "Material had color inconsistencies",
    recordedBy: "Jane Smith",
    createdAt: new Date("2023-03-22"),
    orderNumber: "ORDER-002",
    preventiveMeasures: "Improve supplier quality checks",
    totalCost: 90, // 1.8 * 50
    costImpact: "Medium",
    isRecyclable: true,
    rootCause: "Supplier quality issue",
    productionDelay: "1 day",
    environmentalImpact: "Low",
  },
  {
    id: "wr-003",
    itemId: "item-003",
    itemName: "Gold Thread",
    quantity: 0.5,
    wastePercentage: 10,
    reason: "Thread ends",
    projectId: "PROJ-003",
    projectName: "Traditional Abaya Set",
    suggestedReuse: "Not reusable",
    recordedAt: new Date("2023-03-25"),
    trackingNumber: "WASTE-2023-003",
    department: "Production",
    wasteType: "Thread",
    unitOfMeasure: "Spool",
    disposalMethod: "Waste",
    disposalNotes: "Standard disposal",
    notes: "Normal thread waste from embroidery process",
    recordedBy: "Ahmed Hassan",
    createdAt: new Date("2023-03-25"),
    orderNumber: "ORDER-003",
    preventiveMeasures: "None - standard waste",
    totalCost: 7.5, // 0.5 * 15
    costImpact: "Low",
    isRecyclable: false,
    rootCause: "Standard embroidery process",
    productionDelay: "None",
    environmentalImpact: "Low",
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
      lastRestockDate: new Date(),
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

  // Added this method to update purchase order status specifically
  updatePurchaseOrderStatus(id: string, status: PurchaseOrderStatus): PurchaseOrder {
    return this.updatePurchaseOrder(id, { status })
  }

  // Added this method to update purchase order received items
  updatePurchaseOrderReceived(
    id: string,
    items: PurchaseOrderItem[],
    status: PurchaseOrderStatus,
    notes?: string,
    receiptDate?: Date,
  ): PurchaseOrder {
    return this.updatePurchaseOrder(id, {
      items,
      status,
      notes: notes ? `${notes} (Receipt date: ${receiptDate?.toLocaleDateString()})` : undefined,
      updatedAt: receiptDate || new Date(),
    })
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
        referenceId: po.poNumber,
        referenceType: "PurchaseOrder",
        notes: `Received from PO ${po.poNumber}`,
        createdBy: "user-001", // Should come from auth context in real app
      })
    }

    // Update PO status
    this.updatePurchaseOrderStatus(poId, PurchaseOrderStatus.RECEIVED)
  }

  // Material Allocations
  getMaterialAllocations(): MaterialAllocation[] {
    return [...mockMaterialAllocations]
  }

  getMaterialAllocationsByItemId(itemId: string): MaterialAllocation[] {
    return mockMaterialAllocations.filter((allocation) => allocation.itemId === itemId)
  }

  getMaterialAllocationById(id: string): MaterialAllocation | undefined {
    return mockMaterialAllocations.find((allocation) => allocation.id === id)
  }

  createMaterialAllocation(allocation: Omit<MaterialAllocation, "id" | "allocatedAt">): MaterialAllocation {
    const newAllocation: MaterialAllocation = {
      ...allocation,
      id: `ma-${mockMaterialAllocations.length + 1}`.padStart(6, "0"),
      allocatedAt: new Date(),
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

  // Waste Records
  getWasteRecords(): WasteRecord[] {
    return [...mockWasteRecords]
  }

  // Added alias for getWasteRecords for compatibility
  getWasteTrackings(): WasteRecord[] {
    return this.getWasteRecords()
  }

  getWasteRecordsByItemId(itemId: string): WasteRecord[] {
    return mockWasteRecords.filter((record) => record.itemId === itemId)
  }

  getWasteRecordById(id: string): WasteRecord | undefined {
    return mockWasteRecords.find((record) => record.id === id)
  }

  createWasteRecord(record: Omit<WasteRecord, "id" | "recordedAt">): WasteRecord {
    const newRecord: WasteRecord = {
      ...record,
      id: `wr-${mockWasteRecords.length + 1}`.padStart(6, "0"),
      recordedAt: new Date(),
      createdAt: new Date(),
    }
    mockWasteRecords.push(newRecord)
    return newRecord
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
