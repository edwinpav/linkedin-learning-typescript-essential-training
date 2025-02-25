interface Contact {
    id: number;
    name: string;
}

// This is a valid T2. 
// in <T1, T2 extends T1>, extends doesn't mean T2 has to literally extend T1
// it only has to MATCH it (T2 has to have at least the same properties as T1) and then add ANY OTHER properties it wants
/*
interface UserContact {
    id: number
    name: string
    username: string
}
*/

// enums can have generic types as well
interface UserContact<TExternalId> {
    id: number
    name: string
    username: string
    externalId: TExternalId
    loadExternalId(): Task<TExternalId> // can reference the generic type TExternalId anywhere inside the UserContact enum
}

// <T1, T2 extends T1> defines the generic types T1 and T2
// TS can determine the input and output types based on what is passed in each time clone() is called
// each time clone() is called, it can be used with different types

// T2 extends T1 restricts the second generic type (in this case the return type),
// to be the same type as T1 (in this case the input type)
function clone<T1, T2 extends T1>(source: T1): T2 {
    return Object.apply({}, source);
}

const a: Contact = { id: 123, name: "Homer Simpson" };
// fix: const b = clone<Contact, UserContact<number>>(a)
const b = clone<Contact, UserContact>(a) // <Contact, UserContact> specifies the type for each generic type

const dateRange = { startDate: Date.now(), endDate: Date.now() }
const dateRangeCopy = clone(dateRange)