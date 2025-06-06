interface Contact {
    id: number;
    name: ContactName; // type alias used here
    birthDate?: Date;
}

let primaryContact: Contact = {
    birthDate: new Date("01-01-1980"),
    id: 12345,
    name: "Jamie Johnson",
}

type ContactName = string // type alias; NOT a new type themselves