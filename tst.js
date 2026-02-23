class Yo{

    field1
    field2

    constructor({
        field1= "1",
        field2= "2"
    } = {}){
        this.field1 = field1
        this.field2 = field2
    }
}



let yo = new Yo()
let yo2 = new Yo({})

console.log("fisr " + JSON.stringify(yo))
console.log(" second " + JSON.stringify(yo2))