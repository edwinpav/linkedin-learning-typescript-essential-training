function query<T>(
    items: T[],
    query: {[TProp in keyof T]?: (Function: T[TProp]) => boolean}
    // other solution... (not fully correct)
    // this results in each key's value having a type of either number or string
    // bc T[keyof T] occurs for each key of T for a single key in the Record
    // query: Record<keyof T, (Function: T[keyof T]) => boolean>
) {
    return items.filter(item => {
        // iterate through each of the item's properties
        for (const property of Object.keys(item)) {

            // get the query for this property name
            const propertyQuery = query[property]

            // see if this property value matches the query
            if (propertyQuery && propertyQuery(item[property])) {
                return true
            }
        }

        // nothing matched so return false
        return false
    })
}

const matches = query(
    [
        { name: "Ted", age: 12 },
        { name: "Angie", age: 31 }
    ],
    {
        name: name => name === "Angie",
        age: age => age > 30
    })
