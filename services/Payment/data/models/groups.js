const storeItems = new Map([
    [1, { price: 10000, name: "Learn React Today" }],
    [2, { price: 20000, name: "Learn CSS Today" }],
  ])
const getGroup = (id) => {
    console.log("id",id)
    const g = storeItems.get(Number(id));
    console.log("s",g)
    return g
}
module.exports = {getGroup};