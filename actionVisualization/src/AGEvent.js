/**
 * Created by Zzen1sS
 **/

export class AGEvent {
    constructor(type,opts={}){
        this.type = type
        Object.assign(this,opts)
    }
}

export class AGEventManager{
    constructor(){
        this.events = {

        }
    }



    static getEventManager(){
        if (AGEventManager.eventManager){
            return AGEventManager.eventManager
        }else {
            AGEventManager.eventManager = new AGEventManager()
            return AGEventManager.eventManager
        }
    }

    dispatch(target,event){
        if (event.type in this.events){
            let curTypeEvents = this.events[event.type]
            for(let i=0;i<curTypeEvents.length;i++){
                if (curTypeEvents[i].target === target){
                    curTypeEvents[i].handler && curTypeEvents[i].handler(event)
                }
            }
        }
    }

    register(target,eventType,handler){
        if (eventType in this.events){

        }else{
            this.events[eventType] = []
        }
        this.events[eventType].push({
            target:target,
            handler:handler
        })
    }

    unRegister(target,eventType,handler){
        if (eventType in this.events){
            let curTypeEvents = this.events[eventType]
            for(let i=0;i<curTypeEvents.length;i++){
                if (curTypeEvents[i].target === target && curTypeEvents[i].handler === handler){
                    curTypeEvents.splice(i,1)
                    i--
                }
            }
        }
    }
}
