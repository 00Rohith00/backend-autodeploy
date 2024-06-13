const client = {
    department : [ {id:1, name: "one"}, {id:2, name: "two"}, {id:3, name: "three"}]
}

// console.log(client['department']);

let s = false

client['department'].forEach((d)=>{

    if(d.id == 1)
    s = true
})

console.log(s);