import { Set } from "typescript"

export interface Subscribe {
    id: Number,
    subscribeFunc: Function
}

export interface Subscription {
    unsubscribe: Function
}

export class Observable {

    subscribes: Set<Function> = new Set<Function>()
    value: any
    private idGenerator: Generator

    constructor(initialValue?: any) {
        this.idGenerator = generateId()
        this.value = initialValue
    }

    getValue(): any {
        return this.value
    }

    next(newVal: any) {
        this.value = newVal
        this.executeFuncs()
    }

    subscribe(subscribeFunc: Function, isExecuteFunc: Boolean = true): Subscription | undefined {
        if (typeof subscribeFunc !== 'function') {
            console.error('subscribe must get a function')
            return
        }
        const id = this.idGenerator.next().value
        this.subscribes.add(subscribeFunc)
        isExecuteFunc && subscribeFunc(this.value)
        return {
            unsubscribe: () => {
                this.subscribes.delete(subscribeFunc)
            },
        }
    }

    private executeFuncs() {
        this.subscribes.forEach(subscribeFunc => subscribeFunc(this.value))
    }
}


function* generateId() {
    let id = 1
    while (true) {
        yield id++
    }

}




