/* The CreateStaffDto class in TypeScript defines properties for creating a new staff member with
optional fields such as email, address, level, photo, and specialties. */
export class CreateStaffDto {
    name: string;
    department: string;
    email?: string;
    phone: string;
    address?: string;
    level?:string;
    role: string;
    status: string;
    salary: string;
    photo?: string;
    specialties?: string[];
}
