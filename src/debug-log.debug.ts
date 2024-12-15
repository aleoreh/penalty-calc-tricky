// eslint-disable-next-line @typescript-eslint/no-explicit-any
const log = (...data: any) => {
    console.log(...data);
    return <T>(x: T) => x;
};

const Debug = {
    /**
     * Displays a message to the console and returns the transmitted value
     *
     * Assigns a value of `42` to the variable `b`
     * and displays the message **"a = 42"** to the console
     * ```typescript
     * const a = 42;
     * const b = Debug.log("a =", a)(a)
     *```
     *
     * Just displays **"Hello, World!"** to the concole
     *```typescript
     * Debug.log("Hello, World!")
     * ```
     *
     */
    log,
};

export default Debug;
