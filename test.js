let inputArray = [
    { id: 1, name: "name1", value: "value1" },
    { id: 2, name: "name2", value: "value2" },
  ];
  
  let ids = inputArray.map( (item) => item.id);
  let names = inputArray.map((item) => item.name);
  let values = inputArray.map((item) => item.value);
  
  console.log(ids);
  console.log(names);
  console.log(values);

/*
[ 1, 2 ]
[ 'name1', 'name2' ]
[ 'value1', 'value2' ]
*/