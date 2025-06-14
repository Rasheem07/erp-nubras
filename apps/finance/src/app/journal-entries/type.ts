export interface journalEntry {
    id: number;
    date: Date;
    ref_type: string;
    ref_no: number;
    description: string;
    notes: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    entries: Entry[];
    debitTotal: number;
    creditTotal: number;
}

export interface Entry { 
    id: number;
    accountId: number;
    debit: number;
    credit: number;
    created_at: Date
}