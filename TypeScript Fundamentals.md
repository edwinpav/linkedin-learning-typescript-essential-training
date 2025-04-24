# TypeScript Fundamentals

## 1 - Intro

### Adding TypeScript to an existing solution

- `tsconfig.json`: typescript config file, at root of directory
    - `"include": [...]`: specifies location of which files ts should compile (defines scope of this project)
    - `outDir` : specifies folder where the generated js file is placed
- To compile your code, run ts compiler with `tsc`

## 2 - Basic TypeScript Usage

### Primitives and built-in types

- Ts has **type inference**
- You can also specify the type of a variable (`let x: number`, `let b: string[]`)
- If you want to assign a different type to an existing variable, you can use the `any` type (`let x: any`) or cast a variable as `any` (`b = “Hello! as any`)

### Creating custom types with interfaces

- An `interface` lets us define our own custom types
- Interfaces strictly exist as a way to provide type info to ts
- Interfaces are only ever used at compile time and never in runtime

```tsx
interface Contact extends Address { // merges Address interface with Contact interface
	id: number;
	name: string;
	birthDate?: Date; // ? means birthDate is an optional attribute
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
    postalCode: ...,
    <other_attributes>:
}
```

### Defining types using type aliases

- A type alias provides an alias (or an alternate name) *for an already existing type* (`type ContactName = string;`)
- Type aliases are *not* new types themselves, and so they can be used interchangeably with the type that they alias
- *What’s the point of type aliases?* Add more meaning to the field/variable they’re describing

```tsx
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
```

### Defining enumerable types

- Using `enum`s as types limits which values can be assigned to their variables
    - Forces users to avoid spelling mistakes (if a type is a string, it can be any string whatsoever, which causes more error checking to be written)
    - **Every value in the enum has to be the same type** (at runtime, the enum takes on one of the values that it has when it’s defined)

```tsx
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
```

### Typing functions

- You can give types to function parameters and return types

```tsx
function clone(source: Contact): Contact {
    return Object.apply({}, source); // this function returns `any` type, so if return type is not specified, ts will infer return type to be `any`
}

const a: Contact = { id: 123, name: "Homer Simpson" };
const b = clone(a);
```

- In ts, functions can also be passed as arguments and you can give them types as well
    - Parameters and their types are contained within parentheses, followed by `=>`, followed by the function return type: `func: (source: Contact) => Contact`

```tsx
function clone(source: Contact, func: (source: Contact) => Contact): Contact {
    return Object.apply({}, source); // this function returns `any` type, so if return type is not specified, ts will infer return type to be `any`
}
```

- You can also define functions inside interfaces along with their parameter and return types

```tsx
interface Contact {
    id: number;
    name: string;
    // defining a method that can be applied on an interface
    clone(name: string): Contact // accepts a parameter called name with type string and returns type Contact
}
```

### Defining a metatype using generics

- A generic type is a metatype: a type that represents any other type you might want to substitute in
- In the above `clone()` code, the function doesn’t do anything specific with `Contact` types, so you can replace them with generic types

```tsx
// <T> before parameters defines the generic type T
function clone<T>(source: T): T {
    return Object.apply({}, source);
}
```

- You can define as many generic types as you wish

```tsx
function clone<T1, T2>(source: T1): T2 {
    return Object.apply({}, source);
}
```

- **But**, if you use generics in a way in which ts can’t infer what the types should be, you have to explicitly define the types of each of them when calling the function

```tsx
const a: Contact = { id: 123, name: "Homer Simpson" };
const b = clone<Contact, Contact>(a);
// or for example, const b = clone<Contact, Date>(a);
```

- **Generic constraints**: allow you to place more restrictive rules around the types that may be used as generic type parameters in your functions
    - Ex: If you wanted to allow the clone method to accept multiple generic type parameters, but wanted to make sure return type matched input type, you could restrict the types that may be used for the second `T2` parameter using `extends`
    - T2 just has to **match** the types of T1, *but can also extend itself with additional types*
    
    ```tsx
    interface Contact {
        id: number;
        name: string;
    }
    
    interface UserContact {
        id: number
        name: string
        username: string
    }
    
    // T2 has to *at least* match the properties of T1
    function clone<T1, T2 extends T1>(source: T1): T2 {
        return Object.apply({}, source);
    }
    
    const a: Contact = { id: 123, name: "Homer Simpson" };
    const b = clone<Contact, UserContact>(a);
    ```
    
- Generics can also be applied to interfaces and classes too
    
    ```tsx
    interface Task<T> {
      result: T
      run(): Promise<T>
    }
    
    // enums can have generic types as well
    interface UserContact<TExternalId> {
        id: number
        name: string
        username: string
        externalId: TExternalId // can reference the generic type TExternalId anywhere inside the UserContact enum
        loadExternalId(): Task<TExternalId> // return type is another interface Task, that also takes in a generic type
    }
    
    const numberTask: Task<number> = {
      result: 42,
      run: () => Promise.resolve(42)
    }
    
    const userContactNumber: UserContact<number> = {
      id: 2,
      name: "Bob Smith",
      username: "bob",
      externalId: 42,
      loadExternalId: () => numberTask
    }
    ```
    

## 3 - Defining More Complex Types

### Combining multiple types with union types

- You can assign a variable to be one of many types using `|` (`let birthDate: Date | number | string`)
    - Then, functions that process the birthDate field can determine the type of it using `typeof` and process this field accordingly
    
    ```tsx
    type ContactName = string;
    
    enum ContactStatus {
    	Active = "active",
    	Inactive = "inactive",
    	New = "new",
    }
    
    type ContactBirthDate = Date | number | string
    
    interface Contact  {
        id: number;
        name: ContactName;
        birthDate?: ContactBirthDate; // allows this to be a Date value, number value, or string value
        status?: ContactStatus;
    }
    
    function getBirthDate(contact: Contact) {
        if (typeof contact.birthDate === "number") {
            return new Date(contact.birthDate);
        }
        else if (typeof contact.birthDate === "string") {
            return Date.parse(contact.birthDate)
        }
        else { // Date type
            return contact.birthDate
        }
    }
    ```
    
- Another use of the type alias syntax is to combine multiple types together to create an entirely new type using the `&` operator

```tsx
// instead of 
interface Contact extends Address {
    id: number;
    name: ContactName;
    birthDate?: ContactBirthDate;
    status?: ContactStatus;
}

interface Address {
    line1: string;
    line2: string;
    province: string;
    region: string;
    postalCode: string;
}

// can do...
/*
interface Contact  {
    id: number;
    name: ContactName;
    birthDate?: ContactBirthDate;
    status?: ContactStatus;
}

interface Address {
    line1: string;
    line2: string;
    province: string;
    region: string;
    postalCode: string;
}
*/

// Allows you to have two different Contact types (one with Addresses, and one without)

// could also just create a whole other interface:
// interface AddressableContact extends Contact, Address {}

type AddressableContact = Contact & Address // combines both types together to create an enitrely new type
```

- You can use type aliases as an alternative to enum values

```tsx
// instead of ...
enum ContactStatus {
	Active = "active",
	Inactive = "inactive",
	New = "new",
}

// can do...
type ContactStatus = "active" | "inactive" | "new"

let primaryContact: Contact = {
    id: 12345,
    name: "Jamie Johnson",
    status: "active" // values are still restrictied to exactly "active", "inactive", etc
}
```

---

More Advanced Stuff 

---

### `keyof` operator

- `keyof`: reference keys/fields of a given type, values can only be one of the **keys/fields** of a given type
- In the code block below, `field` can only be “status”, “id”, “name”, or “birthDate

```tsx
type ContactFields = keyof Contact
const field : ContactFields = "status" // can only be “status”, “id”, “name”, or “birthDate"
```

- *Why is it useful?* You can restrict users to only pass in parameters that are keys of some data structure (like a hash table)

```tsx
// don't have to use it with generics
/*
function getValue <T>(source:T, propertyName: keyof T){
    return source[propertyName]
}
*/

// more generic and more useful
function getValue <T, U extends keyof T>(source:T, propertyName: U){
    return source[propertyName]
}

const value = getValue({min:1,max:34},"max")
```

### `typeof` operator

- Using `typeof` statically

```tsx
function toContact(nameOrContact: string | Contact): Contact {
    if (typeof nameOrContact === "object") {
        return {
            id: nameOrContact.id,
            name: nameOrContact.name,
            status: nameOrContact.status
        }
    }
    else {
        return {
            id: 0,
            name: nameOrContact,
            status: "active"
        }
    }
}
```

- Using `typeof` dynamically

```tsx
const myType = { min: 1, max: 200 } // type infered by ts

// usually not done (interfaces usually used instead)
function save(source: typeof myType) {body...} // parameter type has to match exact structure as myType
```

### Indexed access types

- Indexed access types let you determine the type of a certain property (or multiple properties) of a target object
- If you have an `interface Contact`, with an `id` property, you can access its type via indexing like this: `type Awesome = Contact["id"]` , and you can give the `Contact["id"]` type to other properties/variables

```tsx
type ContactStatus = "active" | "inactive" | "new";

interface Address {
    street: string;
    province: string;
    postalCode: string;
}

interface Contact {
    id: number;
    name: string;
    status: ContactStatus;
    address: Address;
}

type Awesome = Contact["address"]["postalCode"] // nested indexing!

interface ContactEvent {
    contactId: Contact["id"];
}

interface ContactDeletedEvent extends ContactEvent {
}

interface ContactStatusChangedEvent extends ContactEvent {
    oldStatus: Contact["status"];
    newStatus: Contact["status"];
}
```

```tsx
interface ContactEvents {
    deleted: ContactDeletedEvent;
    statusChanged: ContactStatusChangedEvent;
    // ... and so on
}

function getValue<T, U extends keyof T>(source: T, propertyName: U) {
    return source[propertyName];
}

function handleEvent<T extends keyof ContactEvents>(
    eventName: T,
    // second parameter is based on the type of first parameter
    handler: (evt: ContactEvents[T]) => void
) {
    if (eventName === "statusChanged") {
	      // can't pass a ContactDeleteedEvent here bc ts knows handler type is now
	      // ContactEvents["statusChanged"] --> ContactStatusChangedEvent
        handler({ contactId: 1, oldStatus: "active", newStatus: "inactive" })
    }
}

handleEvent("statusChanged", evt => evt)
```

### Defining dynamic but limited types with records

- The **wrong** way of dynamically changing variables

```tsx

let x: any = { name: "Wruce Bayne" }; // don't want to use "any" keyword!
x.id = 1234;
```

- Can use dynamic, but limited types with `Record`s
    - Records take 2 generic parameters: `Records<K, T>` where `K` represents the type of the keys and `T` represents the type of the values
    - E.g. `let x: Record<string, string> = { name: "Edwin" }` , but `x.number = 1234` would error out unless you had a `union`
    
    ```
    let x: Record<string, string | number | boolean | Function> = { name: "Wruce Bayne" }
    x.number = 1234 // key is string "number" and value is a number
    x.active = true // key is string "active" and value is boolean
    x.log = () => console.log("awesome!") // key is string "log" and value is a Function
    // x = 1234 would throw an error because the possibly property value can only be a string, not a number!
    ```
    
    ```tsx
    interface Query {
        sort?: 'asc' | 'desc';
        matches(val): boolean;
    }
    
    function searchContacts(contacts: Contact[], query: Record<keyof Contact, Query>) {
        return contacts.filter(contact => {
    		    // casting property as keyof Contact, then casting that as an array
            for (const property of Object.keys(contact) as (keyof Contact)[]) {
                // get the query object for this property
                const propertyQuery = query[property];
                // check to see if it matches
                if (propertyQuery && propertyQuery.matches(contact[property])) {
                    return true;
                }
            }
    
            return false;
        })
    }
    
    const filteredContacts = searchContacts(
        [/* contacts */],
        {
            id: { matches: (id) => id === 123 },
            name: { matches: (name) => name === "Carol Weaver" },
        }
    );
    ```
    
    - How to allow filteredContacts to only have some of the keys from Contact and not all? Described later

### Resource management with the using keyword

- Can use the `using` statement to ensure that the resources your app is consuming are properly cleaned up after use, *even when the code using them results in an error*
    - For example, clearing files that your code has written to
    - Can use the `try-catch` block with a `finally` clause
- Instead, can use the `using` keyword like so: `using temp = new TempData()`
    - Ts knows that when this code block completes, it will need to dispose of that object so that the resource it uses are released as well
    - In the background, the converted javascript code is just `try-finally` blocks
- **But**, in order to use the using keyword, the class we’re instantiating needs to have a `Symbol.dispose` method defined
    
    ```tsx
    [Symbol.dispose]() {
    	this.clear();
    }
    ```
    

## 4 - Extending and Extracting Metadata from Existing Types

### Extracting and modifying existing types

- `Partial` wrapper creates the same exact type, but with all of its properties defined as optional

```tsx
interface Contact {
    id: number;
    name: string;
    status: ContactStatus;
    address: Address;
    email: string;
}
```

```tsx
// The Record doesn't need to have all keys of Contact
type ContactQuery = Partial<Record<keyof Contact, Query>>

function searchContacts(contacts: Contact[], query: ContactQuery) {
    return contacts.filter(contact => {
        for (const property of Object.keys(contact) as (keyof Contact)[]) {
            // get the query object for this property
            const propertyQuery = query[property];
            // check to see if it matches
            if (propertyQuery && propertyQuery.matches(contact[property])) {
                return true;
            }
        }

        return false;
    })
}

// the below code is now allowed:
// note how th record only has the id and name keys of Contact,
// but not status or address
const filteredContacts = searchContacts(
    [/* contacts */],
    {
        id: { matches: (id) => id === 123 },
        name: { matches: (name) => name === "Carol Weaver" },
    }
);
```

- To force all keys/fields to be present (opposite of Partial), use `Required`

```tsx
// The Record *needs* to have all keys of Contact
type RequiredContactQuery = Required<Record<keyof Contact, Query>>
```

- If you want to prevent certain keys/fields from being used, you can use `Omit` which requires 2 parameters, the second being the properties you’d like to omit

```tsx
type ContactQuery = Omit<
	Partial<
		Record<keyof Contact, Query>
	>,
	"address" | "status" // use union to list multiple omitted properties
>

// results in
/*
type ContactQuery = {
	id?: Query; // optional bc of Partial<>
	name?: Query; // optional bc of Partial<>
	email?: Query; // optional bc of Partial<>
}
*/
```

- Instead of picking which keys/fields disallow, you can specify which keys/field to allow using `Pick`

```tsx
type ContactQuery = 
    Partial<
        Pick<
            Record<keyof Contact, Query>,
            "id" | "name"
        >
    >

// results in
/*
type ContactQuery = {
	id?: Query; // optional bc of Partial<>
	name?: Query; // optional bc of Partial<>
}
*/
```

```tsx
type ContactQuery = 
    Partial<
        Pick<
            Record<keyof Contact, Query>,
            "id" | "name"
        >
    >

type RequiredContactQuery = Required<ContactQuery>

// results in
/*
type RequiredContactQuery = {
	name: Query; // not optional anymore
	id: Query; // not optional anymore
}
*/
```

### Extracting metadata from existing types

- You can use `mapped` types to create custom types as well instead of using Records

```tsx
type ContactQuery = {
	[TProp in keyof Contact]?: Query
}

// results in
/*
type ContactQuery = {
	id?: Query;
	name?: Query;
	status?: Query;
	address?: Query;
	email?: Query;
}
*/
```

- Allows much more complex definitions to be much more readable

```tsx
// Here, ts infers the type of val to be any, but we want to avoid this
interface Query {
    sort?: 'asc' | 'desc';
    matches(val): boolean;
}

// so, convert to a generic type...
interface Query<TProp> {
    sort?: 'asc' | 'desc';
    matches(val: TProp): boolean;
}

// and update type ContactQuery...
type ContactQuery = {
    [TProp in keyof Contact]?: Query<Contact[TProp]>
}

// which results in...
/* 
type ContactQuery = {
    id?: Query<number>;
    name?: Query<string>;
    status?: Query<ContactStatus>;
    address?: Query<Address>;
    email?: Query<string>;
}
*/
```

- Challenge: change query from any type to the specific type

```tsx
/*
function query<T>(
    items: T[],
    query: any
) {}
*/

function query<T>(
    items: T[],
    query: {[TProp in keyof T]?: (Function: T[TProp]) => boolean}
    // other solution... (not fully correct)
    // this results in each key's value having a type of either number or string
    // bc T[keyof T] occurs for each key of T for a single key in the Record
    // query: Record<keyof T, (Function: T[keyof T]) => boolean>
) {}

const matches = query(
    [
        { name: "Ted", age: 12 },
        { name: "Angie", age: 31 }
    ],
    {
        name: name => name === "Angie",
        age: age => age > 30
    })
```

## 5 - Adding Dynamic Behaviors with Decorators

### What are decorators and why are they helpful?

- Decorators are metadata that allow you to add additional information and/or functionality to your code without actually changing your code
- Messy and bad code

```tsx
class ContactRepository {
    private contacts: Contact[] = [];

    getContactById(id: number): Contact | null {
		    // can be eliminated with @log decorator
        console.trace(`ContactRepository.getContactById: BEGIN`);

				// can be eliminated with @authorize decorator
        if (!currentUser.isInRole("ContactViewer")) {
            throw Error("User not authorized to execute this action");
        }

        const contact = this.contacts.find(x => x.id === id);

        console.debug(`ContactRepository.getContactById: END`);

        return contact;
    }

    save(contact: Contact): void {
        console.trace(`ContactRepository.save: BEGIN`);

        if (!currentUser.isInRole("ContactEditor")) {
            throw Error("User not authorized to execute this action");
        }

        const existing = this.getContactById(contact.id);

        if (existing) {
            Object.assign(existing, contact);
        } else {
            this.contacts.push(contact);
        }

        console.debug(`ContactRepository.save: END`);
    }
}
```

- Simpler, cleaner code with decorators

```tsx
@log
class ContactRepository {
    private contacts: Contact[] = [];

    @authorize("ContactViewer")
    getContactById(id: number): Contact | null {
        const contact = this.contacts.find(x => x.id === id);

        return contact;
    }

    @authorize("ContactEditor")
    save(contact: Contact): void {
        const existing = this.getContactById(contact.id);

        if (existing) {
            Object.assign(existing, contact);
        } else {
            this.contacts.push(contact);
        }
    }
}
```

- Need to opt into using decorators for ts within the `tsconfig.json` file

```tsx
{
    "compilerOptions": {
        "target": "esnext",
        "noEmit": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true // runtime metadata --> need reflect-metadata package in package.json
    },
    "include": ["src/**/*"]
}
```

### Creating a method decorator

- **Method decorator**: a decorator that you apply to a method
- A method decorator function has three parameters:
    1. `target`: object that the decorator is being applied to
    2. `property`: name of the property that the decorator is applied to
    3. `descriptor`: object containing the current metadata about the property
        1. It has type `PropertyDescriptor`
        2. In the case of a method decorator, we care about the `value?` property of `PropertyDescriptor` 
            1. **It’s value is the function that’s executed when this method is called**
- Two options to modify behavior a method decorator
    1. Edit descriptor in place like `descriptor.value = function () { }` 
    2. Return a brand new descriptor object like this
    
    ```tsx
    return {
    	// ... make any changes here
    } as PropertyDescriptor 
    ```
    

```tsx
function authorize(target: any, property: string, descriptor: PropertyDescriptor) {
    const wrapped = descriptor.value

    descriptor.value = function () {
        if (!currentUser.isAuthenticated()) {
            throw Error("User is not authenticated");
        }

        try {
            return wrapped.apply(this, arguments);
        } catch (ex) {
            // TODO: some fancy logging logic here
            throw ex;
        }
    }
}
```

### Creating decorator factories

- The above custom decorator does not allow us to pass in any of our own parameters (we can only call it with `@authorize`
- The decorator must have the signature decorator above, so how do we modify it to include our own parameters? **We wrap the decorator definition within another function called a decorator factory**
    - The decorator above becomes the return value

```tsx
// wrapper function with our own parameter `role`
function authorize(role: string) {
    return function authorizeDecorator(target: any, property: string, descriptor: PropertyDescriptor) {
        const wrapped = descriptor.value

        descriptor.value = function () {
            if (!currentUser.isAuthenticated()) {
                throw Error("User is not authenticated");
            }
            // our own parameter used in the decorator function
            if (!currentUser.isInRole(role)) {
                throw Error(`User not in role ${role}`);
            }

            return wrapped.apply(this, arguments);
        }
    }
}

```

### Creating a class decorator

- Class decorators take in one parameter (`target`), but there is no object, now so what does it refer to? **The constructor of the class**
    - `function freeze(constructor: Function) {}`
    - The need to modify a constructor function with a class decorator doesn’t come up much
- Can use class decorators to dynamically add properties or behaviors at runtime
    - Instead of modifying a constructor as its passed in, **we actually return a brand new class**

```tsx
// this generic type is for constructors
function singleton<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class Singleton extends constructor {
        static _instance = null;

				// "...args" gets all parameters being passed into original constructor
        constructor(...args) {
            super(...args);
            if (Singleton._instance) {
                throw Error("Duplicate instance")
            }

            Singleton._instance = this
        }
    }
}

@freeze
@singleton
class ContactRepository {}
```

### Creating a property decorator

- **Property decorators:** applied to properties of a class

```tsx
@freeze
@singleton
class ContactRepository {
    @auditable // anytime value of this property is changed, a message is logged to console
    private contacts: Contact[] = []; // property of a class with a decorator
```

- Methods are just properties of a class that happen to be functions, so the definition of a property decorator is very similar to a method decorator
- They take two parameters
    1. `target`: instance of the property being decorated 
    2. `propertyName`: name of the property being decorated
    
    ```tsx
    function auditable(target: object, key: string | symbol) {
        // get the initial value, before the decorator is applied
        let val = target[key];
    
        // then overwrite the property with a custom getter and setter
        Object.defineProperty(target, key, {
            get: () => val,
            set: (newVal) => {
                console.log(`${key.toString()} changed: `, newVal);
                val = newVal;
            },
            enumerable: true,
            configurable: true
        })
    }
    ```
    

## 6 - Working with Modules

### Module basics

- **Modules**: enable you to link code that is distributed across many files
- If you are importing multiple files into one, but they have same method names, the last imported file’s function overrides the other files’ function of the same name
    
    ```html
    <html>
    
    <head>
        <script type="text/javascript" src="utils.js"></script>
        // loadContent() in app.js overwrites loadContent() in utils.js
        <script type="text/javascript" src="app.js"></script>
    </head>
    
    <body></body>
    
    </html>
    ```
    
- **With modules, each file shares it’s own memory space**
- **Modules can also load from other modules**
    - So, you don’t have to load every module
    
    ```tsx
    // in app.js
    import { formatDate } from "./utils.js"
    
    // in index.html
    <html>
    
    <head>
        <script type="module" src="app.js"></script>
    </head>
    
    <body></body>
    
    </html>
    ```
    

### Share code with imports and exports

- For javascript, if you have imports in your html code, the later imports automatically have access to the functions from the earlier imports
    
    ```html
      <script type="text/javascript" src="utils.js"></script>
      // app.js has access to formatDate() which is defined in utils.js
      <script type="text/javascript" src="app.js"></script>
    ```
    
- **The above code won’t work in typescript! Typescript needs to import modules**
- **Before something can be imported, it must first be exported**
    
    ```tsx
    // utils.ts (NOT js anymore)
    
    // note the "export" keyword
    export function formatDate(date) {
        return date.toLocaleDateString("en-US", {
            dateStyle: "medium"
        })
    }
    ```
    
    ```tsx
    // app.ts (NOT js anymore)
    
    import {formatDate } from "./utils" // import statement here
    
    const formattedDate = formatDate(new Date())
    console.log(formattedDate)
    ```
    

### Defining global types with ambient modules

- *What if you have large javascript files that rely on global imports, and thus you can’t just convert them to typescript code?*
    - Convert file names to `.ts` extension
    - Have a `globals.d.ts` (need that extension, name doesn’t matter), and you can define what functions will be in the global namespace
        
        ```tsx
        // globals.d.ts
        declare global {
            /** this formats a date value to a human-readable format */
            function formatDate(date: Date): string
        }
        
        export {} // need to export this bc ts expects this file to be a module
        ```
        
    - Note: **only** **the** **definition** of the function is written, not its implementation
- Now can use the function like this
    
    ```tsx
    // app.ts (NOT js anymore)
    
    declare global {
        /** this formats a date value to a human-readable format */
        function formatDate(date: Date): string
    }
    
    export {}
    ```
    

### Declaration merging

- *How to extend the definition of a type that typescript is aware of?*
    - **Define an interface with the same name as your class**
    - **Then, fill this interface with whatever you’d like that class to expose**
    
    ```tsx
    interface Customer {
        /** saves the customer somewhere */
        save(): void
    }
    
    class Customer {}
    
    const customer = new Customer()
    customer.save = function() {}
    ```
    
    - Ts considers classes to be interfaces, but they just happen to be interfaces that contain an implementation
- Can also be used for global variables
    
    ```tsx
    // globals.d.ts
    
    declare global {
        interface Window {
            /** this is my custom global variable */
            MY_VAR: string
        }
    }
    
    export {}
    ```
    
    ```tsx
    // demo.ts
    
    const myVar = window.MY_VAR
    ```
    

### Executing modular code (for Node applications)

- The syntax for importing modules is different for node
- To fix this, update your `tsconfig.json` to include `"module": "CommonJS"`
    
    ```tsx
    // tsconfig.json
    
    {
        "compilerOptions": {
            "target": "esnext",
            "outDir": "dist",
            "module": "CommonJS" // here!
        },
        "include": [
            "src/**/*"
        ]
    }
    ```