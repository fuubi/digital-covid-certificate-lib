import {init} from "../../src";

describe("Test the project setup", ( ) => {
    test("Should be ready!", () =>{
        expect(init()).toBe('ready!');
    })
})
