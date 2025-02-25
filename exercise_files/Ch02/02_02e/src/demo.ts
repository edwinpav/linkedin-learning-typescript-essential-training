// interface lets us define our own custom type
// interfaces strictly exist as a way to provide type info to TS
// interfaces only ever used at compile time and never in runtime
interface Contact extends Address { // merges Address interface into Contact interface
    id: number;
    name: string;
    birthDate?: Date; // ? means birthDate is optional
}

// break up into separate interface incase you wanted
// to use these properties on their own, and not just with
// the Contact interface
interface Address {
    line1: string;
    line2: string;
    province: string;
    region: string;
    postalCode: string;
}

let primaryContact: Contact = {
    birthDate: new Date("01-01-1980"),
    id: 12345,
    name: "Jamie Johnson",
    postalCode:
}