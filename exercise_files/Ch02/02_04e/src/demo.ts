interface Contact {
    id: number;
    name: ContactName;
    birthDate?: Date;
    status: ContactStatus; // limits which values (strings in this case) can be assigned to status
}

// typical enum
enum ContactStatus {
    Active = "active",
    Inactive = "inactive",
    New = "new"
}

let primaryContact: Contact = {
    birthDate: new Date("01-01-1980"),
    id: 12345,
    name: "Jamie Johnson",
    status: ContactStatus.Active // enum usage, at runtime the value of status is "active"
}

type ContactName = string