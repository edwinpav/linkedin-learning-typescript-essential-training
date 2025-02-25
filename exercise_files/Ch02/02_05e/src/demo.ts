interface Contact {
    id: number;
    name: string;
    // defining a method that can be applied on an interface
    clone(name: string): Contact // accepts a parameter called name with type string and returns type Contact
}

// restricting allowable types for parameters and return type
// in TS, functions can also be passed as variables
// func: (source: Contact) => Contact --> parameters are enclosed in parentheses with their respective types
function clone(source: Contact): Contact {
    return Object.apply({}, source);
}

const a: Contact = { id: 123, name: "Homer Simpson" };
const b = clone(a)